import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonContent, ToastController } from '@ionic/angular';
import { CardService } from '../services/card.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.page.html',
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonContent]
})
export class ShopPage implements OnInit {
  products: any[] = [];

  constructor(
    private router: Router,
    private toastController: ToastController,
    private cardService: CardService
  ) {}

  ngOnInit() {
    this.cardService.getCards().subscribe({
      next: (cards) => {
        this.products = cards.map((card: any) => ({
          id: card.id,
          name: card.name,
          price: card.price,
          seller: card.seller || 'ผู้ขาย',
          image: card.image_url || 'assets/icon/favicon.png'
        }));
      },
      error: (error) => console.error('โหลดรายการการ์ดไม่สำเร็จ:', error)
    });
  }

  // ระบบแจ้งเตือนการสั่งซื้อ
  async buyItem(item: any) {
    const toast = await this.toastController.create({
      message: `สั่งซื้อ ${item.name} สำเร็จ! แจ้งเตือนไปยังผู้ขาย ${item.seller} แล้ว`,
      duration: 3000,
      position: 'top',
      color: 'success',
      icon: 'checkmark-circle'
    });
    await toast.present();
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}