export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type Category = 'GENERAL' | 'OBC' | 'SC' | 'ST' | 'EBC' | 'EWS';
export type CourseType = 'Polytechnic (Diploma)' | 'Engineering (B.Tech)';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED';

export interface AdmissionForm {
  id: number;
  applicationNumber: string;
  courseType: CourseType;
  applicantName: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  aadharNumber: string;
  email: string;
  mobileNumber: string;
  gender: Gender;
  category: Category;
  tenthPercentage: string;
  twelfthPercentage?: string;
  communicationAddress: string;
  permanentAddress: string;
  courseApplied: string;
  branchApplied: string;
  examCenter: string;
  photoUrl?: string;
  signatureUrl?: string;
  idDocumentType: string;
  idDocumentUrl?: string;
  paymentStatus: PaymentStatus;
  feeAmount: number;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  transactionId?: string;
  submissionDate: string;
}

export interface AdmissionTableProps {
  data: AdmissionForm[];
  onView: (form: AdmissionForm) => void;
  onEdit: (form: AdmissionForm) => void;
  onDelete: (id: number) => void;
  isLoading: boolean;
}

export interface AdmissionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: AdmissionForm | null;
}
