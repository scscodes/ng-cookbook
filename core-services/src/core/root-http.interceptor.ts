import { HttpInterceptorFn } from '@angular/common/http';

export const rootHttpInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.headers.has('Content-Type')) {
    const clonedReq = req.clone({ setHeaders: { 'Content-Type': 'application/json' } });
    return next(clonedReq);
  }
  return next(req);
};
