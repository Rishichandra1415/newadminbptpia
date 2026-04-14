import { useState, useCallback, useEffect } from "react";
import { resultService } from "../services/resultService";
import { Result } from "../types";

export function useResults() {
  const [results, setResults] = useState<Result[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResults = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await resultService.getAllResults();
      if (response.success) {
        setResults(response.data);
      } else {
        setError("Failed to fetch results");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveResult = async (id: number | null, formData: FormData) => {
    try {
      const response = id 
        ? await resultService.updateResult(id, formData)
        : await resultService.createResult(formData);
      
      if (response.success) {
        await fetchResults();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const deleteResult = async (id: number) => {
    try {
      const response = await resultService.deleteResult(id);
      if (response.success) {
        setResults(prev => prev.filter(item => item.id !== id));
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const toggleStatus = async (id: number) => {
    try {
      const response = await resultService.toggleStatus(id);
      if (response.success) {
        setResults(prev => prev.map(item => 
          item.id === id ? { ...item, isActive: !item.isActive } : item
        ));
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  return {
    results,
    isLoading,
    error,
    refresh: fetchResults,
    saveResult,
    deleteResult,
    toggleStatus
  };
}
