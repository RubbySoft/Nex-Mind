// components/DG.jsx
import React, { useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref, push, onChildAdded } from "firebase/database";
import { database } from "../../firebaseConfig";
import { Paperclip } from "lucide-react";

const DG = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [uid, setUid] = useState("guest");
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const chatContainerRef = useRef(null);

  const STORE_API = "http://127.0.0.1:5000/api/doppelganger/store";
  const RECALL_API = "http://127.0.0.1:5000/api/doppelganger/recall";
  const MESSAGES_API = "http://127.0.0.1:5000/api/doppelganger/messages";

  const auth = getAuth();
  const messagesRef = ref(database, "doppelgangerChat");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
        loadPreviousMessages(user.uid);
      }
    });

    // Firebase database listener
    const dbUnsubscribe = onChildAdded(messagesRef, (snapshot) => {
      const data = snapshot.val();
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      unsubscribe();
      dbUnsubscribe();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const loadPreviousMessages = async (userId) => {
    try {
      const response = await fetch(`${MESSAGES_API}?uid=${userId}`);
      const data = await response.json();
      if (data.messages) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const handleSendMessage = async () => {
    if ((inputValue.trim() === "" && !imageFile) || !isOnline || isSending) return;

    setIsSending(true);
    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: "user",
      image: imageFile ? URL.createObjectURL(imageFile) : null,
      timestamp: new Date().toISOString(),
    };

    try {
      // Push to Firebase
      await push(messagesRef, userMessage);
      setInputValue("");
      setIsTyping(true);

      let response;

      if (imageFile) {
        const formData = new FormData();
        formData.append("description", inputValue || "Shared image");
        formData.append("image", imageFile);
        formData.append("uid", uid);

        response = await fetch(STORE_API, {
          method: "POST",
          body: formData,
        });
      } else {
        response = await fetch(RECALL_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: inputValue, uid }),
        });
      }

      const data = await response.json();

      const aiMessage = {
        id: Date.now() + 1,
        text: data.message || data.response,
        sender: "ai",
        image: data.memory?.image_path || null,
        timestamp: new Date().toISOString(),
      };

      setTimeout(() => {
        setIsTyping(false);
        push(messagesRef, aiMessage);
        setIsSending(false);
      }, 1500);
    } catch (error) {
      console.error("AI response error:", error);
      const fallback = {
        id: Date.now() + 1,
        text: "Sorry, I couldn't quite process that. Can you try again?",
        sender: "ai",
        timestamp: new Date().toISOString(),
      };
      
      setTimeout(() => {
        setIsTyping(false);
        push(messagesRef, fallback);
        setIsSending(false);
      }, 1500);
    } finally {
      setImageFile(null);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="relative h-screen w-full text-white flex flex-col">
      {/* Background */}
      <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: `url(/img/Doppelagnger.jpg)` }} />

      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 bg-black bg-opacity-0 py-4 text-center z-10">
        <h1 className="text-white text-md font-bold special-font">Doppelganger</h1>
      </div>

      {/* Chat Body */}
      <div
        ref={chatContainerRef}
        className="flex flex-col flex-grow overflow-y-auto pt-20 pb-24 px-4 relative z-10 text-sm"
        style={{
          maskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
        }}
      >
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} mb-2`}>
            {msg.sender === "ai" && <span className="text-white font-bold mr-2">AI</span>}
            <div
              className={`rounded-xl p-3 max-w-[70%] ${
                msg.sender === "user" ? "bg-white bg-opacity-40 text-black" : "bg-black bg-opacity-50 text-white"
              }`}
            >
              <div>
                {msg.text && <p className="mb-2">{msg.text}</p>}
                {msg.image && <img src={msg.image} alt="Attachment" className="rounded-xl w-full" />}
              </div>
            </div>
            {msg.sender === "user" && <span className="text-white font-bold ml-2">You</span>}
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start mb-2">
            <span className="text-white font-bold mr-2">AI</span>
            <div className="bg-black bg-opacity-50 text-white rounded-xl p-3 max-w-[70%] flex space-x-1">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-0 p-4 z-30">
        <div className="flex justify-center">
          <div className="flex items-center w-[80%] md:w-[50%] lg:w-[40%] xl:w-[30%] rounded-full bg-black bg-opacity-50 p-2">
            <label htmlFor="file-upload" className="cursor-pointer text-white hover:text-pink-400 mr-2">
              <Paperclip size={20} />
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="hidden"
            />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
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

export default DG;