import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Store,
  Search,
  Star,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
import { apiClient } from "../api/client";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";

const INDIAN_STATES = [
  "All States",
  "Maharashtra",
  "Punjab",
  "Gujarat",
  "Madhya Pradesh",
  "Uttar Pradesh",
  "Karnataka",
  "Haryana",
  "Rajasthan",
  "Andhra Pradesh"
];

export const MandiPricesPage = () => {
  const queryClient = useQueryClient();
  const [selectedState, setSelectedState] = useState("All States");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedCommodityForTrend, setSelectedCommodityForTrend] = useState("Wheat");
  const [basePriceForTrend, setBasePriceForTrend] = useState(2420);

  const { data: mandiResponse, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["mandi-prices", selectedState, searchTerm, page],
    queryFn: async () => {
      const params = { page, limit: 12 };
      if (selectedState !== "All States") params.state = selectedState;
      if (searchTerm) params.search = searchTerm;
      const res = await apiClient.get("/mandi/prices", { params });
      return res.data;
    }
  });

  const records = mandiResponse?.data || [];
  const meta = mandiResponse?.meta;

  const { data: trendData } = useQuery({
    queryKey: ["mandi-trend", selectedCommodityForTrend, basePriceForTrend],
    queryFn: async () => {
      const res = await apiClient.get("/mandi/trend", {
        params: { commodity: selectedCommodityForTrend, basePrice: basePriceForTrend }
      });
      return res.data.data;
    }
  });

  const { data: favorites = [] } = useQuery({
    queryKey: ["mandi-favorites"],
    queryFn: async () => {
      const res = await apiClient.get("/mandi/favorites");
      return res.data.data;
    }
  });

  const addFavoriteMutation = useMutation({
    mutationFn: async (record) => {
      await apiClient.post("/mandi/favorites", {
        state: record.state,
        market: record.market,
        commodity: record.commodity
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mandi-favorites"] });
    }
  });

  const isFavorite = (record) => {
    return favorites.some(
      (f) =>
        f.market.toLowerCase() === record.market.toLowerCase() &&
        f.commodity.toLowerCase() === record.commodity.toLowerCase()
    );
  };

  const getTrendIcon = (trend) => {
    if (trend === "up") return <ArrowUpRight className="w-4 h-4 text-emerald-400 inline" />;
    if (trend === "down") return <ArrowDownRight className="w-4 h-4 text-rose-400 inline" />;
    return <Minus className="w-4 h-4 text-[#A5AA96] inline" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#2D3B30]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-[#F0EBDD] tracking-tight">
              Agricultural Mandi & Market Quotations
            </h1>
            <Badge variant="gold" size="sm">APMC & Agmarknet</Badge>
          </div>
          <p className="text-xs text-[#A5AA96] mt-1 font-medium">
            Daily arrival prices, modal trading rates, and price movement analytics in INR (₹) per Quintal.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          className={`px-3.5 py-2 rounded-xl border border-[#2D3B30] bg-[#18251D] hover:bg-[#202B22] text-xs font-semibold text-[#D9CEB5] flex items-center gap-1.5 shadow-subtle transition-colors cursor-pointer ${
            isFetching ? "opacity-70" : ""
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#B69A62] ${isFetching ? "animate-spin" : ""}`} />
          Refresh Prices
        </button>
      </div>

      {/* Filters & Search Bar */}
      <Card className="p-4 bg-[#18251D] border border-[#2D3B30]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-[#A5AA96] absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by crop, mandi market, or district (e.g. Onion, Khanna, Nashik)..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#2D3B30] focus:outline-none focus:ring-2 focus:ring-[#B69A62] bg-[#101B16] text-[#F0EBDD] placeholder:text-[#A5AA96]/50"
            />
          </div>

          <div className="md:col-span-4">
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#2D3B30] focus:outline-none focus:ring-2 focus:ring-[#B69A62] bg-[#101B16] text-[#F0EBDD] font-medium cursor-pointer"
            >
              {INDIAN_STATES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 text-right flex items-center justify-end text-xs text-[#A5AA96] font-medium font-mono">
            <span>{meta?.total ?? records.length} Mandis Found</span>
          </div>
        </div>
      </Card>

      {/* 7-Day Price Trend Chart */}
      {trendData && (
        <Card className="p-5 bg-gradient-to-br from-[#202B22] to-[#18251D] border border-[#2D3B30]">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <span className="text-[11px] font-serif font-bold text-[#D4BE8D] uppercase tracking-wider block">
                Historical Price Analytics
              </span>
              <h3 className="text-base font-serif font-bold text-[#F0EBDD]">
                7-Day Price Trend: {selectedCommodityForTrend} (₹ / Quintal)
              </h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#A5AA96] block font-mono">Current Modal Rate</span>
              <span className="text-lg font-mono font-bold text-[#D4BE8D]">₹{basePriceForTrend}</span>
            </div>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData.trend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2D3B30" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#A5AA96" }} stroke="#2D3B30" />
                <YAxis unit="₹" tick={{ fontSize: 11, fill: "#A5AA96" }} stroke="#2D3B30" domain={["dataMin - 100", "dataMax + 100"]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18251D",
                    borderColor: "#2D3B30",
                    borderRadius: "0.75rem",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
                    fontSize: "12px",
                    color: "#F0EBDD"
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="modalPrice"
                  stroke="#B69A62"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#71805A", stroke: "#101B16", strokeWidth: 2 }}
                  name="Modal Price (₹)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Mandi Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <LoadingSkeleton count={6} className="h-44" />
        </div>
      ) : records.length === 0 ? (
        <div className="text-center py-16 bg-[#18251D] rounded-2xl border border-dashed border-[#2D3B30]">
          <Store className="w-12 h-12 text-[#A5AA96]/50 mx-auto mb-3" />
          <h3 className="text-sm font-serif font-bold text-[#F0EBDD]">No Mandis Matching Search Criteria</h3>
          <p className="text-xs text-[#A5AA96] mt-1">Try selecting "All States" or clearing the search keyword.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {records.map((r) => {
            const isFav = isFavorite(r);
            const isSelected = selectedCommodityForTrend === r.commodity;
            return (
              <Card
                key={r.id}
                hoverable
                onClick={() => {
                  setSelectedCommodityForTrend(r.commodity);
                  setBasePriceForTrend(r.modalPrice);
                }}
                className={`cursor-pointer transition-all ${
                  isSelected ? "ring-2 ring-[#B69A62] border-[#B69A62] shadow-gold-glow" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-serif font-bold text-[#F0EBDD] text-base">{r.commodity}</h4>
                      {getTrendIcon(r.priceTrend)}
                    </div>
                    <span className="text-xs text-[#A5AA96] block mt-0.5">
                      {r.market}, {r.district} ({r.state})
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addFavoriteMutation.mutate(r);
                    }}
                    title={isFav ? "Saved as favorite" : "Add to favorite markets"}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      isFav ? "text-[#D4BE8D] bg-[#B69A62]/20" : "text-[#A5AA96]/50 hover:text-[#F0EBDD]"
                    }`}
                  >
                    <Star className={`w-4 h-4 ${isFav ? "fill-[#B69A62]" : ""}`} />
                  </button>
                </div>

                <div className="py-2.5 px-3 rounded-xl bg-[#18251D] border border-[#2D3B30] flex items-baseline justify-between mb-3">
                  <div>
                    <span className="text-[10px] text-[#A5AA96] block uppercase font-mono font-semibold">
                      Modal Rate
                    </span>
                    <span className="text-xl font-mono font-bold text-[#D4BE8D]">
                      ₹{r.modalPrice.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#A5AA96] font-mono">{r.unit}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-[#F0EBDD] pt-2 border-t border-[#2D3B30]">
                  <div>
                    <span className="text-[#A5AA96] block text-[10px]">Min / Max Price</span>
                    <span className="font-mono text-[#D9CEB5]">
                      ₹{r.minPrice} - ₹{r.maxPrice}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#A5AA96] block text-[10px]">Variety / Grade</span>
                    <span className="font-medium text-[#D9CEB5] truncate block">
                      {r.variety} ({r.grade})
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-[#2D3B30] text-xs">
          <span className="text-[#A5AA96] font-mono">
            Page {meta.page} of {meta.totalPages} ({meta.total} total mandis)
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= meta.totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Source & Transparency Footnote */}
      <div className="p-3.5 rounded-xl bg-[#18251D] text-[11px] text-[#A5AA96] flex flex-wrap items-center justify-between gap-2 border border-[#2D3B30]">
        <span>Registry: {meta?.source || "Agricultural Produce Market Committee (APMC)"}</span>
        <span className="font-mono">Arrival Date: {new Date().toISOString().split("T")[0]}</span>
      </div>
    </div>
  );
};
