import type { AppBackup } from '../types';
import { db, now } from '../db/database';
import { DEFAULT_SETTINGS } from '../types/settings';
import { isBuiltinTemplate } from './templateCatalog';
import { normalizeTemplate } from './templatePages';

export async function importBackupFromData(data: AppBackup): Promise<{ counts: Record<string, number> }> {
  if (!data.artists || !data.works || !data.contacts || !data.exhibitions) {
    throw new Error('Fichier de sauvegarde invalide');
  }

  const preserveSettings = await db.settings.get('app');

  await db.transaction(
    'rw',
    [db.artists, db.works, db.contacts, db.exhibitions, db.templates, db.mailTemplates, db.settings],
    async () => {
      await Promise.all([
        db.artists.clear(),
        db.works.clear(),
        db.contacts.clear(),
        db.exhibitions.clear(),
        db.templates.clear(),
        db.mailTemplates.clear(),
      ]);
      await db.artists.bulkAdd(data.artists);
      await db.works.bulkAdd(data.works);
      await db.contacts.bulkAdd(data.contacts);
      await db.exhibitions.bulkAdd(data.exhibitions);
      if (data.templates?.length) {
        const userTemplates = data.templates
          .filter((t) => !isBuiltinTemplate(t))
          .map((t) => normalizeTemplate(t));
        if (userTemplates.length) await db.templates.bulkAdd(userTemplates);
      }
      if (data.mailTemplates?.length) {
        await db.mailTemplates.bulkAdd(data.mailTemplates);
      }
      await db.settings.put({
        ...DEFAULT_SETTINGS,
        ...(data.settings ?? {}),
        ...(preserveSettings ?? {}),
        id: 'app',
        mode: preserveSettings?.mode ?? data.settings?.mode ?? DEFAULT_SETTINGS.mode,
        updatedAt: now(),
      });
    },
  );

  return {
    counts: {
      artistes: data.artists.length,
      oeuvres: data.works.length,
      contacts: data.contacts.length,
      expositions: data.exhibitions.length,
      modeles: data.templates?.length ?? 0,
    },
  };
}

export async function exportBackup(): Promise<AppBackup> {
  const [artists, works, contacts, exhibitions, templates, mailTemplates, settings] = await Promise.all([
    db.artists.toArray(),
    db.works.toArray(),
    db.contacts.toArray(),
    db.exhibitions.toArray(),
    db.templates.toArray(),
    db.mailTemplates.toArray(),
    db.settings.toArray(),
  ]);

  return {
    version: '1.3',
    exportedAt: new Date().toISOString(),
    artists,
    works,
    contacts,
    exhibitions,
    templates,
    mailTemplates,
    settings: settings[0],
  };
}

export async function downloadBackup(): Promise<void> {
  const backup = await exportBackup();
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `atelier-os-backup-${new Date().toISOString().slice(0, 10)}.artdb`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function importBackup(file: File): Promise<{ counts: Record<string, number> }> {
  const text = await file.text();
  const data = JSON.parse(text) as AppBackup;
  return importBackupFromData(data);
}

export async function seedDemoData(): Promise<void> {
  const count = await db.artists.count();
  if (count > 0) return;

  const ts = new Date().toISOString();
  const artistId = 'artist_demo';

  await db.artists.add({
    id: artistId,
    nom: 'Nicolas Labrunye',
    bio_fr:
      "Artiste plasticien, Nicolas Labrunye explore les frontières entre nature et technologie à travers des installations immersives et des œuvres sur toile.",
    bio_en:
      'Visual artist exploring the boundaries between nature and technology through immersive installations and paintings.',
    site: 'https://nicolaslabrunye.fr',
    instagram: '@nicolaslabrunye',
    email: 'contact@example.com',
    photo: '',
    createdAt: ts,
    updatedAt: ts,
  });

  await db.works.bulkAdd([
    {
      id: 'work_001',
      ref: 'ART-2026-001',
      titre: 'Le Vagabond',
      artisteId: artistId,
      annee: 2026,
      technique: 'Huile sur toile',
      dimensions: '120 × 80 cm',
      prix: 2500,
      description: 'Une figure solitaire traversant un paysage onirique.',
      images: [],
      statut: 'disponible',
      certificat: true,
      createdAt: ts,
      updatedAt: ts,
    },
    {
      id: 'work_002',
      ref: 'ART-2026-002',
      titre: 'Forêt Algorithmique',
      artisteId: artistId,
      annee: 2025,
      technique: 'Acrylique et encre sur papier',
      dimensions: '70 × 50 cm',
      prix: 1200,
      description: 'Arbres générés par des processus computationnels.',
      images: [],
      statut: 'disponible',
      certificat: true,
      createdAt: ts,
      updatedAt: ts,
    },
  ]);

  await db.contacts.bulkAdd([
    {
      id: 'contact_001',
      nom: 'Dupont',
      prenom: 'Jean',
      categorie: 'journaliste',
      email: 'jean.dupont@artpress.fr',
      telephone: '+33 6 12 34 56 78',
      organisation: 'Art Press',
      notes: 'Spécialisé art contemporain',
      createdAt: ts,
      updatedAt: ts,
    },
    {
      id: 'contact_002',
      nom: 'Martin',
      prenom: 'Sophie',
      categorie: 'galeriste',
      email: 'sophie@galerie-exemple.fr',
      telephone: '+33 1 42 00 00 00',
      organisation: 'Galerie Exemple',
      notes: '',
      createdAt: ts,
      updatedAt: ts,
    },
  ]);

  await db.exhibitions.add({
    id: 'expo_001',
    titre: 'Automne 2026',
    lieu: 'Atelier collectif, Paris',
    date_debut: '2026-09-15',
    date_fin: '2026-10-30',
    texte_curatorial:
      "Cette exposition réunit des œuvres qui interrogent notre rapport au vivant à l'ère numérique.",
    artisteId: artistId,
    oeuvreIds: ['work_001', 'work_002'],
    createdAt: ts,
    updatedAt: ts,
  });
}
