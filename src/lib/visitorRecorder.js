const DAY_PREFIX = 'anormalm-signal-';

// A shared promise covers React remounts; a browser lock also covers parallel tabs.
// No browser identifier or visited page is sent to the counting service.
export const createVisitorRecorder = ({ fetcher, storage, endpoint, allowed, paused, locks, now = () => new Date() }) => {
  let pending;
  const record = async () => {
    if (!allowed() || paused()) return false;
    const key = `${DAY_PREFIX}${now().toISOString().slice(0, 10)}`;
    const claim = `pending:${now().getTime()}`;
    try {
      // Without storage we cannot enforce the daily limit, so do not count.
      if (!storage) return false;
      const saved = storage.getItem(key);
      if (saved === '1') return false;
      if (saved?.startsWith('pending:') && Math.abs(now().getTime() - Number(saved.slice(8))) < 15_000) return false;
      storage.setItem(key, claim);
    } catch { return false; }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetcher(endpoint, {
        method: 'POST', credentials: 'omit', referrerPolicy: 'no-referrer', signal: controller.signal,
      });
      if (!response.ok) throw new Error('Counting unavailable');
      storage.setItem(key, '1');
      // Old daily flags have no further purpose; retain only today's flag.
      const obsolete = [];
      for (let index = 0; index < storage.length; index += 1) {
        const candidate = storage.key(index);
        if (/^anormalm-signal-\d{4}-\d{2}-\d{2}$/.test(candidate) && candidate !== key) obsolete.push(candidate);
      }
      obsolete.forEach((candidate) => storage.removeItem(candidate));
      return true;
    } catch {
      try { if (storage.getItem(key) === claim) storage.removeItem(key); } catch { /* Optional storage. */ }
      return false;
    } finally { clearTimeout(timer); }
  };
  return () => {
    if (!pending) {
      pending = Promise.resolve().then(() => locks?.request
        ? locks.request('anormalm-visitor-count', record)
        : record()).catch(() => false).finally(() => { pending = undefined; });
    }
    return pending;
  };
};
