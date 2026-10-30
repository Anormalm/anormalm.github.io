import { createVisitorRecorder } from './visitorRecorder';

const SIGNAL_ENDPOINT = 'https://anormalm-signal-archive.hulifan55555.chatgpt.site/api/signals';
const PAUSE_KEY = 'anormalm-signal-paused';
let memoryPaused = false;

const privacyPreferenceEnabled = () => (
  navigator.globalPrivacyControl === true || navigator.doNotTrack === '1'
);

export const isVisitorSignalPaused = () => {
  try {
    return memoryPaused || localStorage.getItem(PAUSE_KEY) === '1';
  } catch {
    return memoryPaused;
  }
};

export const setVisitorSignalPaused = (paused) => {
  memoryPaused = paused;
  try {
    localStorage.setItem(PAUSE_KEY, paused ? '1' : '0');
  } catch {
    // Privacy preference remains best-effort if browser storage is unavailable.
  }
};

let recorder;
export const recordVisitorSignal = () => {
  if (!recorder) {
    let storage;
    try { storage = window.localStorage; } catch { /* Cannot enforce a daily limit. */ }
    recorder = createVisitorRecorder({
      endpoint: SIGNAL_ENDPOINT, fetcher: window.fetch.bind(window), storage, locks: navigator.locks,
      allowed: () => !import.meta.env.DEV && ['anormalm.com', 'www.anormalm.com', 'anormalm.github.io'].includes(window.location.hostname)
        && !['/visitors', '/node'].includes(window.location.pathname.replace(/\/$/, '')),
      paused: () => privacyPreferenceEnabled() || isVisitorSignalPaused(),
    });
  }
  return recorder();
};

export const fetchVisitorArchive = async (signal) => {
  const response = await fetch(SIGNAL_ENDPOINT, {
    method: 'GET',
    credentials: 'omit',
    cache: 'no-store',
    referrerPolicy: 'no-referrer',
    signal,
  });
  if (!response.ok) throw new Error('Signal archive unavailable');
  return response.json();
};
