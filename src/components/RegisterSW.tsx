'use client';
import { useEffect } from 'react';

// RegisterSW registers the service worker for PWA/offline support
export default function RegisterSW() {
  useEffect(() => {
    // Register the service worker if supported by the browser
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('Service Worker registration successful', reg))
        .catch((err) => console.error('Service Worker registration failed', err));
    }
  }, []);

  // This component does not render anything
  return null;
}
