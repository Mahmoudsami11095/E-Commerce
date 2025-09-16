import { Component, inject, OnInit } from '@angular/core';
import { CartService } from './services/cart.service';
import { Cart } from './models/cart.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit{
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);
  cartDetails: Cart = {} as Cart;

  ngOnInit(): void {
    this.getCartItems();
  }

  getCartItems(): void {
    this.cartService.getLoggedUserCart().subscribe({
      next: (res) => { console.log(res.data); this.cartDetails = res.data; },
      error: (err) => { console.log(err); }
    });
  }

  removeItem(id:string): void {
    this.cartService.removeSpecficCartItem(id).subscribe({
      next: (res) => { console.log(res); this.cartDetails = res.data; this.cartService.refreshCartCount(); },
      error: (err) => { console.log(err); }
    });
  }

  getTotalPrice() {
    return this.cartDetails.totalCartPrice;
  }

  updateCount(id:string, count:number): void {
    this.cartService.updateCartCount(id, count).subscribe({
      next: (res) => { console.log(res); this.cartDetails = res.data; this.cartService.refreshCartCount(); },
      error: (err) => { console.log(err); }
    });
  }


  proceedToCheckout(): void {
    console.log('Proceeding to payment...');
    this.router.navigate(['/payment']);
  }
}
