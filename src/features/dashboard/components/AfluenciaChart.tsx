import React, { useState } from 'react';
import { Sparkles, Clock, TrendingUp } from 'lucide-react';

interface HourlyData {
  time: string;
  count: number;
  capacityPercentage: number;
  highlight?: boolean;
}

const AFLUENCIA_DATA: HourlyData[] = [
  { time: '09:00', count: 3, capacityPercentage: 60 },
  { time: '11:00', count: 5, capacityPercentage: 100, highlight: true }, // Peak
  { time: '13:00', count: 2, capacityPercentage: 40 },
  { time: '15:00', count: 4, capacityPercentage: 80 },
  { time: '17:00', count: 5, capacityPercentage: 100, highlight: true }, // Peak
  { time: '19:00', count: 3, capacityPercentage: 60 },
];

export const AfluenciaChart: React.FC = () => {
  const [activeSlot, setActiveSlot] = useState<HourlyData | null>(null);

  return (
    <div className="p-6 rounded-[24px] bg-gradient-to-br from-[#2A1B45] to-[#1E1332] border border-[#FF70A6]/30 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#FFD670]">✦</span>
            <h3 className="font-heading font-bold text-lg text-white">
              Curva de Afluencia por Horario
            </h3>
          </div>
          <p className="text-xs text-[#C8B6E2] mt-0.5">
            Distribución de volumen de clientes y picos de ocupación en estaciones
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-gradient-to-tr from-[#FF70A6] to-[#FF4D8B]" />
            <span className="text-[#C8B6E2]">Horario Pico</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-gradient-to-tr from-[#70D6FF] to-[#38B6FF]" />
            <span className="text-[#C8B6E2]">Estándar</span>
          </div>
        </div>
      </div>

      {/* Interactive Bar Chart Grid */}
      <div className="h-56 flex items-end justify-between gap-3 sm:gap-6 pt-6 pb-2 px-2 border-b border-white/10">
        {AFLUENCIA_DATA.map((item, index) => {
          const isSelected = activeSlot?.time === item.time;
          const isPeak = item.highlight;

          return (
            <div
              key={index}
              className="flex-1 flex flex-col items-center gap-2 group cursor-pointer h-full justify-end"
              onMouseEnter={() => setActiveSlot(item)}
              onMouseLeave={() => setActiveSlot(null)}
            >
              {/* Tooltip on hover */}
              <div
                className={`text-[11px] font-bold px-2 py-1 rounded-full whitespace-nowrap transition-all duration-200 pointer-events-none mb-1 ${
                  isSelected || isPeak
                    ? 'opacity-100 transform -translate-y-1 bg-[#120B1C] text-[#FFD670] border border-[#FFD670]/40 shadow-[0_0_10px_rgba(255,214,112,0.4)]'
                    : 'opacity-0'
                }`}
              >
                {item.count} citas ({item.capacityPercentage}%)
              </div>

              {/* Bar Container */}
              <div className="w-full max-w-[48px] bg-white/5 rounded-t-[18px] p-1 flex items-end h-full">
                <div
                  style={{ height: `${item.capacityPercentage}%` }}
                  className={`w-full rounded-t-[14px] transition-all duration-500 relative ${
                    isPeak
                      ? 'bg-gradient-to-t from-[#FF70A6] to-[#FF4D8B] shadow-[0_0_20px_rgba(255,112,166,0.6)]'
                      : 'bg-gradient-to-t from-[#70D6FF] to-[#38B6FF] shadow-[0_0_15px_rgba(112,214,255,0.4)]'
                  } group-hover:brightness-125`}
                >
                  {isPeak && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] text-[#FFD670] animate-bounce">
                      ✦
                    </span>
                  )}
                </div>
              </div>

              {/* Label */}
              <span className="text-xs font-mono font-medium text-[#C8B6E2] group-hover:text-white transition-colors">
                {item.time}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-[#C8B6E2] gap-2">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[#70D6FF]" />
          <span>Hora con mayor saturación: <strong className="text-white">11:00 AM & 05:00 PM</strong></span>
        </div>
        <span className="text-[#38E54D] font-semibold flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5" /> +14% flujo respecto al mes anterior
        </span>
      </div>
    </div>
  );
};
