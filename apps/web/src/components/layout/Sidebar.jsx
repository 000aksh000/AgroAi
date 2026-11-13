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
          className="fixed inset-0 z-40 bg-[#202820]/40 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={clsx(
          "fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-[#E5E8DD] flex flex-col shadow-subtle transition-transform duration-200 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-[#E5E8DD]">
          <NavLink to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#174C35] flex items-center justify-center text-white shadow-xs transition-transform group-hover:scale-105">
              <Sprout className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="text-base font-bold text-[#202820] flex items-center gap-1.5 leading-none tracking-tight">
                AgroAI <span className="text-[#174C35] text-[10px] px-1.5 py-0.5 rounded bg-[#F0F6F3] border border-[#DCE9E2] uppercase font-bold tracking-wider">SaaS</span>
              </span>
              <span className="text-[10px] text-[#788579] block font-medium mt-0.5 tracking-tight">
                Agricultural Decision Platform
              </span>
            </div>
          </NavLink>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#788579] hover:bg-[#F0F6F3] hover:text-[#174C35] lg:hidden cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => onClose()}
                className={({ isActive }) =>
                  clsx(
                    "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-150",
                    isActive
                      ? "bg-[#174C35] text-white shadow-xs font-semibold"
                      : "text-[#788579] hover:bg-[#F0F6F3] hover:text-[#174C35]"
                  )
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.tag && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider bg-[#F0F6F3] text-[#174C35] border border-[#DCE9E2]">
                    {item.tag}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div className="p-3 border-t border-[#E5E8DD] bg-[#F7F8F2]">
          <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#E5E8DD]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-[#174C35] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 uppercase">
                {user?.name ? user.name.charAt(0) : "F"}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#202820] truncate">{user?.name}</p>
                <p className="text-[10px] text-[#788579] capitalize font-medium">
                  {user?.role || "Farmer"}
                </p>
              </div>
            </div>
            <button
              onClick={() => logout()}
              title="Sign Out"
              className="p-1.5 rounded-lg text-[#788579] hover:text-[#DC2626] hover:bg-red-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
