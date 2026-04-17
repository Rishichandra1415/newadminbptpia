export interface CollegeCourse {
  code: string; // e.g., 'CE', 'ME', 'CSE'
  name: string; // e.g., 'Civil Engineering'
  seats: number;
  isEnabled: boolean;
}

export type CollegeType = 'ENGINEERING' | 'POLYTECHNIC';
export type CollegeStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING';

export interface College {
  id: number;
  type: CollegeType;
  name: string;
  code: string;
  address: string;
  city?: string;
  district: string;
  state: string;
  pincode?: string;
  email: string;
  website: string;
  telephone?: string;
  contacts: string[]; // Keep for UI helper
  fees?: string;
  feesInfo?: string; // Keep for UI helper
  brochureUrl?: string;
  brochureFileName?: string;
  
  // Branch Intake Fields (Backend)
  intakeCE?: string;
  intakeME?: string;
  intakeEE?: string;
  intakeEEE?: string;
  intakeECE?: string;
  intakeCSE?: string;
  intakeIT?: string;
  intakeAI?: string;
  intakeOther?: string;
  totalIntake?: number;
  
  // SEO & Meta
  metaTitle?: string;
  metaDescription?: string;
  
  // Organization
  displayOrder?: number;
  isFeatured?: boolean;

  // UI Helpers
  courseMatrix: Record<string, { isEnabled: boolean; seats: number }>;
  category: 'engineering' | 'polytechnic'; // Keep for compatibility
  isActive: boolean;
  status: CollegeStatus;
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

