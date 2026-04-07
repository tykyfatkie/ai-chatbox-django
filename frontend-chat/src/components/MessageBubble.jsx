import { Bot, Copy, ThumbsUp, ThumbsDown, RotateCcw } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

function BotActions({ darkMode }) {
  const [liked, setLiked] = useState(null);
  const [copied, setCopied] = useState(false);

  const btnClass = darkMode
    ? "text-gray-500 hover:text-gray-300 hover:bg-gray-700"
    : "text-gray-400 hover:text-gray-600 hover:bg-gray-100";

  return (
    <div className="flex items-center gap-0.5 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <button
        onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }}
        className={`p-1.5 rounded-md text-[11px] flex items-center gap-1 transition-colors ${btnClass}`}
        title="Sao chép"
      >
        <Copy size={12} />
        {copied && <span>Đã chép!</span>}
      </button>
      <button
        onClick={() => setLiked(true)}
        className={`p-1.5 rounded-md transition-colors ${liked === true ? "text-blue-500" : btnClass}`}
        title="Hữu ích"
      >
        <ThumbsUp size={12} />
      </button>
      <button
        onClick={() => setLiked(false)}
        className={`p-1.5 rounded-md transition-colors ${liked === false ? "text-red-400" : btnClass}`}
        title="Không hữu ích"
      >
        <ThumbsDown size={12} />
      </button>
      <button
        className={`p-1.5 rounded-md transition-colors ${btnClass}`}
        title="Tạo lại"
      >
        <RotateCcw size={12} />
      </button>
    </div>
  );
}

// Simple markdown renderer without external lib
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
        row
          .split("|")
          .filter((c) => c.trim())
          .map((c) => c.trim())
      );

      result.push(
        <div key={`table-${result.length}`} className="overflow-x-auto my-3">
          <table className={`text-xs border-collapse w-full rounded-lg overflow-hidden ${darkMode ? "border-gray-600" : "border-gray-200"}`}>
            <thead>
              <tr className={darkMode ? "bg-gray-700" : "bg-gray-100"}>
                {headers.map((h, i) => (
                  <th key={i} className={`px-3 py-2 text-left font-semibold border ${darkMode ? "border-gray-600" : "border-gray-200"}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} className={darkMode ? "even:bg-gray-750" : "even:bg-gray-50"}>
                  {row.map((cell, ci) => (
                    <td key={ci} className={`px-3 py-2 border ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                      {cell}
                    </td>
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
    // Table detection
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

    // Bold inline
    const parseBold = (str) => {
      const parts = str.split(/\*\*(.*?)\*\*/g);
      return parts.map((part, pi) =>
        pi % 2 === 1 ? <strong key={pi}>{part}</strong> : part
      );
    };

    // Headers
    if (line.startsWith("**") && line.endsWith("**")) {
      result.push(
        <p key={i} className="font-bold mt-3 mb-1 text-sm">
          {line.replace(/\*\*/g, "")}
        </p>
      );
    } else if (line.startsWith("• ") || line.startsWith("- ")) {
      const content = line.replace(/^[•-]\s/, "");
      result.push(
        <li key={i} className="ml-4 list-disc text-sm leading-relaxed">
          {parseBold(content)}
        </li>
      );
    } else {
      result.push(
        <p key={i} className="text-sm leading-relaxed">
          {parseBold(line)}
        </p>
      );
    }
  });

  if (inTable) flushTable();

  return <div className="space-y-0.5">{result}</div>;
}

export default function MessageBubble({ message, darkMode }) {
  const isUser = message.sender === "user";

  return (
    <div
      className={`flex gap-3 group ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div
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
      >
        {isUser ? (
          <img src="/avatar.jpg" alt="User" className="w-full h-full rounded-full object-cover" />
        ) : (
          <img src="/ai.jpg" alt="AI" className="w-full h-full rounded-full object-cover" />
        )}
      </div>

      {/* Bubble + actions */}
      <div className={`flex flex-col max-w-[75%] ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`
            px-4 py-3 rounded-2xl shadow-sm transition-all duration-150
            ${isUser
              ? "bg-blue-600 text-white rounded-tr-sm"
              : darkMode
              ? "bg-gray-800 text-gray-100 border border-gray-700/60 rounded-tl-sm"
              : "bg-white text-gray-800 border border-gray-100 rounded-tl-sm"
            }
          `}
        >
          {isUser ? (
            <p className="text-sm leading-relaxed">{message.text}</p>
          ) : (
            <SimpleMarkdown text={message.text} darkMode={darkMode} />
          )}
        </div>

        {/* Timestamp + bot actions */}
        <div className={`flex items-center gap-2 px-1 mt-1 ${isUser ? "flex-row-reverse" : ""}`}>
          <span className={`text-[10px] ${darkMode ? "text-gray-600" : "text-gray-400"}`}>
            {message.time}
          </span>
          {!isUser && <BotActions darkMode={darkMode} />}
        </div>
      </div>
    </div>
  );
}