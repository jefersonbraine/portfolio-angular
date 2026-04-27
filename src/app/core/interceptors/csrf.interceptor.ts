import { HttpInterceptorFn } from '@angular/common/http';

export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
  // Ignora requisições GET, HEAD e OPTIONS — não precisam de proteção CSRF
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next(req);
  }

  const secureReq = req.clone({
    setHeaders: {
      'X-Requested-With': 'XMLHttpRequest', // Header comum para indicar requisições AJAX
      'X-Content-Type-Options': 'nosniff', // Previne que o navegador tente adivinhar o tipo de conteúdo
    }
  });
  return next(secureReq);
};
