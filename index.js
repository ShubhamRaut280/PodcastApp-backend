const express = require('express');
const gtts = require('gtts');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('I am live');
});

app.post('/generate-audio',async (req, res) => {
    const { text } = req.body;

    try {
        // Split text into manageable chunks
        const chunks = text.match(/[^.!?]+[.!?]+/g) || [text];
        
        // Set up headers for audio streaming
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Content-Disposition', 'attachment; filename="output.mp3"');

        for (const chunk of chunks) {
            const gttsInstance = new gtts(chunk, 'en');

            // Generate audio and stream directly
            await new Promise((resolve, reject) => {
                gttsInstance.stream()
                    .on('data', (data) => res.write(data))
                    .on('end', resolve)
                    .on('error', reject);
            });
        }

        res.end(); // End the stream after all chunks are processed
    } catch (error) {
        console.error('Error generating audio:', error);
        res.status(500).send('Error generating audio');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
