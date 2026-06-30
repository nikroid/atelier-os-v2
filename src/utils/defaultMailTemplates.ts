import type { MailTemplate } from '../types/mail';

export const DEFAULT_MAIL_TEMPLATES: Omit<MailTemplate, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    nom: 'Invitation exposition',
    subject: 'Invitation — Exposition',
    body: 'Bonjour,\n\nJe vous invite à découvrir ma prochaine exposition.\n\nCordialement,',
  },
  {
    nom: 'Envoi catalogue',
    subject: 'Catalogue — [Titre exposition]',
    body: 'Bonjour,\n\nVeuillez trouver ci-joint le catalogue de mon exposition.\n\nBien cordialement,',
  },
  {
    nom: 'Dossier de presse',
    subject: 'Dossier de presse',
    body: 'Bonjour,\n\nJe vous transmets le dossier de presse en pièce jointe.\n\nCordialement,',
  },
  {
    nom: 'Prise de contact galerie',
    subject: 'Présentation de mon travail',
    body: 'Bonjour,\n\nJe me permets de vous contacter pour vous présenter mon travail artistique.\n\nCordialement,',
  },
];
