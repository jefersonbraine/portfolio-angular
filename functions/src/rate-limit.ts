// functions/src/rate-limit.ts
import { getFirestore } from 'firebase-admin/firestore';

export async function checkRateLimit(uid: string, action: string): Promise<void> {
  const ref = getFirestore().doc(`rate_limits/${uid}_${action}`);
  const doc = await ref.get();
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const maxCalls = 20;

  if (doc.exists) {
    const data = doc.data()!;

    if (now - data['firstCall'] > windowMs) {
      await ref.set({ firstCall: now, count: 1 });
      return;
    }

    if (data['count'] >= maxCalls) {
      throw new Error('rate_limit_exceeded');
    }

    await ref.update({ count: data['count'] + 1 });
  } else {
    await ref.set({ firstCall: now, count: 1 });
  }
}
