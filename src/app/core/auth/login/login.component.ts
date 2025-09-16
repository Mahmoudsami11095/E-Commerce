import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, RouterLink } from '@angular/router';
import { InputComponent } from "../../../shared/components/input/input.component";
import { Subscription } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, InputComponent, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
private readonly authService = inject(AuthService)
private readonly router = inject(Router)
private readonly fb = inject(FormBuilder)
private readonly cookieService = inject(CookieService)

  msgError: string = '';
  isLoading: boolean = false;
  subscription:Subscription = new Subscription();


/*   loginForm: FormGroup = new FormGroup(
    {
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.pattern(/^\w{6,}$/)]),
  } ); */

  loginForm!: FormGroup 

    ngOnInit(){
    this.initForm();
  }

  initForm(){
    this.loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(/^\w{6,}$/)]],
  });
  }


  login() {
      if (this.loginForm.valid)
      {
        this.isLoading=true;
        this.subscription.unsubscribe();
        console.log( this.loginForm);
        console.log(this.loginForm.value);
        this.subscription = this.authService.loginForm(this.loginForm.value).subscribe({
          next: (response:any) => {
            console.log(response);
                    this.isLoading=false;

            if (response.message == 'success') {
              //alert('You are logined successfully');
              //navigate to login
              this.msgError = '';
              console.log(this.msgError );
              // Save cookies
              this.cookieService.set('token', response.token);
              this.authService.decodeToken();

              setTimeout(() => {
                this.router.navigate(['/home']);
              }, 1000);

              this.loginForm.reset();
            } else {
              alert('Something went wrong');
            }
          },
          error: (err) => {
            this.isLoading=false;
            this.msgError = err.error.message;
            console.log(err);
            //alert('Error: ' + err.error.message);
          }
        })
      }
  } 



}
