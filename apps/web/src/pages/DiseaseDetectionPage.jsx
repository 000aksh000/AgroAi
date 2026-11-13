import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  ScanLine,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Info,
  RefreshCw
} from "lucide-react";
import { apiClient } from "../api/client";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
export const DiseaseDetectionPage = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [cropName, setCropName] = useState("Tomato");
  const [userNotes, setUserNotes] = useState("");
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const handleFileChange = (selectedFile) => {
    setError(null);
    if (!selectedFile.type.startsWith("image/")) {
      setError("Please upload a valid image file (JPEG, PNG, or WEBP).");
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size exceeds the 10MB limit. Please upload a compressed image.");
      return;
    }
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setDiagnosisResult(null);
  };
  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error("No file selected");
      const formData = new FormData();
      formData.append("image", file);
      formData.append("cropName", cropName);
      formData.append("userNotes", userNotes);
      const res = await apiClient.post("/diseases/detect", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return res.data.data.result;
    },
    onSuccess: (data) => {
      setDiagnosisResult(data);
      setError(null);
    },
    onError: (err) => {
      setError(
        err.response?.data?.error?.message || "Failed to classify leaf image. Ensure ML service is running and image is clear."
      );
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
              Plant Disease Diagnostic Scanner
            </h1>
            <Badge variant="warning" size="sm">Computer Vision</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Upload leaf photos to detect fungal, bacterial, and pest blights with integrated IPM treatment advice.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {
    /* Upload Column (5 cols on lg) */
  }
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
              Upload Foliage Photo
            </h3>

            {error && <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>}

            {
    /* Drag & Drop Area */
  }
            <div
    onClick={() => fileInputRef.current?.click()}
    onDragOver={(e) => e.preventDefault()}
    onDrop={(e) => {
      e.preventDefault();
      if (e.dataTransfer.files?.[0]) {
        handleFileChange(e.dataTransfer.files[0]);
      }
    }}
    className="border-2 border-dashed border-slate-300 hover:border-agri-500 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-earth-50/60 hover:bg-earth-100/60"
  >
              <input
    ref={fileInputRef}
    type="file"
    accept="image/jpeg,image/png,image/webp"
    className="hidden"
    onChange={(e) => {
      if (e.target.files?.[0]) {
        handleFileChange(e.target.files[0]);
      }
    }}
  />

              {previewUrl ? <div className="space-y-3">
                  <img
    src={previewUrl}
    alt="Leaf upload preview"
    className="max-h-56 mx-auto rounded-xl object-contain shadow-sm border border-slate-200"
  />
                  <p className="text-xs text-agri-700 font-semibold flex items-center justify-center gap-1">
                    <RefreshCw className="w-3.5 h-3.5" /> Click or drag to change image
                  </p>
                </div> : <div className="py-6">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mx-auto text-slate-400 mb-3 shadow-sm">
                    <UploadCloud className="w-7 h-7 text-agri-600" />
                  </div>
                  <p className="text-sm font-semibold text-slate-800">
                    Click to browse or drag & drop leaf image
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Supports JPEG, PNG, WEBP (Max 10MB)
                  </p>
                </div>}
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Crop Type (Optional Hint)
                </label>
                <select
    value={cropName}
    onChange={(e) => setCropName(e.target.value)}
    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-500 bg-white"
  >
                  <option value="Tomato">Tomato (Tamatar)</option>
                  <option value="Potato">Potato (Aloo)</option>
                  <option value="Rice">Rice / Paddy (Dhan)</option>
                  <option value="Cotton">Cotton (Kapas)</option>
                  <option value="Corn">Corn / Maize (Makka)</option>
                  <option value="Other">Other / Unknown</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Field Observations / Notes
                </label>
                <textarea
    rows={2}
    placeholder="e.g. Spotted yellowing after 3 days of rain..."
    value={userNotes}
    onChange={(e) => setUserNotes(e.target.value)}
    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-500"
  />
              </div>

              {
    /* Sample Leaf Selector for quick testing */
  }
              <div className="pt-1">
                <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                  Or Test with Sample Leaf:
                </span>
                <div className="flex gap-2">
                  <button
    type="button"
    onClick={() => {
      const canvas = document.createElement("canvas");
      canvas.width = 224;
      canvas.height = 224;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#4a7c2a";
        ctx.fillRect(0, 0, 224, 224);
        ctx.fillStyle = "#8b4513";
        ctx.beginPath();
        ctx.arc(100, 100, 35, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#ffd700";
        ctx.beginPath();
        ctx.arc(140, 130, 25, 0, Math.PI * 2);
        ctx.fill();
      }
      canvas.toBlob((blob) => {
        if (blob) {
          const sampleFile = new File([blob], "tomato_early_blight_sample.png", {
            type: "image/png"
          });
          handleFileChange(sampleFile);
          setCropName("Tomato");
          setUserNotes("Concentric brown target-like rings observed on lower tomato leaves.");
        }
      });
    }}
    className="flex-1 py-1.5 px-2 rounded-lg bg-earth-100 hover:bg-earth-200 text-slate-700 text-[11px] font-medium transition-colors border border-slate-200"
  >
                    🍂 Tomato Blight Sample
                  </button>
                  <button
    type="button"
    onClick={() => {
      const canvas = document.createElement("canvas");
      canvas.width = 224;
      canvas.height = 224;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#2d6a4f";
        ctx.fillRect(0, 0, 224, 224);
        ctx.strokeStyle = "#52b788";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(112, 20);
        ctx.lineTo(112, 200);
        ctx.stroke();
      }
      canvas.toBlob((blob) => {
        if (blob) {
          const sampleFile = new File([blob], "healthy_leaf_sample.png", {
            type: "image/png"
          });
          handleFileChange(sampleFile);
          setCropName("Tomato");
          setUserNotes("Lush green foliage with no visible spotting.");
        }
      });
    }}
    className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-medium transition-colors border border-emerald-200"
  >
                    🌱 Healthy Leaf Sample
                  </button>
                </div>
              </div>

              <Button
    onClick={() => uploadMutation.mutate()}
    disabled={!file}
    isLoading={uploadMutation.isPending}
    className="w-full mt-2 shadow-sm"
    icon={<ScanLine className="w-4 h-4" />}
  >
                Scan & Diagnose Leaf
              </Button>
            </div>
          </Card>
        </div>

        {
    /* Diagnostic Results (7 cols on lg) */
  }
        <div className="lg:col-span-7">
          {diagnosisResult ? <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              {
    /* Primary Diagnosis Card */
  }
              <Card
    className={`border-t-4 ${diagnosisResult.prediction.isHealthy ? "border-t-emerald-500 bg-emerald-50/20" : "border-t-rose-500 bg-rose-50/20"}`}
  >
                <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Pathology Diagnosis
                      </span>
                      <Badge
    variant={diagnosisResult.prediction.severity === "None" ? "success" : diagnosisResult.prediction.severity === "Severe" ? "danger" : "warning"}
    size="sm"
  >
                        {diagnosisResult.prediction.severity} Severity
                      </Badge>
                    </div>

                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                      {diagnosisResult.prediction.diseaseName}
                    </h2>
                    {diagnosisResult.prediction.scientificName && <span className="text-xs text-slate-500 italic block mt-0.5">
                        Pathogen: {diagnosisResult.prediction.scientificName}
                      </span>}
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block font-medium">Confidence</span>
                    <span className="text-2xl font-black text-slate-900">
                      {Math.round(diagnosisResult.prediction.confidence * 100)}%
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/80 border border-slate-200/80 text-xs text-slate-700 leading-relaxed my-3">
                  <strong>Pathological Cause:</strong> {diagnosisResult.prediction.cause}
                </div>

                {
    /* Symptoms List */
  }
                {diagnosisResult.prediction.symptoms.length > 0 && <div className="my-4">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
                      Observed Foliage Symptoms
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {diagnosisResult.prediction.symptoms.map((s, idx) => <li key={idx} className="flex items-start gap-2">
                          <span className="text-agri-600 font-bold">•</span>
                          <span>{s}</span>
                        </li>)}
                    </ul>
                  </div>}
              </Card>

              {
    /* Treatment Protocols */
  }
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-l-4 border-l-emerald-600">
                  <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Organic & Bio-Control Remedies
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-600">
                    {diagnosisResult.prediction.organicTreatment.map((org, i) => <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{org}</span>
                      </li>)}
                  </ul>
                </Card>

                <Card className="border-l-4 border-l-amber-600">
                  <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    Chemical Fungicide / Bactericide
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-600">
                    {diagnosisResult.prediction.chemicalTreatment.map((chem, i) => <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">⚠️</span>
                        <span>{chem}</span>
                      </li>)}
                  </ul>
                </Card>
              </div>

              {
    /* Preventative Field Advice */
  }
              <Card>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Preventative Field Hygiene & Cultural Practices
                </h4>
                <div className="space-y-1.5 text-xs text-slate-600">
                  {diagnosisResult.prediction.preventionTips.map((tip, i) => <div key={i} className="flex items-start gap-2">
                      <span className="text-agri-600 font-bold">→</span>
                      <span>{tip}</span>
                    </div>)}
                </div>
              </Card>

              {
    /* Safety Advisory Disclaimer */
  }
              <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Important Agronomic Notice:</strong> Computer vision image predictions provide diagnostic guidance based on visible leaf patterns. Before applying restricted agrochemicals, verify symptoms with your nearest local Krishi Vigyan Kendra (KVK) or government agricultural officer. Always observe safety withholding periods before harvest.
                </p>
              </div>
            </div> : <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300 min-h-[420px]">
              <div className="w-16 h-16 rounded-2xl bg-earth-100 text-earth-700 flex items-center justify-center mb-4">
                <ScanLine className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                Awaiting Leaf Photograph
              </h3>
              <p className="mt-1.5 text-xs text-slate-500 max-w-sm leading-relaxed">
                Take or upload a close-up picture of the affected plant leaf showing discoloration, spots, or wilt. The machine learning model will classify the pathogen and recommend organic and chemical treatments.
              </p>
            </div>}
        </div>
      </div>
    </div>;
};
