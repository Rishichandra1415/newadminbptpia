import { useState, useEffect, useCallback } from "react";
import { masterService } from "../services/masterService";
import { StateEntry, CityEntry } from "../types";

export function useMasterData() {
  const [states, setStates] = useState<StateEntry[]>([]);
  const [cities, setCities] = useState<CityEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStates = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await masterService.getStates();
      if (response.success) {
        setStates(response.data);
      }
    } catch (err) {
      setError("Failed to fetch states");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCities = useCallback(async (stateId: number) => {
    setIsLoading(true);
    try {
      const response = await masterService.getCitiesByState(stateId);
      if (response.success) {
        setCities(response.data);
      }
    } catch (err) {
      setError("Failed to fetch cities");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAllCities = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await masterService.getAllCities();
      if (response.success) {
        setCities(response.data);
      }
    } catch (err) {
      setError("Failed to fetch all cities");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addState = async (name: string) => {
    try {
      const response = await masterService.createState({ name });
      if (response.success) {
        await fetchStates();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const removeState = async (id: number) => {
    try {
      const response = await masterService.deleteState(id);
      if (response.success) {
        await fetchStates();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const addCity = async (name: string, stateId: number) => {
    try {
      const response = await masterService.createCity({ name, stateId });
      if (response.success) {
        await fetchCities(stateId);
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const removeCity = async (id: number, stateId: number) => {
    try {
      const response = await masterService.deleteCity(id);
      if (response.success) {
        await fetchCities(stateId);
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  return {
    states,
    cities,
    isLoading,
    error,
    fetchStates,
    fetchCities,
    fetchAllCities,
    addState,
    removeState,
    addCity,
    removeCity
  };
}
