/**
 * @file Card.jsx
 * @description Componente de Card com Indicadores Visuais e Animações Suaves
 * @author © 2026 Rickman Brown • Software Engineering
 */

import { useState } from "react";

function Card({ titulo, valor, cor, tendencia, progresso = 0, icone }) {
  const [hovered, setHovered] = useState(false);

  const colorVariants = {
    green: {
      text: "text-[#064e3b]",
      bg: "bg-[#064e3b]",
      light: "bg-emerald-50",
      border: "group-hover:border-[#064e3b]/30"
    },
    gold: {
      text: "text-[#b49157]",
      bg: "bg-[#b49157]",
      light: "bg-amber-50",
      border: "group-hover:border-[#b49157]/30"
    },
    rose: {
      text: "text-rose-600",
      bg: "bg-rose-600",
      light: "bg-rose-50",
      border: "group-hover:border-rose-200"
    },
    slate: {
      text: "text-slate-700",
      bg: "bg-slate-700",
      light: "bg-slate-50",
      border: "group-hover:border-slate-300"
    },
  };

  const style = colorVariants[cor] || colorVariants.slate;

  return (
    <div 
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm transition-all duration-500 group relative overflow-hidden flex flex-col justify-between min-h-[160px] ${style.border} hover:shadow-xl hover:-translate-y-1`}
    >
      {/* Indicador Lateral Vertical */}
      <div className={`absolute left-0 top-0 h-full w-1.5 opacity-20 transition-opacity ${style.bg} ${hovered ? 'opacity-100' : ''}`}></div>

      {/* Topo do Card: Título e Tendência */}
      <div className="flex justify-between items-start w-full mb-2">
        <div className="flex flex-col text-left">
          <p className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400 mb-1">
            {titulo}
          </p>
          {icone && <span className={`text-lg mb-2 ${style.text}`}>{icone}</span>}
        </div>
        
        {tendencia && (
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black ${tendencia.includes('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            <span>{tendencia.includes('+') ? '↑' : '↓'}</span>
            {tendencia}
          </div>
        )}
      </div>

      {/* Valor Central */}
      <div className="text-left">
        <h3 className={`text-3xl font-black tracking-tighter uppercase leading-none ${style.text}`}>
          {valor}
        </h3>
      </div>

      {/* Footer: Barra de Progresso Analítica */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-1.5">
          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Eficiência Operacional</p>
          <p className={`text-[9px] font-black ${style.text}`}>{progresso}%</p>
        </div>
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ease-out ${style.bg}`} 
            style={{ width: `${progresso}%` }}
          ></div>
        </div>
      </div>

      {/* Efeito de Brilho ao Fundo (Sutil) */}
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-3xl opacity-0 transition-opacity duration-500 ${style.bg} group-hover:opacity-10`}></div>
    </div>
  );
}

export default Card;