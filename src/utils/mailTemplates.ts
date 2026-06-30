import { db, now, uid } from '../db/database';
import { DEFAULT_MAIL_TEMPLATES } from './defaultMailTemplates';

export async function ensureDefaultMailTemplates(): Promise<void> {
  const count = await db.mailTemplates.count();
  if (count > 0) return;

  const ts = now();
  await db.mailTemplates.bulkAdd(
    DEFAULT_MAIL_TEMPLATES.map((tpl) => ({
      id: uid('mailtpl'),
      ...tpl,
      createdAt: ts,
      updatedAt: ts,
    })),
  );
}
