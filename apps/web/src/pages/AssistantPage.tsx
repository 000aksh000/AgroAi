import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  BotMessageSquare,
  Send,
  Plus,
  Trash2,
  Tractor,
  Sparkles,
  User,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { apiClient } from '../api/client';
import { IChatMessage, IConversation } from '@agrosmart/shared-types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

const SUGGESTED_PROMPTS = [
  'What is the recommended fertilizer schedule for wheat (NPK split)?',
  'How do I control tomato leaf curl virus and whiteflies naturally?',
  'Explain PM-KISAN installment eligibility and Kisan Credit Card (KCC)',
  'When is the optimal time to spray pesticide based on weather?',
];

export const AssistantPage: React.FC = () => {
  const { selectedFarm } = useFarm();
  const queryClient = useQueryClient();

  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [useFarmContext, setUseFarmContext] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch list of conversations
  const { data: conversations = [], refetch: refetchConversations } = useQuery<IConversation[]>({
    queryKey: ['conversations'],
    queryFn: async () => {
      const res = await apiClient.get('/assistant/conversations');
      return res.data.data;
    },
  });

  // Fetch active conversation detail
  const { data: activeConversation, isLoading: isLoadingMessages } = useQuery<IConversation>({
    queryKey: ['conversation-detail', activeConversationId],
    queryFn: async () => {
      if (!activeConversationId) return null as any;
      const res = await apiClient.get(`/assistant/conversations/${activeConversationId}`);
      return res.data.data;
    },
    enabled: !!activeConversationId,
  });

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  // Select latest conversation if available
  useEffect(() => {
    if (conversations.length > 0 && !activeConversationId) {
      setActiveConversationId(conversations[0].id);
    }
  }, [conversations, activeConversationId]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageText: string) => {
      const payload: any = {
        message: messageText,
        conversationId: activeConversationId || undefined,
      };
      if (useFarmContext && selectedFarm) {
        payload.farmId = selectedFarm.id;
      }
      const res = await apiClient.post('/assistant/chat', payload);
      return res.data.data;
    },
    onSuccess: (data) => {
      setInputText('');
      if (!activeConversationId) {
        setActiveConversationId(data.conversationId);
      }
      queryClient.invalidateQueries({ queryKey: ['conversation-detail', data.conversationId] });
      refetchConversations();
    },
  });

  const deleteConversationMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/assistant/conversations/${id}`);
    },
    onSuccess: () => {
      setActiveConversationId(null);
      refetchConversations();
    },
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      sendMessageMutation.mutate(inputText.trim());
    }
  };

  const handleStartNewChat = () => {
    setActiveConversationId(null);
    setInputText('');
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Kisan AI Agricultural Assistant
            </h1>
            <Badge variant="success" size="sm">Advisory AI</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Ask questions regarding fertilizer dosages, irrigation cycles, pest remedies, and government farmer schemes.
          </p>
        </div>

        <Button size="sm" onClick={handleStartNewChat} icon={<Plus className="w-4 h-4" />}>
          New Conversation
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start h-[calc(100vh-210px)] min-h-[580px]">
        {/* Conversations History Sidebar (3 cols on lg) */}
        <Card className="lg:col-span-4 h-full flex flex-col p-3 overflow-hidden">
          <div className="px-2 py-2 flex items-center justify-between border-b border-slate-100 mb-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Recent Consultations
            </span>
            <span className="text-[10px] text-slate-400 font-semibold">{conversations.length} saved</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 pr-1">
            {conversations.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-400">
                No past consultations yet. Ask a question to begin!
              </div>
            ) : (
              conversations.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setActiveConversationId(c.id)}
                  className={`p-2.5 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-colors ${
                    activeConversationId === c.id
                      ? 'bg-agri-600 text-white font-semibold shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="truncate pr-2">
                    <span className="truncate block">{c.title}</span>
                    <span className={`text-[10px] block ${activeConversationId === c.id ? 'text-emerald-100' : 'text-slate-400'}`}>
                      {new Date(c.updatedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Delete this conversation?')) {
                        deleteConversationMutation.mutate(c.id);
                      }
                    }}
                    className={`p-1 rounded-md transition-colors ${
                      activeConversationId === c.id
                        ? 'text-white/70 hover:text-white hover:bg-white/20'
                        : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                    }`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Chat Window (8 cols on lg) */}
        <Card className="lg:col-span-8 h-full flex flex-col p-0 overflow-hidden border border-slate-200">
          {/* Active Farm Context Banner */}
          {selectedFarm && (
            <div className="px-4 py-2.5 bg-earth-50 border-b border-slate-200/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <Tractor className="w-4 h-4 text-agri-600" />
                <span>
                  Context attached: <strong>{selectedFarm.name}</strong> ({selectedFarm.soilType} soil, {selectedFarm.district})
                </span>
              </div>
              <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-500 font-medium">
                <input
                  type="checkbox"
                  checked={useFarmContext}
                  onChange={(e) => setUseFarmContext(e.target.checked)}
                  className="rounded border-slate-300 text-agri-600 focus:ring-agri-500"
                />
                Use Farm Context
              </label>
            </div>
          )}

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {!activeConversationId && (!activeConversation?.messages || activeConversation.messages.length === 0) ? (
              <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto py-8">
                <div className="w-14 h-14 rounded-2xl bg-agri-100 text-agri-700 flex items-center justify-center mb-3">
                  <BotMessageSquare className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-slate-800">
                  How can Kisan AI help your farm today?
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Type any agricultural question or pick one of the frequent topics below:
                </p>

                <div className="grid grid-cols-1 gap-2 mt-6 w-full text-left">
                  {SUGGESTED_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendMessageMutation.mutate(prompt)}
                      className="p-2.5 text-xs rounded-xl border border-slate-200 hover:border-agri-300 bg-slate-50 hover:bg-agri-50/50 text-slate-700 transition-colors text-left"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              activeConversation?.messages.map((msg: IChatMessage) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                        isUser
                          ? 'bg-slate-800 text-white'
                          : 'bg-agri-600 text-white shadow-sm'
                      }`}
                    >
                      {isUser ? <User className="w-4 h-4" /> : <BotMessageSquare className="w-4 h-4" />}
                    </div>

                    <div
                      className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? 'bg-slate-900 text-white rounded-tr-none'
                          : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none prose prose-sm max-w-none'
                      }`}
                    >
                      {/* Simple Markdown Rendering */}
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                      <span
                        className={`text-[10px] block mt-1.5 ${
                          isUser ? 'text-slate-400 text-right' : 'text-slate-400 text-left'
                        }`}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}

            {sendMessageMutation.isPending && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-agri-600 text-white flex items-center justify-center flex-shrink-0 animate-pulse">
                  <BotMessageSquare className="w-4 h-4" />
                </div>
                <div className="p-3 rounded-2xl bg-slate-100 rounded-tl-none text-xs text-slate-500 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-agri-600 animate-ping" />
                  <span>Kisan AI is formulating scientific farming guidance...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              placeholder="Type your agricultural question in English or Hinglish..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-500"
            />
            <Button
              type="submit"
              disabled={!inputText.trim() || sendMessageMutation.isPending}
              isLoading={sendMessageMutation.isPending}
              className="flex-shrink-0"
              icon={<Send className="w-4 h-4" />}
            >
              Send
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
