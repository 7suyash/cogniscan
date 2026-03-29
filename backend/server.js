const express = require('express');
const multer = require('multer');
const { GoogleGenAI } = require('@google/genai');
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
const upload = multer({ dest: 'uploads/' });

// Initialize Gemini with new SDK
const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY 
});

app.post('/analyze', upload.single('audio'), async (req, res) => {
  console.log('Incoming analysis request...');
  try {
    if (!req.file) {
      console.error('No file in request');
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    const audioPath = req.file.path;
    const audioBuffer = fs.readFileSync(audioPath);
    const audioBase64 = audioBuffer.toString('base64');

    // 🧠 Add debug log to check if recording is too small
    console.log(`Processing file: ${req.file.originalname}, mime: ${req.file.mimetype}`);
    console.log(`File buffer size: ${audioBuffer.length} bytes`);

    if (audioBuffer.length < 5000) {
      console.warn('⚠️ Audio file is VERY small. This might indicate an empty or broken recording.');
    }

    console.log('Calling Gemini API (gemini-2.0-flash via @google/genai)...');

    const prompt = `
      Analyze this audio recording for cognitive health markers.
      Provide the following in JSON format:
      - Transcribe accurately.
      - Calculate wordCount, repetitionRate (0-100), avgSentenceLength.
      - Cognitive Risk Score (0-100): 0 is healthy, 100 is high risk.
      - Breakdown: fluency, coherence, vocabulary.
      Output ONLY a JSON object.
    `;

    // New SDK syntax: ai.models.generateContent
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: req.file.mimetype || 'audio/webm',
                data: audioBase64
              }
            }
          ]
        }
      ]
    });

    const text = response.text;
    console.log('AI Response received.');
    
    // Extract JSON from the response
    let analysis;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      analysis = JSON.parse(jsonMatch ? jsonMatch[0] : text);
    } catch (parseError) {
      console.error('JSON Parse Error. Raw text:', text);
      throw new Error(`Failed to parse analysis from AI. Raw: ${text}`);
    }

    // Clean up file
    fs.unlinkSync(audioPath);
    console.log('Analysis complete. Sending response.');

    res.json(analysis);

  } catch (err) {
    console.error('FULL ERROR:', err); // 👈 VERY IMPORTANT
    // Send full details temporarily per request
    res.status(500).json({ 
      error: err.message, 
      stack: err.stack,
      status: err.status || 500
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
