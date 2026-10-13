import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // จำลองฐานข้อมูลผู้ใช้ (รหัสผ่านเข้ารหัสจำลองด้วย Base64)
  private users = [
    { username: 'admin', password: this.mockHash('Admin@1234'), role: 'admin' },
    { username: 'user', password: this.mockHash('User@1234'), role: 'user' }
  ];
  private currentUser: any = null;

  constructor() {}

  // จำลองการเข้ารหัส (Security)
  private mockHash(password: string): string {
    return btoa(password);
  }

  login(username: string, password: string): boolean {
    const user = this.users.find(u => u.username === username && u.password === this.mockHash(password));
    if (user) {
      this.currentUser = user;
      // บันทึกข้อมูลลง Local Storage ป้องกันการรีเฟรชแล้วหลุด
      localStorage.setItem('currentUser', JSON.stringify(user)); 
      return true;
    }
    return false;
  }

  register(username: string, password: string): { success: boolean; message: string } {
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    if (!usernameRegex.test(username)) {
      return { success: false, message: 'Username ต้องเป็นภาษาอังกฤษหรือตัวเลขเท่านั้น' };
    }

    if (this.users.find(u => u.username === username)) {
      return { success: false, message: 'Username นี้มีผู้ใช้งานแล้ว' };
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return { success: false, message: 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร ประกอบด้วยพิมพ์ใหญ่ พิมพ์เล็ก ตัวเลข และอักขระพิเศษ' };
    }

    this.users.push({
      username: username,
      password: this.mockHash(password),
      role: 'user'
    });

    return { success: true, message: 'สมัครสมาชิกสำเร็จ!' };
  }

  logout() {
    this.currentUser = null;
    // ลบข้อมูลเมื่อออกจากระบบ
    localStorage.removeItem('currentUser'); 
  }

  getCurrentUser() {
    // ดึงข้อมูลคืนมาถ้าระบบถูกรีเฟรชหน้าเว็บ
    if (!this.currentUser) {
      const stored = localStorage.getItem('currentUser');
      if (stored) {
        this.currentUser = JSON.parse(stored);
      }
    }
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
}