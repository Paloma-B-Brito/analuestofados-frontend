/**
 * @file DashboardFabrica.jsx
 * @description Centro de Comando Industrial - Monitoramento e Ação Rápida
 * @author © 2026 Rickman Brown • Software Engineering
 */

import React, { useState } from 'react';
import { 
  Factory, AlertTriangle, CheckCircle, Clock, 
  Package, Users, Scissors, Hammer, TrendingUp, X 
} from 'lucide-react';

function DashboardFabrica() {
  
  // STATE para controle do Modal de Emergência
  const [modalAberto, setModalAberto] = useState(false);
  const [pedidoEnviado, setPedidoEnviado] = useState(false);

  // DADOS MOCKADOS (Simulação do Chão de Fábrica)
  const linhaProducao = [
    { estagio: "Corte de Tecidos", qtd: 8, status: "normal", icon: <Scissors size={14} /> },
    { estagio: "Costura & Acabamento", qtd: 12, status: "atencao", icon: <Factory size={14} /> },
    { estagio: "Estruturação/Montagem", qtd: 5, status: "normal", icon: <Hammer size={14} /> },
    { estagio: "Controle de Qualidade", qtd: 3, status: "otimo", icon: <CheckCircle size={14} /> },
  ];

  const alertasInsumos = [
    { item: "Grampos 80/10", nivel: "CRÍTICO", porcentagem: 15, qtdSugerida: "50 cx" },
    { item: "Cola de Contato (Lata)", nivel: "BAIXO", porcentagem: 28, qtdSugerida: "20 un" },
    { item: "Tecido Linho Bege", nivel: "MÉDIO", porcentagem: 45, qtdSugerida: "10 rolos" },
  ];

  const producaoHora = [4, 6, 8, 12, 10, 14, 9, 2]; // Peças por hora

  // Função para processar a requisição
  const confirmarRequisicao = () => {
    // Aqui entra a chamada para o Back-end
    setPedidoEnviado(true);
    setTimeout(() => {
      setModalAberto(false);
      setPedidoEnviado(false);
      alert("Requisição de Emergência #REQ-9902 criada com sucesso!");
    }, 2000);
  };

  return (
    <div className="animate-fade-in space-y-6 pb-10 relative">
      
      {/* --- MODAL DE EMERGÊNCIA (OVERLAY) --- */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-rose-500">
            
            {/* Header do Modal */}
            <div className="bg-rose-600 p-4 text-white flex justify-between items-center">
              <h3 className="font-black uppercase text-sm flex items-center gap-2">
                <AlertTriangle size={18} /> Protocolo de Emergência
              </h3>
              <button onClick={() => setModalAberto(false)} className="hover:bg-rose-700 p-1 rounded-lg transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Corpo do Modal */}
            <div className="p-6">
              {!pedidoEnviado ? (
                <>
                  <p className="text-slate-600 text-sm font-bold mb-4">
                    Minister Noiret, você está prestes a autorizar uma compra emergencial para os seguintes itens críticos:
                  </p>
                  
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3 mb-6">
                    {alertasInsumos.filter(i => i.nivel === 'CRÍTICO' || i.nivel === 'BAIXO').map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center border-b border-slate-200 last:border-0 pb-2 last:pb-0">
                        <span className="text-xs font-bold text-slate-700">{item.item}</span>
                        <span className="text-xs font-black text-rose-600 bg-rose-100 px-2 py-1 rounded">
                          {item.qtdSugerida}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => setModalAberto(false)}
                      className="flex-1 py-3 border border-slate-200 text-slate-500 font-black uppercase text-xs rounded-lg hover:bg-slate-50"
                    >
                      Cancelar
                    </button>
                    <button 
                      onClick={confirmarRequisicao}
                      className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-black uppercase text-xs rounded-lg shadow-lg shadow-rose-500/30 flex items-center justify-center gap-2"
                    >
                      Autorizar Compra
                    </button>
                  </div>
                </>
              ) : (
                <div className="py-8 text-center">
                   <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                     <CheckCircle size={32} />
                   </div>
                   <h3 className="text-lg font-black text-[#064e3b] uppercase">Requisição Enviada</h3>
                   <p className="text-xs text-slate-400 mt-2">O departamento de compras foi notificado com prioridade máxima.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- HEADER DO MINISTRO --- */}
      <div className="flex flex-col md:flex-row justify-between items-end border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-[#064e3b] uppercase tracking-tighter flex items-center gap-2">
            <Factory className="text-[#b49157]" /> 
            Indústria <span className="text-slate-300">|</span> Operações
          </h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
            Bem-vindo ao deck de comando, <span className="text-[#064e3b]">AnaLu</span>.
          </p>
        </div>
        <div className="flex items-center gap-2">
           <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase flex items-center gap-1 animate-pulse">
             <div className="w-2 h-2 bg-emerald-500 rounded-full"></div> Operação Normal
           </span>
        </div>
      </div>
      
      {/* --- 1. KPI CARDS (Resumo Executivo) --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-8 bg-blue-50 rounded-bl-full opacity-50 group-hover:scale-110 transition-transform"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Produção Hoje</p>
          <div className="flex items-end gap-2">
            <h2 className="text-3xl font-black text-[#064e3b]">48</h2>
            <span className="text-[10px] font-bold text-emerald-500 mb-1 flex items-center"><TrendingUp size={10} /> +12%</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">Meta diária: 60 un.</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-8 bg-[#b49157]/10 rounded-bl-full opacity-50 group-hover:scale-110 transition-transform"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Eficiência</p>
          <div className="flex items-end gap-2">
            <h2 className="text-3xl font-black text-[#b49157]">92%</h2>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">Ociosidade: 8%</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-8 bg-rose-50 rounded-bl-full opacity-50 group-hover:scale-110 transition-transform"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Gargalo Atual</p>
          <div className="flex items-end gap-2">
            <h2 className="text-xl font-black text-rose-500">Costura</h2>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">12 peças em fila</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-8 bg-slate-50 rounded-bl-full opacity-50 group-hover:scale-110 transition-transform"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Equipe Ativa</p>
          <div className="flex items-end gap-2">
            <h2 className="text-3xl font-black text-slate-700">14</h2>
            <span className="text-[10px] text-slate-400 mb-1">/ 16</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">2 Faltas justificadas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* --- 2. FLUXO DE LINHA DE PRODUÇÃO (Visual) --- */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-black text-[#064e3b] uppercase tracking-wide text-sm flex items-center gap-2">
              <ActivityIcon /> Status da Linha
            </h3>
            <button className="text-[10px] font-bold text-[#b49157] uppercase hover:underline">Ver Detalhes</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {linhaProducao.map((item, index) => (
              <div key={index} className="relative p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-[#b49157] transition-all group">
                {/* Linha conectora */}
                {index < 3 && <div className="hidden sm:block absolute top-1/2 -right-3 w-4 h-[2px] bg-slate-200 z-0"></div>}
                
                <div className="flex justify-between items-start mb-2 relative z-10">
                  <div className={`p-2 rounded-lg text-white ${
                    item.status === 'atencao' ? 'bg-amber-400' : 
                    item.status === 'otimo' ? 'bg-emerald-500' : 'bg-slate-400'
                  }`}>
                    {item.icon}
                  </div>
                  <span className="text-xl font-black text-slate-700">{item.qtd}</span>
                </div>
                <p className="text-[10px] font-bold text-slate-500 uppercase leading-tight">{item.estagio}</p>
                
                {/* Status indicator */}
                <div className={`mt-2 h-1 w-full rounded-full ${
                    item.status === 'atencao' ? 'bg-amber-400' : 
                    item.status === 'otimo' ? 'bg-emerald-500' : 'bg-blue-400'
                }`}></div>
              </div>
            ))}
          </div>

          {/* GRÁFICO DE BARRAS CSS (Ritmo por Hora) */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase mb-4">Ritmo de Produção (Peças/Hora)</p>
            <div className="flex items-end justify-between h-32 gap-2">
              {producaoHora.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end group">
                  <div 
                    className="w-full bg-[#064e3b] opacity-80 group-hover:opacity-100 rounded-t-sm transition-all relative" 
                    style={{ height: `${(val / 15) * 100}%` }}
                  >
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      {val}
                    </span>
                  </div>
                  <span className="text-[9px] text-center text-slate-400 mt-1 font-mono">{8+i}h</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- 3. GESTÃO DE RISCO (Insumos) --- */}
        <div className="bg-[#1e293b] p-6 rounded-2xl text-white flex flex-col relative overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-rose-500 blur-[80px] opacity-20 rounded-full"></div>

          <div className="flex items-center gap-2 mb-6 relative z-10">
            <AlertTriangle className="text-rose-400" size={18} />
            <h3 className="font-black text-white uppercase tracking-wide text-sm">Alertas de Estoque</h3>
          </div>

          <div className="flex-1 space-y-4 relative z-10">
            {alertasInsumos.map((item, idx) => (
              <div key={idx} className="bg-white/5 p-3 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-200">{item.item}</span>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${
                    item.nivel === 'CRÍTICO' ? 'bg-rose-500 text-white' : 
                    item.nivel === 'BAIXO' ? 'bg-amber-500 text-black' : 'bg-blue-500 text-white'
                  }`}>
                    {item.nivel}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${item.nivel === 'CRÍTICO' ? 'bg-rose-500' : 'bg-amber-400'}`} 
                    style={{ width: `${item.porcentagem}%` }}
                  ></div>
                </div>
                <p className="text-[9px] text-right text-slate-400 mt-1">{item.porcentagem}% Restante</p>
              </div>
            ))}
          </div>

          <button 
            onClick={() => setModalAberto(true)}
            className="mt-6 w-full py-3 bg-[#b49157] hover:bg-[#9a7b48] text-[#1e293b] font-black uppercase text-xs rounded-lg transition-colors shadow-lg shadow-[#b49157]/20 relative z-20"
          >
            Solicitar Compra Urgente
          </button>
        </div>

      </div>
    </div>
  );
}

const ActivityIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
);

export default DashboardFabrica;