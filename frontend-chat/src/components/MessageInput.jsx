import { useRef, useEffect, useState } from "react";
import { Send, Paperclip, Mic, X } from "lucide-react";

export default function MessageInput({ onSend, loading, darkMode }) {
  const [input, setInput] = useState("");
  const [attachedFile, setAttachedFile] = useState(null);
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

  const wrapperClass = darkMode
    ? "bg-gray-900 border-gray-700/60"
    : "bg-white border-gray-200";

  const containerClass = darkMode
    ? "bg-gray-800 border-gray-700 focus-within:border-blue-500/60 focus-within:ring-1 focus-within:ring-blue-500/20"
    : "bg-white border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/20";

  const textareaClass = darkMode
    ? "text-gray-100 placeholder-gray-500"
    : "text-gray-800 placeholder-gray-400";

  const iconBtnClass = darkMode
    ? "text-gray-500 hover:text-gray-300 hover:bg-gray-700"
    : "text-gray-400 hover:text-gray-600 hover:bg-gray-100";

  return (
    <div className={`border-t px-4 py-3 ${wrapperClass}`}>
      {/* Attached file chip */}
      {attachedFile && (
        <div className={`mb-2 flex items-center gap-2 px-3 py-1.5 rounded-lg w-fit text-xs ${darkMode ? "bg-gray-700 text-gray-300" : "bg-blue-50 text-blue-700 border border-blue-200"}`}>
          <Paperclip size={11} />
          <span className="max-w-50 truncate">{attachedFile.name}</span>
          <button
            onClick={() => setAttachedFile(null)}
            className="ml-1 hover:text-red-500 transition-colors"
          >
            <X size={11} />
          </button>
        </div>
      )}

      {/* Input container */}
      <div className={`flex items-end gap-2 border rounded-2xl px-3 py-2 transition-all duration-200 ${containerClass}`}>
        {/* File upload */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.png,.jpg,.jpeg"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className={`p-1.5 rounded-lg transition-colors shrink-0 mb-0.5 ${iconBtnClass}`}
          title="Đính kèm tệp"
        >
          <Paperclip size={17} />
        </button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Nhập tin nhắn... (Shift+Enter để xuống dòng)"
          className={`
            flex-1 resize-none bg-transparent outline-none text-sm leading-relaxed py-1
            scrollbar-thin max-h-40
            ${textareaClass}
          `}
        />

        {/* Mic button */}
        <button
          className={`p-1.5 rounded-lg transition-colors shrink-0 mb-0.5 ${iconBtnClass}`}
          title="Nhập bằng giọng nói"
        >
          <Mic size={17} />
        </button>

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={loading || (!input.trim() && !attachedFile)}
          title="Gửi (Enter)"
          className={`
            p-2 rounded-xl shrink-0 mb-0.5 transition-all duration-150
            ${input.trim() || attachedFile
              ? "bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-sm hover:shadow-md"
              : darkMode
              ? "bg-gray-700 text-gray-500 cursor-not-allowed"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }
            ${loading ? "opacity-60 cursor-not-allowed" : ""}
          `}
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send size={15} />
          )}
        </button>
      </div>

      {/* Footer hint */}
      <p className={`text-center text-[10px] mt-2 ${darkMode ? "text-gray-600" : "text-gray-400"}`}>
        AI có thể mắc lỗi. Hãy kiểm tra thông tin quan trọng.
      </p>
    </div>
  );
}