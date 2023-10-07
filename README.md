```markdown
# แอปพลิเคชันบริหารเวลาให้มีประสิทธิภาพด้วยเทคนิค Pomodoro 

## รายละเอียด

แอปพลิเคชันบริหารเวลาให้มีประสิทธิภาพด้วยเทคนิค Pomodoro (Effective time management Application using Pomodoro technique)
 เป็นแอปพลิเคชันที่พัฒนาขึ้นด้วย Expo และ React Native โดยมีการใช้ฐานข้อมูล Firebase ในการจัดเก็บข้อมูลผู้ใช้ เพื่อช่วยผู้ใช้จัดการเวลาโดยใช้เทคนิค Pomodoro ที่เข้าใจง่าย และมีการนำแนวคิดของ Gamification มาร่วมปรับใช้ภายในแอปพลิเคชันด้วย
 โดยการใช้เทคนิค Pomodoro จะแบ่งการทำงานเป็นช่วงเวลา โดยทั่วไปคือ 25 นาทีในการทำงาน และแบ่งเป็นพักสั้นๆ 5 นาที ระหว่างช่วงเวลานั้นๆ และจะเริ่มทำงานต่ออีก 25 นาที จากนั้นจะพักใหญ่ 15 นาทีถือเป็น
อันสิ้นสุด Pomodoro

## ฟีเจอร์ภายในแอปพลิเคชันประกอบไปด้วย 4 ส่วนดังนี้
Verification User
- ระบบ Register สำหรับสมัครเข้าใช้งานแอปพลิเคชันที่ประกอบไปด้วย (Username , Password, Age, Phone)
- ระบบ Login ในการตรวจสอบผู้ใช้
- ระบบ Logout สำหรับออกจากระบบของแอปพลิเคชัน
- ระบบซ่อน Password เพื่อความปลอดภัยของผู้ใช้
Timer
- นาฬิกานับถอยหลังที่มีการทำงานด้วยเทคนิค Pomodoro
- ผู้ใช้สามารถปรับเวลาในการทำงานของตัวเองได้ตั้งแต่ 1 นาที จนถึง 60 นาที
- มีการแจ้งเตือนที่ทุกการจบรอบทำงานของ Pomodoro
- ฟังก์ชันหยุดและดำเนินการต่อหรือเริ่มต้นใหม่ของตัวนับภอยหลัง
Task Management
- ผู้ใช้สามารถสร้างรายการงานที่ต้องการจะทำโดยการระบุ ชื่องาน และ รายละเอียด 
- สามารถลบหรือแก้ไขรายการงานที่สร้างขึ้นมาแล้วได้
- สามารถเช็คได้ว่างานไหนที่ทำเสร็จแล้วหรือไม่ด้วย Checkbox
-รายการงานที่สร้างโดยผู้ใช้จะมีการดึงข้อมูลไปแสดงยังหน้า Timer
Profile
- มีการแสดงข้อมูลของผู้ใช้ประกอบไปด้วย (Username , Password, Age, Phone, Score) 
- Password ของผู้ใช้มีการซ่อนเอาไว้โดยสามารถกดเพื่อแสดงผลได้
- ระบบ Tutorial ที่สอนวิธีใช้งานแอปพลิเคชันแบบเบื้องต้นให้ผู้ใช้หน้าใหม่
- ระบบ Music Integration ที่สามารถฟังเพลงภายในแอปพลิเคชันได้ 
- ฟังก์ชันหยุด / เริ่มใหม่ หรือเล่นเพลงถัดไปและเพลงก่อนหน้า
- ระบบ Score ที่มีการประยุกษ์ใช้จาก Gamification ในการปลดล็อคเพลงใหม่และสีพื้นหลังของข้อมูลผู้ใช้ในหน้า Profile 
- ระบบ Reward ที่ประยุกษ์ใช้จาก Gamification ในการสุ่มแผ่นภาพสำหรับเพิ่มคะแนน (Score) ให้กับผู้ใช้
- ล็อคการเปิดแผ่นภาพจาก Reward เป็นระยะเวลา 25 นาทีตามเวลาในการทำงานของ Pomodoro 
Environments
- อินเตอร์เฟซที่ใช้งานง่ายสะดวกต่อผู้ใช้
- รองรับระบบปฏิบัติการ Android & iOS 


## ตัวอย่างแอปพลิเคชัน Tomatoes Timer
![Tomatoes Application Demo](https://github.com/ChairawichZ6/Tomatoes-Timer-Application/assets/70460005/a0099bd6-5478-4cb1-b959-d770da4cc34a)


รวมรูปภาพหรือ GIF ของแอปพลิเคชันของคุณที่นี่เพื่อให้ผู้ใช้ได้มีภาพรวมที่รวดเร็ว

## การติดตั้ง

ก่อนที่คุณจะเริ่ม, กรุณาตรวจสอบว่าคุณมี Node.js และ npm ติดตั้งไว้อยู่
หากยังไม่มีให้ทำการติดตั้งให้เรียบร้อย

1. โคลนโปรเจค (Clone Project):

   ```bash
    git clone https://github.com/ChairawichZ6/Tomatoes-Timer-Application.git
   ```

2. เปลี่ยนไปที่ไดเรกทอรีของโปรเจค:

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

5. ปฏิบัติตามคำสั่งจาก Expo CLI เพื่อรันแอปพลิเคชันบน emulator หรืออุปกรณ์ที่เชื่อมต่อกับเครือข่าย

## วิธีการเปิดใช้งาน

1. เปิดแอปพลิเคชันบนอุปกรณ์หรือ emulator ของคุณด้วย Expo Go
2. Register ข้อมูลสำหรับเข้าใช้แอปพลิเคชันประกอบไปด้วย Username อย่างน้อย 8 ตัวอักษร , Password อย่างน้อย 6 ตัวอักษร , อายุ และเบอร์โทรศัพท์ 10 หลัก
3. Logn เข้าสู่แอปพลิเคชันด้วย Username และ Password ที่ได้สมัครเอาไว้
4. ทดลองใช้งานตัวจับเวลาถอยหลัง (Timer Functional)
5. ทดลองปรับเปลี่ยนเวลาในการทำงานของแอปพลิเคชันโดยคลิกที่ Icon นาฬิกาในหน้า Timer
6. ทำงานในช่วงเวลา Pomodoro และพักในช่วงพัก
7. ทำซ้ำกระบวนการจนกว่างานของคุณจะเสร็จสมบูรณ์
8. ทดลองเพิ่มรายการงานในหน้า Task 
9. ทดสอบแก้ไขหรือลบรายการงานที่สร้างไว้
10. เช็คงานที่ทำเสร็จแล้วด้วยการคลิกที่ Checkbox
Option เสริม
11. ไปยังหน้า Profile เพื่อตรวจสอบข้อมูลของตัวเอง
12. ดู Tutorial การใช้งานแอปพลิเคชันแบบเบื้่องต้น
13. สามารถฟังเพลงใน Music Player ได้
14. เล่นระบบ Reward เพื่อสุ่มแผ่นภาพในการแลกคะแนนได้
15. สีพื้นหลังโปรไฟล์จะมีการเปลี่ยนแปลงตามระดับคะแนนผู้ใช้
16. เพลงใหม่ปลดล็อคตามระดับคะแนนของผู้ใช้
17. เมื่อใช้งานเสร็จสิ้นให้ Logout ออกจากแอปพลิเคชัน
============== End ====================

## ขั้นตอนติดตั้ง

- [Expo](https://expo.dev/)
- [React Native](https://reactnative.dev/)
- [Android Studio] (https://developer.android.com/studio)

## LICENSE

โปรเจคนี้มี LICENSE ภายใต้  Borntodev License 


## ติดต่อ
หากคุณมีคำถามหรือข้อเสนอแนะ, ติดต่อได้ที่ 63070034@kmitl.ac.th
พี่ที่ปรึกษา : คุณ ศิรสิทธิ์ บุญกลาง

```
