import { Component, inject, Input } from '@angular/core';
import { Product } from '../../../core/models/product.interface';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, LowerCasePipe, SlicePipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { TermPipe } from '../../pipes/term-pipe';
import { CartService } from '../../../features/cart/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { WishlistService } from '../../../core/services/wishlist/wishlist.service';

@Component({
  selector: 'app-card',
  imports: [RouterLink, TitleCasePipe, CurrencyPipe, TermPipe],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @Input({required : true}) product: Product ={} as Product;
  private readonly cartService = inject(CartService);
  private readonly toastr = inject(ToastrService);
  private readonly wishlistService = inject(WishlistService);

  addProductItemToCart(id:string):void {
    this.cartService.addProductToCart(id).subscribe({
      next: (res) => { console.log(res);
        if(res.status == 'success') {this.toastr.success(res.message); this.cartService.refreshCartCount();} },
      error: (err) => { console.log(err); }
    });
  }

  toggleWishlist(event: Event, productId: string): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.wishlistService.isInWishlist(productId)) {
      this.wishlistService.removeFromWishlist(productId).subscribe({
        next: () => { this.toastr.info('Removed from wishlist'); this.wishlistService.refreshWishlist(); },
        error: (err) => console.log(err)
      });
    } else {
      this.wishlistService.addToWishlist(productId).subscribe({
        next: () => { this.toastr.success('Added to wishlist'); this.wishlistService.refreshWishlist(); },
        error: (err) => console.log(err)
      });
    }
  }

  isInWishlist(productId: string): boolean {
    return this.wishlistService.isInWishlist(productId);
  }
}
