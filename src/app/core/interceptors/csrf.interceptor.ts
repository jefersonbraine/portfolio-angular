import { HttpInterceptorFn } from '@angular/common/http';
import { BYPASS_INTERCEPTORS } from '../services/upload.service';

export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
  // Se a requisição pediu para ignorar interceptors, passa adiante
  if (req.context.get(BYPASS_INTERCEPTORS)) {
    return next(req);
  }

  // Ignora requisições GET, HEAD e OPTIONS — não precisam de proteção CSRF
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next(req);
  }

  // Não enviamos o header `X-Content-Type-Options` em requests (é um header de resposta)
  const secureReq = req.clone({
    setHeaders: {
      'X-Requested-With': 'XMLHttpRequest', // Header comum para indicar requisições AJAX
    },
  });
  return next(secureReq);
};
