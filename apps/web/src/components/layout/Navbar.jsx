import { Link } from "react-router-dom";
import { Sprout, LogIn, UserPlus, Leaf } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/Button";

export const Navbar = () => {
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full sand-panel border-b border-sand-200/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 via-agri-600 to-leaf-700 flex items-center justify-center text-white shadow-md shadow-agri-700/25 group-hover:scale-105 transition-transform">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-soil-900 flex items-center gap-1.5">
              AgroSmart{" "}
              <span className="text-leaf-800 text-[10px] px-1.5 py-0.5 rounded-full bg-leaf-100 border border-leaf-200/70 uppercase tracking-wider font-black">
                AI
              </span>
            </span>
            <span className="text-[10px] text-soil-500 block -mt-0.5 font-medium flex items-center gap-1">
              <Leaf className="w-2.5 h-2.5 text-leaf-500" />
              Smart Indian Agriculture
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-soil-600">
          <a href="#features" className="hover:text-leaf-700 transition-colors">
            Features
          </a>
          <a href="#crop-preview" className="hover:text-leaf-700 transition-colors">
            Crop Intelligence
          </a>
          <a href="#disease-preview" className="hover:text-leaf-700 transition-colors">
            Disease Scanner
          </a>
          <a href="#how-it-works" className="hover:text-leaf-700 transition-colors">
            How It Works
          </a>
          <a href="#trust" className="hover:text-leaf-700 transition-colors">
            Responsible AI
          </a>
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button size="sm" className="shadow-warm">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<LogIn className="w-4 h-4 text-soil-500" />}
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  size="sm"
                  icon={<UserPlus className="w-4 h-4 text-leaf-200" />}
                  className="shadow-warm"
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
