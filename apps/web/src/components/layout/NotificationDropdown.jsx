import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, Check, CloudRain, AlertTriangle, TrendingUp, Info } from "lucide-react";
import { apiClient } from "../../api/client";

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await apiClient.get("/notifications");
      return res.data;
    },
    refetchInterval: 30000
  });

  const notifications = data?.data || [];
  const unreadCount = data?.meta?.unreadCount || 0;

  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      await apiClient.patch("/notifications/mark-all-read");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }
  });

  const markSingleReadMutation = useMutation({
    mutationFn: async (id) => {
      await apiClient.patch(`/notifications/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }
  });

  const getIcon = (type) => {
    switch (type) {
      case "weather_alert":
        return <CloudRain className="w-4 h-4 text-sky-400" />;
      case "pest_warning":
        return <AlertTriangle className="w-4 h-4 text-[#D4BE8D]" />;
      case "market_price_alert":
        return <TrendingUp className="w-4 h-4 text-[#A4D5A4]" />;
      default:
        return <Info className="w-4 h-4 text-[#A5AA96]" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-[#A5AA96] hover:bg-[#18251D] hover:text-[#F0EBDD] transition-colors focus:outline-none cursor-pointer"
        aria-label="View notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#8B2E2E] text-[10px] font-bold text-white ring-2 ring-[#101B16]">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#18251D] shadow-elevated border border-[#2D3B30] z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#2D3B30] bg-[#101B16]/70">
              <div className="flex items-center gap-2">
                <span className="text-sm font-serif font-bold text-[#F0EBDD]">Field Bulletins</span>
                {unreadCount > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#294C36] text-[#A4D5A4] border border-[#3F7655]/60 font-medium">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllReadMutation.mutate()}
                  className="text-xs font-medium text-[#D4BE8D] hover:text-[#F0EBDD] flex items-center gap-1 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-[#2D3B30]/60">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-sm text-[#A5AA96]">
                  No new bulletins. Agricultural advisories will appear here.
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      if (!n.isRead) markSingleReadMutation.mutate(n.id);
                    }}
                    className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                      n.isRead
                        ? "bg-[#18251D] hover:bg-[#202B22]/70"
                        : "bg-[#202B22] hover:bg-[#263428] border-l-2 border-l-[#B69A62]"
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-[#101B16] border border-[#2D3B30] flex-shrink-0 mt-0.5">
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs ${
                          n.isRead ? "font-medium text-[#D9CEB5]" : "font-bold text-[#F0EBDD]"
                        }`}
                      >
                        {n.title}
                      </p>
                      <p className="text-xs text-[#A5AA96] mt-0.5 leading-relaxed">
                        {n.message}
                      </p>
                      <span className="text-[10px] text-[#A5AA96]/80 mt-1 block font-mono">
                        {new Date(n.createdAt).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
