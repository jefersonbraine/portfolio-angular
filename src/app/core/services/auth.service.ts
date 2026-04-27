import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  Auth,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  onIdTokenChanged,
  user
} from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly ADMIN_UID = environment.adminUid;
  currentUser$!: Observable<any>; // ← ! diz ao TypeScript que será inicializado no constructor

  constructor(
    private auth: Auth,
    private router: Router,
  ) {
    this.currentUser$ = user(this.auth); // ← inicializa aqui, depois que auth existe

    // Monitora token — desloga se UID não for o seu
    onIdTokenChanged(this.auth, async (firebaseUser) => {
      if (firebaseUser && firebaseUser.uid !== this.ADMIN_UID) {
        await this.logout();
      }
    });
  }

  async loginWithGoogle(): Promise<void> {
    const provides = new GoogleAuthProvider();
    const result = await signInWithPopup(this.auth, provides);

    // Dupla verificação — bloqueia qualquer Google account que não seja a sua
    if (result.user.uid !== this.ADMIN_UID) {
      await signOut(this.auth);
      throw new Error('Acesso negado');
    }

    this.router.navigate([environment.adminPath]);
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    this.router.navigate(['/404']);
  }

  isLoggedIn(): Observable<any> {
    return this.currentUser$;
  }

  async getToken(): Promise<string | null> {
    const firebaseUser = await this.auth.currentUser;
    if (!firebaseUser) return null;
    return firebaseUser.getIdToken();
  }
}
