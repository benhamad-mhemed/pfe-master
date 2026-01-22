import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {

  user: any = null;
  error = '';

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.userProfile().subscribe({
      next: res => {
        this.user = res;
      },
      error: err => {
        this.error = 'Impossible de récupérer le profil';
      }
    });
  }
}


