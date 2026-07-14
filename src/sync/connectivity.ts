import { useEffect, useState } from 'react';

/**
 * navigator.onLine only reflects the network interface, not real reachability
 * to Firestore. This hook drives the UI banner instantly; the actual sync
 * gate is the timeout-raced write in syncService.trySync.
 */
export function useOnlineStatus(): boolean {
  const [online, setOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return online;
}
