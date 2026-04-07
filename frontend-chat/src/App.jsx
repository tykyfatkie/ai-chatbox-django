/* eslint-disable no-unused-vars */
import { useState, useCallback } from "react";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import { chatHistory as initialHistory, initialMessages } from "./data/mockData";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState(initialHistory);
  const [messages, setMessages] = useState(initialMessages);
  const [loading, setLoading] = useState(false);
  const [activeChat, setActiveChat] = useState(initialHistory.find((c) => c.active));

  const toggleDarkMode = () => setDarkMode((d) => !d);
  const toggleSidebar = () => setSidebarOpen((s) => !s);

  const handleNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: "Cuộc trò chuyện mới",
      preview: "",
      time: "Vừa xong",
      active: true,
    };
    setChatHistory((prev) =>
      [newChat, ...prev.map((c) => ({ ...c, active: false }))]
    );
    setActiveChat(newChat);
    setMessages([]);
    setSidebarOpen(false);
  };

  const handleSelectChat = (id) => {
    setChatHistory((prev) =>
      prev.map((c) => ({ ...c, active: c.id === id }))
    );
    const selected = chatHistory.find((c) => c.id === id);
    setActiveChat(selected);
    // In a real app, you'd load messages for this chat
    if (id === 1) setMessages(initialMessages);
    else setMessages([]);
    setSidebarOpen(false);
  };

  const handleSend = useCallback(async (text) => {
    if (!text) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text,
      time: new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      avatar: "ND",
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);

    // Update sidebar title if new chat
    if (activeChat?.title === "Cuộc trò chuyện mới") {
      const title = text.slice(0, 40) + (text.length > 40 ? "..." : "");
      setChatHistory((prev) =>
        prev.map((c) => (c.active ? { ...c, title } : c))
      );
    }

    try {
      // Call Django backend
      const response = await axios.post("http://127.0.0.1:8000/api/chat/", {
        message: text,
      });

      const botMsg = {
        id: Date.now() + 1,
        sender: "bot",
        text: response.data.reply,
        time: new Date().toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        avatar: "AI",
      };
      setMessages([...newMessages, botMsg]);
    } catch (error) {
      // Fallback mock reply for UI preview
      const botMsg = {
        id: Date.now() + 1,
        sender: "bot",
        text: "Đây là phản hồi mẫu từ AI. Trong môi trường thực tế, câu trả lời sẽ được trả về từ backend Django của bạn. Hãy đảm bảo server đang chạy tại `http://127.0.0.1:8000`.",
        time: new Date().toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        avatar: "AI",
      };
      setMessages([...newMessages, botMsg]);
    }

    setLoading(false);
  }, [messages, activeChat]);

  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? "dark bg-gray-900" : "bg-white"}`}>
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        chatHistory={chatHistory}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        darkMode={darkMode}
      />

      {/* Main chat area */}
      <ChatArea
        messages={messages}
        loading={loading}
        onSend={handleSend}
        darkMode={darkMode}
        onToggleDark={toggleDarkMode}
        onToggleSidebar={toggleSidebar}
        activeChat={activeChat}
      />
    </div>
  );
}