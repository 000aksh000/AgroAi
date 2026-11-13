import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ShieldAlert,
  Server,
  Search
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { apiClient } from "../api/client";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";

export const AdminPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [userSearch, setUserSearch] = useState("");

  const { data: analyticsData, isLoading: isLoadingAnalytics } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const res = await apiClient.get("/admin/analytics");
      return res.data.data;
    },
    enabled: user?.role === "admin"
  });

  const { data: usersData, isLoading: isLoadingUsers, refetch: refetchUsers } = useQuery({
    queryKey: ["admin-users", userSearch],
    queryFn: async () => {
      const res = await apiClient.get("/admin/users", {
        params: { search: userSearch }
      });
      return res.data;
    },
    enabled: user?.role === "admin" && activeTab === "users"
  });

  const { data: healthData, isLoading: isLoadingHealth, refetch: refetchHealth } = useQuery({
    queryKey: ["admin-system-health"],
    queryFn: async () => {
      const res = await apiClient.get("/admin/system-health");
      return res.data.data;
    },
    enabled: user?.role === "admin" && activeTab === "system",
    refetchInterval: 15000
  });

  const { data: auditData, isLoading: isLoadingAudit } = useQuery({
    queryKey: ["admin-audit-logs"],
    queryFn: async () => {
      const res = await apiClient.get("/admin/audit-logs");
      return res.data;
    },
    enabled: user?.role === "admin" && activeTab === "audit"
  });

  const toggleRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }) => {
      await apiClient.patch(`/admin/users/${userId}/role`, { role: newRole });
    },
    onSuccess: () => {
      refetchUsers();
      queryClient.invalidateQueries({ queryKey: ["admin-audit-logs"] });
    }
  });

  if (user?.role !== "admin") {
    return (
      <div className="text-center py-20 bg-[#18251D] rounded-2xl border border-rose-900/50 p-8 max-w-md mx-auto shadow-elevated">
        <ShieldAlert className="w-12 h-12 text-rose-400 mx-auto mb-3" />
        <h2 className="text-lg font-serif font-bold text-[#F0EBDD]">Administrator Access Restricted</h2>
        <p className="text-xs text-[#A5AA96] mt-1">
          You are currently signed in as a standard farmer account. Administrative privileges are required to access this console.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#2D3B30]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-[#F0EBDD] tracking-tight">
              Administrative Command Center
            </h1>
            <Badge variant="danger" size="sm">Admin Only</Badge>
          </div>
          <p className="text-xs text-[#A5AA96] mt-1 font-medium">
            System health diagnostics, machine learning model versioning, user accounts, and security audit logs.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-[#18251D] rounded-xl border border-[#2D3B30] text-xs font-semibold">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === "overview"
                ? "bg-[#294C36] text-[#F0EBDD] border border-[#B69A62]/40 shadow-subtle"
                : "text-[#A5AA96] hover:text-[#F0EBDD]"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === "users"
                ? "bg-[#294C36] text-[#F0EBDD] border border-[#B69A62]/40 shadow-subtle"
                : "text-[#A5AA96] hover:text-[#F0EBDD]"
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab("system")}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === "system"
                ? "bg-[#294C36] text-[#F0EBDD] border border-[#B69A62]/40 shadow-subtle"
                : "text-[#A5AA96] hover:text-[#F0EBDD]"
            }`}
          >
            System Health
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === "audit"
                ? "bg-[#294C36] text-[#F0EBDD] border border-[#B69A62]/40 shadow-subtle"
                : "text-[#A5AA96] hover:text-[#F0EBDD]"
            }`}
          >
            Audit Logs
          </button>
        </div>
      </div>

      {/* Tab: Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card hoverable className="border-l-4 border-l-[#B69A62]">
              <span className="text-xs font-semibold text-[#A5AA96] block uppercase">Total Operators</span>
              <span className="text-3xl font-serif font-bold text-[#F0EBDD] mt-1 block">
                {analyticsData?.totals?.users ?? 0}
              </span>
              <span className="text-[10px] text-[#A5AA96] mt-1 block">Registered farmer accounts</span>
            </Card>

            <Card hoverable className="border-l-4 border-l-[#71805A]">
              <span className="text-xs font-semibold text-[#A5AA96] block uppercase">Total Parcels</span>
              <span className="text-3xl font-serif font-bold text-[#F0EBDD] mt-1 block">
                {analyticsData?.totals?.farms ?? 0}
              </span>
              <span className="text-[10px] text-[#A5AA96] mt-1 block">Configured agricultural plots</span>
            </Card>

            <Card hoverable className="border-l-4 border-l-[#294C36]">
              <span className="text-xs font-semibold text-[#A5AA96] block uppercase">Crop Predictions</span>
              <span className="text-3xl font-serif font-bold text-[#A4D5A4] mt-1 block">
                {analyticsData?.totals?.cropRecommendations ?? 0}
              </span>
              <span className="text-[10px] text-[#A5AA96] mt-1 block">ML inferences completed</span>
            </Card>

            <Card hoverable className="border-l-4 border-l-[#79563C]">
              <span className="text-xs font-semibold text-[#A5AA96] block uppercase">Disease Scans</span>
              <span className="text-3xl font-serif font-bold text-[#D5BEA8] mt-1 block">
                {analyticsData?.totals?.diseaseScans ?? 0}
              </span>
              <span className="text-[10px] text-[#A5AA96] mt-1 block">Leaf pathologies diagnosed</span>
            </Card>
          </div>

          {/* Quick System Summary */}
          <Card>
            <h3 className="text-xs font-serif font-bold text-[#D4BE8D] uppercase tracking-wider mb-4">
              Infrastructure &amp; AI Microservices Architecture
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[#18251D] border border-[#2D3B30] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#F0EBDD] block">Node.js Express API</span>
                  <span className="text-[10px] text-[#A5AA96]">Port 5000 • Production Ready</span>
                </div>
                <Badge variant="success" size="sm">Online</Badge>
              </div>

              <div className="p-3.5 rounded-xl bg-[#18251D] border border-[#2D3B30] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#F0EBDD] block">FastAPI Python ML Service</span>
                  <span className="text-[10px] text-[#A5AA96]">Port 8001 • Scikit-learn + CV</span>
                </div>
                <Badge variant="success" size="sm">Connected</Badge>
              </div>

              <div className="p-3.5 rounded-xl bg-[#18251D] border border-[#2D3B30] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#F0EBDD] block">MongoDB Database</span>
                  <span className="text-[10px] text-[#A5AA96]">Local Engine: 27017</span>
                </div>
                <Badge variant="success" size="sm">Connected</Badge>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tab: Users */}
      {activeTab === "users" && (
        <Card className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#2D3B30]">
            <h3 className="text-xs font-serif font-bold text-[#D4BE8D] uppercase tracking-wider">
              Farmer &amp; Admin User Accounts
            </h3>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-[#A5AA96] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search users..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#2D3B30] focus:outline-none focus:ring-2 focus:ring-[#B69A62] bg-[#101B16] text-[#F0EBDD]"
              />
            </div>
          </div>

          {isLoadingUsers ? (
            <LoadingSkeleton count={4} className="h-12" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#2D3B30] text-[#A5AA96] font-serif font-semibold uppercase text-[10px]">
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Location</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3">Joined</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2D3B30]">
                  {usersData?.data?.map((u) => (
                    <tr key={u.id} className="hover:bg-[#18251D] transition-colors">
                      <td className="py-3 font-semibold text-[#F0EBDD]">{u.name}</td>
                      <td className="py-3 text-[#D9CEB5]">{u.email}</td>
                      <td className="py-3 text-[#A5AA96]">
                        {u.district ? `${u.district}, ` : ""}{u.state || "N/A"}
                      </td>
                      <td className="py-3">
                        <Badge variant={u.role === "admin" ? "danger" : "gold"} size="sm">
                          {u.role}
                        </Badge>
                      </td>
                      <td className="py-3 text-[#A5AA96] font-mono">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => {
                            const newRole = u.role === "admin" ? "farmer" : "admin";
                            if (confirm(`Change role of "${u.name}" to ${newRole}?`)) {
                              toggleRoleMutation.mutate({ userId: u.id, newRole });
                            }
                          }}
                          className="text-xs font-semibold text-[#D4BE8D] hover:text-[#F0EBDD] underline cursor-pointer"
                        >
                          Make {u.role === "admin" ? "Farmer" : "Admin"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* Tab: System Health */}
      {activeTab === "system" && (
        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between pb-3 border-b border-[#2D3B30] mb-4">
              <h3 className="text-xs font-serif font-bold text-[#D4BE8D] uppercase tracking-wider flex items-center gap-2">
                <Server className="w-4 h-4 text-[#B69A62]" />
                Live Node.js &amp; Python Architecture Health
              </h3>
              <Button size="sm" variant="outline" onClick={() => refetchHealth()}>
                Refresh Diagnostics
              </Button>
            </div>

            {isLoadingHealth ? (
              <LoadingSkeleton count={3} className="h-24 mb-3" />
            ) : healthData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* API Box */}
                <div className="p-4 rounded-xl bg-[#18251D] border border-[#2D3B30]">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-serif font-bold text-[#F0EBDD] text-sm">Node.js Express API</h4>
                    <Badge variant="success">Online</Badge>
                  </div>
                  <div className="space-y-1.5 text-[#A5AA96]">
                    <div>Uptime: <strong className="text-[#F0EBDD] font-mono">{healthData.api.uptimeSeconds} seconds</strong></div>
                    <div>Node Version: <strong className="text-[#F0EBDD] font-mono">{healthData.api.nodeVersion}</strong></div>
                    <div>Memory Footprint: <strong className="text-[#F0EBDD] font-mono">{healthData.api.memoryUsageMb} MB</strong></div>
                    <div>Environment: <strong className="text-[#D4BE8D] font-mono">{healthData.environment}</strong></div>
                  </div>
                </div>

                {/* ML Box */}
                <div className="p-4 rounded-xl bg-[#18251D] border border-[#2D3B30]">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-serif font-bold text-[#F0EBDD] text-sm">FastAPI ML Microservice</h4>
                    <Badge variant={healthData.mlService?.status === "healthy" ? "success" : "warning"}>
                      {healthData.mlService?.status || "Unknown"}
                    </Badge>
                  </div>
                  <div className="space-y-1.5 text-[#A5AA96]">
                    <div>
                      Crop Recommendation Model:{" "}
                      <strong className="text-[#A4D5A4]">
                        {healthData.mlService?.models?.cropRecommendation?.available ? "Loaded (Active)" : "Missing"}
                      </strong>
                    </div>
                    <div>
                      Crop Model Benchmark Accuracy:{" "}
                      <strong className="text-[#D4BE8D] font-mono">
                        {healthData.mlService?.models?.cropRecommendation?.accuracy ? `${(healthData.mlService.models.cropRecommendation.accuracy * 100).toFixed(1)}%` : "N/A"}
                      </strong>
                    </div>
                    <div>
                      Disease Detection Model:{" "}
                      <strong className="text-[#A4D5A4]">
                        {healthData.mlService?.models?.diseaseDetection?.available ? "Loaded (Active)" : "Missing"}
                      </strong>
                    </div>
                    <div>
                      Disease Pathology Classes:{" "}
                      <strong className="text-[#F0EBDD] font-mono">
                        {healthData.mlService?.models?.diseaseDetection?.classesCount ?? 15}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </Card>
        </div>
      )}

      {/* Tab: Audit Logs */}
      {activeTab === "audit" && (
        <Card>
          <h3 className="text-xs font-serif font-bold text-[#D4BE8D] uppercase tracking-wider mb-4">
            Security &amp; Administrative Audit Trail
          </h3>

          {isLoadingAudit ? (
            <LoadingSkeleton count={5} className="h-10" />
          ) : auditData?.data?.length === 0 ? (
            <div className="text-center py-10 text-xs text-[#A5AA96]">
              No administrative audit logs recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#2D3B30] text-[#A5AA96] font-serif font-semibold uppercase text-[10px]">
                    <th className="pb-3">Action</th>
                    <th className="pb-3">Admin</th>
                    <th className="pb-3">Target</th>
                    <th className="pb-3">IP Address</th>
                    <th className="pb-3 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2D3B30]">
                  {auditData?.data?.map((log) => (
                    <tr key={log.id} className="hover:bg-[#18251D]">
                      <td className="py-2.5 font-bold text-[#F0EBDD]">{log.action}</td>
                      <td className="py-2.5 text-[#D9CEB5]">{log.adminEmail}</td>
                      <td className="py-2.5 text-[#A5AA96]">{log.targetType} ({log.targetId})</td>
                      <td className="py-2.5 text-[#A5AA96] font-mono text-[11px]">{log.ipAddress || "127.0.0.1"}</td>
                      <td className="py-2.5 text-right text-[#A5AA96] font-mono">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};
