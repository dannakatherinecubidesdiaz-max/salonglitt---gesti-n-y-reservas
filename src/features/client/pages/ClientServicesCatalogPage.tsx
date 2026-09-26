import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  Search, 
  Filter, 
  Scissors, 
  Heart, 
  CheckCircle2, 
  ArrowRight, 
  Info, 
  Star, 
  ShieldCheck, 
  X,
  ChevronRight,
  Smile,
  Layers,
  Sparkle
} from 'lucide-react';
import { useServices } from '@/hooks/useServices';
import { useAppointments } from '@/hooks/useAppointments';
import { useAuth } from '@/context/AuthContext';
import { Service } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface ClientServicesCatalogPageProps {
  onNavigate: (viewId: string, extraData?: any) => void;
}

type TabCategory = 'ALL' | 'Uñas & Manicura' | 'Peluquería & Cabello' | 'Cuidado & Piel';

export const ClientServicesCatalogPage: React.FC<ClientServicesCatalogPageProps> = ({ onNavigate }) => {
  const { services, isLoading } = useServices();
  const { appointments } = useAppointments();
  const { currentUser } = useAuth();

  const [activeCategory, setActiveCategory] = useState<TabCategory>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedServiceForModal, setSelectedServiceForModal] = useState<Service | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('salonglitt_client_favs');
      return saved ? JSON.parse(saved) : ['srv-3', 'srv-2'];
    } catch {
      return ['srv-3', 'srv-2'];
    }
  });

  const toggleFavorite = (serviceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      const next = prev.includes(serviceId) ? prev.filter(id => id !== serviceId) : [...prev, serviceId];
      try {
        localStorage.setItem('salonglitt_client_favs', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Count active client appointments
  const myUpcomingAppointmentsCount = useMemo(() => {
    if (!currentUser) return 0;
    const now = new Date();
    return appointments.filter(
      a => a.client_id === currentUser.id && a.status !== 'CANCELLED' && new Date(a.appointment_date) >= now
    ).length;
  }, [appointments, currentUser]);

  // Format price in COP
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Format duration (e.g. 90 -> 1h 30 min)
  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m} min` : `${h}h`;
  };

  const imageFallback = 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&auto=format&fit=crop&q=80';

  // Category Tabs Configuration
  const categoryTabs: { id: TabCategory; label: string; icon: string; count: number }[] = [
    { 
      id: 'ALL', 
      label: 'Todos los Servicios', 
      icon: '✨', 
      count: services.length 
    },
    { 
      id: 'Uñas & Manicura', 
      label: 'Uñas & Manicura', 
      icon: '💅', 
      count: services.filter(s => s.category === 'Uñas & Manicura' || s.category === 'Manicura/Nails').length 
    },
    { 
      id: 'Peluquería & Cabello', 
      label: 'Peluquería & Cabello', 
      icon: '💇‍♀️', 
      count: services.filter(s => s.category === 'Peluquería & Cabello' || s.category === 'Corte/Barba' || s.category === 'Colorimetría' || s.category === 'Tratamientos').length 
    },
    { 
      id: 'Cuidado & Piel', 
      label: 'Cuidado & Piel', 
      icon: '🧖‍♀️', 
      count: services.filter(s => s.category === 'Cuidado & Piel').length 
    },
  ];

  // Filtered Services List
  const filteredServices = useMemo(() => {
    return services.filter(s => {
      // Category match
      let matchesCategory = true;
      if (activeCategory === 'Uñas & Manicura') {
        matchesCategory = s.category === 'Uñas & Manicura' || s.category === 'Manicura/Nails';
      } else if (activeCategory === 'Peluquería & Cabello') {
        matchesCategory = s.category === 'Peluquería & Cabello' || s.category === 'Corte/Barba' || s.category === 'Colorimetría' || s.category === 'Tratamientos';
      } else if (activeCategory === 'Cuidado & Piel') {
        matchesCategory = s.category === 'Cuidado & Piel';
      }

      // Search match
      const query = searchTerm.toLowerCase().trim();
      const matchesSearch = !query || 
        s.name.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query) ||
        s.tags?.some(tag => tag.toLowerCase().includes(query)) ||
        s.badge?.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [services, activeCategory, searchTerm]);

  const handleBookService = (serviceId: string) => {
    onNavigate('wizard', { serviceId });
  };

  return (
    <div id="scr-client-catalog" className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Top Header & Navigation Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 p-1 bg-[#1E1332] rounded-full border border-[#FF70A6]/30 w-fit">
          <button
            className="px-5 py-2 rounded-full text-xs sm:text-sm font-heading font-bold bg-gradient-to-r from-[#FF70A6] to-[#70D6FF] text-[#120B1C] shadow-[0_2px_12px_rgba(255,112,166,0.4)] flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Catálogo de Servicios</span>
          </button>
          <button
            onClick={() => onNavigate('my-appointments')}
            className="px-5 py-2 rounded-full text-xs sm:text-sm font-heading font-semibold text-[#C8B6E2] hover:text-white transition-all flex items-center gap-2"
          >
            <Calendar className="w-4 h-4 text-[#70D6FF]" />
            <span>Mis Citas</span>
            {myUpcomingAppointmentsCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#FF70A6] text-[#120B1C] text-[10px] font-black flex items-center justify-center">
                {myUpcomingAppointmentsCount}
              </span>
            )}
          </button>
        </div>

        {/* Quick Action to profile */}
        <div className="flex items-center gap-3 self-end sm:self-center">
          <span className="text-xs text-[#C8B6E2] hidden md:inline">
            Bienvenida, <strong className="text-white">{currentUser?.full_name || 'Bella Cliente'}</strong> ✦
          </span>
          <Button
            variant="bubble"
            size="sm"
            onClick={() => onNavigate('my-appointments')}
            className="text-xs border-[#70D6FF]/40 text-[#70D6FF] hover:bg-[#70D6FF]/10"
          >
            <Calendar className="w-3.5 h-3.5 mr-1.5" />
            Ver mis citas ({myUpcomingAppointmentsCount})
          </Button>
        </div>
      </div>

      {/* Hero Banner: Y2K Glitt Beauty Experience */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-[#2F1649] via-[#1E1332] to-[#120B1C] border border-[#FF70A6]/40 p-6 sm:p-10 shadow-[0_15px_40px_rgba(255,112,166,0.2)]">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#FF70A6]/20 via-[#70D6FF]/15 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-gradient-to-tr from-[#38E54D]/15 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF70A6]/20 border border-[#FF70A6]/50 text-[#FF70A6] text-xs font-mono font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" /> MENÚ & CATÁLOGO EXCLUSIVO ✦ Y2K
          </div>

          <h1 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
            Descubre el look de tus sueños en{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF70A6] via-[#FFD670] to-[#70D6FF]">
              SalonGlitt
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[#E2D4F0] leading-relaxed">
            Explora nuestro menú interactivo de belleza: uñas esculpidas, corte en capas mariposa, balayage perlado y terapias avanzadas de cuidado de la piel. Selecciona tu servicio favorito y agenda en minutos con tu estilista preferida.
          </p>

          {/* Quick Perks Pill */}
          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-[#C8B6E2]">
            <div className="flex items-center gap-1.5 bg-[#120B1C]/60 px-3 py-1.5 rounded-full border border-white/10">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#38E54D]" />
              <span>Reserva garantizada (3 a 7 días)</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#120B1C]/60 px-3 py-1.5 rounded-full border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-[#70D6FF]" />
              <span>Cancelación flexible hasta 24h</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#120B1C]/60 px-3 py-1.5 rounded-full border border-white/10">
              <Star className="w-3.5 h-3.5 text-[#FFD670]" />
              <span>Estilistas Certificados</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="space-y-4">
        {/* Category Navigation Pills */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#1E1332]/80 backdrop-blur-md rounded-2xl border border-white/10">
          {categoryTabs.map(tab => {
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl font-heading text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FF70A6] to-[#70D6FF] text-[#120B1C] shadow-[0_4px_16px_rgba(255,112,166,0.35)] scale-[1.02]'
                    : 'text-[#C8B6E2] hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="text-base">{tab.icon}</span>
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                    isActive ? 'bg-[#120B1C]/30 text-[#120B1C]' : 'bg-white/10 text-[#C8B6E2]'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Quick Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#C8B6E2] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar servicio (ej. Uñas acrílicas, mariposa, keratina, limpieza facial)..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-[#1E1332] border border-[#FF70A6]/20 rounded-xl text-sm text-white placeholder-[#C8B6E2]/60 focus:outline-none focus:border-[#FF70A6] transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C8B6E2] hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="text-xs text-[#C8B6E2] font-mono whitespace-nowrap self-start sm:self-center">
            {filteredServices.length} {filteredServices.length === 1 ? 'servicio encontrado' : 'servicios encontrados'}
          </div>
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-[#1E1332]/50 border border-white/10 space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#FF70A6]/10 text-[#FF70A6] mx-auto flex items-center justify-center text-2xl">
            ✦
          </div>
          <h3 className="font-heading font-bold text-lg text-white">No encontramos servicios con ese criterio</h3>
          <p className="text-xs sm:text-sm text-[#C8B6E2] max-w-md mx-auto">
            Prueba buscando con otra palabra clave o haz clic en "Todos los Servicios" para ver la carta completa de SalonGlitt.
          </p>
          <Button
            variant="bubble"
            size="sm"
            onClick={() => {
              setActiveCategory('ALL');
              setSearchTerm('');
            }}
          >
            Limpiar Búsqueda
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map(service => {
            const isFav = favorites.includes(service.id);
            const isHair = service.category === 'Peluquería & Cabello' || service.category === 'Corte/Barba' || service.category === 'Colorimetría' || service.category === 'Tratamientos';
            const isNails = service.category === 'Uñas & Manicura' || service.category === 'Manicura/Nails';
            const isSkin = service.category === 'Cuidado & Piel';

            return (
              <div
                key={service.id}
                className="group relative flex flex-col rounded-3xl overflow-hidden bg-[#1E1332] border border-white/10 hover:border-[#FF70A6]/60 transition-all duration-300 hover:shadow-[0_12px_30px_rgba(255,112,166,0.2)] hover:-translate-y-1"
              >
                {/* Image & Badges */}
                <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-[#2A1B45]">
                  <div className="absolute inset-0 flex items-center justify-center text-[#FF70A6]">
                    <Sparkles className="w-12 h-12 opacity-50" />
                  </div>
                  <img
                      src={service.image_url || imageFallback}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      onError={e => {
                        const target = e.currentTarget;
                        if (target.dataset.fallbackApplied) {
                          target.style.display = 'none';
                        } else {
                          target.dataset.fallbackApplied = 'true';
                          target.src = imageFallback;
                        }
                      }}
                    />

                  {/* Top Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1E1332] via-[#1E1332]/40 to-transparent" />

                  {/* Top Floating Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-[#120B1C]/80 backdrop-blur-md text-white border border-white/20 flex items-center gap-1">
                      {isNails && '💅 Uñas'}
                      {isHair && '💇‍♀️ Cabello'}
                      {isSkin && '🧖‍♀️ Piel'}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {service.badge && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-black bg-gradient-to-r from-[#FF70A6] to-[#70D6FF] text-[#120B1C] shadow-sm">
                          {service.badge}
                        </span>
                      )}
                      <button
                        onClick={e => toggleFavorite(service.id, e)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md border transition-colors ${
                          isFav
                            ? 'bg-[#FF70A6] text-white border-[#FF70A6]'
                            : 'bg-[#120B1C]/70 text-[#C8B6E2] border-white/20 hover:text-[#FF70A6]'
                        }`}
                        title={isFav ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Duration Pill Floating in Bottom Left */}
                  <div className="absolute bottom-3 left-3 z-10">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-[#120B1C]/90 text-[#70D6FF] border border-[#70D6FF]/30 backdrop-blur-sm">
                      <Clock className="w-3 h-3 text-[#70D6FF]" />
                      {formatDuration(service.duration_minutes)}
                    </span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-heading font-bold text-base sm:text-lg text-white group-hover:text-[#FF70A6] transition-colors leading-snug">
                        {service.name}
                      </h3>
                    </div>

                    <p className="text-xs text-[#C8B6E2] line-clamp-2 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Tags */}
                    {service.tags && service.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {service.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-[#C8B6E2] border border-white/10 font-mono"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Price & Booking Action */}
                  <div className="pt-3 border-t border-white/10 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-[#C8B6E2]">
                          Inversión
                        </span>
                        <span className="text-lg sm:text-xl font-heading font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FFD670] to-[#FF70A6]">
                          {formatPrice(service.price)}
                        </span>
                      </div>

                      <button
                        onClick={() => setSelectedServiceForModal(service)}
                        className="text-xs text-[#70D6FF] hover:underline flex items-center gap-1 font-medium transition-colors"
                      >
                        <Info className="w-3.5 h-3.5" />
                        <span>Ver detalle</span>
                      </button>
                    </div>

                    {/* Prominent CTA: Agendar este servicio */}
                    <button
                      onClick={() => handleBookService(service.id)}
                      className="w-full py-2.5 px-4 rounded-xl font-heading font-bold text-xs sm:text-sm bg-gradient-to-r from-[#FF70A6] via-[#FF70A6] to-[#70D6FF] text-[#120B1C] hover:opacity-95 shadow-[0_4px_16px_rgba(255,112,166,0.35)] transition-all flex items-center justify-center gap-2 group/btn"
                    >
                      <Sparkles className="w-4 h-4 text-[#120B1C] group-hover/btn:rotate-12 transition-transform" />
                      <span>Agendar este servicio</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Service Detail Modal */}
      {selectedServiceForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#1E1332] border border-[#FF70A6]/40 p-6 sm:p-7 shadow-[0_20px_50px_rgba(255,112,166,0.3)] space-y-5 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedServiceForModal(null)}
              className="absolute top-4 right-4 text-[#C8B6E2] hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Image */}
            {(
              <div className="relative h-44 w-full rounded-2xl overflow-hidden -mt-1 border border-white/10 bg-[#2A1B45]">
                <img
                  src={selectedServiceForModal.image_url || imageFallback}
                  alt={selectedServiceForModal.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={e => {
                    const target = e.currentTarget;
                    if (target.dataset.fallbackApplied) {
                      target.style.display = 'none';
                    } else {
                      target.dataset.fallbackApplied = 'true';
                      target.src = imageFallback;
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E1332] via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#120B1C]/90 text-[#FF70A6] border border-[#FF70A6]/30">
                  {selectedServiceForModal.category}
                </span>
              </div>
            )}

            <div className="space-y-2">
              <h3 className="font-heading font-black text-xl sm:text-2xl text-white">
                {selectedServiceForModal.name}
              </h3>
              <p className="text-sm text-[#E2D4F0] leading-relaxed">
                {selectedServiceForModal.description}
              </p>
            </div>

            {/* Service Specifications */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-[#120B1C]/70 border border-white/10 text-xs">
              <div className="space-y-1">
                <span className="text-[#C8B6E2] font-mono text-[10px] uppercase">Duración de la sesión</span>
                <p className="font-heading font-bold text-white flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#70D6FF]" />
                  {formatDuration(selectedServiceForModal.duration_minutes)}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[#C8B6E2] font-mono text-[10px] uppercase">Precio Estimado</span>
                <p className="font-heading font-bold text-[#FFD670] text-base">
                  {formatPrice(selectedServiceForModal.price)}
                </p>
              </div>
            </div>

            {/* What is Included */}
            <div className="space-y-2">
              <h4 className="font-heading font-bold text-xs uppercase text-[#C8B6E2] tracking-wider">
                ¿Qué incluye esta experiencia?
              </h4>
              <ul className="space-y-1.5 text-xs text-[#E2D4F0]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#38E54D] shrink-0" />
                  <span>Diagnóstico y asesoría personalizada de estilo.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#38E54D] shrink-0" />
                  <span>Productos profesionales hipoalergénicos y cruelty-free.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#38E54D] shrink-0" />
                  <span>Esterilización con bioseguridad grado clínico.</span>
                </li>
              </ul>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-white/10 flex items-center gap-3">
              <Button
                variant="bubble"
                size="md"
                onClick={() => setSelectedServiceForModal(null)}
                className="flex-1"
              >
                Cerrar
              </Button>
              <Button
                variant="pink"
                size="md"
                sparkle
                onClick={() => {
                  const id = selectedServiceForModal.id;
                  setSelectedServiceForModal(null);
                  handleBookService(id);
                }}
                className="flex-1 shadow-[0_4px_16px_rgba(255,112,166,0.4)]"
              >
                Agendar ahora ✦
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientServicesCatalogPage;
