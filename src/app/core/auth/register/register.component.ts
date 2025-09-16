import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { InputComponent } from "../../../shared/components/input/input.component";

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, InputComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  private readonly authService = inject(AuthService)
  private readonly router = inject(Router)

  msgError: string = '';
  isLoading: boolean = false;
  flag:boolean=false;

  /* FormControl example
  email:FormControl=new FormControl(null, [Validators.required, Validators.email]);
  register(){
    console.log(this.email.value);
  }*/

  // FormGroup Example
  registerForm!: FormGroup 

    ngOnInit(){
    this.initForm();
  }

  initForm(){
    this.registerForm = new FormGroup(
    {
      name: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.pattern(/^\w{6,}$/)]),
      rePassword: new FormControl(null, [Validators.required]),
      phone: new FormControl(null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]),
    },
    { validators: this.confirmPassword }
  );
  }

 
  confirmPassword(group :AbstractControl) {
    if (group.get('password')?.value === group.get('rePassword')?.value){
      return null;
    }
    else
    {
      group.get('rePassword')?.setErrors({ mismatch: true });
      return { mismatch: true}
    }
  }

  register() {
      if (this.registerForm.valid)
      {
        this.isLoading=true;
        console.log( this.registerForm);
        console.log(this.registerForm.value);
        this.authService.registerForm(this.registerForm.value).subscribe({
          next: (response:any) => {
            console.log(response);
                    this.isLoading=false;

            if (response.message == 'success') {
              //alert('You are registered successfully');
              //navigate to login
              this.msgError = '';
              console.log(this.msgError );
              setTimeout(() => {
                this.router.navigate(['/login']);
              }, 1000);

              this.registerForm.reset();
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
      }else
      {
        //Show All alerts
        this.registerForm.markAllAsTouched();
        this.registerForm.setErrors({ mismatch: true });
        //this.registerForm.get('rePassword')?.patchValue('');
        //this.registerForm.get('rePassword')?.setValue('');

      }
  } 



}
