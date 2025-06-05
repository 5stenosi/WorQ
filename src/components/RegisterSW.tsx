'use client';
import { useEffect } from 'react';

export default function RegisterSW() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('Service Worker registrato', reg))
        .catch((err) => console.error('SW registration failed', err));
    }
  }, []);

  return null;
}
