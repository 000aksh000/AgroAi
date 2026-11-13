import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sprout, Mail, Lock, Eye, EyeOff, AlertCircle, Leaf, Tractor, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          "Failed to sign in. Please verify your email and passkey."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
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
        <h2 className="mt-4 text-2xl font-serif font-bold text-[#F0EBDD]">Sign In to Field Journal</h2>
        <p className="mt-1.5 text-xs text-[#A5AA96] font-medium flex items-center justify-center gap-1">
          <Leaf className="w-3 h-3 text-[#B69A62]" />
          Access your farm parcel intelligence and historical logs
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
                Operator Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#A5AA96] absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="farmer@agroai.in"
                  className="w-full pl-10 pr-3.5 py-2 text-sm rounded-xl border border-[#2D3B30] focus:outline-none focus:ring-2 focus:ring-[#B69A62] transition-all bg-[#101B16] text-[#F0EBDD] placeholder:text-[#A5AA96]/50"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-serif font-bold text-[#D9CEB5]">
                  Passkey / Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#A5AA96] absolute left-3.5 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2 text-sm rounded-xl border border-[#2D3B30] focus:outline-none focus:ring-2 focus:ring-[#B69A62] transition-all bg-[#101B16] text-[#F0EBDD]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-2.5 text-[#A5AA96] hover:text-[#F0EBDD] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full mt-2 bg-[#294C36] hover:bg-[#346045] text-[#F0EBDD] border border-[#B69A62]/40 shadow-subtle hover:shadow-gold-glow"
            >
              Sign In to Farm Dashboard
            </Button>
          </form>

          {/* Quick Demo Credentials Fillers */}
          <div className="mt-6 pt-5 border-t border-[#2D3B30]">
            <span className="text-[11px] font-serif font-bold text-[#D4BE8D] uppercase tracking-wider block mb-2 text-center">
              Instant Demo Access
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoFill("farmer@agrosmart.ai", "Farmer@AgroSmart2026")}
                className="p-2.5 text-left rounded-xl border border-[#2D3B30] bg-[#101B16] hover:bg-[#202B22] transition-colors text-xs cursor-pointer shadow-subtle"
              >
                <div className="font-semibold text-[#F0EBDD] flex items-center gap-1.5">
                  <Tractor className="w-3.5 h-3.5 text-[#B69A62]" />
                  Farmer Demo
                </div>
                <div className="text-[10px] text-[#A5AA96] truncate mt-0.5">
                  farmer@agrosmart.ai
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill("admin@agrosmart.ai", "Admin@AgroSmart2026")}
                className="p-2.5 text-left rounded-xl border border-[#2D3B30] bg-[#101B16] hover:bg-[#202B22] transition-colors text-xs cursor-pointer shadow-subtle"
              >
                <div className="font-semibold text-[#F0EBDD] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4BE8D]" />
                  Admin Demo
                </div>
                <div className="text-[10px] text-[#A5AA96] truncate mt-0.5">
                  admin@agrosmart.ai
                </div>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-[#A5AA96] font-medium">
            Don't have an operator account yet?{" "}
            <Link
              to="/register"
              className="font-bold text-[#D4BE8D] hover:text-[#F0EBDD] underline"
            >
              Create a free farmer account
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
