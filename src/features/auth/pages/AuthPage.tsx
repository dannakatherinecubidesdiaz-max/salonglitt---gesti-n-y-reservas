import React from 'react';
import { Card } from '@/components/ui/Card';
import { LoginForm } from '../components/LoginForm';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Sparkles, LogOut, CheckCircle, ShieldCheck } from 'lucide-react';

interface AuthPageProps {
  onSuccess?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  const { currentUser, currentRole, logout } = useAuth();

  return (
    <div id="scr-01-auth-page" className="min-h-[85vh] flex flex-col items-center justify-center p-4 relative">
      {/* Decorative Y2K Glow Orbs in background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-tr from-[#FF70A6]/20 to-[#70D6FF]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Bubble Card (max-w-[480px]) */}
      <Card
        bubble
        glow="pink"
        className="w-full max-w-[480px] p-6 sm:p-8 relative z-10 border-[#FF70A6]/40 shadow-[0_15px_40px_rgba(255,112,166,0.25)]"
      >
        {/* Y2K Logo Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-[20px] bg-gradient-to-tr from-[#FF70A6] via-[#FFD670] to-[#70D6FF] p-0.5 shadow-[0_0_25px_rgba(255,112,166,0.6)] mb-3 flex items-center justify-center">
            <div className="w-full h-full bg-[#120B1C] rounded-[18px] flex items-center justify-center text-2xl text-[#FFD670]">
              <span className="animate-twinkle">✦</span>
            </div>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-wide">
            SalonGlitt
          </h1>
          <p className="text-xs text-[#C8B6E2] mt-1">
            EduPulse Beauty • Sistema de Gestión y Reservas Y2K
          </p>
        </div>

        {currentUser ? (
          /* Active Session View */
          <div className="text-center space-y-4 py-2">
            <div className="p-4 rounded-[20px] bg-[#120B1C]/80 border border-[#38E54D]/40">
              <div className="w-16 h-16 rounded-full mx-auto mb-3 overflow-hidden border-2 border-[#FF70A6] shadow-[0_0_15px_rgba(255,112,166,0.4)]">
                {currentUser.avatar_url ? (
                  <img
                    src={currentUser.avatar_url}
                    alt={currentUser.full_name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={e => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-[#2A1B45] text-white flex items-center justify-center font-bold text-xl">
                    {currentUser.full_name.charAt(0)}
                  </div>
                )}
              </div>
              <h3 className="font-heading font-bold text-lg text-white">
                {currentUser.full_name}
              </h3>
              <p className="text-xs text-[#C8B6E2] mt-0.5">{currentUser.email}</p>
              <div className="mt-3 flex justify-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#FF70A6]/20 text-[#FF70A6] border border-[#FF70A6]/40">
                  Rol: {currentRole}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#38E54D]/15 text-[#38E54D] border border-[#38E54D]/40 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Activo
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="pink"
                size="md"
                sparkle
                onClick={onSuccess}
                className="flex-1"
              >
                Ir a Mi Consola
              </Button>
              <Button
                variant="bubble"
                size="md"
                onClick={logout}
                icon={<LogOut className="w-4 h-4 text-[#FF4B4B]" />}
              >
                Salir
              </Button>
            </div>

            {/* Switch Account Section */}
            <div className="pt-4 border-t border-[#FF70A6]/20 text-left">
              <span className="text-[11px] text-[#C8B6E2] uppercase font-bold tracking-wider block mb-2">
                Cambiar de Cuenta Demo:
              </span>
              <LoginForm onSuccess={onSuccess} />
            </div>
          </div>
        ) : (
          <LoginForm onSuccess={onSuccess} />
        )}
      </Card>
    </div>
  );
};

export default AuthPage;
