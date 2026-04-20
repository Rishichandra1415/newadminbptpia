"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LogOut, ChevronDown, Bell, Search } from "lucide-react";
import { SearchDropdown } from "./SearchDropdown";
import { NotificationDropdown } from "./NotificationDropdown";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export function Navbar() {
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const ASSET_URL = API_BASE_URL.replace(/\/api$/, '');

  const fetchProfile = React.useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success) {
        setUserData(json.data);
      }
    } catch (error) {
      console.error("Navbar profile fetch error:", error);
    }
  }, []);

  React.useEffect(() => {
    fetchProfile();
    
    // Listen for profile updates from the Profile Page
    window.addEventListener('profileUpdated', fetchProfile);
    return () => window.removeEventListener('profileUpdated', fetchProfile);
  }, [fetchProfile]);

  const handleLogout = () => {
    setIsProfileOpen(false);
    localStorage.removeItem('token');
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b bg-white/80 px-6 backdrop-blur-md">
      {/* Search Input Section */}
      <div className="flex flex-1 items-center max-w-md">
        <SearchDropdown />
      </div>


      {/* Right Actions: Notifications & Profile */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <NotificationDropdown />

        <div className="h-8 w-px bg-gray-200"></div>

        {/* Profile Dropdown Component */}
        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={`flex items-center gap-2 rounded-full border p-1 pr-3 shadow-sm transition-all ${
              isProfileOpen 
                ? "border-primary/40 bg-gray-50 ring-2 ring-primary/10" 
                : "border-gray-100 bg-white hover:border-primary/20 hover:bg-gray-50"
            }`}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary overflow-hidden shadow-sm ring-1 ring-white">
              {userData?.profileImage ? (
                <img 
                  src={`${ASSET_URL}${userData.profileImage}`} 
                  alt="Admin" 
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-[10px] font-bold text-white tracking-tighter">ADMIN</span>
              )}
            </div>
            <div className="flex flex-col items-start leading-none gap-0.5">
              <span className="text-xs font-bold text-gray-800">{userData?.name || "Admin"}</span>
              <span className="text-[9px] font-medium text-gray-500 uppercase tracking-widest">{userData?.role || "Super User"}</span>
            </div>
            <ChevronDown className={`h-3 w-3 text-gray-400 transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Actual Dropdown Menu */}
          {isProfileOpen && (
            <>
              {/* Invisible overlay to close on click outside */}
              <div 
                className="fixed inset-0 z-0 h-full w-full" 
                onClick={() => setIsProfileOpen(false)}
              ></div>
              
              <div className="absolute right-0 mt-3 w-56 origin-top-right rounded-2xl border border-slate-100 bg-white p-2 shadow-xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200 z-10">
                {/* User Header Info (Mobile friendly) */}
                <div className="px-3 py-2 border-b border-slate-50 mb-1">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Signed in as</p>
                   <p className="text-xs font-bold text-slate-800 truncate">admin@bptpia.org</p>
                </div>

                <Link 
                  href="/admin/profile"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors"
                >
                  <User size={18} className="text-slate-400" />
                  My Profile
                </Link>
                
                <div className="my-1 h-px bg-slate-50"></div>
                
                <button 
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
