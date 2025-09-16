import { Product } from '../../core/models/product.interface';
import { ProductsService } from './../../core/services/products/products.service';
import { Component, inject, OnInit } from '@angular/core';
import { CardComponent } from "../../shared/components/card/card.component";
import { MainSliderComponent } from "./components/main-slider/main-slider.component";
import { PopularProductsComponent } from "./components/popular-products/popular-products.component";
import { PopularCategoriesComponent } from "./components/popular-categories/popular-categories.component";

@Component({
  selector: 'app-home',
  imports: [MainSliderComponent, PopularProductsComponent, PopularCategoriesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
