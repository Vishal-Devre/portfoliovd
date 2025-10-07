import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();

// ✅ FIXED: Proper CORS configuration
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000", "https://your-portfolio.vercel.app"],
  credentials: true
}));

app.use(express.json());

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Health check route
app.get("/", (req, res) => {
  res.json({ 
    message: "Portfolio Chatbot API is running!",
    status: "healthy",
    timestamp: new Date().toISOString()
  });
});

// ✅ ADD: GET route for testing
app.get("/api/chat", (req, res) => {
  res.json({ 
    message: "Chat endpoint is working! Use POST method to send messages.",
    endpoint: "/api/chat",
    method: "POST"
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    console.log("📨 Received chat request");
    console.log("Origin:", req.headers.origin);
    console.log("Request body:", req.body);

    if (!req.body.messages) {
      return res.status(400).json({ error: "Messages are required" });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://your-portfolio-site.com/",
        "X-Title": "Portfolio Chatbot"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: req.body.messages,
      }),
    });

    const data = await response.json();
    console.log("✅ OpenRouter response received");
    
    res.json(data);
  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ ADD: Handle preflight requests
app.options("/api/chat", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.status(200).send();
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));