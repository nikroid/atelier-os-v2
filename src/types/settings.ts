export type AppMode = 'artist' | 'gallery';

export interface AppSettings {
  id: 'app';
  mode: AppMode;
  updatedAt: string;
}

export const DEFAULT_SETTINGS: AppSettings = {
  id: 'app',
  mode: 'artist',
  updatedAt: new Date().toISOString(),
};

export const MODE_LABELS: Record<AppMode, { title: string; works: string; artists: string }> = {
  artist: {
    title: 'Mode Artiste',
    works: 'Mes œuvres',
    artists: 'Mon profil',
  },
  gallery: {
    title: 'Mode Galerie',
    works: 'Collection',
    artists: 'Artistes',
  },
};
