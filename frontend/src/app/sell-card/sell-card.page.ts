import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { CardService } from '../services/card.service';

@Component({
  selector: 'app-sell-card',
  templateUrl: './sell-card.page.html',
  standalone: true,
  imports: [CommonModule, FormsModule], // ลบ IonicModule ออกจากตรงนี้
  schemas: [CUSTOM_ELEMENTS_SCHEMA]     // เพิ่มบรรทัดนี้เข้ามา เพื่อให้ใช้แท็ก <ion-...> ได้
})
export class SellCardPage implements OnDestroy, OnInit {
  @ViewChild('cameraPreview') cameraPreview?: ElementRef<HTMLVideoElement>;
  
  // (โค้ดด้านในคลาสยังคงเหมือนเดิมทั้งหมดครับ)
  trade = {
    image: '',
    cardType: '',
    price: 0,
    date: new Date().toISOString().split('T')[0]
  };

  trades: any[] = [];
  isSubmitting = false;
  cameraActive = false;
  cameraStream: MediaStream | null = null;

  constructor(
    private cardService: CardService,
    private router: Router,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadCards();
  }

  ngOnDestroy() {
    this.stopCamera();
  }

  loadCards() {
    this.cardService.getCards().subscribe({
      next: (data) => {
        this.trades = data.map((card: any) => ({
          cardType: card.name,
          price: card.price,
          image: card.image_url || ''
        }));
      },
      error: (err) => console.error('ดึงข้อมูลผิดพลาด:', err)
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
      input.value = '';
      return;
    }

    this.compressImage(file).then((image) => {
      this.trade.image = image;
    }).catch((err) => {
      console.error('อ่านรูปภาพไม่สำเร็จ:', err);
      alert('ไม่สามารถอ่านรูปภาพได้ กรุณาลองใหม่');
    });
  }

  private compressImage(source: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(reader.error);
      reader.onload = () => {
        const image = new Image();
        image.onerror = () => reject(new Error('Invalid image'));
        image.onload = () => {
          const maxDimension = 1200;
          const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, Math.round(image.width * scale));
          canvas.height = Math.max(1, Math.round(image.height * scale));
          canvas.getContext('2d')?.drawImage(image, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        image.src = reader.result as string;
      };
      reader.readAsDataURL(source);
    });
  }

  async startCamera() {
    if (Capacitor.isNativePlatform()) {
      try {
        const photo = await Camera.getPhoto({
          quality: 80,
          width: 1200,
          allowEditing: false,
          resultType: CameraResultType.DataUrl,
          source: CameraSource.Camera
        });
        if (!photo.dataUrl) {
          throw new Error('กล้องไม่ส่งรูปภาพกลับมา');
        }
        this.trade.image = photo.dataUrl;
      } catch (err) {
        console.error('ถ่ายรูปด้วยกล้องของอุปกรณ์ไม่สำเร็จ:', err);
        alert('ไม่สามารถเปิดกล้องได้ กรุณาอนุญาตการใช้งานกล้องแล้วลองใหม่');
      }
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      alert('เบราว์เซอร์นี้ไม่รองรับการเปิดกล้อง');
      return;
    }

    try {
      this.stopCamera();
      this.cameraStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false
      });
      this.cameraActive = true;
      this.changeDetector.detectChanges();
      await this.attachCameraPreview();
    } catch (err) {
      this.stopCamera();
      console.error('เปิดกล้องไม่สำเร็จ:', err);
      alert('ไม่สามารถเปิดกล้องได้ กรุณาอนุญาตการใช้งานกล้องแล้วลองใหม่');
    }
  }

  private async attachCameraPreview(): Promise<void> {
    for (let attempt = 0; attempt < 10; attempt += 1) {
      const video = this.cameraPreview?.nativeElement;
      if (video && this.cameraStream) {
        video.autoplay = true;
        video.muted = true;
        video.playsInline = true;
        video.srcObject = this.cameraStream;
        await new Promise<void>((resolve) => {
          if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
            resolve();
            return;
          }
          video.addEventListener('loadedmetadata', () => resolve(), { once: true });
        });
        await video.play();
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    throw new Error('ไม่พบพื้นที่แสดงภาพกล้อง');
  }

  capturePhoto(video: HTMLVideoElement, canvas: HTMLCanvasElement) {
    if (!video.videoWidth || !video.videoHeight) {
      alert('กล้องยังไม่พร้อม กรุณารอสักครู่แล้วลองใหม่');
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (!blob) {
        alert('ไม่สามารถบันทึกรูปจากกล้องได้ กรุณาลองใหม่');
        return;
      }
      this.compressImage(blob).then((image) => {
        this.trade.image = image;
      }).catch((err) => {
        console.error('บีบอัดรูปจากกล้องไม่สำเร็จ:', err);
        alert('ไม่สามารถบันทึกรูปจากกล้องได้ กรุณาลองใหม่');
      });
    }, 'image/jpeg', 0.8);
    this.stopCamera();
  }

  stopCamera() {
    this.cameraStream?.getTracks().forEach((track) => track.stop());
    if (this.cameraPreview?.nativeElement) {
      this.cameraPreview.nativeElement.srcObject = null;
    }
    this.cameraStream = null;
    this.cameraActive = false;
  }

  downloadPhoto() {
    if (!this.trade.image) {
      return;
    }

    const link = document.createElement('a');
    link.href = this.trade.image;
    link.download = `card-photo-${Date.now()}.jpg`;
    link.click();
  }

  async onSubmit() {
    const cardName = this.trade.cardType.trim();
    if (
      this.isSubmitting ||
      !cardName ||
      !this.trade.date ||
      !this.trade.image ||
      !Number.isFinite(this.trade.price) ||
      this.trade.price < 0
    ) {
      alert('กรุณากรอกชื่อการ์ด ราคา และวันที่ให้ถูกต้อง');
      return;
    }

    this.isSubmitting = true;
    const newCard = {
      name: cardName,
      set: 'General', 
      rarity: 'Common', 
      price: this.trade.price,
      image_url: this.trade.image 
    };

    try {
      await this.cardService.addCard(newCard);
      alert('ลงประกาศขายสำเร็จ!');
      this.trade = {
        image: '',
        cardType: '',
        price: 0,
        date: new Date().toISOString().split('T')[0]
      };
      await this.router.navigate(['/shop']);
    } catch (err) {
      console.error('Error:', err);
      alert('เกิดข้อผิดพลาด ไม่สามารถบันทึกข้อมูลได้');
    } finally {
      this.isSubmitting = false;
    }
  }

  // 1. เพิ่มฟังก์ชัน goBack() กลับเข้ามา
  goBack() {
    this.router.navigate(['/home']);
  }

} // <-- 2. อย่าลืมปีกกาปิดคลาส SellCardPage ตัวสุดท้ายที่บรรทัดล่างสุดด้วยครับ


    