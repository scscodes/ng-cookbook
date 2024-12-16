import { HttpInterceptorFn } from '@angular/common/http';

export const rootHttpInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};
