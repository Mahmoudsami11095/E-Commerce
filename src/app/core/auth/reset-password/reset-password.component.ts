import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  private readonly authService = inject(AuthService);
  private readonly toastr = inject(ToastrService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  resetPasswordForm: FormGroup;
  isLoading = false;
  userEmail = '';
  resetCode = '';

  constructor() {
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    // Get email and resetCode from state
    const state = history.state;
    this.userEmail = state?.email || '';
    this.resetCode = state?.resetCode || '';
    
    if (!this.userEmail || !this.resetCode) {
      this.router.navigate(['/forgot-password']);
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      if (confirmPassword?.errors?.['passwordMismatch']) {
        delete confirmPassword.errors['passwordMismatch'];
        if (Object.keys(confirmPassword.errors).length === 0) {
          confirmPassword.setErrors(null);
        }
      }
    }
    
    return null;
  }

  onSubmit(): void {
    console.log('Resetting password', this.resetPasswordForm.value);
    
    if (this.resetPasswordForm.valid) {
      this.isLoading = true;
      const newPassword = this.resetPasswordForm.get('newPassword')?.value;
      
      this.authService.resetPassword(this.userEmail, newPassword).subscribe({
        next: (res: any) => {
          console.log('Password reset success:', res);
          this.isLoading = false;
          this.toastr.success('Password reset successfully! You can now login with your new password.');
          
          // Clear any stored reset data
          localStorage.removeItem('resetEmail');
          
          // Navigate to login page
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.log('Password reset error:', err);
          this.isLoading = false;
          this.toastr.error('Failed to reset password. Please try again.');
        }
      });
    } else {
      console.log('Form is invalid');
      this.toastr.error('Please check your password and try again.');
    }
  }
}
