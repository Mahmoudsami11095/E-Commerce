import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  //injection of HttpClient and other dependencies can be done here
  private httpClient = inject(HttpClient);
  getAllProducts(pageNumber:number = 1, categoryId?: string, search?: string, subcategoryId?: string, brandId?: string) {
    let params = new HttpParams().set('page', pageNumber);
    if (categoryId) params = params.set('category', categoryId);
    if (search) params = params.set('search', search);
    if (subcategoryId) params = params.set('subcategory', subcategoryId);
    if (brandId) params = params.set('brand', brandId);
    return this.httpClient.get(environment.baseUrl + 'products', { params });
  }
}
