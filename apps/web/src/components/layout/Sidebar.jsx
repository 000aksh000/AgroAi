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
    { to: "/crop-recommendation", label: "Crop Intelligence", icon: Wheat },
    { to: "/disease-detection", label: "Disease Scanner", icon: ScanLine, tag: "Vision" },
    { to: "/weather", label: "Weather & Advisory", icon: CloudSun },
    { to: "/mandi-prices", label: "Mandi Market Prices", icon: Store },
    { to: "/assistant", label: "Kisan AI Assistant", icon: BotMessageSquare, tag: "AI" },
    { to: "/history", label: "Historical Records", icon: History },
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
          className="fixed inset-0 z-40 bg-[#0B120E]/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={clsx(
          "fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#18251D] border-r border-[#2D3B30] flex flex-col shadow-elevated transition-transform duration-200 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-[#2D3B30] bg-[#101B16]/50">
          <NavLink to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#294C36] border border-[#B69A62]/40 flex items-center justify-center text-[#D4BE8D] shadow-subtle transition-transform group-hover:scale-105">
              <Sprout className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="text-lg font-serif font-bold text-[#F0EBDD] flex items-center gap-1.5 leading-none tracking-tight">
                AgroAI{" "}
                <span className="text-[10px] px-1.5 py-0.5 rounded font-sans font-semibold uppercase tracking-wider bg-[#B69A62]/15 text-[#D4BE8D] border border-[#B69A62]/35">
                  Pro
                </span>
              </span>
              <span className="text-[10px] text-[#A5AA96] block font-medium mt-0.5 tracking-tight font-sans">
                Agricultural Intelligence
              </span>
            </div>
          </NavLink>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#A5AA96] hover:bg-[#202B22] hover:text-[#F0EBDD] lg:hidden cursor-pointer"
          >
            <X className="w-4 h-4" />
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
                    "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150",
                    isActive
                      ? "bg-[#202B22] text-[#F0EBDD] font-semibold border border-[#B69A62]/30 shadow-subtle border-l-2 border-l-[#B69A62]"
                      : "text-[#A5AA96] hover:bg-[#202B22]/60 hover:text-[#F0EBDD]"
                  )
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.tag && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider bg-[#294C36]/50 text-[#A4D5A4] border border-[#294C36]">
                    {item.tag}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div className="p-3 border-t border-[#2D3B30] bg-[#101B16]/70">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#202B22] border border-[#2D3B30]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-[#294C36] text-[#D4BE8D] border border-[#B69A62]/30 flex items-center justify-center font-bold text-xs flex-shrink-0 uppercase">
                {user?.name ? user.name.charAt(0) : "F"}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#F0EBDD] truncate">{user?.name}</p>
                <p className="text-[10px] text-[#A5AA96] capitalize font-medium">
                  {user?.role || "Farmer"}
                </p>
              </div>
            </div>
            <button
              onClick={() => logout()}
              title="Sign Out"
              className="p-1.5 rounded-lg text-[#A5AA96] hover:text-rose-400 hover:bg-[#18251D] transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
