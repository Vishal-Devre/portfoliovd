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
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === "" || isLoading) return;

    const userMessage = { text: inputValue, sender: "user" };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue("");
    setIsLoading(true);

    try {
      const payload = {
        messages: [
          { role: "system", content: "You are a helpful portfolio assistant..." },
          ...updatedMessages.slice(-4).map((msg) => ({
            role: msg.sender === "bot" ? "assistant" : "user",
            content: msg.text,
          })),
        ],
      };

      const response = await fetch("http://localhost:5173/api/chat", {
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
        { text: "Sorry, I'm having trouble responding right now.", sender: "bot" },
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
          <button className="buttonminimise" onClick={() => setIsMinimized(!isMinimized)}>
            {isMinimized ? <MdKeyboardArrowUp size={16} /> : <MdRemove size={16} />}
          </button>
          <button onClick={onClose}>
            <MdClose size={16} />
          </button>
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
            <button onClick={handleSendMessage} disabled={isLoading}>
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Chatbot;
