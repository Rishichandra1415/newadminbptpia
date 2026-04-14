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

export interface MasterTableProps {
  entity: 'state' | 'city';
  data: any[];
  onAdd: () => void;
  onEdit: (item: any) => void;
  onDelete: (id: number) => void;
  isLoading: boolean;
}

export interface MasterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: any) => Promise<void>;
  entity: 'state' | 'city';
  editData?: any;
  states?: StateEntry[]; // Required only for City modal
}
