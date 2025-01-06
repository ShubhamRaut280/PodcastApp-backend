const express = require('express');
const fs = require('fs');
const path = require('path');
const gtts = require('gtts');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('I am live');
});

app.post('/generate-audio', (req, res) => {
    const { text } = req.body;

    // Use gtts to generate audio
    const gttsInstance = new gtts(text, 'en');
    const filePath = path.join('/tmp', 'output.mp3'); // Use /tmp directory

    gttsInstance.save(filePath, (err, result) => {
        if (err) {
            console.error('Error generating audio:', err);
            return res.status(500).send('Error generating audio');
        }
        res.sendFile(filePath, {}, (err) => {
            if (err) {
                console.error('Error sending audio file:', err);
                res.status(500).send('Error sending audio file');
            } else {
                // Optionally clean up the file after sending
                fs.unlink(filePath, (err) => {
                    if (err) console.error('Error deleting file:', err);
                });
            }
        });
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


module.exports = app; 
