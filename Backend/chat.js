import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();

// ✅ FIX: Allow your actual Vercel domain
app.use(cors({
  origin: [
    "https://portfoliovd-five.vercel.app",  // Your production frontend
    "http://localhost:5173",                // Local development
    "http://localhost:3000"                 // Alternative local
  ],
  credentials: true,
  methods: ["GET", "POST", "OPTIONS"]
}));

app.use(express.json());

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Health check
app.get("/", (req, res) => {
  res.json({ 
    message: "Portfolio Chatbot API is running!",
    frontend: "https://portfoliovd-five.vercel.app"
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    console.log("📨 Chat request from:", req.headers.origin);
    
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://portfoliovd-five.vercel.app/", // ✅ Your actual domain
        "X-Title": "Portfolio Chatbot"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: req.body.messages,
      }),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));