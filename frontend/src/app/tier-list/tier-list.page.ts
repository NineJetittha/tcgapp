import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// นำเข้า Components ของ Ionic ที่เรียกใช้ใน HTML
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton } from '@ionic/angular';

@Component({
  selector: 'app-tier-list',
  templateUrl: './tier-list.page.html',
  styleUrls: ['./tier-list.page.scss'],
  standalone: true,
  // นำมาใส่ใน imports array
  imports: [IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, CommonModule, FormsModule]
})
export class TierListPage implements OnInit {
  constructor() { }
  ngOnInit() { }
}