import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private readonly httpClient = inject(HttpClient);

  getAllCategories():Observable<any> {
    return this.httpClient.get(environment.baseUrl + 'categories');
  }

  getSubcategoriesByCategory(categoryId: string): Observable<any> {
    const params = new HttpParams().set('category', categoryId);
    return this.httpClient.get(environment.baseUrl + 'subcategories', { params });
  }
}
