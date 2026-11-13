import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Tractor,
  Plus,
  MapPin,
  Edit2,
  Trash2,
  Wheat,
  AlertCircle
} from "lucide-react";
import { useFarm } from "../context/FarmContext";
import { apiClient } from "../api/client";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Modal } from "../components/ui/Modal";
import { EmptyState } from "../components/ui/EmptyState";
import { Link } from "react-router-dom";
const INDIAN_STATES = [
  "Maharashtra",
  "Punjab",
  "Gujarat",
  "Madhya Pradesh",
  "Uttar Pradesh",
  "Karnataka",
  "Haryana",
  "Rajasthan",
  "Andhra Pradesh",
  "Tamil Nadu",
  "West Bengal",
  "Bihar"
];
const SOIL_TYPES = [
  "Black",
  "Alluvial",
  "Red",
  "Clay",
  "Loamy",
  "Sandy Loam",
  "Laterite",
  "Arid/Desert",
  "Saline",
  "Peaty/Marshy"
];
const IRRIGATION_METHODS = [
  "Drip",
  "Sprinkler",
  "Flood/Surface",
  "Canal",
  "Rainfed",
  "Tube Well"
];
const WATER_AVAILABILITIES = [
  "Abundant",
  "Moderate",
  "Scarce",
  "Seasonal Rainfed"
];
export const FarmsPage = () => {
  const { farms, selectedFarm, setSelectedFarm, refetchFarms } = useFarm();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    state: "Maharashtra",
    district: "",
    village: "",
    area: 2.5,
    areaUnit: "Acres",
    soilType: "Black",
    soilPh: 6.8,
    nitrogen: 80,
    phosphorus: 45,
    potassium: 40,
    irrigationMethod: "Drip",
    waterAvailability: "Moderate",
    currentCrops: "Onion, Tomato",
    currentSeason: "Kharif",
    notes: ""
  });
  const openCreateModal = () => {
    setEditingFarm(null);
    setFormData({
      name: "",
      state: "Maharashtra",
      district: "",
      village: "",
      area: 2.5,
      areaUnit: "Acres",
      soilType: "Black",
      soilPh: 6.8,
      nitrogen: 80,
      phosphorus: 45,
      potassium: 40,
      irrigationMethod: "Drip",
      waterAvailability: "Moderate",
      currentCrops: "Onion, Tomato",
      currentSeason: "Kharif",
      notes: ""
    });
    setError(null);
    setIsModalOpen(true);
  };
  const openEditModal = (farm) => {
    setEditingFarm(farm);
    setFormData({
      name: farm.name,
      state: farm.state,
      district: farm.district,
      village: farm.village || "",
      area: farm.area,
      areaUnit: farm.areaUnit,
      soilType: farm.soilType,
      soilPh: farm.soilPh || 7,
      nitrogen: farm.nitrogen || 80,
      phosphorus: farm.phosphorus || 40,
      potassium: farm.potassium || 40,
      irrigationMethod: farm.irrigationMethod,
      waterAvailability: farm.waterAvailability,
      currentCrops: farm.currentCrops.join(", "),
      currentSeason: farm.currentSeason || "Kharif",
      notes: farm.notes || ""
    });
    setError(null);
    setIsModalOpen(true);
  };
  const saveFarmMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        ...formData,
        area: Number(formData.area),
        soilPh: formData.soilPh ? Number(formData.soilPh) : void 0,
        nitrogen: formData.nitrogen ? Number(formData.nitrogen) : void 0,
        phosphorus: formData.phosphorus ? Number(formData.phosphorus) : void 0,
        potassium: formData.potassium ? Number(formData.potassium) : void 0,
        currentCrops: formData.currentCrops.split(",").map((c) => c.trim()).filter(Boolean)
      };
      if (editingFarm) {
        return await apiClient.put(`/farms/${editingFarm.id}`, payload);
      } else {
        return await apiClient.post("/farms", payload);
      }
    },
    onSuccess: () => {
      refetchFarms();
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      setIsModalOpen(false);
    },
    onError: (err) => {
      setError(err.response?.data?.error?.message || "Failed to save farm details.");
    }
  });
  const deleteFarmMutation = useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(`/farms/${id}`);
    },
    onSuccess: () => {
      refetchFarms();
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    }
  });
  return <div className="space-y-6">
      {
    /* Page Header */
  }
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-sand-200/80">
        <div>
          <h1 className="text-2xl font-black text-soil-900 tracking-tight">Farm Plot Management</h1>
          <p className="text-xs text-soil-500 mt-1 font-medium">
            Create, view, and organize your agricultural plots, soil measurements, and irrigation sources.
          </p>
        </div>
        <Button onClick={openCreateModal} icon={<Plus className="w-4 h-4" />}>
          Add New Farm Plot
        </Button>
      </div>

      {
    /* Farms List */
  }
      {farms.length === 0 ? <EmptyState
    icon={<Tractor className="w-8 h-8" />}
    title="No farm profiles yet"
    description="Create your first farm profile with your land area, soil type, and location to unlock custom AI crop advisories."
    actionText="Create Farm Profile"
    onAction={openCreateModal}
  /> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farms.map((farm) => {
    const isSelected = selectedFarm?.id === farm.id;
    return <Card
      key={farm.id}
      hoverable
      className={`flex flex-col justify-between transition-all ${isSelected ? "ring-2 ring-agri-600 border-agri-300" : ""}`}
    >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-base">{farm.name}</h3>
                        {isSelected && <Badge variant="success" size="sm">Active Farm</Badge>}
                      </div>
                      <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {farm.village ? `${farm.village}, ` : ""}{farm.district}, {farm.state}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
      onClick={() => openEditModal(farm)}
      className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
      title="Edit farm"
    >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
      onClick={() => {
        if (confirm(`Are you sure you want to delete farm "${farm.name}"?`)) {
          deleteFarmMutation.mutate(farm.id);
        }
      }}
      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
      title="Delete farm"
    >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs py-3 border-y border-slate-100 my-3">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Total Area</span>
                      <span className="font-bold text-slate-800">{farm.area} {farm.areaUnit}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Soil Type</span>
                      <span className="font-bold text-slate-800">{farm.soilType}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Soil pH</span>
                      <span className="font-bold text-slate-800">{farm.soilPh || "Not set"}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Irrigation</span>
                      <span className="font-bold text-slate-800">{farm.irrigationMethod}</span>
                    </div>
                  </div>

                  {farm.currentCrops.length > 0 && <div className="mb-4">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">
                        Cultivated Crops
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {farm.currentCrops.map((c) => <span
      key={c}
      className="text-xs px-2 py-0.5 rounded-md bg-earth-100 text-earth-800 font-medium"
    >
                            {c}
                          </span>)}
                      </div>
                    </div>}
                </div>

                <div className="pt-2 flex items-center justify-between gap-2">
                  {!isSelected ? <Button
      variant="outline"
      size="sm"
      onClick={() => setSelectedFarm(farm)}
      className="w-full"
    >
                      Set as Active Farm
                    </Button> : <Link to="/crop-recommendation" className="w-full">
                      <Button size="sm" className="w-full" icon={<Wheat className="w-4 h-4" />}>
                        Recommend Crops
                      </Button>
                    </Link>}
                </div>
              </Card>;
  })}
        </div>}

      {
    /* Farm Create/Edit Modal */
  }
      <Modal
    isOpen={isModalOpen}
    onClose={() => setIsModalOpen(false)}
    title={editingFarm ? "Edit Farm Profile" : "Add New Farm Plot"}
    maxWidth="lg"
  >
        {error && <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>}

        <form
    onSubmit={(e) => {
      e.preventDefault();
      saveFarmMutation.mutate();
    }}
    className="space-y-4"
  >
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Farm Name
            </label>
            <input
    type="text"
    required
    placeholder="e.g. Nashik South Orchard"
    value={formData.name}
    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-500"
  />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
              <select
    value={formData.state}
    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-500 bg-white"
  >
                {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">District</label>
              <input
    type="text"
    required
    placeholder="e.g. Nashik"
    value={formData.district}
    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-500"
  />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Village (Optional)</label>
              <input
    type="text"
    placeholder="e.g. Lasalgaon"
    value={formData.village}
    onChange={(e) => setFormData({ ...formData, village: e.target.value })}
    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-500"
  />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Area</label>
                <input
    type="number"
    step="0.1"
    required
    min="0.1"
    value={formData.area}
    onChange={(e) => setFormData({ ...formData, area: parseFloat(e.target.value) || 0 })}
    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-500"
  />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Unit</label>
                <select
    value={formData.areaUnit}
    onChange={(e) => setFormData({ ...formData, areaUnit: e.target.value })}
    className="w-full px-2 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-500 bg-white"
  >
                  <option value="Acres">Acres</option>
                  <option value="Hectares">Hectares</option>
                  <option value="Bigha">Bigha</option>
                  <option value="Guntha">Guntha</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Soil Type</label>
              <select
    value={formData.soilType}
    onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-500 bg-white"
  >
                {SOIL_TYPES.map((st) => <option key={st} value={st}>{st}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Soil pH (3.5 - 9.5)</label>
              <input
    type="number"
    step="0.1"
    min="3.5"
    max="9.5"
    value={formData.soilPh}
    onChange={(e) => setFormData({ ...formData, soilPh: parseFloat(e.target.value) || 7 })}
    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-500"
  />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">N (kg/ha)</label>
              <input
    type="number"
    min="0"
    max="300"
    value={formData.nitrogen}
    onChange={(e) => setFormData({ ...formData, nitrogen: parseInt(e.target.value, 10) || 0 })}
    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-500"
  />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">P (kg/ha)</label>
              <input
    type="number"
    min="0"
    max="200"
    value={formData.phosphorus}
    onChange={(e) => setFormData({ ...formData, phosphorus: parseInt(e.target.value, 10) || 0 })}
    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-500"
  />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">K (kg/ha)</label>
              <input
    type="number"
    min="0"
    max="300"
    value={formData.potassium}
    onChange={(e) => setFormData({ ...formData, potassium: parseInt(e.target.value, 10) || 0 })}
    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-500"
  />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Irrigation Method</label>
              <select
    value={formData.irrigationMethod}
    onChange={(e) => setFormData({ ...formData, irrigationMethod: e.target.value })}
    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-500 bg-white"
  >
                {IRRIGATION_METHODS.map((im) => <option key={im} value={im}>{im}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Water Availability</label>
              <select
    value={formData.waterAvailability}
    onChange={(e) => setFormData({ ...formData, waterAvailability: e.target.value })}
    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-500 bg-white"
  >
                {WATER_AVAILABILITIES.map((wa) => <option key={wa} value={wa}>{wa}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Current Cultivated Crops (Comma separated)
            </label>
            <input
    type="text"
    placeholder="e.g. Onion, Tomato, Maize"
    value={formData.currentCrops}
    onChange={(e) => setFormData({ ...formData, currentCrops: e.target.value })}
    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-500"
  />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={saveFarmMutation.isPending}>
              {editingFarm ? "Save Changes" : "Create Farm Profile"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>;
};
