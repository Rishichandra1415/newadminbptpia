"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Bell, CheckCircle2, Info, AlertCircle, Clock, Trash2, CheckCheck, X } from "lucide-react";
import { useSocket } from "@/context/SocketContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { http } from "@/shared/api/api-client";

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  link: string | null;
  isRead: boolean;
  createdAt: string;
}

export function NotificationDropdown() {
  const router = useRouter();
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch initial history
  const fetchNotifications = useCallback(async () => {
    try {
      const result = await http.get<any>("/notifications");
      if (result.success) {
        setNotifications(result.data);
        setUnreadCount(result.data.filter((n: Notification) => !n.isRead).length);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  }, []);

  // Initial history fetch disabled - only live notifications will be shown
  // useEffect(() => {
  //   fetchNotifications();
  // }, [fetchNotifications]);

  // Listen for live notifications
  useEffect(() => {
    if (!socket) return;

    socket.on("new-notification", (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
      
      const audio = new Audio("/ping.mp3");
      audio.play().catch(e => console.log("Audio play blocked"));
    });

    return () => {
      socket.off("new-notification");
    };
  }, [socket]);

  const markAsRead = async (id: number) => {
    try {
      await http.patch(`/notifications/${id}/read`, {});
      setNotifications((prev) => prev.map(n => n.id === id ? {...n, isRead: true} : n));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const markAllRead = async () => {
    try {
      await http.patch("/notifications/read-all", {});
      setNotifications((prev) => prev.map(n => ({...n, isRead: true})));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const deleteNotificationUI = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    // Only remove from UI state, NOT from database
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (notifications.find(n => n.id === id && !n.isRead)) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  const clearAllUI = () => {
    // Only remove from UI state, NOT from database
    setNotifications([]);
    setUnreadCount(0);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "ADMISSION": return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "ENQUIRY": return <Info className="h-4 w-4 text-blue-500" />;
      case "CONTACT": return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case "RESULT": return <CheckCircle2 className="h-4 w-4 text-purple-500" />;
      case "MASTER": return <Info className="h-4 w-4 text-blue-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-primary transition-all duration-300"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-0" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-3 w-[420px] origin-top-right rounded-xl border border-slate-100 bg-white shadow-2xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200 z-50 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-50 px-5 py-4">
              <h3 className="text-[13px] font-black tracking-wider text-slate-800 uppercase">NOTIFICATIONS</h3>
              <div className="flex gap-4">
                <button 
                  onClick={clearAllUI}
                  className="text-[11px] font-bold text-primary hover:text-primary/80 transition-colors uppercase"
                >
                  CLEAR ALL
                </button>
                <button 
                  onClick={markAllRead}
                  className="text-[11px] font-bold text-primary hover:text-primary/80 transition-colors uppercase"
                >
                  MARK READ
                </button>
              </div>
            </div>

            <div className="max-h-[420px] overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <Bell className="h-10 w-10 text-slate-200 mb-3" />
                  <p className="text-sm font-medium text-slate-400">No notifications yet</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => {
                        if (!notif.isRead) markAsRead(notif.id);
                        if (notif.link) {
                            setIsOpen(false);
                            router.push(notif.link);
                        }
                    }}
                    className={`group relative flex items-start gap-4 px-5 py-4 border-b border-slate-50 transition-all cursor-pointer ${
                      !notif.isRead ? "bg-blue-50/50 hover:bg-blue-50" : "bg-white hover:bg-slate-50"
                    }`}
                  >
                    {/* Unread Dot & Icon */}
                    <div className="mt-1 shrink-0 flex items-center gap-3">
                      <div className={`h-2 w-2 rounded-full ${!notif.isRead ? "bg-primary shadow-[0_0_8px_rgba(59,130,246,0.6)]" : "bg-transparent"}`}></div>
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          notif.type === 'ADMISSION' ? 'bg-green-50' : 
                          notif.type === 'ENQUIRY' ? 'bg-blue-50' : 
                          notif.type === 'RESULT' ? 'bg-purple-50' :
                          notif.type === 'MASTER' ? 'bg-blue-50' :
                          'bg-slate-50'
                      }`}>
                        {getIcon(notif.type)}
                      </div>
                    </div>
                    
                    <div className="flex flex-1 flex-col gap-0.5 pr-6">
                      <p className={`text-[13px] leading-snug ${!notif.isRead ? 'text-slate-900 font-bold' : 'text-slate-600 font-medium'}`}>
                        {notif.title}: {notif.message}
                      </p>
                      <p className="text-[10px] font-medium text-slate-400">
                        {formatDateTime(notif.createdAt)}
                      </p>
                    </div>

                    {/* Delete Icon */}
                    <button
                      onClick={(e) => deleteNotificationUI(e, notif.id)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-slate-300 hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <X size={15} strokeWidth={3} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
