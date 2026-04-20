"use client";

import React from "react";
import { Navbar } from "@/shared/components/layout/navbar";
import { Sidebar } from "@/shared/components/layout/sidebar";
import { SidebarProvider, useSidebar } from "@/shared/components/layout/sidebar-context";
import { SocketProvider } from "@/context/SocketContext";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebar();

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar Wrapper */}
      <Sidebar />
      
      {/* Main Content Area - Synchronized with Sidebar Width */}
      <div 
        className={`flex flex-1 flex-col overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "pl-[260px]" : "pl-[76px]"
        }`}
      >
        <Navbar />
        <main className="flex-1 overflow-hidden">
          <div className="h-full p-4 md:p-6 overflow-hidden custom-scrollbar">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <SocketProvider>
        <DashboardContent>
          {children}
        </DashboardContent>
      </SocketProvider>
    </SidebarProvider>
  );
}
