import React from 'react';

function DashboardFinanceiro() {
  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="text-2xl font-black text-[#064e3b] uppercase">
        Diretoria • <span className="text-[#b49157]">Financeiro</span>
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Saldo em Caixa</p>
          <p className="text-3xl font-black text-emerald-600">R$ 142.000</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase">A Pagar Hoje</p>
          <p className="text-3xl font-black text-rose-500">R$ 4.200</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase">A Receber Hoje</p>
          <p className="text-3xl font-black text-blue-500">R$ 8.500</p>
        </div>
      </div>

       <div className="bg-slate-50 h-64 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 font-bold uppercase text-xs">
        Gráfico de Fluxo de Caixa Diário
      </div>
    </div>
  );
}

export default DashboardFinanceiro;