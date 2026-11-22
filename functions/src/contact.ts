import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { defineSecret, defineString } from 'firebase-functions/params';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { createHash } from 'crypto';import { checkRateLimit } from './rate-limit';

const resendApiKey = defineSecret('RESEND_API_KEY');
// E-mail que RECEBE as mensagens (para a conta gratuita do Resend, deve ser o e-mail da conta)
const contactTo = defineString('CONTACT_TO_EMAIL');

const PRIORITIES = ['', 'baixa', 'media', 'alta'];
const PHONE_PATTERN = /^(\+?55\s?)?(\(?\d{2}\)?\s?)?\d{4,5}-?\d{4}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown, max: number): string {
  if (typeof value !== 'string') return '';
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, max);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export const sendContactMessage = onCall(
  {
    cors: [
      'https://www.jefersonbraineleal.dev',
      'https://jefersonbraineleal.dev',
      'http://localhost:4200',
    ],
    secrets: [resendApiKey],
  },
  async (request) => {
    const data = request.data ?? {};

    // Honeypot: bots preenchem, humanos não veem o campo
    if (data.website) {
      return { ok: true };
    }

    const name = clean(data.name, 80);
    const email = clean(data.email, 160).toLowerCase();
    const phone = clean(data.phone, 20);
    const priority = clean(data.priority, 10);
    const subject = clean(data.subject, 120);
    const message = clean(data.message, 2000);

    if (
      name.length < 2 ||
      subject.length < 3 ||
      message.length < 10 ||
      !EMAIL_PATTERN.test(email) ||
      (phone && !PHONE_PATTERN.test(phone)) ||
      !PRIORITIES.includes(priority)
    ) {
      throw new HttpsError('invalid-argument', 'Dados inválidos.');
    }

    // Limite por IP: 5 mensagens a cada 15 minutos
    const ip = request.rawRequest.ip ?? 'unknown';
    const ipHash = createHash('sha256').update(ip).digest('hex').slice(0, 32);
    try {
      await checkRateLimit(ipHash, 'contact', 5);
    } catch {
      throw new HttpsError('resource-exhausted', 'Muitas mensagens. Tente novamente mais tarde.');
    }

    // 1. Sempre grava no Firestore (fonte da verdade)
    await getFirestore().collection('messages').add({
      name,
      email,
      phone,
      priority,
      subject,
      message,
      read: false,
      createdAt: FieldValue.serverTimestamp(),
    });

    // 2. Notifica por e-mail (falha aqui não perde a mensagem)
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey.value()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Portfólio <onboarding@resend.dev>',
          to: [contactTo.value()],
          reply_to: email,
          subject: `[Portfólio] ${subject}`,
          html: `
            <p><strong>Nome:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            <p><strong>Telefone:</strong> ${escapeHtml(phone || '-')}</p>
            <p><strong>Prioridade:</strong> ${escapeHtml(priority || '-')}</p>
            <hr />
            <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
          `,
        }),
      });
      if (!res.ok) {
        console.error('Resend falhou:', res.status, await res.text());
      }
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
    }

    return { ok: true };
  },
);
