import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  History as HistoryIcon,
  Wheat,
  ScanLine,
  Trash2,
  Calendar,
  Eye
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
  return <div className="space-y-6">
      {
    /* Header */
  }
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Prediction & Diagnostic History
            </h1>
            <Badge variant="neutral" size="sm">Persistent Logs</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Browse, review, and compare past AI crop recommendations and computer vision leaf scans.
          </p>
        </div>

        {
    /* Filter Tabs */
  }
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-slate-200 text-xs">
          <button
    onClick={() => {
      setFilterType("all");
      setPage(1);
    }}
    className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${filterType === "all" ? "bg-agri-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
  >
            All Activity
          </button>
          <button
    onClick={() => {
      setFilterType("crop");
      setPage(1);
    }}
    className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${filterType === "crop" ? "bg-agri-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
  >
            Crop AI
          </button>
          <button
    onClick={() => {
      setFilterType("disease");
      setPage(1);
    }}
    className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${filterType === "disease" ? "bg-agri-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
  >
            Disease Scans
          </button>
        </div>
      </div>

      {
    /* History Table / Cards */
  }
      {isLoading ? <LoadingSkeleton count={5} className="h-20 mb-3" /> : records.length === 0 ? <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
          <HistoryIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No Prediction Records Found</h3>
          <p className="text-xs text-slate-400 mt-1">
            Run a crop recommendation or leaf diagnosis to see your activity timeline here.
          </p>
        </div> : <div className="space-y-3">
          {records.map((rec) => {
    const isCrop = rec.type === "crop_recommendation";
    return <Card
      key={rec.id}
      hoverable
      onClick={() => setSelectedRecord(rec)}
      className="p-4 cursor-pointer flex items-center justify-between gap-4"
    >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
      className={`p-2.5 rounded-xl flex-shrink-0 ${isCrop ? "bg-agri-100 text-agri-700" : "bg-amber-100 text-amber-700"}`}
    >
                    {isCrop ? <Wheat className="w-5 h-5" /> : <ScanLine className="w-5 h-5" />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm truncate">{rec.title}</h4>
                      <Badge variant={isCrop ? "success" : rec.isHealthy ? "success" : "warning"} size="sm">
                        {Math.round(rec.confidence * 100)}% Match
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 truncate max-w-xl mt-0.5">{rec.summary}</p>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(rec.createdAt).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })}
                      {rec.farmName && ` \u2022 Farm: ${rec.farmName}`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4" />}>
                    Details
                  </Button>
                  <button
      onClick={(e) => {
        e.stopPropagation();
        if (confirm("Permanently delete this prediction record?")) {
          deleteRecordMutation.mutate({ id: rec.id, type: rec.type });
        }
      }}
      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
    >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>;
  })}
        </div>}

      {
    /* Record Detail Modal */
  }
      <Modal
    isOpen={!!selectedRecord}
    onClose={() => setSelectedRecord(null)}
    title={selectedRecord?.title || "Record Detail"}
    maxWidth="lg"
  >
        {selectedRecord && <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Logged On</span>
                <span className="font-bold text-slate-800">
                  {new Date(selectedRecord.createdAt).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Model Confidence</span>
                <span className="font-extrabold text-slate-900 text-sm">
                  {Math.round(selectedRecord.confidence * 100)}%
                </span>
              </div>
            </div>

            {selectedRecord.type === "crop_recommendation" ? <div className="space-y-3">
                <div className="p-3 bg-agri-50 border border-agri-200/80 rounded-xl text-agri-900">
                  <strong>Agronomic Rationale:</strong> {selectedRecord.details?.result?.rationale}
                </div>

                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  Submitted Soil & Climate Inputs
                </h4>
                <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl">
                  <div>N: <strong>{selectedRecord.details?.input?.nitrogen} kg/ha</strong></div>
                  <div>P: <strong>{selectedRecord.details?.input?.phosphorus} kg/ha</strong></div>
                  <div>K: <strong>{selectedRecord.details?.input?.potassium} kg/ha</strong></div>
                  <div>pH: <strong>{selectedRecord.details?.input?.soilPh}</strong></div>
                  <div>Temp: <strong>{selectedRecord.details?.input?.temperature}°C</strong></div>
                  <div>Rainfall: <strong>{selectedRecord.details?.input?.rainfall} mm</strong></div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1">
                    Fertilizer Advice
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    {selectedRecord.details?.result?.agronomicAdvice?.fertilizerGuidance}
                  </p>
                </div>
              </div> : <div className="space-y-3">
                <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-amber-900">
                  <strong>Pathogen & Cause:</strong> {selectedRecord.details?.result?.prediction?.cause}
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1">
                    Organic Treatment
                  </h4>
                  <ul className="space-y-1 text-slate-600">
                    {selectedRecord.details?.result?.prediction?.organicTreatment?.map((t, i) => <li key={i}>✓ {t}</li>)}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1">
                    Chemical Treatment
                  </h4>
                  <ul className="space-y-1 text-slate-600">
                    {selectedRecord.details?.result?.prediction?.chemicalTreatment?.map((t, i) => <li key={i}>⚠️ {t}</li>)}
                  </ul>
                </div>
              </div>}

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <Button size="sm" variant="outline" onClick={() => setSelectedRecord(null)}>
                Close
              </Button>
            </div>
          </div>}
      </Modal>
    </div>;
};
