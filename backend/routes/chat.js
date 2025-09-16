require('dotenv').config();
const express = require('express');
const { InferenceClient } = require('@huggingface/inference');
const router = express.Router();

const HF_TOKEN = process.env.HUGGINGFACE_API_KEY;
const client = new InferenceClient(HF_TOKEN);

router.post('/chat', async (req, res) => {
  const { message } = req.body;

  try {
    // OpenAI-compatible chat completion
    const chatCompletion = await client.chatCompletion({
      model: 'deepseek-ai/DeepSeek-V3-0324', // choose any supported model
      messages: [
        { role: 'user', content: message }
      ],
    });

    const reply = chatCompletion.choices[0].message || "Sorry, I couldn't generate a response.";

    res.json({ reply });
  } catch (error) {
    console.error('Hugging Face Error:', error.response?.data || error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
