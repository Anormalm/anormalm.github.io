const ARCHIVE_DAYS = 90;

const normalizeCountryCode = (value) => {
  const code = String(value || '').toUpperCase();
  return /^[A-Z]{2}$/.test(code) ? code : 'XX';
};

const quantizeCoordinate = (value, step, minimum, maximum) => {
  const coordinate = Number(value);
  if (!Number.isFinite(coordinate)) return 0;
  return Math.max(minimum, Math.min(maximum, Math.round(coordinate / step) * step));
};

const readSignal = (request) => ({
  countryCode: normalizeCountryCode(request.cf?.country),
  latitudeCell: quantizeCoordinate(request.cf?.latitude, 30, -60, 60),
  longitudeCell: quantizeCoordinate(request.cf?.longitude, 30, -180, 180),
});

export const recordSignal = async (db, request) => {
  const day = new Date().toISOString().slice(0, 10);
  const updatedAt = Date.now();
  const { countryCode, latitudeCell, longitudeCell } = readSignal(request);

  const upsert = db.prepare(`
    INSERT INTO visitor_signals (
      day, country_code, latitude_cell, longitude_cell, signal_count, updated_at
    ) VALUES (?, ?, ?, ?, 1, ?)
    ON CONFLICT (day, country_code, latitude_cell, longitude_cell)
    DO UPDATE SET
      signal_count = signal_count + 1,
      updated_at = excluded.updated_at
  `).bind(day, countryCode, latitudeCell, longitudeCell, updatedAt);

  const prune = db.prepare(`
    DELETE FROM visitor_signals
    WHERE day < date('now', ?)
  `).bind(`-${ARCHIVE_DAYS - 1} days`);

  await db.batch([upsert, prune]);
};

export const readArchive = async (db) => {
  const result = await db.prepare(`
    SELECT
      country_code AS countryCode,
      latitude_cell AS latitude,
      longitude_cell AS longitude,
      SUM(signal_count) AS count,
      MAX(day) AS lastSeen
    FROM visitor_signals
    WHERE day >= date('now', ?)
    GROUP BY country_code, latitude_cell, longitude_cell
    ORDER BY count DESC, lastSeen DESC
  `).bind(`-${ARCHIVE_DAYS - 1} days`).all();

  const points = (result.results || []).map((row) => ({
    countryCode: row.countryCode,
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    count: Number(row.count),
    lastSeen: row.lastSeen,
  }));

  return {
    windowDays: ARCHIVE_DAYS,
    totalSignals: points.reduce((total, point) => total + point.count, 0),
    countryCount: new Set(points.map((point) => point.countryCode).filter((code) => code !== 'XX')).size,
    points,
  };
};
