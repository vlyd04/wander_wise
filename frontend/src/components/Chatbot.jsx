// import React, { useState } from 'react';
// import axios from 'axios';

// const Chatbot = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');

//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     const userMessage = { sender: 'user', text: input };
//     setMessages((prev) => [...prev, userMessage]);
//     setInput('');

//     try {
//       const res = await axios.post('http://localhost:5000/chat', {
//         message: input,
//       });

//       const botMessage = {
//         sender: 'bot',
//         text: res.data.reply,
//       };
//       setMessages((prev) => [...prev, botMessage]);
//     } catch (error) {
//       setMessages((prev) => [
//         ...prev,
//         { sender: 'bot', text: '❌ Error fetching response.' },
//       ]);
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter') sendMessage();
//   };

//   return (
//     <div className="max-w-xl mx-auto mt-10 p-4 bg-white shadow-lg rounded-xl">
//       <h2 className="text-2xl font-bold mb-4 text-center">🧭 Travel Chatbot</h2>
//       <div className="h-64 overflow-y-auto bg-gray-100 p-3 rounded mb-4">
//         {messages.map((msg, idx) => (
//           <div
//             key={idx}
//             className={`mb-2 p-2 rounded ${
//               msg.sender === 'user'
//                 ? 'bg-blue-200 text-right'
//                 : 'bg-gray-300 text-left'
//             }`}
//           >
//             {msg.text}
//           </div>
//         ))}
//       </div>
//       <div className="flex">
//         <input
//           className="flex-grow p-2 border rounded-l focus:outline-none"
//           placeholder="Ask about a place (e.g., Ooty, Taj Mahal)"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={handleKeyDown}
//         />
//         <button
//           onClick={sendMessage}
//           className="bg-blue-600 text-white px-4 rounded-r hover:bg-blue-700"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Chatbot;


import React, { useState } from "react";
import axios from "axios";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! Ask me anything about Indian destinations." }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const res = await axios.post("http://localhost:5000/chat", {
        message: input,
      });
      const botMsg = { sender: "bot", text: res.data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      const errMsg = {
        sender: "bot",
        text: "Sorry, something went wrong. Please try again.",
      };
      setMessages((prev) => [...prev, errMsg]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow-md flex flex-col h-[500px]">
      <div className="flex-grow overflow-y-auto mb-4 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-2 rounded max-w-[75%] ${
                msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <input
        type="text"
        className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
        placeholder="Type your question..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
