import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/context/ToastContext';
import { dataStore } from '@/lib/dataStore';
import { BusinessRulesConfig } from '@/types';
import { 
  Settings, 
  Clock, 
  MessageSquare, 
  Mail, 
  Sparkles, 
  Save, 
  RotateCcw, 
  ShieldAlert, 
  CheckCircle2, 
  Bell 
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const toast = useToast();
  const [rules, setRules] = useState<BusinessRulesConfig>(dataStore.getRules());
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      dataStore.updateRules(rules);
      setSaving(false);
      toast.success('Reglas Actualizadas ✦', 'Los parámetros de BR-01, BR-02 y BR-03 han sido guardados.');
    }, 400);
  };

  const handleReset = () => {
    dataStore.resetData();
    setRules(dataStore.getRules());
    toast.info('Datos Restablecidos', 'Se han restablecido los parámetros y citas a su estado inicial de demostración.');
  };

  return (
    <div id="scr-06-settings-page" className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#FF70A6] animate-twinkle">✦</span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#70D6FF]">
              Parámetros Globales • SCR-06
            </span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white mt-1">
            Configuración de Reglas de Negocio
          </h1>
          <p className="text-xs sm:text-sm text-[#C8B6E2]">
            Administra los umbrales de agendamiento BR-01, cancelación BR-02 y canales BR-03.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="bubble"
            size="sm"
            onClick={handleReset}
            icon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Restablecer Demo
          </Button>
          <Button
            variant="pink"
            size="md"
            sparkle
            disabled={saving}
            onClick={handleSave}
            icon={<Save className="w-4 h-4" />}
          >
            {saving ? 'Guardando...' : 'Guardar Parámetros'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* REGLA BR-01: Ventana de Agendamiento */}
        <Card bubble glow="pink" className="p-6 space-y-4">
          <div className="flex items-center gap-3 border-b border-white/10 pb-3">
            <div className="p-2 rounded-xl bg-[#FF70A6]/20 border border-[#FF70A6] text-[#FF70A6]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-[#FF70A6] uppercase">
                ✦ REGLA BR-01
              </span>
              <h3 className="font-heading font-bold text-base text-white">
                Ventana de Agendamiento
              </h3>
            </div>
          </div>

          <p className="text-xs text-[#C8B6E2] leading-relaxed">
            Define el rango temporal permitido para agendar citas hacia el futuro respecto al día actual.
          </p>

          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between gap-4 p-3 rounded-[16px] bg-[#120B1C]/80 border border-white/10">
              <div>
                <span className="text-xs font-bold text-white block">Mínimo días antes</span>
                <span className="text-[11px] text-[#C8B6E2]">Previene citas de último minuto</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={rules.minDaysInAdvance}
                  onChange={e => setRules({ ...rules, minDaysInAdvance: Number(e.target.value) })}
                  className="w-16 bg-[#1E1332] text-center font-mono font-bold text-white border border-[#FF70A6]/40 rounded-xl p-2 text-sm"
                />
                <span className="text-xs text-[#FF70A6] font-mono">Días ({rules.minDaysInAdvance * 24}h)</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 p-3 rounded-[16px] bg-[#120B1C]/80 border border-white/10">
              <div>
                <span className="text-xs font-bold text-white block">Máximo días antes</span>
                <span className="text-[11px] text-[#C8B6E2]">Límite de previsión de agenda</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={3}
                  max={30}
                  value={rules.maxDaysInAdvance}
                  onChange={e => setRules({ ...rules, maxDaysInAdvance: Number(e.target.value) })}
                  className="w-16 bg-[#1E1332] text-center font-mono font-bold text-white border border-[#FF70A6]/40 rounded-xl p-2 text-sm"
                />
                <span className="text-xs text-[#FF70A6] font-mono">Días ({rules.maxDaysInAdvance * 24}h)</span>
              </div>
            </div>
          </div>
        </Card>

        {/* REGLA BR-02: Política de Cancelación */}
        <Card bubble glow="cyan" className="p-6 space-y-4">
          <div className="flex items-center gap-3 border-b border-white/10 pb-3">
            <div className="p-2 rounded-xl bg-[#70D6FF]/20 border border-[#70D6FF] text-[#70D6FF]">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-[#70D6FF] uppercase">
                ✦ REGLA BR-02
              </span>
              <h3 className="font-heading font-bold text-base text-white">
                Política de Cancelación
              </h3>
            </div>
          </div>

          <p className="text-xs text-[#C8B6E2] leading-relaxed">
            Protege el tiempo de los estilistas impidiendo cancelaciones a última hora.
          </p>

          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between gap-4 p-3.5 rounded-[16px] bg-[#120B1C]/80 border border-white/10">
              <div>
                <span className="text-xs font-bold text-white block">Anticipación mínima</span>
                <span className="text-[11px] text-[#C8B6E2]">Menos de este tiempo bloquea el botón</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={72}
                  value={rules.minCancelHoursBefore}
                  onChange={e => setRules({ ...rules, minCancelHoursBefore: Number(e.target.value) })}
                  className="w-16 bg-[#1E1332] text-center font-mono font-bold text-white border border-[#70D6FF]/40 rounded-xl p-2 text-sm"
                />
                <span className="text-xs text-[#70D6FF] font-mono">Horas</span>
              </div>
            </div>

            <div className="p-3 rounded-[14px] bg-[#2A1B45] border border-[#70D6FF]/20 text-xs text-[#C8B6E2] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#38E54D] shrink-0" />
              <span>Validación automática en tiempo real tanto en la tabla como en el modal de cancelación.</span>
            </div>
          </div>
        </Card>

        {/* REGLA BR-03: Canales Transaccionales */}
        <Card bubble glow="yellow" className="p-6 space-y-4 md:col-span-2">
          <div className="flex items-center gap-3 border-b border-white/10 pb-3">
            <div className="p-2 rounded-xl bg-[#38E54D]/20 border border-[#38E54D] text-[#38E54D]">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-[#38E54D] uppercase">
                ✦ REGLA BR-03
              </span>
              <h3 className="font-heading font-bold text-base text-white">
                Canales Transaccionales de Notificación
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Switch WhatsApp */}
            <div className="p-4 rounded-[20px] bg-[#120B1C]/80 border border-[#38E54D]/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-full bg-[#38E54D]/20 text-[#38E54D]">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-xs text-white">WhatsApp Cloud API</h4>
                  <p className="text-[11px] text-[#C8B6E2]">Disparo automático de vouchers y recordatorios</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRules({ ...rules, whatsappNotificationEnabled: !rules.whatsappNotificationEnabled })}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  rules.whatsappNotificationEnabled ? 'bg-[#38E54D]' : 'bg-gray-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-[#120B1C] transition-transform ${
                    rules.whatsappNotificationEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Switch Email */}
            <div className="p-4 rounded-[20px] bg-[#120B1C]/80 border border-[#70D6FF]/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-full bg-[#70D6FF]/20 text-[#70D6FF]">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-xs text-white">Correo Transaccional</h4>
                  <p className="text-[11px] text-[#C8B6E2]">Envío de confirmación y factura proforma</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRules({ ...rules, emailNotificationEnabled: !rules.emailNotificationEnabled })}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  rules.emailNotificationEnabled ? 'bg-[#70D6FF]' : 'bg-gray-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-[#120B1C] transition-transform ${
                    rules.emailNotificationEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
