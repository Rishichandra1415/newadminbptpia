export type GovLetterCategory = 'Admission' | 'Scholarship' | 'General' | 'Examination' | 'Affiliation';

export interface GovernmentLetter {
  id: number;
  title: string;
  refNumber: string;
  date: string;
  subject: string;
  description: string;
  images: string | string[]; // Backend uses JSON, often comes as string or array
  category: GovLetterCategory;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface GovLetterTableProps {
  data: GovernmentLetter[];
  onDelete?: (id: number) => void;
  onRefresh?: () => void;
  onStatusUpdate?: (id: number) => void;
  onSave?: (id: number | null, formData: FormData) => Promise<boolean>;
}
