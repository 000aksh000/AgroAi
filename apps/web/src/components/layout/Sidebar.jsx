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
  X,
  Leaf
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { clsx } from "clsx";

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/farms", label: "My Farms", icon: Tractor },
    { to: "/crop-recommendation", label: "Crop Recommendation", icon: Wheat },
    { to: "/disease-detection", label: "Disease Scanner", icon: ScanLine, tag: "Vision" },
    { to: "/weather", label: "Weather & Advisory", icon: CloudSun },
    { to: "/mandi-prices", label: "Mandi Market Prices", icon: Store },
    { to: "/assistant", label: "Kisan AI Assistant", icon: BotMessageSquare, tag: "AI" },
    { to: "/history", label: "Prediction History", icon: History },
    { to: "/profile", label: "Farmer Profile", icon: User }
  ];

  if (user?.role === "admin") {
    navItems.push({ to: "/admin", label: "Admin Center", icon: ShieldAlert });
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-soil-950/40 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={clsx(
          "fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#fffefc] border-r border-sand-200/90 flex flex-col shadow-warm transition-transform duration-200 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-sand-200/80 bg-gradient-to-r from-sand-50/80 to-transparent">
          <NavLink to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 via-agri-600 to-leaf-700 flex items-center justify-center text-white shadow-md shadow-agri-700/25 transition-transform group-hover:scale-105">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-extrabold text-soil-900 flex items-center gap-1.5 leading-none tracking-tight">
                AgroSmart <span className="text-leaf-800 text-[10px] px-1.5 py-0.5 rounded-full bg-leaf-100 border border-leaf-200/70 uppercase font-black">AI</span>
              </span>
              <span className="text-[10px] text-soil-500 block font-medium mt-0.5 flex items-center gap-1">
                <Leaf className="w-2.5 h-2.5 text-leaf-500" />
                Kisan Smart Advisory
              </span>
            </div>
          </NavLink>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-soil-400 hover:bg-sand-100 lg:hidden cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => onClose()}
                className={({ isActive }) =>
                  clsx(
                    "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150",
                    isActive
                      ? "bg-gradient-to-r from-emerald-600 via-agri-600 to-leaf-700 text-white shadow-sm shadow-agri-700/25"
                      : "text-soil-700 hover:bg-sand-100/90 hover:text-soil-950"
                  )
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.tag && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-sand-200/70 text-soil-800 font-bold uppercase tracking-wider">
                    {item.tag}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div className="p-3 border-t border-sand-200/80 bg-sand-50/80">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#fffefc] border border-sand-200 shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-sand-200 text-soil-800 border border-sand-300 flex items-center justify-center font-bold text-xs flex-shrink-0 uppercase">
                {user?.name ? user.name.charAt(0) : "F"}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-soil-900 truncate">{user?.name}</p>
                <p className="text-[10px] text-soil-500 capitalize flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  {user?.role || "Farmer"}
                </p>
              </div>
            </div>
            <button
              onClick={() => logout()}
              title="Sign Out"
              className="p-1.5 rounded-lg text-soil-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
