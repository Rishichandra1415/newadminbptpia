"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate a network delay
    setTimeout(() => {
      setLoading(false);
      router.push("/admin");
    }, 1200);
  };

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] overflow-hidden">
      {/* Left Decoration Section - Hidden on mobile, shown on lg+ */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-between py-12 px-8 overflow-hidden bg-indigo-50 border-r border-indigo-100">
        {/* Subtle Background Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-200/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-purple-200/30 rounded-full blur-3xl animate-pulse delay-1000" />
        
        <div className="relative z-10 w-full max-w-md space-y-6 text-center animate-in slide-in-from-left-8 duration-700">
          <div className="space-y-3">
             <h1 className="text-3xl font-extrabold text-indigo-900 tracking-tight leading-tight">
                Empowering <span className="text-indigo-600">Educational</span> Excellence
             </h1>
             <p className="text-base text-indigo-700/80 font-medium">
                Manage your institutions, courses, and admissions with the ultimate BPTPIA administrative suite.
             </p>
          </div>

          <div className="relative group perspective mx-auto max-w-[380px]">
            <div className="absolute inset-0 bg-indigo-600 rounded-3xl blur-2xl opacity-10 group-hover:opacity-20 transition-opacity" />
            <img 
              src="/login-bg.png" 
              alt="Education Illustration" 
              className="relative w-full h-auto drop-shadow-2xl hover:scale-[1.05] transition-transform duration-500 ease-out rounded-2xl" 
            />
          </div>

          <div className="grid grid-cols-3 gap-4 pt-2">
            {[
              { label: "Secured", icon: "🔒" },
              { label: "Smart", icon: "✨" },
              { label: "Scalable", icon: "🚀" }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center bg-white/70 backdrop-blur-sm p-3 rounded-xl border border-white/80 shadow-sm transition-all hover:bg-white hover:shadow-md">
                <span className="text-xl mb-1">{stat.icon}</span>
                <span className="text-[10px] font-bold text-indigo-900 uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Footer Text for Left Column */}
        <div className="relative z-10 text-[11px] font-bold text-indigo-400 uppercase tracking-widest">
           Bihar Private Technical & Professional Institutions Association
        </div>
      </div>

      {/* Right Login Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 md:p-16 bg-white animate-in fade-in duration-700">
        <div className="w-full max-w-[420px] space-y-10">
          
          {/* Logo and Greeting */}
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="relative p-1 bg-white rounded-2xl shadow-sm border border-slate-100 transition-transform hover:scale-105">
              <img 
                src="https://bihartechassociation.com/wp-content/uploads/2025/04/logo.png" 
                alt="BPTPIA Logo" 
                className="h-20 w-auto object-contain"
              />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-slate-900">Sign in to BPTPIA</h2>
              <p className="text-slate-500 text-[15px]">Welcome back! Please enter your credentials.</p>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2 group">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-widest pl-1">Email Address</label>
                <div className="relative transition-all">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail size={18} className="text-slate-400 group-focus-within:text-violet-500 transition-colors" />
                  </div>
                  <input
                    required
                    type="email"
                    placeholder="admin@bptpia.org"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all text-[15px] font-medium placeholder:text-slate-400/80"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2 group">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Password</label>
                  <button type="button" className="text-xs font-bold text-violet-600 hover:text-violet-700 transition-colors">Forgot Password?</button>
                </div>
                <div className="relative transition-all">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock size={18} className="text-slate-400 group-focus-within:text-violet-500 transition-colors" />
                  </div>
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all text-[15px] font-medium placeholder:text-slate-400/80"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center px-1">
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 rounded-lg border-slate-200 text-violet-600 focus:ring-violet-500 transition-all cursor-pointer bg-slate-50" 
                  />
                  <span className="text-sm font-medium text-slate-600 group-hover:text-slate-800 transition-colors">Remember me for 30 days</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              disabled={loading}
              type="submit"
              className="group relative w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-[16px] overflow-hidden transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-slate-200"
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </button>
          </form>

          {/* Footer Support */}
          <p className="text-center text-sm text-slate-500">
            Need help? <a href="#" className="font-bold text-slate-900 border-b-2 border-slate-900/10 hover:border-slate-900 transition-all pb-0.5">Contact Technical Support</a>
          </p>
        </div>
      </div>
    </div>
  );
}
