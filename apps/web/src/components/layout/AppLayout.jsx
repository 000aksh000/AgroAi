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
      <div className="min-h-screen flex items-center justify-center bg-[#F7F8F2]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-3 border-[#174C35] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-medium text-[#788579]">Connecting to AgroAI Platform...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F7F8F2] flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-sm border-b border-[#E5E8DD] px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-[#788579] hover:bg-[#F0F6F3] lg:hidden cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Farm Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setFarmDropdownOpen(!farmDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#DCE1D3] bg-[#F7F8F2] hover:bg-[#E9ECE2] text-xs font-medium text-[#202820] transition-colors cursor-pointer"
              >
                <Tractor className="w-3.5 h-3.5 text-[#174C35]" />
                <span className="max-w-[130px] sm:max-w-[200px] truncate">
                  {selectedFarm ? selectedFarm.name : "All Farms / General"}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#788579]" />
              </button>

              {farmDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setFarmDropdownOpen(false)} />
                  <div className="absolute left-0 mt-2 w-60 rounded-xl bg-white shadow-card-hover border border-[#E5E8DD] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3.5 py-1.5 text-[10px] font-bold text-[#788579] uppercase tracking-wider flex items-center gap-1.5">
                      <Sprout className="w-3 h-3 text-[#174C35]" />
                      Select Active Farm Plot
                    </div>
                    {farms.length === 0 ? (
                      <div className="px-3.5 py-2 text-xs text-[#788579]">
                        No farms registered yet.{" "}
                        <Link
                          to="/farms"
                          onClick={() => setFarmDropdownOpen(false)}
                          className="text-[#174C35] font-semibold underline"
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
                              ? "bg-[#F0F6F3] text-[#174C35] font-semibold border-l-2 border-l-[#174C35]"
                              : "text-[#202820] hover:bg-[#F7F8F2]"
                          }`}
                        >
                          <span className="truncate">{f.name}</span>
                          <span className="text-[10px] text-[#788579] bg-[#E9ECE2] px-1.5 py-0.5 rounded">
                            {f.district}
                          </span>
                        </button>
                      ))
                    )}
                    <div className="border-t border-[#E5E8DD] mt-1 pt-1">
                      <Link
                        to="/farms"
                        onClick={() => setFarmDropdownOpen(false)}
                        className="block px-3.5 py-1.5 text-xs text-[#174C35] font-semibold hover:bg-[#F7F8F2]"
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
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-[#F0F6F3] transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-[#174C35] text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                {user?.name ? user.name.charAt(0) : "F"}
              </div>
              <span className="hidden sm:inline text-xs font-semibold text-[#202820]">
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
