import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {

  email = '';
  password = '';

  constructor(private auth: AuthService, private router: Router) { }

  login() {
    this.auth.login({ email: this.email, password: this.password }).subscribe(
      (res: any) => {
        this.auth.setToken(res.token);
        this.router.navigate(['/dashboard']);
      },
      err => alert('Email ou mot de passe incorrect')
    );
  }

}

