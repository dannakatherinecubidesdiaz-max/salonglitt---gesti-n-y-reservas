import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  Sparkles, 
  Plus, 
  Scissors, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight, 
  User, 
  Lock,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useAppointments } from '@/hooks/useAppointments';
import { useToast } from '@/context/ToastContext';
import { validateBR02 } from '@/lib/dataStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Appointment } from '@/types';

interface ClientMyAppointmentsPageProps {
  onNavigate: (viewId: string, extraData?: any) => void;
}

export const ClientMyAppointmentsPage: React.FC<ClientMyAppointmentsPageProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const { appointments, cancelAppointment, isLoading } = useAppointments();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<'ALL' | 'UPCOMING' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelModalApt, setCancelModalApt] = useState<Appointment | null>(null);

  // Strict client data isolation: ONLY appointments belonging to the current authenticated client
  const myAppointments = useMemo(() => {
    if (!currentUser) return [];
    return appointments.filter(a => a.client_id === currentUser.id);
  }, [appointments, currentUser]);

  const filteredAppointments = useMemo(() => {
    const now = new Date();
    return myAppointments.filter(apt => {
      const aptDate = new Date(apt.appointment_date);
      if (activeTab === 'UPCOMING') {
        return apt.status !== 'CANCELLED' && apt.status !== 'COMPLETED' && aptDate >= now;
      }
      if (activeTab === 'COMPLETED') {
        return apt.status === 'COMPLETED' || (aptDate < now && apt.status !== 'CANCELLED');
      }
      if (activeTab === 'CANCELLED') {
        return apt.status === 'CANCELLED';
      }
      return true;
    });
  }, [myAppointments, activeTab]);

  const handleOpenCancelModal = (apt: Appointment) => {
    const check = validateBR02(new Date(apt.appointment_date));
    if (!check.canCancel) {
      toast.error('Restricción Política BR-02', check.message || 'No se puede cancelar con menos de 24h de anticipación.');
      return;
    }
    setCancelModalApt(apt);
  };

  const handleConfirmCancel = () => {
    if (!cancelModalApt) return;
    setCancellingId(cancelModalApt.id);
    const ok = cancelAppointment(cancelModalApt.id, currentUser?.full_name || 'Cliente');
    setCancellingId(null);
    if (ok) {
      setCancelModalApt(null);
    }
  };

  const renderStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#38E54D]/15 text-[#38E54D] border border-[#38E54D]/40 shadow-[0_0_10px_rgba(56,229,77,0.2)] flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Confirmada
          </span>
        );
      case 'PENDING':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#FFD670]/15 text-[#FFD670] border border-[#FFD670]/40 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Pendiente
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#70D6FF]/15 text-[#70D6FF] border border-[#70D6FF]/40 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Atendida
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#FF4B4B]/15 text-[#FF4B4B] border border-[#FF4B4B]/40 flex items-center gap-1">
            <XCircle className="w-3 h-3" /> Cancelada
          </span>
        );
    }
  };

  return (
    <div id="scr-client-appointments" className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Top Header & Navigation Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 p-1 bg-[#1E1332] rounded-full border border-[#FF70A6]/30 w-fit">
          <button
            onClick={() => onNavigate('services')}
            className="px-5 py-2 rounded-full text-xs sm:text-sm font-heading font-semibold text-[#C8B6E2] hover:text-white transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#FF70A6]" />
            <span>Catálogo de Servicios</span>
          </button>
          <button
            className="px-5 py-2 rounded-full text-xs sm:text-sm font-heading font-bold bg-gradient-to-r from-[#FF70A6] to-[#70D6FF] text-[#120B1C] shadow-[0_2px_12px_rgba(255,112,166,0.4)] flex items-center gap-2"
          >
            <Calendar className="w-4 h-4 text-[#120B1C]" />
            <span>Mis Citas ({myAppointments.length})</span>
          </button>
        </div>

        <Button
          variant="bubble"
          size="sm"
          onClick={() => onNavigate('services')}
          className="text-xs self-start sm:self-center text-[#FF70A6] border-[#FF70A6]/40 hover:bg-[#FF70A6]/10"
        >
          <Sparkles className="w-3.5 h-3.5 mr-1.5" />
          Ver Catálogo Completo
        </Button>
      </div>

      {/* Top Banner: Welcome & Privacy Commitment */}
      <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-[#2A1B45] via-[#1E1332] to-[#120B1C] border border-[#FF70A6]/30 p-6 sm:p-8 shadow-[0_10px_35px_rgba(255,112,166,0.15)]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF70A6]/20 border border-[#FF70A6]/40 text-[#FF70A6] text-xs font-mono font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Portal Cliente VIP • SalonGlitt
            </div>
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">
              ¡Hola, {currentUser?.full_name || 'Bella'}! ✦
            </h1>
            <p className="text-xs sm:text-sm text-[#C8B6E2] max-w-xl mt-1">
              Consulta el estado de tus citas, historial de servicios de belleza y agenda tu próximo cambio de look con tu estilista favorita.
            </p>

            <div className="mt-4 flex items-center gap-2 text-[11px] text-[#38E54D] bg-[#38E54D]/10 px-3 py-1.5 rounded-full border border-[#38E54D]/30 w-fit">
              <Lock className="w-3.5 h-3.5" />
              <span>Privacidad Activa: Solo tú tienes acceso a tus citas y datos personales.</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Button
              variant="pink"
              size="lg"
              sparkle
              icon={<Sparkles className="w-4 h-4" />}
              onClick={() => onNavigate('services')}
              className="shadow-[0_4px_20px_rgba(255,112,166,0.4)]"
            >
              Ver Catálogo ✦
            </Button>
            <Button
              variant="bubble"
              size="lg"
              icon={<User className="w-4 h-4 text-[#70D6FF]" />}
              onClick={() => onNavigate('profile')}
            >
              Mi Perfil
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex p-1 bg-[#1E1332] rounded-full border border-white/10">
          {[
            { id: 'ALL', label: `Todas (${myAppointments.length})` },
            { id: 'UPCOMING', label: 'Próximas' },
            { id: 'COMPLETED', label: 'Completadas' },
            { id: 'CANCELLED', label: 'Canceladas' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-4 py-2 rounded-full text-xs font-heading font-semibold transition-all ${
                activeTab === t.id
                  ? 'bg-gradient-to-r from-[#FF70A6] to-[#70D6FF] text-[#120B1C] shadow-[0_2px_12px_rgba(255,112,166,0.4)]'
                  : 'text-[#C8B6E2] hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-[#C8B6E2]">
          Mostrando {filteredAppointments.length} de {myAppointments.length} citas
        </span>
      </div>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <Card bubble glow="pink" className="p-12 text-center space-y-4 border-[#FF70A6]/30">
          <div className="w-16 h-16 rounded-full bg-[#FF70A6]/10 text-[#FF70A6] mx-auto flex items-center justify-center text-3xl border border-[#FF70A6]/30">
            ✦
          </div>
          <h3 className="font-heading font-black text-xl text-white">
            {activeTab === 'ALL'
              ? 'No tienes citas agendadas aún'
              : `No tienes citas en la pestaña "${activeTab.toLowerCase()}"`}
          </h3>
          <p className="text-xs sm:text-sm text-[#C8B6E2] max-w-md mx-auto">
            Explora nuestro menú de Balayage, Manicura Rusa o Cortes Y2K y reserva tu cita con disponibilidad en tiempo real.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="pink"
              size="md"
              sparkle
              icon={<Sparkles className="w-4 h-4" />}
              onClick={() => onNavigate('services')}
            >
              Explorar Catálogo de Servicios ✦
            </Button>
            <Button
              variant="bubble"
              size="md"
              icon={<Plus className="w-4 h-4 text-[#70D6FF]" />}
              onClick={() => onNavigate('wizard')}
            >
              Agendar Cita Directa
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map(apt => {
            const aptDate = new Date(apt.appointment_date);
            const br02Check = validateBR02(aptDate);
            const isCancelable = apt.status === 'CONFIRMED' || apt.status === 'PENDING';

            return (
              <Card
                key={apt.id}
                bubble
                className="p-5 sm:p-6 border-white/10 hover:border-[#FF70A6]/40 transition-all group relative overflow-hidden"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Left: Date & Service Info */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {/* Date Block */}
                    <div className="p-3.5 rounded-[22px] bg-[#120B1C] border border-[#FF70A6]/40 text-center min-w-[85px] shadow-[0_4px_15px_rgba(255,112,166,0.2)]">
                      <span className="text-[10px] uppercase font-mono font-bold text-[#FF70A6] block">
                        {aptDate.toLocaleDateString('es-CO', { weekday: 'short' })}
                      </span>
                      <span className="text-2xl font-heading font-black text-white block my-0.5">
                        {aptDate.getDate()}
                      </span>
                      <span className="text-[10px] font-mono text-[#70D6FF] uppercase block">
                        {aptDate.toLocaleDateString('es-CO', { month: 'short' })}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#70D6FF]/15 text-[#70D6FF] border border-[#70D6FF]/30 font-mono font-semibold">
                          {apt.service?.category || 'Servicio'}
                        </span>
                        {renderStatusBadge(apt.status)}
                      </div>

                      <h3 className="font-heading font-black text-lg text-white group-hover:text-[#FF70A6] transition-colors">
                        {apt.service?.name}
                      </h3>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#C8B6E2]">
                        <span className="flex items-center gap-1 font-mono text-white">
                          <Clock className="w-3.5 h-3.5 text-[#FFD670]" />
                          {aptDate.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: true })}
                        </span>
                        <span>•</span>
                        <span>Duración: {apt.service?.duration_minutes} min</span>
                        <span>•</span>
                        <span className="font-bold text-[#FF70A6]">
                          ${apt.service?.price.toLocaleString('es-CO')} COP
                        </span>
                      </div>

                      {apt.notes && (
                        <p className="text-xs text-[#C8B6E2]/80 italic pt-1 line-clamp-1">
                          "{apt.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Stylist info & Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between lg:justify-end gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-white/10">
                    {/* Stylist Pill */}
                    {apt.stylist && (
                      <div className="flex items-center gap-2.5 p-2 rounded-full bg-[#120B1C] border border-white/10 pr-3.5">
                        {apt.stylist.avatar_url ? (
                          <img
                            src={apt.stylist.avatar_url}
                            alt={apt.stylist.full_name}
                            className="w-8 h-8 rounded-full object-cover border border-[#70D6FF]"
                            referrerPolicy="no-referrer"
                            onError={e => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80';
                            }}
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[#2A1B45] text-[#70D6FF] flex items-center justify-center font-bold text-xs">
                            {apt.stylist.full_name.charAt(0)}
                          </div>
                        )}
                        <div className="text-left">
                          <span className="text-[10px] text-[#C8B6E2] block leading-none">Estilista Pro</span>
                          <span className="text-xs font-bold text-white block mt-0.5">{apt.stylist.full_name}</span>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="bubble"
                        size="sm"
                        onClick={() => onNavigate('detail360', { appointmentId: apt.id })}
                      >
                        Ver Voucher ✦
                      </Button>

                      {isCancelable && (
                        br02Check.canCancel ? (
                          <Button
                            variant="bubble"
                            size="sm"
                            onClick={() => handleOpenCancelModal(apt)}
                            className="text-[#FF4B4B] hover:bg-[#FF4B4B]/10 hover:border-[#FF4B4B]"
                          >
                            Cancelar
                          </Button>
                        ) : (
                          <div 
                            className="text-[11px] font-mono text-gray-500 bg-black/40 px-2.5 py-1.5 rounded-full border border-gray-800 flex items-center gap-1 cursor-help"
                            title={br02Check.message}
                          >
                            <Lock className="w-3 h-3 text-[#FFD670]" />
                            <span>Bloqueada (&lt;24h)</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal de Cancelación con Confirmación */}
      {cancelModalApt && (
        <div className="fixed inset-0 z-50 bg-[#120B1C]/80 backdrop-blur-md flex items-center justify-center p-4">
          <Card bubble glow="pink" className="w-full max-w-md p-6 border-[#FF4B4B]/50 space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#FF4B4B]/20 text-[#FF4B4B] flex items-center justify-center mx-auto border border-[#FF4B4B]/40">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="font-heading font-black text-xl text-white">¿Cancelar esta Cita?</h3>
              <p className="text-xs text-[#C8B6E2] mt-1">
                Servicio: <strong className="text-white">{cancelModalApt.service?.name}</strong> con {cancelModalApt.stylist?.full_name}.
              </p>
              <p className="text-xs text-[#38E54D] mt-2 font-mono">
                ✦ Cumples la política BR-02: Se liberará el turno y te enviaremos comprobante de cancelación a tu WhatsApp/Correo.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="bubble"
                size="md"
                className="flex-1"
                onClick={() => setCancelModalApt(null)}
              >
                Mantener mi Cita
              </Button>
              <Button
                variant="pink"
                size="md"
                className="flex-1 bg-gradient-to-r from-[#FF4B4B] to-[#FF2A6D]"
                disabled={cancellingId !== null}
                onClick={handleConfirmCancel}
              >
                {cancellingId ? 'Cancelando...' : 'Sí, Cancelar'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ClientMyAppointmentsPage;
