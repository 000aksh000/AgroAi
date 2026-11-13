import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sprout, Mail, Lock, User, Phone, AlertCircle, Leaf } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Bihar",
  "Gujarat",
  "Haryana",
  "Karnataka",
  "Madhya Pradesh",
  "Maharashtra",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "West Bengal"
];

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    state: "Maharashtra",
    district: ""
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await register(formData);
      navigate("/dashboard");
    } catch (err) {
      const errDetails = err.response?.data?.error?.details;
      if (errDetails && typeof errDetails === "object") {
        const firstField = Object.keys(errDetails)[0];
        setError(errDetails[firstField][0] || "Validation error");
      } else {
        setError(
          err.response?.data?.error?.message ||
            "Registration failed. Please review your details and try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#101B16] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-11 h-11 rounded-xl bg-[#294C36] border border-[#B69A62]/40 flex items-center justify-center text-[#D4BE8D] shadow-subtle group-hover:scale-105 transition-transform">
            <Sprout className="w-6 h-6" />
          </div>
          <span className="text-2xl font-serif font-bold tracking-tight text-[#F0EBDD] flex items-center gap-1.5">
            AgroAI{" "}
            <span className="text-[#D4BE8D] text-[10px] px-1.5 py-0.5 rounded-full bg-[#B69A62]/15 border border-[#B69A62]/30 uppercase font-sans font-semibold">
              Pro
            </span>
          </span>
        </Link>
        <h2 className="mt-4 text-2xl font-serif font-bold text-[#F0EBDD]">Register Operator Account</h2>
        <p className="mt-1.5 text-xs text-[#A5AA96] font-medium flex items-center justify-center gap-1">
          <Leaf className="w-3 h-3 text-[#B69A62]" />
          Unlock crop recommendations, leaf pathology scans, and mandi alerts
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card className="border-[#2D3B30] p-6 sm:p-8 bg-[#18251D] shadow-elevated">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-[#8B2E2E]/25 border border-[#8B2E2E]/50 text-[#FCA5A5] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-serif font-bold text-[#D9CEB5] mb-1.5">
                Full Operator Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#A5AA96] absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ramesh Patel"
                  className="w-full pl-10 pr-3.5 py-2 text-sm rounded-xl border border-[#2D3B30] focus:outline-none focus:ring-2 focus:ring-[#B69A62] transition-all bg-[#101B16] text-[#F0EBDD] placeholder:text-[#A5AA96]/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-serif font-bold text-[#D9CEB5] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#A5AA96] absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="farmer@example.com"
                  className="w-full pl-10 pr-3.5 py-2 text-sm rounded-xl border border-[#2D3B30] focus:outline-none focus:ring-2 focus:ring-[#B69A62] transition-all bg-[#101B16] text-[#F0EBDD] placeholder:text-[#A5AA96]/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-serif font-bold text-[#D9CEB5] mb-1.5">
                Passkey (min 8 chars, 1 uppercase, 1 number)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#A5AA96] absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Password@123"
                  className="w-full pl-10 pr-3.5 py-2 text-sm rounded-xl border border-[#2D3B30] focus:outline-none focus:ring-2 focus:ring-[#B69A62] transition-all bg-[#101B16] text-[#F0EBDD]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-serif font-bold text-[#D9CEB5] mb-1.5">
                  State / Province
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-[#2D3B30] focus:outline-none focus:ring-2 focus:ring-[#B69A62] bg-[#101B16] text-[#F0EBDD] font-medium"
                >
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-serif font-bold text-[#D9CEB5] mb-1.5">
                  District
                </label>
                <input
                  type="text"
                  placeholder="Nashik"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-[#2D3B30] focus:outline-none focus:ring-2 focus:ring-[#B69A62] bg-[#101B16] text-[#F0EBDD]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-serif font-bold text-[#D9CEB5] mb-1.5">
                Telephone (Optional)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#A5AA96] absolute left-3.5 top-3" />
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2 text-sm rounded-xl border border-[#2D3B30] focus:outline-none focus:ring-2 focus:ring-[#B69A62] bg-[#101B16] text-[#F0EBDD]"
                />
              </div>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full mt-3 bg-[#294C36] hover:bg-[#346045] text-[#F0EBDD] border border-[#B69A62]/40 shadow-subtle hover:shadow-gold-glow"
            >
              Register Operator Account
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-[#A5AA96] font-medium">
            Already have an active account?{" "}
            <Link to="/login" className="font-bold text-[#D4BE8D] hover:text-[#F0EBDD] underline">
              Sign in here
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
