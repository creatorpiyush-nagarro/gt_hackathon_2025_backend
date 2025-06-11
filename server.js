const express = require('express');
const app = express();
const path = require('path');

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

    res.download(filePath, (err) => {
        if (err) {
            console.error('Download error:', err);

            // Only send error if response hasn't already been sent
            if (!res.headersSent) {
                res.status(500).send('Error downloading file.');
            }
        }
    });

    // Optional: handle client-side aborts
    req.on('aborted', () => {
        console.warn('Client aborted the download.');
    });
});


app.listen(PORT, () => {
    console.log(`Server started with http://localhost:${PORT}`);
})
