import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule]
})
export class RegisterPage {
  username = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน!';
      return;
    }

    const result = this.authService.register(this.username, this.password);
    
    if (result.success) {
      this.successMessage = result.message;
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1500);
    } else {
      this.errorMessage = result.message;
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}