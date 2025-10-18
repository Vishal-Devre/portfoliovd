import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// CORS - Sabse pehle
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());

// Health Check
app.get('/', (req, res) => {
  res.json({ 
    message: '✅ Chatbot API is running!',
    timestamp: new Date().toISOString()
  });
});

// Chat Route - YAHI IMPORTANT HAI
app.post('/api/chat', async (req, res) => {
  try {
    console.log('🤖 Chat request received:', req.body.messages);
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://portfoliovd-production.up.railway.app/',
        'X-Title': 'Portfolio Chatbot'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: req.body.messages,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter error: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Chat response successful');
    res.json(data);
    
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📞 API available at: http://localhost:${PORT}/api/chat`);
});
