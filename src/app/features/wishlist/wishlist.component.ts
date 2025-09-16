import { Component, inject, OnInit } from '@angular/core';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { CardComponent } from '../../shared/components/card/card.component';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent implements OnInit {
  private readonly wishlistService = inject(WishlistService);
  wishlistIds: string[] = [];
  wishlistProducts: any[] = [];

  ngOnInit(): void {
    this.wishlistService.refreshWishlist();
    this.wishlistService.wishlistIds$.subscribe(ids => this.wishlistIds = ids);
    this.wishlistService.wishlistProducts$.subscribe(products => this.wishlistProducts = products);
  }
}



