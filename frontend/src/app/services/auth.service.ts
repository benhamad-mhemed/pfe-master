import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id?: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8000/api/auth'; // adapte si nécessaire

  constructor(private http: HttpClient) { }

  // Inscription
  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  // Login pour récupérer le token après inscription
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }

  // Récupérer le profil
  userProfile(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/user-profile`);
  }

  // Mettre à jour le profil
  updateProfile(data: { name: string; email: string }): Observable<User> {
    return this.http.patch<User>(`${this.baseUrl}/profile`, data); // ou patch<User> selon ton backend
  }

  // Stockage du token
  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // si tu stockes l’utilisateur
  }
}
