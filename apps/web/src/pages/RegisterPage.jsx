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
    <div className="min-h-screen bg-[#F7F8F2] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-11 h-11 rounded-xl bg-forest-700 flex items-center justify-center text-white shadow-subtle group-hover:scale-105 transition-transform">
            <Sprout className="w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tight text-charcoal flex items-center gap-1.5">
            AgroAI{" "}
            <span className="text-forest-700 text-[10px] px-1.5 py-0.5 rounded-full bg-leaf-50 border border-leaf-200 uppercase font-black">
              PRO
            </span>
          </span>
        </Link>
        <h2 className="mt-4 text-2xl font-black text-charcoal">Register Your Farmer Profile</h2>
        <p className="mt-1.5 text-xs text-muted font-medium flex items-center justify-center gap-1">
          <Leaf className="w-3 h-3 text-forest-600" />
          Get AI crop recommendations, disease diagnosis, and mandi alerts
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card className="border-[#E5E8DD] p-6 sm:p-8 bg-white shadow-card">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-charcoal mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-muted absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ramesh Patel"
                  className="w-full pl-10 pr-3.5 py-2 text-sm rounded-xl border border-[#E5E8DD] focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-forest-600 transition-all bg-white text-charcoal font-medium placeholder:text-muted/60"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="farmer@example.com"
                  className="w-full pl-10 pr-3.5 py-2 text-sm rounded-xl border border-[#E5E8DD] focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-forest-600 transition-all bg-white text-charcoal font-medium placeholder:text-muted/60"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal mb-1.5">
                Password (min 8 chars, 1 uppercase, 1 number)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Password@123"
                  className="w-full pl-10 pr-3.5 py-2 text-sm rounded-xl border border-[#E5E8DD] focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-forest-600 transition-all bg-white text-charcoal font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1.5">
                  State
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-[#E5E8DD] focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-forest-600 bg-white text-charcoal font-medium"
                >
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1.5">
                  District
                </label>
                <input
                  type="text"
                  placeholder="Nashik"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-[#E5E8DD] focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-forest-600 bg-white text-charcoal font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal mb-1.5">
                Mobile Number (Optional)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-muted absolute left-3.5 top-3" />
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2 text-sm rounded-xl border border-[#E5E8DD] focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-forest-600 bg-white text-charcoal font-medium"
                />
              </div>
            </div>

            <Button type="submit" isLoading={isLoading} className="w-full mt-3">
              Create Farmer Account
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-muted font-medium">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-forest-700 hover:text-forest-800 underline">
              Sign in here
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
