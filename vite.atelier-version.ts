import { existsSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import type { Plugin } from 'vite';

const BUILD_INFO_PATH = resolve('build-info.json');
const VIRTUAL_ID = 'virtual:atelier-build';
const RESOLVED_ID = '\0' + VIRTUAL_ID;

interface BuildInfo {
  buildNumber: number;
  builtAt: string;
}

function readBuildInfo(): BuildInfo {
  if (!existsSync(BUILD_INFO_PATH)) {
    return { buildNumber: 0, builtAt: new Date().toISOString() };
  }
  return JSON.parse(readFileSync(BUILD_INFO_PATH, 'utf-8')) as BuildInfo;
}

function bumpBuildInfo(): BuildInfo {
  const prev = readBuildInfo();
  const next: BuildInfo = {
    buildNumber: prev.buildNumber + 1,
    builtAt: new Date().toISOString(),
  };
  writeFileSync(BUILD_INFO_PATH, `${JSON.stringify(next, null, 2)}\n`);
  return next;
}

function readPackageMeta() {
  const pkg = JSON.parse(readFileSync('package.json', 'utf-8')) as {
    version: string;
    config?: { codename?: string };
  };
  return {
    version: pkg.version,
    codename: pkg.config?.codename ?? 'dev',
  };
}

function moduleSource(info: BuildInfo, meta: ReturnType<typeof readPackageMeta>): string {
  return [
    `export const APP_VERSION = ${JSON.stringify(meta.version)};`,
    `export const APP_CODENAME = ${JSON.stringify(meta.codename)};`,
    `export const APP_BUILD_NUMBER = ${info.buildNumber};`,
    `export const APP_BUILD_TIME = ${JSON.stringify(info.builtAt)};`,
  ].join('\n');
}

export function atelierVersionPlugin(): Plugin {
  let buildInfo = readBuildInfo();
  let meta = readPackageMeta();
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  const reloadVirtualModule = (server: import('vite').ViteDevServer) => {
    const mod = server.moduleGraph.getModuleById(RESOLVED_ID);
    if (!mod) return;
    server.moduleGraph.invalidateModule(mod);
    server.ws.send({ type: 'full-reload' });
  };

  return {
    name: 'atelier-version',
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
    },
    load(id) {
      if (id === RESOLVED_ID) return moduleSource(buildInfo, meta);
    },
    buildStart() {
      buildInfo = bumpBuildInfo();
      meta = readPackageMeta();
    },
    configureServer(server) {
      buildInfo = bumpBuildInfo();
      meta = readPackageMeta();

      server.watcher.on('change', (file) => {
        if (!file.includes('/src/') && !file.includes('\\src\\')) return;
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          buildInfo = bumpBuildInfo();
          meta = readPackageMeta();
          reloadVirtualModule(server);
        }, 600);
      });
    },
    transformIndexHtml(html) {
      const label = `${meta.version} · ${meta.codename} · #${buildInfo.buildNumber}`;
      return html
        .replace(
          '<html lang="fr">',
          `<html lang="fr" data-atelier-version="${meta.version}" data-atelier-build="${buildInfo.buildNumber}" data-atelier-built-at="${buildInfo.builtAt}">`,
        )
        .replace(
          '</head>',
          `    <meta name="atelier-os-version" content="${label}" />\n    <meta name="atelier-os-build" content="${buildInfo.builtAt}" />\n  </head>`,
        );
    },
    writeBundle() {
      const label = `${meta.version} · ${meta.codename} · #${buildInfo.buildNumber}`;
      writeFileSync(
        'dist/version.json',
        `${JSON.stringify(
          {
            version: meta.version,
            codename: meta.codename,
            buildNumber: buildInfo.buildNumber,
            label,
            builtAt: buildInfo.builtAt,
          },
          null,
          2,
        )}\n`,
      );

      const swPath = resolve('dist/sw.js');
      if (existsSync(swPath)) {
        const sw = readFileSync(swPath, 'utf-8').replace(
          /const CACHE = '[^']+'/,
          `const CACHE = 'atelier-os-v${meta.version}-b${buildInfo.buildNumber}'`,
        );
        writeFileSync(swPath, sw);
      }
    },
    transform(code, id) {
      if (id.endsWith('/public/sw.js') || id.endsWith('\\public\\sw.js')) {
        return code.replace(
          /const CACHE = '[^']+'/,
          `const CACHE = 'atelier-os-v${meta.version}-b${buildInfo.buildNumber}'`,
        );
      }
    },
  };
}
