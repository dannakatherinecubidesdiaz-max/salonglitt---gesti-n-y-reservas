import { Profile, Service, Appointment, NotificationItem, StylistSchedule, BusinessRulesConfig, PaymentRecord, AuditLogItem } from '../types';

export const INITIAL_BUSINESS_RULES: BusinessRulesConfig = {
  minDaysInAdvance: 3, // BR-01: mínimo 3 días (72h)
  maxDaysInAdvance: 7, // BR-01: máximo 7 días (168h)
  minCancelHoursBefore: 24, // BR-02: 24 horas antes
  whatsappNotificationEnabled: true, // BR-03
  emailNotificationEnabled: true, // BR-03
  autoConfirmOnlineAppointments: true,
};

export const INITIAL_PROFILES: Profile[] = [
  {
    id: 'usr-admin-1',
    full_name: 'Sofía Glam (Directora)',
    email: 'admin@salonglitt.com',
    phone: '+57 300 888 1234',
    role: 'ADMIN',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    specialty: 'Master Stylist & Dirección',
    is_active: true,
  },
  {
    id: 'usr-stylist-1',
    full_name: 'Camila Rosas',
    email: 'camila@salonglitt.com',
    phone: '+57 311 234 5678',
    role: 'STYLIST',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    specialty: 'Colorimetría, Balayage & Tonalidades Pastel',
    is_active: true,
  },
  {
    id: 'usr-stylist-2',
    full_name: 'Mateo Rivera',
    email: 'mateo@salonglitt.com',
    phone: '+57 320 456 7890',
    role: 'STYLIST',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    specialty: 'Cortes Tendencia Y2K, Butterfly & Barber Glam',
    is_active: true,
  },
  {
    id: 'usr-stylist-3',
    full_name: 'Isabella Torres',
    email: 'isabella@salonglitt.com',
    phone: '+57 316 789 0123',
    role: 'STYLIST',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    specialty: 'Nail Art Holográfico, Polygel & Manicura Rusa',
    is_active: true,
  },
  {
    id: 'usr-client-1',
    full_name: 'Valentina López',
    email: 'valentina.lopez@gmail.com',
    phone: '+57 315 987 6543',
    role: 'CLIENT',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    is_active: true,
  },
  {
    id: 'usr-client-2',
    full_name: 'Daniela Pérez',
    email: 'daniela.perez@gmail.com',
    phone: '+57 301 222 3344',
    role: 'CLIENT',
    avatar_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    is_active: true,
  },
  {
    id: 'usr-client-3',
    full_name: 'Mariana Díaz',
    email: 'mariana.d@gmail.com',
    phone: '+57 318 444 5566',
    role: 'CLIENT',
    avatar_url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
    is_active: true,
  },
];

export const INITIAL_SERVICES: Service[] = [
  // 💅 Uñas & Manicura
  {
    id: 'srv-nails-1',
    name: 'Manicura Tradicional Glitt',
    description: 'Limpieza de cutículas, limado anatómico, exfoliación e hidratación profunda con esmaltado tradicional brillante de larga fijación.',
    price: 35000,
    duration_minutes: 45,
    category: 'Uñas & Manicura',
    is_active: true,
    color_code: '#FF70A6',
    image_url: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=500&auto=format&fit=crop&q=80',
    badge: 'Básico Chic',
    tags: ['Esmaltado', 'Exfoliación', 'Manicura'],
    icon_name: 'Sparkles',
  },
  {
    id: 'srv-nails-2',
    name: 'Pedicura Spa Relajante & Sales',
    description: 'Baño de burbujas aromatizadas, exfoliación con sales marinas, remoción de asperezas, masaje podal relajante y esmaltado duradero.',
    price: 55000,
    duration_minutes: 60,
    category: 'Uñas & Manicura',
    is_active: true,
    color_code: '#70D6FF',
    image_url: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=500&auto=format&fit=crop&q=80',
    badge: 'Spa Relax',
    tags: ['Pedicura', 'Sales Marinas', 'Bienestar'],
    icon_name: 'Sparkles',
  },
  {
    id: 'srv-5',
    name: 'Uñas en Semi-permanente Glow',
    description: 'Limpieza rusa combinada, nivelación con base rubber fortalecedora y esmaltado semipermanente de alta densidad intacto por 21 días.',
    price: 75000,
    duration_minutes: 50,
    category: 'Uñas & Manicura',
    is_active: true,
    color_code: '#38E54D',
    image_url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&auto=format&fit=crop&q=80',
    badge: 'Más Vendido ✦',
    tags: ['Semipermanente', 'Base Rubber', '21 Días'],
    icon_name: 'Sparkles',
  },
  {
    id: 'srv-3',
    name: 'Acrílicas Esculpidas & 3D Charms Y2K',
    description: 'Esculpido milimétrico en acrílico o polygel con encapsulado glitter, efecto aurora boreal holográfico y pedrería nostálgica estilo 2000s.',
    price: 135000,
    duration_minutes: 90,
    category: 'Uñas & Manicura',
    is_active: true,
    color_code: '#FF70A6',
    image_url: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=500&auto=format&fit=crop&q=80',
    badge: 'Y2K Icon ✦',
    tags: ['Acrílicas', 'Efecto Gel 3D', 'Glitter'],
    icon_name: 'Sparkles',
  },

  // 💇‍♀️ Peluquería & Cabello
  {
    id: 'srv-2',
    name: 'Corte Mariposa Y2K + Blowout',
    description: 'Corte en capas dinámicas y degrafilado estilo 2000s con acabado voluminoso en cepillo redondo térmico y sérum iluminador anti-frizz.',
    price: 85000,
    duration_minutes: 60,
    category: 'Peluquería & Cabello',
    is_active: true,
    color_code: '#FF70A6',
    image_url: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=500&auto=format&fit=crop&q=80',
    badge: 'Tendencia Top',
    tags: ['Capas Butterfly', 'Blowout', 'Estilo 2000s'],
    icon_name: 'Scissors',
  },
  {
    id: 'srv-hair-blower',
    name: 'Blower & Cepillado Voluminoso Glam',
    description: 'Lavado capilar con masaje craneal relajante, secado profesional con cepillado redondo para volumen extremo y fijación sedosa.',
    price: 45000,
    duration_minutes: 45,
    category: 'Peluquería & Cabello',
    is_active: true,
    color_code: '#FFD670',
    image_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=80',
    badge: 'Express Glam',
    tags: ['Lavado', 'Cepillado', 'Volumen'],
    icon_name: 'Scissors',
  },
  {
    id: 'srv-1',
    name: 'Balayage Y2K Glitt + Matizado',
    description: 'Técnica artesanal de decoloración con reflejos perlados, degradado sin marcas agresivas y baño de gloss protector de fibra capilar.',
    price: 280000,
    duration_minutes: 150,
    category: 'Peluquería & Cabello',
    is_active: true,
    color_code: '#70D6FF',
    image_url: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=500&auto=format&fit=crop&q=80',
    badge: 'Premium Color',
    tags: ['Balayage', 'Decoloración', 'Gloss'],
    icon_name: 'Scissors',
  },
  {
    id: 'srv-4',
    name: 'Keratina Orgánica Brillo Espejo',
    description: 'Alisado termodinámico progresivo 100% orgánico sin formol, nutrición ultra hidratante de aminoácidos y sellado de puntas.',
    price: 220000,
    duration_minutes: 120,
    category: 'Peluquería & Cabello',
    is_active: true,
    color_code: '#FFD670',
    image_url: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=500&auto=format&fit=crop&q=80',
    badge: 'Alisado Orgánico',
    tags: ['Keratina', 'Sin Formol', 'Efecto Espejo'],
    icon_name: 'Scissors',
  },
  {
    id: 'srv-6',
    name: 'Babylights & Tonalización Pastel',
    description: 'Micro mechas ultra delgadas para un efecto rubio luminoso natural con matiz pastel lavanda, vainilla o melocotón.',
    price: 240000,
    duration_minutes: 160,
    category: 'Peluquería & Cabello',
    is_active: true,
    color_code: '#70D6FF',
    image_url: 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=500&auto=format&fit=crop&q=80',
    badge: 'Efecto Sun-Kissed',
    tags: ['Babylights', 'Pastel', 'Rubio'],
    icon_name: 'Scissors',
  },

  // 🧖‍♀️ Cuidado & Tratamientos de la Piel
  {
    id: 'srv-skin-1',
    name: 'Limpieza Facial Profunda & Desintoxicante',
    description: 'Vapor de ozono herbal, extracción ultrasónica de impurezas, microdermoabrasión suave con punta de diamante y mascarilla descongestiva.',
    price: 95000,
    duration_minutes: 60,
    category: 'Cuidado & Piel',
    is_active: true,
    color_code: '#38E54D',
    image_url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500&auto=format&fit=crop&q=80',
    badge: 'Detox Facial',
    tags: ['Punta Diamante', 'Vapor Ozono', 'Skin Detox'],
    icon_name: 'Sparkles',
  },
  {
    id: 'srv-skin-2',
    name: 'Hidratación Facial Glow & Ácido Hialurónico',
    description: 'Shock de hidratación intensiva con electroporación transdérmica de sérums concentrados, velo de colágeno y masaje linfático rejuvenecedor.',
    price: 115000,
    duration_minutes: 50,
    category: 'Cuidado & Piel',
    is_active: true,
    color_code: '#FF70A6',
    image_url: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=500&auto=format&fit=crop&q=80',
    badge: 'Glass Skin',
    tags: ['Ácido Hialurónico', 'Lifting', 'Glow'],
    icon_name: 'Sparkles',
  },
  {
    id: 'srv-skin-3',
    name: 'Exfoliación Botánica & Renovación Skin-Care',
    description: 'Peeling enzimático botánico no abrasivo, exfoliación corporal/facial con microgránulos de albaricoque y suero antioxidante de vitamina C.',
    price: 85000,
    duration_minutes: 45,
    category: 'Cuidado & Piel',
    is_active: true,
    color_code: '#FFD670',
    image_url: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=500&auto=format&fit=crop&q=80',
    badge: 'Antioxidante',
    tags: ['Vitamina C', 'Peeling Enzimático', 'Suavidad'],
    icon_name: 'Sparkles',
  },
  {
    id: 'srv-skin-4',
    name: 'Rejuvenecimiento Skin-Care & Terapia LED',
    description: 'Protocolo regenerativo avanzado con máscara de fototerapia LED policromática, bioestimulación celular de colágeno y ampolla revitalizante.',
    price: 145000,
    duration_minutes: 75,
    category: 'Cuidado & Piel',
    is_active: true,
    color_code: '#70D6FF',
    image_url: 'https://images.unsplash.com/photo-1506152983158-b4a74a01c721?w=500&auto=format&fit=crop&q=80',
    badge: 'Terapia LED ✦',
    tags: ['Fototerapia LED', 'Colágeno', 'Anti-Age'],
    icon_name: 'Sparkles',
  },
];

export const INITIAL_SCHEDULES: StylistSchedule[] = [
  // Camila Rosas (Lunes a Sábado 9:00 - 18:00)
  ...[1, 2, 3, 4, 5, 6].map(day => ({
    id: `sch-c-${day}`,
    stylist_id: 'usr-stylist-1',
    day_of_week: day,
    start_time: '09:00',
    end_time: '18:00',
  })),
  // Mateo Rivera (Martes a Domingo 10:00 - 19:00)
  ...[2, 3, 4, 5, 6, 0].map(day => ({
    id: `sch-m-${day}`,
    stylist_id: 'usr-stylist-2',
    day_of_week: day,
    start_time: '10:00',
    end_time: '19:00',
  })),
  // Isabella Torres (Lunes a Sábado 09:30 - 18:30)
  ...[1, 2, 3, 4, 5, 6].map(day => ({
    id: `sch-i-${day}`,
    stylist_id: 'usr-stylist-3',
    day_of_week: day,
    start_time: '09:30',
    end_time: '18:30',
  })),
];

// Helper dates relative to now (e.g. today + 4 days for BR-01 compliant, today + 6 hours for BR-02 test)
const now = new Date();

const getFutureDate = (days: number, hours = 10, minutes = 0) => {
  const d = new Date(now);
  d.setDate(d.getDate() + days);
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
};

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-101',
    client_id: 'usr-client-1',
    stylist_id: 'usr-stylist-1',
    service_id: 'srv-1',
    // 4 days in future: satisfies BR-01 (3-7 days) & BR-02 (> 24h)
    appointment_date: getFutureDate(4, 11, 0),
    status: 'CONFIRMED',
    notes: 'Desea mechas rosas pastel en los mechones frontales (Y2K Chunky Highlights).',
    created_at: new Date(now.getTime() - 86400000).toISOString(),
  },
  {
    id: 'apt-102',
    client_id: 'usr-client-2',
    stylist_id: 'usr-stylist-3',
    service_id: 'srv-3',
    // 5 days in future
    appointment_date: getFutureDate(5, 14, 30),
    status: 'CONFIRMED',
    notes: 'Largo almendrado con diseño de mariposas 3D.',
    created_at: new Date(now.getTime() - 43200000).toISOString(),
  },
  {
    id: 'apt-103',
    client_id: 'usr-client-3',
    stylist_id: 'usr-stylist-2',
    service_id: 'srv-2',
    // In 6 hours (today): for demonstrating BR-02 cancellation lock (< 24h)
    appointment_date: new Date(now.getTime() + 6 * 3600 * 1000).toISOString(),
    status: 'CONFIRMED',
    notes: 'Cliente regular. Retoque de puntas y textura.',
    created_at: new Date(now.getTime() - 4 * 86400000).toISOString(),
  },
  {
    id: 'apt-104',
    client_id: 'usr-client-1',
    stylist_id: 'usr-stylist-3',
    service_id: 'srv-5',
    // In 6 days
    appointment_date: getFutureDate(6, 16, 0),
    status: 'PENDING',
    notes: 'Pendiente de confirmación de pago de anticipo.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'apt-105',
    client_id: 'usr-client-2',
    stylist_id: 'usr-stylist-1',
    service_id: 'srv-6',
    // Yesterday: completed
    appointment_date: new Date(now.getTime() - 86400000 + 4 * 3600000).toISOString(),
    status: 'COMPLETED',
    notes: 'Servicio completado a entera satisfacción. Dejó propina de $20.000.',
    created_at: new Date(now.getTime() - 5 * 86400000).toISOString(),
  },
  {
    id: 'apt-106',
    client_id: 'usr-client-3',
    stylist_id: 'usr-stylist-2',
    service_id: 'srv-2',
    // Cancelled 2 days ago
    appointment_date: new Date(now.getTime() - 2 * 86400000).toISOString(),
    status: 'CANCELLED',
    notes: 'Cancelado por viaje imprevisto de la clienta (cumplió política 24h previa).',
    created_at: new Date(now.getTime() - 6 * 86400000).toISOString(),
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    appointment_id: 'apt-101',
    channel: 'WHATSAPP',
    notification_type: 'CONFIRMATION',
    status: 'SENT',
    scheduled_at: new Date(now.getTime() - 86400000).toISOString(),
    sent_at: new Date(now.getTime() - 86390000).toISOString(),
    recipient: '+57 315 987 6543',
    message_preview: '✦ ¡Hola Valentina! Tu cita para Balayage Y2K Glitt con Camila Rosas está confirmada para el ' + new Date(INITIAL_APPOINTMENTS[0].appointment_date).toLocaleDateString() + ' a las 11:00 AM ✨.',
  },
  {
    id: 'notif-2',
    appointment_id: 'apt-101',
    channel: 'EMAIL',
    notification_type: 'CONFIRMATION',
    status: 'SENT',
    scheduled_at: new Date(now.getTime() - 86400000).toISOString(),
    sent_at: new Date(now.getTime() - 86380000).toISOString(),
    recipient: 'valentina.lopez@gmail.com',
    message_preview: 'SalonGlitt: Recibo y detalles de reserva #apt-101 con voucher digital adjunto.',
  },
  {
    id: 'notif-3',
    appointment_id: 'apt-102',
    channel: 'WHATSAPP',
    notification_type: 'CONFIRMATION',
    status: 'SENT',
    scheduled_at: new Date(now.getTime() - 43200000).toISOString(),
    sent_at: new Date(now.getTime() - 43150000).toISOString(),
    recipient: '+57 301 222 3344',
    message_preview: '✦ ¡Daniela! Confirmamos tu cita para Uñas Acrílicas Holográficas con Isabella Torres ✨.',
  },
  {
    id: 'notif-4',
    appointment_id: 'apt-103',
    channel: 'WHATSAPP',
    notification_type: 'REMINDER_24H',
    status: 'SENT',
    scheduled_at: new Date(now.getTime() - 18 * 3600000).toISOString(),
    sent_at: new Date(now.getTime() - 17 * 3600000).toISOString(),
    recipient: '+57 318 444 5566',
    message_preview: '✦ Recordatorio: Hoy tienes cita a las ' + new Date(INITIAL_APPOINTMENTS[2].appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' con Mateo Rivera. ¡Te esperamos en SalonGlitt!',
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'aud-1',
    appointment_id: 'apt-101',
    action: 'CREACIÓN_DE_CITA',
    performed_by: 'Valentina López (Cliente)',
    timestamp: new Date(now.getTime() - 86400000).toISOString(),
    details: 'Reserva agendada via Web Wizard en ventana BR-01 (+4 días). Notificaciones WhatsApp & Email disparadas.',
  },
  {
    id: 'aud-2',
    appointment_id: 'apt-101',
    action: 'VALIDACIÓN_AUTOMÁTICA_BR01',
    performed_by: 'Sistema SalonGlitt',
    timestamp: new Date(now.getTime() - 86395000).toISOString(),
    details: 'Validación de margen temporal: 96h > 72h (3 días) y < 168h (7 días) -> Aprobado.',
  },
  {
    id: 'aud-3',
    appointment_id: 'apt-103',
    action: 'ENVÍO_RECORDATORIO_24H',
    performed_by: 'Bot Notificador SalonGlitt',
    timestamp: new Date(now.getTime() - 18 * 3600000).toISOString(),
    details: 'Disparo de recordatorio automático por WhatsApp Twilio/Meta Cloud API.',
  }
];

export const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: 'pay-1',
    appointment_id: 'apt-101',
    amount: 280000,
    method: 'NEQUI',
    status: 'PAID',
    transaction_ref: 'NQ-992817264',
    date: new Date(now.getTime() - 86400000).toISOString(),
  },
  {
    id: 'pay-2',
    appointment_id: 'apt-102',
    amount: 135000,
    method: 'DAVIPLATA',
    status: 'PAID',
    transaction_ref: 'DP-48291048',
    date: new Date(now.getTime() - 43200000).toISOString(),
  },
  {
    id: 'pay-3',
    appointment_id: 'apt-103',
    amount: 85000,
    method: 'CARD',
    status: 'PAID',
    transaction_ref: 'CRD-881920',
    date: new Date(now.getTime() - 3600000).toISOString(),
  }
];
