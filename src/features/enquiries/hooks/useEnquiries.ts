import { useState, useEffect, useCallback } from "react";
import { Enquiry } from "../types";
import { enquiryService } from "../services/enquiryService";
import { masterService } from "../../master/services/masterService";
import { StateEntry, CityEntry } from "../../master/types";

export function useEnquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [states, setStates] = useState<StateEntry[]>([]);
  const [districts, setDistricts] = useState<CityEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // We only fetch enquiries and states initially. 
      // Districts are fetched dynamically when a state is selected.
      const [enquiryData, stateData] = await Promise.all([
        enquiryService.getAllEnquiries(),
        masterService.getStates(),
      ]);
      
      // getAllEnquiries returns Enquiry[] directly
      setEnquiries(enquiryData);
      // masterService.getStates returns { success: boolean, data: StateEntry[] }
      setStates(stateData.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch enquiries");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchDistricts = async (stateId: number) => {
    if (!stateId) {
        setDistricts([]);
        return;
    }
    try {
      const response = await masterService.getCitiesByState(stateId);
      setDistricts(response.data);
    } catch (err) {
      console.error("Error fetching districts:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const saveEnquiry = async (id: number | null, data: Partial<Enquiry>) => {
    try {
      if (id) {
        await enquiryService.updateEnquiry(id, data);
      } else {
        await enquiryService.createEnquiry(data);
      }
      await fetchData();
      return true;
    } catch (err: any) {
      console.error("Save error:", err);
      return false;
    }
  };

  const deleteEnquiry = async (id: number) => {
    try {
      await enquiryService.deleteEnquiry(id);
      setEnquiries(prev => prev.filter(item => item.id !== id));
      return true;
    } catch (err: any) {
      console.error("Delete error:", err);
      return false;
    }
  };

  const toggleResolution = async (id: number) => {
    try {
      const response = await enquiryService.toggleResolution(id);
      if (response.success) {
        setEnquiries(prev => prev.map(item => 
          item.id === id ? { ...item, isResolved: !item.isResolved } : item
        ));
        return true;
      }
      return false;
    } catch (err: any) {
      console.error("Toggle error:", err);
      return false;
    }
  };

  return {
    enquiries,
    states,
    districts,
    isLoading,
    error,
    refresh: fetchData,
    saveEnquiry,
    deleteEnquiry,
    toggleResolution,
    fetchDistricts
  };
}
