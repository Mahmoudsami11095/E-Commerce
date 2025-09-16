import { Component, OnInit, inject, ViewChild, ElementRef } from '@angular/core';
import { BrandsService } from '../../core/services/brands/brands.service';
import { ProductsService } from '../../core/services/products/products.service';
import { CardComponent } from '../../shared/components/card/card.component';
import { Product } from '../../core/models/product.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-brands',
  imports: [CardComponent],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css'
})
export class BrandsComponent implements OnInit {
  private readonly brandsService = inject(BrandsService);
  private readonly productsService = inject(ProductsService);
  private readonly router = inject(Router);

  isLoading: boolean = false;
  errorMessage: string = '';
  brands: Array<{ _id: string; name: string; image: string; slug: string }> = [];
  products: Product[] = [];
  productsLoading: boolean = false;

  @ViewChild('brandProducts') brandProductsRef!: ElementRef<HTMLDivElement>;

  ngOnInit(): void {
    this.loadBrands();
  }

  loadBrands(): void {
    this.isLoading = true;
    this.brandsService.getAllBrands().subscribe({
      next: (res) => { this.brands = res.data || []; this.isLoading = false; },
      error: (err) => { this.isLoading = false; this.errorMessage = 'Failed to load brands'; console.log(err); }
    });
  }

  viewBrand(brandId: string): void {
    this.productsLoading = true;
    this.productsService.getAllProducts(1, undefined, undefined, undefined, brandId).subscribe({
      next: (res: any) => { 
        this.products = res.data || []; 
        this.productsLoading = false; 
        setTimeout(() => {
          this.brandProductsRef?.nativeElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      },
      error: (err) => { this.productsLoading = false; console.log(err); }
    });
  }
}
