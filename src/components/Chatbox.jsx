import { useState } from "react";
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

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;

    // Add user message
    setMessages((prev) => [...prev, { text: inputValue, sender: "user" }]);
    setInputValue("");

    // Simulate bot response after delay
    setTimeout(() => {
      const responses = [
        "I can tell you more about Vishal's skills and projects.",
        "Would you like to see examples of his work?",
        "Vishal specializes in React, GSAP animations, and responsive design.",
        "You can check out his GitHub for code samples.",
        "Let me know if you'd like to connect with him directly.",
      ];
      setMessages((prev) => [
        ...prev,
        {
          text: responses[Math.floor(Math.random() * responses.length)],
          sender: "bot",
        },
      ]);
    }, 1000);
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
          <button onClick={() => setIsMinimized(!isMinimized)}>
            {isMinimized ? "+" : "-"}
          </button>
          <button onClick={onClose}>×</button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender}`}>
                {message.text}
              </div>
            ))}
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Chatbot;
