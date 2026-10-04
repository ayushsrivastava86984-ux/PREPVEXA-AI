import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Plus,
  Trash2,
  RotateCcw,
  BookOpen,
  Brain,
  HelpCircle,
  Copy,
  Check,
  Code,
  Lightbulb,
} from 'lucide-react';
import { Conversation, ChatMessage, Subject } from '../types';
import { StorageManager } from '../services/storage';
import { ApiService } from '../services/api';
import { useToast } from '../context/ToastContext';

interface AITutorViewProps {
  subjects: Subject[];
}

export const AITutorView: React.FC<AITutorViewProps> = ({ subjects }) => {
  const { addToast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>(() =>
    StorageManager.getConversations()
  );
  const [activeConvId, setActiveConvId] = useState<string>(() => {
    const list = StorageManager.getConversations();
    return list.length > 0 ? list[0].id : '';
  });

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];
  const [selectedSubject, setSelectedSubject] = useState<string>(
    activeConv?.subject || 'Data Structures & Algorithms'
  );
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages, isLoading]);

  const handleNewConversation = () => {
    const newConv: Conversation = {
      id: 'conv_' + Date.now(),
      userId: 'usr_vivora_student_1',
      subject: selectedSubject,
      title: 'New Study Session',
      messages: [
        {
          id: 'welcome_msg',
          role: 'assistant',
          content: `Hello! I am your **PREPVEXA AI Study Tutor** specialized in **${selectedSubject}**.\n\nHow can I help you excel today? You can ask me to explain a concept, walk through an example, summarize high-yield exam takeaways, or generate a practice question.`,
          timestamp: new Date().toISOString(),
        },
      ],
      updatedAt: new Date().toISOString(),
    };

    const updated = StorageManager.saveConversation(newConv);
    setConversations(updated);
    setActiveConvId(newConv.id);
  };

  const handleDeleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = StorageManager.deleteConversation(id);
    setConversations(updated);
    if (activeConvId === id) {
      setActiveConvId(updated[0]?.id || '');
    }
    addToast({ type: 'info', title: 'Session deleted' });
  };

  const handleClearMessages = () => {
    if (!activeConv) return;
    const cleared: Conversation = {
      ...activeConv,
      messages: [
        {
          id: 'cleared_welcome',
          role: 'assistant',
          content: `Session cleared. What would you like to review in **${activeConv.subject}**?`,
          timestamp: new Date().toISOString(),
        },
      ],
      updatedAt: new Date().toISOString(),
    };
    const updated = StorageManager.saveConversation(cleared);
    setConversations(updated);
    addToast({ type: 'info', title: 'Conversation cleared' });
  };

  const handleSendMessage = async (textToSend?: string, mode?: 'explain' | 'example' | 'summarize' | 'practice') => {
    const text = (textToSend || inputPrompt).trim();
    if (!text || isLoading) return;

    if (!activeConv) {
      handleNewConversation();
    }

    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...(activeConv?.messages || []), userMsg];
    const currentConv: Conversation = {
      ...activeConv,
      title: activeConv?.messages.length <= 1 ? text.slice(0, 32) : activeConv.title,
      subject: selectedSubject,
      messages: updatedMessages,
      updatedAt: new Date().toISOString(),
    };

    const updatedList = StorageManager.saveConversation(currentConv);
    setConversations(updatedList);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const historyPayload = updatedMessages.slice(-5).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await ApiService.sendChatMessage({
        message: text,
        history: historyPayload,
        subject: selectedSubject,
        mode: mode || 'explain',
      });

      const aiMsg: ChatMessage = {
        id: 'msg_ai_' + Date.now(),
        role: 'assistant',
        content: response.reply,
        timestamp: new Date().toISOString(),
        tokensUsed: response.tokensUsed,
      };

      const finalConv: Conversation = {
        ...currentConv,
        messages: [...updatedMessages, aiMsg],
        updatedAt: new Date().toISOString(),
      };

      const finalUpdatedList = StorageManager.saveConversation(finalConv);
      setConversations(finalUpdatedList);
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Tutor Connection Error',
        message: err.message || 'Failed to fetch AI response',
      });
      const errorMsg: ChatMessage = {
        id: 'msg_err_' + Date.now(),
        role: 'assistant',
        content:
          "⚠️ I encountered an issue contacting the AI server. Please check your network connection or try asking again in a moment.",
        timestamp: new Date().toISOString(),
      };
      const finalConv: Conversation = {
        ...currentConv,
        messages: [...updatedMessages, errorMsg],
        updatedAt: new Date().toISOString(),
      };
      setConversations(StorageManager.saveConversation(finalConv));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const suggestedPrompts = [
    { label: 'Explain Dijkstra with intuition', mode: 'explain' as const },
    { label: 'Compare Process vs Thread in OS', mode: 'explain' as const },
    { label: 'Give a dynamic programming example', mode: 'example' as const },
    { label: 'Summarize Belady\'s Anomaly', mode: 'summarize' as const },
    { label: 'Test me with a practice question', mode: 'practice' as const },
  ];

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-4 animate-in fade-in duration-300">
      {/* Sidebar: Conversation Sessions & Subject Filter */}
      <div className="w-full md:w-64 bg-[#0d101a] border border-white/[0.08] rounded-2xl p-4 flex flex-col shrink-0">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <span className="text-xs font-bold text-slate-200">Study Sessions</span>
          <button
            onClick={handleNewConversation}
            className="p-1.5 rounded-lg bg-pink-500/15 hover:bg-pink-500/25 border border-pink-500/30 text-pink-300 text-xs font-semibold flex items-center gap-1 transition-colors"
            title="New Conversation"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New</span>
          </button>
        </div>

        {/* Subject Context Selector */}
        <div className="mt-3">
          <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
            Subject Specialization
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-pink-500"
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
            <option value="General Engineering & Math">General Engineering</option>
          </select>
        </div>

        {/* Conversation List */}
        <div className="flex-1 mt-4 space-y-1.5 overflow-y-auto pr-1">
          {conversations.map((conv) => {
            const isActive = conv.id === activeConvId;
            return (
              <div
                key={conv.id}
                onClick={() => setActiveConvId(conv.id)}
                className={`p-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-between group ${
                  isActive
                    ? 'bg-pink-500/20 border border-pink-500/35 text-white'
                    : 'bg-slate-900/40 hover:bg-slate-900/80 text-slate-400 border border-transparent'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <p className="text-xs font-semibold truncate">{conv.title}</p>
                  <p className="text-[10px] text-slate-500 truncate">{conv.subject}</p>
                </div>
                <button
                  onClick={(e) => handleDeleteConversation(conv.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 rounded transition-opacity"
                  title="Delete session"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Clear Current Session Button */}
        {activeConv && (
          <div className="pt-3 border-t border-white/[0.08]">
            <button
              onClick={handleClearMessages}
              className="w-full py-1.5 px-3 rounded-lg text-[11px] font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Current Chat</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 bg-[#0d101a] border border-white/[0.08] rounded-2xl flex flex-col overflow-hidden relative">
        {/* Header */}
        <div className="p-4 border-b border-white/[0.08] bg-slate-950/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-pink-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white">PREPVEXA AI Study Tutor</h2>
                <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  gemini-3.8-flash
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Context: {selectedSubject}</p>
            </div>
          </div>

          {/* Quick Mode Buttons */}
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={() => handleSendMessage('Explain the core concept and intuition', 'explain')}
              className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-white/10 flex items-center gap-1 transition-colors"
            >
              <Lightbulb className="w-3 h-3 text-amber-400" />
              Explain
            </button>
            <button
              onClick={() => handleSendMessage('Provide a concrete, step-by-step example', 'example')}
              className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-white/10 flex items-center gap-1 transition-colors"
            >
              <Code className="w-3 h-3 text-pink-400" />
              Example
            </button>
            <button
              onClick={() => handleSendMessage('Give a high-yield summary of key exam points', 'summarize')}
              className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-white/10 flex items-center gap-1 transition-colors"
            >
              <BookOpen className="w-3 h-3 text-purple-400" />
              Summary
            </button>
            <button
              onClick={() => handleSendMessage('Give me a practice multiple-choice question to solve', 'practice')}
              className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-white/10 flex items-center gap-1 transition-colors"
            >
              <HelpCircle className="w-3 h-3 text-emerald-400" />
              Practice
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {activeConv?.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-pink-500/20 border border-pink-500/40 flex items-center justify-center shrink-0 mt-0.5">
                  <Brain className="w-4 h-4 text-pink-400" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed relative group ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white font-medium shadow-md shadow-pink-500/20'
                    : 'bg-slate-900/80 border border-white/[0.08] text-slate-200'
                }`}
              >
                {/* Copy button */}
                <button
                  onClick={() => handleCopyText(msg.content, msg.id)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded bg-black/40 text-slate-400 hover:text-white transition-opacity"
                  title="Copy text"
                >
                  {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>

                <div className="whitespace-pre-wrap space-y-2">{msg.content}</div>

                <div className="flex items-center justify-end gap-2 mt-2 pt-1 border-t border-white/[0.06] text-[10px] opacity-60">
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {msg.tokensUsed && <span>· {msg.tokensUsed} tokens</span>}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-pink-500/20 border border-pink-500/40 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-pink-400 animate-spin" />
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/[0.08] flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-pink-400 animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-pink-400 animate-bounce [animation-delay:0.4s]" />
                <span className="text-xs text-slate-400 ml-1">AI Tutor formulating response...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts Pill Carousel */}
        <div className="px-4 py-2 border-t border-white/[0.06] bg-slate-950/20 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider shrink-0">
            Suggested:
          </span>
          {suggestedPrompts.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(s.label, s.mode)}
              className="text-xs px-2.5 py-1 rounded-full bg-slate-900 border border-white/[0.08] hover:border-pink-500/40 text-slate-300 hover:text-white whitespace-nowrap transition-colors shrink-0"
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-white/[0.08] bg-[#090b10]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder={`Ask a question about ${selectedSubject}...`}
              className="flex-1 px-4 py-3 rounded-xl bg-slate-900/90 border border-white/10 text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:border-pink-500 transition-colors"
            />
            <button
              type="submit"
              disabled={isLoading || !inputPrompt.trim()}
              className="p-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold disabled:opacity-40 disabled:hover:scale-100 hover:brightness-110 active:scale-95 transition-all shadow-md shadow-pink-500/25 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
