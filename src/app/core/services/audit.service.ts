import { inject, Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, addDoc, collection, serverTimestamp } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class AuditService {
  private readonly firestore = inject(Firestore);
  private readonly auth = inject(Auth);

  async log(action: string, entity: string, details: Record<string, unknown>): Promise<void> {
    try {
      await addDoc(collection(this.firestore, 'audit_logs'), {
        action,
        entity,
        details,
        actorUid: this.auth.currentUser?.uid ?? null,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Erro ao registrar auditoria:', error);
    }
  }
}
