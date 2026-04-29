// functions/src/rate-limit.ts
import { getFirestore } from 'firebase-admin/firestore';

export async function checkRateLimit(uid: string, action: string): Promise<void> {
  const db = getFirestore();
  const ref = db.doc(`rate_limits/${uid}_${action}`);
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const maxCalls = 20;

  await db.runTransaction(async (transaction) => {
    const doc = await transaction.get(ref);

    if (!doc.exists) {
      transaction.set(ref, { firstCall: now, count: 1 });
      return;
    }

    const data = doc.data()!;
    // Se passou a janela de tempo, reinicia o contador
    if (now - data['firstCall'] > windowMs) {
      transaction.set(ref, { firstCall: now, count: 1 });
      return;
    }
    // Se atingiu o limite dentro da janela
    if (data['count'] >= maxCalls) {
      throw new Error('rate_limit_exceeded');
    }

    // incrementa o contador de forma segura
    transaction.update(ref, { count: data['count'] + 1 });
  });

}
