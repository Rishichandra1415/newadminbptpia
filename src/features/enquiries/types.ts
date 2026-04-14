import { StateEntry, CityEntry } from "../master/types";

export interface Enquiry {
  id: number;
  name: string;
  contact: string;
  email: string;
  stateId: number;
  districtId: number;
  programme: string;
  isResolved: boolean;
  createdAt?: string;
  updatedAt?: string;
  stateData?: StateEntry;
  districtData?: CityEntry; // The backend model corresponds to District but my frontend uses City in master types
}

export interface EnquiryTableProps {
  data: Enquiry[];
  onDelete?: (id: number) => Promise<void>;
  onRefresh?: () => Promise<void>;
  onStatusUpdate?: (id: number) => Promise<boolean>;
  onSave?: (id: number | null, data: any) => Promise<boolean>;
}
