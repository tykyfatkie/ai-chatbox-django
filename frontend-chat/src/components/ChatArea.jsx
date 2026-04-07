import { useEffect, useRef } from "react";
import {
  Menu,
  Sun,
  Moon,
  Sparkles,
  Share2,
  MoreVertical,
} from "lucide-react";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

// Typing indicator
function TypingIndicator({ darkMode }) {
  return (
    <div className="flex gap-3 items-center">
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
          darkMode ? "bg-gray-700 border border-gray-600" : "bg-white border border-gray-200 shadow-sm"
        }`}
      >
        <Sparkles size={13} className="text-blue-500 animate-pulse" />
      </div>
      <div
        className={`px-4 py-3 rounded-2xl rounded-tl-sm ${
          darkMode ? "bg-gray-800 border border-gray-700/60" : "bg-white border border-gray-100"
        }`}
      >
        <div className="flex gap-1.5 items-center h-4">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:0ms]" />
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:150ms]" />
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}

// Empty state when no messages
function EmptyState({ darkMode }) {
  const suggestions = [
    "Phân tích dữ liệu kinh doanh của tôi",
    "Viết email chuyên nghiệp",
    "Giải thích một khái niệm phức tạp",
    "Tạo kế hoạch dự án",
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
      <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mb-4 shadow-lg shadow-blue-600/30">
        <Sparkles size={26} className="text-white" />
      </div>
      <h2 className={`text-xl font-semibold mb-2 ${darkMode ? "text-gray-100" : "text-gray-800"}`}>
        Tôi có thể giúp gì cho bạn?
      </h2>
      <p className={`text-sm mb-8 text-center max-w-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
        Hãy đặt câu hỏi hoặc chọn một gợi ý bên dưới để bắt đầu.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-sm">
        {suggestions.map((s) => (
          <button
            key={s}
            className={`text-left text-xs px-3 py-3 rounded-xl border transition-all duration-150 hover:border-blue-400 hover:-translate-y-0.5 ${
              darkMode
                ? "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-750 hover:text-white"
                : "bg-white border-gray-200 text-gray-600 hover:bg-blue-50 hover:text-blue-700 shadow-sm"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ChatArea({
  messages,
  loading,
  onSend,
  darkMode,
  onToggleDark,
  onToggleSidebar,
  activeChat,
}) {
  const bottomRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const headerClass = darkMode
    ? "bg-gray-900 border-gray-700/60 text-gray-100"
    : "bg-white border-gray-200 text-gray-800";

  const bgClass = darkMode ? "bg-gray-900" : "bg-slate-50";

  const iconBtnClass = darkMode
    ? "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100";

  return (
    <div className={`flex flex-col flex-1 h-full min-w-0 ${bgClass}`}>
      {/* Header */}
      <header
        className={`flex items-center gap-3 px-4 py-3 border-b shrink-0 ${headerClass}`}
      >
        {/* Sidebar toggle (mobile) */}
        <button
          onClick={onToggleSidebar}
          className={`p-2 rounded-lg transition-colors lg:hidden ${iconBtnClass}`}
        >
          <Menu size={18} />
        </button>

        {/* Chat title */}
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-semibold truncate">
            {activeChat?.title || "Cuộc trò chuyện mới"}
          </h1>
          <p className={`text-[11px] ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
            GPT-4o · {messages.length} tin nhắn
          </p>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          <button
            className={`p-2 rounded-lg transition-colors ${iconBtnClass}`}
            title="Chia sẻ"
          >
            <Share2 size={16} />
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={onToggleDark}
            className={`p-2 rounded-lg transition-colors ${iconBtnClass}`}
            title={darkMode ? "Chuyển Light mode" : "Chuyển Dark mode"}
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button
            className={`p-2 rounded-lg transition-colors ${iconBtnClass}`}
          >
            <MoreVertical size={16} />
          </button>
        </div>
      </header>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5 scrollbar-thin">
        {messages.length === 0 ? (
          <EmptyState darkMode={darkMode} />
        ) : (
          <>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} darkMode={darkMode} />
            ))}
            {loading && <TypingIndicator darkMode={darkMode} />}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <MessageInput onSend={onSend} loading={loading} darkMode={darkMode} />
    </div>
  );
}