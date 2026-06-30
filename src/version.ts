import {
  APP_BUILD_NUMBER,
  APP_BUILD_TIME,
  APP_CODENAME,
  APP_VERSION,
} from 'virtual:atelier-build';

export { APP_BUILD_NUMBER, APP_BUILD_TIME, APP_CODENAME, APP_VERSION };

export function getVersionLabel(): string {
  return `${APP_VERSION} · ${APP_CODENAME} · #${APP_BUILD_NUMBER}`;
}

export function getVersionFull(): string {
  return `${getVersionLabel()} — ${APP_BUILD_TIME}`;
}
