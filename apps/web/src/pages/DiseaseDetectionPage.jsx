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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E8DD]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#202820] tracking-tight">
              Plant Disease Diagnostic Scanner
            </h1>
            <Badge variant="leaf" size="sm">
              <Leaf className="w-3 h-3 text-[#174C35] mr-0.5 inline" />
              Gemini Vision AI
            </Badge>
          </div>
          <p className="text-xs text-[#788579] mt-1 font-medium">
            Upload leaf photographs to diagnose fungal, bacterial, and pest blights with integrated IPM treatment advice.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Upload Column */}
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <h3 className="text-xs font-semibold text-[#788579] uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Sprout className="w-3.5 h-3.5 text-[#174C35]" />
              Upload Foliage Photo
            </h3>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
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
              className="border-2 border-dashed border-[#DCE1D3] hover:border-[#174C35] rounded-xl p-6 text-center cursor-pointer transition-colors duration-150 bg-[#FAFBF7] hover:bg-[#F0F6F3]"
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
                    className="max-h-56 mx-auto rounded-lg object-contain border border-[#E5E8DD]"
                  />
                  <p className="text-xs text-[#174C35] font-semibold flex items-center justify-center gap-1">
                    <RefreshCw className="w-3.5 h-3.5" /> Click or drag to change image
                  </p>
                </div>
              ) : (
                <div className="py-6">
                  <div className="w-12 h-12 rounded-xl bg-white border border-[#DCE1D3] flex items-center justify-center mx-auto text-[#174C35] mb-3 shadow-2xs">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-[#202820]">
                    Click to browse or drag & drop leaf image
                  </p>
                  <p className="text-xs text-[#788579] mt-1 font-medium">
                    Supports JPEG, PNG, WEBP (Max 10MB)
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#202820] mb-1">
                  Crop Type (Optional Hint)
                </label>
                <select
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#DCE1D3] focus:outline-none focus:ring-2 focus:ring-[#174C35] bg-white text-[#202820] font-medium cursor-pointer"
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
                <label className="block font-semibold text-[#202820] mb-1">
                  Field Observations / Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Concentric brown rings with yellow halo on lower canopy..."
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#DCE1D3] focus:outline-none focus:ring-2 focus:ring-[#174C35] bg-white text-[#202820] placeholder:text-[#788579]/60"
                />
              </div>

              {/* Sample Foliage Selector */}
              <div className="pt-1">
                <span className="text-[10px] font-bold text-[#788579] block mb-1.5 uppercase tracking-wider">
                  Test with Sample Foliage:
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
                        ctx.fillStyle = "#3b6d2a";
                        ctx.fillRect(0, 0, 224, 224);
                        ctx.fillStyle = "#794628";
                        ctx.beginPath();
                        ctx.arc(95, 95, 40, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.fillStyle = "#e0a934";
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
                          setUserNotes("Irregular water-soaked brown lesions on lower leaves.");
                        }
                      });
                    }}
                    className="flex-1 py-1.5 px-2.5 rounded-lg bg-[#FAF6F2] hover:bg-[#F3ECE4] text-[#8B6548] text-xs font-semibold transition-colors border border-[#E6D7C8] cursor-pointer"
                  >
                    Blighted Leaf Sample
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const canvas = document.createElement("canvas");
                      canvas.width = 224;
                      canvas.height = 224;
                      const ctx = canvas.getContext("2d");
                      if (ctx) {
                        ctx.fillStyle = "#1e5e3a";
                        ctx.fillRect(0, 0, 224, 224);
                        ctx.strokeStyle = "#40916c";
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
                          setUserNotes("Lush vibrant green leaf with no fungal spots.");
                        }
                      });
                    }}
                    className="flex-1 py-1.5 px-2.5 rounded-lg bg-[#F0F6F3] hover:bg-[#E4F4E4] text-[#174C35] text-xs font-semibold transition-colors border border-[#DCE9E2] cursor-pointer"
                  >
                    Healthy Foliage Sample
                  </button>
                </div>
              </div>

              <Button
                onClick={() => uploadMutation.mutate()}
                disabled={!file}
                isLoading={uploadMutation.isPending}
                className="w-full mt-2"
                icon={<ScanLine className="w-4 h-4" />}
              >
                Scan & Diagnose Leaf
              </Button>
            </div>
          </Card>
        </div>

        {/* Diagnostic Results */}
        <div className="lg:col-span-7">
          {diagnosisResult ? (
            <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
              {/* Primary Diagnosis Card */}
              <Card
                className={`border-t-2 ${
                  diagnosisResult.prediction.isHealthy
                    ? "border-t-[#174C35]"
                    : "border-t-[#8B6548]"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-[#788579] uppercase tracking-wider">
                        Pathology Diagnosis
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

                    <h2 className="text-xl sm:text-2xl font-bold text-[#202820] tracking-tight">
                      {diagnosisResult.prediction.diseaseName}
                    </h2>
                    {diagnosisResult.prediction.scientificName && (
                      <span className="text-xs text-[#788579] italic block mt-0.5">
                        Pathogen: {diagnosisResult.prediction.scientificName}
                      </span>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-[#788579] block font-medium">Confidence</span>
                    <span className="text-2xl font-bold text-[#174C35]">
                      {Math.round(diagnosisResult.prediction.confidence * 100)}%
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-[#F7F8F2] border border-[#E5E8DD] text-xs text-[#202820] leading-relaxed my-3 font-normal">
                  <strong className="text-[#202820] font-semibold">Pathological Cause:</strong>{" "}
                  {diagnosisResult.prediction.cause}
                </div>

                {/* Symptoms List */}
                {diagnosisResult.prediction.symptoms.length > 0 && (
                  <div className="my-4">
                    <span className="text-xs font-semibold text-[#202820] uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                      <Leaf className="w-3.5 h-3.5 text-[#174C35]" />
                      Observed Foliage Symptoms
                    </span>
                    <ul className="space-y-1.5 text-xs text-[#202820]">
                      {diagnosisResult.prediction.symptoms.map((s, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-[#174C35] font-bold">•</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>

              {/* Treatment Protocols */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-l-2 border-l-[#174C35]">
                  <h4 className="text-xs font-bold text-[#174C35] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#174C35]" />
                    Organic & Bio-Control Remedies
                  </h4>
                  <ul className="space-y-2 text-xs text-[#202820]">
                    {diagnosisResult.prediction.organicTreatment.map((org, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#174C35] font-bold">✓</span>
                        <span>{org}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card className="border-l-2 border-l-[#8B6548]">
                  <h4 className="text-xs font-bold text-[#8B6548] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-[#8B6548]" />
                    Chemical Fungicide / Bactericide
                  </h4>
                  <ul className="space-y-2 text-xs text-[#202820]">
                    {diagnosisResult.prediction.chemicalTreatment.map((chem, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#8B6548] font-bold">⚠️</span>
                        <span>{chem}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>

              {/* Preventative Field Advice */}
              <Card>
                <h4 className="text-xs font-semibold text-[#202820] uppercase tracking-wider mb-2">
                  Preventative Field Hygiene & Cultural Practices
                </h4>
                <div className="space-y-1.5 text-xs text-[#202820]">
                  {diagnosisResult.prediction.preventionTips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-[#174C35] font-bold">→</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Safety Advisory Disclaimer */}
              <div className="p-3.5 rounded-lg bg-[#FAF6F2] border border-[#E6D7C8] text-xs text-[#735239] flex items-start gap-2.5">
                <Info className="w-4 h-4 text-[#8B6548] flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Important Agronomic Notice:</strong> Computer vision image predictions provide diagnostic guidance based on visible leaf patterns. Before applying chemical controls, verify symptoms with your local agricultural officer and observe pre-harvest intervals.
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-dashed border-[#DCE1D3] min-h-[420px]">
              <div className="w-12 h-12 rounded-xl bg-[#F0F6F3] text-[#174C35] border border-[#DCE9E2] flex items-center justify-center mb-4">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#202820]">
                Awaiting Leaf Photograph
              </h3>
              <p className="mt-1.5 text-xs text-[#788579] max-w-sm leading-relaxed">
                Upload a close-up photograph of the affected plant foliage. Gemini Multimodal Vision AI will evaluate pathology patterns and provide chemical and bio-control protocols.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
