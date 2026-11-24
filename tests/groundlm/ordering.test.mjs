import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';

const root = new URL('../../public/misgraph/', import.meta.url);
const read = path => readFileSync(new URL(path, root), 'utf8');
const downloads = 'downloads/ordering-panel-v1/';
const summary = JSON.parse(read(downloads + 'summary.json'));
const html = read('ordering.html');

test('ordering panel scores and coverage agree with the static study page', () => {
  const models = summary.configurations.filter(row => row.status === 'complete');
  const missing = summary.configurations.filter(row => row.status !== 'complete');
  assert.equal(models.length, 19);
  assert.equal(missing.length, 7);
  assert.equal(new Set(models.map(row => row.developer)).size, 16);
  assert.equal(models.reduce((sum, row) => sum + 2 * row.pairs, 0), 228);
  assert.equal(summary.eligible_new_responses, 216);
  assert.equal(summary.reused_responses, 12);
  for (const row of missing) {
    assert.equal(row.pairs, 0);
    assert.equal(row.bfs, null);
    assert.equal(row.frontier, null);
    assert.ok(html.includes(`<li><b>${row.model}</b> · ${row.status}</li>`));
  }
  for (const [arm, method] of [['bfs', 'graphdo-bfs'], ['frontier', 'edge-frontier']]) {
    const exact = models.reduce((sum, row) => sum + row[arm].exact, 0);
    const cutoff = models.reduce((sum, row) => sum + row[arm].cutoff, 0);
    assert.equal(exact, summary.totals[method].exact);
    assert.equal(cutoff, summary.totals[method].cutoff);
    assert.ok(html.includes(`<td>${exact} / 114</td><td>${summary.totals[method].wrong}</td><td>${cutoff}</td>`));
  }
  for (const model of models) {
    const name = model.model + (model.reused ? ' <small>(reused)</small>' : '');
    assert.ok(html.includes(`<th scope="row">${name}</th><td>${model.bfs.exact} / 6</td><td>${model.frontier.exact} / 6</td>`));
  }
});

test('ordering study links, public graph identifiers, and download hashes resolve', () => {
  for (const page of ['index.html', 'history.html', 'analysis.html', 'triangle.html']) {
    assert.ok(read(page).includes('href="ordering.html"'), page);
  }
  assert.equal(new Set(summary.graphs.map(([, task, size]) => `${task}/${size}`)).size, 6);
  for (const [graph] of summary.graphs) {
    assert.ok(existsSync(new URL(`data/hard-v1/${graph}.json`, root)), graph);
  }
  const checksums = JSON.parse(read(downloads + 'manifest.json'));
  assert.deepEqual(Object.keys(checksums).sort(), ['scores.csv', 'summary.json']);
  for (const [file, digest] of Object.entries(checksums)) {
    const content = read(downloads + file);
    assert.equal(createHash('sha256').update(content).digest('hex'), digest);
    assert.doesNotMatch(content, /reasoning_details|api_key|"authorization"|"choices"|sk-or-v1-/);
    assert.ok(html.includes(`href="${downloads}${file}"`));
  }
  const csv = read(downloads + 'scores.csv').trim().split('\n').slice(1);
  assert.equal(csv.length, summary.configurations.length);
  assert.equal(csv.filter(row => row.endsWith(',,,,')).length, 7);
});
