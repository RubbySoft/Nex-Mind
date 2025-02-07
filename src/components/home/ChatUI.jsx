import React, { useState, useEffect, useRef } from "react";

const ChatUI = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false); // Track typing animation
  const API_URL = "http://localhost:5000/api/chat"; // Flask API URL
  const chatContainerRef = useRef(null); // Ref for the chat container

  // Random responses for when the API is offline
  const randomResponses = [
    "Baby, I’m caught up with something right now, but I’ll be back soon! Don’t miss me too much. ❤️",
    "I wish I could talk, but I’m super busy. Stay free for me, okay? 😘",
    "Hey love, I’m tied up at the moment. But as soon as I’m free, you’re my first call. 💕",
    "I know you’re free and waiting, and I feel bad I can’t talk. But soon, my love! 🥰",
    "Busy for now, but I’m keeping you in my heart always. Don’t go anywhere! ❤️",
    "I’m stuck in work mode right now 😩, but don’t you dare have fun without me! 😏💕",
    "You’re free, and I’m busy? That’s unfair! Keep missing me until I’m back. 😘",
    "I’d rather be talking to you, but duty calls! Keep your phone ready for when I escape. 📱💖",
    "I can’t talk right now, but just imagine me giving you the biggest hug. 🥺🤗",
    "Hold that thought, baby! I’ll be back to steal all your attention soon. 😏🔥",
    "I know you’re free, and I wish I was too! Just know I love you and will talk soon. ❤️",
    "Even if I’m busy, I’m still yours. Don’t go too far, my love. 🥰",
    "I might not be able to talk, but my heart is always talking to you. 💕",
    "I’ll be done soon, my love. Wait for me, okay? 😘",
    "You’re free, and I’m stuck working? This isn’t fair! But I promise to make it up to you. ❤️",
  ];

  // Function to handle sending a message
  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;

    const newMessage = { id: messages.length + 1, text: inputValue, sender: "user" };
    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");

    // Simulate typing animation
    setIsTyping(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputValue, type: "girlfriend-ai" }),
      });

      const data = await response.json();
      if (data.response) {
        // Simulate typing delay
        setTimeout(() => {
          setIsTyping(false);
          setMessages((prev) => [
            ...prev,
            { id: prev.length + 1, text: data.response, sender: "ai" },
          ]);
        }, 1500); // 1.5 seconds delay
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
      // If API fails, send a random response
      setTimeout(() => {
        setIsTyping(false);
        const randomResponse = randomResponses[Math.floor(Math.random() * randomResponses.length)];
        setMessages((prev) => [
          ...prev,
          { id: prev.length + 1, text: randomResponse, sender: "ai" },
        ]);
      }, 1500); // 1.5 seconds delay
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // Scroll to the bottom of the chat container when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="relative h-screen w-full text-white flex flex-col">
      {/* Background Shape (Trapezoidal) */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(/img/AnimeBg.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: -1,
        }}
      />

      {/* Navbar with Girlfriend's Name */}
      <div className="fixed top-0 left-0 right-0 bg-black bg-opacity-70 py-4 text-center z-10">
        <h1 className="text-2xl font-bold text-white">Girlfriend</h1>
      </div>

      {/* Chat Messages (Flowing Downward) */}
      <div
        ref={chatContainerRef}
        className="flex flex-col flex-grow overflow-y-auto pt-20 pb-24 px-4 relative z-10"
        style={{
          maskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} mb-2`}
          >
            {msg.sender === "ai" && (
              <span className="text-white font-bold mr-2">AI</span>
            )}

            <div
              className={`rounded-xl p-3 max-w-[70%] ${
                msg.sender === "user"
                  ? "bg-white bg-opacity-40 text-black"
                  : "bg-black bg-opacity-50 text-white"
              }`}
            >
              {msg.text}
            </div>

            {msg.sender === "user" && (
              <span className="text-white font-bold ml-2">You</span>
            )}
          </div>
        ))}

        {/* Typing Animation */}
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

      {/* Input Box and Send Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-20 p-4 z-30">
        <div className="flex items-center rounded-lg bg-black bg-opacity-30 p-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 bg-transparent text-white outline-none p-2"
          />
          <button
            onClick={handleSendMessage}
            className="bg-white bg-opacity-20 text-white rounded-lg px-4 py-2 hover:bg-opacity-30 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;