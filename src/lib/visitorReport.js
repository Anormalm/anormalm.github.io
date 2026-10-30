const DAY = 86_400_000;

export const buildVisitorReport = (archive, now = new Date()) => {
  if (!Array.isArray(archive?.daily)) throw new Error('Daily counts unavailable');
  const today = new Date(now.toISOString().slice(0, 10) + 'T00:00:00Z');
  const counts = new Map();
  for (const row of archive.daily) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(row.day) || !Number.isSafeInteger(row.count) || row.count < 0) continue;
    counts.set(row.day, (counts.get(row.day) || 0) + row.count);
  }
  const daily = Array.from({ length: 90 }, (_, index) => {
    const day = new Date(today.getTime() - (89 - index) * DAY).toISOString().slice(0, 10);
    return { day, count: counts.get(day) || 0 };
  });
  const sum = (days) => daily.slice(-days).reduce((total, row) => total + row.count, 0);
  const countries = new Map();
  for (const point of archive.points || []) {
    if (!/^[A-Z]{2}$/.test(point.countryCode) || !Number.isSafeInteger(point.count) || point.count < 0) continue;
    countries.set(point.countryCode, (countries.get(point.countryCode) || 0) + point.count);
  }
  return {
    daily, today: sum(1), week: sum(7), month: sum(30), dailyAverage: sum(30) / 30,
    total: sum(90), countries: [...countries].map(([code, count]) => ({ code, count })).sort((a, b) => b.count - a.count),
  };
};

export const visitorReportCsv = (rows) => 'date_utc,counted_visits\r\n' + rows.map(({ day, count }) => `${day},${count}`).join('\r\n') + '\r\n';
