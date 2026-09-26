import { supabase } from './supabaseClient';
import { 
  Appointment, 
  Profile, 
  Service, 
  StylistSchedule, 
  NotificationItem, 
  BusinessRulesConfig, 
  AuditLogItem, 
  PaymentRecord,
  UserRole
} from '../types';
import { 
  INITIAL_PROFILES, 
  INITIAL_SERVICES, 
  INITIAL_SCHEDULES, 
  INITIAL_APPOINTMENTS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_PAYMENTS, 
  INITIAL_BUSINESS_RULES 
} from './initialData';

const STORAGE_KEYS = {
  APPOINTMENTS: 'salonglitt_appointments_v1',
  PROFILES: 'salonglitt_profiles_v1',
  SERVICES: 'salonglitt_services_v3',
  SCHEDULES: 'salonglitt_schedules_v1',
  NOTIFICATIONS: 'salonglitt_notifications_v1',
  AUDIT_LOGS: 'salonglitt_audit_logs_v1',
  PAYMENTS: 'salonglitt_payments_v1',
  RULES: 'salonglitt_rules_v1',
};

// Helper to get from LocalStorage with fallback
function getLocal<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving to localStorage', e);
  }
}

// Check Business Rules
export const validateBR01 = (targetDate: Date, config: BusinessRulesConfig = INITIAL_BUSINESS_RULES): { valid: boolean; message?: string } => {
  const now = new Date();
  const diffMs = targetDate.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  const minHours = config.minDaysInAdvance * 24; // 72h
  const maxHours = config.maxDaysInAdvance * 24; // 168h

  if (diffHours < minHours) {
    return {
      valid: false,
      message: `Violación BR-01: Solo puedes agendar con un mínimo de ${config.minDaysInAdvance} días (72 horas) de anticipación.`,
    };
  }

  if (diffHours > maxHours) {
    return {
      valid: false,
      message: `Violación BR-01: El agendamiento solo está permitido hasta ${config.maxDaysInAdvance} días (168 horas) en el futuro.`,
    };
  }

  return { valid: true };
};

export const validateBR02 = (appointmentDate: Date, config: BusinessRulesConfig = INITIAL_BUSINESS_RULES): { canCancel: boolean; hoursRemaining: number; message?: string } => {
  const now = new Date();
  const diffMs = appointmentDate.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < config.minCancelHoursBefore) {
    return {
      canCancel: false,
      hoursRemaining: Math.max(0, Math.round(diffHours * 10) / 10),
      message: `Violación BR-02: Las cancelaciones solo están permitidas con más de ${config.minCancelHoursBefore} horas de anticipación (Faltan: ${diffHours > 0 ? diffHours.toFixed(1) + 'h' : '0h'}).`,
    };
  }

  return {
    canCancel: true,
    hoursRemaining: Math.round(diffHours * 10) / 10,
  };
};

export class DataStore {
  private static instance: DataStore;

  private profiles: Profile[] = [];
  private services: Service[] = [];
  private schedules: StylistSchedule[] = [];
  private appointments: Appointment[] = [];
  private notifications: NotificationItem[] = [];
  private auditLogs: AuditLogItem[] = [];
  private payments: PaymentRecord[] = [];
  private rules: BusinessRulesConfig = INITIAL_BUSINESS_RULES;

  private constructor() {
    this.init();
  }

  public static getInstance(): DataStore {
    if (!DataStore.instance) {
      DataStore.instance = new DataStore();
    }
    return DataStore.instance;
  }

  private init() {
    this.profiles = getLocal(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
    const loadedServices = getLocal<Service[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
    // Sanitize any broken or outdated service images and synchronize new initial data
    this.services = loadedServices.map(s => {
      const match = INITIAL_SERVICES.find(is => is.id === s.id);
      if (match) {
        return {
          ...s,
          image_url: match.image_url,
          badge: s.badge || match.badge,
          tags: s.tags || match.tags,
        };
      }
      return s;
    });
    setLocal(STORAGE_KEYS.SERVICES, this.services);

    this.schedules = getLocal(STORAGE_KEYS.SCHEDULES, INITIAL_SCHEDULES);
    this.appointments = getLocal(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
    this.notifications = getLocal(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    this.auditLogs = getLocal(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    this.payments = getLocal(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);
    this.rules = getLocal(STORAGE_KEYS.RULES, INITIAL_BUSINESS_RULES);
  }

  // --- PROFILES ---
  public async getProfiles(): Promise<Profile[]> {
    try {
      const { data, error } = await supabase.from('profiles').select('*');
      if (!error && data && data.length > 0) {
        return data as Profile[];
      }
    } catch {
      // Fallback
    }
    return this.profiles;
  }

  public getStylists(): Profile[] {
    return this.profiles.filter(p => p.role === 'STYLIST');
  }

  public getClients(): Profile[] {
    return this.profiles.filter(p => p.role === 'CLIENT');
  }

  public getProfileById(id: string): Profile | undefined {
    return this.profiles.find(p => p.id === id);
  }

  public addProfile(profile: Profile): Profile {
    this.profiles.push(profile);
    setLocal(STORAGE_KEYS.PROFILES, this.profiles);
    Promise.resolve(supabase.from('profiles').insert(profile)).catch(() => {});
    return profile;
  }

  public async updateProfileRole(id: string, newRole: UserRole, specialty?: string): Promise<Profile | undefined> {
    const idx = this.profiles.findIndex(p => p.id === id);
    const currentProfile = idx === -1 ? undefined : this.profiles[idx];
    const { data, error } = await supabase
      .from('profiles')
      .update({ role: newRole, specialty: specialty ?? currentProfile?.specialty })
      .eq('id', id)
      .select('*')
      .maybeSingle();
    if (error || !data) return undefined;

    const updatedProfile = data as Profile;
    if (idx !== -1) {
      this.profiles[idx] = updatedProfile;
      setLocal(STORAGE_KEYS.PROFILES, this.profiles);
      this.addAuditLog({
        id: `aud-${Date.now()}`,
        appointment_id: `user-${id}`,
        action: 'UPDATE_ROLE',
        performed_by: 'Administrador (Sofía Glam)',
        timestamp: new Date().toISOString(),
        details: `RBAC: Modificación de rol a ${newRole}${specialty ? ` | Especialidad: ${specialty}` : ''}`,
      });
    }
    return updatedProfile;
  }

  public updateProfile(id: string, updates: Partial<Profile>): Profile | undefined {
    const idx = this.profiles.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.profiles[idx] = {
        ...this.profiles[idx],
        ...updates,
      };
      setLocal(STORAGE_KEYS.PROFILES, this.profiles);
      Promise.resolve(supabase.from('profiles').update(updates).eq('id', id)).catch(() => {});
      return this.profiles[idx];
    }
    return undefined;
  }

  public isStylistAvailable(stylistId: string, targetDate: Date, durationMinutes = 60): boolean {
    const requestedStart = targetDate.getTime();
    const requestedEnd = requestedStart + durationMinutes * 60 * 1000;

    return !this.appointments.some(apt => {
      if (apt.stylist_id !== stylistId) return false;
      if (apt.status === 'CANCELLED') return false;

      const aptStart = new Date(apt.appointment_date).getTime();
      const aptService = this.getServiceById(apt.service_id);
      const aptDuration = (aptService?.duration_minutes || 60) * 60 * 1000;
      const aptEnd = aptStart + aptDuration;

      // Overlap condition: requestedStart < aptEnd && requestedEnd > aptStart
      return requestedStart < aptEnd && requestedEnd > aptStart;
    });
  }

  // --- SERVICES ---
  public async getServices(): Promise<Service[]> {
    try {
      const { data, error } = await supabase.from('services').select('*').eq('is_active', true);
      if (!error && data && data.length > 0) {
        return data as Service[];
      }
    } catch {
      // fallback
    }
    return this.services;
  }

  public getServiceById(id: string): Service | undefined {
    return this.services.find(s => s.id === id);
  }

  // --- SCHEDULES ---
  public getSchedules(): StylistSchedule[] {
    return this.schedules;
  }

  public getStylistSchedule(stylistId: string): StylistSchedule[] {
    return this.schedules.filter(s => s.stylist_id === stylistId);
  }

  // --- APPOINTMENTS ---
  public getAppointments(clientId?: string): Appointment[] {
    // hydrate with relations
    return this.appointments
      .filter(apt => clientId === undefined || apt.client_id === clientId)
      .map(apt => ({
      ...apt,
      client: this.getProfileById(apt.client_id),
      stylist: this.getProfileById(apt.stylist_id),
      service: this.getServiceById(apt.service_id),
      }));
  }

  public getAppointmentById(id: string, clientId?: string): Appointment | undefined {
    const apt = this.appointments.find(a => a.id === id);
    if (!apt || (clientId !== undefined && apt.client_id !== clientId)) return undefined;
    return {
      ...apt,
      client: this.getProfileById(apt.client_id),
      stylist: this.getProfileById(apt.stylist_id),
      service: this.getServiceById(apt.service_id),
    };
  }

  public async createAppointment(params: {
    client_id: string;
    stylist_id: string;
    service_id: string;
    appointment_date: string;
    notes?: string;
  }): Promise<{ success: boolean; appointment?: Appointment; error?: string }> {
    const targetDate = new Date(params.appointment_date);
    if (Number.isNaN(targetDate.getTime())) {
      return { success: false, error: 'La fecha seleccionada no es válida.' };
    }

    // Enforce BR-01
    const br01Check = validateBR01(targetDate, this.rules);
    if (!br01Check.valid) {
      return { success: false, error: br01Check.message };
    }

    // Validación de Disponibilidad y Horarios Dobles
    const service = this.getServiceById(params.service_id);
    const duration = service?.duration_minutes || 60;
    if (!this.isStylistAvailable(params.stylist_id, targetDate, duration)) {
      return {
        success: false,
        error: 'El horario seleccionado ya no está disponible con este estilista. Por favor, elige otra hora u otro estilista.',
      };
    }

    const newAppointment: Appointment = {
      id: `apt-${Date.now().toString(36)}`,
      client_id: params.client_id,
      stylist_id: params.stylist_id,
      service_id: params.service_id,
      appointment_date: params.appointment_date,
      status: this.rules.autoConfirmOnlineAppointments ? 'CONFIRMED' : 'PENDING',
      notes: params.notes,
      created_at: new Date().toISOString(),
    };

    const { error: bookingError } = await supabase.from('appointments').insert({
      id: newAppointment.id,
      client_id: newAppointment.client_id,
      stylist_id: newAppointment.stylist_id,
      service_id: newAppointment.service_id,
      appointment_date: newAppointment.appointment_date,
      status: newAppointment.status,
    });
    if (bookingError) {
      return { success: false, error: `No se pudo confirmar la cita: ${bookingError.message}` };
    }

    this.appointments.unshift(newAppointment);
    setLocal(STORAGE_KEYS.APPOINTMENTS, this.appointments);

    // BR-03: Register automated WhatsApp and Email notifications
    const client = this.getProfileById(params.client_id);
    const stylist = this.getProfileById(params.stylist_id);

    if (this.rules.whatsappNotificationEnabled && client?.phone) {
      this.addNotification({
        id: `notif-wa-${Date.now()}`,
        appointment_id: newAppointment.id,
        channel: 'WHATSAPP',
        notification_type: 'CONFIRMATION',
        status: 'SENT',
        scheduled_at: new Date().toISOString(),
        sent_at: new Date().toISOString(),
        recipient: client.phone,
        message_preview: `✦ ¡Hola ${client.full_name}! Tu cita en SalonGlitt para ${service?.name || 'Servicio'} con ${stylist?.full_name || 'Estilista'} ha sido confirmada para el ${new Date(params.appointment_date).toLocaleString()} ✨.`,
      });
    }

    if (this.rules.emailNotificationEnabled && client?.email) {
      this.addNotification({
        id: `notif-em-${Date.now()}`,
        appointment_id: newAppointment.id,
        channel: 'EMAIL',
        notification_type: 'CONFIRMATION',
        status: 'SENT',
        scheduled_at: new Date().toISOString(),
        sent_at: new Date().toISOString(),
        recipient: client.email,
        message_preview: `Confirmación de reserva SalonGlitt #${newAppointment.id}. Estilista: ${stylist?.full_name}, Total: $${service?.price.toLocaleString('es-CO')} COP.`,
      });
    }

    // Audit log
    this.addAuditLog({
      id: `aud-${Date.now()}`,
      appointment_id: newAppointment.id,
      action: 'CREACIÓN_DE_CITA',
      performed_by: client?.full_name || 'Cliente Web',
      timestamp: new Date().toISOString(),
      details: `Cita agendada para ${new Date(params.appointment_date).toLocaleDateString()}. BR-01 Validada. Canales BR-03 activados.`,
    });

    // Create pending payment record
    if (service) {
      this.addPayment({
        id: `pay-${Date.now()}`,
        appointment_id: newAppointment.id,
        amount: service.price,
        method: 'NEQUI',
        status: 'PAID',
        transaction_ref: `NQ-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toISOString(),
      });
    }

    return {
      success: true,
      appointment: {
        ...newAppointment,
        client,
        stylist,
        service,
      },
    };
  }

  public cancelAppointment(id: string, cancelledBy = 'Usuario', authorizedClientId?: string): { success: boolean; error?: string } {
    const apt = this.appointments.find(a => a.id === id);
    if (!apt) return { success: false, error: 'Cita no encontrada' };
    if (authorizedClientId !== undefined && apt.client_id !== authorizedClientId) {
      return { success: false, error: 'No tienes autorización para cancelar esta cita.' };
    }

    // Enforce BR-02
    const br02Check = validateBR02(new Date(apt.appointment_date), this.rules);
    if (!br02Check.canCancel) {
      return { success: false, error: br02Check.message };
    }

    apt.status = 'CANCELLED';
    setLocal(STORAGE_KEYS.APPOINTMENTS, this.appointments);

    Promise.resolve(supabase.from('appointments').update({ status: 'CANCELLED' }).eq('id', id)).catch(() => {});

    // Notification of cancellation
    const client = this.getProfileById(apt.client_id);
    if (client?.phone) {
      this.addNotification({
        id: `notif-cancel-${Date.now()}`,
        appointment_id: apt.id,
        channel: 'WHATSAPP',
        notification_type: 'CANCELLATION',
        status: 'SENT',
        scheduled_at: new Date().toISOString(),
        sent_at: new Date().toISOString(),
        recipient: client.phone,
        message_preview: `✦ Notificación SalonGlitt: Tu cita #${apt.id} ha sido cancelada exitosamente conforme a la política previa de 24h.`,
      });
    }

    this.addAuditLog({
      id: `aud-${Date.now()}`,
      appointment_id: apt.id,
      action: 'CANCELACIÓN_DE_CITA',
      performed_by: cancelledBy,
      timestamp: new Date().toISOString(),
      details: `Cancelada cumpliendo BR-02 (>24 horas restantes: ${br02Check.hoursRemaining}h).`,
    });

    return { success: true };
  }

  public updateAppointmentStatus(id: string, newStatus: Appointment['status'], updater = 'Admin'): boolean {
    const apt = this.appointments.find(a => a.id === id);
    if (!apt) return false;

    const oldStatus = apt.status;
    apt.status = newStatus;
    setLocal(STORAGE_KEYS.APPOINTMENTS, this.appointments);

    this.addAuditLog({
      id: `aud-${Date.now()}`,
      appointment_id: apt.id,
      action: `CAMBIO_ESTADO_${newStatus}`,
      performed_by: updater,
      timestamp: new Date().toISOString(),
      details: `Estado cambiado de ${oldStatus} a ${newStatus}.`,
    });

    return true;
  }

  // --- NOTIFICATIONS ---
  public getNotifications(appointmentId?: string): NotificationItem[] {
    if (appointmentId) {
      return this.notifications.filter(n => n.appointment_id === appointmentId);
    }
    return this.notifications;
  }

  public addNotification(item: NotificationItem): void {
    this.notifications.unshift(item);
    setLocal(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
  }

  // --- AUDIT LOGS ---
  public getAuditLogs(appointmentId?: string): AuditLogItem[] {
    if (appointmentId) {
      return this.auditLogs.filter(a => a.appointment_id === appointmentId);
    }
    return this.auditLogs;
  }

  public addAuditLog(item: AuditLogItem): void {
    this.auditLogs.unshift(item);
    setLocal(STORAGE_KEYS.AUDIT_LOGS, this.auditLogs);
  }

  // --- PAYMENTS ---
  public getPayments(appointmentId?: string): PaymentRecord[] {
    if (appointmentId) {
      return this.payments.filter(p => p.appointment_id === appointmentId);
    }
    return this.payments;
  }

  public addPayment(item: PaymentRecord): void {
    this.payments.unshift(item);
    setLocal(STORAGE_KEYS.PAYMENTS, this.payments);
  }

  // --- BUSINESS RULES CONFIG ---
  public getRules(): BusinessRulesConfig {
    return this.rules;
  }

  public updateRules(updated: Partial<BusinessRulesConfig>): BusinessRulesConfig {
    this.rules = { ...this.rules, ...updated };
    setLocal(STORAGE_KEYS.RULES, this.rules);
    return this.rules;
  }

  // Reset to initial demo data
  public resetData(): void {
    this.profiles = [...INITIAL_PROFILES];
    this.services = [...INITIAL_SERVICES];
    this.schedules = [...INITIAL_SCHEDULES];
    this.appointments = [...INITIAL_APPOINTMENTS];
    this.notifications = [...INITIAL_NOTIFICATIONS];
    this.auditLogs = [...INITIAL_AUDIT_LOGS];
    this.payments = [...INITIAL_PAYMENTS];
    this.rules = { ...INITIAL_BUSINESS_RULES };

    setLocal(STORAGE_KEYS.PROFILES, this.profiles);
    setLocal(STORAGE_KEYS.SERVICES, this.services);
    setLocal(STORAGE_KEYS.SCHEDULES, this.schedules);
    setLocal(STORAGE_KEYS.APPOINTMENTS, this.appointments);
    setLocal(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
    setLocal(STORAGE_KEYS.AUDIT_LOGS, this.auditLogs);
    setLocal(STORAGE_KEYS.PAYMENTS, this.payments);
    setLocal(STORAGE_KEYS.RULES, this.rules);
  }
}

export const dataStore = DataStore.getInstance();
