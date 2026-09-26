import React, { useState } from 'react';
import { Appointment, NotificationItem, AuditLogItem, PaymentRecord } from '@/types';
import { dataStore, validateBR02 } from '@/lib/dataStore';
import { useAppointments } from '@/hooks/useAppointments';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AlertBanner } from '@/components/ui/AlertBanner';
import { 
  Calendar, 
  Clock, 
  Scissors, 
  ArrowLeft, 
  MessageSquare, 
  ShieldCheck, 
  CreditCard, 
  FileText, 
  Sparkles, 
  Phone, 
  Mail,
  Send,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock
} from 'lucide-react';

interface AppointmentDetail360PageProps {
  appointmentId?: string;
  onBack: () => void;
  onNavigate: (viewId: string, extraData?: any) => void;
}

export const AppointmentDetail360Page: React.FC<AppointmentDetail360PageProps> = ({
  appointmentId,
  onBack,
  onNavigate,
}) => {
  const { appointments, cancelAppointment, updateStatus } = useAppointments();
  const { currentUser, currentRole } = useAuth();

  // Find appointment or default to client appointment if role is CLIENT
  const appointment: Appointment | undefined = appointmentId
    ? appointments.find(a => a.id === appointmentId) || dataStore.getAppointmentById(appointmentId, currentRole === 'CLIENT' ? currentUser?.id ?? '' : undefined)
    : (currentRole === 'CLIENT'
        ? appointments.find(a => a.client_id === currentUser?.id)
        : appointments[0]);

  const [activeTab, setActiveTab] = useState<'details' | 'audit' | 'notifications' | 'payment'>('details');
  const [cancelError, setCancelError] = useState<string | null>(null);

  if (!appointment) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-heading text-white">Cita no encontrada</h2>
        <Button variant="bubble" onClick={onBack} icon={<ArrowLeft className="w-4 h-4" />}>
          Regresar
        </Button>
      </div>
    );
  }

  // Strict Privacy Guard: A Client can ONLY view their own appointment
  if (currentRole === 'CLIENT' && currentUser && appointment.client_id !== currentUser.id) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <Card bubble glow="pink" className="max-w-md p-8 border-[#FF4B4B]/40 space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#FF4B4B]/20 text-[#FF4B4B] mx-auto flex items-center justify-center border border-[#FF4B4B]/40">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="font-heading font-black text-xl text-white">Restricción de Privacidad</h2>
          <p className="text-xs text-[#C8B6E2]">
            Por políticas de privacidad de SalonGlitt, no tienes autorización para consultar detalles de citas pertenecientes a otros clientes.
          </p>
          <div className="pt-2">
            <Button variant="pink" size="md" sparkle onClick={() => onNavigate('my-appointments')}>
              Ir a Mis Citas Personales
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const notifications = dataStore.getNotifications(appointment.id);
  const auditLogs = dataStore.getAuditLogs(appointment.id);
  const payments = dataStore.getPayments(appointment.id);

  const appointmentDate = new Date(appointment.appointment_date);
  const br02Check = validateBR02(appointmentDate);

  const handleCancel = () => {
    if (!br02Check.canCancel) {
      setCancelError(br02Check.message || 'Restricción BR-02: No es posible cancelar');
      return;
    }
    const ok = cancelAppointment(appointment.id, 'Detalle 360');
    if (ok) {
      setCancelError(null);
    }
  };

  return (
    <div id="scr-04-detail-360" className="space-y-6 pb-12">
      {/* Top Bar with Back Button & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="bubble"
            size="sm"
            onClick={onBack}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Volver
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#FF70A6] animate-twinkle">✦</span>
              <span className="text-xs font-mono font-bold text-[#70D6FF] uppercase">
                Expediente Digital • SCR-04
              </span>
            </div>
            <h1 className="font-heading font-black text-2xl text-white">
              Detalle 360° de la Cita
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge status={appointment.status} size="lg">
            {appointment.status}
          </Badge>
          {appointment.status !== 'CANCELLED' && (
            <Button
              variant="danger"
              size="sm"
              onClick={handleCancel}
              disabled={!br02Check.canCancel}
              title={br02Check.canCancel ? 'Cancelar cita' : br02Check.message}
            >
              Cancelar Cita
            </Button>
          )}
        </div>
      </div>

      {/* Alert Banner for Cancellation Restriction if active */}
      {cancelError && (
        <AlertBanner
          type="error"
          ruleCode="BR-02"
          title="Política de Cancelación Inflexible"
          message={cancelError}
          onClose={() => setCancelError(null)}
        />
      )}

      {/* Hero Card del Cliente con Avatar Y2K */}
      <Card bubble glow="pink" className="p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          {/* Avatar & Info */}
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-2 border-[#FF70A6] shadow-[0_0_20px_rgba(255,112,166,0.5)] overflow-hidden bg-[#2A1B45]">
                {appointment.client?.avatar_url ? (
                  <img
                    src={appointment.client.avatar_url}
                    alt={appointment.client.full_name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={e => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white font-bold text-2xl">
                    {appointment.client?.full_name?.charAt(0) || 'C'}
                  </div>
                )}
              </div>
              <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-[#120B1C] border border-[#FFD670] text-[#FFD670] text-xs">
                ✦
              </span>
            </div>

            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h2 className="font-heading font-black text-xl sm:text-2xl text-white">
                  {appointment.client?.full_name || 'Cliente'}
                </h2>
                <Badge variant="purple" size="sm">
                  Cliente VIP
                </Badge>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-4 mt-2 text-xs text-[#C8B6E2] flex-wrap">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-[#70D6FF]" />
                  {appointment.client?.email || 'cliente@salonglitt.com'}
                </span>
                <span className="flex items-center gap-1 font-mono">
                  <Phone className="w-3.5 h-3.5 text-[#38E54D]" />
                  {appointment.client?.phone || '+57 315 000 0000'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Meta Snapshot */}
          <div className="p-3.5 rounded-[18px] bg-[#120B1C]/80 border border-[#FF70A6]/30 text-xs font-mono space-y-1.5 min-w-[200px] text-right sm:text-left">
            <div className="text-[#C8B6E2]">
              ID Reserva: <strong className="text-[#70D6FF]">#{appointment.id}</strong>
            </div>
            <div className="text-[#C8B6E2]">
              Creación: <span className="text-white">{new Date(appointment.created_at).toLocaleDateString('es-CO')}</span>
            </div>
            <div className="text-[#C8B6E2]">
              Estado BR-02: {br02Check.canCancel ? (
                <span className="text-[#38E54D]">Habilitada (&gt;24h)</span>
              ) : (
                <span className="text-[#FF4B4B]">Bloqueada (&lt;24h)</span>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Interactive Tabs Header */}
      <div className="flex items-center gap-2 p-1.5 rounded-full bg-[#1E1332] border border-[#FF70A6]/30 overflow-x-auto">
        <button
          onClick={() => setActiveTab('details')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-heading font-semibold transition-all whitespace-nowrap ${
            activeTab === 'details'
              ? 'bg-[#FF70A6] text-white shadow-[0_4px_12px_rgba(255,112,166,0.4)]'
              : 'text-[#C8B6E2] hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>📌 Detalle de Reserva</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-heading font-semibold transition-all whitespace-nowrap ${
            activeTab === 'audit'
              ? 'bg-[#70D6FF] text-[#120B1C] shadow-[0_4px_12px_rgba(112,214,255,0.4)]'
              : 'text-[#C8B6E2] hover:text-white'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>📜 Timeline & Auditoría ({auditLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-heading font-semibold transition-all whitespace-nowrap ${
            activeTab === 'notifications'
              ? 'bg-[#38E54D] text-[#120B1C] shadow-[0_4px_12px_rgba(56,229,77,0.4)]'
              : 'text-[#C8B6E2] hover:text-white'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>💬 Notificaciones ({notifications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('payment')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-heading font-semibold transition-all whitespace-nowrap ${
            activeTab === 'payment'
              ? 'bg-[#FFD670] text-[#120B1C] shadow-[0_4px_12px_rgba(255,214,112,0.4)]'
              : 'text-[#C8B6E2] hover:text-white'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>💳 Registro de Pago</span>
        </button>
      </div>

      {/* Tab 1: Detalle de Reserva */}
      {activeTab === 'details' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
          {/* Card Servicio & Estilista */}
          <Card bubble className="p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <span className="text-xs text-[#FF70A6]">✦</span>
              <h3 className="font-heading font-bold text-base text-white">
                Servicio Contratado
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-xs text-[#C8B6E2] uppercase tracking-wider block">Tratamiento</span>
                <span className="text-lg font-heading font-bold text-white block mt-0.5">
                  {appointment.service?.name}
                </span>
                <p className="text-xs text-[#C8B6E2] mt-1 leading-relaxed">
                  {appointment.service?.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-[16px] bg-[#120B1C]/80 border border-[#FF70A6]/20">
                  <span className="text-[11px] text-[#C8B6E2] block">Precio Lista</span>
                  <span className="text-base font-mono font-bold text-[#70D6FF]">
                    ${appointment.service?.price.toLocaleString('es-CO')} COP
                  </span>
                </div>
                <div className="p-3 rounded-[16px] bg-[#120B1C]/80 border border-[#FF70A6]/20">
                  <span className="text-[11px] text-[#C8B6E2] block">Duración</span>
                  <span className="text-base font-mono font-bold text-white">
                    {appointment.service?.duration_minutes} Minutos
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Card Horario & Asignación */}
          <Card bubble className="p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <span className="text-xs text-[#70D6FF]">✦</span>
              <h3 className="font-heading font-bold text-base text-white">
                Programación & Notas
              </h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-[16px] bg-[#120B1C]/80 border border-white/10">
                <div className="w-10 h-10 rounded-full bg-[#70D6FF]/20 border border-[#70D6FF] flex items-center justify-center">
                  <Scissors className="w-5 h-5 text-[#70D6FF]" />
                </div>
                <div>
                  <span className="text-[11px] text-[#C8B6E2] block">Estilista Responsable</span>
                  <span className="font-heading font-bold text-sm text-white">
                    {appointment.stylist?.full_name}
                  </span>
                  <span className="text-[10px] text-[#70D6FF] block">
                    {appointment.stylist?.specialty}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-[16px] bg-[#120B1C]/80 border border-white/10 font-mono text-xs">
                <Calendar className="w-4 h-4 text-[#FFD670]" />
                <div>
                  <span className="text-white font-bold block">
                    {appointmentDate.toLocaleDateString('es-CO', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="text-[#C8B6E2]">
                    Hora fijada: {appointmentDate.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {appointment.notes && (
                <div className="p-3 rounded-[16px] bg-[#2A1B45]/50 border border-[#FF70A6]/30">
                  <span className="text-[11px] font-bold text-[#FF70A6] uppercase tracking-wider block mb-1">
                    Notas Especiales del Cliente:
                  </span>
                  <p className="text-xs text-[#C8B6E2] italic">
                    "{appointment.notes}"
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Tab 2: Timeline de Auditoría */}
      {activeTab === 'audit' && (
        <Card bubble className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-xs text-[#70D6FF]">✦</span>
            <h3 className="font-heading font-bold text-lg text-white">
              Historial y Trazabilidad de Auditoría
            </h3>
          </div>

          <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:top-2 before:bottom-2 before:left-[11px] before:w-[2px] before:bg-gradient-to-b before:from-[#FF70A6] via-[#70D6FF] to-transparent">
            {auditLogs.map((log, index) => (
              <div key={log.id || index} className="relative group">
                {/* ✦ Star Node */}
                <div className="absolute -left-[30px] top-0 w-6 h-6 rounded-full bg-[#120B1C] border-2 border-[#FF70A6] flex items-center justify-center text-[10px] text-[#FFD670] shadow-[0_0_10px_rgba(255,112,166,0.6)]">
                  ✦
                </div>

                <div className="p-4 rounded-[18px] bg-[#120B1C]/70 border border-[#FF70A6]/20 hover:border-[#FF70A6]/50 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <span className="font-heading font-bold text-sm text-white flex items-center gap-2">
                      <span className="text-[#FF70A6]">{log.action}</span>
                    </span>
                    <span className="text-[11px] font-mono text-[#C8B6E2]">
                      {new Date(log.timestamp).toLocaleString('es-CO')}
                    </span>
                  </div>

                  <p className="text-xs text-[#C8B6E2] mt-1">{log.details}</p>

                  <div className="mt-2 text-[11px] text-[#70D6FF] flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Ejecutado por: <strong className="text-white">{log.performed_by}</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tab 3: Notificaciones (BR-03) */}
      {activeTab === 'notifications' && (
        <Card bubble className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#38E54D]">✦</span>
                <h3 className="font-heading font-bold text-lg text-white">
                  Notificaciones Transaccionales (BR-03)
                </h3>
              </div>
              <p className="text-xs text-[#C8B6E2] mt-0.5">
                Despacho multi-canal con WhatsApp API y Notificador por Correo Electrónico.
              </p>
            </div>
            <Badge variant="cyan" size="sm">
              WhatsApp & Email Activos
            </Badge>
          </div>

          <div className="space-y-3">
            {notifications.map(notif => (
              <div
                key={notif.id}
                className="p-4 rounded-[18px] bg-[#120B1C]/70 border border-[#38E54D]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-[14px] border shrink-0 ${
                    notif.channel === 'WHATSAPP'
                      ? 'bg-[#38E54D]/15 text-[#38E54D] border-[#38E54D]/40'
                      : 'bg-[#70D6FF]/15 text-[#70D6FF] border-[#70D6FF]/40'
                  }`}>
                    {notif.channel === 'WHATSAPP' ? (
                      <Phone className="w-4 h-4" />
                    ) : (
                      <Mail className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-xs text-white">
                        Canal: {notif.channel}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 font-mono text-[#C8B6E2]">
                        {notif.notification_type}
                      </span>
                    </div>
                    <p className="text-xs text-[#C8B6E2] mt-1 italic">
                      "{notif.message_preview}"
                    </p>
                    <span className="text-[10px] text-[#70D6FF] font-mono mt-1 block">
                      Destinatario: {notif.recipient}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0 gap-1">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#38E54D]/15 text-[#38E54D] border border-[#38E54D]/40 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {notif.status}
                  </span>
                  <span className="text-[10px] text-[#C8B6E2] font-mono">
                    {notif.sent_at ? new Date(notif.sent_at).toLocaleTimeString('es-CO') : 'En cola'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tab 4: Registro de Pago */}
      {activeTab === 'payment' && (
        <Card bubble className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#FFD670]">✦</span>
              <h3 className="font-heading font-bold text-lg text-white">
                Comprobante y Registro Financiero
              </h3>
            </div>
            <span className="text-xs font-mono text-[#38E54D] bg-[#38E54D]/10 px-3 py-1 rounded-full border border-[#38E54D]/30">
              ✓ Liquidado
            </span>
          </div>

          <div className="space-y-4">
            {payments.map(pay => (
              <div
                key={pay.id}
                className="p-4 rounded-[20px] bg-[#120B1C]/80 border border-[#FFD670]/30 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div>
                    <span className="text-xs text-[#C8B6E2] uppercase font-mono">Método de Pago:</span>
                    <h4 className="font-heading font-bold text-base text-white flex items-center gap-2">
                      <span>{pay.method}</span>
                      <span className="text-xs text-[#70D6FF] font-mono">({pay.transaction_ref})</span>
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[#C8B6E2] font-mono">Monto Cobrado</span>
                    <div className="text-xl font-mono font-black text-[#FFD670]">
                      ${pay.amount.toLocaleString('es-CO')} COP
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-[#C8B6E2] font-mono">
                  <span>Fecha Transacción: {new Date(pay.date).toLocaleString('es-CO')}</span>
                  <span className="text-[#38E54D] font-bold">ESTADO: {pay.status}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default AppointmentDetail360Page;
