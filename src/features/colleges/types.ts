export interface CollegeCourse {
  code: string; // e.g., 'CE', 'ME', 'CSE'
  name: string; // e.g., 'Civil Engineering'
  seats: number;
  isEnabled: boolean;
}

export interface College {
  id: number;
  name: string;
  code: string;
  totalSeats: number;
  address: string;
  district: string;
  state: string;
  contacts: string[]; // Multiple numbers
  email: string;
  website: string;
  feesInfo: string;
  brochureUrl?: string;
  courseMatrix: Record<string, { isEnabled: boolean; seats: number }>;
  category: 'engineering' | 'polytechnic';
  isActive: boolean;
}

export interface CollegesTableProps {
  data: College[];
  category: 'engineering' | 'polytechnic';
  onDelete?: (id: number) => Promise<void>;
  onToggleStatus?: (id: number) => Promise<void>;
  onToggleCourse?: (collegeId: number, courseCode: string) => Promise<void>;
  onEdit?: (college: College) => void;
  onRefresh?: () => void;
}
