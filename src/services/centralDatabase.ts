import { AppStateData } from '../types/uasa';
import { buildInitialState } from '../data/sampleData';

const STORAGE_KEY = 'sk_batandok_uasa_data_v2026';
const CLIENT_ID = 'client_' + Math.random().toString(36).slice(2) + '_' + Date.now();

let localCache: AppStateData = (() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.year === 2026) return parsed;
    }
  } catch (e) {
    // ignore
  }
  return buildInitialState();
})();

type Listener = (data: AppStateData) => void;
const listeners: Set<Listener> = new Set();
let isConnected = false;
let eventSource: EventSource | null = null;
let saveDebounceTimer: any = null;

export function getCachedData(): AppStateData {
  return localCache;
}

export function subscribeToDatabase(listener: Listener): () => void {
  listeners.add(listener);
  // Send current cached data immediately
  listener(localCache);

  if (!eventSource) {
    initSSE();
  }

  return () => {
    listeners.delete(listener);
  };
}

function initSSE() {
  try {
    eventSource = new EventSource('/api/events');

    eventSource.onopen = () => {
      isConnected = true;
    };

    eventSource.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'INIT' || msg.type === 'UPDATE') {
          const payload = msg.payload;
          // Ignore self-echo so typing is never interrupted
          if (payload && payload.senderClientId === CLIENT_ID) {
            return;
          }

          const incomingData = payload?.data ? payload.data : payload;
          if (incomingData && typeof incomingData === 'object') {
            localCache = incomingData;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(localCache));
            listeners.forEach((fn) => fn(localCache));
          }
        }
      } catch (err) {
        console.error('Error handling SSE data:', err);
      }
    };

    eventSource.onerror = () => {
      isConnected = false;
      fetchFallback();
    };
  } catch (err) {
    console.error('SSE not supported or failed:', err);
    fetchFallback();
  }
}

async function fetchFallback() {
  try {
    const res = await fetch('/api/data');
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        localCache = json.data;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(localCache));
        listeners.forEach((fn) => fn(localCache));
        isConnected = true;
      }
    }
  } catch (err) {
    // Offline / fallback to localStorage
  }
}

export async function saveCentralData(updatedData: AppStateData): Promise<boolean> {
  // Update memory and localStorage IMMEDIATELY (0ms latency for UI)
  localCache = updatedData;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(localCache));

  // Debounce the network write to avoid flooding the server and SSE connections on rapid keypresses
  if (saveDebounceTimer) {
    clearTimeout(saveDebounceTimer);
  }

  return new Promise((resolve) => {
    saveDebounceTimer = setTimeout(async () => {
      try {
        const res = await fetch('/api/data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data: updatedData,
            clientId: CLIENT_ID,
          }),
        });
        resolve(res.ok);
      } catch (err) {
        console.warn('Failed to push to server, saved locally:', err);
        resolve(false);
      }
    }, 250); // 250ms debounce
  });
}

export function isCloudConnected(): boolean {
  return isConnected;
}
