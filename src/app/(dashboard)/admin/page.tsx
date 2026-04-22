"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getFileUrl, http } from "@/shared/api/api-client";

interface DashboardData {
    stats: {
        totalColleges: number;
        totalAdmissions: number;
        activeQueries: number;
        totalDownloads: number;
    };
    recentAdmissions: {
        id: number;
        name: string;
        location: string;
        status: string;
        courseType: string;
    }[];
    recentLetters: {
        id: number;
        title: string;
        date: string;
        category: string;
        fileUrl: any;
    }[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [userName, setUserName] = useState("Admin");

  useEffect(() => {
    // Load user name from localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        if (user.name) setUserName(user.name);
      } catch (e) {
        console.error("Failed to parse user from localStorage");
      }
    }

    const fetchStats = async () => {
      try {
        const response = await http.get<{ success: boolean; data: DashboardData }>("/dashboard/stats");
        if (response.success) {
          setData(response.data);
        }
      } catch (error) {
        console.error("Dashboard stats fetch failed:", error);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { name: "Total Colleges", value: data?.stats?.totalColleges ?? "0", icon: "School", color: "bg-blue-500", href: "/admin/colleges" },
    { name: "New Applications", value: data?.stats?.totalAdmissions ?? "0", icon: "UserPlus", color: "bg-green-500", href: "/admin/admission-form" },
    { name: "Active Queries", value: data?.stats?.activeQueries ?? "0", icon: "MessageSquare", color: "bg-yellow-500", href: "/admin/enquiry" },
    { name: "Total Downloads", value: data?.stats?.totalDownloads ?? "0", icon: "Download", color: "bg-red-500", href: "/admin/downloads" },
  ];

  return (
    <div className="h-full overflow-auto custom-scrollbar flex flex-col gap-8 p-1">
      {/* Welcome Header */}
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 line-height-[1] mb-2">Welcome Back, {userName}</h1>
          <p className="text-sm text-muted-foreground font-medium">Here's what's happening in BPTPIA today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push('/admin/colleges')}
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold shadow-sm border border-gray-200 hover:bg-gray-50"
          >
            Add New College
          </button>
          {/* <button 
            onClick={() => router.push('/admin/admission-form')}
            className="rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90"
          >
            Add New College
          </button> */}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            onClick={() => router.push(stat.href)}
            className="relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-md cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                <div className="flex items-baseline gap-2">
                   <h3 className="mt-1 text-2xl font-bold text-gray-900">{stat.value}</h3>
                   <span className="text-xs font-medium text-green-600">+12%</span>
                </div>
              </div>
              <div className={`rounded-xl p-3 text-white ${stat.color} bg-opacity-90`}>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div className="mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
               <div className={`h-full ${stat.color} opacity-30`} style={{ width: '65%' }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Application Data</h3>
            <button 
                onClick={() => router.push('/admin/admission-form')}
                className="text-sm font-medium text-primary hover:underline"
            >
                View All
            </button>
          </div>
          <div className="flex flex-col gap-4">
             {data?.recentAdmissions?.map(item => (
               <div key={item.id} className="flex items-center justify-between p-3 rounded-xl border border-dashed border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                       <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900">{item.name}</span>
                      <span className="text-xs text-muted-foreground">{item.location} ({item.courseType})</span>
                    </div>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                        item.status === 'APPROVED' ? 'bg-green-50 text-green-700 ring-green-600/20' : 
                        item.status === 'SUBMITTED' ? 'bg-blue-50 text-blue-700 ring-blue-600/20' : 
                        'bg-yellow-50 text-yellow-700 ring-yellow-600/20'
                  }`}>
                    {item.status}
                  </span>
               </div>
             ))}
             {(!data || !data.recentAdmissions || data.recentAdmissions.length === 0) && (
                 <div className="text-center py-10 text-gray-400 text-sm">No recent application data available</div>
             )}
          </div>
          
          <div className="mt-8 border-t border-slate-100 pt-8">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Government Letters</h3>
                <button 
                    onClick={() => router.push('/admin/gov-letter')}
                    className="text-sm font-medium text-primary hover:underline"
                >
                    View All
                </button>
            </div>
            <div className="flex flex-col gap-4">
                {data?.recentLetters?.map(letter => (
                    <div key={letter.id} className="flex items-center justify-between p-3 rounded-xl border border-dashed border-gray-200 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center">
                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-gray-900">{letter.title}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-muted-foreground font-medium">{new Date(letter.date).toLocaleDateString()}</span>
                                    <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                                    <span className="text-[10px] text-purple-600 font-bold uppercase">{letter.category}</span>
                                </div>
                            </div>
                        </div>
                        <a 
                            href={getFileUrl((() => {
                                const path = letter.fileUrl;
                                if (Array.isArray(path)) return path[0];
                                if (typeof path === 'string' && path.startsWith('[')) {
                                    try {
                                        const parsed = JSON.parse(path);
                                        return Array.isArray(parsed) ? parsed[0] : path;
                                    } catch (e) { return path; }
                                }
                                return path;
                            })())} 
                            target="_blank" 
                            rel="noreferrer"
                            className="p-2 rounded-lg bg-[#00b4d8]/10 text-[#00b4d8] hover:bg-[#00b4d8] hover:text-white transition-all shadow-sm"
                            title="View PDF"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </a>
                    </div>
                ))}
                {(!data || !data.recentLetters || data.recentLetters.length === 0) && (
                    <div className="text-center py-10 text-gray-400 text-sm">No recent government letters available</div>
                )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
           <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
           <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Upload News', icon: 'Newspaper', color: 'bg-primary', href: '/admin/news' },
                { label: 'Add Result', icon: 'Award', color: 'bg-secondary', href: '/admin/results' },
                { label: 'Admission Enquiry', icon: 'FilePlus', color: 'bg-accent', href: '/admin/enquiry' },
                { label: 'Choice Of Exam Center', icon: 'Settings', color: 'bg-gray-800', href: '/admin/master/examination-center' }
              ].map((action, i) => (
                <button 
                    key={i} 
                    onClick={() => router.push(action.href)}
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all hover:shadow-sm"
                >
                   <div className={`h-10 w-10 ${action.color} rounded-lg flex items-center justify-center text-white shadow-sm`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                   </div>
                   <span className="text-[10px] font-bold uppercase tracking-tight text-gray-600">{action.label}</span>
                </button>
              ))}
           </div>
           
           <div className="mt-8 p-4 rounded-xl bg-primary/5 border border-primary/10">
              <h4 className="text-xs font-bold text-primary uppercase mb-2">System Status</h4>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs text-gray-600 font-medium">All systems operational</span>
              </div>
              <p className="text-[10px] text-gray-500 leading-relaxed">Database synchronization complete. Real-time metrics are active.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
