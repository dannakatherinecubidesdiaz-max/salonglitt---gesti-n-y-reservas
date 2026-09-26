import React from 'react';
import { Appointment } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { validateBR02 } from '@/lib/dataStore';
import { Eye, XCircle, Clock, Scissors, User } from 'lucide-react';

interface AppointmentTableProps {
  appointments: Appointment[];
  onSelect: (apt: Appointment) => void;
  onCancel: (apt: Appointment) => void;
}

export const AppointmentTable: React.FC<AppointmentTableProps> = ({
  appointments,
  onSelect,
  onCancel,
}) => {
  return (
    <div className="w-full overflow-x-auto rounded-[20px] border border-[#FF70A6]/20 bg-[#120B1C]/80">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="border-b border-[#FF70A6]/20 bg-[#1E1332] text-[#C8B6E2] uppercase font-mono tracking-wider">
            <th className="py-3.5 px-4">Código / Cliente</th>
            <th className="py-3.5 px-4">Servicio</th>
            <th className="py-3.5 px-4">Estilista</th>
            <th className="py-3.5 px-4">Fecha & Hora</th>
            <th className="py-3.5 px-4">Estado</th>
            <th className="py-3.5 px-4 text-center">Regla BR-02</th>
            <th className="py-3.5 px-4 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {appointments.map(apt => {
            const dateObj = new Date(apt.appointment_date);
            const br02 = validateBR02(dateObj);
            const isCancelled = apt.status === 'CANCELLED';

            return (
              <tr
                key={apt.id}
                className="hover:bg-[#1E1332]/60 transition-colors group cursor-pointer"
                onClick={() => onSelect(apt)}
              >
                {/* Cliente */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#FF70A6]/20 border border-[#FF70A6]/50 flex items-center justify-center font-bold text-[#FF70A6] shrink-0">
                      {apt.client?.full_name?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <span className="font-heading font-bold text-white group-hover:text-[#FF70A6] transition-colors block">
                        {apt.client?.full_name || 'Cliente'}
                      </span>
                      <span className="text-[10px] text-[#C8B6E2]/70 font-mono">
                        #{apt.id}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Servicio */}
                <td className="py-3.5 px-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-white">
                      {apt.service?.name || 'Servicio'}
                    </span>
                    <span className="text-[10px] text-[#70D6FF] font-mono">
                      ${apt.service?.price.toLocaleString('es-CO')} COP • {apt.service?.duration_minutes} min
                    </span>
                  </div>
                </td>

                {/* Estilista */}
                <td className="py-3.5 px-4">
                  <span className="text-white flex items-center gap-1.5 font-medium">
                    <Scissors className="w-3.5 h-3.5 text-[#FFD670]" />
                    {apt.stylist?.full_name || 'Estilista Asignado'}
                  </span>
                </td>

                {/* Fecha & Hora */}
                <td className="py-3.5 px-4">
                  <div className="flex flex-col font-mono text-[11px]">
                    <span className="text-white font-semibold">
                      {dateObj.toLocaleDateString('es-CO', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="text-[#C8B6E2] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#70D6FF]" />
                      {dateObj.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </td>

                {/* Estado */}
                <td className="py-3.5 px-4">
                  <Badge status={apt.status} size="sm">
                    {apt.status}
                  </Badge>
                </td>

                {/* BR-02 Status Column */}
                <td className="py-3.5 px-4 text-center">
                  {isCancelled ? (
                    <span className="text-[10px] text-[#C8B6E2] font-mono">
                      Ya Cancelada
                    </span>
                  ) : br02.canCancel ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#38E54D]/15 text-[#38E54D] border border-[#38E54D]/30">
                      ✓ Cancelable ({br02.hoursRemaining}h)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#FF4B4B]/15 text-[#FF4B4B] border border-[#FF4B4B]/30" title="BR-02: Requiere más de 24h de anticipación">
                      🔒 Bloqueado (&lt;24h)
                    </span>
                  )}
                </td>

                {/* Acciones */}
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-2" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => onSelect(apt)}
                      className="p-1.5 rounded-full text-[#70D6FF] hover:bg-[#70D6FF]/10 transition-colors"
                      title="Ver Detalle 360°"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onCancel(apt)}
                      disabled={isCancelled || !br02.canCancel}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all ${
                        isCancelled
                          ? 'opacity-30 cursor-not-allowed text-gray-400'
                          : br02.canCancel
                          ? 'bg-[#FF4B4B]/20 text-[#FF4B4B] hover:bg-[#FF4B4B] hover:text-white border border-[#FF4B4B]/40'
                          : 'opacity-40 cursor-not-allowed bg-gray-800 text-gray-400 border border-gray-700'
                      }`}
                      title={
                        isCancelled
                          ? 'Cita ya cancelada'
                          : br02.canCancel
                          ? 'Cancelar cita (cumple política > 24h)'
                          : br02.message
                      }
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>{isCancelled ? 'Cancelada' : 'Cancelar'}</span>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentTable;
