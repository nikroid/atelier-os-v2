import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { seedDemoData } from './utils/backup';
import { cleanupBuiltinTemplatesFromDb } from './utils/defaultTemplates';
import { db } from './db/database';
import { ensureDefaultSettings } from './hooks/useSettings';
import { migrateLegacyImagesToMedia } from './utils/mediaMigration';
import { cleanupOrphanMedia } from './utils/mediaStore';
import {
  APP_BUILD_NUMBER,
  APP_BUILD_TIME,
  APP_CODENAME,
  APP_VERSION,
  getVersionFull,
  getVersionLabel,
} from './version';
import './index.css';

document.documentElement.dataset.atelierVersion = APP_VERSION;
document.documentElement.dataset.atelierCodename = APP_CODENAME;
document.documentElement.dataset.atelierBuild = String(APP_BUILD_NUMBER);
document.documentElement.dataset.atelierBuiltAt = APP_BUILD_TIME;

Object.assign(window, {
  __ATELIER_OS__: {
    version: APP_VERSION,
    codename: APP_CODENAME,
    buildNumber: APP_BUILD_NUMBER,
    build: APP_BUILD_TIME,
    label: getVersionLabel(),
  },
});

console.info(
  `%cAtelier OS%c ${getVersionFull()}`,
  'font-weight:bold;color:#c45d3a',
  'color:inherit',
);
console.info('Vérifier : document.documentElement.dataset ou window.__ATELIER_OS__');

if ('serviceWorker' in navigator) {
  if (import.meta.env.DEV) {
    // Le SW casse le hot-reload Vite (WebSocket) en local
    void navigator.serviceWorker.getRegistrations().then((regs) => {
      regs.forEach((reg) => void reg.unregister());
    });
  } else {
    window.addEventListener('load', () => {
      const swUrl = `${import.meta.env.BASE_URL}sw.js`;
      navigator.serviceWorker.register(swUrl).catch(() => {});
    });
  }
}

function renderApp(): void {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

async function runPostBootTasks(): Promise<void> {
  try {
    await migrateLegacyImagesToMedia();
    await cleanupOrphanMedia();
    await ensureDefaultSettings();
    await cleanupBuiltinTemplatesFromDb(
      () => db.templates.toArray(),
      (id) => db.templates.delete(id),
    );
  } catch (err) {
    console.error('[Atelier OS] Tâches de démarrage en arrière-plan', err);
  }
}

async function boot(): Promise<void> {
  try {
    await seedDemoData();
  } catch (err) {
    console.error('[Atelier OS] seedDemoData', err);
  }
  renderApp();
  void runPostBootTasks();
}

void boot();
