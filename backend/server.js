const express = require('express');
const multer = require('multer');
const Groq = require('groq-sdk');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split('.').pop() || 'webm';
    cb(null, Date.now() + '.' + ext);
  },
});
const upload = multer({ storage });

// Initialize Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.post('/analyze', upload.single('file'), async (req, res) => {
  console.log('Incoming analysis request...');
  try {
    if (!req.file) {
      console.error('No file in request');
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    console.log('Received file:', req.file.path);

    // 🎤 STEP 1: Speech-to-text
    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(req.file.path),
      model: 'whisper-large-v3',
    });

    const text = transcription.text;
    console.log('Transcript:', text);

    // 🤖 STEP 2: Analysis
    const analysis = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `Analyze this speech and return JSON:
{
  "fluency": "",
  "confidence": "",
  "clarity": "",
  "suggestions": ""
}`
        },
        {
          role: 'user',
          content: `Speech:\n${text}`
        }
      ]
    });

    const result = analysis.choices[0].message.content;
    let parsedResult = {};
    try {
      parsedResult = JSON.parse(result);
    } catch(e) {
      console.error('Failed to parse JSON result:', result);
      parsedResult = { raw: result };
    }

    // Clean up file
    fs.unlinkSync(req.file.path);

    res.json({
      transcript: text,
      analysis: parsedResult,
    });

  } catch (err) {
    console.error('ERROR:', err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
