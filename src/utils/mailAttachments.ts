/** Taille max des pièces jointes (avant encodage MIME). Gmail ~25 Mo/message. */
export const MAX_MAIL_ATTACHMENTS_BYTES = 20 * 1024 * 1024;

export interface MailAttachmentDraft {
  id: string;
  filename: string;
  mimeType: string;
  blob: Blob;
  source: 'file' | 'pdf';
}

export function formatAttachmentSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

export function totalAttachmentBytes(attachments: MailAttachmentDraft[]): number {
  return attachments.reduce((sum, a) => sum + a.blob.size, 0);
}

export function assertAttachmentsWithinLimit(attachments: MailAttachmentDraft[]): void {
  const total = totalAttachmentBytes(attachments);
  if (total > MAX_MAIL_ATTACHMENTS_BYTES) {
    throw new Error(
      `Pièces jointes trop volumineuses (${formatAttachmentSize(total)}). Limite : ${formatAttachmentSize(MAX_MAIL_ATTACHMENTS_BYTES)}.`,
    );
  }
}

export async function blobToBase64(blob: Blob): Promise<string> {
  try {
    const buffer = await blob.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  } catch {
    throw new Error(
      'Impossible de lire une pièce jointe. Réajoutez le fichier ou regénérez le PDF.',
    );
  }
}

/** Copie un Blob/File en mémoire pour éviter les erreurs de permission au moment de l’envoi. */
export async function cloneBlob(blob: Blob, mimeType?: string): Promise<Blob> {
  const buffer = await blob.arrayBuffer();
  return new Blob([buffer], { type: mimeType || blob.type || 'application/octet-stream' });
}

export async function attachmentsToMimeParts(
  attachments: MailAttachmentDraft[],
): Promise<{ filename: string; mimeType: string; base64: string }[]> {
  assertAttachmentsWithinLimit(attachments);
  return Promise.all(
    attachments.map(async (a) => ({
      filename: a.filename,
      mimeType: a.mimeType || 'application/octet-stream',
      base64: await blobToBase64(a.blob),
    })),
  );
}
