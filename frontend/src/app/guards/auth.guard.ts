import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const token = this.authService.getToken(); // récupère le token depuis le service
    if (token) {
      return true; // utilisateur connecté
    } else {
      this.router.navigate(['/login']); // redirige vers login si non connecté
      return false;
    }
  }
}
