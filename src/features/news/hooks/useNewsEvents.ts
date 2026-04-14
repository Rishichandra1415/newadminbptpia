"use client";

import { useState, useCallback, useEffect } from "react";
import { NewsEvent } from "../types";
import { newsService } from "../services/newsService";

export function useNewsEvents() {
  const [events, setEvents] = useState<NewsEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalRecords, setTotalRecords] = useState(0);

  const fetchEvents = useCallback(async (page = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await newsService.getAllEvents(page);
      if (response.success) {
        setEvents(response.data);
        setTotalRecords(response.totalRecords);
      } else {
        throw new Error("Failed to fetch events");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong while fetching events");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteEvent = async (id: number) => {
    try {
      const response = await newsService.deleteEvent(id);
      if (response.success) {
        setEvents((prev) => prev.filter((item) => item.id !== id));
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const toggleStatus = async (id: number) => {
    try {
      const response = await newsService.toggleStatus(id);
      if (response.success) {
        setEvents((prev) => 
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

  const saveEvent = async (id: number | null, formData: FormData) => {
    try {
      const response = id 
        ? await newsService.updateEvent(id, formData)
        : await newsService.createEvent(formData);
      
      if (response.success) {
        fetchEvents(); // Refresh list to get proper state
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    isLoading,
    error,
    totalRecords,
    refresh: fetchEvents,
    deleteEvent,
    toggleStatus,
    saveEvent
  };
}
