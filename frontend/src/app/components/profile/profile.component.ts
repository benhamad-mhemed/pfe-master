import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {

  user: User | null = null;
  profileForm!: FormGroup;
  editMode = false;
  error = '';

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.authService.userProfile().subscribe({
      next: (res: User) => {
        this.user = res;
        this.initForm();
      },
      error: (err: any) => {
        this.error = 'Impossible de récupérer le profil';
      }
    });
  }

  initForm(): void {
    if (!this.user) return;
    this.profileForm = this.fb.group({
      name: [this.user.name, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: [this.user.email, [Validators.required, Validators.email]]
    });
  }
goToDashboard(): void {
  this.router.navigate(['/dashboard']);
}
  updateProfile(): void {
    if (!this.profileForm.valid) return;

    const updatedData = this.profileForm.value;
    this.authService.updateProfile(updatedData).subscribe({
      next: (res: User) => {
        this.user = res;
        this.editMode = false;
      },
      error: (err: any) => {
        this.error = 'Erreur lors de la mise à jour';
      }
    });
  }

  cancelEdit(): void {
    this.editMode = false;
    if (this.user) {
      this.profileForm.patchValue({
        name: this.user.name,
        email: this.user.email
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
