export interface MailTemplate {
  id: string;
  nom: string;
  subject: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export interface GmailAuth {
  id: 'gmail';
  email: string;
  accessToken: string;
  expiresAt: number;
  updatedAt: string;
}

export const GMAIL_SCOPES = [
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/userinfo.email',
  'openid',
].join(' ');
