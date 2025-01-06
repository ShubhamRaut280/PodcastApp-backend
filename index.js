const express = require('express');
const fs = require('fs');
const path = require('path');
const gtts = require('gtts');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.post('/generate-audio', (req, res) => {
    const { text } = req.body;

    // Remove text within brackets (including the brackets themselves)
    const cleanedText = text.replace(/\[.*?\]|\{.*?\}|\(.*?\)/g, '').trim();

    const gttsInstance = new gtts(cleanedText, 'en');
    const filePath = path.join(__dirname, 'output.mp3');

    gttsInstance.save(filePath, (err, result) => {
        if (err) {
            return res.status(500).send('Error generating audio');
        }
        res.sendFile(filePath);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


module.exports = app; 
