import { useEffect, useRef, useState } from "react";
import { MdClose, MdKeyboardArrowUp, MdRemove } from "react-icons/md";
import "./Chatbot.css";

const Chatbot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      text: "Hi there! I'm your portfolio assistant. How can I help you today?",
      sender: "bot",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [quickQuestions, setQuickQuestions] = useState([]);

  const messagesEndRef = useRef(null);

  // Big pool of predefined questions
  const allQuestions = [
    "Where do you live?",
    "Tell me about your projects",
    "What skills do you have?",
    "How can I contact you?",
    "What is your education background?",
    "Do you have any experience with AI?",
    "What is your favorite project?",
    "Tell me about your portfolio website",
    "Which technologies do you use?",
    "How did you learn programming?",
    "What are your hobbies?",
    "What motivates you?",
    "Do you have social media links?",
    "Can I collaborate with you?",
  ];

  // On component mount, pick 3–4 random questions
  useEffect(() => {
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    setQuickQuestions(shuffled.slice(0, 4));
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleQuickQuestionClick = (question) => {
    setInputValue(question);
    handleSendMessage(question);
  };

  const handleSendMessage = async (overrideMessage) => {
    const messageToSend = overrideMessage ?? inputValue;
    if (messageToSend.trim() === "" || isLoading) return;

    const userMessage = { text: messageToSend, sender: "user" };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue("");
    setIsLoading(true);

    try {
      const payload = {
        messages: [
          {
            role: "system",
            content: "You are a helpful portfolio assistant. Answer questions about Vishal Devre's portfolio, skills, projects, and experience. Keep responses concise and helpful.",
          },
          ...updatedMessages.slice(-4).map((msg) => ({
            role: msg.sender === "bot" ? "assistant" : "user",
            content: msg.text,
          })),
        ],
      };

      // ✅ FIXED: Correct URL with /api/chat endpoint
      const BACKEND_URL = "https://portfoliovd-production.up.railway.app/api/chat";

      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.choices || !data.choices[0]) {
        throw new Error("Invalid API response format");
      }

      const botMessage = data.choices[0].message.content;
      setMessages((prev) => [...prev, { text: botMessage, sender: "bot" }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I'm having trouble responding right now. Please try again later.",
          sender: "bot",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`chatbot-container ${isOpen ? "open" : ""} ${
        isMinimized ? "minimized" : ""
      }`}
    >
      <div className="chatbot-header">
        <h3>Portfolio Assistant</h3>
        <div className="chatbot-actions">
          <button
            className="buttonminimise"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? (
              <MdKeyboardArrowUp size={16} />
            ) : (
              <MdRemove size={16} />
            )}
          </button>
          <button onClick={onClose}>
            <MdClose size={16} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Quick Questions Section - Only show when it's the first message */}
          {messages.length === 1 && (
            <div className="quick-questions">
              <p>Quick questions:</p>
              <div className="quick-questions-grid">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    className="quick-question-btn"
                    onClick={() => handleQuickQuestionClick(question)}
                    disabled={isLoading}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender}`}>
                {message.text}
              </div>
            ))}
            {isLoading && (
              <div className="message bot">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={isLoading}
            />
            <button onClick={() => handleSendMessage()} disabled={isLoading}>
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Chatbot;