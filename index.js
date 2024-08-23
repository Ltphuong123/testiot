const express = require('express');
const app = express();
const port = 3000;

// Đơn giản hóa trạng thái bóng đèn
let lightState = 'on';

// Route để bật đèn
app.get('/api/on', (req, res) => {
    lightState = 'on';
    res.send('Light is ON');
});

// Route để tắt đèn
app.get('/api/off', (req, res) => {
    lightState = 'off';
    res.send('Light is OFF');
});

// Route để kiểm tra trạng thái
app.get('/api/status', (req, res) => {
    res.send(`Light is ${lightState}`);
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
