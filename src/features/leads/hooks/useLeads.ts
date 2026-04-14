import { useState, useEffect, useCallback } from "react";
import { leadService } from "../services/leadService";
import { Lead } from "../types";

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await leadService.getAllLeads();
      setLeads(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch leads");
      console.error("Error fetching leads:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteLead = async (id: number) => {
    try {
      await leadService.deleteLead(id);
      setLeads((prev) => prev.filter((lead) => lead.id !== id));
      return true;
    } catch (err: any) {
      setError(err.message || "Failed to delete lead");
      return false;
    }
  };

  const updateLeadStatus = async (id: number, status: Lead['status']) => {
    try {
      await leadService.updateLead(id, { status });
      setLeads((prev) => 
        prev.map((lead) => (lead.id === id ? { ...lead, status } : lead))
      );
      return true;
    } catch (err: any) {
      setError(err.message || "Failed to update lead status");
      return false;
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  return {
    leads,
    isLoading,
    error,
    refresh: fetchLeads,
    deleteLead,
    updateLeadStatus
  };
}
