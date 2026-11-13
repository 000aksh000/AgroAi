import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  History as HistoryIcon,
  Wheat,
  ScanLine,
  Trash2,
  Calendar,
  Eye,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { apiClient } from "../api/client";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";

export const HistoryPage = () => {
  const queryClient = useQueryClient();
  const [filterType, setFilterType] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const { data: historyResponse, isLoading, refetch } = useQuery({
    queryKey: ["prediction-history", filterType, page],
    queryFn: async () => {
      const res = await apiClient.get("/history/all", {
        params: { type: filterType, page, limit: 15 }
      });
      return res.data;
    }
  });

  const records = historyResponse?.data || [];
  const meta = historyResponse?.meta;

  const deleteRecordMutation = useMutation({
    mutationFn: async ({ id, type }) => {
      if (type === "crop_recommendation") {
        await apiClient.delete(`/crops/${id}`);
      } else {
        await apiClient.delete(`/diseases/${id}`);
      }
    },
    onSuccess: () => {
      setSelectedRecord(null);
      refetch();
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-activity"] });
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#2D3B30]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-[#F0EBDD] tracking-tight">
              Field Intelligence & Diagnostic Log
            </h1>
            <Badge variant="gold" size="sm">Historical Registry</Badge>
          </div>
          <p className="text-xs text-[#A5AA96] mt-1 font-medium">
            Review past soil crop recommendations and computer vision leaf scans with time-stamped parameters.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#18251D] rounded-xl border border-[#2D3B30] text-xs">
          <button
            onClick={() => {
              setFilterType("all");
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              filterType === "all"
                ? "bg-[#294C36] text-[#F0EBDD] border border-[#B69A62]/40 shadow-subtle font-semibold"
                : "text-[#A5AA96] hover:text-[#F0EBDD]"
            }`}
          >
            All Activity
          </button>
          <button
            onClick={() => {
              setFilterType("crop");
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              filterType === "crop"
                ? "bg-[#294C36] text-[#F0EBDD] border border-[#B69A62]/40 shadow-subtle font-semibold"
                : "text-[#A5AA96] hover:text-[#F0EBDD]"
            }`}
          >
            Crop AI
          </button>
          <button
            onClick={() => {
              setFilterType("disease");
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              filterType === "disease"
                ? "bg-[#294C36] text-[#F0EBDD] border border-[#B69A62]/40 shadow-subtle font-semibold"
                : "text-[#A5AA96] hover:text-[#F0EBDD]"
            }`}
          >
            Disease Scans
          </button>
        </div>
      </div>

      {/* History Table / Cards */}
      {isLoading ? (
        <LoadingSkeleton count={5} className="h-20 mb-3" />
      ) : records.length === 0 ? (
        <div className="text-center py-16 bg-[#18251D] rounded-2xl border border-dashed border-[#2D3B30]">
          <HistoryIcon className="w-12 h-12 text-[#A5AA96]/50 mx-auto mb-3" />
          <h3 className="text-sm font-serif font-bold text-[#F0EBDD]">No Historical Records Found</h3>
          <p className="text-xs text-[#A5AA96] mt-1 font-medium">
            Execute a crop recommendation or leaf diagnosis to catalog an entry here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((rec) => {
            const isCrop = rec.type === "crop_recommendation";
            return (
              <Card
                key={rec.id}
                hoverable
                onClick={() => setSelectedRecord(rec)}
                className="p-4 cursor-pointer flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`p-2.5 rounded-xl flex-shrink-0 border ${
                      isCrop
                        ? "bg-[#294C36]/40 text-[#A4D5A4] border-[#294C36]"
                        : "bg-[#79563C]/35 text-[#D5BEA8] border-[#79563C]/60"
                    }`}
                  >
                    {isCrop ? <Wheat className="w-5 h-5" /> : <ScanLine className="w-5 h-5" />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif font-bold text-[#F0EBDD] text-sm truncate">{rec.title}</h4>
                      <Badge variant={isCrop ? "leaf" : rec.isHealthy ? "leaf" : "warning"} size="sm">
                        {Math.round(rec.confidence * 100)}% Match
                      </Badge>
                    </div>
                    <p className="text-xs text-[#A5AA96] truncate max-w-xl mt-0.5">{rec.summary}</p>
                    <span className="text-[10px] text-[#A5AA96] flex items-center gap-1 mt-1 font-mono">
                      <Calendar className="w-3 h-3 text-[#B69A62]" />
                      {new Date(rec.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                      {rec.farmName && ` • Parcel: ${rec.farmName}`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4 text-[#D4BE8D]" />}>
                    Details
                  </Button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm("Permanently delete this entry?")) {
                        deleteRecordMutation.mutate({ id: rec.id, type: rec.type });
                      }
                    }}
                    className="p-1.5 text-[#A5AA96] hover:text-rose-400 hover:bg-[#18251D] rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Record Detail Modal */}
      <Modal
        isOpen={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
        title={selectedRecord?.title || "Record Detail"}
        maxWidth="lg"
      >
        {selectedRecord && (
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-[#101B16] border border-[#2D3B30] flex items-center justify-between">
              <div>
                <span className="text-[#A5AA96] block text-[10px] uppercase font-semibold">Logged On</span>
                <span className="font-mono text-[#F0EBDD]">
                  {new Date(selectedRecord.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[#A5AA96] block text-[10px] uppercase font-semibold">Model Certainty</span>
                <span className="font-serif font-bold text-[#D4BE8D] text-base">
                  {Math.round(selectedRecord.confidence * 100)}%
                </span>
              </div>
            </div>

            {selectedRecord.type === "crop_recommendation" ? (
              <div className="space-y-3">
                <div className="p-3.5 bg-[#18251D] border border-[#294C36] rounded-xl text-[#D9CEB5] leading-relaxed">
                  <strong className="text-[#A4D5A4]">Agronomic Rationale:</strong> {selectedRecord.details?.result?.rationale}
                </div>

                <h4 className="font-serif font-bold text-[#D4BE8D] uppercase tracking-wider text-[11px]">
                  Submitted Soil & Climate Parameters
                </h4>
                <div className="grid grid-cols-3 gap-2.5 p-3.5 bg-[#101B16] border border-[#2D3B30] rounded-xl text-[#F0EBDD] font-mono">
                  <div>N: <strong className="text-[#A4D5A4]">{selectedRecord.details?.input?.nitrogen} kg/ha</strong></div>
                  <div>P: <strong className="text-[#A4D5A4]">{selectedRecord.details?.input?.phosphorus} kg/ha</strong></div>
                  <div>K: <strong className="text-[#A4D5A4]">{selectedRecord.details?.input?.potassium} kg/ha</strong></div>
                  <div>pH: <strong className="text-[#D4BE8D]">{selectedRecord.details?.input?.soilPh}</strong></div>
                  <div>Temp: <strong className="text-[#D4BE8D]">{selectedRecord.details?.input?.temperature}°C</strong></div>
                  <div>Rain: <strong className="text-[#D4BE8D]">{selectedRecord.details?.input?.rainfall} mm</strong></div>
                </div>

                <div>
                  <h4 className="font-serif font-bold text-[#D4BE8D] uppercase tracking-wider text-[11px] mb-1">
                    Fertilizer Regimen
                  </h4>
                  <p className="text-[#A5AA96] leading-relaxed">
                    {selectedRecord.details?.result?.agronomicAdvice?.fertilizerGuidance}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3.5 bg-[#18251D] border border-[#79563C]/60 rounded-xl text-[#D9CEB5] leading-relaxed">
                  <strong className="text-[#D4BE8D]">Pathogen Pathology:</strong> {selectedRecord.details?.result?.prediction?.cause}
                </div>

                <div>
                  <h4 className="font-serif font-bold text-[#A4D5A4] uppercase tracking-wider text-[11px] mb-1.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#A4D5A4]" />
                    Organic Treatment Protocol
                  </h4>
                  <ul className="space-y-1 text-[#D9CEB5]">
                    {selectedRecord.details?.result?.prediction?.organicTreatment?.map((t, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-[#A4D5A4] font-bold">•</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-serif font-bold text-[#D5BEA8] uppercase tracking-wider text-[11px] mb-1.5 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#B69A62]" />
                    Chemical Fungicide / Bactericide
                  </h4>
                  <ul className="space-y-1 text-[#D9CEB5]">
                    {selectedRecord.details?.result?.prediction?.chemicalTreatment?.map((t, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-[#B69A62] font-bold">•</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-[#2D3B30] flex justify-end">
              <Button size="sm" variant="outline" onClick={() => setSelectedRecord(null)}>
                Close Record
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
