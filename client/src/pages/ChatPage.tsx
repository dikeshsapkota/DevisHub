import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { getSocket } from '../services/socket';
import { useAuthStore } from '../store/authStore';
import { useChatStore } from '../store/chatStore';
import { Conversation, ChatMessage } from '../types';
import { GlassPanel } from '../components/common/GlassPanel';
import { Badge } from '../components/common/Badge';
import { Send, Terminal, MessageSquare, Sparkles, User, Image, Paperclip } from 'lucide-react';

export const ChatPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const targetUserId = searchParams.get('user');

  const { user, isAuthenticated, demoLogin } = useAuthStore();
  const { conversations, setConversations, activeConversationId, setActiveConversation } = useChatStore();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const socket = getSocket();

  // Load conversations
  const fetchConversations = async () => {
    try {
      setLoading(true);
      const res: any = await api.get('/chats/conversations');
      setConversations(res.data);

      if (targetUserId) {
        // Get or create conv with target user
        const convRes: any = await api.post('/chats/conversations', { targetUserId });
        setActiveConversation(convRes.data.conversationId);
      } else if (res.data.length > 0 && !activeConversationId) {
        setActiveConversation(res.data[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // Fetch messages when active conversation changes
  useEffect(() => {
    if (!activeConversationId) return;

    const fetchMessages = async () => {
      try {
        const res: any = await api.get(`/chats/conversations/${activeConversationId}/messages`);
        setMessages(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMessages();

    // Socket room join
    if (socket) {
      socket.emit('join_conversation', activeConversationId);

      const handleNewMessage = (msg: ChatMessage) => {
        if (msg.conversationId === activeConversationId) {
          setMessages((prev) => [...prev, msg]);
        }
      };

      socket.on('new_message', handleNewMessage);

      return () => {
        socket.emit('leave_conversation', activeConversationId);
        socket.off('new_message', handleNewMessage);
      };
    }
  }, [activeConversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConversationId) return;

    try {
      const res: any = await api.post('/chats/messages', {
        conversationId: activeConversationId,
        content: inputText,
      });

      setMessages((prev) => [...prev, res.data]);
      if (socket) {
        socket.emit('send_message', res.data);
      }
      setInputText('');
    } catch (err: any) {
      console.error(err);
    }
  };

  const activeConv = conversations.find((c) => c.id === activeConversationId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[750px]">
        {/* SIDEBAR CONVERSATION LIST */}
        <GlassPanel glow="cyan" className="lg:col-span-1 p-4 flex flex-col justify-between space-y-4 bg-darkNavy/90">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 font-bold text-slate-100 text-sm">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>Developer Console</span>
              </div>
              <Badge variant="cyan">REALTIME</Badge>
            </div>

            <div className="space-y-1 overflow-y-auto max-h-[600px]">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setActiveConversation(conv.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 ${
                    activeConversationId === conv.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                      : 'hover:bg-white/5 text-slate-300'
                  }`}
                >
                  <img
                    src={conv.otherUser?.avatarUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=user'}
                    alt="Avatar"
                    className="w-9 h-9 rounded-full border border-cyan-500/30 object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-xs text-slate-100 truncate">
                      {conv.otherUser?.name || 'Developer'}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {conv.lastMessage?.content || '@' + conv.otherUser?.username}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </GlassPanel>

        {/* CHAT MESSAGES WINDOW */}
        <GlassPanel glow="cyan" className="lg:col-span-3 p-6 flex flex-col justify-between bg-darkNavy/90">
          {activeConv ? (
            <>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <img
                    src={activeConv.otherUser?.avatarUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=user'}
                    alt="User"
                    className="w-10 h-10 rounded-full border border-cyan-500/40 object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-slate-100 text-sm">{activeConv.otherUser?.name}</h3>
                    <p className="text-xs text-cyan-400 font-mono">@{activeConv.otherUser?.username}</p>
                  </div>
                </div>
                <Badge variant="lime">ENCRYPTED MESH</Badge>
              </div>

              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto py-6 space-y-4 pr-2">
                {messages.map((msg) => {
                  const isMe = msg.senderId === user?.id;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-md p-3.5 rounded-2xl text-xs space-y-1 ${
                          isMe
                            ? 'bg-cyan-500/20 text-cyan-100 border border-cyan-500/40 rounded-br-none'
                            : 'bg-darkViolet text-slate-200 border border-purple-500/30 rounded-bl-none'
                        }`}
                      >
                        <p className="leading-relaxed">{msg.content}</p>
                        <div className="text-[10px] opacity-60 font-mono text-right">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="flex gap-3 pt-4 border-t border-white/10">
                <input
                  type="text"
                  placeholder="Type a message or paste code snippet..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 bg-obsidian text-xs text-slate-200 px-4 py-3 rounded-xl border border-cyan-500/20 focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-purple-600 text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:brightness-110 flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  Send
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 font-mono text-xs space-y-2">
              <MessageSquare className="w-10 h-10 text-cyan-400" />
              <span>Select a developer from the sidebar to open chat console</span>
            </div>
          )}
        </GlassPanel>
      </div>
    </div>
  );
};
