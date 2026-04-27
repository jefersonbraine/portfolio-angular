import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, serverTimestamp } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'IMPORT';


@Injectable({
  providedIn: 'root',
})
export class AuditService {
  constructor(private firestore: Firestore, private auth: Auth) { }

  async log(action: AuditAction, entity: string, details?: object): Promise<void> {
    const user = this.auth.currentUser;
    await addDoc(collection(this.firestore, 'audit_logs'), {
      action,
      entity,
      details: details || {},
      uid: user?.uid,
      email: user?.email,
      timestamp: serverTimestamp(),
      userAgent: navigator.userAgent,
    });
  }
}
