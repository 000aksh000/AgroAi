import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sprout, Mail, Lock, Eye, EyeOff, AlertCircle, Leaf } from "lucide-react";
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
          "Failed to sign in. Please verify your email and password."
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
    <div className="min-h-screen bg-[#faf7f0] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 via-agri-600 to-leaf-700 flex items-center justify-center text-white shadow-md shadow-agri-700/25 group-hover:scale-105 transition-transform">
            <Sprout className="w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tight text-soil-900 flex items-center gap-1.5">
            AgroSmart{" "}
            <span className="text-leaf-800 text-[10px] px-1.5 py-0.5 rounded-full bg-leaf-100 border border-leaf-200 uppercase font-black">
              AI
            </span>
          </span>
        </Link>
        <h2 className="mt-4 text-2xl font-black text-soil-900">Welcome Back, Farmer</h2>
        <p className="mt-1.5 text-xs text-soil-500 font-medium flex items-center justify-center gap-1">
          <Leaf className="w-3 h-3 text-leaf-600" />
          Sign in to access your farm intelligence and predictions
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card className="shadow-warm-lg border-sand-200/90 p-6 sm:p-8 bg-[#fffefc]">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-soil-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-soil-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="farmer@agrosmart.ai"
                  className="w-full pl-10 pr-3.5 py-2 text-sm rounded-xl border border-sand-300 focus:outline-none focus:ring-2 focus:ring-leaf-500 focus:border-transparent transition-all bg-[#faf7f0] text-soil-900 font-medium placeholder:text-soil-300"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-soil-700">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-soil-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2 text-sm rounded-xl border border-sand-300 focus:outline-none focus:ring-2 focus:ring-leaf-500 focus:border-transparent transition-all bg-[#faf7f0] text-soil-900 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-2.5 text-soil-400 hover:text-soil-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" isLoading={isLoading} className="w-full mt-2 shadow-warm">
              Sign In to Farm Dashboard
            </Button>
          </form>

          {/* Quick Demo Credentials Fillers */}
          <div className="mt-6 pt-5 border-t border-sand-200/80">
            <span className="text-[11px] font-bold text-soil-400 uppercase tracking-wider block mb-2 text-center">
              Instant Demo Access
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoFill("farmer@agrosmart.ai", "Farmer@AgroSmart2026")}
                className="p-2.5 text-left rounded-xl border border-sand-300 bg-sand-50/80 hover:bg-sand-100 transition-colors text-xs cursor-pointer shadow-2xs"
              >
                <div className="font-bold text-soil-900 flex items-center gap-1">
                  🌾 Farmer Demo
                </div>
                <div className="text-[10px] text-soil-500 truncate mt-0.5">
                  farmer@agrosmart.ai
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill("admin@agrosmart.ai", "Admin@AgroSmart2026")}
                className="p-2.5 text-left rounded-xl border border-sand-300 bg-sand-50/80 hover:bg-sand-100 transition-colors text-xs cursor-pointer shadow-2xs"
              >
                <div className="font-bold text-soil-900 flex items-center gap-1">
                  🛡️ Admin Demo
                </div>
                <div className="text-[10px] text-soil-500 truncate mt-0.5">
                  admin@agrosmart.ai
                </div>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-soil-500 font-medium">
            Don't have an account yet?{" "}
            <Link
              to="/register"
              className="font-bold text-leaf-700 hover:text-leaf-800 underline"
            >
              Create a free farmer account
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
