import { liveQuery } from 'dexie';
import { useEffect, useState } from 'react';
import { db } from '../db/database';
import type { GmailAuth } from '../types/mail';
import { connectGmail, disconnectGmail, isGmailConfigured } from '../utils/gmailAuth';

export function useGmailAuth() {
  const [auth, setAuth] = useState<GmailAuth | undefined>();
  const [connecting, setConnecting] = useState(false);
  const [connectError, setConnectError] = useState<string | null>(null);

  useEffect(() => {
    const sub = liveQuery(() => db.gmailAuth.get('gmail')).subscribe({
      next: setAuth,
      error: (err) => console.error(err),
    });
    return () => sub.unsubscribe();
  }, []);

  const connect = async () => {
    setConnecting(true);
    setConnectError(null);
    try {
      return await connectGmail();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Connexion Gmail échouée';
      setConnectError(message);
      throw err;
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = async () => {
    await disconnectGmail();
  };

  const isConnected = Boolean(auth && auth.expiresAt > Date.now());
  const isExpired = Boolean(auth && auth.expiresAt <= Date.now());

  return {
    auth,
    isConfigured: isGmailConfigured(),
    isConnected,
    isExpired,
    connecting,
    connectError,
    connect,
    disconnect,
  };
}
