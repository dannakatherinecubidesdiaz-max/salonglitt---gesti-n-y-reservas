import React from 'react';
import { Sparkles, Calendar, Plus, User, Shield, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

interface NavbarProps {
  onNavigate: (viewId: string) => void;
  currentView: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView }) => {
  const { currentUser, currentRole, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#FF70A6]/20 bg-[#120B1C]/90 backdrop-blur-md px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        {/* Logo & Brand */}
        <div 
          onClick={() => onNavigate(currentRole === 'CLIENT' ? 'services' : 'dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
          id="salonglitt-brand-logo"
        >
          <div className="w-10 h-10 rounded-[14px] bg-gradient-to-tr from-[#FF70A6] to-[#70D6FF] flex items-center justify-center text-white shadow-[0_0_20px_rgba(255,112,166,0.5)] group-hover:scale-105 transition-transform">
            <span className="font-heading font-black text-xl text-[#120B1C]">✦</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#FF70A6] via-[#FFD670] to-[#70D6FF]">
                SalonGlitt
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FF70A6]/20 text-[#FF70A6] border border-[#FF70A6]/40 font-mono font-bold hidden sm:inline-block">
                #11 Y2K
              </span>
            </div>
            <span className="text-[10px] text-[#C8B6E2] tracking-widest uppercase">
              Beauty & Hair Studio
            </span>
          </div>
        </div>

        {/* Client Top Navigation Links when active role is CLIENT */}
        {currentRole === 'CLIENT' ? (
          <div className="flex items-center gap-1.5 p-1 bg-[#1E1332] rounded-full border border-[#FF70A6]/30">
            <button
              onClick={() => onNavigate('services')}
              className={`px-3 py-1.5 rounded-full text-xs font-heading font-semibold transition-all flex items-center gap-1.5 ${
                currentView === 'services' || currentView === 'catalog'
                  ? 'bg-gradient-to-r from-[#FF70A6] to-[#70D6FF] text-[#120B1C] shadow-[0_2px_10px_rgba(255,112,166,0.4)]'
                  : 'text-[#C8B6E2] hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Servicios</span>
            </button>
            <button
              onClick={() => onNavigate('my-appointments')}
              className={`px-3 py-1.5 rounded-full text-xs font-heading font-semibold transition-all flex items-center gap-1.5 ${
                currentView === 'my-appointments'
                  ? 'bg-gradient-to-r from-[#FF70A6] to-[#70D6FF] text-[#120B1C] shadow-[0_2px_10px_rgba(255,112,166,0.4)]'
                  : 'text-[#C8B6E2] hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Mis Citas</span>
            </button>
            <button
              onClick={() => onNavigate('wizard')}
              className={`px-3 py-1.5 rounded-full text-xs font-heading font-semibold transition-all flex items-center gap-1.5 ${
                currentView === 'wizard'
                  ? 'bg-gradient-to-r from-[#FF70A6] to-[#70D6FF] text-[#120B1C] shadow-[0_2px_10px_rgba(255,112,166,0.4)]'
                  : 'text-[#C8B6E2] hover:text-white'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Agendar</span>
            </button>
            <button
              onClick={() => onNavigate('profile')}
              className={`px-3 py-1.5 rounded-full text-xs font-heading font-semibold transition-all flex items-center gap-1.5 ${
                currentView === 'profile'
                  ? 'bg-gradient-to-r from-[#FF70A6] to-[#70D6FF] text-[#120B1C] shadow-[0_2px_10px_rgba(255,112,166,0.4)]'
                  : 'text-[#C8B6E2] hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Mi Perfil</span>
            </button>
          </div>
        ) : (
          /* Authenticated staff role */
          <div className="hidden md:flex items-center gap-1.5 p-1 bg-[#1E1332] rounded-full border border-[#FF70A6]/30">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FF70A6] text-white flex items-center gap-1">
              <Shield className="w-3 h-3" />
              {currentRole === 'ADMIN' ? 'Administrador' : 'Estilista'}
            </span>
          </div>
        )}

        {/* Right Action: Wizard CTA & Profile */}
        <div className="flex items-center gap-3">
          <Button
            variant="pink"
            size="sm"
            sparkle
            icon={<Plus className="w-4 h-4" />}
            onClick={() => onNavigate('wizard')}
            className="shadow-[0_4px_16px_rgba(255,112,166,0.4)]"
            id="nav-agendar-cta"
          >
            <span className="hidden sm:inline">Agendar</span> Cita
          </Button>

          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate(currentRole === 'CLIENT' ? 'profile' : 'auth')}
                className="flex items-center gap-2.5 pl-2 py-1 pr-3 rounded-full bg-[#1E1332] border border-[#FF70A6]/30 hover:border-[#FF70A6] transition-colors"
                title={currentRole === 'CLIENT' ? 'Editar mi perfil personal' : 'Ver perfil'}
              >
              {currentUser.avatar_url ? (
                <img
                  src={currentUser.avatar_url}
                  alt={currentUser.full_name}
                  className="w-7 h-7 rounded-full object-cover border border-[#FF70A6]"
                  referrerPolicy="no-referrer"
                  onError={e => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
                  }}
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-[#FF70A6]/30 text-[#FF70A6] flex items-center justify-center font-bold text-xs">
                  {currentUser.full_name.charAt(0)}
                </div>
              )}
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-medium text-white max-w-[110px] truncate leading-tight">
                  {currentUser.full_name}
                </span>
                <span className="text-[10px] text-[#70D6FF] uppercase font-mono">
                  {currentRole}
                </span>
              </div>
              </button>
              <button
                onClick={logout}
                className="p-2 rounded-full text-[#C8B6E2] hover:text-white hover:bg-white/10"
                title="Cerrar sesión"
                aria-label="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Button
              variant="bubble"
              size="sm"
              onClick={() => onNavigate('auth')}
            >
              Ingresar
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
