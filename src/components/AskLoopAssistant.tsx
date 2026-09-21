import React from 'react';
import {
  Sparkles,
  Send,
  Loader2,
  Bot,
  User,
  Quote,
  RotateCcw,
  ArrowRight,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';
import { ChatMessage, FeedbackItem, WorkspaceTenant } from '../types';

interface AskLoopAssistantProps {
  workspace: WorkspaceTenant;
  feedbacks: FeedbackItem[];
  initialQuery?: string;
  onSelectFeedback: (item: FeedbackItem) => void;
  theme?: 'light' | 'dark';
}

const SUGGESTED_QUERIES = [
  'Why are enterprise users complaining about billing and overages?',
  'What are the top 3 most requested product features across all channels?',
  'Which customer accounts are at imminent risk of churning and why?',
  'Compare customer sentiment between mobile and web platform experiences',
  'What features received the highest praise and NPS praise this month?',
];

export function AskLoopAssistant({
  workspace,
  feedbacks,
  initialQuery,
  onSelectFeedback,
  theme = 'light',
}: AskLoopAssistantProps) {
  const isDark = theme === 'dark';

  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: `Hello! I am **Ask LOOP**, your AI Voice-of-Customer intelligence partner for **${workspace.name}**. I have synthesized all **${feedbacks.length}** customer signals across Zendesk, G2, Intercom, App Store, and direct inbound channels.\n\nAsk me anything about customer sentiment, emerging feature requests, churn risks, or team resolution priorities.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedFollowUps: [
        'Which enterprise accounts are facing critical outages?',
        'Summarize billing disputes and renewal threats',
        'What are customer reactions to our recent UI updates?',
      ],
    },
  ]);

  const [inputQuery, setInputQuery] = React.useState(initialQuery || '');
  const [loading, setLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (initialQuery) {
      handleSend(initialQuery);
    }
  }, [initialQuery]);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setLoading(true);

    try {
      const response = await fetch('/api/feedback/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToSend,
          workspaceId: workspace.id,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to query AI');

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: data.citations,
        suggestedFollowUps: data.suggestedFollowUps,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error('Ask AI error:', err);
      const errorMessage: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        sender: 'assistant',
        text: `I encountered an issue querying feedback intelligence: ${err.message}. Please verify server connection.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        text: `Chat reset. What customer intelligence questions would you like to explore for **${workspace.name}**?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedFollowUps: SUGGESTED_QUERIES.slice(0, 3),
      },
    ]);
  };

  return (
    <div
      id="ask-loop-container"
      className={`rounded-2xl border flex flex-col h-[700px] max-h-[80vh] transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-xs'
      }`}
    >
      {/* Header */}
      <div
        className={`p-4 border-b flex items-center justify-between ${
          isDark ? 'bg-slate-800/60 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight">Ask LOOP – AI Assistant</h2>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Grounded on {feedbacks.length} real-time feedback signals • Gemini 3.8 Flash
            </p>
          </div>
        </div>

        <button
          onClick={handleResetChat}
          className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
            isDark
              ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset Chat</span>
        </button>
      </div>

      {/* Suggested Query Chips Bar */}
      <div
        className={`px-4 py-2.5 border-b flex items-center gap-2 overflow-x-auto text-xs no-scrollbar ${
          isDark ? 'bg-indigo-950/30 border-indigo-950 text-indigo-300' : 'bg-indigo-50/60 border-indigo-100 text-indigo-900'
        }`}
      >
        <span className="font-semibold shrink-0 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Prompts:
        </span>
        {SUGGESTED_QUERIES.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className={`px-2.5 py-1 rounded-lg border font-medium whitespace-nowrap transition-all shrink-0 cursor-pointer ${
              isDark
                ? 'bg-slate-800/80 hover:bg-indigo-950/80 text-slate-200 border-slate-700'
                : 'bg-white hover:bg-indigo-50 text-indigo-900 border-indigo-200'
            }`}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? isDark
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-900 text-white shadow-xs'
                  : isDark
                  ? 'bg-slate-800/70 border border-slate-700/80 text-slate-100'
                  : 'bg-slate-50 border border-slate-200 text-slate-800'
              }`}
            >
              {/* Message text formatted */}
              <div className="whitespace-pre-line">{msg.text}</div>

              {/* Citations Box (if assistant grounded answer) */}
              {msg.citations && msg.citations.length > 0 && (
                <div className={`mt-3 pt-3 border-t space-y-2 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                  <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    <Quote className="w-3 h-3 text-indigo-500" />
                    Referenced Feedback Citations ({msg.citations.length})
                  </span>

                  <div className="grid grid-cols-1 gap-2">
                    {msg.citations.map((cite) => (
                      <div
                        key={cite.id}
                        onClick={() => {
                          const original = feedbacks.find((f) => f.id === cite.id);
                          if (original) onSelectFeedback(original);
                        }}
                        className={`p-2.5 rounded-xl border transition-all text-xs cursor-pointer group ${
                          isDark
                            ? 'bg-slate-900/80 border-slate-700 hover:border-indigo-500 text-slate-200'
                            : 'bg-white border-slate-200 hover:border-indigo-300 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between font-semibold text-[11px] mb-1">
                          <span className="group-hover:text-indigo-400 transition-colors">
                            {cite.company} ({cite.customer})
                          </span>
                          <span className={`capitalize ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {cite.channel} • {cite.tier}
                          </span>
                        </div>
                        <p className={`italic line-clamp-2 text-[11px] ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                          "{cite.content}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Follow-Ups */}
              {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                <div className="mt-3 pt-2 flex items-center gap-1.5 flex-wrap">
                  <span className={`text-[10px] uppercase font-bold ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>Follow-ups:</span>
                  {msg.suggestedFollowUps.map((followUp, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(followUp)}
                      className={`text-[11px] px-2 py-0.5 rounded-md border font-medium transition-colors cursor-pointer ${
                        isDark
                          ? 'bg-slate-900 hover:bg-slate-800 text-indigo-300 border-slate-700'
                          : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-100'
                      }`}
                    >
                      {followUp} →
                    </button>
                  ))}
                </div>
              )}

              <span
                className={`block text-[10px] mt-2 ${
                  msg.sender === 'user' ? 'text-slate-300 text-right' : isDark ? 'text-slate-400' : 'text-slate-400'
                }`}
              >
                {msg.timestamp}
              </span>
            </div>

            {msg.sender === 'user' && (
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  isDark ? 'bg-slate-700 text-slate-200' : 'bg-slate-200 text-slate-700'
                }`}
              >
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div
              className={`rounded-2xl p-4 flex items-center gap-2 text-xs border ${
                isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
              <span>Analyzing customer sentiment across 9 channels with Gemini...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Composer */}
      <div className={`p-4 border-t ${isDark ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50/70 border-slate-200'}`}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask anything about feedback trends, churn risks, feature requests, or customer quotes..."
            className={`flex-1 px-4 py-2.5 rounded-xl text-xs sm:text-sm border transition-all ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
            }`}
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || loading}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>Ask</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
