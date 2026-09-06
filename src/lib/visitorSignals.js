const SIGNAL_ENDPOINT = 'https://anormalm-signal-archive.hulifan55555.chatgpt.site/api/signals';
const PAUSE_KEY = 'anormalm-signal-paused';

const getDailyKey = () => `anormalm-signal-${new Date().toISOString().slice(0, 10)}`;

const privacyPreferenceEnabled = () => (
  navigator.globalPrivacyControl === true || navigator.doNotTrack === '1'
);

export const isVisitorSignalPaused = () => {
  try {
    return localStorage.getItem(PAUSE_KEY) === '1';
  } catch {
    return false;
  }
};

export const setVisitorSignalPaused = (paused) => {
  try {
    localStorage.setItem(PAUSE_KEY, paused ? '1' : '0');
  } catch {
    // Privacy preference remains best-effort if browser storage is unavailable.
  }
};

export const recordVisitorSignal = async () => {
  if (import.meta.env.DEV || privacyPreferenceEnabled() || isVisitorSignalPaused()) return;

  const dailyKey = getDailyKey();
  try {
    if (localStorage.getItem(dailyKey) === '1') return;
    const response = await fetch(SIGNAL_ENDPOINT, {
      method: 'POST',
      referrerPolicy: 'no-referrer',
    });
    if (response.ok) localStorage.setItem(dailyKey, '1');
  } catch {
    // Analytics must never interrupt the site experience.
  }
};

export const fetchVisitorArchive = async (signal) => {
  const response = await fetch(SIGNAL_ENDPOINT, {
    method: 'GET',
    cache: 'no-store',
    referrerPolicy: 'no-referrer',
    signal,
  });
  if (!response.ok) throw new Error('Signal archive unavailable');
  return response.json();
};
