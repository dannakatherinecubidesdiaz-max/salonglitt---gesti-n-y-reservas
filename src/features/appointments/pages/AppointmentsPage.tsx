import React, { useState, useMemo } from 'react';
import { 
  Table as TableIcon, 
  Kanban as KanbanIcon, 
  Search, 
  Filter, 
  Plus, 
  Sparkles, 
  AlertCircle,
  RefreshCw,
  Calendar
} from 'lucide-react';
import { useAppointments } from '@/hooks/useAppointments';
import { AppointmentTable } from '../components/AppointmentTable';
import { AppointmentKanban } from '../components/AppointmentKanban';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { AlertBanner } from '@/components/ui/AlertBanner';
import { Appointment, AppointmentStatus } from '@/types';
import { validateBR02 } from '@/lib/dataStore';

interface AppointmentsPageProps {
  onNavigate: (viewId: string, extraData?: any) => void;
}

export const AppointmentsPage: React.FC<AppointmentsPageProps> = ({ onNavigate }) => {
  const { appointments, isLoading, error, cancelAppointment, updateStatus, refreshAppointments } = useAppointments();
  
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedForCancel, setSelectedForCancel] = useState<Appointment | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);

  // Filtered appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      const matchSearch =
        apt.client?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.service?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.stylist?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === 'ALL' || apt.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [appointments, searchQuery, statusFilter]);

  const handleSelectAppointment = (apt: Appointment) => {
    onNavigate('detail360', { appointmentId: apt.id });
  };

  const handlePromptCancel = (apt: Appointment) => {
    const br02 = validateBR02(new Date(apt.appointment_date));
    if (!br02.canCancel) {
      setCancelError(br02.message || 'No se puede cancelar a menos de 24h de la cita.');
      setSelectedForCancel(null);
      return;
    }
    setCancelError(null);
    setSelectedForCancel(apt);
  };

  const handleConfirmCancel = () => {
    if (!selectedForCancel) return;
    const ok = cancelAppointment(selectedForCancel.id, 'Consola Administrador');
    if (ok) {
      setSelectedForCancel(null);
    }
  };

  return (
    <div id="scr-03-appointments-page" className="space-y-6 pb-12">
      {/* Header with Title & Top Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#FF70A6] animate-twinkle">✦</span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#70D6FF]">
              Gestión Operativa • SCR-03
            </span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white mt-1">
            Explorador CRUD de Citas
          </h1>
          <p className="text-xs sm:text-sm text-[#C8B6E2] mt-0.5">
            Supervisa, cancela con regla BR-02 (&gt;24h) y actualiza el estado de las citas en vivo.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="bubble"
            size="sm"
            icon={<RefreshCw className="w-3.5 h-3.5" />}
            onClick={refreshAppointments}
            title="Refrescar datos"
          >
            Actualizar
          </Button>

          <Button
            variant="pink"
            size="md"
            sparkle
            icon={<Plus className="w-4 h-4" />}
            onClick={() => onNavigate('wizard')}
            className="shadow-[0_4px_16px_rgba(255,112,166,0.35)]"
            id="btn-nueva-cita"
          >
            + Crear Cita
          </Button>
        </div>
      </div>

      {/* Error Alert Banner (State 4) */}
      {(error || cancelError) && (
        <AlertBanner
          type="error"
          ruleCode="BR-02"
          title="Restricción de Cancelación"
          message={cancelError || error || ''}
          onClose={() => setCancelError(null)}
        />
      )}

      {/* Toolbar: Search, Filter, View Switcher */}
      <div className="p-4 rounded-[22px] bg-[#1E1332] border border-[#FF70A6]/30 flex flex-col md:flex-row items-center justify-between gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
        {/* Search */}
        <div className="w-full md:w-80">
          <Input
            placeholder="Buscar por cliente, estilista o servicio..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>

        {/* Filter Pills & Switcher */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end flex-wrap">
          {/* Status Select */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#C8B6E2] hidden sm:inline font-mono">Estado:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-[#120B1C] text-white border border-[#FF70A6]/30 rounded-full px-3 py-2 text-xs outline-none focus:border-[#FF70A6]"
            >
              <option value="ALL">Todos los Estados</option>
              <option value="CONFIRMED">Confirmadas</option>
              <option value="PENDING">Pendientes</option>
              <option value="COMPLETED">Completadas</option>
              <option value="CANCELLED">Canceladas</option>
            </select>
          </div>

          {/* Switcher View: Table vs Kanban */}
          <div className="flex items-center p-1 bg-[#120B1C] rounded-full border border-[#FF70A6]/30">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                viewMode === 'table'
                  ? 'bg-[#FF70A6] text-white shadow-[0_0_10px_rgba(255,112,166,0.4)]'
                  : 'text-[#C8B6E2] hover:text-white'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Tabla</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                viewMode === 'kanban'
                  ? 'bg-[#70D6FF] text-[#120B1C] shadow-[0_0_10px_rgba(112,214,255,0.4)]'
                  : 'text-[#C8B6E2] hover:text-white'
              }`}
            >
              <KanbanIcon className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main View Area with UI States */}
      {isLoading ? (
        /* State 3: Loading Skeleton */
        <TableSkeleton rows={6} />
      ) : filteredAppointments.length === 0 ? (
        /* State 2: Empty State */
        <EmptyState
          title="Sin citas registradas"
          description={
            searchQuery || statusFilter !== 'ALL'
              ? 'No hay registros que coincidan con los filtros aplicados. Prueba cambiando los términos de búsqueda.'
              : 'Aún no se han agendado citas en el sistema. Puedes crear una nueva reserva con el wizard.'
          }
          actionText="+ Crear Cita Ahora"
          onAction={() => onNavigate('wizard')}
        />
      ) : viewMode === 'table' ? (
        /* State 1: Success State (Table) */
        <AppointmentTable
          appointments={filteredAppointments}
          onSelect={handleSelectAppointment}
          onCancel={handlePromptCancel}
        />
      ) : (
        /* State 1: Success State (Kanban) */
        <AppointmentKanban
          appointments={filteredAppointments}
          onSelect={handleSelectAppointment}
          onUpdateStatus={(id, st) => updateStatus(id, st)}
          onCancel={handlePromptCancel}
        />
      )}

      {/* Cancellation Modal Dialog */}
      {selectedForCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md p-6 rounded-[24px] bg-gradient-to-br from-[#2A1B45] to-[#1E1332] border border-[#FF4B4B]/50 shadow-[0_15px_40px_rgba(255,75,75,0.3)]">
            <div className="flex items-center gap-2.5 text-[#FF4B4B] mb-3">
              <AlertCircle className="w-6 h-6" />
              <h3 className="font-heading font-bold text-lg text-white">
                Confirmar Cancelación
              </h3>
            </div>

            <p className="text-xs text-[#C8B6E2] leading-relaxed mb-4">
              ¿Estás segura de cancelar la cita <strong className="text-white">#{selectedForCancel.id}</strong> de <strong className="text-[#FF70A6]">{selectedForCancel.client?.full_name}</strong>?
            </p>

            <div className="p-3 rounded-[16px] bg-[#120B1C]/80 border border-white/10 text-xs text-[#C8B6E2] mb-5 space-y-1 font-mono">
              <div>Servicio: {selectedForCancel.service?.name}</div>
              <div>Estilista: {selectedForCancel.stylist?.full_name}</div>
              <div>Fecha: {new Date(selectedForCancel.appointment_date).toLocaleString('es-CO')}</div>
              <div className="text-[#38E54D] pt-1">✓ Cumple Política BR-02 (&gt;24 horas previas)</div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="bubble"
                size="sm"
                onClick={() => setSelectedForCancel(null)}
              >
                Volver
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleConfirmCancel}
              >
                Confirmar Cancelación
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsPage;
