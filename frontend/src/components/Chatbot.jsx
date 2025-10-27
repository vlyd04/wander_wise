import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

const defaultWelcome = "Hi! I'm your travel assistant. I can help you with:\n- Tourist spots in any city\n- Hotel bookings\n- Flight information\n- Local experiences\nWhat would you like to know?";

const API_URL = `${config.API_BASE_URL}/chatbot`;

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: defaultWelcome }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (open && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { from: 'user', text: input };
    setMessages(msgs => [...msgs, userMsg]);
    setIsLoading(true);

    try {
      const response = await axios.post(API_URL, { 
        message: input 
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const botResponse = response.data.reply;
      const botMsg = { 
        from: 'bot', 
        text: botResponse || "I couldn't understand that. Please try asking about tourist spots, hotels, or flights in a specific city."
      };
      setMessages(msgs => [...msgs, botMsg]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMsg = { 
        from: 'bot', 
        text: "I'm having trouble connecting to the server. Please try again in a moment." 
      };
      setMessages(msgs => [...msgs, errorMsg]);
    } finally {
      setIsLoading(false);
      setInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          zIndex: 1000,
          background: '#2563eb',
          color: 'white',
          borderRadius: '50%',
          width: 56,
          height: 56,
          fontSize: 28,
          border: 'none',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          cursor: 'pointer',
          transition: 'transform 0.2s',
          transform: open ? 'scale(0.9)' : 'scale(1)',
        }}
        aria-label="Open chatbot"
      >💬</button>
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: 100,
            right: 32,
            width: 320,
            maxHeight: 480,
            background: 'white',
            borderRadius: 12,
            boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1001,
          }}
        >
          <div style={{ padding: 16, borderBottom: '1px solid #eee', fontWeight: 600, color: '#2563eb' }}>
            Travel Assistant
            <button 
              onClick={() => setOpen(false)} 
              style={{ 
                float: 'right', 
                background: 'none', 
                border: 'none', 
                fontSize: 18, 
                cursor: 'pointer', 
                color: '#888' 
              }}
            >×</button>
          </div>
          <div style={{ 
            flex: 1, 
            overflowY: 'auto', 
            padding: 12, 
            background: '#f8fafc',
            minHeight: 280,
          }}>
            {messages.map((msg, i) => (
              <div 
                key={i} 
                style={{ 
                  margin: '8px 0', 
                  textAlign: msg.from === 'user' ? 'right' : 'left' 
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    background: msg.from === 'user' ? '#2563eb' : '#e0e7ef',
                    color: msg.from === 'user' ? 'white' : '#222',
                    borderRadius: 16,
                    padding: '8px 14px',
                    maxWidth: '80%',
                    fontSize: 15,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >{msg.text}</span>
              </div>
            ))}
            {isLoading && (
              <div style={{ textAlign: 'left', margin: '8px 0' }}>
                <span
                  style={{
                    display: 'inline-block',
                    background: '#e0e7ef',
                    borderRadius: 16,
                    padding: '8px 14px',
                    fontSize: 15,
                  }}
                >Typing...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div style={{ display: 'flex', borderTop: '1px solid #eee', padding: 8 }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              style={{ 
                flex: 1, 
                border: 'none', 
                outline: 'none', 
                fontSize: 15, 
                padding: 8, 
                borderRadius: 8, 
                background: '#f1f5f9' 
              }}
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              style={{ 
                marginLeft: 8, 
                background: '#2563eb', 
                color: 'white', 
                border: 'none', 
                borderRadius: 8, 
                padding: '8px 16px', 
                fontWeight: 600, 
                cursor: input.trim() ? 'pointer' : 'not-allowed',
                opacity: input.trim() ? 1 : 0.7,
              }}
            >Send</button>
          </div>
        </div>
      )}
    </>
  );
}