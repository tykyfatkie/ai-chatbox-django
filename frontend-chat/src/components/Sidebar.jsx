import { Bot, Copy, ThumbsUp, ThumbsDown, RotateCcw, Sparkles } from "lucide-react";
import { useState } from "react";
import {  AnimatePresence } from "framer-motion";

function BotActions({ darkMode }) {
  const [liked, setLiked] = useState(null);
  const [copied, setCopied] = useState(false);

  const btnClass = darkMode
    ? "text-gray-500 hover:text-gray-300 hover:bg-gray-700"
    : "text-gray-400 hover:text-gray-600 hover:bg-gray-100";

  const actions = [
    {
      icon: Copy,
      label: copied ? "Đã chép!" : "Sao chép",
      onClick: () => { setCopied(true); setTimeout(() => setCopied(false), 2000); },
      activeClass: copied ? "text-green-500" : btnClass,
      showLabel: copied,
    },
    {
      icon: ThumbsUp,
      label: "Hữu ích",
      onClick: () => setLiked(true),
      activeClass: liked === true ? "text-blue-500" : btnClass,
    },
    {
      icon: ThumbsDown,
      label: "Không hữu ích",
      onClick: () => setLiked(false),
      activeClass: liked === false ? "text-red-400" : btnClass,
    },
    {
      icon: RotateCcw,
      label: "Tạo lại",
      onClick: () => {},
      activeClass: btnClass,
    },
  ];

  return (
    <motion.div
      className="flex items-center gap-0.5 mt-1.5"
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {actions.map(({  label, onClick, activeClass, showLabel }, i) => (
        <motion.button
          key={label}
          onClick={onClick}
          className={`p-1.5 rounded-md text-[11px] flex items-center gap-1 transition-colors ${activeClass}`}
          title={label}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <Icon size={12} />
          <AnimatePresence>
            {showLabel && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden whitespace-nowrap"
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      ))}
    </motion.div>
  );
}

function SimpleMarkdown({ text, darkMode }) {
  const lines = text.split("\n");
  const result = [];
  let tableBuffer = [];
  let inTable = false;

  const flushTable = () => {
    if (tableBuffer.length >= 2) {
      const headers = tableBuffer[0]
        .split("|")
        .filter((c) => c.trim())
        .map((c) => c.trim());
      const rows = tableBuffer.slice(2).map((row) =>
        row.split("|").filter((c) => c.trim()).map((c) => c.trim())
      );

      result.push(
        <div key={`table-${result.length}`} className="overflow-x-auto my-3">
          <table className={`text-xs border-collapse w-full rounded-lg overflow-hidden ${darkMode ? "border-gray-600" : "border-gray-200"}`}>
            <thead>
              <tr className={darkMode ? "bg-gray-700" : "bg-gray-100"}>
                {headers.map((h, i) => (
                  <th key={i} className={`px-3 py-2 text-left font-semibold border ${darkMode ? "border-gray-600" : "border-gray-200"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} className={darkMode ? "even:bg-gray-750" : "even:bg-gray-50"}>
                  {row.map((cell, ci) => (
                    <td key={ci} className={`px-3 py-2 border ${darkMode ? "border-gray-700" : "border-gray-200"}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    tableBuffer = [];
    inTable = false;
  };

  lines.forEach((line, i) => {
    if (line.trim().startsWith("|")) {
      if (!inTable) inTable = true;
      tableBuffer.push(line.trim());
      return;
    } else if (inTable) {
      flushTable();
    }

    if (!line.trim()) {
      result.push(<div key={i} className="h-2" />);
      return;
    }

    const parseBold = (str) => {
      const parts = str.split(/\*\*(.*?)\*\*/g);
      return parts.map((part, pi) =>
        pi % 2 === 1 ? <strong key={pi}>{part}</strong> : part
      );
    };

    if (line.startsWith("**") && line.endsWith("**")) {
      result.push(<p key={i} className="font-bold mt-3 mb-1 text-sm">{line.replace(/\*\*/g, "")}</p>);
    } else if (line.startsWith("• ") || line.startsWith("- ")) {
      const content = line.replace(/^[•-]\s/, "");
      result.push(<li key={i} className="ml-4 list-disc text-sm leading-relaxed">{parseBold(content)}</li>);
    } else {
      result.push(<p key={i} className="text-sm leading-relaxed">{parseBold(line)}</p>);
    }
  });

  if (inTable) flushTable();
  return <div className="space-y-0.5">{result}</div>;
}

// Streaming text effect for bot messages
function StreamingDots() {
  return (
    <motion.span
      className="inline-flex gap-0.5 ml-1 align-middle"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1 h-1 rounded-full bg-current inline-block"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </motion.span>
  );
}

export default function MessageBubble({ message, darkMode }) {
  const isUser = message.sender === "user";
  const [hovered, setHovered] = useState(false);

  const bubbleVariants = {
    hidden: {
      opacity: 0,
      x: isUser ? 30 : -30,
      y: 10,
      scale: 0.94,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 380,
        damping: 28,
        mass: 0.8,
      },
    },
  };

  const avatarVariants = {
    hidden: { opacity: 0, scale: 0.5, rotate: isUser ? 15 : -15 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: { type: "spring", stiffness: 500, damping: 25, delay: 0.05 },
    },
  };

  return (
    <motion.div
      className={`flex gap-3 group ${isUser ? "flex-row-reverse" : "flex-row"}`}
      variants={bubbleVariants}
      initial="hidden"
      animate="visible"
      layout
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      {/* Avatar */}
      <motion.div
        variants={avatarVariants}
        className={`
          w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold
          shrink-0 mt-0.5 shadow-sm overflow-hidden
          ${isUser
            ? "bg-linear-to-br from-blue-500 to-indigo-600 text-white"
            : darkMode
            ? "bg-gray-700 border border-gray-600"
            : "bg-white border border-gray-200 shadow-sm"
          }
        `}
        whileHover={{ scale: 1.1, rotate: isUser ? -5 : 5 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {isUser ? (
          <img src="/avatar.jpg" alt="User" className="w-full h-full rounded-full object-cover" />
        ) : (
          <img src="/ai.jpg" alt="AI" className="w-full h-full rounded-full object-cover" />
        )}
      </motion.div>

      {/* Bubble + actions */}
      <div className={`flex flex-col max-w-[75%] ${isUser ? "items-end" : "items-start"}`}>
        <motion.div
          className={`
            px-4 py-3 rounded-2xl shadow-sm
            ${isUser
              ? "bg-blue-600 text-white rounded-tr-sm"
              : darkMode
              ? "bg-gray-800 text-gray-100 border border-gray-700/60 rounded-tl-sm"
              : "bg-white text-gray-800 border border-gray-100 rounded-tl-sm"
            }
          `}
          whileHover={{
            scale: 1.01,
            boxShadow: isUser
              ? "0 8px 24px rgba(37,99,235,0.25)"
              : darkMode
              ? "0 8px 24px rgba(0,0,0,0.3)"
              : "0 8px 24px rgba(0,0,0,0.08)",
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          {/* Shimmer effect for user messages on hover */}
          {isUser && (
            <motion.div
              className="absolute inset-0 rounded-2xl rounded-tr-sm overflow-hidden pointer-events-none"
              initial={false}
            >
              <motion.div
                className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full"
                animate={hovered ? { translateX: "200%" } : { translateX: "-100%" }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              />
            </motion.div>
          )}

          {isUser ? (
            <p className="text-sm leading-relaxed relative">{message.text}</p>
          ) : (
            <div className="relative">
              <SimpleMarkdown text={message.text} darkMode={darkMode} />
            </div>
          )}
        </motion.div>

        {/* Timestamp + bot actions */}
        <div className={`flex items-center gap-2 px-1 mt-1 ${isUser ? "flex-row-reverse" : ""}`}>
          <motion.span
            className={`text-[10px] ${darkMode ? "text-gray-600" : "text-gray-400"}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {message.time}
          </motion.span>

          <AnimatePresence>
            {!isUser && hovered && <BotActions darkMode={darkMode} />}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}