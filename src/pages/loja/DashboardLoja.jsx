import React from 'react';

function DashboardLoja() {
  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="text-2xl font-black text-[#064e3b] uppercase">
        Visão Geral • <span className="text-rose-500">Loja</span>
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Vendas Hoje</p>
          <p className="text-3xl font-black text-rose-500">R$ 18.450</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Pedidos Pendentes</p>
          <p className="text-3xl font-black text-[#b49157]">3 Entregas</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Melhor Vendedor</p>
          <p className="text-xl font-black text-[#064e3b]">Carlos A.</p>
        </div>
      </div>

       <div className="bg-slate-50 h-64 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 font-bold uppercase text-xs">
        Ranking de Vendas da Semana
      </div>
    </div>
  );
}

export default DashboardLoja;