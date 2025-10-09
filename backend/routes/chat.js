require('dotenv').config();
const express = require('express');
const Groq = require('groq-sdk');
const router = express.Router();

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const groq = new Groq({ apiKey: GROQ_API_KEY });

router.post('/chat', async (req, res) => {
  const { message } = req.body;

  try {
    // Groq chat completion
    const chatCompletion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile', // Fast and powerful Groq model
      messages: [
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 1024,
    });

    const reply = chatCompletion.choices[0].message || "Sorry, I couldn't generate a response.";

    res.json({ reply });
  } catch (error) {
    console.error('Groq API Error:', error.response?.data || error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
