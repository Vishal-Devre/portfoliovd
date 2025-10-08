import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ✅ CORS - SABSE PEHLE (BEFORE any other middleware)
app.use(cors({
  origin: "*", // All origins allow karo
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// ✅ Pre-flight requests handle karo
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, X-Requested-With");
  res.sendStatus(200);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Health check
app.get("/", (req, res) => {
  res.json({ 
    message: "Portfolio Chatbot API is running!",
    timestamp: new Date().toISOString()
  });
});

// ✅ API route
app.post("/api/chat", async (req, res) => {
  // ✅ CORS headers manually bhi add karo
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, X-Requested-With");
  
  try {
    console.log("Received chat request");
    
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://portfoliovd-five.vercel.app/",
        "X-Title": "Portfolio Chatbot"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: req.body.messages,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter error: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ 
      error: "Internal server error",
      details: error.message 
    });
  }
});

// ✅ SPA routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ CORS enabled for ALL origins`);
});