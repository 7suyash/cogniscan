const Groq = require("groq-sdk");
require("dotenv").config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function run() {
  try {
    const analysis = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: "Say hello and only hello" }],
    });

    console.log("Response:", analysis.choices[0].message.content);
  } catch (err) {
    console.error("FULL ERROR:", err);
  }
}

run();
