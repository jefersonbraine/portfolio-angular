import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { from, switchMap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Auth);

  // Aplica apenas nas chamadas para suas Cloud Functions
  const isCloudFunction = req.url.includes('cloudfunctions.net');
  if (!isCloudFunction) {
    return next(req);
  }

  const user = auth.currentUser;
  if (!user) {
    // Se não tiver usuário, deixa passar sem token (pode ser bloqueado pela função)
    return next(req);
  }

  // Se tiver usuário, pega o token e adiciona no header
  return from(user.getIdToken()).pipe(
    switchMap(token => {
      const secureReq = req.clone({
        setHeaders: {
          'Authorization': `Bearer ${token}`,
          'X-Requested-With': 'XMLHttpRequest' // Ajuda a evitar bloqueios CORS
        }
      });
      return next(secureReq);
    })
  )
};
