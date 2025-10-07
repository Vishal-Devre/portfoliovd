import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();

// ✅ FIXED: Comprehensive CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:3000", 
      "https://vishal-devre.vercel.app",
      "https://your-portfolio.vercel.app"
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes("railway")) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));

// ✅ Handle preflight requests globally
app.options('*', cors());

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

// Test route for CORS
app.get("/api/test", (req, res) => {
  res.json({ 
    message: "CORS test successful!",
    origin: req.headers.origin,
    method: "GET"
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    console.log("📨 Received POST request to /api/chat");
    console.log("Origin:", req.headers.origin);
    console.log("Body:", JSON.stringify(req.body, null, 2));

    // ✅ Add CORS headers to response
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (!req.body.messages) {
      return res.status(400).json({ error: "Messages are required" });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://vishal-devre.vercel.app/",
        "X-Title": "Portfolio Chatbot"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: req.body.messages,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ OpenRouter response received");
    
    res.json(data);
  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).json({ 
      error: "Internal server error",
      details: error.message 
    });
  }
});

// ✅ Specific OPTIONS handler for /api/chat
app.options("/api/chat", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  res.status(200).send();
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/`);
  console.log(`📍 Test endpoint: http://localhost:${PORT}/api/test`);
});