import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';

import { Auth } from '../services/auth';

export const adminGuard: CanMatchFn = () => {
  const authService = inject(Auth);
  const router = inject(Router);

  if (authService.esAdmin()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
