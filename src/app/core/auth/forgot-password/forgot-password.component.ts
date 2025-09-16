import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  private readonly authService = inject(AuthService);
  private readonly toastr = inject(ToastrService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  forgotPasswordForm: FormGroup;
  isLoading = false;

  constructor() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    console.log('Form submitted', this.forgotPasswordForm.value);
    console.log('Form valid:', this.forgotPasswordForm.valid);
    
    if (this.forgotPasswordForm.valid) {
      this.isLoading = true;
      const email = this.forgotPasswordForm.get('email')?.value;
      console.log('Sending email:', email);
      
      this.authService.forgotPassword(email).subscribe({
        next: (res: any) => {
          console.log('Success response:', res);
          this.isLoading = false;
          this.toastr.success('Reset code sent to your email');
          
          // Store email for the next step
          localStorage.setItem('resetEmail', email);
          
          // Navigate to verify reset code page
          this.router.navigate(['/verify-reset-code'], { 
            state: { email: email }
          });
        },
        error: (err) => {
          console.log('Error response:', err);
          this.isLoading = false;
          this.toastr.error('Failed to send reset code');
        }
      });
    } else {
      console.log('Form is invalid');
      this.toastr.error('Please enter a valid email address');
    }
  }
}
