import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Shield, 
  Scissors, 
  User, 
  Search, 
  Filter, 
  Sparkles, 
  CheckCircle2, 
  ArrowRightLeft, 
  ShieldAlert, 
  UserCheck, 
  Lock,
  Edit3,
  X
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { dataStore } from '@/lib/dataStore';
import { Profile, UserRole } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface UserRoleManagementPageProps {
  onNavigate: (viewId: string) => void;
}

export const UserRoleManagementPage: React.FC<UserRoleManagementPageProps> = ({ onNavigate }) => {
  const { currentUser, currentRole, updateUserRole } = useAuth();
  const toast = useToast();

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | UserRole>('ALL');
  const [loading, setLoading] = useState(true);

  // Modal for changing role
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>('CLIENT');
  const [specialty, setSpecialty] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    const list = await dataStore.getProfiles();
    setProfiles(list);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenEdit = (user: Profile) => {
    setEditingUser(user);
    setSelectedRole(user.role);
    setSpecialty(user.specialty || '');
  };

  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setSaving(true);
    const res = await updateUserRole(
      editingUser.id,
      selectedRole,
      selectedRole === 'STYLIST' ? specialty : undefined
    );
    setSaving(false);

    if (res.success) {
      toast.success(
        'Rol Actualizado con Éxito ✦',
        `El usuario ${editingUser.full_name} ahora tiene permisos de ${selectedRole}. Las sesiones activas se actualizarán de inmediato.`
      );
      setEditingUser(null);
      await fetchUsers();
    } else {
      toast.error('Error al actualizar rol', res.error);
    }
  };

  // Filtered profiles
  const filteredProfiles = profiles.filter(p => {
    const matchesSearch = 
      p.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.phone && p.phone.includes(searchTerm));
    const matchesRole = roleFilter === 'ALL' || p.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Role Counts
  const adminCount = profiles.filter(p => p.role === 'ADMIN').length;
  const stylistCount = profiles.filter(p => p.role === 'STYLIST').length;
  const clientCount = profiles.filter(p => p.role === 'CLIENT').length;

  // Role Badges Helper
  const renderRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono bg-[#FF70A6]/20 text-[#FF70A6] border border-[#FF70A6]/40 shadow-[0_0_12px_rgba(255,112,166,0.3)]">
            <Shield className="w-3.5 h-3.5" /> Administrador
          </span>
        );
      case 'STYLIST':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono bg-[#70D6FF]/20 text-[#70D6FF] border border-[#70D6FF]/40 shadow-[0_0_12px_rgba(112,214,255,0.3)]">
            <Scissors className="w-3.5 h-3.5" /> Estilista Pro
          </span>
        );
      case 'CLIENT':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono bg-[#FFD670]/20 text-[#FFD670] border border-[#FFD670]/40 shadow-[0_0_12px_rgba(255,214,112,0.3)]">
            <User className="w-3.5 h-3.5" /> Cliente VIP
          </span>
        );
    }
  };

  // If user is not admin, show access denied barrier
  if (currentRole !== 'ADMIN') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <Card bubble glow="pink" className="max-w-md p-8 border-[#FF4B4B]/40">
          <div className="w-16 h-16 rounded-full bg-[#FF4B4B]/20 text-[#FF4B4B] mx-auto flex items-center justify-center mb-4 border border-[#FF4B4B]/50">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="font-heading font-black text-xl text-white">Acceso Restringido (Guard RBAC)</h2>
          <p className="text-xs text-[#C8B6E2] mt-2 mb-6">
            Este panel de gestión de roles requiere privilegios de <strong className="text-[#FF70A6]">ADMINISTRADOR</strong>. Tu rol actual es <span className="font-mono text-[#70D6FF]">{currentRole}</span>.
          </p>
          <Button variant="pink" size="md" sparkle onClick={() => onNavigate('dashboard')}>
            Volver al Panel Principal
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div id="scr-08-user-roles" className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#FF70A6] animate-twinkle">✦</span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#70D6FF]">
              Control de Accesos • RBAC SCR-08
            </span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white mt-1">
            Gestión de Roles y Permisos de Usuarios
          </h1>
          <p className="text-xs sm:text-sm text-[#C8B6E2]">
            Asigna o modifica los roles del sistema (Administrador, Estilista, Cliente) con sincronización inmediata de permisos.
          </p>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card bubble className="p-4 flex items-center justify-between border-white/10">
          <div>
            <span className="text-[11px] text-[#C8B6E2] font-semibold uppercase">Total Usuarios</span>
            <div className="text-2xl font-heading font-black text-white mt-1">{profiles.length}</div>
          </div>
          <div className="p-2.5 rounded-full bg-white/5 text-[#C8B6E2]">
            <Users className="w-5 h-5" />
          </div>
        </Card>

        <Card bubble glow="pink" className="p-4 flex items-center justify-between border-[#FF70A6]/30">
          <div>
            <span className="text-[11px] text-[#FF70A6] font-semibold uppercase">Administradores</span>
            <div className="text-2xl font-heading font-black text-white mt-1">{adminCount}</div>
          </div>
          <div className="p-2.5 rounded-full bg-[#FF70A6]/20 text-[#FF70A6]">
            <Shield className="w-5 h-5" />
          </div>
        </Card>

        <Card bubble glow="cyan" className="p-4 flex items-center justify-between border-[#70D6FF]/30">
          <div>
            <span className="text-[11px] text-[#70D6FF] font-semibold uppercase">Estilistas Pro</span>
            <div className="text-2xl font-heading font-black text-white mt-1">{stylistCount}</div>
          </div>
          <div className="p-2.5 rounded-full bg-[#70D6FF]/20 text-[#70D6FF]">
            <Scissors className="w-5 h-5" />
          </div>
        </Card>

        <Card bubble glow="yellow" className="p-4 flex items-center justify-between border-[#FFD670]/30">
          <div>
            <span className="text-[11px] text-[#FFD670] font-semibold uppercase">Clientes VIP</span>
            <div className="text-2xl font-heading font-black text-white mt-1">{clientCount}</div>
          </div>
          <div className="p-2.5 rounded-full bg-[#FFD670]/20 text-[#FFD670]">
            <User className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card bubble className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between border-white/10">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#C8B6E2] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre, correo..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-[#120B1C] border border-[#FF70A6]/30 focus:border-[#FF70A6] text-white text-xs rounded-full pl-9 pr-4 py-2.5 outline-none transition-all placeholder:text-[#C8B6E2]/50"
          />
        </div>

        {/* Role Filter Pills */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-[#120B1C] rounded-full border border-white/10 self-start md:self-auto">
          {(['ALL', 'ADMIN', 'STYLIST', 'CLIENT'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setRoleFilter(tab)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                roleFilter === tab
                  ? 'bg-gradient-to-r from-[#FF70A6] to-[#70D6FF] text-[#120B1C] shadow-[0_2px_10px_rgba(255,112,166,0.4)]'
                  : 'text-[#C8B6E2] hover:text-white'
              }`}
            >
              {tab === 'ALL' ? 'Todos' : tab === 'ADMIN' ? 'Admins' : tab === 'STYLIST' ? 'Estilistas' : 'Clientes'}
            </button>
          ))}
        </div>
      </Card>

      {/* Users Table / Grid */}
      <Card bubble className="p-0 overflow-hidden border-[#FF70A6]/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#FF70A6]/20 bg-[#120B1C]/60 text-[11px] font-mono uppercase text-[#C8B6E2]">
                <th className="p-4">Usuario</th>
                <th className="p-4">Contacto</th>
                <th className="p-4">Rol Asignado</th>
                <th className="p-4">Especialidad</th>
                <th className="p-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FF70A6]/10 text-xs">
              {filteredProfiles.map(u => (
                <tr key={u.id} className="hover:bg-[#FF70A6]/5 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {u.avatar_url ? (
                        <img
                          src={u.avatar_url}
                          alt={u.full_name}
                          className="w-10 h-10 rounded-full object-cover border border-[#FF70A6]/40"
                          referrerPolicy="no-referrer"
                          onError={e => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#2A1B45] text-white flex items-center justify-center font-bold text-sm border border-[#FF70A6]/30">
                          {u.full_name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="font-heading font-bold text-sm text-white flex items-center gap-2">
                          {u.full_name}
                          {currentUser?.id === u.id && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#38E54D]/20 text-[#38E54D] border border-[#38E54D]/40 font-mono font-bold">
                              Tú
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-[#C8B6E2]">{u.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-[#C8B6E2] font-mono text-xs">
                    {u.phone || 'Sin teléfono'}
                  </td>
                  <td className="p-4">
                    {renderRoleBadge(u.role)}
                  </td>
                  <td className="p-4 text-[#C8B6E2]">
                    {u.specialty ? (
                      <span className="text-xs text-white bg-[#120B1C] px-2.5 py-1 rounded-lg border border-[#70D6FF]/30 inline-block max-w-[200px] truncate">
                        {u.specialty}
                      </span>
                    ) : (
                      <span className="text-[11px] text-gray-500">—</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <Button
                      variant="bubble"
                      size="sm"
                      onClick={() => handleOpenEdit(u)}
                      icon={<ArrowRightLeft className="w-3.5 h-3.5 text-[#FF70A6]" />}
                    >
                      Cambiar Rol
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Role Change Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-[#120B1C]/80 backdrop-blur-md flex items-center justify-center p-4">
          <Card bubble glow="pink" className="w-full max-w-lg p-6 border-[#FF70A6]/40 relative">
            <button
              onClick={() => setEditingUser(null)}
              className="absolute top-4 right-4 p-2 text-[#C8B6E2] hover:text-white rounded-full bg-white/5"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-full bg-[#FF70A6]/20 text-[#FF70A6]">
                <ArrowRightLeft className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-black text-lg text-white">
                  Reasignar Rol de Usuario
                </h3>
                <p className="text-xs text-[#C8B6E2]">
                  Modifica los privilegios de {editingUser.full_name}
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveRole} className="space-y-4">
              <div className="p-3.5 rounded-[16px] bg-[#120B1C]/90 border border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#2A1B45] text-[#FF70A6] flex items-center justify-center font-bold">
                  {editingUser.full_name.charAt(0)}
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">{editingUser.full_name}</span>
                  <span className="text-[11px] text-[#C8B6E2] block">{editingUser.email}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#C8B6E2] block mb-2">
                  Selecciona el Nuevo Rol:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('CLIENT')}
                    className={`p-3 rounded-[16px] text-xs font-heading font-bold border transition-all text-center flex flex-col items-center gap-1.5 ${
                      selectedRole === 'CLIENT'
                        ? 'bg-[#FFD670]/20 border-[#FFD670] text-[#FFD670] shadow-[0_0_12px_rgba(255,214,112,0.3)]'
                        : 'bg-[#120B1C] border-white/10 text-[#C8B6E2]'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>Cliente</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('STYLIST')}
                    className={`p-3 rounded-[16px] text-xs font-heading font-bold border transition-all text-center flex flex-col items-center gap-1.5 ${
                      selectedRole === 'STYLIST'
                        ? 'bg-[#70D6FF]/20 border-[#70D6FF] text-[#70D6FF] shadow-[0_0_12px_rgba(112,214,255,0.3)]'
                        : 'bg-[#120B1C] border-white/10 text-[#C8B6E2]'
                    }`}
                  >
                    <Scissors className="w-4 h-4" />
                    <span>Estilista</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('ADMIN')}
                    className={`p-3 rounded-[16px] text-xs font-heading font-bold border transition-all text-center flex flex-col items-center gap-1.5 ${
                      selectedRole === 'ADMIN'
                        ? 'bg-[#FF70A6]/20 border-[#FF70A6] text-[#FF70A6] shadow-[0_0_12px_rgba(255,112,166,0.3)]'
                        : 'bg-[#120B1C] border-white/10 text-[#C8B6E2]'
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    <span>Administrador</span>
                  </button>
                </div>
              </div>

              {selectedRole === 'STYLIST' && (
                <Input
                  label="Especialidad del Estilista"
                  placeholder="Ej. Colorimetría, Balayage & Y2K Tones"
                  value={specialty}
                  onChange={e => setSpecialty(e.target.value)}
                  icon={<Scissors className="w-4 h-4" />}
                  helperText="Visible en el catálogo del Wizard de reservas"
                  required
                />
              )}

              <div className="p-3 rounded-[14px] bg-[#120B1C] border border-[#FF70A6]/20 text-[11px] text-[#C8B6E2] space-y-1">
                <span className="font-bold text-white block">✦ Efecto Inmediato:</span>
                <p>
                  Al guardar, se actualiza el registro en la base de datos y la sesión del usuario reflejará inmediatamente los nuevos permisos sin requerir re-registro.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="bubble"
                  size="md"
                  onClick={() => setEditingUser(null)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="pink"
                  size="md"
                  sparkle
                  disabled={saving}
                >
                  {saving ? 'Guardando...' : 'Confirmar Cambio de Rol'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Architectural RBAC Permissions Card */}
      <Card bubble glow="cyan" className="p-6 border-[#70D6FF]/20 space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#70D6FF]" />
          <h3 className="font-heading font-black text-base text-white">
            Matriz de Permisos por Rol (RBAC Architecture)
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-[18px] bg-[#120B1C]/80 border border-[#FF70A6]/30 space-y-2">
            <span className="font-bold text-[#FF70A6] block uppercase tracking-wider">👑 Administrador</span>
            <ul className="text-[#C8B6E2] space-y-1.5 list-disc list-inside">
              <li>Control total del sistema</li>
              <li>Reasignación de roles y usuarios</li>
              <li>Ajuste de parámetros BR-01, BR-02, BR-03</li>
              <li>Métricas financieras y KPIs (Dashboard)</li>
              <li>Auditoría completa de cancelaciones</li>
            </ul>
          </div>

          <div className="p-4 rounded-[18px] bg-[#120B1C]/80 border border-[#70D6FF]/30 space-y-2">
            <span className="font-bold text-[#70D6FF] block uppercase tracking-wider">✂ Estilista Pro</span>
            <ul className="text-[#C8B6E2] space-y-1.5 list-disc list-inside">
              <li>Consola de calendario semanal/diario</li>
              <li>Visualización de citas asignadas</li>
              <li>Actualización de estado (Completar cita)</li>
              <li>Detalle 360° del historial del cliente</li>
            </ul>
          </div>

          <div className="p-4 rounded-[18px] bg-[#120B1C]/80 border border-[#FFD670]/30 space-y-2">
            <span className="font-bold text-[#FFD670] block uppercase tracking-wider">🌸 Cliente VIP</span>
            <ul className="text-[#C8B6E2] space-y-1.5 list-disc list-inside">
              <li>Wizard de reserva de citas (SCR-05)</li>
              <li>Consulta de catálogo de servicios</li>
              <li>Historial de citas propias</li>
              <li>Cancelación con anticipación (BR-02)</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UserRoleManagementPage;
