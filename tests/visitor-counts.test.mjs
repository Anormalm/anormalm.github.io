import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { DatabaseSync } from 'node:sqlite';
import { readArchive, recordSignal } from '../worker/signalStore.js';
import { createVisitorRecorder } from '../src/lib/visitorRecorder.js';
import { buildVisitorReport, visitorReportCsv } from '../src/lib/visitorReport.js';

const migration = await readFile(new URL('../drizzle/0000_perfect_triton.sql', import.meta.url), 'utf8');
const database = () => {
  const raw = new DatabaseSync(':memory:');
  raw.exec(migration);
  return {
    raw,
    prepare(sql) {
      const statement = raw.prepare(sql);
      const query = { sql, values: [], bind(...values) { this.values = values; return this; },
        all() { return { results: statement.all(...this.values) }; },
        run() { statement.run(...this.values); return { results: [] }; } };
      return query;
    },
    async batch(queries) {
      raw.exec('BEGIN');
      try {
        const results = queries.map((query) => /^\s*SELECT/i.test(query.sql) ? query.all() : query.run());
        raw.exec('COMMIT');
        return results;
      } catch (error) { raw.exec('ROLLBACK'); throw error; }
    },
  };
};
const dayAgo = (days) => new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10);

test('real SQLite archive aggregates country cells by day and enforces the 90-day UTC window', async () => {
  const db = database();
  try {
    const insert = db.raw.prepare('INSERT INTO visitor_signals VALUES (?, ?, ?, ?, ?, ?)');
    insert.run(dayAgo(0), 'SG', 0, 90, 3, 0);
    insert.run(dayAgo(0), 'SG', 30, 90, 2, 0);
    insert.run(dayAgo(1), 'HU', 60, 30, 4, 0);
    insert.run(dayAgo(89), 'XX', 0, 0, 1, 0);
    insert.run(dayAgo(90), 'US', 30, -90, 100, 0);
    insert.run(dayAgo(-1), 'US', 30, -90, 100, 0);
    const archive = await readArchive(db);
    assert.equal(archive.totalSignals, 10);
    assert.equal(archive.countryCount, 2);
    assert.deepEqual(archive.daily, [{ day: dayAgo(89), count: 1 }, { day: dayAgo(1), count: 4 }, { day: dayAgo(0), count: 5 }]);
    assert.equal(archive.points.length, 4);
    assert.ok(Number.isFinite(Date.parse(archive.generatedAt)));
  } finally { db.raw.close(); }
});

test('recording stores coarse aggregates, increments existing cells, and prunes old records', async () => {
  const db = database();
  try {
    db.raw.prepare('INSERT INTO visitor_signals VALUES (?, ?, ?, ?, ?, ?)').run(dayAgo(90), 'US', 30, -90, 2, 0);
    const request = { cf: { country: 'sg', latitude: '1.3521', longitude: '103.8198' } };
    await recordSignal(db, request);
    await recordSignal(db, request);
    const rows = db.raw.prepare('SELECT * FROM visitor_signals').all();
    assert.equal(rows.length, 1);
    assert.equal(rows[0].signal_count, 2);
    assert.equal(rows[0].country_code, 'SG');
    assert.equal(rows[0].latitude_cell, 0);
    assert.equal(rows[0].longitude_cell, 90);
    assert.deepEqual(Object.keys(rows[0]).sort(), ['country_code', 'day', 'latitude_cell', 'longitude_cell', 'signal_count', 'updated_at']);
  } finally { db.raw.close(); }
});

const memoryStorage = () => {
  const data = new Map();
  return { get length() { return data.size; }, key: (index) => [...data.keys()][index], getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value), removeItem: (key) => data.delete(key) };
};
const recorderOptions = (extra = {}) => ({
  fetcher: async () => ({ ok: true }), endpoint: 'https://counter.example/api/signals', storage: memoryStorage(),
  allowed: () => true, paused: () => false, now: () => new Date('2026-10-30T23:59:00Z'), ...extra,
});

test('concurrent mounts and repeated calls send only one daily request without visitor identity or page data', async () => {
  const calls = [];
  const options = recorderOptions({ fetcher: async (...args) => { calls.push(args); return { ok: true }; } });
  const record = createVisitorRecorder(options);
  const first = record();
  assert.equal(record(), first);
  await first;
  assert.equal(await record(), false);
  assert.equal(calls.length, 1);
  assert.equal(calls[0][1].credentials, 'omit');
  assert.equal(calls[0][1].referrerPolicy, 'no-referrer');
  assert.equal(calls[0][1].body, undefined);
  assert.equal(options.storage.getItem('anormalm-signal-2026-10-30'), '1');
});

test('browser locks serialize parallel tabs and recheck the daily flag', async () => {
  let queue = Promise.resolve();
  const locks = { request: (_, fn) => { const result = queue.then(fn); queue = result.catch(() => {}); return result; } };
  let calls = 0;
  const options = recorderOptions({ locks, fetcher: async () => { calls++; return { ok: true }; } });
  await Promise.all([createVisitorRecorder(options)(), createVisitorRecorder(options)()]);
  assert.equal(calls, 1);
});

test('privacy opt-outs, owner dashboard paths, development, and unavailable storage do not count', async () => {
  let calls = 0;
  const fetcher = async () => { calls++; return { ok: true }; };
  for (const extra of [{ paused: () => true }, { allowed: () => false }, { storage: null }, { storage: { getItem() { throw new Error('blocked'); } } }]) {
    assert.equal(await createVisitorRecorder(recorderOptions({ fetcher, ...extra }))(), false);
  }
  assert.equal(calls, 0);
});

test('a short local claim limits tabs without Web Locks and expires after an interrupted request', async () => {
  let calls = 0;
  let now = new Date('2026-10-30T12:00:00Z');
  const options = recorderOptions({ now: () => now, fetcher: async () => { calls++; return { ok: true }; } });
  await Promise.all([createVisitorRecorder(options)(), createVisitorRecorder(options)()]);
  assert.equal(calls, 1);
  options.storage.setItem('anormalm-signal-2026-10-30', `pending:${now.getTime()}`);
  assert.equal(await createVisitorRecorder(options)(), false);
  now = new Date(now.getTime() + 16_000);
  assert.equal(await createVisitorRecorder(options)(), true);
  assert.equal(calls, 2);
});

test('failed recording can retry; the next UTC day counts once and clears old daily flags', async () => {
  let calls = 0;
  let now = new Date('2026-10-30T23:59:00Z');
  const options = recorderOptions({ now: () => now, fetcher: async () => ({ ok: ++calls > 1 }) });
  const record = createVisitorRecorder(options);
  assert.equal(await record(), false);
  assert.equal(await record(), true);
  now = new Date('2026-10-31T00:00:00Z');
  assert.equal(await record(), true);
  assert.equal(options.storage.getItem('anormalm-signal-2026-10-30'), null);
  assert.equal(options.storage.getItem('anormalm-signal-2026-10-31'), '1');
  assert.equal(await record(), false);
  assert.equal(calls, 3);
});

test('report fills missing days, respects rolling boundaries, and sums multiple country cells', () => {
  const now = new Date('2026-10-31T00:30:00Z');
  const report = buildVisitorReport({ daily: [
    { day: '2026-10-31', count: 2 }, { day: '2026-10-25', count: 4 }, { day: '2026-10-24', count: 8 },
    { day: '2026-10-02', count: 16 }, { day: '2026-10-01', count: 32 }, { day: '2026-11-01', count: 100 },
    { day: '2026-10-30', count: -1 }, { day: '2025-01-01', count: 100 },
  ], points: [{ countryCode: 'SG', count: 3 }, { countryCode: 'SG', count: 2 }, { countryCode: 'HU', count: 1 }] }, now);
  assert.equal(report.daily.length, 90);
  assert.equal(report.today, 2);
  assert.equal(report.week, 6);
  assert.equal(report.month, 30);
  assert.equal(report.dailyAverage, 1);
  assert.equal(report.total, 62);
  assert.deepEqual(report.countries, [{ code: 'SG', count: 5 }, { code: 'HU', count: 1 }]);
  assert.equal(report.daily.at(-2).count, 0);
  assert.equal(visitorReportCsv(report.daily.slice(-2)), 'date_utc,counted_visits\r\n2026-10-30,0\r\n2026-10-31,2\r\n');
});

test('an old or malformed archive cannot silently become a zero-visitor dashboard', () => {
  assert.throws(() => buildVisitorReport({ totalSignals: 10 }), /Daily counts unavailable/);
});

test('production security policy permits the exact existing visitor service', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const connect = html.match(/connect-src ([^;]+);/)[1];
  assert.ok(connect.split(/\s+/).includes('https://anormalm-signal-archive.hulifan55555.chatgpt.site'));
  assert.ok(!connect.includes('*'));
});
