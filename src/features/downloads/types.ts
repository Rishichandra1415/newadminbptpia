export type DownloadType = 'STUDENT_DOWNLOAD' | 'SUPPORT_LINK' | 'QUICK_LINK';

export interface DownloadItem {
  id: number;
  type: DownloadType;
  title: string;
  description?: string;
  fileUrl?: string;
  externalUrl?: string;
  icon: string;
  displayOrder: number;
  isActive: boolean;
  fileSize?: number;
  mimeType?: string;
  downloadCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export type DownloadFormData = Omit<DownloadItem, 'id' | 'downloadCount' | 'createdAt' | 'updatedAt'>;
