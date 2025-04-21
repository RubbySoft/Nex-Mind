import React, { useState, useEffect, useRef } from "react";
import {
  ref,
  push,
  onChildAdded,
} from "firebase/database";
import { database } from "../../firebaseConfig";

const ChatUI = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false); // Prevent double trigger
  const chatContainerRef = useRef(null);
  const API_URL = "http://127.0.0.1:5000/api/chat";

  const randomResponses = [
    "Baby, I’m caught up with something right now, but I’ll be back soon! Don’t miss me too much. ❤️",
    "I wish I could talk, but I’m super busy. Stay free for me, okay? 😘",
    "Hey love, I’m tied up at the moment. But as soon as I’m free, you’re my first call. 💕",
  ];

  const messagesRef = ref(database, "chatMessages");

  useEffect(() => {
    const unsubscribe = onChildAdded(messagesRef, (snapshot) => {
      const data = snapshot.val();
      setMessages((prev) => [...prev, data]);
    });

    return () => unsubscribe();
  }, []);

  const handleSendMessage = async () => {
    if (inputValue.trim() === "" || isSending) return;

    setIsSending(true);
    const userMsg = {
      id: Date.now(),
      text: inputValue,
      sender: "user",
    };

    try {
      await push(messagesRef, userMsg);
      setInputValue("");
      setIsTyping(true);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputValue, type: "girlfriend-ai" }),
      });

      const data = await response.json();
      const aiMsg = {
        id: Date.now() + 1,
        text: data.response,
        sender: "ai",
      };

      setTimeout(() => {
        setIsTyping(false);
        push(messagesRef, aiMsg);
        setIsSending(false);
      }, 1500);
    } catch (error) {
      console.error("API error:", error);
      const aiMsg = {
        id: Date.now() + 1,
        text: randomResponses[Math.floor(Math.random() * randomResponses.length)],
        sender: "ai",
      };

      setTimeout(() => {
        setIsTyping(false);
        push(messagesRef, aiMsg);
        setIsSending(false);
      }, 1500);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div className="relative h-screen w-full text-white flex flex-col">
      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(/img/AnimeBg.jpg)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.8,
            zIndex: -2,
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 z-[-1]" />
      </div>

      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 py-4 text-center z-10">
        <h1 className="text-white text-md font-bold special-font">Girlfriend</h1>
      </div>

      {/* Chat Container */}
      <div
        ref={chatContainerRef}
        className="flex flex-col flex-grow overflow-y-auto pt-20 pb-24 px-4 relative z-10 font-general text-sm"
        style={{
          maskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
        }}
      >
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} mb-2`}>
            {msg.sender === "ai" && <span className="text-white mr-2">AI</span>}
            <div
              className={`rounded-xl p-3 max-w-[70%] ${
                msg.sender === "user"
                  ? "bg-white bg-opacity-40 text-black"
                  : "bg-black bg-opacity-50 text-white"
              }`}
            >
              {msg.text}
            </div>
            {msg.sender === "user" && <span className="text-white ml-2">You</span>}
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start mb-2">
            <span className="text-white font-bold mr-2">AI</span>
            <div className="bg-black bg-opacity-50 text-white rounded-xl p-3 max-w-[70%]">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-0 p-4 z-30">
        <div className="flex justify-center">
          <div className="flex items-center w-[80%] md:w-[50%] lg:w-[40%] xl:w-[30%] rounded-full bg-black bg-opacity-50 p-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 bg-transparent text-white outline-none p-2 w-full rounded-full"
            />
            <button
              onClick={handleSendMessage}
              disabled={isSending}
              className={`bg-white bg-opacity-20 text-white rounded-full px-4 py-2 hover:bg-opacity-30 transition ${
                isSending ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;
