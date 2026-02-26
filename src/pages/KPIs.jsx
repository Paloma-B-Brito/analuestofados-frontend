/**
 * @file KPIs.jsx
 * @description Sala de Guerra - Indicadores Estratégicos de Performance
 * @author © 2026 Rickman Brown • Software Engineering
 */

import React from 'react';
import { TrendingUp, Target, Award, DollarSign, Activity, Printer } from 'lucide-react';

function KPIs() {
  const metas = [
    { titulo: "Faturamento Mensal", alvo: 150000, atual: 124500, unidade: "R$", cor: "bg-emerald-500" },
    { titulo: "Sofás Produzidos", alvo: 80, atual: 45, unidade: "un.", cor: "bg-blue-500" },
    { titulo: "Novos Clientes", alvo: 20, atual: 22, unidade: "leads", cor: "bg-[#b49157]" },
    { titulo: "Ticket Médio", alvo: 4500, atual: 4100, unidade: "R$", cor: "bg-rose-500" },
  ];

  const handlePrint = () => {
    window.print();
  };

  const dataAtual = new Date().toLocaleDateString('pt-BR');
  const horaAtual = new Date().toLocaleTimeString('pt-BR');

  return (
    <div className="animate-fade-in space-y-8 pb-10 print:pb-0 print:bg-white print:m-0 print:p-0">

      <style>{`
        @media print {
          @page { margin: 15mm; size: A4 portrait; }
          
          /* FORÇA A OCULTAR O MENU DO SITE E RODAPÉS PADRÕES */
          header, footer, nav, .no-print { 
            display: none !important; 
          }
          
          body { 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important; 
            background-color: white !important;
          }
          
          .print-only { display: block !important; }
          
          .print-adjust-grid {
            display: grid !important;
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 15px !important;
          }
          .print-adjust-col {
             grid-column: span 2 !important;
          }
        }
        .print-only { display: none; }
      `}</style>

      <div className="print-only border-b-2 border-slate-800 pb-6 mb-8 pt-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#064e3b] rounded-lg flex items-center justify-center text-white font-black text-3xl shadow-sm">
              A
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter leading-none">ANALU</h1>
              <p className="text-[10px] font-bold text-[#b49157] uppercase tracking-[0.3em] mt-1">Indústria de Estofados</p>
            </div>
          </div>
          <div className="text-right text-[10px] text-slate-600 space-y-1">
            <p className="font-black text-xs text-slate-800 tracking-widest uppercase">Documento Gerencial</p>
            <p>CNPJ: 00.000.000/0001-00</p>
            <p>Emitido em: {dataAtual} às {horaAtual}</p>
            <p className="font-bold text-[#064e3b] mt-1">Responsável: Analu</p>
          </div>
        </div>
        <div className="mt-8 text-center bg-slate-50 py-3 border-y border-slate-200">
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-800">
            Relatório Oficial de Indicadores Estratégicos (KPIs)
          </h2>
        </div>
      </div>

      <div className="flex justify-between items-end no-print">
        <div>
          <h1 className="text-3xl font-black text-[#064e3b] uppercase tracking-tighter">
            Indicadores <span className="text-[#b49157] font-light italic">Estratégicos</span>
          </h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">
            Performance Global vs Metas (Fev/2026)
          </p>
        </div>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 bg-[#064e3b] text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg hover:bg-[#08634b] active:scale-95 transition-all"
        >
          <Printer size={16} /> Exportar Relatório PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 print-adjust-grid">
        {metas.map((meta, idx) => {
          const porcentagem = Math.min((meta.atual / meta.alvo) * 100, 100);
          const atingiu = meta.atual >= meta.alvo;

          return (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden print:border-slate-300 print:shadow-none print:break-inside-avoid">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{meta.titulo}</p>
                  <p className={`text-2xl font-black ${atingiu ? 'text-[#b49157]' : 'text-slate-700'}`}>
                    {meta.unidade === "R$" ? `R$ ${meta.atual.toLocaleString('pt-BR')}` : meta.atual}
                  </p>
                </div>
                {atingiu && <Award className="text-[#b49157]" size={24} />}
              </div>
              
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden print:bg-slate-200">
                <div 
                  className={`h-full ${meta.cor}`} 
                  style={{ width: `${porcentagem}%` }}
                ></div>
              </div>
              <p className="text-[9px] text-right mt-2 text-slate-500 font-bold">
                Meta: {meta.unidade === "R$" ? `R$ ${meta.alvo.toLocaleString('pt-BR')}` : meta.alvo} ({porcentagem.toFixed(0)}%)
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:mt-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm print:border-slate-300 print:shadow-none print:break-inside-avoid print-adjust-col">
          <div className="flex items-center gap-2 mb-8 border-b border-slate-100 pb-4 print:border-slate-300">
            <Activity size={18} className="text-[#064e3b]" />
            <h3 className="font-black text-[#064e3b] uppercase tracking-wide text-sm">Mix de Produtos (Mais Vendidos)</h3>
          </div>
          
          <div className="space-y-6">
            {[
              { label: "Sofá Chesterfield", val: 85, cor: "bg-[#064e3b]" },
              { label: "Poltrona Eames", val: 60, cor: "bg-[#b49157]" },
              { label: "Sofá Retrátil Slim", val: 45, cor: "bg-slate-400" },
              { label: "Puffs Decorativos", val: 30, cor: "bg-slate-300" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="w-40 text-[10px] font-bold text-slate-600 uppercase text-right">{item.label}</span>
                <div className="flex-1 h-4 bg-slate-100 rounded-r-full overflow-hidden print:border print:border-slate-200">
                  <div className={`h-full ${item.cor}`} style={{ width: `${item.val}%` }}></div>
                </div>
                <span className="text-[10px] font-black text-slate-800 w-10">{item.val}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1e293b] p-8 rounded-2xl text-white flex flex-col justify-between relative overflow-hidden print:bg-white print:border-2 print:border-slate-800 print:text-slate-800 print:break-inside-avoid">
          <div className="absolute top-0 right-0 p-32 bg-[#b49157] blur-[100px] opacity-20 rounded-full no-print"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-[#b49157] mb-2 print:text-slate-800">
              <TrendingUp size={20} />
              <span className="text-xs font-black uppercase tracking-widest">Margem Líquida</span>
            </div>
            <h2 className="text-5xl font-black tracking-tighter">28.4%</h2>
            <p className="text-emerald-400 text-xs font-bold mt-2 flex items-center gap-1 print:text-emerald-700">
              <span className="bg-emerald-500/20 px-2 py-0.5 rounded print:bg-emerald-100">+ 2.1%</span> vs mês anterior
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 print:border-slate-300 relative z-10">
            <p className="text-[10px] uppercase text-slate-400 tracking-widest mb-1 print:text-slate-500">Custo Operacional Total</p>
            <p className="text-2xl font-black">R$ 42.150,00</p>
          </div>
        </div>
      </div>

      <div className="print-only mt-24 pt-10 border-t border-slate-300 break-inside-avoid">
        <div className="grid grid-cols-2 gap-16">
          <div className="text-center">
            <div className="border-t-2 border-slate-800 w-3/4 mx-auto mb-2"></div>
            <p className="font-black text-xs uppercase tracking-widest text-slate-800">Analu</p>
            <p className="text-[10px] text-slate-500 uppercase mt-1">Diretoria Executiva</p>
          </div>
          <div className="text-center">
            <div className="border-t-2 border-slate-800 w-3/4 mx-auto mb-2"></div>
            <p className="font-black text-xs uppercase tracking-widest text-slate-800">Gerência Financeira</p>
            <p className="text-[10px] text-slate-500 uppercase mt-1">Visto e Conferência</p>
          </div>
        </div>
        <p className="text-center text-[8px] text-slate-400 mt-16 font-mono uppercase">
          Analu Enterprise 
        </p>
      </div>

    </div>
  );
}

export default KPIs;