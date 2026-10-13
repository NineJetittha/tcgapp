import { Injectable } from '@angular/core';
import { collection, addDoc } from 'firebase/firestore';
import { collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { firestore } from './firebase';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  // ดึงข้อมูลการ์ดทั้งหมดจาก Firebase
  getCards(): Observable<any[]> {
    const cardsRef = collection(firestore, 'cards');
    return collectionData(cardsRef, { idField: 'id' });
  }

  // เพิ่มการ์ดใหม่ลง Firebase
  async addCard(cardData: any) {
    const cardsRef = collection(firestore, 'cards');
    return await addDoc(cardsRef, cardData);
  }
}