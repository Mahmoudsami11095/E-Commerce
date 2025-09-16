import { Component, OnInit, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { Router } from '@angular/router';
import { ProductsService } from '../../core/services/products/products.service';
import { CardComponent } from '../../shared/components/card/card.component';
import { Product } from '../../core/models/product.interface';

@Component({
  selector: 'app-categories',
  imports: [CommonModule, CardComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit {
  private readonly categoriesService = inject(CategoriesService);
  private readonly router = inject(Router);
  private readonly productsService = inject(ProductsService);

  isLoading: boolean = false;
  errorMessage: string = '';
  categories: Array<{ _id: string; name: string; image: string; slug: string }> = [];
  subcategories: Array<{ _id: string; name: string; slug: string; category: string }> = [];
  selectedCategoryId: string | null = null;
  subcatsLoading: boolean = false;

  @ViewChild('subcats') subcatsRef!: ElementRef<HTMLDivElement>;

  // products shown below categories
  products: Product[] = [];
  productsLoading: boolean = false;

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories(): void {
    this.isLoading = true;
    this.categoriesService.getAllCategories().subscribe({
      next: (res) => {
        this.categories = res.data || [];
        this.isLoading = false;
        this.errorMessage = '';
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'Failed to load categories';
        console.log(err);
      }
    });
  }

  viewCategory(categoryId: string): void {
    // show subcategories and allow filter
    this.selectedCategoryId = categoryId;
    this.subcatsLoading = true;
    this.categoriesService.getSubcategoriesByCategory(categoryId).subscribe({
      next: (res) => { 
        this.subcategories = res.data || []; 
        this.subcatsLoading = false;
        // scroll to subcategory section after DOM updates
        setTimeout(() => {
          this.subcatsRef?.nativeElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      },
      error: (err) => { this.subcatsLoading = false; console.log(err); }
    });

    // load products for this category on same page
    this.loadProducts({ categoryId: categoryId });
  }

  viewSubcategory(subcategoryId: string): void {
    // show products filtered by subcategory on same page
    this.loadProducts({ categoryId: this.selectedCategoryId || undefined, subcategoryId });
  }

  private loadProducts({ categoryId, subcategoryId }: { categoryId?: string; subcategoryId?: string }): void {
    this.productsLoading = true;
    this.productsService.getAllProducts(1, categoryId, undefined, subcategoryId).subscribe({
      next: (res: any) => { this.products = res.data || []; this.productsLoading = false; },
      error: (err) => { this.productsLoading = false; console.log(err); }
    });
  }
}
