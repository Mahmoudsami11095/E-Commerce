import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './core/layouts/auth-layout/auth-layout.component';
import { BlankLayoutComponent } from './core/layouts/blank-layout/blank-layout.component';
import { LoginComponent } from './core/auth/login/login.component';
import { RegisterComponent } from './core/auth/register/register.component';
import { ForgotPasswordComponent } from './core/auth/forgot-password/forgot-password.component';
import { VerifyResetCodeComponent } from './core/auth/verify-reset-code/verify-reset-code.component';
import { ResetPasswordComponent } from './core/auth/reset-password/reset-password.component';
import { HomeComponent } from './features/home/home.component';
import { CartComponent } from './features/cart/cart.component';
import { ProductsComponent } from './features/products/products.component';
import { BrandsComponent } from './features/brands/brands.component';
import { CategoriesComponent } from './features/categories/categories.component';
import { DetailsComponent } from './features/details/details.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { PaymentComponent } from './features/payment/payment.component';
import { NotfoundComponent } from './features/notfound/notfound.component';
import { authGuard } from './core/guards/auth-guard';
import { isLoggedGuard } from './core/guards/is-logged-guard';
import { WishlistComponent } from './features/wishlist/wishlist.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '', component:AuthLayoutComponent, canActivate: [isLoggedGuard], children: [
        { path: 'login', component:LoginComponent, title: 'Login Page' },
        { path: 'register', component:RegisterComponent, title: 'Register Page' },
        { path: 'forgot-password', component:ForgotPasswordComponent, title: 'Forgot Password Page' },
        { path: 'verify-reset-code', component:VerifyResetCodeComponent, title: 'Verify Reset Code Page' },
        { path: 'reset-password', component:ResetPasswordComponent, title: 'Reset Password Page' },
]},
    { path: '', component:BlankLayoutComponent, canActivate: [authGuard], children: [
        { path: 'home', component:HomeComponent, title: 'Home Page' },
        { path: 'cart', component:CartComponent, title: 'Cart Page' },
        { path: 'wishlist', component:WishlistComponent, title: 'Wishlist Page' },
        { path: 'products', component:ProductsComponent, title: 'Products Page' },
        { path: 'brands', component:BrandsComponent, title: 'Brands Page' },
        { path: 'categories', component:CategoriesComponent, title: 'Cacategoriesrt Page' },
        { path: 'details/:slug/:id', component:DetailsComponent, title: 'details Page' },
        { path: 'details/:id', component:DetailsComponent, title: 'details Page' },
        { path: 'checkout', component:CheckoutComponent, title: 'Checkout Page' },
        { path: 'payment', component:PaymentComponent, title: 'Payment Page' },
]},
    { path: '**', component:NotfoundComponent, title: 'Not Found Page' }
];
