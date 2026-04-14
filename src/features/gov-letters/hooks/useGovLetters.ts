"use client";

import { useState, useCallback, useEffect } from "react";
import { GovernmentLetter } from "../types";
import { govLetterService } from "../services/govLetterService";

export function useGovLetters() {
  const [letters, setLetters] = useState<GovernmentLetter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalRecords, setTotalRecords] = useState(0);

  const fetchLetters = useCallback(async (page = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await govLetterService.getAllLetters(page);
      if (response.success) {
        setLetters(response.data);
        setTotalRecords(response.totalRecords);
      } else {
        throw new Error("Failed to fetch government letters");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong while fetching letters");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteLetter = async (id: number) => {
    try {
      const response = await govLetterService.deleteLetter(id);
      if (response.success) {
        setLetters((prev) => prev.filter((item) => item.id !== id));
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const toggleStatus = async (id: number) => {
    try {
      const response = await govLetterService.toggleStatus(id);
      if (response.success) {
        setLetters((prev) => 
          prev.map((item) => 
            item.id === id ? { ...item, isActive: !item.isActive } : item
          )
        );
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const saveLetter = async (id: number | null, formData: FormData) => {
    try {
      const response = id 
        ? await govLetterService.updateLetter(id, formData)
        : await govLetterService.createLetter(formData);
      
      if (response.success) {
        fetchLetters(); // Refresh list
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  useEffect(() => {
    fetchLetters();
  }, [fetchLetters]);

  return {
    letters,
    isLoading,
    error,
    totalRecords,
    refresh: fetchLetters,
    deleteLetter,
    toggleStatus,
    saveLetter
  };
}
