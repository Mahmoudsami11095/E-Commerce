import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductDetailsService } from './services/product-details.service';
import { Product } from '../../core/models/product.interface';
import { CartService } from '../cart/services/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-details',
  imports: [],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly productDetailsService = inject(ProductDetailsService);
  private readonly cartService = inject(CartService);
  private readonly toastr = inject(ToastrService);
  id:string|null = null;
  productDetails:Product={} as Product;
  ngOnInit(): void {
    this.getProductId();
    this.getProductDetailsData();
  }

  getProductId() {
    const id = this.activatedRoute.paramMap.subscribe( {
      next: (urlParams) => {    
      this.id = String(urlParams.get('id'));
    },
    error: (err) => { console.log(err); },
  });
  }

  getProductDetailsData():void {
      this.productDetailsService.getProductDetails(this.id).subscribe({
        next: (res) => { console.log(res.data); this.productDetails = res.data; },
        error: (err) => { console.log(err); }
  });
}

  addProductItemToCart(id:string):void {
    this.cartService.addProductToCart(id).subscribe({
      next: (res) => { 
        console.log(res);
        if (res?.status === 'success') { this.toastr.success('Added to cart'); }
      },
      error: (err) => { console.log(err); this.toastr.error('Failed to add to cart'); }
    });
  }
  
}
