const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

const OpenAI = require('openai');

require('dotenv').config();

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
});

const PORT = process.env.PORT || 3000

app.use(express.json());

app.get('/', (req, res) => {
    return res.status(200).json({ "status": "UP" })
})

app.post('/chat', async (req, res) => {
    const { prompt } = req.body;

    try {
        const response = await client.responses.create({
            model: 'gpt-4o',
            // instructions: 'You are a coding assistant that talks like a pirate',
            input: prompt,
        });
        // res.json({ response: result.data.choices[0].message.content });
        return res.status(201).json({ response: response.output_text });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
});

app.get('/download-model', (req, res) => {
    const filePath = path.join(__dirname, 'DeepSeek-R1-Distill-Qwen-1.5B_multi-prefill-seq_q8_ekv1280.task');

    // Optional: check file exists
    if (!fs.existsSync(filePath)) {
        return res.status(404).send('File not found.');
    }

    // Log if client aborts
    req.on('aborted', () => {
        console.warn('Client aborted the download.');
    });

    res.download(filePath, (err) => {
        if (err && !res.headersSent) {
            // Only log; don't send response if already started
            console.error('Download failed:', err.message);
        }
    });
});



app.listen(PORT, () => {
    console.log(`Server started with http://localhost:${PORT}`);
})
