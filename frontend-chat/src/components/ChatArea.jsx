import { useEffect, useRef } from "react";
import {  AnimatePresence } from "framer-motion";
import {
  Menu,
  Sun,
  Moon,
  Sparkles,
  Share2,
  MoreVertical,
  Zap,
} from "lucide-react";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

// Typing indicator
function TypingIndicator({ darkMode }) {
  return (
    <motion.div
      className="flex gap-3 items-center"
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
    >
      <motion.div
        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
          darkMode ? "bg-gray-700 border border-gray-600" : "bg-white border border-gray-200 shadow-sm"
        }`}
        animate={{ rotate: [0, -5, 5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <Sparkles size={13} className="text-blue-500" />
      </motion.div>

      <div
        className={`px-4 py-3 rounded-2xl rounded-tl-sm ${
          darkMode ? "bg-gray-800 border border-gray-700/60" : "bg-white border border-gray-100"
        }`}
      >
        <div className="flex gap-1.5 items-center h-4">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-2 h-2 rounded-full bg-blue-400"
              animate={{ y: [0, -6, 0], opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 0.7,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Empty state
function EmptyState({ darkMode }) {
  const suggestions = [
    "Phân tích dữ liệu kinh doanh của tôi",
    "Viết email chuyên nghiệp",
    "Giải thích một khái niệm phức tạp",
    "Tạo kế hoạch dự án",
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 350, damping: 25 },
    },
  };

  return (
    <motion.div
      className="flex-1 flex flex-col items-center justify-center px-6 py-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Animated icon */}
      <motion.div
        variants={itemVariants}
        className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mb-4 shadow-lg shadow-blue-600/30 relative overflow-hidden"
        whileHover={{ scale: 1.08, rotate: 5 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {/* Pulse ring */}
        <motion.div
          className="absolute inset-0 rounded-2xl bg-blue-400"
          animate={{ scale: [1, 1.4], opacity: [0.4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
        />
        <motion.div
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles size={26} className="text-white relative z-10" />
        </motion.div>
      </motion.div>

      <motion.h2
        variants={itemVariants}
        className={`text-xl font-semibold mb-2 ${darkMode ? "text-gray-100" : "text-gray-800"}`}
      >
        Tôi có thể giúp gì cho bạn?
      </motion.h2>

      <motion.p
        variants={itemVariants}
        className={`text-sm mb-8 text-center max-w-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
      >
        Hãy đặt câu hỏi hoặc chọn một gợi ý bên dưới để bắt đầu.
      </motion.p>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-sm"
        variants={containerVariants}
      >
        {suggestions.map((s, i) => (
          <motion.button
            key={s}
            variants={itemVariants}
            className={`text-left text-xs px-3 py-3 rounded-xl border transition-colors duration-150 ${
              darkMode
                ? "bg-gray-800 border-gray-700 text-gray-300 hover:border-blue-500/50 hover:bg-gray-750 hover:text-white"
                : "bg-white border-gray-200 text-gray-600 hover:bg-blue-50 hover:text-blue-700 shadow-sm hover:border-blue-300"
            }`}
            whileHover={{
              scale: 1.03,
              y: -2,
              boxShadow: darkMode
                ? "0 8px 24px rgba(0,0,0,0.3)"
                : "0 8px 20px rgba(37,99,235,0.1)",
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <span className="flex items-center gap-1.5">
              <motion.span
                className="text-blue-400 opacity-60"
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
              >
                <Zap size={10} />
              </motion.span>
              {s}
            </span>
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
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

  const headerIcons = [
    { icon: Share2, label: "Chia sẻ", onClick: undefined },
    {
      icon: darkMode ? Sun : Moon,
      label: darkMode ? "Chuyển Light mode" : "Chuyển Dark mode",
      onClick: onToggleDark,
      animate: true,
    },
    { icon: MoreVertical, label: "Thêm", onClick: undefined },
  ];

  return (
    <div className={`flex flex-col flex-1 h-full min-w-0 ${bgClass}`}>
      {/* Header */}
      <motion.header
        className={`flex items-center gap-3 px-4 py-3 border-b shrink-0 ${headerClass}`}
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Sidebar toggle (mobile) */}
        <motion.button
          onClick={onToggleSidebar}
          className={`p-2 rounded-lg transition-colors lg:hidden ${iconBtnClass}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9, rotate: -5 }}
        >
          <Menu size={18} />
        </motion.button>

        {/* Chat title */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeChat?.id || "new"}
            className="flex-1 min-w-0"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
          >
            <h1 className="text-sm font-semibold truncate">
              {activeChat?.title || "Cuộc trò chuyện mới"}
            </h1>
            <p className={`text-[11px] ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
              GPT-4o ·{" "}
              <motion.span
                key={messages.length}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 500 }}
                style={{ display: "inline-block" }}
              >
                {messages.length}
              </motion.span>{" "}
              tin nhắn
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          {headerIcons.map(({  label, onClick, animate: shouldAnim }, i) => (
            <motion.button
              key={label}
              onClick={onClick}
              className={`p-2 rounded-lg transition-colors ${iconBtnClass}`}
              title={label}
              whileHover={{ scale: 1.1, y: -1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i, type: "spring", stiffness: 400 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={label}
                  initial={shouldAnim ? { rotate: -90, opacity: 0, scale: 0.6 } : {}}
                  animate={shouldAnim ? { rotate: 0, opacity: 1, scale: 1 } : {}}
                  exit={shouldAnim ? { rotate: 90, opacity: 0, scale: 0.6 } : {}}
                  transition={{ duration: 0.2 }}
                >
                  <Icon size={16} />
                </motion.div>
              </AnimatePresence>
            </motion.button>
          ))}
        </div>
      </motion.header>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5 scrollbar-thin">
        <AnimatePresence mode="wait">
          {messages.length === 0 ? (
            <motion.div
              key="empty"
              className="h-full flex"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25 }}
            >
              <EmptyState darkMode={darkMode} />
            </motion.div>
          ) : (
            <motion.div
              key="messages"
              className="space-y-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} darkMode={darkMode} />
                ))}
              </AnimatePresence>

              <AnimatePresence>
                {loading && <TypingIndicator darkMode={darkMode} />}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <MessageInput onSend={onSend} loading={loading} darkMode={darkMode} />
    </div>
  );
}