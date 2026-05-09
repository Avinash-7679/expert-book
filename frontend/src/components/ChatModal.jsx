import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import { X, Send, User, MessageCircle } from 'lucide-react';

const ChatModal = ({ isOpen, onClose, booking }) => {
  const socket = useSocket();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();

  useEffect(() => {
    if (!isOpen || !socket || !booking) return;

    console.log('🔌 Joining room:', booking._id);
    socket.emit('joinRoom', booking._id);

    const handleMessage = (msg) => {
      console.log('📩 Received message:', msg);
      setMessages((prev) => [...prev, msg]);
    };

    socket.on('receiveMessage', handleMessage);

    return () => {
      console.log('🔌 Leaving room/cleaning up:', booking._id);
      socket.off('receiveMessage', handleMessage);
    };
  }, [isOpen, socket, booking?._id]); // Depend on booking._id to avoid unnecessary reruns

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim() || !socket) return;

    const msgData = {
      bookingId: booking._id,
      message,
      sender: 'User',
      timestamp: new Date().toISOString()
    };

    console.log('📤 Sending message:', msgData);
    socket.emit('sendMessage', msgData);
    setMessage('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg border border-slate-200 shadow-2xl flex flex-col h-[600px]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-amber-600 flex items-center justify-center text-white">
              <User className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-amber-500">Mentorship Chat</p>
              <h3 className="font-serif font-bold text-lg leading-tight">{booking.expertId?.name}</h3>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Messages Container */}
        <div 
          ref={scrollRef}
          className="flex-grow overflow-y-auto p-6 space-y-4 bg-slate-50"
        >
          {messages.length === 0 ? (
            <div className="text-center py-20 space-y-4">
               <MessageCircle className="w-12 h-12 text-slate-200 mx-auto" />
               <p className="text-slate-400 italic text-sm">Start your consultation by sending a message below.</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex ${msg.sender === 'User' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] p-4 text-sm ${
                  msg.sender === 'User' 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-white border border-slate-200 text-slate-900'
                }`}>
                  <p className="font-medium mb-1 flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-50">{msg.sender}</span>
                    <span className="text-[8px] opacity-30">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </p>
                  <p>{msg.message}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-6 border-t border-slate-100 bg-white flex gap-4">
          <input 
            type="text" 
            placeholder="Type your message..." 
            className="flex-grow px-4 py-4 border border-slate-200 outline-none focus:border-slate-900 transition-all font-medium text-sm"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button 
            type="submit" 
            className="bg-slate-900 text-white p-4 hover:bg-slate-800 transition-all active:scale-95 shadow-lg"
          >
            <Send className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatModal;
