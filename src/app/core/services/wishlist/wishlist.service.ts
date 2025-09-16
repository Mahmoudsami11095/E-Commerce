import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { CookieService } from 'ngx-cookie-service';
import { Product } from '../../models/product.interface';

interface WishlistApiResponse {
  status: string;
  message?: string;
  data?: { _id: string }[] | { _id: string };
}

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private readonly httpClient = inject(HttpClient);
  private readonly cookieService = inject(CookieService);

  private wishlistIds = new Set<string>();
  private wishlistProducts: Product[] = [];
  private wishlistIdsSubject = new Subject<string[]>();
  private wishlistProductsSubject = new Subject<Product[]>();
  readonly wishlistIds$ = this.wishlistIdsSubject.asObservable();
  readonly wishlistProducts$ = this.wishlistProductsSubject.asObservable();

  private get authHeaders() {
    return { headers: { token: this.cookieService.get('token') } } as const;
  }

  refreshWishlist(): void {
    this.httpClient.get<WishlistApiResponse>(environment.baseUrl + 'wishlist', this.authHeaders)
      .subscribe((res: any) => {
        const products = (res?.data || []) as Product[];
        this.wishlistProducts = products;
        this.wishlistIds = new Set(products.map((p: Product) => (p as any)._id || (p as any).id));
        this.wishlistProductsSubject.next(this.wishlistProducts);
        this.wishlistIdsSubject.next(Array.from(this.wishlistIds));
      });
  }

  addToWishlist(productId: string) {
    return this.httpClient.post<WishlistApiResponse>(environment.baseUrl + 'wishlist', { productId }, this.authHeaders);
  }

  removeFromWishlist(productId: string) {
    return this.httpClient.delete<WishlistApiResponse>(environment.baseUrl + 'wishlist/' + productId, this.authHeaders);
  }

  isInWishlist(productId: string): boolean {
    return this.wishlistIds.has(productId);
  }
}


