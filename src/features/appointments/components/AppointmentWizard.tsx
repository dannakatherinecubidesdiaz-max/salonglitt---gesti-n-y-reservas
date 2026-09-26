import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Scissors, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { useServices } from '@/hooks/useServices';
import { useStylists } from '@/hooks/useStylists';
import { useAppointments } from '@/hooks/useAppointments';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { AlertBanner } from '@/components/ui/AlertBanner';
import { Service, Profile } from '@/types';
import { dataStore, validateBR01 } from '@/lib/dataStore';

interface AppointmentWizardProps {
  onFinish: (newAptId: string) => void;
  onCancel: () => void;
  preselectedServiceId?: string;
}

const TIME_SLOTS = [
  '09:00',
  '10:30',
  '12:00',
  '14:00',
  '15:30',
  '17:00',
  '18:30',
];

export const AppointmentWizard: React.FC<AppointmentWizardProps> = ({ 
  onFinish, 
  onCancel,
  preselectedServiceId 
}) => {
  const { services, isLoading: loadingServices } = useServices();
  const { stylists } = useStylists();
  const { bookAppointment } = useAppointments();
  const { currentUser } = useAuth();
  const toast = useToast();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedStylist, setSelectedStylist] = useState<Profile | null>(null);
  const [selectedDateOffset, setSelectedDateOffset] = useState<number | null>(4); // Default to +4 days (within 3-7 days BR-01!)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('11:00');
  const [clientName, setClientName] = useState(currentUser?.full_name || '');
  const [clientEmail, setClientEmail] = useState(currentUser?.email || '');
  const [clientPhone, setClientPhone] = useState(currentUser?.phone || '');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [br01Error, setBr01Error] = useState<string | null>(null);

  // Handle preselected service from catalog
  React.useEffect(() => {
    if (preselectedServiceId && services.length > 0) {
      const found = services.find(s => s.id === preselectedServiceId);
      if (found) {
        setSelectedService(found);
        setStep(2);
      }
    }
  }, [preselectedServiceId, services]);

  // Generate 10 consecutive days starting today to visually demonstrate BR-01:
  // Days 0, 1, 2 disabled (Violates BR-01: <3 days)
  // Days 3, 4, 5, 6, 7 enabled (BR-01 Compliant!)
  // Days 8, 9 disabled (Violates BR-01: >7 days)
  const availableDays = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 9 }).map((_, offset) => {
      const d = new Date(today);
      d.setDate(today.getDate() + offset);

      const isValidBR01 = offset >= 3 && offset <= 7;
      let statusLabel = '';
      if (offset < 3) {
        statusLabel = 'Bloqueado (<3d)';
      } else if (offset > 7) {
        statusLabel = 'Bloqueado (>7d)';
      } else {
        statusLabel = 'Disponible ✦';
      }

      return {
        offset,
        date: d,
        isValidBR01,
        statusLabel,
        dayName: d.toLocaleDateString('es-CO', { weekday: 'short' }),
        dayNum: d.getDate(),
        monthName: d.toLocaleDateString('es-CO', { month: 'short' }),
      };
    });
  }, []);

  const selectedCalculatedDate = useMemo(() => {
    if (selectedDateOffset === null) return null;
    const d = new Date();
    d.setDate(d.getDate() + selectedDateOffset);
    const [hours, minutes] = selectedTimeSlot.split(':').map(Number);
    d.setHours(hours || 10, minutes || 0, 0, 0);
    return d;
  }, [selectedDateOffset, selectedTimeSlot]);

  // Check if a time slot is already booked for the selected stylist
  const isSlotOccupied = (slot: string) => {
    if (!selectedStylist || selectedDateOffset === null) return false;
    const d = new Date();
    d.setDate(d.getDate() + selectedDateOffset);
    const [hours, minutes] = slot.split(':').map(Number);
    d.setHours(hours || 10, minutes || 0, 0, 0);

    const duration = selectedService?.duration_minutes || 60;
    return !dataStore.isStylistAvailable(selectedStylist.id, d, duration);
  };

  // Step navigation
  const handleNextFromService = () => {
    if (!selectedService) {
      toast.warning('Selecciona un servicio', 'Por favor elige un servicio de la lista para continuar.');
      return;
    }
    setStep(2);
  };

  const handleNextFromSchedule = () => {
    if (!selectedStylist) {
      toast.warning('Selecciona un estilista', 'Por favor elige quién realizará tu atención.');
      return;
    }
    if (selectedDateOffset === null) {
      toast.warning('Selecciona una fecha', 'Debes elegir un día válido de agendamiento.');
      return;
    }

    if (selectedCalculatedDate) {
      const check = validateBR01(selectedCalculatedDate);
      if (!check.valid) {
        setBr01Error(check.message || 'Fecha fuera de ventana permitida');
        return;
      }

      // Validación de Disponibilidad y Horarios Dobles
      const duration = selectedService?.duration_minutes || 60;
      if (!dataStore.isStylistAvailable(selectedStylist.id, selectedCalculatedDate, duration)) {
        const errorMsg = 'El horario seleccionado ya no está disponible con este estilista. Por favor, elige otra hora u otro estilista.';
        setBr01Error(errorMsg);
        toast.error('Horario no disponible', errorMsg);
        return;
      }
    }

    setBr01Error(null);
    setStep(3);
  };

  const handleNextFromClientData = () => {
    if (!clientName.trim() || !clientEmail.trim()) {
      toast.error('Datos incompletos', 'Por favor ingresa tu nombre y correo electrónico.');
      return;
    }
    setStep(4);
  };

  const handleConfirmBooking = async () => {
    if (!currentUser || !selectedService || !selectedStylist || !selectedCalculatedDate) return;

    // Validación de Disponibilidad y Horarios Dobles previa a la confirmación
    const duration = selectedService.duration_minutes || 60;
    if (!dataStore.isStylistAvailable(selectedStylist.id, selectedCalculatedDate, duration)) {
      const errorMsg = 'El horario seleccionado ya no está disponible con este estilista. Por favor, elige otra hora u otro estilista.';
      setBr01Error(errorMsg);
      toast.error('Horario no disponible', errorMsg);
      return;
    }

    setSubmitting(true);
    setBr01Error(null);

    try {
      const res = await bookAppointment({
        client_id: currentUser.id,
        stylist_id: selectedStylist.id,
        service_id: selectedService.id,
        appointment_date: selectedCalculatedDate.toISOString(),
        notes,
      });

      if (res.success && res.appointment) {
        onFinish(res.appointment.id);
      } else {
        setBr01Error(res.error || 'No se pudo completar la reserva.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="scr-05-appointment-wizard" className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF70A6]/20 border border-[#FF70A6]/40 text-[#FF70A6] text-xs font-mono font-bold mb-2">
          <span>✦ SCR-05 • WIZARD Y2K</span>
        </div>
        <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">
          Agendamiento de Cita Glam
        </h1>
        <p className="text-xs sm:text-sm text-[#C8B6E2] max-w-lg mx-auto mt-1">
          Regla <strong className="text-[#FF70A6]">BR-01</strong> activa: Agendamiento permitido únicamente entre <strong className="text-white">3 días (72h)</strong> y <strong className="text-white">7 días (168h)</strong> en el futuro.
        </p>
      </div>

      {/* Stepper Header (1 -> 2 -> 3 -> 4) */}
      <div className="flex items-center justify-between max-w-2xl mx-auto px-4">
        {[
          { num: 1, label: 'Servicio' },
          { num: 2, label: 'Estilista & Fecha' },
          { num: 3, label: 'Mis Datos' },
          { num: 4, label: 'Confirmación' },
        ].map(s => {
          const isCurrent = step === s.num;
          const isPassed = step > s.num;

          return (
            <div key={s.num} className="flex flex-col items-center gap-1.5 z-10 flex-1">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-heading font-bold text-xs transition-all duration-300 ${
                  isCurrent
                    ? 'bg-gradient-to-r from-[#FF70A6] to-[#FF4D8B] text-white shadow-[0_0_15px_rgba(255,112,166,0.6)] border border-[#FF70A6] scale-110'
                    : isPassed
                    ? 'bg-[#38E54D] text-[#120B1C]'
                    : 'bg-[#1E1332] text-[#C8B6E2] border border-white/10'
                }`}
              >
                {isPassed ? <Check className="w-4 h-4 font-black" /> : s.num}
              </div>
              <span className={`text-[11px] font-heading font-semibold text-center whitespace-nowrap ${
                isCurrent ? 'text-white' : 'text-[#C8B6E2]/70'
              }`}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* BR-01 Error Banner if any */}
      {br01Error && (
        <AlertBanner
          type="error"
          ruleCode="BR-01"
          title="Restricción Temporal Violada"
          message={br01Error}
          onClose={() => setBr01Error(null)}
        />
      )}

      {/* STEP 1: Selección de Servicio */}
      {step === 1 && (
        <Card bubble glow="pink" className="p-6 space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h3 className="font-heading font-bold text-lg text-white">
                1. Selecciona tu Servicio Glitt
              </h3>
              <p className="text-xs text-[#C8B6E2]">Elige el tratamiento o look que deseas reservar</p>
            </div>
            <span className="text-xs text-[#FFD670]">✦ Paso 1 de 4</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map(srv => {
              const isSelected = selectedService?.id === srv.id;

              return (
                <div
                  key={srv.id}
                  onClick={() => setSelectedService(srv)}
                  className={`p-4 rounded-[20px] border transition-all cursor-pointer relative overflow-hidden group ${
                    isSelected
                      ? 'bg-gradient-to-br from-[#2A1B45] to-[#1E1332] border-[#FF70A6] shadow-[0_0_20px_rgba(255,112,166,0.35)] -translate-y-1'
                      : 'bg-[#120B1C]/60 border-[#FF70A6]/20 hover:border-[#FF70A6]/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#70D6FF] font-mono">
                        {srv.category}
                      </span>
                      <h4 className="font-heading font-bold text-base text-white group-hover:text-[#FF70A6] transition-colors mt-0.5">
                        {srv.name}
                      </h4>
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-bold text-base text-[#FFD670] block">
                        ${srv.price.toLocaleString('es-CO')}
                      </span>
                      <span className="text-[10px] text-[#C8B6E2] font-mono">
                        {srv.duration_minutes} min
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#C8B6E2] mt-2 line-clamp-2 leading-relaxed">
                    {srv.description}
                  </p>

                  {isSelected && (
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-[#38E54D] font-bold">
                      <CheckCircle2 className="w-4 h-4" /> Seleccionado
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4 border-t border-white/10">
            <Button
              variant="pink"
              size="md"
              sparkle
              disabled={!selectedService}
              onClick={handleNextFromService}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Continuar a Estilista & Fecha
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 2: Estilista, Selector de Fecha (BR-01) y Horarios */}
      {step === 2 && (
        <Card bubble glow="cyan" className="p-6 space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h3 className="font-heading font-bold text-lg text-white">
                2. Estilista y Fecha de Reserva
              </h3>
              <p className="text-xs text-[#C8B6E2]">
                Aplica la regla <strong className="text-[#FF70A6]">BR-01</strong>: Mínimo 3 días y máximo 7 días.
              </p>
            </div>
            <span className="text-xs text-[#70D6FF]">✦ Paso 2 de 4</span>
          </div>

          {/* Selector de Estilista */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[#C8B6E2] flex items-center gap-1.5 mb-3">
              <Scissors className="w-3.5 h-3.5 text-[#70D6FF]" />
              <span>Selecciona a tu Profesional</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {stylists.map(sty => {
                const isSelected = selectedStylist?.id === sty.id;

                return (
                  <div
                    key={sty.id}
                    onClick={() => setSelectedStylist(sty)}
                    className={`p-3.5 rounded-[18px] border transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? 'bg-[#2A1B45] border-[#70D6FF] shadow-[0_0_15px_rgba(112,214,255,0.4)]'
                        : 'bg-[#120B1C]/80 border-white/10 hover:border-[#70D6FF]/40'
                    }`}
                  >
                    <div className="w-11 h-11 rounded-full border border-[#70D6FF] overflow-hidden shrink-0 bg-[#1E1332]">
                      {sty.avatar_url ? (
                        <img
                          src={sty.avatar_url}
                          alt={sty.full_name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          onError={e => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-white text-xs">
                          {sty.full_name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-heading font-bold text-xs text-white truncate">
                        {sty.full_name}
                      </h4>
                      <p className="text-[10px] text-[#C8B6E2] truncate">
                        {sty.specialty?.split(',')[0]}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selector Visual de Fechas con Restricción BR-01 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#C8B6E2] flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5 text-[#FF70A6]" />
                <span>Fecha (Ventana BR-01: Entre Día +3 y Día +7)</span>
              </label>
              <span className="text-[11px] text-[#FFD670] font-mono">
                ✦ Días 1 y 2 bloqueados por política
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
              {availableDays.map(item => {
                const isSelected = selectedDateOffset === item.offset;
                const isAllowed = item.isValidBR01;

                return (
                  <button
                    key={item.offset}
                    type="button"
                    disabled={!isAllowed}
                    onClick={() => {
                      setSelectedDateOffset(item.offset);
                      setBr01Error(null);
                    }}
                    className={`p-2.5 rounded-[18px] text-center border transition-all flex flex-col items-center justify-between min-h-[90px] ${
                      !isAllowed
                        ? 'opacity-35 bg-black/40 border-gray-800 text-gray-500 cursor-not-allowed'
                        : isSelected
                        ? 'bg-gradient-to-t from-[#FF70A6] to-[#FF4D8B] border-[#FF70A6] text-white shadow-[0_0_15px_rgba(255,112,166,0.6)] scale-105'
                        : 'bg-[#1E1332] border-[#FF70A6]/30 text-white hover:border-[#FF70A6] hover:bg-[#2A1B45]'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-mono tracking-wider">
                      {item.dayName}
                    </span>
                    <span className="font-heading font-black text-lg my-0.5">
                      {item.dayNum}
                    </span>
                    <span className="text-[9px] font-mono">
                      {item.monthName}
                    </span>
                    <span className={`text-[8px] font-mono font-bold mt-1 px-1 rounded-full ${
                      isAllowed
                        ? isSelected
                          ? 'bg-white/20 text-white'
                          : 'text-[#38E54D]'
                        : 'text-[#FF4B4B]'
                    }`}>
                      {isAllowed ? '✦ Valida' : item.offset < 3 ? '🔒 <3d' : '🔒 >7d'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Slots de Horario en Píldoras Brillantes */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[#C8B6E2] flex items-center gap-1.5 mb-2.5">
              <Clock className="w-3.5 h-3.5 text-[#FFD670]" />
              <span>Horarios Disponibles</span>
            </label>

            <div className="flex flex-wrap gap-2.5">
              {TIME_SLOTS.map(slot => {
                const isSelected = selectedTimeSlot === slot;
                const occupied = isSlotOccupied(slot);

                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => {
                      if (occupied) {
                        const errorMsg = 'El horario seleccionado ya no está disponible con este estilista. Por favor, elige otra hora u otro estilista.';
                        toast.warning('Horario no disponible', errorMsg);
                        setBr01Error(errorMsg);
                        return;
                      }
                      setSelectedTimeSlot(slot);
                      setBr01Error(null);
                    }}
                    className={`px-4 py-2 rounded-full text-xs font-mono font-bold transition-all ${
                      occupied
                        ? 'opacity-40 bg-black/40 border border-gray-700 text-gray-400 cursor-not-allowed line-through'
                        : isSelected
                        ? 'bg-[#70D6FF] text-[#120B1C] shadow-[0_0_12px_rgba(112,214,255,0.6)] border border-[#70D6FF]'
                        : 'bg-[#120B1C] text-[#C8B6E2] border border-[#70D6FF]/30 hover:border-[#70D6FF] hover:text-white'
                    }`}
                  >
                    ✦ {slot} {occupied ? '(Ocupado)' : ''}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-white/10">
            <Button
              variant="bubble"
              size="md"
              onClick={() => setStep(1)}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Atrás
            </Button>
            <Button
              variant="cyan"
              size="md"
              sparkle
              disabled={!selectedStylist || selectedDateOffset === null}
              onClick={handleNextFromSchedule}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Mis Datos
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 3: Mis Datos del Cliente */}
      {step === 3 && (
        <Card bubble glow="yellow" className="p-6 space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h3 className="font-heading font-bold text-lg text-white">
                3. Datos del Cliente & Notificaciones BR-03
              </h3>
              <p className="text-xs text-[#C8B6E2]">
                Te enviaremos voucher y recordatorio 24h antes por WhatsApp y Correo
              </p>
            </div>
            <span className="text-xs text-[#FFD670]">✦ Paso 3 de 4</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nombre Completo"
              placeholder="Ej. Valentina López"
              value={clientName}
              onChange={e => setClientName(e.target.value)}
              icon={<User className="w-4 h-4" />}
              required
            />
            <Input
              label="WhatsApp (Obligatorio para BR-03)"
              placeholder="+57 315 987 6543"
              value={clientPhone}
              onChange={e => setClientPhone(e.target.value)}
              icon={<Phone className="w-4 h-4" />}
              helperText="Recibirás confirmación inmediata y link de gestión"
              required
            />
            <div className="sm:col-span-2">
              <Input
                label="Correo Electrónico"
                type="email"
                placeholder="tu@correo.com"
                value={clientEmail}
                onChange={e => setClientEmail(e.target.value)}
                icon={<Mail className="w-4 h-4" />}
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#C8B6E2] flex items-center gap-1.5 mb-1.5">
                <span className="text-[#FF70A6]">✦</span> Notas o Requerimientos Especiales (Opcional)
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                placeholder="Ej. Deseo mechas rosa pastel en contorno facial, tengo cabello tratado con tinte negro previo..."
                className="w-full bg-[#120B1C]/80 text-white placeholder-[#C8B6E2]/40 rounded-[16px] border border-[#FF70A6]/30 focus:border-[#FF70A6] focus:ring-2 focus:ring-[#FF70A6]/20 p-3 text-xs outline-none"
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-white/10">
            <Button
              variant="bubble"
              size="md"
              onClick={() => setStep(2)}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Atrás
            </Button>
            <Button
              variant="pink"
              size="md"
              sparkle
              onClick={handleNextFromClientData}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Revisar y Confirmar
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 4: Resumen & Confirmación Final */}
      {step === 4 && (
        <Card bubble glow="pink" className="p-6 space-y-6 animate-in fade-in">
          <div className="text-center border-b border-white/10 pb-4">
            <span className="text-2xl text-[#FFD670] animate-twinkle block mb-1">✦</span>
            <h3 className="font-heading font-black text-xl text-white">
              4. Confirma tu Reserva SalonGlitt
            </h3>
            <p className="text-xs text-[#C8B6E2]">
              Verifica los detalles antes de agendar y generar tus notificaciones
            </p>
          </div>

          {/* Summary Box */}
          <div className="p-5 rounded-[22px] bg-[#120B1C]/90 border border-[#FF70A6]/40 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div>
                <span className="text-xs text-[#C8B6E2]">Servicio Solicitado</span>
                <h4 className="font-heading font-bold text-lg text-white">
                  {selectedService?.name}
                </h4>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#C8B6E2]">Total a Pagar</span>
                <div className="font-mono font-black text-xl text-[#FFD670]">
                  ${selectedService?.price.toLocaleString('es-CO')} COP
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-[#C8B6E2] block">Estilista:</span>
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Scissors className="w-3.5 h-3.5 text-[#70D6FF]" />
                  {selectedStylist?.full_name}
                </span>
              </div>
              <div className="space-y-1 font-mono">
                <span className="text-[#C8B6E2] block">Fecha y Hora:</span>
                <span className="font-bold text-[#38E54D] flex items-center gap-1.5">
                  <CalendarIcon className="w-3.5 h-3.5" />
                  {selectedCalculatedDate?.toLocaleDateString('es-CO', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                  })}{' '}
                  a las {selectedTimeSlot}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[#C8B6E2] block">Titular de la Cita:</span>
                <span className="font-bold text-white">{clientName}</span>
              </div>
              <div className="space-y-1 font-mono">
                <span className="text-[#C8B6E2] block">WhatsApp Notificador:</span>
                <span className="font-bold text-[#70D6FF]">{clientPhone}</span>
              </div>
            </div>

            {/* Validation Checklist Badges */}
            <div className="p-3 rounded-[16px] bg-[#1E1332] border border-[#38E54D]/30 space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-[#38E54D]">
                <Check className="w-3.5 h-3.5" />
                <span>Cumple regla BR-01: Cita agendada dentro de la ventana de 3 a 7 días.</span>
              </div>
              <div className="flex items-center gap-2 text-[#70D6FF]">
                <Check className="w-3.5 h-3.5" />
                <span>Cumple regla BR-03: Despacho simultáneo por WhatsApp y Correo.</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4">
            <Button
              variant="bubble"
              size="md"
              onClick={() => setStep(3)}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Atrás
            </Button>
            <Button
              variant="pink"
              size="lg"
              sparkle
              disabled={submitting}
              onClick={handleConfirmBooking}
              className="shadow-[0_8px_30px_rgba(255,112,166,0.5)]"
            >
              {submitting ? 'Agendando...' : '✦ Confirmar Mi Cita Ahora ✦'}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
