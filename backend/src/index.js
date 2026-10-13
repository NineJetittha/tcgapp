const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// เพิ่มคำสั่ง app.listen เพื่อเปิดพอร์ตรอรับ Request ค้างไว้
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});