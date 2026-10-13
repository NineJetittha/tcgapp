import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth'; // แก้เป็น ../services/auth
import { IonContent } from '@ionic/angular'; // แก้เป็น @ionic/angular

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule]
})
export class LoginPage {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    if (this.authService.login(this.username, this.password)) {
      this.router.navigate(['/home']);
    } else {
      this.errorMessage = 'Username หรือ Password ไม่ถูกต้อง!';
    }
  }
}