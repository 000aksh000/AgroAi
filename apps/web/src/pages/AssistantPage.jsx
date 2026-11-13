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
        conversationId: activeConversationId || void 0
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-[#E5E8DD]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#202820] tracking-tight">
              Kisan AI Agricultural Assistant
            </h1>
            <Badge variant="leaf" size="sm">
              <Sprout className="w-3 h-3 text-[#174C35] mr-0.5 inline" />
              Gemini Agri-LLM
            </Badge>
          </div>
          <p className="text-xs text-[#788579] mt-1 font-medium">
            Consult regarding fertilizer dosages, irrigation cycles, pest control protocols, and government agricultural schemes.
          </p>
        </div>

        <Button
          size="sm"
          onClick={handleStartNewChat}
          icon={<Plus className="w-4 h-4" />}
        >
          New Conversation
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start h-[calc(100vh-210px)] min-h-[580px]">
        {/* Conversations History Sidebar */}
        <Card className="lg:col-span-4 h-full flex flex-col p-3 overflow-hidden border border-[#E5E8DD]">
          <div className="px-2 py-2 flex items-center justify-between border-b border-[#E5E8DD] mb-2">
            <span className="text-xs font-semibold text-[#788579] uppercase tracking-wider flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-[#174C35]" />
              Consultation History
            </span>
            <span className="text-[10px] text-[#788579] font-medium bg-[#F0F6F3] px-2 py-0.5 rounded">
              {conversations.length} saved
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 pr-1">
            {conversations.length === 0 ? (
              <div className="text-center py-10 text-xs text-[#788579] font-medium">
                No previous conversations found.
              </div>
            ) : (
              conversations.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setActiveConversationId(c.id)}
                  className={`p-2.5 rounded-lg text-xs flex items-center justify-between cursor-pointer transition-colors ${
                    activeConversationId === c.id
                      ? "bg-[#174C35] text-white font-semibold shadow-xs"
                      : "text-[#202820] hover:bg-[#F0F6F3]"
                  }`}
                >
                  <div className="truncate pr-2">
                    <span className="truncate block">{c.title}</span>
                    <span
                      className={`text-[10px] block mt-0.5 ${
                        activeConversationId === c.id ? "text-[#C7E7C7]" : "text-[#788579]"
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
                    className={`p-1 rounded transition-colors cursor-pointer ${
                      activeConversationId === c.id
                        ? "text-white/80 hover:text-white hover:bg-white/20"
                        : "text-[#788579] hover:text-[#DC2626] hover:bg-red-50"
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
        <Card className="lg:col-span-8 h-full flex flex-col p-0 overflow-hidden border border-[#E5E8DD]">
          {/* Active Farm Context Banner */}
          {selectedFarm && (
            <div className="px-4 py-2.5 bg-[#F0F6F3] border-b border-[#DCE9E2] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-[#174C35]">
                <Tractor className="w-4 h-4 text-[#174C35]" />
                <span className="font-medium">
                  Attached Context: <strong className="font-semibold text-[#174C35]">{selectedFarm.name}</strong> ({selectedFarm.soilType} soil, {selectedFarm.district})
                </span>
              </div>
              <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-[#174C35] font-semibold">
                <input
                  type="checkbox"
                  checked={useFarmContext}
                  onChange={(e) => setUseFarmContext(e.target.checked)}
                  className="rounded border-[#DCE1D3] text-[#174C35] focus:ring-[#174C35]"
                />
                Apply Farm Context
              </label>
            </div>
          )}

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#FAFBF7]">
            {!activeConversationId &&
            (!activeConversation?.messages || activeConversation.messages.length === 0) ? (
              <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto py-8">
                <div className="w-12 h-12 rounded-xl bg-[#F0F6F3] text-[#174C35] border border-[#DCE9E2] flex items-center justify-center mb-3">
                  <BotMessageSquare className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#202820]">
                  How can Kisan AI assist your crop today?
                </h3>
                <p className="text-xs text-[#788579] mt-1 leading-relaxed">
                  Ask any agronomic question or select from common seasonal topics:
                </p>

                <div className="grid grid-cols-1 gap-2 mt-6 w-full text-left">
                  {SUGGESTED_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendMessageMutation.mutate(prompt)}
                      className="p-3 text-xs rounded-lg border border-[#E5E8DD] hover:border-[#174C35] bg-white hover:bg-[#F0F6F3] text-[#202820] font-medium transition-colors text-left cursor-pointer"
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
                          ? "bg-[#202820] text-white"
                          : "bg-[#174C35] text-white shadow-xs"
                      }`}
                    >
                      {isUser ? <User className="w-3.5 h-3.5" /> : <BotMessageSquare className="w-3.5 h-3.5" />}
                    </div>

                    <div
                      className={`max-w-[85%] rounded-xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? "bg-[#174C35] text-white rounded-tr-none shadow-xs"
                          : "bg-white border border-[#E5E8DD] text-[#202820] rounded-tl-none shadow-card prose prose-sm max-w-none"
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                      <span
                        className={`text-[10px] block mt-1.5 ${
                          isUser ? "text-[#C7E7C7] text-right" : "text-[#788579] text-left"
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
                <div className="w-7 h-7 rounded-full bg-[#174C35] text-white flex items-center justify-center flex-shrink-0 animate-pulse">
                  <BotMessageSquare className="w-3.5 h-3.5" />
                </div>
                <div className="p-3 rounded-lg bg-white border border-[#E5E8DD] text-xs text-[#788579] flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#174C35] animate-ping" />
                  <span>Kisan AI is formulating scientific agronomic guidance...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-white border-t border-[#E5E8DD] flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask an agricultural question in English or Hinglish..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-[#DCE1D3] focus:outline-none focus:ring-2 focus:ring-[#174C35] bg-[#FAFBF7] text-[#202820] placeholder:text-[#788579]/60 font-medium"
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
