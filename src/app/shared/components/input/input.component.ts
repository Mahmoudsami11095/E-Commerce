import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  imports: [ReactiveFormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css'
})
export class InputComponent {
  @Input() labelInput!: string ;
  @Input() typeInput!: string ;
  @Input() idInput!: string;
  @Input() control: any;
  flag:boolean=true;
}
