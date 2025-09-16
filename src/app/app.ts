import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthLayoutComponent } from "./core/layouts/auth-layout/auth-layout.component";
import { FooterComponent } from "./shared/components/footer/footer.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('E-Commerce');
}
