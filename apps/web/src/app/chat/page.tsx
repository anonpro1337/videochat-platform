'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PaperPlaneRight, DotsThree, Phone, VideoCamera,
  MagnifyingGlass, Smiley, ImageSquare,
  CheckCircle, ArrowLeft, ChatCircle
} from '@phosphor-icons/react';

const conversations = [
  { id: 1, name: 'Sarah', avatar: 'S', lastMsg: 'That was so fun! Let\'s call again 🎉', time: '2m', online: true, unread: 2 },
  { id: 2, name: 'Mike', avatar: 'M', lastMsg: 'Hey, are you free later?', time: '15m', online: true, unread: 0 },
  { id: 3, name: 'Emma', avatar: 'E', lastMsg: 'I love that song too!', time: '1h', online: false, unread: 1 },
  { id: 4, name: 'Alex', avatar: 'A', lastMsg: 'Nice meeting you!', time: '2h', online: true, unread: 0 },
  { id: 5, name: 'Luna', avatar: 'L', lastMsg: 'Haha good one 😂', time: '3h', online: false, unread: 0 },
];

const messages = [
  { id: 1, sender: 'them', text: 'Hey! How are you?', time: '10:30 AM' },
  { id: 2, sender: 'me', text: 'I\'m great! Just joined ChatVibe', time: '10:31 AM' },
  { id: 3, sender: 'them', text: 'Welcome! Want to video call?', time: '10:32 AM' },
  { id: 4, sender: 'me', text: 'Sure, give me a sec', time: '10:33 AM' },
  { id: 5, sender: 'them', text: 'That was so fun! Let\'s call again 🎉', time: '10:35 AM' },
];

export default function ChatPage() {
  const [activeChat, setActiveChat] = useState<number | null>(1);
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState([
    { id: 1, name: 'Sarah', avatar: 'S', lastMsg: 'That was so fun! Let\'s call again 🎉', time: '2m', online: true, unread: 2 },
    { id: 2, name: 'Mike', avatar: 'M', lastMsg: 'Hey, are you free later?', time: '15m', online: true, unread: 0 },
    { id: 3, name: 'Emma', avatar: 'E', lastMsg: 'I love that song too!', time: '1h', online: false, unread: 1 },
    { id: 4, name: 'Alex', avatar: 'A', lastMsg: 'Nice meeting you!', time: '2h', online: true, unread: 0 },
    { id: 5, name: 'Luna', avatar: 'L', lastMsg: 'Haha good one 😂', time: '3h', online: false, unread: 0 },
  ]);

  const sendMessage = () => {
    if (!message.trim() || !activeChat) return;
    const newMsg = { id: Date.now(), sender: 'me' as const, text: message, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    messages.push(newMsg);
    setConversations(prev => prev.map(c => c.id === activeChat ? { ...c, lastMsg: message, time: 'now', unread: 0 } : c));
    setMessage('');
  };

  const activeConversation = conversations.find(c => c.id === activeChat);

  return (
    <div className="min-h-screen pt-16 md:pt-16 pb-16 md:pb-0 flex flex-col">
      <div className="flex-1 flex max-w-[1400px] mx-auto w-full gap-3 p-3">
        {/* Sidebar */}
        <div className={`w-full md:w-80 flex-shrink-0 flex flex-col gap-3 ${activeChat ? 'hidden md:flex' : 'flex'}`}>
          <div className="glass-card-static p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <ChatCircle className="w-5 h-5 text-primary-light" weight="fill" />
                Messages
              </h2>
              <span className="text-xs text-text-muted bg-white/5 px-2 py-1 rounded-lg">5 chats</span>
            </div>
            <div className="relative mb-3">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="Search messages..."
                className="input-glass w-full pl-9 pr-4 py-2.5 text-sm"
              />
            </div>
            <div className="space-y-1 max-h-[60vh] overflow-y-auto scrollbar-hide">
              {conversations.map(conv => {
                const isActive = activeChat === conv.id;
                return (
                  <button
                    key={conv.id}
                    onClick={() => setActiveChat(conv.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                      isActive ? 'bg-primary/15 border border-primary/20' : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-purple-500/30 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {conv.avatar}
                      {conv.online && (
                        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-secondary border-2 border-bg-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold truncate">{conv.name}</p>
                        <span className="text-[10px] text-text-muted flex-shrink-0">{conv.time}</span>
                      </div>
                      <p className="text-xs text-text-muted truncate mt-0.5">{conv.lastMsg}</p>
                    </div>
                    {conv.unread > 0 && (
                      <span className="w-5 h-5 rounded-full bg-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                        {conv.unread}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
          {activeConversation ? (
            <div className="glass-card-static flex-1 flex flex-col overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-3 p-4 border-b border-border">
                <button className="md:hidden" onClick={() => setActiveChat(null)}>
                  <ArrowLeft className="w-5 h-5 text-text-secondary" />
                </button>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-purple-500/30 flex items-center justify-center text-sm font-bold">
                  {activeConversation.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">{activeConversation.name}</p>
                    <CheckCircle className="w-4 h-4 text-primary-light" weight="fill" />
                    {activeConversation.online && <span className="w-1.5 h-1.5 rounded-full bg-secondary" />}
                  </div>
                  <p className="text-[11px] text-text-muted">
                    {activeConversation.online ? 'Online' : 'Offline'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all">
                    <Phone className="w-4 h-4 text-text-secondary" />
                  </button>
                  <button className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all">
                    <VideoCamera className="w-4 h-4 text-text-secondary" />
                  </button>
                  <button className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all">
                    <DotsThree className="w-5 h-5 text-text-secondary" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map(msg => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.sender === 'me'
                          ? 'bg-gradient-to-br from-primary to-purple-500 text-white rounded-br-md'
                          : 'glass text-text-primary rounded-bl-md'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <p className={`text-[10px] mt-1 ${
                        msg.sender === 'me' ? 'text-white/60' : 'text-text-muted'
                      }`}>
                        {msg.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <button className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all flex-shrink-0">
                    <Smiley className="w-5 h-5 text-text-secondary" />
                  </button>
                  <button className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all flex-shrink-0">
                    <ImageSquare className="w-5 h-5 text-text-secondary" />
                  </button>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    className="input-glass flex-1 px-4 py-2.5 text-sm"
                    onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!message.trim()}
                    className="w-10 h-10 rounded-xl bg-primary hover:bg-primary-dark flex items-center justify-center transition-all flex-shrink-0 disabled:opacity-40"
                  >
                    <PaperPlaneRight className="w-5 h-5 text-white" weight="fill" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 glass-card-static flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <ChatCircle className="w-8 h-8 text-text-muted" />
                </div>
                <p className="text-lg font-medium mb-1">Select a conversation</p>
                <p className="text-sm text-text-muted">Choose from your existing chats</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
