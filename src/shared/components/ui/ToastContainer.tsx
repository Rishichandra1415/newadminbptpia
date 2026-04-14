"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Toast } from "./toast";
import { ToastEventDetail, ToastType } from "@/shared/utils/toast-utils";

interface ToastState {
  id: number;
  message: string;
  type: ToastType;
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((detail: ToastEventDetail) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message: detail.message, type: detail.type }]);
  }, []);

  useEffect(() => {
    const handleToast = (event: Event) => {
      const detail = (event as CustomEvent).detail as ToastEventDetail;
      addToast(detail);
    };

    window.addEventListener("show-toast", handleToast);
    return () => window.removeEventListener("show-toast", handleToast);
  }, [addToast]);

  return (
    <>
      {toasts.map((t, index) => (
        <div key={t.id} style={{ transform: `translateY(${index * 70}px)` }} className="transition-all duration-300">
           <Toast 
            message={t.message} 
            type={t.type} 
            onClose={() => removeToast(t.id)} 
          />
        </div>
      ))}
    </>
  );
}
