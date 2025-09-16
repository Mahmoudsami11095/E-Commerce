import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-verify-reset-code',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './verify-reset-code.component.html',
  styleUrl: './verify-reset-code.component.css'
})
export class VerifyResetCodeComponent {
  private readonly authService = inject(AuthService);
  private readonly toastr = inject(ToastrService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  verifyCodeForm: FormGroup;
  isLoading = false;
  userEmail = '';

  constructor() {
    this.verifyCodeForm = this.fb.group({
      resetCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });

    // Get email from state or localStorage
    const state = history.state;
    this.userEmail = state?.email || localStorage.getItem('resetEmail') || '';
    
    if (!this.userEmail) {
      this.router.navigate(['/forgot-password']);
    }
  }

  onSubmit(): void {
    console.log('Verifying reset code', this.verifyCodeForm.value);
    
    if (this.verifyCodeForm.valid) {
      this.isLoading = true;
      const resetCode = this.verifyCodeForm.get('resetCode')?.value;
      
      this.authService.verifyResetCode(resetCode).subscribe({
        next: (res: any) => {
          console.log('Code verification success:', res);
          this.isLoading = false;
          this.toastr.success('Reset code verified successfully');
          
          // Navigate to reset password page with email
          this.router.navigate(['/reset-password'], { 
            state: { email: this.userEmail, resetCode: resetCode }
          });
        },
        error: (err) => {
          console.log('Code verification error:', err);
          this.isLoading = false;
          this.toastr.error('Invalid reset code. Please try again.');
        }
      });
    } else {
      console.log('Form is invalid');
      this.toastr.error('Please enter a valid 6-digit reset code');
    }
  }

  resendCode(): void {
    if (this.userEmail) {
      this.authService.forgotPassword(this.userEmail).subscribe({
        next: (res: any) => {
          this.toastr.success('Reset code sent again to your email');
        },
        error: (err) => {
          this.toastr.error('Failed to resend reset code');
        }
      });
    }
  }
}
