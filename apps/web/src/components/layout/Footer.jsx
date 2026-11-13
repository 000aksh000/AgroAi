import { Sprout, Phone, ShieldCheck, Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-[#0B120E] text-[#D9CEB5] pt-16 pb-12 border-t border-[#2D3B30]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#2D3B30]">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#294C36] border border-[#B69A62]/40 flex items-center justify-center text-[#D4BE8D]">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-xl font-serif font-bold text-[#F0EBDD] tracking-tight">AgroAI</span>
            </div>
            <p className="text-sm text-[#A5AA96] leading-relaxed">
              Synthesizing vintage agricultural scholarship with modern computer vision, soil chemistry models, and APMC commodity registries.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-[#D4BE8D] font-medium">
              <ShieldCheck className="w-4 h-4 text-[#B69A62]" />
              <span>Aligned with ICAR agronomic guidelines</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-serif font-bold text-[#D4BE8D] uppercase tracking-wider mb-4">Core Capabilities</h4>
            <ul className="space-y-2.5 text-sm text-[#A5AA96]">
              <li><a href="#crop-preview" className="hover:text-[#F0EBDD] transition-colors">Soil & Nutrient Engine</a></li>
              <li><a href="#disease-preview" className="hover:text-[#F0EBDD] transition-colors">Foliage Pathology Classifier</a></li>
              <li><a href="/weather" className="hover:text-[#F0EBDD] transition-colors">Agronomic Micro-Climate</a></li>
              <li><a href="/mandi-prices" className="hover:text-[#F0EBDD] transition-colors">APMC Market Quotations</a></li>
              <li><a href="/assistant" className="hover:text-[#F0EBDD] transition-colors">Kisan AI Field Assistant</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-serif font-bold text-[#D4BE8D] uppercase tracking-wider mb-4">Institutions & Registries</h4>
            <ul className="space-y-2.5 text-sm text-[#A5AA96]">
              <li><a href="https://pmkisan.gov.in" target="_blank" rel="noreferrer" className="hover:text-[#F0EBDD] transition-colors">PM-KISAN Samman Nidhi</a></li>
              <li><a href="https://agmarknet.gov.in" target="_blank" rel="noreferrer" className="hover:text-[#F0EBDD] transition-colors">Agmarknet Mandi Network</a></li>
              <li><a href="https://soilhealth.dac.gov.in" target="_blank" rel="noreferrer" className="hover:text-[#F0EBDD] transition-colors">Soil Health Card Mission</a></li>
              <li><a href="https://pmfby.gov.in" target="_blank" rel="noreferrer" className="hover:text-[#F0EBDD] transition-colors">PM Fasal Bima Yojana (PMFBY)</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-serif font-bold text-[#D4BE8D] uppercase tracking-wider mb-4">Agronomic Helpline</h4>
            <div className="p-4 rounded-xl bg-[#18251D] border border-[#2D3B30] text-[#F0EBDD]">
              <div className="flex items-center gap-2 text-[#D4BE8D] font-semibold text-xs mb-1">
                <Phone className="w-3.5 h-3.5 text-[#B69A62]" />
                <span className="font-serif">Kisan Call Centre (Toll-Free)</span>
              </div>
              <p className="text-lg font-mono font-bold text-[#F0EBDD] tracking-wide">1800-180-1551</p>
              <p className="text-xs text-[#A5AA96] mt-1 leading-relaxed">
                Available daily from 6:00 AM to 10:00 PM across all 22 scheduled languages of India.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#A5AA96] gap-4">
          <p>© {new Date().getFullYear()} AgroAI. Built for Indian Agriculture with <Heart className="w-3.5 h-3.5 inline text-[#B69A62] mx-0.5" />.</p>
          <p className="max-w-xl text-center md:text-right text-[11px] leading-relaxed">
            Scientific Disclaimer: AgroAI provides calibrated advisory based on statistical ML models and satellite telemetry. Field variances occur; consult your nearest Krishi Vigyan Kendra (KVK) for laboratory-verified crop decisions.
          </p>
        </div>
      </div>
    </footer>
  );
};
