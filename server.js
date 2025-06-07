const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
    return res.status(200).json({ "status": "UP" })
})

app.listen(PORT, () => {
    console.log(`Server started with http://localhost:${PORT}`);
})
