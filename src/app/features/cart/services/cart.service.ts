import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly httpClient = inject(HttpClient);
  private readonly cookieService = inject(CookieService);
  myHeaders: object =  {headers: {token: this.cookieService.get('token')}};
  
  // Cart count state management
  cartCount = 0;

  addProductToCart(id:string):Observable<any> {
    return this.httpClient.post(environment.baseUrl + 'cart', 
      {productId: id}, this.myHeaders);
  }
  
  getLoggedUserCart():Observable<any> {
    return this.httpClient.get(environment.baseUrl + 'cart', this.myHeaders);
  }

  removeSpecficCartItem(id:string):Observable<any> {
    return this.httpClient.delete(environment.baseUrl + 'cart/' + id, this.myHeaders);
  }

  updateCartCount(id:string, count:number):Observable<any> {
    return this.httpClient.put(environment.baseUrl + 'cart/' + id, {count: count}, this.myHeaders);
  }

  refreshCartCount(): void {
    this.getLoggedUserCart().subscribe({
      next: (res) => {
        const totalItems = res?.data?.products?.reduce((sum: number, item: any) => sum + item.count, 0) || 0;
        this.cartCount = totalItems;
      },
      error: (err) => console.log(err)
    });
  }
}
