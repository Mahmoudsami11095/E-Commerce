import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { jwtDecode } from "jwt-decode";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly cookieService = inject(CookieService);
  private readonly router = inject(Router);

  registerForm(data: object) {
    return this.httpClient.post(environment.baseUrl + 'auth/signup', data);
  }

  loginForm(data: object) {
    return this.httpClient.post(environment.baseUrl + 'auth/signin', data);
  }

  forgotPassword(email: string) {
    return this.httpClient.post(environment.baseUrl + 'auth/forgotPasswords', { email });
  }

  verifyResetCode(resetCode: string) {
    return this.httpClient.post(environment.baseUrl + 'auth/verifyResetCode', { resetCode });
  }

  resetPassword(email: string, newPassword: string) {
    return this.httpClient.put(environment.baseUrl + 'auth/resetPassword', { email, newPassword });
  }

  logout() {
    this.cookieService.delete('token');
    this.router.navigate(['/login']);
  }

  decodeToken() {  
    let token; 
    try{
    token = jwtDecode(this.cookieService.get('token'));
    console.log(token);
    }
    catch (error) {
      this.logout();
    }
    return token;
  }
}
