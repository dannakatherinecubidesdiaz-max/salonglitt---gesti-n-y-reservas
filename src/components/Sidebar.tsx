import React from 'react';
import { 
  LayoutDashboard, 
  CalendarDays, 
  ListOrdered, 
  Sparkles, 
  Settings, 
  FileText, 
  UserCircle2, 
  CalendarCheck,
  Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  currentView: string;
  onNavigate: (viewId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const { currentRole } = useAuth();

  // Hide entire sidebar and administrative options when active user is a CLIENT
  if (currentRole === 'CLIENT') {
    return null;
  }

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard KPIs',
      screen: 'SCR-02',
      icon: <LayoutDashboard className="w-5 h-5" />,
      roles: ['ADMIN', 'STYLIST'],
      badge: 'Stats',
    },
    {
      id: 'services',
      label: 'Catálogo Servicios',
      screen: 'SCR-09',
      icon: <Sparkles className="w-5 h-5" />,
      roles: ['ADMIN', 'STYLIST'],
      badge: 'Catálogo',
    },
    {
      id: 'appointments',
      label: 'Gestión de Citas',
      screen: 'SCR-03',
      icon: <ListOrdered className="w-5 h-5" />,
      roles: ['ADMIN', 'STYLIST'],
      badge: 'CRUD',
    },
    {
      id: 'calendar',
      label: 'Consola Calendario',
      screen: 'SCR-07',
      icon: <CalendarDays className="w-5 h-5" />,
      roles: ['ADMIN', 'STYLIST'],
      badge: 'Multi',
    },
    {
      id: 'wizard',
      label: 'Wizard Reserva',
      screen: 'SCR-05',
      icon: <CalendarCheck className="w-5 h-5" />,
      roles: ['ADMIN', 'STYLIST', 'CLIENT'],
      badge: 'BR-01',
    },
    {
      id: 'detail360',
      label: 'Detalle 360°',
      screen: 'SCR-04',
      icon: <FileText className="w-5 h-5" />,
      roles: ['ADMIN', 'STYLIST', 'CLIENT'],
      badge: 'Audit',
    },
    {
      id: 'users',
      label: 'Gestión de Roles',
      screen: 'SCR-08',
      icon: <Users className="w-5 h-5" />,
      roles: ['ADMIN'],
      badge: 'RBAC',
    },
    {
      id: 'settings',
      label: 'Configuración Reglas',
      screen: 'SCR-06',
      icon: <Settings className="w-5 h-5" />,
      roles: ['ADMIN'],
      badge: 'Rules',
    },
    {
      id: 'auth',
      label: 'Autenticación',
      screen: 'SCR-01',
      icon: <UserCircle2 className="w-5 h-5" />,
      roles: ['ADMIN', 'STYLIST', 'CLIENT'],
      badge: 'Login',
    },
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0 bg-[#120B1C]/70 lg:min-h-[calc(100vh-65px)] border-b lg:border-b-0 lg:border-r border-[#FF70A6]/20 p-3 lg:p-4 flex lg:flex-col justify-between overflow-x-auto lg:overflow-x-visible">
      <div className="flex lg:flex-col gap-2 w-full">
        <div className="hidden lg:block px-3 py-2">
          <span className="text-[11px] font-bold tracking-wider text-[#FF70A6] uppercase flex items-center gap-1.5">
            <span className="animate-twinkle">✦</span> Módulos del Sistema
          </span>
        </div>

        <nav className="flex lg:flex-col gap-1.5 w-full">
          {navItems.map(item => {
            const isActive = currentView === item.id;
            const isRoleAllowed = item.roles.includes(currentRole);

            return (
              <button
                key={item.id}
                id={`sidebar-link-${item.id}`}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-[18px] text-xs font-heading font-medium tracking-wide transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FF70A6] to-[#FF4D8B] text-white shadow-[0_4px_18px_rgba(255,112,166,0.4)] border border-[#FF70A6]'
                    : 'text-[#C8B6E2] hover:text-white hover:bg-[#1E1332] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-white' : 'text-[#70D6FF]'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold ml-2 ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-[#2A1B45] text-[#FFD670] border border-[#FFD670]/30'
                  }`}
                >
                  {item.screen}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Y2K System Badge Footer */}
      <div className="hidden lg:block p-3.5 rounded-[20px] bg-gradient-to-br from-[#2A1B45] to-[#1E1332] border border-[#FF70A6]/30 mt-4">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs text-[#FFD670]">✦</span>
          <h5 className="text-xs font-heading font-semibold text-white">Reglas Activas</h5>
        </div>
        <p className="text-[11px] text-[#C8B6E2] leading-relaxed">
          <strong className="text-[#FF70A6]">BR-01:</strong> 72h - 168h<br />
          <strong className="text-[#70D6FF]">BR-02:</strong> Cancelación &gt; 24h<br />
          <strong className="text-[#38E54D]">BR-03:</strong> WhatsApp & Email
        </p>
      </div>
    </aside>
  );
};
