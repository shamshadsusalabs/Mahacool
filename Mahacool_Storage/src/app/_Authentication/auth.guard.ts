import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router); // Inject Router service

  // Check if user object exists in localStorage
  const user = localStorage.getItem('user');

  if (user) {
    // User is authenticated, allow access
    return true;
  } else {
    // User is not authenticated, redirect to login page
    router.navigate(['']); // Change '/login' to your actual login route
    return false;
  }
};
