import { useState, useEffect, useCallback } from 'react';
import { Profile, StylistSchedule } from '../types';
import { dataStore } from '../lib/dataStore';

export function useStylists() {
  const [stylists, setStylists] = useState<Profile[]>([]);
  const [schedules, setSchedules] = useState<StylistSchedule[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchStylistsData = useCallback(async () => {
    setIsLoading(true);
    try {
      const list = dataStore.getStylists();
      const scheds = dataStore.getSchedules();
      setStylists(list);
      setSchedules(scheds);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStylistsData();
  }, [fetchStylistsData]);

  const getStylistSchedule = (stylistId: string) => {
    return schedules.filter(s => s.stylist_id === stylistId);
  };

  const getStylistById = (stylistId: string) => {
    return stylists.find(s => s.id === stylistId);
  };

  return {
    stylists,
    schedules,
    isLoading,
    getStylistSchedule,
    getStylistById,
    refreshStylists: fetchStylistsData,
  };
}

export default useStylists;
