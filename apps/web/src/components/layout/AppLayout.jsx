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
      <div className="min-h-screen flex items-center justify-center bg-[#faf7f0]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-leaf-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-soil-700">Connecting to AgroSmart Kisan AI...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#faf7f0] flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-[#fffefb]/90 backdrop-blur-md border-b border-sand-200/90 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl text-soil-600 hover:bg-sand-100 lg:hidden cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Farm Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setFarmDropdownOpen(!farmDropdownOpen)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-sand-300 bg-sand-100/80 hover:bg-sand-200/90 text-xs font-semibold text-soil-800 transition-colors cursor-pointer shadow-2xs"
              >
                <Tractor className="w-3.5 h-3.5 text-leaf-600" />
                <span className="max-w-[130px] sm:max-w-[200px] truncate">
                  {selectedFarm ? selectedFarm.name : "All Farms / General"}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-soil-400" />
              </button>

              {farmDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setFarmDropdownOpen(false)} />
                  <div className="absolute left-0 mt-2 w-60 rounded-2xl bg-[#fffefc] shadow-warm-lg border border-sand-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3.5 py-1.5 text-[11px] font-bold text-soil-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sprout className="w-3 h-3 text-leaf-600" />
                      Select Active Farm Plot
                    </div>
                    {farms.length === 0 ? (
                      <div className="px-3.5 py-2 text-xs text-soil-600">
                        No farms registered yet.{" "}
                        <Link
                          to="/farms"
                          onClick={() => setFarmDropdownOpen(false)}
                          className="text-leaf-700 font-bold underline"
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
                          className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                            selectedFarm?.id === f.id
                              ? "bg-leaf-50 text-leaf-900 font-bold border-l-3 border-l-leaf-600"
                              : "text-soil-700 hover:bg-sand-100/70"
                          }`}
                        >
                          <span className="truncate">{f.name}</span>
                          <span className="text-[10px] text-soil-400 bg-sand-100 px-1.5 py-0.5 rounded">
                            {f.district}
                          </span>
                        </button>
                      ))
                    )}
                    <div className="border-t border-sand-100 mt-1 pt-1">
                      <Link
                        to="/farms"
                        onClick={() => setFarmDropdownOpen(false)}
                        className="block px-3.5 py-1.5 text-xs text-leaf-700 font-bold hover:bg-sand-50"
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
              className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-sand-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-600 via-agri-600 to-leaf-700 text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs shadow-agri-700/20">
                {user?.name ? user.name.charAt(0) : "F"}
              </div>
              <span className="hidden sm:inline text-xs font-bold text-soil-800">
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
