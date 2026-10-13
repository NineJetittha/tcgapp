import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// นำเข้า Components ของ Ionic ที่เรียกใช้ใน HTML
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton } from '@ionic/angular';

@Component({
  selector: 'app-auction',
  templateUrl: './auction.page.html',
  styleUrls: ['./auction.page.scss'],
  standalone: true,
  // นำมาใส่ใน imports array
  imports: [IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, CommonModule, FormsModule]
})
export class AuctionPage implements OnInit {
  auctions = [
    {
      id: 1,
      name: 'Charizard VMAX (Secret Rare)',
      image: 'assets/auction-charizard.png',
      seller: '@PokeMaster99',
      currentBid: 4500,
      bidCount: 12,
      timeLeft: '02:15:30'
    }
  ];

  ngOnInit() { }

  createAuction() {
    const name = window.prompt('ชื่อการ์ดที่ต้องการประมูล');
    if (!name?.trim()) {
      return;
    }

    const startingBid = Number(window.prompt('ราคาเริ่มต้น (บาท)', '100'));
    if (!Number.isFinite(startingBid) || startingBid < 0) {
      window.alert('กรุณาระบุราคาเริ่มต้นให้ถูกต้อง');
      return;
    }

    this.auctions.unshift({
      id: Date.now(),
      name: name.trim(),
      image: 'assets/auction-charizard.png',
      seller: '@ผู้ขาย',
      currentBid: startingBid,
      bidCount: 0,
      timeLeft: '24:00:00'
    });
  }

  placeBid(auction: typeof this.auctions[number]) {
    const bid = Number(window.prompt(`เสนอราคามากกว่า ฿${auction.currentBid.toLocaleString()}`));
    if (!Number.isFinite(bid) || bid <= auction.currentBid) {
      window.alert('ราคาที่เสนอต้องมากกว่าราคาปัจจุบัน');
      return;
    }

    auction.currentBid = bid;
    auction.bidCount += 1;
    window.alert(`เสนอราคา ฿${bid.toLocaleString()} สำเร็จ`);
  }
}