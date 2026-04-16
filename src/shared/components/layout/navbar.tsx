"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LogOut, ChevronDown, Bell, Search } from "lucide-react";

export function Navbar() {
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    setIsProfileOpen(false);
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b bg-white/80 px-6 backdrop-blur-md">
      {/* Search Input Section */}
      <div className="flex flex-1 items-center max-w-md">
        <div className="relative w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-10 pr-3 text-sm placeholder-gray-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary transition-all shadow-sm"
            placeholder="Search anything..."
          />
        </div>
      </div>

      {/* Right Actions: Notifications & Profile */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-primary transition-all">
          <Bell className="h-6 w-6" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>

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
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white tracking-tighter">
              ADMIN
            </div>
            <div className="flex flex-col items-start leading-none gap-0.5">
              <span className="text-xs font-bold text-gray-800">Admin</span>
              <span className="text-[9px] font-medium text-gray-500 uppercase">Super User</span>
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
