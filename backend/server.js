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

/* -------------------- helpers -------------------- */
function clampScore(value, fallback = 0) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(0, Math.min(100, Math.round(n)));
}

// If LLM fails to provide scores, compute a stable fallback score
function heuristicScoresFromTranscript(text) {
  const t = (text || '').trim();
  const wordCount = t ? t.split(/\s+/).length : 0;

  // very simple heuristics just to ensure UI always has a number
  // - too short => lower
  // - reasonable length => better
  // cap in [25..85] for fallback
  const base =
    wordCount <= 3 ? 28 :
    wordCount <= 8 ? 40 :
    wordCount <= 20 ? 60 :
    wordCount <= 40 ? 72 :
    78;

  const fluency = clampScore(base - 2);
  const confidence = clampScore(base + 1);
  const clarity = clampScore(base + 3);
  const overall = clampScore(Math.round((fluency + confidence + clarity) / 3));

  return { overall, fluency, confidence, clarity };
}

function normalizeLLM(parsed, transcriptText) {
  // Accept either:
  // { scores: {...}, analysis: {...} }
  // OR older shape: { fluency, confidence, clarity, suggestions }
  const maybeScores = parsed?.scores || {};
  const maybeAnalysis = parsed?.analysis || parsed || {};

  // Get subscores (may be missing)
  const fluency = toNullableScore(maybeScores.fluency);
  const confidence = toNullableScore(maybeScores.confidence);
  const clarity = toNullableScore(maybeScores.clarity);
  const overall = toNullableScore(maybeScores.overall);

  // If any scores missing => fallback heuristic
  const fallback = heuristicScoresFromTranscript(transcriptText);

  const finalScores = {
    fluency: clampScore(fluency ?? fallback.fluency),
    confidence: clampScore(confidence ?? fallback.confidence),
    clarity: clampScore(clarity ?? fallback.clarity),
    overall: clampScore(overall ?? Math.round((fallback.fluency + fallback.confidence + fallback.clarity) / 3)),
  };

  // If LLM gave some subscores but not overall => compute overall
  if (overall === null) {
    finalScores.overall = clampScore(
      Math.round((finalScores.fluency + finalScores.confidence + finalScores.clarity) / 3)
    );
  }

  return {
    transcript: transcriptText,
    score: finalScores.overall,
    scores: finalScores,
    analysis: {
      fluency: maybeAnalysis?.fluency || '',
      confidence: maybeAnalysis?.confidence || '',
      clarity: maybeAnalysis?.clarity || '',
      suggestions: maybeAnalysis?.suggestions || '',
    },
  };
}

function toNullableScore(v) {
  const n = Number(v);
  return Number.isFinite(n) ? clampScore(n) : null;
}

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

    const text = transcription.text || '';
    console.log('Transcript:', text);

    // 🤖 STEP 2: Analysis + scoring
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `You are an expert speech coach.
Return ONLY valid JSON (no markdown, no code fences).

Return exactly this shape:
{
  "scores": {
    "overall": 0,
    "fluency": 0,
    "confidence": 0,
    "clarity": 0
  },
  "analysis": {
    "fluency": "1-3 sentences",
    "confidence": "1-3 sentences",
    "clarity": "1-3 sentences",
    "suggestions": "3-6 short actionable suggestions in plain text"
  }
}

Rules:
- All scores must be integers 0-100.
- Do not add extra keys.`
        },
        { role: 'user', content: `Speech:\n${text}` },
      ],
    });

    const raw = completion?.choices?.[0]?.message?.content || '{}';

    let parsed = {};
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      console.error('Failed to parse Groq JSON:', raw);
      parsed = {};
    }

    // clean up file
    try {
      fs.unlinkSync(req.file.path);
    } catch (e) {
      console.warn('Failed to delete uploaded file:', e?.message || e);
    }

    const payload = normalizeLLM(parsed, text);

    // Debug: verify score is present
    console.log('Returning score:', payload.score, 'scores:', payload.scores);
    return res.json({ __debug: true, ...payload });
    return res.json(payload);
  } catch (err) {
    console.error('ERROR:', err);

    if (req.file?.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {
        // ignore
      }
    }

    return res.status(500).json({ error: err.message, stack: err.stack });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});