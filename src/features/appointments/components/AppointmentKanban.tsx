import React from 'react';
import { Appointment, AppointmentStatus } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { validateBR02 } from '@/lib/dataStore';
import { Clock, Scissors, Calendar, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

interface AppointmentKanbanProps {
  appointments: Appointment[];
  onSelect: (apt: Appointment) => void;
  onUpdateStatus: (id: string, status: AppointmentStatus) => void;
  onCancel: (apt: Appointment) => void;
}

export const AppointmentKanban: React.FC<AppointmentKanbanProps> = ({
  appointments,
  onSelect,
  onUpdateStatus,
  onCancel,
}) => {
  const columns: { status: AppointmentStatus; label: string; color: string; countColor: string }[] = [
    { status: 'PENDING', label: 'Por Confirmar', color: 'border-[#70D6FF]', countColor: 'bg-[#70D6FF]/20 text-[#70D6FF]' },
    { status: 'CONFIRMED', label: 'Confirmadas', color: 'border-[#38E54D]', countColor: 'bg-[#38E54D]/20 text-[#38E54D]' },
    { status: 'COMPLETED', label: 'Completadas', color: 'border-[#FFD670]', countColor: 'bg-[#FFD670]/20 text-[#FFD670]' },
    { status: 'CANCELLED', label: 'Canceladas', color: 'border-[#FF4B4B]', countColor: 'bg-[#FF4B4B]/20 text-[#FF4B4B]' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {columns.map(col => {
        const colAppointments = appointments.filter(a => a.status === col.status);

        return (
          <div
            key={col.status}
            className="flex flex-col rounded-[22px] bg-[#1E1332]/70 border border-[#FF70A6]/20 p-3.5 min-h-[420px]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#FF70A6]">✦</span>
                <h4 className="font-heading font-bold text-sm text-white">{col.label}</h4>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${col.countColor}`}>
                {colAppointments.length}
              </span>
            </div>

            {/* Column Content */}
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-1">
              {colAppointments.length === 0 ? (
                <div className="h-32 flex flex-col items-center justify-center text-center p-4 border border-dashed border-white/10 rounded-[18px]">
                  <span className="text-xs text-[#C8B6E2]/60">Sin citas en este estado</span>
                </div>
              ) : (
                colAppointments.map(apt => {
                  const dateObj = new Date(apt.appointment_date);
                  const br02 = validateBR02(dateObj);

                  return (
                    <div
                      key={apt.id}
                      onClick={() => onSelect(apt)}
                      className="p-3.5 rounded-[18px] bg-gradient-to-br from-[#2A1B45] to-[#120B1C] border border-[#FF70A6]/30 hover:border-[#FF70A6] shadow-[0_4px_16px_rgba(0,0,0,0.3)] transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono text-[#70D6FF] font-bold">
                          #{apt.id}
                        </span>
                        <Badge status={apt.status} size="sm">
                          {apt.status}
                        </Badge>
                      </div>

                      <h5 className="font-heading font-bold text-sm text-white group-hover:text-[#FF70A6] transition-colors line-clamp-1">
                        {apt.client?.full_name || 'Cliente'}
                      </h5>

                      <p className="text-xs text-[#C8B6E2] mt-1 font-medium line-clamp-1">
                        {apt.service?.name}
                      </p>

                      <div className="mt-2.5 pt-2 border-t border-white/5 flex flex-col gap-1 text-[11px] text-[#C8B6E2]">
                        <div className="flex items-center gap-1.5">
                          <Scissors className="w-3 h-3 text-[#FFD670]" />
                          <span className="truncate">{apt.stylist?.full_name}</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-mono">
                          <Clock className="w-3 h-3 text-[#70D6FF]" />
                          <span>
                            {dateObj.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}{' '}
                            {dateObj.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>

                      {/* Card Action Controls */}
                      <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between gap-1" onClick={e => e.stopPropagation()}>
                        {col.status === 'PENDING' && (
                          <button
                            onClick={() => onUpdateStatus(apt.id, 'CONFIRMED')}
                            className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#38E54D]/20 text-[#38E54D] hover:bg-[#38E54D] hover:text-[#120B1C] transition-colors"
                          >
                            ✓ Confirmar
                          </button>
                        )}
                        {col.status === 'CONFIRMED' && (
                          <button
                            onClick={() => onUpdateStatus(apt.id, 'COMPLETED')}
                            className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#FFD670]/20 text-[#FFD670] hover:bg-[#FFD670] hover:text-[#120B1C] transition-colors"
                          >
                            ✓ Completar
                          </button>
                        )}

                        {apt.status !== 'CANCELLED' && (
                          <button
                            onClick={() => onCancel(apt)}
                            disabled={!br02.canCancel}
                            className={`px-2 py-1 rounded-full text-[10px] font-bold transition-colors ml-auto ${
                              br02.canCancel
                                ? 'bg-[#FF4B4B]/20 text-[#FF4B4B] hover:bg-[#FF4B4B] hover:text-white'
                                : 'opacity-40 cursor-not-allowed text-gray-500 bg-gray-800'
                            }`}
                            title={br02.canCancel ? 'Cancelar cita' : 'Bloqueado por regla BR-02 (<24h)'}
                          >
                            {br02.canCancel ? 'Cancelar' : '🔒 <24h'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AppointmentKanban;
