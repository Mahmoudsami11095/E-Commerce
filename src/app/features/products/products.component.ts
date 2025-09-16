import { Component, inject, OnInit } from '@angular/core';
import { CardComponent } from "../../shared/components/card/card.component";
import { Product } from '../../core/models/product.interface';
import { ProductsService } from '../../core/services/products/products.service';
import {NgxPaginationModule} from 'ngx-pagination'; // <-- import the module
import { SearchPipe } from '../../shared/pipes/search-pipe';
import { FormsModule } from '@angular/forms';

// Define the structure of the pagination metadata
// to be used in the component and shall be moved to a separate file later
interface RootObject {
  currentPage: number;
  numberOfPages: number;
  limit: number;
  nextPage: number;
  results: number;
}

@Component({
  selector: 'app-products',
  imports: [CardComponent, NgxPaginationModule, SearchPipe, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})

export class ProductsComponent implements OnInit {
private readonly productsService = inject(ProductsService);
    productList: Product[] = [];
    searchTerm: string = '';
    pageDetails : RootObject = {
        currentPage: 1,
        numberOfPages: 1,
        limit: 10,
        nextPage: 1,
        results: 0
    };

    ngOnInit(): void {
        this.getAllProductsData();
    }

    getAllProductsData(pageNumber:number = 1): void {
      this.productsService.getAllProducts(pageNumber).subscribe({
        next: (res:any) => {
          console.log(res);
          this.productList = res.data;

          this.pageDetails.limit = res.metadata.limit;
          this.pageDetails.currentPage = res.metadata.currentPage;
          this.pageDetails.results = res.results;
        },
        error: (error) => {
          console.log(error);
        },
      });
    }

}

