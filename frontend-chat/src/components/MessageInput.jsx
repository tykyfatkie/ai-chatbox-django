import { useRef, useEffect, useState } from "react";
import {  AnimatePresence } from "framer-motion";
import { Send, Paperclip, Mic, X } from "lucide-react";

export default function MessageInput({ onSend, loading, darkMode }) {
  const [input, setInput] = useState("");
  const [attachedFile, setAttachedFile] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
  }, [input]);

  const handleSend = () => {
    if (!input.trim() && !attachedFile) return;
    onSend(input.trim());
    setInput("");
    setAttachedFile(null);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setAttachedFile(file);
  };

  const canSend = (input.trim() || attachedFile) && !loading;

  const wrapperClass = darkMode
    ? "bg-gray-900 border-gray-700/60"
    : "bg-white border-gray-200";

  const textareaClass = darkMode
    ? "text-gray-100 placeholder-gray-500"
    : "text-gray-800 placeholder-gray-400";

  const iconBtnClass = darkMode
    ? "text-gray-500 hover:text-gray-300 hover:bg-gray-700"
    : "text-gray-400 hover:text-gray-600 hover:bg-gray-100";

  return (
    <motion.div
      className={`border-t px-4 py-3 ${wrapperClass}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.1 }}
    >
      {/* Attached file chip */}
      <AnimatePresence>
        {attachedFile && (
          <motion.div
            className={`mb-2 flex items-center gap-2 px-3 py-1.5 rounded-lg w-fit text-xs ${
              darkMode ? "bg-gray-700 text-gray-300" : "bg-blue-50 text-blue-700 border border-blue-200"
            }`}
            initial={{ opacity: 0, scale: 0.85, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: -8 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <motion.span animate={{ rotate: [0, -10, 0] }} transition={{ duration: 0.3 }}>
              <Paperclip size={11} />
            </motion.span>
            <span className="max-w-50 truncate">{attachedFile.name}</span>
            <motion.button
              onClick={() => setAttachedFile(null)}
              className="ml-1 hover:text-red-500 transition-colors"
              whileHover={{ scale: 1.2, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.15 }}
            >
              <X size={11} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input container */}
      <motion.div
        className={`flex items-end gap-2 border rounded-2xl px-3 py-2 transition-colors duration-200 ${
          darkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-300"
        }`}
        animate={{
          borderColor: isFocused
            ? darkMode ? "rgba(59,130,246,0.6)" : "rgb(59,130,246)"
            : darkMode ? "rgba(55,65,81,1)" : "rgb(209,213,219)",
          boxShadow: isFocused
            ? darkMode
              ? "0 0 0 3px rgba(59,130,246,0.12), 0 4px 16px rgba(0,0,0,0.2)"
              : "0 0 0 3px rgba(59,130,246,0.12), 0 4px 16px rgba(0,0,0,0.06)"
            : "0 1px 4px rgba(0,0,0,0.04)",
        }}
        transition={{ duration: 0.2 }}
      >
        {/* File upload */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.png,.jpg,.jpeg"
        />
        <motion.button
          onClick={() => fileInputRef.current?.click()}
          className={`p-1.5 rounded-lg transition-colors shrink-0 mb-0.5 ${iconBtnClass}`}
          title="Đính kèm tệp"
          whileHover={{ scale: 1.12, rotate: -15 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Paperclip size={17} />
        </motion.button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          rows={1}
          placeholder="Nhập tin nhắn... (Shift+Enter để xuống dòng)"
          className={`flex-1 resize-none bg-transparent outline-none text-sm leading-relaxed py-1 scrollbar-thin max-h-40 ${textareaClass}`}
        />

        {/* Mic button */}
        <motion.button
          className={`p-1.5 rounded-lg transition-colors shrink-0 mb-0.5 ${
            isRecording ? "text-red-500 bg-red-50" : iconBtnClass
          }`}
          title="Nhập bằng giọng nói"
          onClick={() => setIsRecording((v) => !v)}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.92 }}
          animate={isRecording ? { scale: [1, 1.1, 1] } : { scale: 1 }}
          transition={isRecording ? { repeat: Infinity, duration: 0.8 } : {}}
        >
          <Mic size={17} />
          {isRecording && (
            <motion.span
              className="absolute inset-0 rounded-lg bg-red-400/20"
              animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            />
          )}
        </motion.button>

        {/* Send button */}
        <motion.button
          onClick={handleSend}
          disabled={!canSend}
          title="Gửi (Enter)"
          className={`
            p-2 rounded-xl shrink-0 mb-0.5 relative overflow-hidden
            ${canSend
              ? "bg-blue-600 text-white"
              : darkMode
              ? "bg-gray-700 text-gray-500 cursor-not-allowed"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }
          `}
          animate={
            canSend
              ? { scale: 1, boxShadow: "0 4px 12px rgba(37,99,235,0.35)" }
              : { scale: 1, boxShadow: "none" }
          }
          whileHover={canSend ? { scale: 1.08, boxShadow: "0 6px 20px rgba(37,99,235,0.5)" } : {}}
          whileTap={canSend ? { scale: 0.9 } : {}}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          {/* Ripple on send */}
          <AnimatePresence>
            {canSend && (
              <motion.span
                className="absolute inset-0 bg-white/20 rounded-xl"
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 2, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                key="ripple"
              />
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                transition={{ duration: 0.15 }}
              >
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              </motion.div>
            ) : (
              <motion.div
                key="send"
                initial={{ opacity: 0, x: -8, y: 8 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: 8, y: -8 }}
                transition={{ duration: 0.15 }}
              >
                <Send size={15} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>

      {/* Footer hint */}
      <motion.p
        className={`text-center text-[10px] mt-2 ${darkMode ? "text-gray-600" : "text-gray-400"}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        AI có thể mắc lỗi. Hãy kiểm tra thông tin quan trọng.
      </motion.p>
    </motion.div>
  );
}