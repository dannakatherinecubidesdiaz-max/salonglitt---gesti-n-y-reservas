import { useState, useEffect, useCallback } from 'react';
import { Service } from '../types';
import { dataStore } from '../lib/dataStore';

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await dataStore.getServices();
      setServices(data);
    } catch (err: any) {
      setError(err.message || 'Error al obtener servicios');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const getServiceById = (id: string) => services.find(s => s.id === id);

  return {
    services,
    isLoading,
    error,
    refreshServices: fetchServices,
    getServiceById,
  };
}

export default useServices;
