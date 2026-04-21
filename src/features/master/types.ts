export interface StateEntry {
  id: number;
  name: string;
  isActive: boolean;
}

export interface CityEntry {
  id: number;
  name: string;
  stateId: number;
  isActive: boolean;
  state?: StateEntry; // Relationships
}

export interface CourseEntry {
  id: number;
  name: string;
  courseType?: string;
  isActive: boolean;
}

export interface BranchEntry {
  id: number;
  name: string;
  courseId?: number | null;
  courseType?: string;
  course?: CourseEntry;
  isActive: boolean;
}

export interface ExamCenterEntry {
  id: number;
  name: string;
  courseType: 'ENGINEERING' | 'POLYTECHNIC';
  status: 'ACTIVE' | 'INACTIVE';
  orderIdx?: number;
}

export interface MasterTableProps {
  entity: 'state' | 'city';
  data: any[];
  onAdd: () => void;
  onEdit: (item: any) => void;
  onDelete: (id: number) => void;
  isLoading: boolean;
  filter?: React.ReactNode;
}

export interface MasterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: any) => Promise<void>;
  entity: 'state' | 'city';
  editData?: any;
  states?: StateEntry[]; // Required only for City modal
}

export interface CourseTableProps {
  data: CourseEntry[];
  onAdd: () => void;
  onEdit: (course: CourseEntry) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number) => void;
  isLoading: boolean;
}

export interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: any) => Promise<boolean>;
  editData?: CourseEntry | null;
}

export interface BranchTableProps {
  data: BranchEntry[];
  onAdd: () => void;
  onEdit: (branch: BranchEntry) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number) => void;
  isLoading: boolean;
}

export interface BranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: any) => Promise<boolean>;
  editData?: BranchEntry | null;
  courses?: CourseEntry[]; // Added for Course dropdown
}

export interface ExamCenterTableProps {
  data: ExamCenterEntry[];
  onAdd: () => void;
  onEdit: (center: ExamCenterEntry) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number) => void;
  isLoading: boolean;
}

export interface ExamCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: any) => Promise<boolean>;
  editData?: ExamCenterEntry | null;
}
