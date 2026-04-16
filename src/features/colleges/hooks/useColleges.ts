import { useState, useCallback, useEffect } from "react";
import { College, CollegeType } from "../types";
import { http } from "@/shared/api/api-client";
import { API_ENDPOINTS } from "@/shared/api/api-endpoints";

/**
 * Maps backend intake fields to frontend courseMatrix
 */
const mapFromBackend = (college: any): College => {
  const courseMatrix: Record<string, { isEnabled: boolean; seats: number }> = {};
  const branches = ["CE", "ME", "EE", "EEE", "ECE", "CSE", "IT", "AI"];
  
  branches.forEach(branch => {
    const val = college[`intake${branch}`];
    courseMatrix[branch] = {
      isEnabled: val !== undefined && val !== null && val !== "-",
      seats: parseInt(val as string) || 0
    };
  });
  
  return {
    ...college,
    courseMatrix,
    isActive: college.status === 'ACTIVE',
    contacts: college.telephone ? college.telephone.split(',').map((s: string) => s.trim()) : [],
    category: (college.type?.toLowerCase() || 'engineering') as 'engineering' | 'polytechnic',
    feesInfo: college.fees || "",
  };
};

/**
 * Maps frontend state to backend expected payload
 */
const mapToBackend = (data: Partial<College>) => {
  const payload: any = { ...data };
  
  // Map courseMatrix to intake fields
  if (data.courseMatrix) {
    Object.entries(data.courseMatrix).forEach(([code, info]) => {
      payload[`intake${code}`] = info.isEnabled ? info.seats.toString() : "-";
    });
  }

  // Map telephone
  if (data.contacts) {
    payload.telephone = data.contacts.join(", ");
  }

  // Map feesInfo back to fees
  if (data.feesInfo !== undefined) {
    payload.fees = data.feesInfo;
  }

  // Ensure type is uppercase
  if (data.category) {
    payload.type = data.category.toUpperCase();
  }

  return payload;
};

export function useColleges(initialFilter: 'ALL' | 'ENGINEERING' | 'POLYTECHNIC' = 'ALL') {
  const [colleges, setColleges] = useState<College[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentFilter, setCurrentFilter] = useState(initialFilter);

  const fetchColleges = useCallback(async () => {
    setIsLoading(true);
    try {
      let url = `${API_ENDPOINTS.COLLEGES}?limit=100`;
      if (currentFilter !== 'ALL') {
        url += `&type=${currentFilter}`;
      }
      
      const response = await http.get<{ success: boolean; data: any[] }>(url);
      if (response.success) {
        setColleges(response.data.map(mapFromBackend));
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [currentFilter]);

  useEffect(() => {
    fetchColleges();
  }, [fetchColleges]);

  const setFilter = (filter: 'ALL' | 'ENGINEERING' | 'POLYTECHNIC') => {
    setCurrentFilter(filter);
  };

  const toggleCourse = useCallback(async (collegeId: number, courseCode: string) => {
    const college = colleges.find(c => c.id === collegeId);
    if (!college) return;

    const current = college.courseMatrix[courseCode] || { isEnabled: false, seats: 0 };
    const updatedMatrix = {
      ...college.courseMatrix,
      [courseCode]: { ...current, isEnabled: !current.isEnabled }
    };

    try {
      const payload = mapToBackend({ courseMatrix: updatedMatrix });
      const response = await http.put<{ success: boolean; data: any }>(
        `${API_ENDPOINTS.COLLEGES}/${collegeId}`,
        payload
      );
      if (response.success) {
        setColleges(prev => prev.map(c => c.id === collegeId ? mapFromBackend(response.data) : c));
      }
    } catch (err) {
      console.error("Failed to toggle course", err);
    }
  }, [colleges]);

  const toggleStatus = useCallback(async (id: number) => {
    const college = colleges.find(c => c.id === id);
    if (!college) return;

    const newStatus = college.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      const response = await http.patch<{ success: boolean; data: any }>(
        `${API_ENDPOINTS.COLLEGES}/${id}/status`,
        { status: newStatus }
      );
      if (response.success) {
        setColleges(prev => prev.map(c => c.id === id ? mapFromBackend(response.data) : c));
      }
    } catch (err) {
      console.error("Failed to toggle status", err);
    }
  }, [colleges]);

  const deleteCollege = useCallback(async (id: number) => {
    if (!confirm("Are you sure you want to delete this college?")) return;
    
    try {
      const response = await http.delete<{ success: boolean }>(`${API_ENDPOINTS.COLLEGES}/${id}`);
      if (response.success) {
        setColleges(prev => prev.filter(c => c.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete college", err);
    }
  }, []);

  const saveCollege = useCallback(async (id: number | null, data: Partial<College>) => {
    try {
      const payload = mapToBackend(data);
      let response;
      
      if (id) {
        response = await http.put<{ success: boolean; data: any }>(
          `${API_ENDPOINTS.COLLEGES}/${id}`,
          payload
        );
      } else {
        // If specific filtered list, default to that type
        if (!payload.type && currentFilter !== 'ALL') payload.type = currentFilter;
        // Default to Engineering if somehow still missing
        if (!payload.type) payload.type = 'ENGINEERING';
        
        response = await http.post<{ success: boolean; data: any }>(
          `${API_ENDPOINTS.COLLEGES}`,
          payload
        );
      }

      if (response.success) {
        if (id) {
          setColleges(prev => prev.map(c => c.id === id ? mapFromBackend(response.data) : c));
        } else {
          setColleges(prev => [...prev, mapFromBackend(response.data)]);
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to save college", err);
      return false;
    }
  }, [currentFilter]);

  return {
    colleges,
    isLoading,
    error,
    currentFilter,
    setFilter,
    toggleCourse,
    toggleStatus,
    deleteCollege,
    saveCollege,
    refresh: fetchColleges
  };
}


