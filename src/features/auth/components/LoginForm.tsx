import React, { useState } from 'react';
import { Mail, Lock, User, Phone, LogIn, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, signUp } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegister) {
        if (!fullName.trim() || !email.trim() || password.length < 8) {
          toast.error('Campos requeridos', 'Ingresa tu nombre, correo y una contraseña de al menos 8 caracteres.');
          setLoading(false);
          return;
        }
        const res = await signUp({
          full_name: fullName,
          email,
          phone,
          password,
        });
        if (res.success) {
          if (res.needsEmailConfirmation) {
            toast.info('Confirma tu correo', 'Revisa el mensaje de confirmación de Supabase y luego inicia sesión.');
          } else {
            toast.success('¡Bienvenida a SalonGlitt! ✦', 'Tu cuenta ha sido creada exitosamente.');
            onSuccess?.();
          }
        } else {
          toast.error('Error al registrarse', res.error);
        }
      } else {
        if (!email.trim() || !password) {
          toast.error('Campos requeridos', 'Ingresa tu correo electrónico y contraseña.');
          setLoading(false);
          return;
        }

        const res = await login(email, password);
        if (res.success) {
          toast.success('Sesión Iniciada ✦', 'Bienvenida a tu consola de SalonGlitt.');
          onSuccess?.();
        } else {
          const errorMessage = res.error?.toLowerCase().includes('email not confirmed')
            ? 'Este correo aún no está confirmado. Revisa el enlace enviado por Supabase o desactiva Confirm email en Auth > Providers > Email para desarrollo.'
            : res.error?.toLowerCase().includes('invalid login credentials')
              ? 'Supabase no reconoce esta cuenta o contraseña. Comprueba que el usuario exista en Auth > Users del mismo proyecto indicado por VITE_SUPABASE_URL. Si existe, restablece su contraseña desde Supabase; el seed solo confirma usuarios ya creados.'
            : res.error;
          toast.error('Error de autenticación', errorMessage);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Toggle Pill Iniciar Sesión / Registrarse */}
      <div className="flex p-1.5 bg-[#120B1C]/80 rounded-full border border-[#FF70A6]/30 mb-6 max-w-xs mx-auto">
        <button
          type="button"
          onClick={() => setIsRegister(false)}
          className={`flex-1 py-2 text-xs font-heading font-semibold rounded-full transition-all ${
            !isRegister
              ? 'bg-gradient-to-r from-[#FF70A6] to-[#FF4D8B] text-white shadow-[0_4px_15px_rgba(255,112,166,0.4)]'
              : 'text-[#C8B6E2] hover:text-white'
          }`}
        >
          Iniciar Sesión
        </button>
        <button
          type="button"
          onClick={() => setIsRegister(true)}
          className={`flex-1 py-2 text-xs font-heading font-semibold rounded-full transition-all ${
            isRegister
              ? 'bg-gradient-to-r from-[#70D6FF] to-[#38B6FF] text-[#120B1C] shadow-[0_4px_15px_rgba(112,214,255,0.4)]'
              : 'text-[#C8B6E2] hover:text-white'
          }`}
        >
          Registrarse
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegister && (
          <>
            <Input
              label="Nombre Completo"
              placeholder="Ej. Valentina López"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              icon={<User className="w-4 h-4" />}
              required
            />
            <Input
              label="WhatsApp / Celular"
              placeholder="+57 315 000 0000"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              icon={<Phone className="w-4 h-4" />}
              helperText="Requerido para notificaciones automáticas BR-03"
            />
          </>
        )}

        <Input
          label="Correo Electrónico"
          type="email"
          placeholder="tu@correo.com (ej. admin@salonglitt.com)"
          value={email}
          onChange={e => setEmail(e.target.value)}
          icon={<Mail className="w-4 h-4" />}
          required
        />

        <Input
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={e => setPassword(e.target.value)}
          icon={<Lock className="w-4 h-4" />}
          helperText={isRegister ? 'Usa al menos 8 caracteres.' : undefined}
          minLength={isRegister ? 8 : undefined}
          required={!isRegister}
        />

        <Button
          type="submit"
          variant={isRegister ? 'cyan' : 'pink'}
          size="lg"
          sparkle
          disabled={loading}
          className="w-full mt-4"
          icon={isRegister ? <ArrowRight className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
        >
          {loading ? 'Procesando...' : isRegister ? 'Crear mi Cuenta ✦' : 'Entrar a SalonGlitt ✦'}
        </Button>
      </form>

    </div>
  );
};

export default LoginForm;
