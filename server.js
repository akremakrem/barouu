const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Middleware لمعالجة طلبات JSON
app.use(express.json());

// خدمة الملفات الثابتة (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// مسار لحفظ الإجابات
app.post('/save-answers', (req, res) => {
    const answers = req.body;
    const filePath = 'answers.json';

    // قراءة الملف الحالي إذا كان موجودًا
    let existingData = [];
    if (fs.existsSync(filePath)) {
        existingData = JSON.parse(fs.readFileSync(filePath));
    }

    // إضافة الإجابات الجديدة
    existingData.push(answers);

    // حفظ الإجابات في الملف
    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));

    res.status(200).json({ success: true });
});

// بدء الخادم
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});