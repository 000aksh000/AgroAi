import React from 'react';
import { Sprout, Phone, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-agri-500 flex items-center justify-center text-white">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">AgroSmart AI</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering Indian farmers through explainable machine learning, real-time agronomic advisories, and APMC market intelligence.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Aligned with ICAR agronomic guidelines</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Platform Features</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><a href="#crop-preview" className="hover:text-emerald-400 transition-colors">AI Crop Recommendation</a></li>
              <li><a href="#disease-preview" className="hover:text-emerald-400 transition-colors">Plant Pathology Detection</a></li>
              <li><a href="/weather" className="hover:text-emerald-400 transition-colors">Agricultural Weather Advisory</a></li>
              <li><a href="/mandi-prices" className="hover:text-emerald-400 transition-colors">APMC Mandi Live Prices</a></li>
              <li><a href="/assistant" className="hover:text-emerald-400 transition-colors">Kisan AI Assistant</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Government Resources</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><a href="https://pmkisan.gov.in" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors">PM-KISAN Samman Nidhi</a></li>
              <li><a href="https://agmarknet.gov.in" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors">Agmarknet Mandi Portal</a></li>
              <li><a href="https://soilhealth.dac.gov.in" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors">Soil Health Card Scheme</a></li>
              <li><a href="https://pmfby.gov.in" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors">PM Fasal Bima Yojana (PMFBY)</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Farmer Support</h4>
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm mb-1">
                <Phone className="w-4 h-4" />
                <span>Kisan Call Centre (Toll-Free)</span>
              </div>
              <p className="text-lg font-bold text-white tracking-wide">1800-180-1551</p>
              <p className="text-xs text-slate-400 mt-1">Available 6:00 AM to 10:00 PM across all 22 Indian regional languages.</p>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} AgroSmart AI. Built for Indian Agriculture with <Heart className="w-3.5 h-3.5 inline text-rose-500 mx-0.5" />.</p>
          <p className="max-w-xl text-center md:text-right">
            Disclaimer: AgroSmart AI provides scientific agricultural advisory based on calibrated machine learning models. Predictions depend on submitted inputs and regional variations. Consult your nearest Krishi Vigyan Kendra (KVK) for laboratory-verified crop decisions.
          </p>
        </div>
      </div>
    </footer>
  );
};
