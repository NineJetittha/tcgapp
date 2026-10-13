import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // <- ต้องมีตัวนี้
import { AuthService } from '../services/auth';
import { IonHeader, IonToolbar, IonContent } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonContent],
})
export class HomePage {
  currentUser: any;

  constructor(private authService: AuthService, private router: Router) {
    this.currentUser = this.authService.getCurrentUser();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // ฟังก์ชันนี้คือตัวที่ทำให้กดปุ่มแล้วข้ามหน้าได้
  goTo(path: string) {
    this.router.navigate([path]);
  }
}