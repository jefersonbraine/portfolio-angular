// src/app/core/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { map, take } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export const authGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  return authState(auth).pipe(
    take(1),
    map((user) => {
      if (!user) {
        // Redireciona para login em vez de 404
        router.navigate([`${environment.adminPath}/login`]);
        return false;
      }

      if (user.uid !== environment.adminUid) {
        auth.signOut();
        router.navigate(['/404']);
        return false;
      }

      return true;
    }),
  );
};
