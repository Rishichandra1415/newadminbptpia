
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "./nav-data";
import { useSidebar } from "./sidebar-context";

export function Sidebar() {
  const pathname = usePathname();
  const { isOpen, toggle } = useSidebar();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  // Page load hone par active menu auto-open
  useEffect(() => {
    if (!isOpen) {
      setOpenMenu(null);
      return;
    }

    const activeItem = navItems.find((item) =>
      item.items?.some((child) => pathname.startsWith(child.href))
    );

    if (activeItem) {
      setOpenMenu(activeItem.title);
    }
  }, [pathname, isOpen]);

  const toggleSidebar = () => toggle();

  const toggleMenu = (title: string) => {
    if (!isOpen) return;
    setOpenMenu((prev) => (prev === title ? null : title));
  };

  return (
    <aside
      className={`fixed left-0 top-0 z-50 flex h-screen flex-col bg-white border-r border-slate-200 shadow-sm transition-all duration-300 ease-in-out ${
        isOpen ? "w-[260px]" : "w-[76px]"
      }`}
    >
      {/* Sidebar Header (Centered Logo and Side Toggle) */}
      <div
        className={`flex items-center border-b border-slate-100 shrink-0 overflow-hidden transition-all duration-300 ${
          isOpen ? "h-20 relative" : "h-20 flex-col justify-center gap-1.5"
        }`}
      >
        {isOpen ? (
          <>
            {/* Logo Group in Center */}
            <div className="flex items-center gap-3 mx-auto">
              {/* Logo for Open State */}
              <img 
              src="https://bihartechassociation.com/wp-content/uploads/2025/04/logo.png" 
                alt="BPTPIA Logo" 
                className="h-14 w-auto object-contain drop-shadow-md"
              />
            
            </div>
            {/* Toggle Button on the side (absolute positioning within the centered header) */}
            <button
              onClick={toggleSidebar}
              className="absolute right-2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </>
        ) : (
          <>
            {/* Logo for Closed State (Centered) */}
            <img 
              src="https://bihartechassociation.com/wp-content/uploads/2025/04/logo.png" 
              alt="BPTPIA Logo" 
              className="h-12 w-auto object-contain drop-shadow-md"
            />
            <button
              onClick={toggleSidebar}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <svg className="h-5 w-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Navigation Items (BLUE THEME Applied) */}
      <nav className="mt-2 flex flex-1 flex-col overflow-y-auto overflow-x-hidden py-3 custom-scrollbar">
        {navItems.map((item) => {
          const hasChildren = !!item.items?.length;
          const isMenuOpen = openMenu === item.title;

          // Active states check
          const isActive = !hasChildren && pathname === item.href;
          const isChildActive = hasChildren && item.items?.some((child) => pathname.startsWith(child.href));

          if (hasChildren) {
            return (
              <div key={item.title}>
                {/* Parent Menu Item */}
                <button
                  title={!isOpen ? item.title : undefined}
                  onClick={() => toggleMenu(item.title)}
                  className={`group flex w-full cursor-pointer items-center py-3 transition-colors duration-200 ${
                    !isOpen ? "justify-center px-0" : "justify-between px-5"
                  } ${
                    isMenuOpen || isChildActive
                      ? "bg-sidemenu-active-bg text-sidemenu-active relative before:absolute before:left-0 before:top-0 before:h-full before:w-[3px] before:bg-sidemenu-active"
                      : "text-slate-600 hover:text-sidemenu-hover"
                  }`}
                >
                  <div className={`flex items-center ${!isOpen ? "" : "gap-3"}`}>
                    <svg
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className={`h-[20px] w-[20px] shrink-0 transition-all duration-200 ${
                        isChildActive || isMenuOpen ? "text-sidemenu-active" : "text-slate-400 group-hover:text-slate-500"
                      } ${!isOpen ? "group-hover:scale-110" : ""}`}
                    >
                      <path d={item.iconPath} />
                    </svg>
                    {isOpen && (
                      <span className={`text-[13.5px] ${isChildActive || isMenuOpen ? "font-semibold text-sidemenu-active" : "font-medium"}`}>
                        {item.title}
                      </span>
                    )}
                  </div>
                  {isOpen && (
                    <svg
                      className={`h-4 w-4 shrink-0 transition-transform duration-300 ease-in-out ${
                        isMenuOpen ? "rotate-90 text-sidemenu-active" : "rotate-0 text-slate-400 group-hover:text-slate-500"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </button>

                {/* Submenu Dropdown */}
                {isOpen && (
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isMenuOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden bg-white">
                      {/* Left Border Line */}
                      <div className="border-l-[1.5px] border-slate-200 ml-[28px] mt-1 mb-2 pb-1 flex flex-col">
                        {item.items!.map((subItem) => {
                          const isSubActive = pathname === subItem.href;

                          return (
                            <Link
                              key={subItem.title}
                              href={subItem.href}
                              className={`block pl-6 pr-4 py-2.5 text-[13px] transition-colors duration-200 ${
                                isSubActive
                                  ? "text-sidemenu-active font-semibold bg-sidemenu-active-bg/50 relative before:absolute before:left-[-1.5px] before:top-0 before:h-full before:w-[2px] before:bg-sidemenu-active"
                                  : "text-slate-500 hover:text-sidemenu-hover"
                              }`}
                            >
                              {subItem.title}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          }

          // Single Item Nav (No Dropdown)
          return (
            <Link
              key={item.title}
              href={item.href!}
              title={!isOpen ? item.title : undefined}
              className={`group flex items-center py-3 transition-colors duration-200 ${
                !isOpen ? "justify-center px-0" : "gap-3 px-5"
              } ${
                isActive
                  ? "bg-sidemenu-active-bg text-sidemenu-active relative before:absolute before:left-0 before:top-0 before:h-full before:w-[3px] before:bg-sidemenu-active"
                  : "text-slate-600 hover:text-sidemenu-hover"
              }`}
            >
              <svg
                fill="currentColor"
                viewBox="0 0 24 24"
                className={`h-[20px] w-[20px] shrink-0 transition-all duration-200 ${
                  isActive ? "text-sidemenu-active" : "text-slate-400 group-hover:text-slate-500 group-hover:scale-110"
                }`}
              >
                <path d={item.iconPath} />
              </svg>
              {isOpen && <span className={`text-[13.5px] ${isActive ? "font-semibold" : "font-medium"}`}>{item.title}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}