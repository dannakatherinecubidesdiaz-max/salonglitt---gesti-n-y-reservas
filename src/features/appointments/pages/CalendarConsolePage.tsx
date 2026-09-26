import React, { useState, useMemo } from 'react';
import { useAppointments } from '@/hooks/useAppointments';
import { useStylists } from '@/hooks/useStylists';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Scissors, 
  Clock, 
  Sparkles,
  Plus
} from 'lucide-react';
import { Appointment } from '@/types';

interface CalendarConsolePageProps {
  onNavigate: (viewId: string, extraData?: any) => void;
}

const HOURS = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
];

export const CalendarConsolePage: React.FC<CalendarConsolePageProps> = ({ onNavigate }) => {
  const { appointments } = useAppointments();
  const { stylists } = useStylists();

  const [currentDate, setCurrentDate] = useState<Date>(() => {
    // Default to a date that has several appointments (e.g. today or +4 days)
    const d = new Date();
    return d;
  });

  const changeDay = (offset: number) => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + offset);
    setCurrentDate(next);
  };

  const setToday = () => {
    setCurrentDate(new Date());
  };

  // Filter appointments for selected day
  const dayAppointments = useMemo(() => {
    const dayStr = currentDate.toDateString();
    return appointments.filter(a => new Date(a.appointment_date).toDateString() === dayStr);
  }, [appointments, currentDate]);

  // Color theme helper based on service category
  const getServiceColor = (category?: string) => {
    switch (category) {
      case 'Corte/Barba':
        return {
          bg: 'bg-gradient-to-r from-[#FF70A6] to-[#FF4D8B]',
          border: 'border-[#FF70A6]',
          glow: 'shadow-[0_0_12px_rgba(255,112,166,0.5)]',
          badge: 'Rosa: Corte',
        };
      case 'Colorimetría':
        return {
          bg: 'bg-gradient-to-r from-[#70D6FF] to-[#38B6FF]',
          border: 'border-[#70D6FF]',
          glow: 'shadow-[0_0_12px_rgba(112,214,255,0.5)]',
          badge: 'Azul: Color',
        };
      case 'Manicura/Nails':
        return {
          bg: 'bg-gradient-to-r from-[#38E54D] to-[#20C035]',
          border: 'border-[#38E54D]',
          glow: 'shadow-[0_0_12px_rgba(56,229,77,0.5)]',
          badge: 'Verde: Nails',
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-[#FFD670] to-[#FFAA00]',
          border: 'border-[#FFD670]',
          glow: 'shadow-[0_0_12px_rgba(255,214,112,0.5)]',
          badge: 'Dorado: Spa',
        };
    }
  };

  return (
    <div id="scr-07-calendar-page" className="space-y-6 pb-12">
      {/* Header & Date Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-[24px] bg-[#1E1332] border border-[#FF70A6]/30 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#70D6FF] animate-twinkle">✦</span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF70A6]">
              Consola Multiestilista • SCR-07
            </span>
          </div>
          <h1 className="font-heading font-black text-2xl text-white mt-1">
            Matriz Horaria por Estaciones
          </h1>
          <p className="text-xs text-[#C8B6E2]">
            Visualiza en paralelo la disponibilidad de cada profesional y sus turnos activos.
          </p>
        </div>

        {/* Date Selector Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center bg-[#120B1C] rounded-full border border-[#FF70A6]/30 p-1">
            <button
              onClick={() => changeDay(-1)}
              className="p-1.5 rounded-full hover:bg-white/10 text-[#C8B6E2] hover:text-white transition-colors"
              title="Día Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="px-4 py-1 text-center min-w-[140px]">
              <span className="text-xs font-mono font-bold text-white block capitalize">
                {currentDate.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' })}
              </span>
            </div>
            <button
              onClick={() => changeDay(1)}
              className="p-1.5 rounded-full hover:bg-white/10 text-[#C8B6E2] hover:text-white transition-colors"
              title="Día Siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <Button
            variant="bubble"
            size="sm"
            onClick={setToday}
          >
            Hoy
          </Button>

          <Button
            variant="pink"
            size="sm"
            sparkle
            icon={<Plus className="w-4 h-4" />}
            onClick={() => onNavigate('wizard')}
          >
            Nueva Cita
          </Button>
        </div>
      </div>

      {/* Color Legend for Services */}
      <div className="flex items-center gap-4 flex-wrap p-3 rounded-[18px] bg-[#120B1C]/70 border border-white/10 text-xs">
        <span className="text-[#C8B6E2] font-semibold flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-[#FFD670]" /> Convención de Colores:
        </span>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#FF70A6] shadow-[0_0_8px_rgba(255,112,166,0.6)]" />
          <span className="text-white">Corte / Barbería Glam</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#70D6FF] shadow-[0_0_8px_rgba(112,214,255,0.6)]" />
          <span className="text-white">Colorimetría & Balayage</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#38E54D] shadow-[0_0_8px_rgba(56,229,77,0.6)]" />
          <span className="text-white">Manicura & Nails Art</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#FFD670] shadow-[0_0_8px_rgba(255,214,112,0.6)]" />
          <span className="text-white">Keratinas & Tratamientos</span>
        </div>
      </div>

      {/* Multistylist Grid Container */}
      <div className="w-full overflow-x-auto rounded-[24px] border border-[#FF70A6]/30 bg-[#1E1332] shadow-[0_10px_35px_rgba(0,0,0,0.4)]">
        <div className="min-w-[760px]">
          {/* Header Row: Stylists (Eje X) */}
          <div className="grid grid-cols-12 border-b border-[#FF70A6]/20 bg-[#120B1C]">
            <div className="col-span-2 p-4 text-center border-r border-[#FF70A6]/20 flex items-center justify-center font-mono font-bold text-xs text-[#C8B6E2]">
              <Clock className="w-4 h-4 mr-1 text-[#70D6FF]" /> HORA
            </div>

            {stylists.map(stylist => (
              <div
                key={stylist.id}
                className="col-span-3 p-3.5 border-r last:border-r-0 border-[#FF70A6]/20 flex items-center gap-3 justify-center"
              >
                <div className="w-9 h-9 rounded-full border border-[#FF70A6] overflow-hidden shrink-0 bg-[#2A1B45]">
                  {stylist.avatar_url ? (
                    <img
                      src={stylist.avatar_url}
                      alt={stylist.full_name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={e => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white font-bold text-xs">
                      {stylist.full_name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="text-left min-w-0">
                  <h4 className="font-heading font-bold text-xs text-white truncate">
                    {stylist.full_name}
                  </h4>
                  <span className="text-[10px] text-[#70D6FF] truncate block">
                    {stylist.specialty?.split(',')[0]}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Time Slots Rows (Eje Y: 09:00 a 19:00) */}
          <div className="relative divide-y divide-white/5">
            {/* Real-time Current Hour Neon Indicator Line (only if today) */}
            {currentDate.toDateString() === new Date().toDateString() && (
              <div
                style={{ top: '35%' }}
                className="absolute left-0 right-0 z-20 pointer-events-none flex items-center"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF70A6] shadow-[0_0_10px_#FF70A6]" />
                <div className="flex-1 h-[2px] bg-gradient-to-r from-[#FF70A6] via-[#FFD670] to-[#70D6FF] shadow-[0_0_8px_#FF70A6]" />
                <span className="text-[9px] font-mono font-bold bg-[#FF70A6] text-[#120B1C] px-1.5 py-0.5 rounded-full mr-2">
                  HORA ACTUAL
                </span>
              </div>
            )}

            {HOURS.map(hour => {
              const hourNumber = parseInt(hour.split(':')[0], 10);

              return (
                <div key={hour} className="grid grid-cols-12 min-h-[70px] group hover:bg-white/[0.02] transition-colors">
                  {/* Hour Label */}
                  <div className="col-span-2 p-2.5 border-r border-[#FF70A6]/10 flex items-center justify-center font-mono text-xs text-[#C8B6E2]/80 bg-[#120B1C]/40">
                    {hour}
                  </div>

                  {/* Stylist Columns for this hour */}
                  {stylists.map(stylist => {
                    // Match appointment for this stylist near this hour
                    const matchedApt = dayAppointments.find(apt => {
                      if (apt.stylist_id !== stylist.id) return false;
                      const aptDate = new Date(apt.appointment_date);
                      return aptDate.getHours() === hourNumber;
                    });

                    const color = matchedApt ? getServiceColor(matchedApt.service?.category) : null;

                    return (
                      <div
                        key={stylist.id}
                        className="col-span-3 p-1.5 border-r last:border-r-0 border-[#FF70A6]/10 flex items-center relative"
                      >
                        {matchedApt && color ? (
                          <div
                            onClick={() => onNavigate('detail360', { appointmentId: matchedApt.id })}
                            className={`w-full p-2 rounded-[14px] ${color.bg} ${color.border} ${color.glow} text-[#120B1C] font-semibold cursor-pointer hover:scale-[1.02] transition-all duration-200 z-10`}
                            title={`Cita #${matchedApt.id} - ${matchedApt.client?.full_name} (${matchedApt.service?.name})`}
                          >
                            <div className="flex items-center justify-between text-[10px] font-black tracking-wide">
                              <span className="truncate">{matchedApt.client?.full_name}</span>
                              <span className="font-mono">{hour}</span>
                            </div>
                            <div className="text-[10px] truncate opacity-90">
                              {matchedApt.service?.name}
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => onNavigate('wizard')}
                            className="w-full h-full rounded-[12px] opacity-0 hover:opacity-100 hover:bg-[#FF70A6]/10 border border-dashed border-[#FF70A6]/30 text-[#FF70A6] text-[10px] font-mono font-bold flex items-center justify-center gap-1 transition-opacity"
                          >
                            <span>+ Libre</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarConsolePage;
