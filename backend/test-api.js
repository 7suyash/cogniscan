const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function run() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: "Say hello",
    });

    console.log("Response:", response.text);
  } catch (err) {
    console.error("FULL ERROR:", err);
  }
}

run();
