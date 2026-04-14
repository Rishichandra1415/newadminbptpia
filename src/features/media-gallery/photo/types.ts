export interface PhotoGalleryEntry {
  id: number;
  title: string;
  description: string;
  imagePath: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PhotoGalleryGridProps {
  data: PhotoGalleryEntry[];
  onDelete?: (id: number) => void;
  onRefresh?: () => void;
  onStatusUpdate?: (id: number) => void;
  onSave?: (id: number | null, formData: FormData) => Promise<boolean>;
}
