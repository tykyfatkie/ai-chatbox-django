import { useState } from 'react';
import axios from 'axios';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Xin chào! Tôi có thể giúp gì cho bạn hôm nay?' }
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Hiển thị tin nhắn của user ngay lập tức
    const newMessages = [...messages, { sender: 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      // Gọi xuống Backend Django
      const response = await axios.post('http://127.0.0.1:8000/api/chat/', {
        message: input
      });
      
      // Nhận kết quả và hiển thị
      setMessages([...newMessages, { sender: 'bot', text: response.data.reply }]);
    } catch (error) {
      console.error("Lỗi:", error);
      setMessages([...newMessages, { sender: 'bot', text: 'Xin lỗi, hệ thống đang bận!' }]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4">
      <div className="flex-1 max-w-2xl w-full mx-auto bg-white rounded-lg shadow-md flex flex-col overflow-hidden">
        
        {/* Khung hiển thị tin nhắn */}
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((msg, index) => (
            <div key={index} className={`mb-4 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-3 rounded-lg max-w-[70%] ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && <div className="text-gray-500 italic">AI đang suy nghĩ...</div>}
        </div>

        {/* Khung nhập liệu */}
        <div className="p-4 border-t flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1 p-2 border rounded outline-none focus:border-blue-500"
            placeholder="Nhập câu hỏi của bạn..."
          />
          <button 
            onClick={sendMessage} 
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            Gửi
          </button>
        </div>

      </div>
    </div>
  );
}

export default App;