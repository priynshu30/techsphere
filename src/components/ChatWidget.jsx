import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { getGeminiResponse } from '../api/gemini';
import api from '../api/api';

// Keywords that trigger ticket creation flow
const TICKET_KEYWORDS = [
  'create ticket', 'raise ticket', 'submit issue', 'submit ticket',
  'need help', 'open ticket', 'report issue', 'log a ticket',
];

const MAX_MESSAGES = 20;
const RATE_LIMIT_MS = 2000;

// Typing dots animation component
function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.15}s`, animationDuration: '0.8s' }}
        />
      ))}
    </div>
  );
}

// Individual message bubble
function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex items-end gap-2 mb-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${isUser ? 'bg-indigo-600' : 'bg-gray-200'}`}>
        {isUser
          ? <User className="w-4 h-4 text-white" />
          : <Bot className="w-4 h-4 text-gray-600" />
        }
      </div>
      {/* Bubble */}
      <div
        className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-indigo-600 text-white rounded-br-sm'
            : 'bg-gray-100 text-gray-800 rounded-bl-sm'
        }`}
      >
        {message.text}
      </div>
    </div>
  );
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'model',
      text: "👋 Hi! I'm TechSphere's AI assistant. I can help you with IT issues, service plans, billing, and more.\n\nWhat can I help you with today?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCoolingDown, setIsCoolingDown] = useState(false);
  const [cooldownMsg, setCooldownMsg] = useState('');
  const [ticketFlow, setTicketFlow] = useState(null); // null | 'awaiting_description' | { title }
  const [hasUnread, setHasUnread] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const addMessage = useCallback((role, text) => {
    setMessages((prev) => [...prev, { role, text }]);
  }, []);

  // Create a ticket via the backend
  const createTicket = useCallback(async (title, description) => {
    try {
      await api.post('/tickets', { title, description });
      return true;
    } catch {
      return false;
    }
  }, []);

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading || isCoolingDown) return;

    // Max messages guard
    const userMsgCount = messages.filter((m) => m.role === 'user').length;
    if (userMsgCount >= MAX_MESSAGES) {
      setCooldownMsg(`⚠️ Session limit of ${MAX_MESSAGES} messages reached. Please refresh to start a new session.`);
      return;
    }

    setInput('');
    addMessage('user', trimmed);
    setCooldownMsg('');

    // ── Rate limiting ─────────────────────────────────────────
    setIsCoolingDown(true);
    setTimeout(() => {
      setIsCoolingDown(false);
      setCooldownMsg('');
    }, RATE_LIMIT_MS);

    const lowerInput = trimmed.toLowerCase();

    // ── Ticket creation flow ──────────────────────────────────
    if (ticketFlow === 'awaiting_description') {
      setIsLoading(true);
      const title = typeof ticketFlow === 'object' ? ticketFlow.title : 'Support Request';
      const success = await createTicket(title, trimmed);
      setIsLoading(false);
      setTicketFlow(null);

      if (success) {
        addMessage('model', '✅ Ticket created successfully! Our IT team will review it and respond shortly. Is there anything else I can help you with?');
      } else {
        addMessage('model', "❌ I couldn't create the ticket right now — you may need to log in first. You can also submit one manually from the Tickets page.");
      }
      return;
    }

    // Detect ticket keywords
    const triggersTicket = TICKET_KEYWORDS.some((kw) => lowerInput.includes(kw));
    if (triggersTicket) {
      setTicketFlow('awaiting_description');
      addMessage('model', "I'll create a support ticket for you right away. 📋\n\nPlease describe your issue briefly and I'll submit it to our IT team.");
      return;
    }

    // ── Regular Gemini AI response ───────────────────────────
    setIsLoading(true);
    try {
      // Build history for context memory (exclude the welcome message)
      const history = messages
        .slice(1) // skip the initial greeting from history
        .concat({ role: 'user', text: trimmed });

      const reply = await getGeminiResponse(history);
      addMessage('model', reply);

      // Notify if chat is closed
      if (!isOpen) setHasUnread(true);
    } catch {
      addMessage('model', "I'm having trouble connecting. Please try again in a moment.");
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, isCoolingDown, messages, ticketFlow, addMessage, createTicket, isOpen]);

  // Send on Enter (Shift+Enter = newline)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = input.trim() && !isLoading && !isCoolingDown;

  return (
    <>
      {/* ── Floating Chat Button ─────────────────────────────── */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? 'Close chat' : 'Open AI assistant'}
        className="fixed bottom-6 right-6 z-50 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-indigo-300"
      >
        {isOpen
          ? <X className="w-6 h-6" />
          : (
            <div className="relative">
              <MessageCircle className="w-6 h-6" />
              {hasUnread && (
                <span className="absolute -top-1.5 -right-1.5 h-3 w-3 bg-red-500 rounded-full border-2 border-indigo-600" />
              )}
            </div>
          )
        }
      </button>

      {/* ── Chat Window ──────────────────────────────────────── */}
      <div className={`fixed bottom-24 right-6 z-50 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${
        isOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-90 opacity-0 pointer-events-none'
      }`}
        style={{ height: '520px' }}
      >
        {/* Header */}
        <div className="bg-indigo-600 px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="bg-white/20 rounded-full p-1.5">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm leading-tight">TechSphere AI Assistant</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                <span className="text-indigo-200 text-xs">Online</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white/70 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1 bg-gray-50/50">
          {messages.map((msg, i) => (
            <MessageBubble key={i} message={msg} />
          ))}
          {isLoading && (
            <div className="flex items-end gap-2">
              <div className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center bg-gray-200">
                <Bot className="w-4 h-4 text-gray-600" />
              </div>
              <div className="bg-gray-100 rounded-2xl rounded-bl-sm">
                <TypingDots />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Rate limit / session warning */}
        {(isCoolingDown || cooldownMsg) && (
          <div className="px-3 py-1.5 bg-amber-50 border-t border-amber-100">
            <p className="text-xs text-amber-700 text-center">
              {cooldownMsg || '⏳ Please wait a moment before sending another message…'}
            </p>
          </div>
        )}

        {/* Ticket flow hint */}
        {ticketFlow && (
          <div className="px-3 py-1.5 bg-indigo-50 border-t border-indigo-100">
            <p className="text-xs text-indigo-600 text-center font-medium">
              📋 Ticket mode active — describe your issue and press Send
            </p>
          </div>
        )}

        {/* Input area */}
        <div className="p-3 border-t border-gray-200 bg-white shrink-0">
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                // Auto-resize up to 3 rows
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 72) + 'px';
              }}
              onKeyDown={handleKeyDown}
              placeholder={ticketFlow ? 'Describe your issue...' : 'Ask me anything…'}
              disabled={isLoading}
              className="flex-1 resize-none text-sm border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 min-h-[38px] max-h-[72px] overflow-y-auto leading-5"
              style={{ height: '38px' }}
            />
            <button
              onClick={handleSend}
              disabled={!canSend}
              className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
              aria-label="Send message"
            >
              {isLoading
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <Send className="w-4 h-4" />
              }
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1.5 text-center">
            {messages.filter(m => m.role === 'user').length}/{MAX_MESSAGES} messages · Press Enter to send
          </p>
        </div>
      </div>
    </>
  );
}
