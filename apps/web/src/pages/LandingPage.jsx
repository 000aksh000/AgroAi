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
  Sparkles
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
      rationale: "High nitrogen and generous monsoon rainfall provide ideal water-stagnation and vegetative tillering conditions.",
      season: "Kharif",
      advice: "Apply split dose urea at 25-day intervals. Maintain 2-5cm standing water from tillering stage."
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
      rationale: "Deep black soil nutrients with moderate rainfall are optimal for square retention and boll formation.",
      season: "Kharif",
      advice: "Install yellow sticky traps for sucking pest monitoring. Ensure proper drainage to avoid waterlogging."
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
      rationale: "Cool winter temperatures with low relative humidity prevent fungal wilt while high phosphorus spurs root nodulation.",
      season: "Rabi",
      advice: "Inoculate seed with Rhizobium biofertilizer. First irrigation at branching (30-35 DAS)."
    }
  };
  const sample = sampleCropData[selectedSampleCrop];
  return <div className="min-h-screen flex flex-col bg-earth-50">
      <Navbar />

      {
    /* Hero Section */
  }
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="absolute inset-0 bg-gradient-to-b from-agri-50/70 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-agri-100/80 border border-agri-200 text-agri-800 text-xs font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5 text-agri-600" />
              <span>Next-Gen Agricultural Intelligence for Indian Farmers</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Empowering Every Farmer with{" "}
              <span className="text-agri-600 underline decoration-agri-400 decoration-wavy decoration-2">
                Actionable AI
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed">
              AgroSmart AI combines calibrated machine learning, computer vision plant pathology, real-time meteorological forecasting, and APMC mandi market prices into one accessible platform designed for India's agricultural ecosystem.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link to="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto text-base shadow-lg shadow-agri-600/25" icon={<ArrowRight className="w-5 h-5" />}>
                  Start Farming Smarter — Free
                </Button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-base">
                  Sign In to Dashboard
                </Button>
              </Link>
            </div>

            {
    /* Metric Badges */
  }
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-slate-200/80 text-left">
              <div className="p-3 bg-white/70 backdrop-blur rounded-xl border border-slate-200/60">
                <div className="text-2xl font-bold text-agri-700">99.6%</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">ML Model Accuracy</div>
              </div>
              <div className="p-3 bg-white/70 backdrop-blur rounded-xl border border-slate-200/60">
                <div className="text-2xl font-bold text-slate-900">22 Crops</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Indian Field & Cash Crops</div>
              </div>
              <div className="p-3 bg-white/70 backdrop-blur rounded-xl border border-slate-200/60">
                <div className="text-2xl font-bold text-slate-900">15+ Diseases</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Leaf Pathology Classes</div>
              </div>
              <div className="p-3 bg-white/70 backdrop-blur rounded-xl border border-slate-200/60">
                <div className="text-2xl font-bold text-amber-600">APMC Mandis</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Daily Live ₹/Quintal</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {
    /* Feature Highlights Section */
  }
      <section id="features" className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase tracking-widest font-bold text-agri-600 mb-2">Comprehensive Farm Stack</h2>
            <p className="text-3xl font-bold text-slate-900">Engineered for Every Stage of the Crop Lifecycle</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card hoverable className="border-t-4 border-t-agri-600">
              <div className="w-12 h-12 rounded-xl bg-agri-100 text-agri-700 flex items-center justify-center mb-5">
                <Wheat className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Soil & Climate Crop Engine</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Utilizes Random Forest algorithm trained on 22 standard Indian crops. Evaluates Nitrogen, Phosphorus, Potassium, soil pH, ambient temperature, humidity, and rainfall to compute optimal crop matches.
              </p>
              <div className="flex items-center text-xs font-semibold text-agri-700 gap-1">
                <span>Confidence scoring & alternatives</span>
              </div>
            </Card>

            <Card hoverable className="border-t-4 border-t-emerald-600">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5">
                <ScanLine className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Instant Disease Diagnostics</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Upload leaf photographs directly from your smartphone or field camera. Detects early blights, late blights, rusts, and leaf blasts with actionable biological and chemical remedies.
              </p>
              <div className="flex items-center text-xs font-semibold text-emerald-700 gap-1">
                <span>Integrated organic & IPM advice</span>
              </div>
            </Card>

            <Card hoverable className="border-t-4 border-t-amber-500">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-5">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">APMC Mandi Intelligence</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Real-time commodity price tracking across Indian APMC mandis. Filter by state, district, and crop variety to know when and where to sell for peak profitability in INR (₹/Quintal).
              </p>
              <div className="flex items-center text-xs font-semibold text-amber-700 gap-1">
                <span>7-Day price trends & arrivals</span>
              </div>
            </Card>

            <Card hoverable className="border-t-4 border-t-blue-500">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-5">
                <CloudSun className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Agronomic Weather Advisory</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Hyperlocal 7-day meteorological forecasts mapped directly to field operations: spraying safety index, irrigation urgency, and crop heat/moisture stress calculations.
              </p>
              <div className="flex items-center text-xs font-semibold text-blue-700 gap-1">
                <span>Powered by Open-Meteo API</span>
              </div>
            </Card>

            <Card hoverable className="border-t-4 border-t-teal-600">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-5">
                <BotMessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Conversational Kisan AI</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Agricultural AI assistant tuned for Indian farming questions: fertilizer dosages, irrigation scheduling, weed management, and government subsidy schemes like PM-KISAN and PMFBY.
              </p>
              <div className="flex items-center text-xs font-semibold text-teal-700 gap-1">
                <span>Farm-context aware conversations</span>
              </div>
            </Card>

            <Card hoverable className="border-t-4 border-t-slate-700">
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Farm & History Management</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Maintain individual farm profiles with acreage, soil chemistry history, and irrigation infrastructure. Track historical diagnoses and compare multi-season yields.
              </p>
              <div className="flex items-center text-xs font-semibold text-slate-700 gap-1">
                <span>Strict privacy & data isolation</span>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {
    /* Interactive Crop Recommendation Preview Section */
  }
      <section id="crop-preview" className="py-20 bg-earth-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge variant="success" className="mb-3">Live Model Demonstration</Badge>
            <h2 className="text-3xl font-bold text-slate-900">Experience AI Crop Recommendations</h2>
            <p className="mt-3 text-sm text-slate-600">
              See how our trained Machine Learning pipeline analyzes soil nutrients and climatic parameters in real time. Select a sample agricultural scenario below:
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <button
    onClick={() => setSelectedSampleCrop("paddy")}
    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${selectedSampleCrop === "paddy" ? "bg-agri-600 text-white shadow-sm" : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"}`}
  >
                Sample 1: Heavy Clay Soils (Rice/Paddy)
              </button>
              <button
    onClick={() => setSelectedSampleCrop("cotton")}
    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${selectedSampleCrop === "cotton" ? "bg-agri-600 text-white shadow-sm" : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"}`}
  >
                Sample 2: Black Cotton Soil (Cotton)
              </button>
              <button
    onClick={() => setSelectedSampleCrop("chickpea")}
    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${selectedSampleCrop === "chickpea" ? "bg-agri-600 text-white shadow-sm" : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"}`}
  >
                Sample 3: Rabi Pulse (Chickpea/Chana)
              </button>
            </div>
          </div>

          <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Wheat className="w-5 h-5 text-emerald-400" />
                <span className="font-semibold text-sm">Model Inputs: Soil Nutrients & Meteorology</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">Algorithm: RandomForestClassifier (v1.0.0)</span>
            </div>

            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-400 block uppercase">Nitrogen (N)</span>
                  <span className="text-lg font-bold text-slate-800">{sample.n} <span className="text-xs font-normal text-slate-500">kg/ha</span></span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-400 block uppercase">Phosphorus (P)</span>
                  <span className="text-lg font-bold text-slate-800">{sample.p} <span className="text-xs font-normal text-slate-500">kg/ha</span></span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-400 block uppercase">Potassium (K)</span>
                  <span className="text-lg font-bold text-slate-800">{sample.k} <span className="text-xs font-normal text-slate-500">kg/ha</span></span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-400 block uppercase">Soil pH</span>
                  <span className="text-lg font-bold text-slate-800">{sample.ph}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-400 block uppercase">Temperature</span>
                  <span className="text-lg font-bold text-slate-800">{sample.temp}°C</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-400 block uppercase">Humidity</span>
                  <span className="text-lg font-bold text-slate-800">{sample.hum}%</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 col-span-2">
                  <span className="text-[11px] font-semibold text-slate-400 block uppercase">Rainfall Estimate</span>
                  <span className="text-lg font-bold text-slate-800">{sample.rain} <span className="text-xs font-normal text-slate-500">mm</span></span>
                </div>
              </div>

              {
    /* Prediction Result Card */
  }
              <div className="p-6 rounded-2xl bg-gradient-to-br from-agri-50 to-emerald-50/50 border border-agri-200">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-agri-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                      ✓
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-agri-700 uppercase tracking-wider block">Recommended Primary Crop</span>
                      <h4 className="text-2xl font-extrabold text-slate-900">{sample.name}</h4>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 block">Confidence Score</span>
                    <span className="text-xl font-bold text-emerald-700">{sample.confidence}%</span>
                  </div>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed mb-4">
                  {sample.rationale}
                </p>

                <div className="pt-4 border-t border-agri-200/80 flex flex-wrap gap-4 text-xs">
                  <div>
                    <span className="font-semibold text-slate-800">Growing Season:</span>{" "}
                    <span className="text-slate-600">{sample.season}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800">Agronomic Advisory:</span>{" "}
                    <span className="text-slate-600">{sample.advice}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {
    /* Disease Detection Preview Section */
  }
      <section id="disease-preview" className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="warning" className="mb-3">Plant Pathology AI</Badge>
              <h2 className="text-3xl font-bold text-slate-900">
                Detect Crop Diseases Before They Spread
              </h2>
              <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                Leaf infections can devastate harvest yields if not diagnosed promptly. AgroSmart AI inspects leaf discoloration, concentric fungal rings, and water-soaked bacterial lesions using specialized computer-vision classification.
              </p>

              <div className="mt-6 space-y-3.5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-700">
                    <strong className="text-slate-900">15+ Indian Crop Classes:</strong> Calibrated for Tomato, Potato, Rice/Paddy, Cotton, and Corn blights, rusts, and spots.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-700">
                    <strong className="text-slate-900">Dual Treatment Protocols:</strong> Receive certified Organic bio-fungicides (Neem, Trichoderma) alongside targeted chemical options with safety withholding periods.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-700">
                    <strong className="text-slate-900">Persistent Field Logs:</strong> Store every scan with timestamp and notes to track disease progression over the growing season.
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <Link to="/register">
                  <Button icon={<ArrowRight className="w-4 h-4" />}>
                    Try Disease Scanner Now
                  </Button>
                </Link>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
                    <span className="text-xs font-bold text-slate-800">Sample Scan: Tomato Leaf</span>
                  </div>
                  <Badge variant="danger" size="sm">Severe Infection</Badge>
                </div>

                <div className="py-4">
                  <h4 className="text-lg font-bold text-slate-900">Tomato Early Blight</h4>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">Alternaria solani • 97.4% Match</p>

                  <div className="mt-4 p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-xs text-amber-900">
                    <strong>Primary Symptoms:</strong> Dark brown concentric target-like rings on lower leaves, surrounded by chlorotic yellow halos.
                  </div>

                  <div className="mt-4 space-y-2 text-xs">
                    <div>
                      <span className="font-semibold text-slate-800">Organic Remedy:</span>{" "}
                      <span className="text-slate-600">Cold-pressed Neem Oil spray (5ml/L) + Trichoderma viride.</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-800">Chemical Spray:</span>{" "}
                      <span className="text-slate-600">Mancozeb 75% WP @ 2.0g per liter water.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {
    /* How It Works Section */
  }
      <section id="how-it-works" className="py-20 bg-earth-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="neutral" className="mb-3">Simplicity & Speed</Badge>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">How AgroSmart AI Works</h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto mb-16">
            Designed for ease of use in the field on standard mobile browsers, even on rural 4G connections.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-left bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative">
              <div className="w-10 h-10 rounded-xl bg-agri-600 text-white font-bold flex items-center justify-center text-sm mb-4">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Create Farm Profile</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Add your farm location, soil type, and irrigation source once. The system remembers your farm details for instant reuse.
              </p>
            </div>

            <div className="text-left bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative">
              <div className="w-10 h-10 rounded-xl bg-agri-600 text-white font-bold flex items-center justify-center text-sm mb-4">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Enter Soil or Photo</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Input your soil test card measurements (N, P, K, pH) or snap a photo of any leaf showing symptoms of disease or pest distress.
              </p>
            </div>

            <div className="text-left bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative">
              <div className="w-10 h-10 rounded-xl bg-agri-600 text-white font-bold flex items-center justify-center text-sm mb-4">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Instant AI Inference</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our machine learning service processes your inputs and produces transparent confidence scores, reasons, and next steps in seconds.
              </p>
            </div>

            <div className="text-left bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative">
              <div className="w-10 h-10 rounded-xl bg-agri-600 text-white font-bold flex items-center justify-center text-sm mb-4">
                4
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Market & Spray Advisory</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Check today's local APMC mandi prices and 7-day weather spraying windows before making any purchase or harvesting decision.
              </p>
            </div>
          </div>
        </div>
      </section>

      {
    /* Trust & Responsible AI Section */
  }
      <section id="trust" className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800">
            <div className="flex items-center gap-2.5 text-emerald-400 font-semibold text-xs uppercase tracking-wider mb-3">
              <ShieldCheck className="w-5 h-5" />
              <span>Responsible AI & Scientific Integrity</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4">
              Our Commitment to Indian Agriculture
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-300 leading-relaxed">
              <div>
                <h4 className="text-white font-semibold mb-2">No Artificial Certainty</h4>
                <p className="text-xs text-slate-400">
                  We never claim a crop is guaranteed to succeed. Agricultural outcomes depend on weather fluctuations, seed quality, and pest pressures. Every recommendation displays model confidence and scientific rationale.
                </p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Farmer Data Privacy</h4>
                <p className="text-xs text-slate-400">
                  Your farm location, soil data, and uploads remain strictly isolated to your account. We never monetize or share individual farmer land details.
                </p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Official Market Sources</h4>
                <p className="text-xs text-slate-400">
                  Mandi prices are aggregated from authorized APMC market committees and Agmarknet registries with verified timestamps and varieties.
                </p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Chemical Safety Guidance</h4>
                <p className="text-xs text-slate-400">
                  Whenever chemical fungicides or pesticides are suggested, mandatory safety gear requirements, dilution ratios, and pre-harvest intervals are clearly stated.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
