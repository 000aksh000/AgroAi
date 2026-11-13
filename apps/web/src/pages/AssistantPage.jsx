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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-sand-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-soil-900 tracking-tight">
              Kisan AI Agricultural Assistant
            </h1>
            <Badge variant="leaf" size="sm">
              <Sprout className="w-3 h-3 text-leaf-600 mr-0.5 inline" />
              Gemini Agri-LLM
            </Badge>
          </div>
          <p className="text-xs text-soil-500 mt-1 font-medium">
            Ask questions regarding fertilizer dosages, irrigation cycles, pest remedies, and government farmer schemes.
          </p>
        </div>

        <Button
          size="sm"
          onClick={handleStartNewChat}
          icon={<Plus className="w-4 h-4" />}
          className="shadow-warm"
        >
          New Conversation
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start h-[calc(100vh-210px)] min-h-[580px]">
        {/* Conversations History Sidebar */}
        <Card className="lg:col-span-4 h-full flex flex-col p-3 overflow-hidden border border-sand-200 shadow-warm">
          <div className="px-2 py-2 flex items-center justify-between border-b border-sand-200/70 mb-2">
            <span className="text-xs font-bold text-soil-700 uppercase tracking-wider flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-leaf-600" />
              Recent Consultations
            </span>
            <span className="text-[10px] text-soil-400 font-bold bg-sand-100 px-2 py-0.5 rounded-full">
              {conversations.length} saved
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            {conversations.length === 0 ? (
              <div className="text-center py-10 text-xs text-soil-400 font-medium">
                No past consultations yet. Ask a question to begin!
              </div>
            ) : (
              conversations.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setActiveConversationId(c.id)}
                  className={`p-2.5 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-all ${
                    activeConversationId === c.id
                      ? "bg-gradient-to-r from-emerald-600 via-agri-600 to-leaf-700 text-white font-bold shadow-sm shadow-agri-700/20"
                      : "text-soil-700 hover:bg-sand-100/80 font-medium"
                  }`}
                >
                  <div className="truncate pr-2">
                    <span className="truncate block">{c.title}</span>
                    <span
                      className={`text-[10px] block mt-0.5 ${
                        activeConversationId === c.id ? "text-sand-100 font-normal" : "text-soil-400"
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
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      activeConversationId === c.id
                        ? "text-white/80 hover:text-white hover:bg-white/20"
                        : "text-soil-400 hover:text-rose-600 hover:bg-rose-50"
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
        <Card className="lg:col-span-8 h-full flex flex-col p-0 overflow-hidden border border-sand-200 shadow-warm">
          {/* Active Farm Context Banner */}
          {selectedFarm && (
            <div className="px-4 py-2.5 bg-sand-100/75 border-b border-sand-200/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-soil-800">
                <Tractor className="w-4 h-4 text-leaf-600" />
                <span className="font-medium">
                  Context attached: <strong className="text-soil-950 font-bold">{selectedFarm.name}</strong> ({selectedFarm.soilType} soil, {selectedFarm.district})
                </span>
              </div>
              <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-soil-600 font-bold">
                <input
                  type="checkbox"
                  checked={useFarmContext}
                  onChange={(e) => setUseFarmContext(e.target.checked)}
                  className="rounded border-sand-300 text-leaf-600 focus:ring-leaf-500"
                />
                Use Farm Context
              </label>
            </div>
          )}

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#fffefc]">
            {!activeConversationId &&
            (!activeConversation?.messages || activeConversation.messages.length === 0) ? (
              <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto py-8">
                <div className="w-14 h-14 rounded-2xl bg-leaf-100 text-leaf-700 border border-leaf-200 flex items-center justify-center mb-3 shadow-warm">
                  <BotMessageSquare className="w-7 h-7" />
                </div>
                <h3 className="text-base font-black text-soil-900">
                  How can Kisan AI help your farm today?
                </h3>
                <p className="text-xs text-soil-500 mt-1 leading-relaxed font-medium">
                  Type any agricultural question or pick one of the frequent topics below:
                </p>

                <div className="grid grid-cols-1 gap-2.5 mt-6 w-full text-left">
                  {SUGGESTED_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendMessageMutation.mutate(prompt)}
                      className="p-3 text-xs rounded-xl border border-sand-200/90 hover:border-leaf-400 bg-sand-50/70 hover:bg-leaf-50/50 text-soil-800 font-medium transition-colors text-left shadow-2xs cursor-pointer"
                    >
                      🌱 {prompt}
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
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                        isUser
                          ? "bg-soil-800 text-white shadow-2xs"
                          : "bg-gradient-to-br from-emerald-600 to-leaf-700 text-white shadow-xs shadow-agri-700/20"
                      }`}
                    >
                      {isUser ? <User className="w-4 h-4" /> : <BotMessageSquare className="w-4 h-4" />}
                    </div>

                    <div
                      className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? "bg-gradient-to-r from-soil-900 to-soil-800 text-white rounded-tr-none shadow-warm"
                          : "bg-sand-50/80 border border-sand-200/90 text-soil-900 rounded-tl-none prose prose-sm max-w-none shadow-warm font-normal"
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                      <span
                        className={`text-[10px] block mt-2 font-medium ${
                          isUser ? "text-sand-200 text-right" : "text-soil-400 text-left"
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
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-600 to-leaf-700 text-white flex items-center justify-center flex-shrink-0 animate-pulse shadow-xs">
                  <BotMessageSquare className="w-4 h-4" />
                </div>
                <div className="p-3 rounded-2xl bg-sand-100 rounded-tl-none text-xs text-soil-600 font-semibold flex items-center gap-2 border border-sand-200">
                  <div className="w-2 h-2 rounded-full bg-leaf-600 animate-ping" />
                  <span>Kisan AI is formulating scientific farming guidance...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-[#fffefc] border-t border-sand-200 flex items-center gap-2.5"
          >
            <input
              type="text"
              placeholder="Type your agricultural question in English or Hinglish..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-sand-300 focus:outline-none focus:ring-2 focus:ring-leaf-500 bg-[#faf7f0] text-soil-900 placeholder:text-soil-300 font-medium"
            />
            <Button
              type="submit"
              disabled={!inputText.trim() || sendMessageMutation.isPending}
              isLoading={sendMessageMutation.isPending}
              className="flex-shrink-0 shadow-warm"
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
