import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar
} from '@ionic/angular';

interface Deck {
  name: string;
  archetype: string;
  format: string;
  tier: 'Tier 1' | 'Tier 2' | 'Tier 3';
  score: number;
  winRate: number;
  tournaments: number;
  description: string;
  image: string;
  accent: string;
}

@Component({
  selector: 'app-tier-list',
  templateUrl: './tier-list.page.html',
  styleUrls: ['./tier-list.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    CommonModule,
    FormsModule
  ]
})
export class TierListPage {
  private readonly authService = inject(AuthService);
  private readonly imageStorageKey = 'tcg-tier-list-images';

  searchTerm = '';
  selectedFormat = 'ทั้งหมด';
  selectedTier = 'ทั้งหมด';
  selectedDeck?: Deck;

  readonly formats = ['ทั้งหมด', 'Standard', 'Expanded'];
  readonly tiers = ['ทั้งหมด', 'Tier 1', 'Tier 2', 'Tier 3'];

  readonly decks: Deck[] = [
    {
      name: 'Charizard ex',
      archetype: 'Charizard ex / Pidgeot ex',
      format: 'Standard',
      tier: 'Tier 1',
      score: 9.5,
      winRate: 61,
      tournaments: 248,
      description: 'เด็คสายพลังโจมตีที่เร่งพลังงานและปิดเกมได้ต่อเนื่อง',
      image: 'assets/auction-charizard.png',
      accent: '#f97316'
    },
    {
      name: 'Gardevoir ex',
      archetype: 'Gardevoir ex / Drifloon',
      format: 'Standard',
      tier: 'Tier 1',
      score: 9.1,
      winRate: 58,
      tournaments: 192,
      description: 'ควบคุมจังหวะเกมด้วยการเร่งพลังงานและโจมตีแบบยืดหยุ่น',
      image: 'assets/auction-charizard.png',
      accent: '#c026d3'
    },
    {
      name: 'Dragapult ex',
      archetype: 'Dragapult ex / Dusknoir',
      format: 'Standard',
      tier: 'Tier 2',
      score: 8.8,
      winRate: 55,
      tournaments: 166,
      description: 'กระจายดาเมจไปยังเบนช์และกดดันคู่แข่งทุกเทิร์น',
      image: 'assets/auction-charizard.png',
      accent: '#7c3aed'
    },
    {
      name: 'Lost Zone Box',
      archetype: 'Lost Zone / Comfey',
      format: 'Expanded',
      tier: 'Tier 2',
      score: 8.4,
      winRate: 53,
      tournaments: 121,
      description: 'เด็คคอมโบที่มีทางเลือกหลากหลายและพลิกสถานการณ์ได้ดี',
      image: 'assets/auction-charizard.png',
      accent: '#0891b2'
    },
    {
      name: 'Miraidon ex',
      archetype: 'Miraidon ex / Iron Hands ex',
      format: 'Standard',
      tier: 'Tier 3',
      score: 7.9,
      winRate: 50,
      tournaments: 98,
      description: 'เปิดเกมเร็วและใช้โปเกมอนสายฟ้าทำดาเมจอย่างสม่ำเสมอ',
      image: 'assets/auction-charizard.png',
      accent: '#eab308'
    },
    {
      name: 'Lugia VSTAR',
      archetype: 'Lugia VSTAR / Archeops',
      format: 'Expanded',
      tier: 'Tier 3',
      score: 7.6,
      winRate: 48,
      tournaments: 76,
      description: 'ใช้ความสามารถของ Archeops เพื่อปลดล็อกการเล่นช่วงกลางเกม',
      image: 'assets/auction-charizard.png',
      accent: '#64748b'
    }
  ];

  constructor() {
    this.loadUploadedImages();
  }

  get isAdmin(): boolean {
    return this.authService.getCurrentUser()?.role === 'admin';
  }

  get filteredDecks(): Deck[] {
    const query = this.searchTerm.trim().toLowerCase();
    return this.decks.filter((deck) => {
      const matchesSearch = !query
        || `${deck.name} ${deck.archetype}`.toLowerCase().includes(query);
      const matchesFormat = this.selectedFormat === 'ทั้งหมด'
        || deck.format === this.selectedFormat;
      const matchesTier = this.selectedTier === 'ทั้งหมด'
        || deck.tier === this.selectedTier;
      return matchesSearch && matchesFormat && matchesTier;
    });
  }

  openDeck(deck: Deck) {
    this.selectedDeck = deck;
  }

  closeDeck() {
    this.selectedDeck = undefined;
  }

  uploadDeckImage(deck: Deck, event: Event) {
    if (!this.isAdmin) {
      return;
    }

    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      window.alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
      return;
    }

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      if (typeof reader.result !== 'string') {
        window.alert('ไม่สามารถอ่านไฟล์รูปภาพได้');
        return;
      }

      deck.image = reader.result;
      this.saveUploadedImages();
    });
    reader.addEventListener('error', () => {
      window.alert('ไม่สามารถอัปโหลดรูปภาพได้');
    });
    reader.readAsDataURL(file);
  }

  private loadUploadedImages() {
    const storedImages = localStorage.getItem(this.imageStorageKey);
    if (!storedImages) {
      return;
    }

    try {
      const images = JSON.parse(storedImages) as Record<string, string>;
      this.decks.forEach((deck) => {
        if (images[deck.name]) {
          deck.image = images[deck.name];
        }
      });
    } catch {
      localStorage.removeItem(this.imageStorageKey);
    }
  }

  private saveUploadedImages() {
    const images = this.decks.reduce<Record<string, string>>((stored, deck) => {
      if (deck.image.startsWith('data:')) {
        stored[deck.name] = deck.image;
      }
      return stored;
    }, {});
    localStorage.setItem(this.imageStorageKey, JSON.stringify(images));
  }
}
