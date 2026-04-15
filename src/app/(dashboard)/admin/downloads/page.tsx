"use client";

import React, { useState } from "react";
import { DownloadsTable } from "@/features/downloads/components/DownloadsTable";
import { DownloadModal } from "@/features/downloads/components/DownloadModal";
import { useDownloads } from "@/features/downloads/hooks/useDownloads";
import { DownloadItem } from "@/features/downloads/types";
import { Toast } from "@/shared/components/ui/toast";

export default function DownloadsPage() {
  const { 
    downloads, 
    isLoading, 
    saveDownload, 
    deleteDownload, 
    toggleStatus,
    fetchDownloads 
  } = useDownloads();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DownloadItem | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const handleEdit = (item: DownloadItem) => {
    // If id is present, it's an edit, otherwise it's a new item (item will be empty object)
    if (item.id) {
        setEditingItem(item);
    } else {
        setEditingItem(null);
    }
    setIsModalOpen(true);
  };

  const handleSave = async (id: number | null, data: FormData) => {
    const success = await saveDownload(id, data);
    if (success) {
      setToast({ 
        message: id ? "Resource updated successfully!" : "New resource added successfully!", 
        type: "success" 
      });
      return true;
    } else {
      setToast({ message: "Failed to process resource.", type: "error" });
      return false;
    }
  };

  return (
    <div className="h-full">
      {isLoading ? (
        <div className="w-full h-[60vh] flex flex-col items-center justify-center gap-4 text-center">
          <div className="h-12 w-12 border-4 border-[#00b4d8] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-bold uppercase tracking-widest animate-pulse">Synchronizing Resources...</p>
        </div>
      ) : (
        <DownloadsTable 
          data={downloads}
          onDelete={deleteDownload}
          onToggleStatus={toggleStatus}
          onEdit={handleEdit}
          onRefresh={fetchDownloads}
        />
      )}

      <DownloadModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        editData={editingItem}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
}
