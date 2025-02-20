const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

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

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});