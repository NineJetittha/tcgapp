import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonContent, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth'; // นำเข้า AuthService

@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonContent]
})
export class EventPage {
  currentUser: any; // ประกาศตัวแปร currentUser
  eventData = { date: '', round: '', time: '', location: '' };
  events: Array<any> = [];

  // เพิ่ม authService เข้ามาใน constructor
  constructor(
    private router: Router, 
    private toastController: ToastController,
    private authService: AuthService
  ) {
    // กำหนดค่าผู้ใช้ปัจจุบันเมื่อเปิดหน้า
    this.currentUser = this.authService.getCurrentUser();
  }

  async onSubmit() {
    if (this.eventData.date && this.eventData.round && this.eventData.time && this.eventData.location) {
      // เพิ่มลง Array
      this.events.unshift({ ...this.eventData });
      
      // ระบบแจ้งเตือนสร้าง Event สำเร็จ
      const toast = await this.toastController.create({
        message: `สร้างการแข่งขันรอบที่ ${this.eventData.round} สำเร็จ! ระบบได้แจ้งเตือนผู้เล่นทุกคนแล้ว`,
        duration: 3500,
        position: 'top',
        color: 'primary',
        icon: 'notifications'
      });
      await toast.present();

      // ล้างข้อมูลฟอร์ม
      this.eventData = { date: '', round: '', time: '', location: '' };
    }
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}