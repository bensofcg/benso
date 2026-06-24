'use client';

import { SWRConfig } from 'swr';
import { ReactNode } from 'react';

const CACHE_KEY = 'swr-cache';

function localStorageProvider(): Map<string, unknown> {
  const map = new Map<string, unknown>();

  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        for (const [key, value] of Object.entries(parsed)) {
          map.set(key, value);
        }
      }
    } catch {
      localStorage.removeItem(CACHE_KEY);
    }

    // Save cache before page unload
    window.addEventListener('beforeunload', () => {
      const obj: Record<string, unknown> = {};
      for (const [key, value] of map.entries()) {
        obj[key] = value;
      }
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(obj));
      } catch {
        // localStorage full or unavailable — ignore
      }
    });
  }

  return map;
}

export function SWRProvider({ children }: { children: ReactNode }) {
  return (
    <SWRConfig
      value={{
        provider: localStorageProvider,
        revalidateOnFocus: false,
        revalidateIfStale: false,
        revalidateOnReconnect: true,
        errorRetryCount: 2,
        dedupingInterval: 60_000,
        keepPreviousData: true,
      }}
    >
      {children}
    </SWRConfig>
  );
}
