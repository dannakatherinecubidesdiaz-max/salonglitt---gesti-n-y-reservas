import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Sparkles, 
  Save, 
  ShieldCheck, 
  ArrowLeft, 
  Camera, 
  CheckCircle2, 
  Lock, 
  Heart, 
  CalendarCheck
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useAppointments } from '@/hooks/useAppointments';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface ClientProfilePageProps {
  onNavigate: (viewId: string) => void;
}

const PRESET_AVATARS: string[] = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
];

export const ClientProfilePage: React.FC<ClientProfilePageProps> = ({ onNavigate }) => {
  const { currentUser, updateCurrentUserProfile } = useAuth();
  const { appointments } = useAppointments();
  const toast = useToast();

  const [fullName, setFullName] = useState(currentUser?.full_name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatar_url || PRESET_AVATARS[0]);
  const [saving, setSaving] = useState(false);

  const clientAppointmentsCount = appointments.filter(a => a.client_id === currentUser?.id).length;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      toast.error('Campos requeridos', 'Por favor ingresa tu nombre y correo.');
      return;
    }

    setSaving(true);
    const res = await updateCurrentUserProfile({
      full_name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      avatar_url: avatarUrl,
    });
    setSaving(false);

    if (res.success) {
      toast.success('¡Perfil Actualizado! ✦', 'Tus datos personales se han guardado correctamente.');
    } else {
      toast.error('Error al guardar', res.error);
    }
  };

  return (
    <div id="scr-client-profile" className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="bubble"
          size="sm"
          onClick={() => onNavigate('my-appointments')}
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          Mis Citas
        </Button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF70A6]/20 text-[#FF70A6] border border-[#FF70A6]/40 text-xs font-mono font-bold">
          <Sparkles className="w-3.5 h-3.5" /> Mi Perfil Personal
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Loyalty summary */}
        <Card bubble glow="pink" className="p-6 text-center space-y-4 md:col-span-1 border-[#FF70A6]/30">
          <div className="relative w-28 h-28 mx-auto">
            <img
              src={avatarUrl}
              alt={fullName}
              className="w-full h-full rounded-full object-cover border-4 border-[#FF70A6] shadow-[0_0_25px_rgba(255,112,166,0.5)]"
              referrerPolicy="no-referrer"
              onError={e => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80';
              }}
            />
            <div className="absolute -bottom-1 -right-1 p-2 rounded-full bg-[#70D6FF] text-[#120B1C] shadow-md border-2 border-[#120B1C]">
              <Heart className="w-4 h-4 fill-current" />
            </div>
          </div>

          <div>
            <h2 className="font-heading font-black text-xl text-white">
              {fullName || 'Cliente VIP'}
            </h2>
            <span className="text-xs px-3 py-0.5 rounded-full bg-[#FFD670]/20 text-[#FFD670] border border-[#FFD670]/40 font-mono font-bold inline-block mt-1">
              🌸 Cliente Frecuente
            </span>
          </div>

          {/* Preset Avatar selector */}
          <div className="pt-2 border-t border-white/10 text-left">
            <span className="text-[11px] text-[#C8B6E2] font-semibold block mb-2">
              Elige tu Avatar Glam:
            </span>
            <div className="flex items-center justify-center gap-2">
              {PRESET_AVATARS.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setAvatarUrl(url)}
                  className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-transform ${
                    avatarUrl === url
                      ? 'border-[#FF70A6] scale-110 shadow-[0_0_10px_rgba(255,112,166,0.6)]'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={url}
                    alt="Preset"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={e => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80';
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Appointments Counter */}
          <div className="p-3.5 rounded-[18px] bg-[#120B1C]/80 border border-white/10 text-left space-y-1">
            <span className="text-[10px] text-[#C8B6E2] uppercase font-mono block">Historial Personal</span>
            <div className="text-xl font-heading font-black text-[#70D6FF] flex items-center gap-2">
              <CalendarCheck className="w-5 h-5" />
              <span>{clientAppointmentsCount} {clientAppointmentsCount === 1 ? 'Cita' : 'Citas'}</span>
            </div>
          </div>
        </Card>

        {/* Right Column: Edit Details Form */}
        <Card bubble glow="cyan" className="p-6 md:col-span-2 border-white/10 space-y-5">
          <div>
            <h3 className="font-heading font-black text-xl text-white flex items-center gap-2">
              <span>Editar Información Personal</span>
              <Sparkles className="w-4 h-4 text-[#FF70A6]" />
            </h3>
            <p className="text-xs text-[#C8B6E2] mt-1">
              Mantén tus datos actualizados para recibir tus confirmaciones y vouchers por WhatsApp.
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <Input
              label="Nombre Completo"
              placeholder="Ej. Valentina López"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              icon={<User className="w-4 h-4" />}
              required
            />

            <Input
              label="Correo Electrónico"
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="WhatsApp / Celular"
              placeholder="+57 315 000 0000"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              icon={<Phone className="w-4 h-4" />}
              helperText="Utilizado para despachar recordatorios automáticos 24h antes (BR-03)"
              required
            />

            {/* Privacy Box */}
            <div className="p-4 rounded-[20px] bg-[#120B1C]/80 border border-[#38E54D]/30 flex items-start gap-3 text-xs text-[#C8B6E2]">
              <Lock className="w-5 h-5 text-[#38E54D] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-heading">Privacidad & Seguridad Garantizada</strong>
                <p className="mt-0.5 text-[11px] leading-relaxed">
                  Tus datos son 100% privados. No compartimos tu teléfono ni correo con otros clientes o terceros.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <Button
                type="button"
                variant="bubble"
                size="md"
                onClick={() => onNavigate('my-appointments')}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="pink"
                size="md"
                sparkle
                disabled={saving}
                icon={<Save className="w-4 h-4" />}
              >
                {saving ? 'Guardando...' : 'Guardar Cambios ✦'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ClientProfilePage;
