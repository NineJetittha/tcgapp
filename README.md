# TCGApp

แอปสำหรับจัดการและซื้อขายการ์ดสะสม พัฒนาด้วย Ionic + Angular, ใช้ Firebase
Firestore สำหรับข้อมูลการ์ด และ Capacitor สำหรับสร้างแอป Android

## สิ่งที่ทำเสร็จแล้ว

- หน้า Login, Register และระบบป้องกันหน้าที่ต้องเข้าสู่ระบบ
- หน้า Home, Shop, Event, Auction และ Sell Card
- เพิ่มการ์ดสำหรับขายลง Firestore collection `cards`
- เลือกรูปจากเครื่องหรือถ่ายรูปจากกล้องในหน้า Sell Card
- บีบอัดรูปเป็น JPEG ก่อนบันทึก เพื่อให้เหมาะกับการเก็บเป็น `image_url`
- หลังบันทึกการ์ด ระบบเปิดหน้า Shop และแสดงรูป/ชื่อ/ราคา
- หน้า Auction ใช้รูป Charizard ที่ `frontend/src/assets/auction-charizard.png`
- ตั้งค่า Firebase Hosting พร้อม Angular route rewrite
- สร้าง Android project ด้วย Capacitor
- สร้าง Debug APK สำเร็จสำหรับติดตั้งทดลอง

## โครงสร้างสำคัญ

```text
TCGApp/
├─ frontend/                  # Ionic + Angular application
│  ├─ src/app/                # หน้าและ service ของแอป
│  ├─ src/assets/             # รูปและ asset ของแอป
│  ├─ android/                # Android project ของ Capacitor
│  ├─ package.json
│  └─ capacitor.config.ts
├─ firebase.json              # Firebase Hosting configuration
├─ firestore.rules            # Firestore security rules
└─ README.md
```

## รัน backend, MongoDB และ Node-RED ด้วย Docker

ใน `docker-compose.yml` มี service สำหรับ backend, MongoDB และ Node-RED
อยู่ใน network เดียวกัน โดย backend เชื่อมต่อ MongoDB ผ่านชื่อ service `db`
และเชื่อมต่อ Node-RED ผ่าน `http://nodered:1880`

เริ่มระบบ:

```powershell
cd C:\TCGApp
docker compose up -d --build
```

ตรวจสอบสถานะการเชื่อมต่อ:

```powershell
Invoke-RestMethod http://localhost:3000/health
Invoke-RestMethod http://localhost:3000/health/integrations
```

จุดเชื่อมต่อ:

- Backend API: `http://localhost:3000`
- Cards API: `http://localhost:3000/api/cards`
- MongoDB: `mongodb://localhost:27017/tcg_store`
- Node-RED editor/API: `http://localhost:1880`

ข้อมูล MongoDB และ flow ของ Node-RED จะถูกเก็บใน Docker volumes
(`mongo_data` และ `nodered_data`) จึงไม่หายเมื่อ recreate container

สำหรับใช้งานจริง ควรกำหนด secret ก่อนเริ่มระบบ:

```powershell
$env:NODE_RED_CREDENTIAL_SECRET="เปลี่ยนเป็นค่าที่ปลอดภัย"
docker compose up -d --build
```

## ความต้องการของระบบ

- Node.js และ npm
- Ionic CLI
- Firebase CLI สำหรับ deploy
- Android Studio และ Android SDK สำหรับสร้าง APK
- JDK 21 สำหรับ Android Gradle build

โปรเจกต์นี้ใช้ Android project ของ **Capacitor** ไม่ใช่ Cordova

## รันเว็บในเครื่อง

เปิด PowerShell:

```powershell
cd C:\TCGApp\frontend
npm install
npm start
```

เปิดเว็บที่:

```text
http://localhost:4200
```

คำสั่งที่ใช้บ่อย:

```powershell
npm run build
npm run test
npm run lint
```

หมายเหตุ: `npm run lint` อาจรายงาน error เดิมของโปรเจกต์จากกฎ Angular control
flow และ dependency injection หลายไฟล์ แม้ production build จะผ่าน

## การใช้งานหน้า Sell Card

1. เข้าสู่ระบบ
2. เปิดเมนู **ลงขายการ์ด**
3. เลือกรูปจากเครื่อง หรือกด **เปิดกล้อง**
4. กรอกชื่อ/ประเภทการ์ด ราคา และวันที่
5. กด **บันทึกและเปิดหน้าร้านค้า**
6. ระบบบันทึกข้อมูลลง Firestore collection `cards`
7. ระบบนำไปหน้า Shop และแสดงรายการพร้อมรูป

รูปที่เลือกจะถูกย่อและบันทึกเป็น data URL ในฟิลด์ `image_url`

## Firebase Hosting

โปรเจกต์ Firebase ที่ใช้:

```text
tcgapp-13983
```

Build และ deploy:

```powershell
cd C:\TCGApp\frontend
npm run build -- --configuration production

cd C:\TCGApp
firebase deploy --only hosting --project tcgapp-13983
```

เว็บไซต์:

- [TCGApp](https://tcgapp-13983.web.app)
- [Sell Card](https://tcgapp-13983.web.app/sell-card)
- [Shop](https://tcgapp-13983.web.app/shop)

ไฟล์ `firebase.json` ตั้งค่าให้ Firebase Hosting ใช้ `frontend/www` และ rewrite
ทุก route ไปที่ `index.html` เพื่อให้ Angular routing ทำงานบนเว็บจริง

## สร้าง Android APK สำหรับทดลอง

### เตรียม Android project

```powershell
cd C:\TCGApp\frontend
npx cap sync android
```

หรือใช้คำสั่ง:

```powershell
ionic capacitor build android
```

คำสั่งนี้จะ build เว็บ, sync ไฟล์เข้า Android project และเปิดโปรเจกต์ใน
Android Studio

### สร้าง APK ด้วย Android Studio

1. เปิดโปรเจกต์โฟลเดอร์ `C:\TCGApp\frontend\android`
2. ตรวจสอบว่า Android SDK ถูกตั้งค่าแล้ว
3. รอ Gradle Sync จนสำเร็จ
4. เลือก **Build > Build Bundle(s) / APK(s) > Build APK(s)**
5. กด **locate** จากข้อความแจ้งเตือน

ไฟล์ APK ที่สร้างได้:

```text
C:\TCGApp\frontend\android\app\build\outputs\apk\debug\app-debug.apk
```

### สร้าง APK ด้วยคำสั่ง

ตั้งค่า JDK และ Android SDK ใน PowerShell:

```powershell
$env:JAVA_HOME="C:\Program Files\Eclipse Adoptium\jdk-21.0.12.101-hotspot"
$env:ANDROID_HOME="C:\Users\momot\AppData\Local\Android\Sdk"
$env:Path="$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:Path"
```

จากนั้น build:

```powershell
cd C:\TCGApp\frontend
npx cap sync android

cd C:\TCGApp\frontend\android
.\gradlew.bat assembleDebug
```

ผลลัพธ์อยู่ที่:

```text
android\app\build\outputs\apk\debug\app-debug.apk
```

## ติดตั้ง APK ในโทรศัพท์ Android

1. คัดลอก `app-debug.apk` ไปยังโทรศัพท์
2. เปิดไฟล์ APK
3. อนุญาต **ติดตั้งแอปที่ไม่รู้จัก** หากระบบถาม
4. กด **ติดตั้ง**

APK นี้เป็น Debug APK สำหรับทดลอง ไม่ใช่ไฟล์ signed release สำหรับ Play Store

## แก้ปัญหาที่พบบ่อย

### `SDK location not found`

ติดตั้ง Android SDK ผ่าน Android Studio แล้วตั้งค่า SDK path เช่น:

```text
C:\Users\momot\AppData\Local\Android\Sdk
```

หรือสร้างไฟล์ `frontend/android/local.properties`:

```properties
sdk.dir=C:\\Users\\momot\\AppData\\Local\\Android\\Sdk
```

ต้องเลือกโฟลเดอร์ SDK ไม่ใช่ไฟล์ `local.properties`

### `Unsupported class file major version`

ใช้ JDK 21 ในการ build Android:

```powershell
$env:JAVA_HOME="C:\Program Files\Eclipse Adoptium\jdk-21.0.12.101-hotspot"
```

### รูปไม่แสดงใน Shop

- ตรวจสอบว่าเลือกรูปสำเร็จและมี Preview ก่อนกดบันทึก
- ตรวจสอบว่า Firestore document มีฟิลด์ `image_url`
- รีเฟรชหน้า Shop หลังการบันทึก
- ตรวจสอบ Console ของเบราว์เซอร์และ Firebase project `tcgapp-13983`

## หมายเหตุด้านความปลอดภัย

ไฟล์ `firestore.rules` ในสถานะปัจจุบันอนุญาตให้อ่านและเขียน
collection `cards` ได้โดยไม่ต้องยืนยันตัวตน (`allow read, write: if true;`)
เหมาะสำหรับการทดสอบเท่านั้น ควรจำกัดสิทธิ์ตามผู้ใช้ก่อนใช้งานจริงหรือเผยแพร่
สู่สาธารณะ

## Wireframe ของทุกหน้า

ไฟล์ wireframe อยู่ในโฟลเดอร์ `wireframes/` เป็นภาพ SVG ขนาด
1920 × 1080 px แยกตามหน้า โดยใช้สไตล์ schematic ขาวดำ พร้อมเส้นชี้
และคำอธิบายสีแดงตามภาพอ้างอิง:

- `login.svg`
- `register.svg`
- `home.svg`
- `shop.svg`
- `event.svg`
- `sell-card.svg`
- `auction.svg`
- `tier-list.svg`

Business Model Canvas ของแอปอยู่ที่
`wireframes/business-model-canvas.svg` โดยสรุปกลุ่มลูกค้า คุณค่าหลัก
ช่องทาง พันธมิตร กิจกรรม ทรัพยากร ต้นทุน และแหล่งรายได้ของ TCG Card Store
ในภาพเดียว ขนาด 1920 × 1080 px

## Software Architecture

ภาพสถาปัตยกรรมระบบมี 2 รูปแบบ ขนาด 1920 × 1080 px:

- `wireframes/software-architecture-local-docker.svg` — Local Host ผ่าน Docker Compose
  ประกอบด้วย Angular/Ionic, Node.js API, MongoDB และ Node-RED
- `wireframes/software-architecture-firebase.svg` — Production บน Firebase Hosting,
  Cloud Firestore และ Firebase Authentication

Flowchart การทำงานของแอปอยู่ที่
`wireframes/application-flowchart.svg` แสดงเส้นทางตั้งแต่เปิดแอป,
ตรวจสอบ Session, Login/Register, Home และฟังก์ชันหลักทั้งหมด
ขนาด 1920 × 1080 px
