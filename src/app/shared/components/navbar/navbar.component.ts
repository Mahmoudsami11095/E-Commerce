import { Component, inject, Input, OnInit } from '@angular/core';
import { FlowbiteService } from '../../../core/services/flowbite.service';
import { initFlowbite } from 'flowbite';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { WishlistService } from '../../../core/services/wishlist/wishlist.service';
import { CartService } from '../../../features/cart/services/cart.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  constructor(private flowbiteService: FlowbiteService) {}
  private readonly authService = inject(AuthService);
  private readonly wishlistService = inject(WishlistService);
  private readonly cartService = inject(CartService);

  @Input({required: true}) isLogin!: boolean;
  wishlistCount = 0;
  
  get cartCount() {
    return this.cartService.cartCount;
  }

  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });
    
    this.wishlistService.wishlistIds$.subscribe(ids => {
      this.wishlistCount = ids.length;
    });
    
    if (this.isLogin) {
      this.wishlistService.refreshWishlist();
      this.cartService.refreshCartCount();
    }
  }

  signOut(): void {
    this.authService.logout();
  }
  
} 


