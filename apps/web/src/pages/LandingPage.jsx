import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Wheat,
  ScanLine,
  CloudSun,
  Store,
  BotMessageSquare,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Compass
} from "lucide-react";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";

export const LandingPage = () => {
  const [selectedSampleCrop, setSelectedSampleCrop] = useState("paddy");

  const sampleCropData = {
    paddy: {
      name: "Rice (Paddy)",
      n: 80,
      p: 45,
      k: 40,
      ph: 6.4,
      rain: 220,
      temp: 24,
      hum: 82,
      confidence: 99.4,
      rationale:
        "High nitrogen and generous monsoon rainfall provide ideal water-stagnation and vegetative tillering conditions.",
      season: "Kharif",
      advice:
        "Apply split dose urea at 25-day intervals. Maintain 2-5cm standing water from tillering stage."
    },
    cotton: {
      name: "Cotton",
      n: 120,
      p: 50,
      k: 20,
      ph: 7.2,
      rain: 80,
      temp: 25,
      hum: 78,
      confidence: 98.7,
      rationale:
        "Deep black soil nutrients with moderate rainfall are optimal for square retention and boll formation.",
      season: "Kharif",
      advice:
        "Install yellow sticky traps for sucking pest monitoring. Ensure proper drainage to avoid waterlogging."
    },
    chickpea: {
      name: "Chickpea (Chana)",
      n: 35,
      p: 65,
      k: 80,
      ph: 7.5,
      rain: 75,
      temp: 18,
      hum: 18,
      confidence: 99.1,
      rationale:
        "Cool winter temperatures with low relative humidity prevent fungal wilt while high phosphorus spurs root nodulation.",
      season: "Rabi",
      advice:
        "Inoculate seed with Rhizobium biofertilizer. First irrigation at branching (30-35 DAS)."
    }
  };

  const sample = sampleCropData[selectedSampleCrop];

  return (
    <div className="min-h-screen flex flex-col bg-[#101B16] text-[#F0EBDD]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-radial from-[#294C36]/25 via-transparent to-transparent pointer-events-none blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#18251D] border border-[#B69A62]/35 text-[#D4BE8D] text-xs font-medium mb-6 shadow-subtle">
              <Compass className="w-3.5 h-3.5 text-[#B69A62]" />
              <span className="font-serif italic">Vintage Botanical Rigor Meets Modern AI Technology</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#F0EBDD] tracking-tight leading-[1.18]">
              Empowering Every Farmer with{" "}
              <span className="text-[#D4BE8D] underline decoration-[#B69A62]/60 decoration-wavy decoration-1">
                Actionable AI
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-[#A5AA96] leading-relaxed font-sans font-normal">
              AgroAI combines calibrated machine learning, computer vision plant pathology, real-time meteorological forecasting, and APMC mandi market prices into one accessible platform designed for India's agricultural ecosystem.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link to="/register" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-base bg-[#294C36] hover:bg-[#346045] text-[#F0EBDD] border border-[#B69A62]/40 shadow-subtle hover:shadow-gold-glow"
                  icon={<ArrowRight className="w-5 h-5 text-[#D4BE8D]" />}
                >
                  Open Field Journal — Free
                </Button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto text-base border-[#B69A62]/40 text-[#D9CEB5] hover:bg-[#18251D] hover:border-[#B69A62]"
                >
                  Operator Sign In
                </Button>
              </Link>
            </div>

            {/* Metric Badges */}
            <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-[#2D3B30] text-left">
              <div className="p-4 bg-[#18251D] rounded-xl border border-[#2D3B30] shadow-subtle">
                <div className="text-2xl font-serif font-bold text-[#A4D5A4]">99.6%</div>
                <div className="text-xs text-[#A5AA96] font-medium mt-0.5">Model Accuracy</div>
              </div>
              <div className="p-4 bg-[#18251D] rounded-xl border border-[#2D3B30] shadow-subtle">
                <div className="text-2xl font-serif font-bold text-[#F0EBDD]">22 Crops</div>
                <div className="text-xs text-[#A5AA96] font-medium mt-0.5">Indian Field Flora</div>
              </div>
              <div className="p-4 bg-[#18251D] rounded-xl border border-[#2D3B30] shadow-subtle">
                <div className="text-2xl font-serif font-bold text-[#D4BE8D]">15+ Diseases</div>
                <div className="text-xs text-[#A5AA96] font-medium mt-0.5">Foliage Pathologies</div>
              </div>
              <div className="p-4 bg-[#18251D] rounded-xl border border-[#2D3B30] shadow-subtle">
                <div className="text-2xl font-serif font-bold text-[#D5BEA8]">APMC Mandis</div>
                <div className="text-xs text-[#A5AA96] font-medium mt-0.5">Daily Live ₹/Quintal</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section id="features" className="py-20 bg-[#18251D] border-y border-[#2D3B30]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase tracking-widest font-serif font-bold text-[#D4BE8D] mb-2">Botanical Field Stack</h2>
            <p className="text-3xl font-serif font-bold text-[#F0EBDD]">Engineered for Every Stage of the Agricultural Cycle</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card hoverable className="border-t-2 border-t-[#B69A62]">
              <div className="w-12 h-12 rounded-xl bg-[#18251D] text-[#D4BE8D] border border-[#B69A62]/30 flex items-center justify-center mb-5 shadow-subtle">
                <Wheat className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#F0EBDD] mb-2">Soil & Chemistry Engine</h3>
              <p className="text-sm text-[#A5AA96] leading-relaxed mb-4">
                Random Forest classifier trained on 22 standard Indian crops. Evaluates N, P, K, soil pH, ambient temperature, humidity, and rainfall to compute optimal crop matches.
              </p>
              <div className="flex items-center text-xs font-semibold text-[#D4BE8D] gap-1">
                <span>Confidence scoring &amp; alternatives</span>
              </div>
            </Card>

            <Card hoverable className="border-t-2 border-t-[#71805A]">
              <div className="w-12 h-12 rounded-xl bg-[#18251D] text-[#A4D5A4] border border-[#71805A]/40 flex items-center justify-center mb-5 shadow-subtle">
                <ScanLine className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#F0EBDD] mb-2">Pathology Diagnostic Scanner</h3>
              <p className="text-sm text-[#A5AA96] leading-relaxed mb-4">
                Upload leaf photographs directly from your smartphone. Detects early blights, late blights, rusts, and leaf blasts with actionable biological and chemical remedies.
              </p>
              <div className="flex items-center text-xs font-semibold text-[#A4D5A4] gap-1">
                <span>Integrated organic &amp; IPM advice</span>
              </div>
            </Card>

            <Card hoverable className="border-t-2 border-t-[#79563C]">
              <div className="w-12 h-12 rounded-xl bg-[#18251D] text-[#D5BEA8] border border-[#79563C]/40 flex items-center justify-center mb-5 shadow-subtle">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#F0EBDD] mb-2">APMC Mandi Quotations</h3>
              <p className="text-sm text-[#A5AA96] leading-relaxed mb-4">
                Real-time commodity price tracking across Indian APMC mandis. Filter by state, district, and crop variety to know when and where to sell for peak profitability in INR (₹/Quintal).
              </p>
              <div className="flex items-center text-xs font-semibold text-[#D5BEA8] gap-1">
                <span>7-Day price trends &amp; arrivals</span>
              </div>
            </Card>

            <Card hoverable className="border-t-2 border-t-[#B69A62]">
              <div className="w-12 h-12 rounded-xl bg-[#18251D] text-[#D4BE8D] border border-[#B69A62]/30 flex items-center justify-center mb-5 shadow-subtle">
                <CloudSun className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#F0EBDD] mb-2">Meteorological Advisory</h3>
              <p className="text-sm text-[#A5AA96] leading-relaxed mb-4">
                Hyperlocal 7-day meteorological forecasts mapped directly to field operations: spraying safety index, irrigation urgency, and crop thermal stress calculations.
              </p>
              <div className="flex items-center text-xs font-semibold text-[#D4BE8D] gap-1">
                <span>Powered by Open-Meteo API</span>
              </div>
            </Card>

            <Card hoverable className="border-t-2 border-t-[#294C36]">
              <div className="w-12 h-12 rounded-xl bg-[#18251D] text-[#A4D5A4] border border-[#294C36] flex items-center justify-center mb-5 shadow-subtle">
                <BotMessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#F0EBDD] mb-2">Kisan AI Assistant</h3>
              <p className="text-sm text-[#A5AA96] leading-relaxed mb-4">
                Agricultural AI assistant tuned for Indian farming questions: fertilizer dosages, irrigation scheduling, weed management, and government subsidy schemes like PM-KISAN and PMFBY.
              </p>
              <div className="flex items-center text-xs font-semibold text-[#A4D5A4] gap-1">
                <span>Farm-context aware consultations</span>
              </div>
            </Card>

            <Card hoverable className="border-t-2 border-t-[#D9CEB5]">
              <div className="w-12 h-12 rounded-xl bg-[#18251D] text-[#D9CEB5] border border-[#2D3B30] flex items-center justify-center mb-5 shadow-subtle">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#F0EBDD] mb-2">Parcel &amp; History Logs</h3>
              <p className="text-sm text-[#A5AA96] leading-relaxed mb-4">
                Maintain individual farm profiles with acreage, soil chemistry history, and irrigation infrastructure. Track historical diagnoses and compare multi-season yields.
              </p>
              <div className="flex items-center text-xs font-semibold text-[#D9CEB5] gap-1">
                <span>Strict privacy &amp; parcel isolation</span>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Interactive Crop Recommendation Preview Section */}
      <section id="crop-preview" className="py-20 bg-[#101B16]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge variant="gold" className="mb-3">Live Model Demonstration</Badge>
            <h2 className="text-3xl font-serif font-bold text-[#F0EBDD]">Experience AI Crop Recommendations</h2>
            <p className="mt-3 text-sm text-[#A5AA96]">
              Witness how our trained Machine Learning pipeline analyzes soil nutrients and climatic parameters in real time. Select a sample agricultural scenario below:
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setSelectedSampleCrop("paddy")}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer border ${
                  selectedSampleCrop === "paddy"
                    ? "bg-[#294C36] text-[#F0EBDD] border-[#B69A62] shadow-gold-glow font-semibold"
                    : "bg-[#18251D] text-[#D9CEB5] border-[#2D3B30] hover:bg-[#202B22]"
                }`}
              >
                Scenario 1: Heavy Clay Soils (Rice/Paddy)
              </button>
              <button
                onClick={() => setSelectedSampleCrop("cotton")}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer border ${
                  selectedSampleCrop === "cotton"
                    ? "bg-[#294C36] text-[#F0EBDD] border-[#B69A62] shadow-gold-glow font-semibold"
                    : "bg-[#18251D] text-[#D9CEB5] border-[#2D3B30] hover:bg-[#202B22]"
                }`}
              >
                Scenario 2: Black Cotton Soil (Cotton)
              </button>
              <button
                onClick={() => setSelectedSampleCrop("chickpea")}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer border ${
                  selectedSampleCrop === "chickpea"
                    ? "bg-[#294C36] text-[#F0EBDD] border-[#B69A62] shadow-gold-glow font-semibold"
                    : "bg-[#18251D] text-[#D9CEB5] border-[#2D3B30] hover:bg-[#202B22]"
                }`}
              >
                Scenario 3: Rabi Pulse (Chickpea/Chana)
              </button>
            </div>
          </div>

          <div className="max-w-4xl mx-auto bg-[#202B22] rounded-2xl border border-[#B69A62]/35 shadow-card overflow-hidden">
            <div className="bg-[#18251D] text-[#F0EBDD] px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-[#2D3B30]">
              <div className="flex items-center gap-2">
                <Wheat className="w-5 h-5 text-[#B69A62]" />
                <span className="font-serif font-bold text-sm">Model Inputs: Soil Nutrients &amp; Meteorology</span>
              </div>
              <span className="text-xs text-[#A5AA96] font-mono">Algorithm: RandomForestClassifier (v1.0.0)</span>
            </div>

            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div className="p-3.5 bg-[#18251D] rounded-xl border border-[#2D3B30]">
                  <span className="text-[11px] font-semibold text-[#A5AA96] block uppercase">Nitrogen (N)</span>
                  <span className="text-lg font-mono font-bold text-[#F0EBDD]">{sample.n} <span className="text-xs font-normal text-[#A5AA96]">kg/ha</span></span>
                </div>
                <div className="p-3.5 bg-[#18251D] rounded-xl border border-[#2D3B30]">
                  <span className="text-[11px] font-semibold text-[#A5AA96] block uppercase">Phosphorus (P)</span>
                  <span className="text-lg font-mono font-bold text-[#F0EBDD]">{sample.p} <span className="text-xs font-normal text-[#A5AA96]">kg/ha</span></span>
                </div>
                <div className="p-3.5 bg-[#18251D] rounded-xl border border-[#2D3B30]">
                  <span className="text-[11px] font-semibold text-[#A5AA96] block uppercase">Potassium (K)</span>
                  <span className="text-lg font-mono font-bold text-[#F0EBDD]">{sample.k} <span className="text-xs font-normal text-[#A5AA96]">kg/ha</span></span>
                </div>
                <div className="p-3.5 bg-[#18251D] rounded-xl border border-[#2D3B30]">
                  <span className="text-[11px] font-semibold text-[#A5AA96] block uppercase">Soil pH</span>
                  <span className="text-lg font-mono font-bold text-[#D4BE8D]">{sample.ph}</span>
                </div>
                <div className="p-3.5 bg-[#18251D] rounded-xl border border-[#2D3B30]">
                  <span className="text-[11px] font-semibold text-[#A5AA96] block uppercase">Temperature</span>
                  <span className="text-lg font-mono font-bold text-[#F0EBDD]">{sample.temp}°C</span>
                </div>
                <div className="p-3.5 bg-[#18251D] rounded-xl border border-[#2D3B30]">
                  <span className="text-[11px] font-semibold text-[#A5AA96] block uppercase">Humidity</span>
                  <span className="text-lg font-mono font-bold text-[#F0EBDD]">{sample.hum}%</span>
                </div>
                <div className="p-3.5 bg-[#18251D] rounded-xl border border-[#2D3B30] col-span-2">
                  <span className="text-[11px] font-semibold text-[#A5AA96] block uppercase">Rainfall Estimate</span>
                  <span className="text-lg font-mono font-bold text-[#F0EBDD]">{sample.rain} <span className="text-xs font-normal text-[#A5AA96]">mm</span></span>
                </div>
              </div>

              {/* Prediction Result Card */}
              <div className="p-6 rounded-2xl bg-[#18251D] border border-[#B69A62]/40 shadow-subtle">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#294C36] text-[#D4BE8D] border border-[#B69A62]/30 flex items-center justify-center font-bold text-lg shadow-subtle">
                      ✓
                    </div>
                    <div>
                      <span className="text-xs font-serif font-bold text-[#D4BE8D] uppercase tracking-wider block">Recommended Primary Flora</span>
                      <h4 className="text-2xl font-serif font-bold text-[#F0EBDD]">{sample.name}</h4>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[#A5AA96] block font-mono">Confidence Score</span>
                    <span className="text-xl font-serif font-bold text-[#A4D5A4]">{sample.confidence}%</span>
                  </div>
                </div>

                <p className="text-sm text-[#D9CEB5] leading-relaxed mb-4">
                  {sample.rationale}
                </p>

                <div className="pt-4 border-t border-[#2D3B30] flex flex-wrap gap-4 text-xs">
                  <div>
                    <span className="font-semibold text-[#F0EBDD]">Growing Season:</span>{" "}
                    <span className="text-[#A5AA96]">{sample.season}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-[#F0EBDD]">Agronomic Advisory:</span>{" "}
                    <span className="text-[#A5AA96]">{sample.advice}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Disease Detection Preview Section */}
      <section id="disease-preview" className="py-20 bg-[#18251D] border-b border-[#2D3B30]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="gold" className="mb-3">Plant Pathology AI</Badge>
              <h2 className="text-3xl font-serif font-bold text-[#F0EBDD]">
                Detect Crop Diseases Before They Spread
              </h2>
              <p className="mt-4 text-sm text-[#A5AA96] leading-relaxed">
                Leaf infections can devastate harvest yields if not diagnosed promptly. AgroAI inspects leaf discoloration, concentric fungal rings, and water-soaked bacterial lesions using specialized computer-vision classification.
              </p>

              <div className="mt-6 space-y-3.5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#A4D5A4] flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-[#D9CEB5]">
                    <strong className="text-[#F0EBDD]">15+ Indian Crop Classes:</strong> Calibrated for Tomato, Potato, Rice/Paddy, Cotton, and Corn blights, rusts, and spots.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#A4D5A4] flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-[#D9CEB5]">
                    <strong className="text-[#F0EBDD]">Dual Treatment Protocols:</strong> Receive certified Organic bio-fungicides (Neem, Trichoderma) alongside targeted chemical options with safety withholding periods.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#A4D5A4] flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-[#D9CEB5]">
                    <strong className="text-[#F0EBDD]">Persistent Field Logs:</strong> Store every scan with timestamp and notes to track disease progression over the growing season.
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <Link to="/register">
                  <Button
                    icon={<ArrowRight className="w-4 h-4 text-[#D4BE8D]" />}
                    className="bg-[#294C36] hover:bg-[#346045] text-[#F0EBDD] border border-[#B69A62]/40"
                  >
                    Try Disease Scanner Now
                  </Button>
                </Link>
              </div>
            </div>

            <div className="bg-[#101B16] p-6 rounded-3xl border border-[#2D3B30] shadow-card">
              <div className="bg-[#202B22] rounded-2xl p-5 shadow-subtle border border-[#2D3B30]">
                <div className="flex items-center justify-between pb-3 border-b border-[#2D3B30]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                    <span className="text-xs font-serif font-bold text-[#F0EBDD]">Sample Scan: Tomato Leaf</span>
                  </div>
                  <Badge variant="danger" size="sm">Severe Infection</Badge>
                </div>

                <div className="py-4">
                  <h4 className="text-lg font-serif font-bold text-[#F0EBDD]">Tomato Early Blight</h4>
                  <p className="text-xs text-[#D4BE8D] font-serif italic mt-0.5">Alternaria solani • 97.4% Match</p>

                  <div className="mt-4 p-3 bg-[#18251D] border border-[#79563C]/60 rounded-xl text-xs text-[#D5BEA8]">
                    <strong>Primary Symptoms:</strong> Dark brown concentric target-like rings on lower leaves, surrounded by chlorotic yellow halos.
                  </div>

                  <div className="mt-4 space-y-2 text-xs">
                    <div>
                      <span className="font-semibold text-[#A4D5A4]">Organic Remedy:</span>{" "}
                      <span className="text-[#A5AA96]">Cold-pressed Neem Oil spray (5ml/L) + Trichoderma viride.</span>
                    </div>
                    <div>
                      <span className="font-semibold text-[#D5BEA8]">Chemical Spray:</span>{" "}
                      <span className="text-[#A5AA96]">Mancozeb 75% WP @ 2.0g per liter water.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-[#101B16]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="gold" className="mb-3">Methodology & Speed</Badge>
          <h2 className="text-3xl font-serif font-bold text-[#F0EBDD] mb-4">How AgroAI Works</h2>
          <p className="text-sm text-[#A5AA96] max-w-xl mx-auto mb-16 font-normal">
            Designed for ease of use in the field on standard mobile browsers, even on rural 4G connections.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-left bg-[#18251D] p-6 rounded-2xl border border-[#2D3B30] shadow-card relative">
              <div className="w-10 h-10 rounded-xl bg-[#294C36] text-[#D4BE8D] border border-[#B69A62]/30 font-serif font-bold flex items-center justify-center text-sm mb-4">
                1
              </div>
              <h3 className="font-serif font-bold text-[#F0EBDD] text-base mb-2">Register Parcel</h3>
              <p className="text-xs text-[#A5AA96] leading-relaxed">
                Add your farm location, soil type, and irrigation source once. The system remembers your farm details for instant reuse.
              </p>
            </div>

            <div className="text-left bg-[#18251D] p-6 rounded-2xl border border-[#2D3B30] shadow-card relative">
              <div className="w-10 h-10 rounded-xl bg-[#294C36] text-[#D4BE8D] border border-[#B69A62]/30 font-serif font-bold flex items-center justify-center text-sm mb-4">
                2
              </div>
              <h3 className="font-serif font-bold text-[#F0EBDD] text-base mb-2">Input Soil or Photo</h3>
              <p className="text-xs text-[#A5AA96] leading-relaxed">
                Input your soil test card measurements (N, P, K, pH) or snap a photo of any leaf showing symptoms of disease or pest distress.
              </p>
            </div>

            <div className="text-left bg-[#18251D] p-6 rounded-2xl border border-[#2D3B30] shadow-card relative">
              <div className="w-10 h-10 rounded-xl bg-[#294C36] text-[#D4BE8D] border border-[#B69A62]/30 font-serif font-bold flex items-center justify-center text-sm mb-4">
                3
              </div>
              <h3 className="font-serif font-bold text-[#F0EBDD] text-base mb-2">Instant AI Inference</h3>
              <p className="text-xs text-[#A5AA96] leading-relaxed">
                Our machine learning service processes your inputs and produces transparent confidence scores, reasons, and next steps in seconds.
              </p>
            </div>

            <div className="text-left bg-[#18251D] p-6 rounded-2xl border border-[#2D3B30] shadow-card relative">
              <div className="w-10 h-10 rounded-xl bg-[#294C36] text-[#D4BE8D] border border-[#B69A62]/30 font-serif font-bold flex items-center justify-center text-sm mb-4">
                4
              </div>
              <h3 className="font-serif font-bold text-[#F0EBDD] text-base mb-2">Actionable Field Advisory</h3>
              <p className="text-xs text-[#A5AA96] leading-relaxed">
                Check today's local APMC mandi prices and 7-day weather spraying windows before making any purchase or harvesting decision.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Responsible AI Section */}
      <section id="trust" className="py-20 bg-[#18251D] border-t border-[#2D3B30]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#101B16] text-[#F0EBDD] rounded-3xl p-8 sm:p-12 shadow-elevated border border-[#B69A62]/30">
            <div className="flex items-center gap-2.5 text-[#D4BE8D] font-serif font-bold text-xs uppercase tracking-wider mb-3">
              <ShieldCheck className="w-5 h-5 text-[#B69A62]" />
              <span>Scientific Rigor &amp; Ethical AI Principles</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight mb-4 text-[#F0EBDD]">
              Our Commitment to Indian Agriculture
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-[#A5AA96] leading-relaxed">
              <div>
                <h4 className="text-[#D9CEB5] font-serif font-bold mb-2">Zero False Certainty</h4>
                <p className="text-xs text-[#A5AA96]">
                  We never claim a crop is guaranteed to succeed. Agricultural outcomes depend on weather fluctuations, seed quality, and pest pressures. Every recommendation displays model confidence and scientific rationale.
                </p>
              </div>
              <div>
                <h4 className="text-[#D9CEB5] font-serif font-bold mb-2">Operator Privacy</h4>
                <p className="text-xs text-[#A5AA96]">
                  Your farm location, soil data, and uploads remain strictly isolated to your account. We never monetize or share individual farmer land details.
                </p>
              </div>
              <div>
                <h4 className="text-[#D9CEB5] font-serif font-bold mb-2">Official Market Sources</h4>
                <p className="text-xs text-[#A5AA96]">
                  Mandi prices are aggregated from authorized APMC market committees and Agmarknet registries with verified timestamps and varieties.
                </p>
              </div>
              <div>
                <h4 className="text-[#D9CEB5] font-serif font-bold mb-2">Chemical Safety Guidance</h4>
                <p className="text-xs text-[#A5AA96]">
                  Whenever chemical fungicides or pesticides are suggested, mandatory safety gear requirements, dilution ratios, and pre-harvest intervals are clearly stated.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
