import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  ScanLine,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Info,
  RefreshCw,
  Leaf,
  Sprout
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
        err.response?.data?.error?.message ||
          "Failed to classify leaf image. Ensure ML service is running and image is clear."
      );
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#2D3B30]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-[#F0EBDD] tracking-tight">
              Plant Pathology & Foliage Diagnostic Scanner
            </h1>
            <Badge variant="gold" size="sm">
              <Leaf className="w-3 h-3 text-[#D4BE8D] mr-0.5 inline" />
              Vision AI Classifier
            </Badge>
          </div>
          <p className="text-xs text-[#A5AA96] mt-1 font-medium">
            Upload botanical leaf specimens to detect fungal, bacterial, and viral blights with dual IPM treatment protocols.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Upload Column */}
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <h3 className="text-xs font-serif font-bold text-[#D4BE8D] uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Sprout className="w-3.5 h-3.5 text-[#B69A62]" />
              Foliage Specimen Upload
            </h3>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-[#8B2E2E]/25 border border-[#8B2E2E]/50 text-[#FCA5A5] text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Drag & Drop Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files?.[0]) {
                  handleFileChange(e.dataTransfer.files[0]);
                }
              }}
              className="border-2 border-dashed border-[#2D3B30] hover:border-[#B69A62] rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 bg-[#18251D] hover:bg-[#202B22]/80"
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

              {previewUrl ? (
                <div className="space-y-3">
                  <img
                    src={previewUrl}
                    alt="Leaf upload preview"
                    className="max-h-56 mx-auto rounded-xl object-contain border border-[#2D3B30] shadow-subtle"
                  />
                  <p className="text-xs text-[#D4BE8D] font-medium flex items-center justify-center gap-1">
                    <RefreshCw className="w-3.5 h-3.5" /> Click or drag to replace specimen
                  </p>
                </div>
              ) : (
                <div className="py-6">
                  <div className="w-13 h-13 rounded-2xl bg-[#202B22] border border-[#2D3B30] flex items-center justify-center mx-auto text-[#B69A62] mb-3 shadow-subtle">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-serif font-bold text-[#F0EBDD]">
                    Click to browse or drag & drop leaf specimen
                  </p>
                  <p className="text-xs text-[#A5AA96] mt-1 font-medium">
                    Supports JPEG, PNG, WEBP (Max 10MB)
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-[#D9CEB5] mb-1">
                  Crop Category
                </label>
                <select
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#2D3B30] focus:outline-none focus:ring-2 focus:ring-[#B69A62] bg-[#101B16] text-[#F0EBDD] font-medium cursor-pointer"
                >
                  <option value="Tomato">Tomato (Tamatar)</option>
                  <option value="Potato">Potato (Aloo)</option>
                  <option value="Rice">Rice / Paddy (Dhan)</option>
                  <option value="Wheat">Wheat (Gehu)</option>
                  <option value="Cotton">Cotton (Kapas)</option>
                  <option value="Corn">Corn / Maize (Makka)</option>
                  <option value="Mustard">Mustard (Sarson)</option>
                  <option value="Other">Other / Unknown</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-[#D9CEB5] mb-1">
                  Field Observations / Visual Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Concentric brown rings with yellow chlorotic halos on lower foliage..."
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#2D3B30] focus:outline-none focus:ring-2 focus:ring-[#B69A62] bg-[#101B16] text-[#F0EBDD] placeholder:text-[#A5AA96]/50"
                />
              </div>

              {/* Sample Foliage Selector */}
              <div className="pt-1">
                <span className="text-[10px] font-bold text-[#A5AA96] block mb-1.5 uppercase tracking-wider">
                  Test with Calibrated Specimens:
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
                        ctx.fillStyle = "#2d542d";
                        ctx.fillRect(0, 0, 224, 224);
                        ctx.fillStyle = "#5c402b";
                        ctx.beginPath();
                        ctx.arc(95, 95, 40, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.fillStyle = "#b69a62";
                        ctx.beginPath();
                        ctx.arc(140, 130, 28, 0, Math.PI * 2);
                        ctx.fill();
                      }
                      canvas.toBlob((blob) => {
                        if (blob) {
                          const sampleFile = new File([blob], "tomato_blight_sample.png", {
                            type: "image/png"
                          });
                          handleFileChange(sampleFile);
                          setCropName("Tomato");
                          setUserNotes("Irregular water-soaked brown lesions on lower canopy.");
                        }
                      });
                    }}
                    className="flex-1 py-1.5 px-2.5 rounded-xl bg-[#18251D] hover:bg-[#202B22] text-[#D5BEA8] text-xs font-semibold transition-colors border border-[#79563C]/50 cursor-pointer shadow-subtle"
                  >
                    Blighted Leaf Specimen
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const canvas = document.createElement("canvas");
                      canvas.width = 224;
                      canvas.height = 224;
                      const ctx = canvas.getContext("2d");
                      if (ctx) {
                        ctx.fillStyle = "#1b3a27";
                        ctx.fillRect(0, 0, 224, 224);
                        ctx.strokeStyle = "#38704c";
                        ctx.lineWidth = 5;
                        ctx.beginPath();
                        ctx.moveTo(112, 10);
                        ctx.lineTo(112, 210);
                        ctx.stroke();
                      }
                      canvas.toBlob((blob) => {
                        if (blob) {
                          const sampleFile = new File([blob], "healthy_leaf_sample.png", {
                            type: "image/png"
                          });
                          handleFileChange(sampleFile);
                          setCropName("Tomato");
                          setUserNotes("Lush vibrant green leaf with zero fungal spots.");
                        }
                      });
                    }}
                    className="flex-1 py-1.5 px-2.5 rounded-xl bg-[#18251D] hover:bg-[#202B22] text-[#A4D5A4] text-xs font-semibold transition-colors border border-[#294C36] cursor-pointer shadow-subtle"
                  >
                    Healthy Foliage Specimen
                  </button>
                </div>
              </div>

              <Button
                onClick={() => uploadMutation.mutate()}
                disabled={!file}
                isLoading={uploadMutation.isPending}
                className="w-full mt-2 bg-[#294C36] hover:bg-[#346045] text-[#F0EBDD] border border-[#B69A62]/40 shadow-subtle hover:shadow-gold-glow"
                icon={<ScanLine className="w-4 h-4 text-[#D4BE8D]" />}
              >
                Scan & Diagnose Foliage
              </Button>
            </div>
          </Card>
        </div>

        {/* Diagnostic Results */}
        <div className="lg:col-span-7">
          {diagnosisResult ? (
            <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
              {/* Primary Diagnosis Card */}
              <Card className="border border-[#B69A62]/40 shadow-card bg-gradient-to-br from-[#202B22] to-[#18251D]">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-serif font-bold text-[#D4BE8D] uppercase tracking-wider">
                        Botanical Pathology Assessment
                      </span>
                      <Badge
                        variant={
                          diagnosisResult.prediction.severity === "None"
                            ? "success"
                            : diagnosisResult.prediction.severity === "Severe"
                            ? "danger"
                            : "warning"
                        }
                        size="sm"
                      >
                        {diagnosisResult.prediction.severity} Severity
                      </Badge>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F0EBDD] tracking-tight">
                      {diagnosisResult.prediction.diseaseName}
                    </h2>
                    {diagnosisResult.prediction.scientificName && (
                      <span className="text-xs text-[#D4BE8D] font-serif italic block mt-0.5">
                        Pathogen: {diagnosisResult.prediction.scientificName}
                      </span>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-[#A5AA96] block font-medium">Model Certainty</span>
                    <span className="text-2xl font-serif font-bold text-[#A4D5A4]">
                      {Math.round(diagnosisResult.prediction.confidence * 100)}%
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#18251D] border border-[#2D3B30] text-xs text-[#D9CEB5] leading-relaxed my-3 font-normal">
                  <strong className="text-[#F0EBDD] font-semibold">Underlying Pathology:</strong>{" "}
                  {diagnosisResult.prediction.cause}
                </div>

                {/* Symptoms List */}
                {diagnosisResult.prediction.symptoms.length > 0 && (
                  <div className="my-4">
                    <span className="text-xs font-serif font-bold text-[#F0EBDD] uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                      <Leaf className="w-3.5 h-3.5 text-[#B69A62]" />
                      Observed Foliage Symptoms
                    </span>
                    <ul className="space-y-1.5 text-xs text-[#A5AA96]">
                      {diagnosisResult.prediction.symptoms.map((s, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-[#B69A62] font-bold">•</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>

              {/* Treatment Protocols */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-l-2 border-l-[#294C36]">
                  <h4 className="text-xs font-serif font-bold text-[#A4D5A4] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#A4D5A4]" />
                    Organic & Bio-Control Remedies
                  </h4>
                  <ul className="space-y-2 text-xs text-[#D9CEB5]">
                    {diagnosisResult.prediction.organicTreatment.map((org, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#A4D5A4] font-bold">✓</span>
                        <span>{org}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card className="border-l-2 border-l-[#79563C]">
                  <h4 className="text-xs font-serif font-bold text-[#D5BEA8] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-[#D5BEA8]" />
                    Chemical Fungicide / Bactericide
                  </h4>
                  <ul className="space-y-2 text-xs text-[#D9CEB5]">
                    {diagnosisResult.prediction.chemicalTreatment.map((chem, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#B69A62] font-bold">⚠️</span>
                        <span>{chem}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>

              {/* Preventative Field Advice */}
              <Card>
                <h4 className="text-xs font-serif font-bold text-[#F0EBDD] uppercase tracking-wider mb-2">
                  Cultural Field Hygiene & Preventive Practices
                </h4>
                <div className="space-y-1.5 text-xs text-[#A5AA96]">
                  {diagnosisResult.prediction.preventionTips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-[#B69A62] font-bold">→</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Safety Advisory Disclaimer */}
              <div className="p-3.5 rounded-xl bg-[#18251D] border border-[#2D3B30] text-xs text-[#A5AA96] flex items-start gap-2.5">
                <Info className="w-4 h-4 text-[#B69A62] flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong className="text-[#D9CEB5]">Agronomic Advisory:</strong> Computer vision image predictions provide diagnostic guidance based on visible leaf patterns. Before applying chemical controls, verify symptoms with your local agricultural extension officer and observe pre-harvest safety intervals.
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-[#18251D]/80 rounded-2xl border border-dashed border-[#2D3B30] min-h-[440px]">
              <div className="w-14 h-14 rounded-2xl bg-[#202B22] text-[#B69A62] border border-[#B69A62]/30 flex items-center justify-center mb-4 shadow-subtle">
                <Leaf className="w-7 h-7" />
              </div>
              <h3 className="text-base font-serif font-bold text-[#F0EBDD]">
                Awaiting Foliage Specimen
              </h3>
              <p className="mt-1.5 text-xs text-[#A5AA96] max-w-sm leading-relaxed">
                Upload a clear close-up photograph of the affected plant foliage. The vision model will analyze pathology signatures and prescribe verified organic and chemical treatment protocols.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
