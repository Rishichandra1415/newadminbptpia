export type CourseType = 'Polytechnic Regular' | 'B.Tech Regular' | 'Polytechnic Lateral' | 'B.Tech Lateral' | 'Other';

export interface Result {
  id: number;
  refNo: string;
  date: string;
  examName: string;
  phaseNum: number;
  isNew: boolean;
  courseType: CourseType;
  pdfUrl: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ResultTableProps {
  data: Result[];
  onDelete?: (id: number) => Promise<void>;
  onRefresh?: () => Promise<void>;
  onStatusUpdate?: (id: number) => Promise<boolean>;
  onSave?: (id: number | null, formData: FormData) => Promise<boolean>;
}
