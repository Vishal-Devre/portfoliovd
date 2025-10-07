import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

//Health check route (REQUIRED for Railway)
app.get("/", (req, res) => {
  res.json({ message: "Portfolio Chatbot API is running!" });
});

app.post("/api/chat", async (req, res) => {
  try {
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
    res.json(data);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ FIX THIS: Use environment port for Railway
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));