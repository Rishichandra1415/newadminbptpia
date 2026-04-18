import React from "react";

export default function DashboardPage() {
  const stats = [
    { name: "Total Colleges", value: "45", icon: "School", color: "bg-blue-500" },
    { name: "New Admissions", value: "1,240", icon: "UserPlus", color: "bg-green-500" },
    { name: "Active Queries", value: "89", icon: "MessageSquare", color: "bg-yellow-500" },
    { name: "Total Downloads", value: "4,567", icon: "Download", color: "bg-red-500" },
  ];

  return (
    <div className="h-full overflow-auto custom-scrollbar flex flex-col gap-8 p-1">
      {/* Welcome Header */}
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 line-height-[1] mb-2">Welcome Back, Admin</h1>
          <p className="text-sm text-muted-foreground font-medium">Here's what's happening in BPTPIA today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="rounded-lg bg-white px-4 py-2 text-sm font-semibold shadow-sm border border-gray-200 hover:bg-gray-50">Generate Report</button>
          <button className="rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90">Add New College</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div key={i} className="relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-md">
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
            <h3 className="text-lg font-semibold text-gray-900">Recent College Registrations</h3>
            <button className="text-sm font-medium text-primary hover:underline">View All</button>
          </div>
          <div className="flex flex-col gap-4">
             {[1,2,3,4].map(idx => (
               <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-dashed border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                       <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900">Technical Institute of Bihar #{idx}</span>
                      <span className="text-xs text-muted-foreground">Patna, Bihar</span>
                    </div>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Active</span>
               </div>
             ))}
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
           <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
           <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Upload News', icon: 'Newspaper', color: 'bg-primary' },
                { label: 'Add Result', icon: 'Award', color: 'bg-secondary' },
                { label: 'Admission Info', icon: 'FilePlus', color: 'bg-accent' },
                { label: 'Settings', icon: 'Settings', color: 'bg-gray-800' }
              ].map((action, i) => (
                <button key={i} className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all hover:shadow-sm">
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
              <p className="text-[10px] text-gray-500 leading-relaxed">Database synchronization complete. 12 fresh admission enquiries received in the last hour.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
