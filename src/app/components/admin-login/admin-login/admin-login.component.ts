import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth.service';
import { TuiButton } from '@taiga-ui/core';
import { TuiInputModule } from '@taiga-ui/legacy';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss'],
  standalone: true,
  imports: [
    TuiInputModule,
    TuiButton,
    ReactiveFormsModule,
    NgIf,
    FormsModule,
    HttpClientModule,
  ],
})
export class AdminLoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.auth.login(this.username, this.password).subscribe({
      next: () => this.router.navigate(['/admin']),
      error: () => (this.error = 'Неверный логин или пароль'),
    });
  }
}
