import { Link } from "react-router-dom";
import { Sprout, LogIn, UserPlus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/Button";
export const Navbar = () => {
  const { isAuthenticated } = useAuth();
  return <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-agri-600 flex items-center justify-center text-white shadow-md shadow-agri-600/20 group-hover:scale-105 transition-transform">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1">
              AgroSmart <span className="text-agri-600 text-xs px-1.5 py-0.5 rounded bg-agri-100 uppercase tracking-wider font-semibold">AI</span>
            </span>
            <span className="text-[10px] text-slate-500 block -mt-1 font-medium">Smart Indian Agriculture</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-agri-700 transition-colors">Features</a>
          <a href="#crop-preview" className="hover:text-agri-700 transition-colors">Crop Intelligence</a>
          <a href="#disease-preview" className="hover:text-agri-700 transition-colors">Disease Scanner</a>
          <a href="#how-it-works" className="hover:text-agri-700 transition-colors">How It Works</a>
          <a href="#trust" className="hover:text-agri-700 transition-colors">Responsible AI</a>
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? <Link to="/dashboard">
              <Button size="sm">Go to Dashboard</Button>
            </Link> : <>
              <Link to="/login">
                <Button variant="ghost" size="sm" icon={<LogIn className="w-4 h-4" />}>
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" icon={<UserPlus className="w-4 h-4" />}>
                  Register Free
                </Button>
              </Link>
            </>}
        </div>
      </div>
    </header>;
};
