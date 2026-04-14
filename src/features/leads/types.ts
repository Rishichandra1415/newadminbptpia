export interface Lead {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  message: string;
  sourcePage: string;
  status: 'NEW' | 'CLOSED' | 'PROCESSED' | 'ARCHIVED';
  createdAt: string;
}

export interface LeadTableProps {
  data: Lead[];
  totalItems?: number;
  itemsPerPage?: number;
  currentPage?: number;
  baseUrl?: string;
  onDelete?: (id: number) => void;
  onRefresh?: () => void;
  onExport?: () => void;
  onSearch?: (query: string) => void;
  onStatusUpdate?: (id: number, status: Lead['status']) => void;
}
