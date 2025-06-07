const express = require('express');
const app = express();
const path = require('path');

const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
    return res.status(200).json({ "status": "UP" })
})

app.get('/download-model', (req, res) => {
    const filePath = path.join(__dirname, 'DeepSeek-R1-Distill-Qwen-1.5B_multi-prefill-seq_q8_ekv1280.task');
    res.download(filePath, (err) => {
        if (err) {
            console.error('Download error:', err);
            res.status(500).send('Error downloading file.');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server started with http://localhost:${PORT}`);
})
