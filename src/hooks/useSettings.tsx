import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { liveQuery } from 'dexie';
import { db, now } from '../db/database';
import { DEFAULT_SETTINGS, type AppMode, type AppSettings } from '../types/settings';

interface SettingsContextValue {
  settings: AppSettings;
  mode: AppMode;
  isGallery: boolean;
  updateSettings: (patch: Partial<AppSettings>) => Promise<void>;
  setMode: (mode: AppMode) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export async function ensureDefaultSettings(): Promise<void> {
  const existing = await db.settings.get('app');
  const merged: AppSettings = {
    ...DEFAULT_SETTINGS,
    mode: existing?.mode ?? DEFAULT_SETTINGS.mode,
    id: 'app',
    updatedAt: now(),
  };
  await db.settings.put(merged);
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const sub = liveQuery(() => db.settings.get('app')).subscribe({
      next: (s) => setSettings(s ?? DEFAULT_SETTINGS),
    });
    return () => sub.unsubscribe();
  }, []);

  const updateSettings = async (patch: Partial<AppSettings>) => {
    const next = { ...settings, ...patch, id: 'app' as const, updatedAt: now() };
    await db.settings.put(next);
  };

  const setMode = async (mode: AppMode) => updateSettings({ mode });

  return (
    <SettingsContext.Provider
      value={{
        settings,
        mode: settings.mode,
        isGallery: settings.mode === 'gallery',
        updateSettings,
        setMode,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
