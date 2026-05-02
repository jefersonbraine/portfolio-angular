import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { from, switchMap } from 'rxjs';
// IMPORTANTE: Importe o token que criamos no serviço
import { BYPASS_INTERCEPTORS } from '../services/upload.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Auth);

  // 1. VERIFICAÇÃO DE BYPASS: Se o serviço pediu para ignorar, passa direto
  if (req.context.get(BYPASS_INTERCEPTORS)) {
    return next(req);
  }

  // 2. VERIFICAÇÃO DE DESTINO: Só mexe se for para as Functions (Nuvem ou Local)
  const isCloudFunction =
    req.url.includes('cloudfunctions.net') || req.url.includes('localhost:5001');

  if (!isCloudFunction) {
    return next(req);
  }

  const user = auth.currentUser;
  if (!user) {
    return next(req);
  }

  return from(user.getIdToken()).pipe(
    switchMap((token) => {
      const secureReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          'X-Requested-With': 'XMLHttpRequest',
        },
      });
      return next(secureReq);
    }),
  );
};
