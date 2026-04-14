export interface NewsEvent {
  id: number;
  title: string;
  date: string;
  contentType: 'PDF' | 'IMAGE' | 'LINK';
  actionUrl: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface NewsEventTableProps {
  data: NewsEvent[];
  onDelete?: (id: number) => void;
  onRefresh?: () => void;
  onStatusUpdate?: (id: number) => void;
  onSave?: (id: number | null, data: FormData) => Promise<boolean>;
}
