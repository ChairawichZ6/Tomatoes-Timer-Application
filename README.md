 แอปพลิเคชันบริหารเวลาด้วยเทคนิค Pomodoro

## รายละเอียด (Description)

แอปพลิเคชันบริหารเวลาด้วยเทคนิค Pomodoro (Effective Time Management Application using Pomodoro Technique) เป็นแอปพลิเคชันที่พัฒนาขึ้นด้วย Expo , React Native และมีการใช้ Firebase เป็นฐานข้อมูลสำหรับจัดเก็บข้อมูลผู้ใช้ โดยฟังกชันการทำงานหลักของแอปพลิเคชันมีการนำเอาเทคนิค Pomodoro มาใช้ในการจัดการเวลาการทำงาน และมีการนำแนวคิด Gamification ในการกระตุ้นและเพิ่มประสิทธิภาพมาใช้งานภายในแอปพลิเคชัน

## ฟีเจอร์ (Features)

### 1. การยืนยันตัวตนของผู้ใช้ (User Authentication)
- ระบบลงทะเบียนสำหรับผู้ใช้ในการสมัครใช้งาน
- ระบบเข้าสู่ระบบเพื่อตรวจสอบตัวตน
- ระบบออกจากระบบ
- ระบบซ่อนรหัสผ่านเพื่อความปลอดภัย

### 2. ตัวจับเวลา (Timer Functionality)
- นาฬิกานับถอยหลังในการทำงานด้วยเทคนิค Pomodoro
- การปรับเวลาทำงานได้ตามต้องการ (1-60 นาที)
- แจ้งเตือนทุกครั้งที่สิ้นสุดรอบ Pomodoro
- ฟังก์ชันหยุดและดำเนินการต่อหรือเริ่มต้นใหม่

### 3. การจัดการงาน (Task Management)
- เพิ่มรายการงานพร้อมรายละเอียด
- ลบหรือแก้ไขรายการงาน
- เช็คสถานะงานที่เสร็จสมบูรณ์ด้วย Checkbox
- แสดงรายการงานในหน้าตัวจับเวลา

### 4. ข้อมูลผู้ใช้ (User Profile)
- แสดงข้อมูลผู้ใช้ (Username, Password, Age, Phone, Score)
- ซ่อนรหัสผ่านและระบบการสอนใช้งานแอปพลิเคชัน
- การผนวกเพลงในแอปพลิเคชัน
- ควบคุมเพลง (หยุด, เริ่มใหม่, เล่นถัดไป, เล่นก่อนหน้า)
- การเพิ่ม Score จาก Gamification
- ระบบ Reward สุ่มแผ่นภาพ

### 5. สภาพแวดล้อม (Environment)
- รองรับ Android & iOS

## ตัวอย่างแอปพลิเคชัน Tomatoes Timer
![Tomatoes Application Demo](https://github.com/ChairawichZ6/Tomatoes-Timer-Application/assets/70460005/a0099bd6-5478-4cb1-b959-d770da4cc34a)

## การติดตั้ง

1. โคลนโปรเจกต์:

   ```bash
   git clone https://github.com/ChairawichZ6/Tomatoes-Timer-Application.git

## รายละเอียด


2. เปลี่ยนไปที่ไดเรกทอรีของโปรเจกต์:

   ```bash
   cd pomodoro-app
   ```

3. ติดตั้ง dependencies:

   ```bash
   npm install
   ```

4. เริ่ม Expo development server:

   ```bash
   npx expo start
   ```

5. เมื่อได้ QR Code ของแอปพลิเคชันมา สามารถเปิด QR Code จากแอปพลเคชัน Expo Go

## วิธีการใช้งาน

1. เปิดแอปบน Expo Go
2. ลงทะเบียนด้วยข้อมูลสำหรับเข้าใช้ (Username, Password, Age, Phone)
3. เข้าสู่ระบบ
4. ใช้ตัวจับเวลา Pomodoro
5. ปรับเวลาทำงานตามต้องการ
6. ทำงานและพักตามรอบ Pomodoro
7. เพิ่ม, ลบ, แก้ไขรายการงาน
8. เช็คงานที่เสร็จสมบูรณ์ด้วย Checkbox
9. ไปที่โปรไฟล์เพื่อดูข้อมูล, เรียนรู้ใช้งาน, เพลง, Reward
10. ออกจากระบบเมื่อเสร็จสิ้น

## ข้อกำหนดการใช้

- [Expo](https://expo.dev/)
- [React Native](https://reactnative.dev/)
- [Android Studio](https://developer.android.com/studio)

## สิทธิ์และการให้สัญญา

โปรเจคนี้ได้รับการคุ้มครองภายใต้ Borntodev License

## ติดต่อ

หากคุณมีคำถามหรือข้อเสนอแนะ, ติดต่อได้ที่ 63070034@kmitl.ac.th
