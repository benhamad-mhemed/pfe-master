import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {

  registerForm!: FormGroup;
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  // Validator custom appelé à chaque input change
  validatePasswords(): boolean {
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;

    if (!password || !confirmPassword) return true; // pas encore rempli

    if (password !== confirmPassword) {
      this.registerForm.get('confirmPassword')?.setErrors({ mismatch: true });
      return false;
    } else {
      // retirer uniquement mismatch si ça existait
      const errors = this.registerForm.get('confirmPassword')?.errors;
      if (errors) {
        delete errors['mismatch'];
        if (Object.keys(errors).length === 0) {
          this.registerForm.get('confirmPassword')?.setErrors(null);
        } else {
          this.registerForm.get('confirmPassword')?.setErrors(errors);
        }
      }
      return true;
    }
  }
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  onSubmit(): void {
    // on valide les passwords avant d'envoyer
    this.validatePasswords();

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { name, email, password, confirmPassword } = this.registerForm.value;

    const payload = {
      name,
      email,
      password,
      password_confirmation: confirmPassword
    };

    this.authService.register(payload).subscribe({
      next: res => {
        // login automatique après inscription
        this.authService.login({ email, password }).subscribe({
          next: loginRes => {
            this.authService.setToken(loginRes.token);
            this.router.navigate(['/dashboard']);
          },
          error: loginErr => {
            this.error = loginErr.error?.message || 'Erreur lors du login après inscription';
          }
        });
      },
      error: err => {
        this.error = err.error?.message || JSON.stringify(err.error) || 'Erreur lors de l’inscription';
      }
    });
  }
}
