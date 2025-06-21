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

app.get('/get-model-data', (req, res) => {
    return res.status(200).json({
        currentModel: process.env.CURRENT_MODEL || null,
        previousModel: process.env.PREVIOUS_MODEL || null
    });
})

app.get('/download-model', (req, res) => {
    const filePath = path.join(__dirname, 'DeepSeek-R1-Distill-Qwen-1.5B_multi-prefill-seq_q8_ekv1280.task');

    if (!fs.existsSync(filePath)) {
        return res.status(404).send('File not found');
    }

    const stream = fs.createReadStream(filePath);

    // Handle abort early
    req.on('aborted', () => {
        console.warn('Client aborted the download');
        stream.destroy();
    });

    // Handle stream errors
    stream.on('error', (err) => {
        console.error('Stream error:', err.message);
        if (!res.headersSent) {
            res.status(500).send('Failed to download file');
        } else {
            res.destroy(); // Close the response safely
        }
    });

    // Set proper headers
    res.setHeader('Content-Disposition', `attachment; filename="${path.basename(filePath)}"`);
    res.setHeader('Content-Type', 'application/octet-stream');

    // Pipe the stream
    stream.pipe(res);
});


// Catch uncaught errors
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    if (!res.headersSent) {
        res.status(500).send('Internal Server Error');
    }
});



app.listen(PORT, () => {
    console.log(`Server started with http://localhost:${PORT}`);
})
