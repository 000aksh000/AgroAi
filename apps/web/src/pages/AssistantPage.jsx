import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  BotMessageSquare,
  Send,
  Plus,
  Trash2,
  Tractor,
  User,
  Sprout,
  Leaf
} from "lucide-react";
import { useFarm } from "../context/FarmContext";
import { apiClient } from "../api/client";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";

const SUGGESTED_PROMPTS = [
  "What is the recommended fertilizer schedule for wheat (NPK split)?",
  "How do I control tomato leaf curl virus and whiteflies naturally?",
  "Explain PM-KISAN installment eligibility and Kisan Credit Card (KCC)",
  "When is the optimal time to spray pesticide based on weather?"
];

export const AssistantPage = () => {
  const { selectedFarm } = useFarm();
  const queryClient = useQueryClient();
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [inputText, setInputText] = useState("");
  const [useFarmContext, setUseFarmContext] = useState(true);
  const messagesEndRef = useRef(null);

  const { data: conversations = [], refetch: refetchConversations } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const res = await apiClient.get("/assistant/conversations");
      return res.data.data;
    }
  });

  const { data: activeConversation, isLoading: isLoadingMessages } = useQuery({
    queryKey: ["conversation-detail", activeConversationId],
    queryFn: async () => {
      if (!activeConversationId) return null;
      const res = await apiClient.get(`/assistant/conversations/${activeConversationId}`);
      return res.data.data;
    },
    enabled: !!activeConversationId
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation?.messages]);

  useEffect(() => {
    if (conversations.length > 0 && !activeConversationId) {
      setActiveConversationId(conversations[0].id);
    }
  }, [conversations, activeConversationId]);

  const sendMessageMutation = useMutation({
    mutationFn: async (messageText) => {
      const payload = {
        message: messageText,
        conversationId: activeConversationId || undefined
      };
      if (useFarmContext && selectedFarm) {
        payload.farmId = selectedFarm.id;
      }
      const res = await apiClient.post("/assistant/chat", payload);
      return res.data.data;
    },
    onSuccess: (data) => {
      setInputText("");
      if (!activeConversationId) {
        setActiveConversationId(data.conversationId);
      }
      queryClient.invalidateQueries({ queryKey: ["conversation-detail", data.conversationId] });
      refetchConversations();
    }
  });

  const deleteConversationMutation = useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(`/assistant/conversations/${id}`);
    },
    onSuccess: () => {
      setActiveConversationId(null);
      refetchConversations();
    }
  });

  const handleSend = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      sendMessageMutation.mutate(inputText.trim());
    }
  };

  const handleStartNewChat = () => {
    setActiveConversationId(null);
    setInputText("");
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-[#2D3B30]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-[#F0EBDD] tracking-tight">
              Kisan AI Field Intelligence Assistant
            </h1>
            <Badge variant="gold" size="sm">
              <Sprout className="w-3 h-3 text-[#D4BE8D] mr-0.5 inline" />
              Agronomic LLM
            </Badge>
          </div>
          <p className="text-xs text-[#A5AA96] mt-1 font-medium">
            Consult regarding fertilizer regimens, irrigation timing, biological pest control, and government agricultural schemes.
          </p>
        </div>

        <Button
          size="sm"
          onClick={handleStartNewChat}
          icon={<Plus className="w-4 h-4 text-[#D4BE8D]" />}
          className="bg-[#294C36] hover:bg-[#346045] text-[#F0EBDD] border border-[#B69A62]/40"
        >
          New Consultation
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start h-[calc(100vh-210px)] min-h-[580px]">
        {/* Conversations History Sidebar */}
        <Card className="lg:col-span-4 h-full flex flex-col p-3 overflow-hidden border border-[#2D3B30] bg-[#18251D]">
          <div className="px-2 py-2 flex items-center justify-between border-b border-[#2D3B30] mb-2">
            <span className="text-xs font-serif font-bold text-[#D4BE8D] uppercase tracking-wider flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-[#B69A62]" />
              Consultation Logs
            </span>
            <span className="text-[10px] text-[#A5AA96] font-medium bg-[#101B16] px-2 py-0.5 rounded border border-[#2D3B30]">
              {conversations.length} saved
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            {conversations.length === 0 ? (
              <div className="text-center py-10 text-xs text-[#A5AA96] font-medium">
                No previous consultations found.
              </div>
            ) : (
              conversations.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setActiveConversationId(c.id)}
                  className={`p-2.5 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-colors ${
                    activeConversationId === c.id
                      ? "bg-[#202B22] text-[#F0EBDD] font-semibold border-l-2 border-l-[#B69A62] border border-[#B69A62]/30 shadow-subtle"
                      : "text-[#D9CEB5] hover:bg-[#202B22]/70"
                  }`}
                >
                  <div className="truncate pr-2">
                    <span className="truncate block font-medium">{c.title}</span>
                    <span
                      className={`text-[10px] block mt-0.5 ${
                        activeConversationId === c.id ? "text-[#D4BE8D]" : "text-[#A5AA96]"
                      }`}
                    >
                      {new Date(c.updatedAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric"
                      })}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm("Delete this conversation?")) {
                        deleteConversationMutation.mutate(c.id);
                      }
                    }}
                    className={`p-1 rounded-lg transition-colors cursor-pointer ${
                      activeConversationId === c.id
                        ? "text-[#A5AA96] hover:text-rose-400 hover:bg-[#101B16]"
                        : "text-[#A5AA96] hover:text-rose-400 hover:bg-[#101B16]"
                    }`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Chat Window */}
        <Card className="lg:col-span-8 h-full flex flex-col p-0 overflow-hidden border border-[#2D3B30] bg-[#18251D]">
          {/* Active Farm Context Banner */}
          {selectedFarm && (
            <div className="px-4 py-2.5 bg-[#101B16] border-b border-[#2D3B30] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-[#D4BE8D]">
                <Tractor className="w-4 h-4 text-[#B69A62]" />
                <span className="font-medium">
                  Plot Context: <strong className="font-serif font-bold text-[#F0EBDD]">{selectedFarm.name}</strong> ({selectedFarm.soilType} soil, {selectedFarm.district})
                </span>
              </div>
              <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-[#D4BE8D] font-semibold">
                <input
                  type="checkbox"
                  checked={useFarmContext}
                  onChange={(e) => setUseFarmContext(e.target.checked)}
                  className="rounded border-[#2D3B30] text-[#B69A62] focus:ring-[#B69A62] bg-[#18251D]"
                />
                Apply Farm Context
              </label>
            </div>
          )}

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#101B16]/85">
            {!activeConversationId &&
            (!activeConversation?.messages || activeConversation.messages.length === 0) ? (
              <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto py-8">
                <div className="w-13 h-13 rounded-2xl bg-[#202B22] text-[#B69A62] border border-[#B69A62]/30 flex items-center justify-center mb-3.5 shadow-subtle">
                  <BotMessageSquare className="w-6 h-6" />
                </div>
                <h3 className="text-base font-serif font-bold text-[#F0EBDD]">
                  How can Kisan AI assist your crop operations today?
                </h3>
                <p className="text-xs text-[#A5AA96] mt-1 leading-relaxed">
                  Inquire regarding soil amendment, pest risk, irrigation scheduling, or select a topic:
                </p>

                <div className="grid grid-cols-1 gap-2 mt-6 w-full text-left">
                  {SUGGESTED_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendMessageMutation.mutate(prompt)}
                      className="p-3 text-xs rounded-xl border border-[#2D3B30] hover:border-[#B69A62]/50 bg-[#18251D] hover:bg-[#202B22] text-[#D9CEB5] font-medium transition-all text-left cursor-pointer shadow-subtle"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              activeConversation?.messages.map((msg) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${
                      isUser ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                        isUser
                          ? "bg-[#79563C] text-[#F0EBDD] border border-[#B69A62]/30"
                          : "bg-[#294C36] text-[#D4BE8D] border border-[#B69A62]/30 shadow-subtle"
                      }`}
                    >
                      {isUser ? <User className="w-3.5 h-3.5" /> : <BotMessageSquare className="w-3.5 h-3.5" />}
                    </div>

                    <div
                      className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? "bg-[#294C36] text-[#F0EBDD] rounded-tr-none border border-[#B69A62]/30 shadow-subtle"
                          : "bg-[#202B22] border border-[#2D3B30] text-[#D9CEB5] rounded-tl-none shadow-card"
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                      <span
                        className={`text-[10px] block mt-1.5 font-mono ${
                          isUser ? "text-[#A4D5A4] text-right" : "text-[#A5AA96] text-left"
                        }`}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}

            {sendMessageMutation.isPending && (
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-[#294C36] text-[#D4BE8D] border border-[#B69A62]/30 flex items-center justify-center flex-shrink-0 animate-pulse">
                  <BotMessageSquare className="w-3.5 h-3.5" />
                </div>
                <div className="p-3.5 rounded-xl bg-[#202B22] border border-[#2D3B30] text-xs text-[#D4BE8D] flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#B69A62] animate-ping" />
                  <span className="font-serif italic">Formulating scientific agronomic guidance...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-[#18251D] border-t border-[#2D3B30] flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask an agricultural question in English or Hinglish..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#2D3B30] focus:outline-none focus:ring-2 focus:ring-[#B69A62] bg-[#101B16] text-[#F0EBDD] placeholder:text-[#A5AA96]/50 font-medium"
            />
            <Button
              type="submit"
              disabled={!inputText.trim() || sendMessageMutation.isPending}
              isLoading={sendMessageMutation.isPending}
              className="flex-shrink-0 bg-[#294C36] hover:bg-[#346045] text-[#F0EBDD] border border-[#B69A62]/40"
              icon={<Send className="w-4 h-4 text-[#D4BE8D]" />}
            >
              Send
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
