import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// นำเข้า Components ของ Ionic ที่เรียกใช้ใน HTML
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton } from '@ionic/angular';

interface Auction {
  id: number;
  name: string;
  image: string;
  images: string[];
  seller: string;
  currentBid: number;
  bidCount: number;
  timeLeft: string;
}

@Component({
  selector: 'app-auction',
  templateUrl: './auction.page.html',
  styleUrls: ['./auction.page.scss'],
  standalone: true,
  // นำมาใส่ใน imports array
  imports: [IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, CommonModule, FormsModule]
})
export class AuctionPage {
  isCreateAuctionOpen = false;
  auctionName = '';
  startingBid = 100;
  selectedImages: string[] = [];

  auctions: Auction[] = [
    {
      id: 1,
      name: 'Charizard VMAX (Secret Rare)',
      image: 'assets/auction-charizard.png',
      images: ['assets/auction-charizard.png'],
      seller: '@PokeMaster99',
      currentBid: 4500,
      bidCount: 12,
      timeLeft: '02:15:30'
    }
  ];

  createAuction() {
    this.isCreateAuctionOpen = true;
  }

  closeCreateAuction() {
    this.isCreateAuctionOpen = false;
    this.auctionName = '';
    this.startingBid = 100;
    this.selectedImages.forEach((image) => URL.revokeObjectURL(image));
    this.selectedImages = [];
  }

  onImagesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    this.selectedImages.forEach((image) => URL.revokeObjectURL(image));
    this.selectedImages = files.map((file) => URL.createObjectURL(file));
  }

  submitAuction() {
    const name = this.auctionName.trim();
    if (!name) {
      window.alert('กรุณาระบุชื่อการ์ด');
      return;
    }

    if (!Number.isFinite(this.startingBid) || this.startingBid < 0) {
      window.alert('กรุณาระบุราคาเริ่มต้นให้ถูกต้อง');
      return;
    }

    const images = this.selectedImages.length > 0
      ? [...this.selectedImages]
      : ['assets/auction-charizard.png'];

    this.auctions.unshift({
      id: Date.now(),
      name,
      image: images[0],
      images,
      seller: '@ผู้ขาย',
      currentBid: this.startingBid,
      bidCount: 0,
      timeLeft: '24:00:00'
    });
    this.isCreateAuctionOpen = false;
    this.auctionName = '';
    this.startingBid = 100;
    this.selectedImages = [];
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