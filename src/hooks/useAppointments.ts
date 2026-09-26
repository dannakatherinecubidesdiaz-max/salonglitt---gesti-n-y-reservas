import { useState, useEffect, useCallback } from 'react';
import { Appointment } from '../types';
import { dataStore } from '../lib/dataStore';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();
  const { currentUser, currentRole } = useAuth();

  const refreshAppointments = useCallback(() => {
    setIsLoading(true);
    setError(null);
    try {
      const clientId = currentRole === 'CLIENT' ? currentUser?.id ?? '' : undefined;
      const data = dataStore.getAppointments(clientId);
      setAppointments([...data]);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las citas');
    } finally {
      setIsLoading(false);
    }
  }, [currentRole, currentUser?.id]);

  useEffect(() => {
    refreshAppointments();
  }, [refreshAppointments]);

  const bookAppointment = async (params: {
    client_id: string;
    stylist_id: string;
    service_id: string;
    appointment_date: string;
    notes?: string;
  }) => {
    const res = await dataStore.createAppointment(params);
    if (!res.success) {
      toast.error('Restricción de Reserva', res.error);
      return { success: false, error: res.error };
    }
    toast.success('¡Cita Confirmada! ✦', 'Se han despachado tus notificaciones por WhatsApp y Correo (BR-03).');
    refreshAppointments();
    return { success: true, appointment: res.appointment };
  };

  const cancelAppointment = (id: string, cancelledBy = 'Usuario') => {
    const authorizedClientId = currentRole === 'CLIENT' ? currentUser?.id ?? '' : undefined;
    const res = dataStore.cancelAppointment(id, cancelledBy, authorizedClientId);
    if (!res.success) {
      toast.error('Política de Cancelación (BR-02)', res.error);
      return false;
    }
    toast.success('Cita Cancelada', 'Se ha liberado el horario y notificado a los canales registrados.');
    refreshAppointments();
    return true;
  };

  const updateStatus = (id: string, newStatus: Appointment['status'], updater = 'Admin') => {
    const ok = dataStore.updateAppointmentStatus(id, newStatus, updater);
    if (ok) {
      toast.info('Estado Actualizado', `La cita #${id} ahora está en estado ${newStatus}.`);
      refreshAppointments();
    }
    return ok;
  };

  return {
    appointments,
    isLoading,
    error,
    refreshAppointments,
    bookAppointment,
    cancelAppointment,
    updateStatus,
  };
}

export default useAppointments;
