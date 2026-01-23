import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  sidebarOpen = true;

  constructor(public authService: AuthService, private router: Router) {}

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  logregister() {
    this.authService.logout();
    this.router.navigate(['/register']);
  }
  logprofile() {
    
    this.router.navigate(['/profile']);
  }
}
