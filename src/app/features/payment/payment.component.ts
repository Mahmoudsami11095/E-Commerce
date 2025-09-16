import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../cart/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './payment.component.html'
})
export class PaymentComponent implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly toastr = inject(ToastrService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  paymentForm: FormGroup;
  isLoading = false;
  cartTotal = 0;
  cartItems = 0;
  customerName = '';

  constructor() {
    this.paymentForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/)]],
      expiryDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cvc: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
      cardName: ['', [Validators.required]],
      country: ['Egypt', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadCartData();
    this.loadCustomerData();
  }

  loadCartData(): void {
    this.cartService.getLoggedUserCart().subscribe({
      next: (res: any) => {
        this.cartTotal = res?.data?.totalCartPrice || 0;
        this.cartItems = res?.data?.products?.length || 0;
      },
      error: (err) => {
        console.log('Error loading cart:', err);
      }
    });
  }

  loadCustomerData(): void {
    const token = this.authService.decodeToken();
    if (token && (token as any).name) {
      this.customerName = (token as any).name;
    } else {
      this.customerName = 'Customer';
    }
  }

  formatCardNumber(event: any): void {
    let value = event.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    if (formattedValue.length > 19) {
      formattedValue = formattedValue.substr(0, 19);
    }
    this.paymentForm.patchValue({ cardNumber: formattedValue });
  }

  formatExpiryDate(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    this.paymentForm.patchValue({ expiryDate: value });
  }

  onSubmit(): void {
    console.log('Processing payment', this.paymentForm.value);
    
    if (this.paymentForm.valid) {
      this.isLoading = true;
      
      // Simulate payment processing
      setTimeout(() => {
        this.isLoading = false;
        this.toastr.success('Payment successful! Your order has been placed.');
        
        // Clear cart after successful payment
        this.cartService.getLoggedUserCart().subscribe({
          next: (res: any) => {
            if (res?.data?.products) {
              res.data.products.forEach((item: any) => {
                this.cartService.removeSpecficCartItem(item._id).subscribe();
              });
            }
          }
        });
        
        // Navigate to success page or home
        this.router.navigate(['/home']);
      }, 2000);
    } else {
      console.log('Form is invalid');
      this.toastr.error('Please check your payment information and try again.');
    }
  }

  getTotalPrice(): string {
    return `EGP ${this.cartTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  }
}
