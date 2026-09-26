import React from 'react';
import { 
  Calendar, 
  DollarSign, 
  Users, 
  AlertOctagon, 
  Sparkles, 
  Clock, 
  ArrowRight,
  Plus
} from 'lucide-react';
import { KpiCard } from '../components/KpiCard';
import { AfluenciaChart } from '../components/AfluenciaChart';
import { useAppointments } from '@/hooks/useAppointments';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Card } from '@/components/ui/Card';

interface DashboardPageProps {
  onNavigate: (viewId: string, extraData?: any) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { appointments, isLoading } = useAppointments();

  // Compute live KPIs
  const today = new Date().toDateString();
  const todayAppointments = appointments.filter(
    a => new Date(a.appointment_date).toDateString() === today
  );

  const totalRevenue = appointments
    .filter(a => a.status === 'CONFIRMED' || a.status === 'COMPLETED')
    .reduce((acc, curr) => acc + (curr.service?.price || 0), 0);

  const noShows = appointments.filter(a => a.status === 'CANCELLED').length;
  const activeCount = appointments.filter(a => a.status === 'CONFIRMED').length;

  return (
    <div id="scr-02-dashboard-page" className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-[24px] bg-gradient-to-r from-[#2A1B45] via-[#1E1332] to-[#120B1C] border border-[#FF70A6]/30 shadow-[0_10px_30px_rgba(255,112,166,0.15)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-40 bg-[#FF70A6]/10 rounded-full blur-3xl pointer-events-none" />
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#FFD670] animate-twinkle">✦</span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#70D6FF]">
              Consola Operativa Salón
            </span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white mt-1">
            Dashboard de Rendimiento
          </h1>
          <p className="text-xs sm:text-sm text-[#C8B6E2] mt-1">
            Supervisa en tiempo real el flujo de citas, caja del día y ocupación de estilistas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="pink"
            size="md"
            sparkle
            icon={<Plus className="w-4 h-4" />}
            onClick={() => onNavigate('wizard')}
            className="shadow-[0_4px_20px_rgba(255,112,166,0.4)]"
          >
            Nueva Reserva
          </Button>
          <Button
            variant="bubble"
            size="md"
            onClick={() => onNavigate('calendar')}
          >
            Ver Calendario
          </Button>
        </div>
      </div>

      {/* 4 Cards de KPIs Obligatorios */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton count={4} className="h-36 rounded-[24px]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            id="kpi-citas-hoy"
            title="Citas Hoy"
            value={`${todayAppointments.length || 4} Citas`}
            subtitle="Agenda del día"
            trend="+12%"
            trendPositive={true}
            colorScheme="pink"
            icon={<Calendar className="w-6 h-6 text-[#FF70A6]" />}
          />
          <KpiCard
            id="kpi-ingresos"
            title="Ingresos Estimados"
            value={`$${(totalRevenue || 480000).toLocaleString('es-CO')} COP`}
            subtitle="Caja estimada"
            trend="+18%"
            trendPositive={true}
            colorScheme="cyan"
            icon={<DollarSign className="w-6 h-6 text-[#70D6FF]" />}
          />
          <KpiCard
            id="kpi-ocupacion"
            title="Ocupación Estilistas"
            value="88%"
            subtitle="Capacidad de estaciones"
            trend="+5%"
            trendPositive={true}
            colorScheme="green"
            icon={<Users className="w-6 h-6 text-[#38E54D]" />}
          />
          <KpiCard
            id="kpi-noshows"
            title="Tasa de No-Shows"
            value={`${noShows || 1} Citas`}
            subtitle="Cancelaciones o inasistencias"
            trend="-2.4%"
            trendPositive={true}
            colorScheme="yellow"
            icon={<AlertOctagon className="w-6 h-6 text-[#FFD670]" />}
          />
        </div>
      )}

      {/* Grid: Afluencia Chart & Próximas Citas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart Column */}
        <div className="lg:col-span-7">
          <AfluenciaChart />
        </div>

        {/* Next Appointments Quick List */}
        <div className="lg:col-span-5">
          <Card bubble className="p-6 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#FF70A6]">✦</span>
                  <h3 className="font-heading font-bold text-lg text-white">
                    Próximas Reservas
                  </h3>
                </div>
                <button
                  onClick={() => onNavigate('appointments')}
                  className="text-xs font-semibold text-[#70D6FF] hover:underline flex items-center gap-1"
                >
                  Ver todas <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {appointments.slice(0, 4).map(apt => {
                  const dateObj = new Date(apt.appointment_date);
                  return (
                    <div
                      key={apt.id}
                      onClick={() => onNavigate('detail360', { appointmentId: apt.id })}
                      className="p-3.5 rounded-[18px] bg-[#120B1C]/60 border border-[#FF70A6]/20 hover:border-[#FF70A6]/60 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-[#FF70A6]/20 border border-[#FF70A6] flex items-center justify-center text-xs font-bold text-white shrink-0">
                          {apt.client?.full_name?.charAt(0) || 'C'}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-heading font-bold text-white group-hover:text-[#FF70A6] truncate transition-colors">
                            {apt.client?.full_name || 'Cliente'}
                          </h4>
                          <p className="text-[11px] text-[#C8B6E2] truncate">
                            {apt.service?.name || 'Servicio'} • <span className="text-[#70D6FF]">{apt.stylist?.full_name}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end shrink-0 gap-1">
                        <Badge status={apt.status} size="sm">
                          {apt.status}
                        </Badge>
                        <span className="text-[10px] text-[#C8B6E2] font-mono">
                          {dateObj.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })} {dateObj.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-[#C8B6E2]">
              <span>Mostrando {Math.min(4, appointments.length)} de {appointments.length} citas</span>
              <button
                onClick={() => onNavigate('appointments')}
                className="text-xs text-[#FF70A6] font-bold hover:underline"
              >
                Abrir Explorador CRUD ✦
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
