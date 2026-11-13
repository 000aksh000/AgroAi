import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Tractor,
  Wheat,
  ScanLine,
  CloudSun,
  Store,
  BotMessageSquare,
  History,
  User,
  ShieldAlert,
  LogOut,
  Sprout,
  X
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { clsx } from "clsx";
export const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/farms", label: "My Farms", icon: Tractor },
    { to: "/crop-recommendation", label: "Crop Recommendation", icon: Wheat },
    { to: "/disease-detection", label: "Disease Scanner", icon: ScanLine },
    { to: "/weather", label: "Weather & Advisory", icon: CloudSun },
    { to: "/mandi-prices", label: "Mandi Market Prices", icon: Store },
    { to: "/assistant", label: "Kisan AI Assistant", icon: BotMessageSquare },
    { to: "/history", label: "Prediction History", icon: History },
    { to: "/profile", label: "Farmer Profile", icon: User }
  ];
  if (user?.role === "admin") {
    navItems.push({ to: "/admin", label: "Admin Center", icon: ShieldAlert });
  }
  return <>
      {
    /* Mobile backdrop */
  }
      {isOpen && <div
    className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
    onClick={onClose}
  />}

      <aside
    className={clsx(
      "fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200/90 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}
  >
        {
    /* Logo Header */
  }
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
          <NavLink to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-agri-600 flex items-center justify-center text-white shadow-md shadow-agri-600/20">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold text-slate-900 flex items-center gap-1 leading-none">
                AgroSmart <span className="text-agri-600 text-[10px] px-1 py-0.5 rounded bg-agri-100 uppercase font-bold">AI</span>
              </span>
              <span className="text-[10px] text-slate-400 block font-medium">Smart Advisory</span>
            </div>
          </NavLink>
          <button
    onClick={onClose}
    className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 lg:hidden"
  >
            <X className="w-5 h-5" />
          </button>
        </div>

        {
    /* Navigation items */
  }
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
    const Icon = item.icon;
    return <NavLink
      key={item.to}
      to={item.to}
      onClick={() => onClose()}
      className={({ isActive }) => clsx(
        "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150",
        isActive ? "bg-agri-600 text-white shadow-sm shadow-agri-600/20" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      )}
    >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>;
  })}
        </nav>

        {
    /* User Card & Logout */
  }
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/80">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-agri-100 text-agri-700 flex items-center justify-center font-bold text-xs flex-shrink-0 uppercase">
                {user?.name ? user.name.charAt(0) : "F"}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate">{user?.name}</p>
                <p className="text-[10px] text-slate-400 capitalize">{user?.role || "Farmer"}</p>
              </div>
            </div>
            <button
    onClick={() => logout()}
    title="Sign Out"
    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
  >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>;
};
