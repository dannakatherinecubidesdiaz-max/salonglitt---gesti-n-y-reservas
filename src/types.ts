export type UserRole = 'CLIENT' | 'ADMIN' | 'STYLIST';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar_url?: string;
  specialty?: string;
  is_active: boolean;
  created_at?: string;
}

export type ServiceCategory = 
  | 'Corte/Barba' 
  | 'Colorimetría' 
  | 'Manicura/Nails' 
  | 'Tratamientos'
  | 'Uñas & Manicura'
  | 'Peluquería & Cabello'
  | 'Cuidado & Piel';

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
  category: ServiceCategory;
  is_active: boolean;
  color_code?: string;
  image_url?: string;
  badge?: string;
  tags?: string[];
  icon_name?: string;
}

export interface StylistSchedule {
  id: string;
  stylist_id: string;
  day_of_week: number; // 0 = Domingo, 1 = Lunes, etc.
  start_time: string; // e.g. "09:00"
  end_time: string; // e.g. "19:00"
}

export type AppointmentStatus = 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'PENDING';

export interface Appointment {
  id: string;
  client_id: string;
  stylist_id: string;
  service_id: string;
  appointment_date: string; // ISO string
  status: AppointmentStatus;
  notes?: string;
  client?: Profile;
  stylist?: Profile;
  service?: Service;
  created_at: string;
}

export type NotificationChannel = 'EMAIL' | 'WHATSAPP';
export type NotificationType = 'CONFIRMATION' | 'REMINDER_24H' | 'CANCELLATION' | 'FEEDBACK';
export type NotificationStatus = 'SENT' | 'PENDING' | 'FAILED';

export interface NotificationItem {
  id: string;
  appointment_id: string;
  channel: NotificationChannel;
  notification_type: NotificationType;
  status: NotificationStatus;
  scheduled_at: string;
  sent_at?: string;
  recipient: string;
  message_preview?: string;
}

export interface AuditLogItem {
  id: string;
  appointment_id: string;
  action: string;
  performed_by: string;
  timestamp: string;
  details?: string;
}

export interface PaymentRecord {
  id: string;
  appointment_id: string;
  amount: number;
  method: 'NEQUI' | 'DAVIPLATA' | 'CARD' | 'CASH';
  status: 'PAID' | 'PENDING';
  transaction_ref?: string;
  date: string;
}

export interface BusinessRulesConfig {
  minDaysInAdvance: number; // BR-01: 3 días (72h)
  maxDaysInAdvance: number; // BR-01: 7 días (168h)
  minCancelHoursBefore: number; // BR-02: 24 horas
  whatsappNotificationEnabled: boolean; // BR-03
  emailNotificationEnabled: boolean; // BR-03
  autoConfirmOnlineAppointments: boolean;
}
