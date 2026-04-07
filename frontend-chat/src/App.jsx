/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";

const STORAGE_KEY = "frontend-chat-history";

const formatPreview = (text) =>
  text.length > 40 ? `${text.slice(0, 40)}...` : text;

const formatTime = () =>
  new Date().toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

const createNewChat = () => ({
  id: Date.now(),
  title: "Cuộc trò chuyện mới",
  preview: "",
  time: "Vừa xong",
  active: true,
  messages: [],
});

const loadSavedHistory = () => {
  if (typeof window === "undefined") return null;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

export default function App() {
  const initialHistory = loadSavedHistory() || [createNewChat()];
  const initialActiveChat = initialHistory.find((c) => c.active) || initialHistory[0];

  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState(initialHistory);
  const [messages, setMessages] = useState(initialActiveChat.messages || []);
  const [loading, setLoading] = useState(false);
  const [activeChat, setActiveChat] = useState(initialActiveChat);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(chatHistory));
  }, [chatHistory]);

  const toggleDarkMode = () => setDarkMode((d) => !d);
  const toggleSidebar = () => setSidebarOpen((s) => !s);

  const handleNewChat = () => {
    const newChat = createNewChat();
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
    if (!selected) return;

    setActiveChat(selected);
    setMessages(selected.messages || []);
    setSidebarOpen(false);
  };

  const handleSend = useCallback(
    async (text) => {
      if (!text.trim() || !activeChat) return;

      const userMsg = {
        id: Date.now(),
        sender: "user",
        text,
        time: formatTime(),
        avatar: "ND",
      };

      const newMessages = [...messages, userMsg];
      const updatedChat = {
        ...activeChat,
        preview: formatPreview(text),
        time: userMsg.time,
        messages: newMessages,
      };

      setMessages(newMessages);
      setActiveChat(updatedChat);
      setChatHistory((prev) =>
        prev.map((c) =>
          c.id === updatedChat.id
            ? { ...updatedChat, active: true }
            : { ...c, active: false }
        )
      );
      setLoading(true);

      const saveBotResponse = (botText) => {
        const botMsg = {
          id: Date.now() + 1,
          sender: "bot",
          text: botText,
          time: formatTime(),
          avatar: "AI",
        };
        const finalMessages = [...newMessages, botMsg];
        const finalChat = {
          ...updatedChat,
          preview: formatPreview(botText),
          time: botMsg.time,
          messages: finalMessages,
        };

        setMessages(finalMessages);
        setActiveChat(finalChat);
        setChatHistory((prev) =>
          prev.map((c) =>
            c.id === finalChat.id
              ? { ...finalChat, active: true }
              : { ...c, active: false }
          )
        );
      };

      try {
        const response = await axios.post(import.meta.env.VITE_API_URL, {
          message: text,
        });
        saveBotResponse(response.data.reply);
      } catch (error) {
        saveBotResponse(
          "Đây là phản hồi mẫu từ AI. Trong môi trường thực tế, câu trả lời sẽ được trả về từ backend Django của bạn. Hãy đảm bảo server đang chạy tại `http://127.0.0.1:8000`."
        );
      } finally {
        setLoading(false);
      }
    },
    [activeChat, messages]
  );

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
