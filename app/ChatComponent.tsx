"use client";
import { useState } from "react";
import axios from "axios";

const ChatComponent = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await axios.post(
        "https://api.gemini.com/v1/chat", // Replace with the actual Gemini API endpoint
        {
          messages: [...messages, userMessage],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
          },
        }
      );

      const aiMessage = { role: "assistant", content: response.data.choices[0].message.content };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message to Gemini API:", error);
    }

    setInput("");
  };

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 p-4 rounded-lg shadow-lg w-96">
      <div className="h-64 overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.role === "user" ? "text-right" : "text-left"}`}>
            <span className={`inline-block p-2 rounded-lg ${msg.role === "user" ? "bg-blue-500" : "bg-gray-700"}`}>
              {msg.content}
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 p-2 rounded-lg bg-gray-700 text-white"
          placeholder="Type a message..."
        />
        <button onClick={handleSend} className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;