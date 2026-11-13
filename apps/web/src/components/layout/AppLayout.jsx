import { useState } from "react";
import { Outlet, Navigate, Link } from "react-router-dom";
import { Menu, Tractor, ChevronDown } from "lucide-react";
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
    return <div className="min-h-screen flex items-center justify-center bg-earth-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-agri-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-600">Loading AgroSmart AI...</p>
        </div>
      </div>;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <div className="min-h-screen bg-earth-50 flex">
      {
    /* Sidebar */
  }
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {
    /* Main Content Area */
  }
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {
    /* Top Header */
  }
        <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
    onClick={() => setSidebarOpen(true)}
    className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden"
  >
              <Menu className="w-5 h-5" />
            </button>

            {
    /* Farm Selector Dropdown */
  }
            <div className="relative">
              <button
    onClick={() => setFarmDropdownOpen(!farmDropdownOpen)}
    className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-earth-50/70 hover:bg-earth-100/70 text-xs font-medium text-slate-700 transition-colors"
  >
                <Tractor className="w-3.5 h-3.5 text-agri-600" />
                <span className="max-w-[130px] sm:max-w-[200px] truncate">
                  {selectedFarm ? selectedFarm.name : "All Farms / General"}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {farmDropdownOpen && <>
                  <div className="fixed inset-0 z-40" onClick={() => setFarmDropdownOpen(false)} />
                  <div className="absolute left-0 mt-2 w-56 rounded-xl bg-white shadow-lg border border-slate-200 py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Select Active Farm
                    </div>
                    {farms.length === 0 ? <div className="px-3 py-2 text-xs text-slate-500">
                        No farms added yet.{" "}
                        <Link to="/farms" onClick={() => setFarmDropdownOpen(false)} className="text-agri-600 font-semibold underline">
                          Add Farm
                        </Link>
                      </div> : farms.map((f) => <button
    key={f.id}
    onClick={() => {
      setSelectedFarm(f);
      setFarmDropdownOpen(false);
    }}
    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${selectedFarm?.id === f.id ? "bg-agri-50 text-agri-800 font-semibold" : "text-slate-700 hover:bg-slate-50"}`}
  >
                          <span className="truncate">{f.name}</span>
                          <span className="text-[10px] text-slate-400">{f.district}</span>
                        </button>)}
                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <Link
    to="/farms"
    onClick={() => setFarmDropdownOpen(false)}
    className="block px-3 py-1.5 text-xs text-agri-600 font-medium hover:bg-slate-50"
  >
                        + Manage all farms
                      </Link>
                    </div>
                  </div>
                </>}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {
    /* Notifications */
  }
            <NotificationDropdown />

            {
    /* User Profile Avatar */
  }
            <Link
    to="/profile"
    className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
  >
              <div className="w-8 h-8 rounded-full bg-agri-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                {user?.name ? user.name.charAt(0) : "F"}
              </div>
              <span className="hidden sm:inline text-xs font-semibold text-slate-800">
                {user?.name?.split(" ")[0]}
              </span>
            </Link>
          </div>
        </header>

        {
    /* Page Content Outlet */
  }
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>;
};
