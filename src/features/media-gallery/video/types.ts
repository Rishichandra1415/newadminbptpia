export interface VideoEntry {
  id: number;
  title: string;
  description?: string;
  videoUrl: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface VideoGalleryGridProps {
  data: VideoEntry[];
  onDelete?: (id: number) => Promise<boolean>;
  onRefresh?: () => void;
  onStatusUpdate?: (id: number) => Promise<boolean>;
  onSave?: (id: number | null, data: Partial<VideoEntry>) => Promise<boolean>;
}
