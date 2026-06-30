import { describe, expect, it } from 'vitest';
import { buildRawMime, mimeToBase64Url } from './gmailSend';

describe('buildRawMime', () => {
  it('builds BCC message for group send', () => {
    const mime = buildRawMime({
      subject: 'Invitation',
      body: 'Bonjour,\n\nCordialement,',
      bcc: ['a@example.com', 'b@example.com'],
    });
    expect(mime).toContain('To: undisclosed-recipients:;');
    expect(mime).toContain('Bcc: a@example.com, b@example.com');
    expect(mime).toContain('Content-Type: text/plain; charset=UTF-8');
    expect(mime).toContain('Subject: Invitation');
    expect(mime).toMatch(/\r\n\r\n/);
  });

  it('uses To for single recipient', () => {
    const mime = buildRawMime({
      subject: 'Hello',
      body: 'Hi',
      to: ['solo@example.com'],
    });
    expect(mime).toContain('To: solo@example.com');
    expect(mime).not.toContain('Bcc:');
  });

  it('encodes accented subject as UTF-8 base64', () => {
    const mime = buildRawMime({
      subject: 'Invitation — Exposition',
      body: 'Test',
      to: ['a@example.com'],
    });
    expect(mime).toMatch(/Subject: =\?UTF-8\?B\?/);
    expect(mime).not.toContain('Subject: Invitation — Exposition');
  });

  it('encodes body as base64', () => {
    const mime = buildRawMime({
      subject: 'S',
      body: 'Ligne 1\nLigne 2',
      to: ['a@example.com'],
    });
    const bodyPart = mime.split('\r\n\r\n')[1];
    expect(bodyPart).toBeTruthy();
    expect(atob(bodyPart!.replace(/\r\n/g, ''))).toBe('Ligne 1\nLigne 2');
  });

  it('builds multipart message with attachment', () => {
    const mime = buildRawMime({
      subject: 'Dossier',
      body: 'Bonjour',
      to: ['a@example.com'],
      attachments: [
        {
          filename: 'catalogue.pdf',
          mimeType: 'application/pdf',
          base64: btoa('%PDF-test'),
        },
      ],
    });
    expect(mime).toContain('Content-Type: multipart/mixed; boundary=');
    expect(mime).toContain('Content-Disposition: attachment; filename="catalogue.pdf"');
    expect(mime).toContain('Content-Type: application/pdf; filename="catalogue.pdf"');
    expect(mime).toContain(btoa('%PDF-test'));
  });
});

describe('mimeToBase64Url', () => {
  it('produces URL-safe base64 without padding', () => {
    const encoded = mimeToBase64Url('hello');
    expect(encoded).not.toContain('+');
    expect(encoded).not.toContain('/');
    expect(encoded).not.toMatch(/=$/);
  });
});
