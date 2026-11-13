import { useState } from "react";
import { Outlet, Navigate, Link } from "react-router-dom";
import { Menu, Tractor, ChevronDown, Sprout } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useFarm } from "../../context/FarmContext";
import { Sidebar } from "./Sidebar";
import { NotificationDropdown } from "./NotificationDropdown";

export const AppLayout = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { farms, selectedFarm, setSelectedFarm } = useFarm();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [farmDropdownOpen, setFarmDropdownOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#101B16]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-3 border-[#B69A62] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-serif font-medium text-[#D9CEB5]">Opening Field Journal...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#101B16] text-[#F0EBDD] flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-[#101B16]/90 backdrop-blur-md border-b border-[#2D3B30] px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-[#A5AA96] hover:bg-[#18251D] lg:hidden cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Farm Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setFarmDropdownOpen(!farmDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#2D3B30] bg-[#18251D] hover:bg-[#202B22] text-xs font-medium text-[#F0EBDD] transition-colors cursor-pointer shadow-subtle"
              >
                <Tractor className="w-3.5 h-3.5 text-[#B69A62]" />
                <span className="max-w-[130px] sm:max-w-[200px] truncate">
                  {selectedFarm ? selectedFarm.name : "All Farms / General"}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#A5AA96]" />
              </button>

              {farmDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setFarmDropdownOpen(false)} />
                  <div className="absolute left-0 mt-2 w-64 rounded-xl bg-[#18251D] shadow-elevated border border-[#2D3B30] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3.5 py-1.5 text-[10px] font-bold text-[#B69A62] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#2D3B30]/60">
                      <Sprout className="w-3 h-3 text-[#B69A62]" />
                      Select Active Farm Plot
                    </div>
                    {farms.length === 0 ? (
                      <div className="px-3.5 py-2 text-xs text-[#A5AA96]">
                        No farms registered yet.{" "}
                        <Link
                          to="/farms"
                          onClick={() => setFarmDropdownOpen(false)}
                          className="text-[#D4BE8D] font-semibold underline"
                        >
                          Add Farm
                        </Link>
                      </div>
                    ) : (
                      farms.map((f) => (
                        <button
                          key={f.id}
                          onClick={() => {
                            setSelectedFarm(f);
                            setFarmDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                            selectedFarm?.id === f.id
                              ? "bg-[#202B22] text-[#F0EBDD] font-semibold border-l-2 border-l-[#B69A62]"
                              : "text-[#D9CEB5] hover:bg-[#202B22]/70"
                          }`}
                        >
                          <span className="truncate">{f.name}</span>
                          <span className="text-[10px] text-[#A5AA96] bg-[#101B16] px-1.5 py-0.5 rounded border border-[#2D3B30]">
                            {f.district}
                          </span>
                        </button>
                      ))
                    )}
                    <div className="border-t border-[#2D3B30] mt-1 pt-1">
                      <Link
                        to="/farms"
                        onClick={() => setFarmDropdownOpen(false)}
                        className="block px-3.5 py-1.5 text-xs text-[#D4BE8D] font-semibold hover:bg-[#202B22]"
                      >
                        + Manage all farms
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <NotificationDropdown />

            {/* User Profile Avatar */}
            <Link
              to="/profile"
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#18251D] transition-colors border border-transparent hover:border-[#2D3B30]"
            >
              <div className="w-7 h-7 rounded-full bg-[#294C36] text-[#D4BE8D] border border-[#B69A62]/30 flex items-center justify-center font-bold text-xs uppercase shadow-subtle">
                {user?.name ? user.name.charAt(0) : "F"}
              </div>
              <span className="hidden sm:inline text-xs font-semibold text-[#F0EBDD]">
                {user?.name?.split(" ")[0]}
              </span>
            </Link>
          </div>
        </header>

        {/* Page Content Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
