import { useState } from "react";
import {
  Plus,
  MessageSquare,
  Trash2,
  MoreHorizontal,
  Bot,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
} from "lucide-react";

export default function Sidebar({
  isOpen,
  onClose,
  chatHistory,
  onNewChat,
  onSelectChat,
  darkMode,
}) {
  const [hoveredChat, setHoveredChat] = useState(null);

  const sidebarBase = darkMode
    ? "bg-gray-900 border-gray-700/60 text-gray-100"
    : "bg-slate-50 border-gray-200 text-gray-800";

  const hoverItem = darkMode
    ? "hover:bg-gray-800 text-gray-300 hover:text-white"
    : "hover:bg-slate-100 text-gray-600 hover:text-gray-900";

  const activeItem = darkMode
    ? "bg-gray-800 text-white"
    : "bg-blue-50 text-blue-700";

  const dividerColor = darkMode ? "border-gray-700/60" : "border-gray-200";
  const sectionLabel = darkMode ? "text-gray-500" : "text-gray-400";

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed lg:relative z-30 lg:z-auto h-full flex flex-col
          w-65 border-r transition-transform duration-300 ease-in-out
          ${sidebarBase}
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo & Close button */}
        <div className={`flex items-center justify-between px-4 py-4 border-b ${dividerColor}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
              <Bot size={15} className="text-white" />
            </div>
            <span className="font-semibold text-sm tracking-tight">
              ChatBot AI
            </span>
          </div>
          <button
            onClick={onClose}
            className={`lg:hidden p-1 rounded-md transition-colors ${hoverItem}`}
          >
            <ChevronLeft size={18} />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="px-3 pt-3 pb-2">
          <button
            onClick={onNewChat}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-150 shadow-sm hover:shadow-md group"
          >
            <Plus size={16} className="transition-transform duration-200 group-hover:rotate-90" />
            Cuộc trò chuyện mới
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto px-3 py-1 space-y-0.5 scrollbar-thin">
          <p className={`px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider ${sectionLabel}`}>
            Gần đây
          </p>

          {chatHistory.map((chat) => (
            <div
              key={chat.id}
              onMouseEnter={() => setHoveredChat(chat.id)}
              onMouseLeave={() => setHoveredChat(null)}
              onClick={() => onSelectChat(chat.id)}
              className={`
                group relative flex items-start gap-2.5 px-2.5 py-2.5 rounded-lg cursor-pointer transition-all duration-150
                ${chat.active ? activeItem : hoverItem}
              `}
            >
              <MessageSquare
                size={15}
                className={`mt-0.5 shrink-0 ${chat.active ? "text-blue-600" : ""}`}
              />
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-medium truncate ${chat.active ? "" : ""}`}>
                  {chat.title}
                </p>
                <p className={`text-[11px] truncate mt-0.5 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                  {chat.time}
                </p>
              </div>

              {/* Hover actions */}
              {hoveredChat === chat.id && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
                  <button
                    className={`p-1 rounded transition-colors ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal size={13} />
                  </button>
                  <button
                    className={`p-1 rounded transition-colors text-red-400 ${darkMode ? "hover:bg-gray-700" : "hover:bg-red-50"}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className={`border-t ${dividerColor}`} />

        {/* Bottom menu items */}
        <div className="px-3 py-2 space-y-0.5">
          {[
            { icon: HelpCircle, label: "Trợ giúp & FAQ" },
            { icon: Settings, label: "Cài đặt" },
          ].map(({ icon: IconComponent, label }) => (
            <button
              key={label}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-colors duration-150 ${hoverItem}`}
            >
              <IconComponent size={15} />
              {label}
            </button>
          ))}
        </div>

        {/* User Profile */}
        <div className={`border-t ${dividerColor} px-3 py-3`}>
          <div
            className={`flex items-center gap-2.5 px-2 py-2 rounded-xl cursor-pointer transition-colors ${hoverItem}`}
          >
            <div className="w-7 h-7 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
              ND
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate">Nguyễn Dũng</p>
              <p className={`text-[11px] truncate ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                Pro Plan
              </p>
            </div>
            <button className={`p-1 rounded transition-colors ${darkMode ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-400"}`}>
              <LogOut size={13} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}