import { Link } from "react-router-dom";
import { Sprout, LogIn, UserPlus, Leaf } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/Button";

export const Navbar = () => {
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#101B16]/95 backdrop-blur-md border-b border-[#2D3B30] shadow-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-[#294C36] border border-[#B69A62]/40 flex items-center justify-center text-[#D4BE8D] shadow-subtle group-hover:scale-105 transition-transform">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-serif font-bold tracking-tight text-[#F0EBDD] flex items-center gap-1.5">
              AgroAI{" "}
              <span className="text-[#D4BE8D] text-[10px] px-1.5 py-0.5 rounded-full bg-[#B69A62]/15 border border-[#B69A62]/30 uppercase tracking-wider font-sans font-semibold">
                Journal
              </span>
            </span>
            <span className="text-[10px] text-[#A5AA96] block -mt-0.5 font-sans font-medium flex items-center gap-1">
              <Leaf className="w-2.5 h-2.5 text-[#B69A62]" />
              Botanical Agricultural Intelligence
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#D9CEB5]">
          <a href="#features" className="hover:text-[#B69A62] transition-colors">
            Capabilities
          </a>
          <a href="#crop-preview" className="hover:text-[#B69A62] transition-colors">
            Soil Engine
          </a>
          <a href="#disease-preview" className="hover:text-[#B69A62] transition-colors">
            Pathology Scanner
          </a>
          <a href="#how-it-works" className="hover:text-[#B69A62] transition-colors">
            Methodology
          </a>
          <a href="#trust" className="hover:text-[#B69A62] transition-colors">
            Scientific Rigor
          </a>
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button size="sm" className="bg-[#294C36] hover:bg-[#346045] text-[#F0EBDD] border border-[#B69A62]/40">
                Enter Field Journal
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<LogIn className="w-4 h-4 text-[#B69A62]" />}
                  className="text-[#D9CEB5] hover:text-[#F0EBDD]"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  size="sm"
                  icon={<UserPlus className="w-4 h-4 text-[#D4BE8D]" />}
                  className="bg-[#294C36] hover:bg-[#346045] text-[#F0EBDD] border border-[#B69A62]/40"
                >
                  Register Free
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
