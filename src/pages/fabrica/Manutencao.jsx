/**
 * @file Manutencao.jsx
 * @description Gestão de Ativos, Máquinas e Ordens de Serviço (OS)
 * @author © 2026 Minister Noiret • Software Engineering
 */

import React, { useState } from 'react';
import { 
  Wrench, Settings, AlertTriangle, CheckCircle, 
  Activity, Clock, Tool, Calendar, Power 
} from 'lucide-react';

// DADOS MOCKADOS (Parque Industrial)
const ativosIniciais = [
  { 
    id: "MQ-001", 
    nome: "Cortadora de Tecido CNC", 
    tipo: "Corte", 
    saude: 92, // % de saúde da máquina
    status: "OPERACIONAL", // OPERACIONAL, MANUTENCAO, CRITICO
    ultimaManutencao: "10/01/2026", 
    proximaManutencao: "10/04/2026",
    responsavel: "Eng. Marcos"
  },
  { 
    id: "MQ-004", 
    nome: "Compressor de Ar Industrial", 
    tipo: "Infraestrutura", 
    saude: 45, 
    status: "CRITICO", 
    ultimaManutencao: "15/11/2025", 
    proximaManutencao: "15/02/2026", // Vencendo
    responsavel: "Téc. Souza"
  },
  { 
    id: "MQ-012", 
    nome: "Máquina de Costura Reta A", 
    tipo: "Costura", 
    saude: 100, 
    status: "OPERACIONAL", 
    ultimaManutencao: "01/02/2026", 
    proximaManutencao: "01/08/2026",
    responsavel: "Dona Maria (Líder)"
  },
  { 
    id: "VH-001", 
    nome: "Caminhão Iveco Daily", 
    tipo: "Logística", 
    saude: 0, 
    status: "MANUTENCAO", 
    ultimaManutencao: "12/02/2026", 
    proximaManutencao: "-",
    responsavel: "Oficina Externa"
  }
];

function Manutencao() {
  const [ativos, setAtivos] = useState(ativosIniciais);
  const [filtro, setFiltro] = useState("TODOS");

  // AÇÕES
  const reportarProblema = (id) => {
    const novosAtivos = ativos.map(a => 
      a.id === id ? { ...a, status: "MANUTENCAO", saude: 50 } : a
    );
    setAtivos(novosAtivos);
    alert(`Ordem de Serviço (OS) aberta para o ativo ${id}.`);
  };

  const finalizarManutencao = (id) => {
    const novosAtivos = ativos.map(a => 
      a.id === id ? { ...a, status: "OPERACIONAL", saude: 100, ultimaManutencao: new Date().toLocaleDateString() } : a
    );
    setAtivos(novosAtivos);
    alert(`Ativo ${id} liberado e certificado com 100% de saúde.`);
  };

  // FILTRO
  const listaFiltrada = ativos.filter(a => filtro === "TODOS" ? true : a.status === filtro);

  // Helper de Cores
  const getStatusColor = (status) => {
    switch(status) {
      case 'OPERACIONAL': return 'bg-emerald-500';
      case 'CRITICO': return 'bg-rose-500';
      case 'MANUTENCAO': return 'bg-amber-500';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="animate-fade-in space-y-6 pb-10">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#064e3b] uppercase tracking-tighter">
            Manutenção de <span className="text-[#b49157]">Ativos</span>
          </h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">
            Gestão do Parque Industrial & Frota
          </p>
        </div>
        
        {/* Filtros */}
        <div className="bg-white p-1 rounded-lg border border-slate-200 shadow-sm flex gap-1">
           {["TODOS", "OPERACIONAL", "MANUTENCAO", "CRITICO"].map(f => (
             <button 
               key={f}
               onClick={() => setFiltro(f)}
               className={`px-4 py-2 text-[10px] font-black uppercase rounded-md transition-all ${filtro === f ? 'bg-[#064e3b] text-white' : 'text-slate-400 hover:bg-slate-50'}`}
             >
               {f.replace("CRITICO", "CRÍTICO").replace("MANUTENCAO", "EM MANUT.")}
             </button>
           ))}
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
            <Settings size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total de Ativos</p>
            <p className="text-3xl font-black text-slate-700">{ativos.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
            <Wrench size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Em Manutenção</p>
            <p className="text-3xl font-black text-amber-600">{ativos.filter(a => a.status === 'MANUTENCAO').length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center text-rose-600">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Críticos / Risco</p>
            <p className="text-3xl font-black text-rose-500">{ativos.filter(a => a.status === 'CRITICO').length}</p>
          </div>
        </div>
      </div>

      {/* GRID DE MÁQUINAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {listaFiltrada.map((ativo) => (
          <div key={ativo.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all overflow-hidden group">
            
            {/* Topo do Card (Status Color) */}
            <div className={`h-2 w-full ${getStatusColor(ativo.status)}`}></div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                   <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">{ativo.id}</span>
                   <h3 className="text-lg font-black text-[#064e3b] mt-2 leading-tight">{ativo.nome}</h3>
                   <p className="text-xs text-slate-500 font-medium">{ativo.tipo}</p>
                </div>
                <div className={`p-2 rounded-full text-white shadow-lg ${getStatusColor(ativo.status)}`}>
                  {ativo.status === 'OPERACIONAL' && <Power size={16} />}
                  {ativo.status === 'MANUTENCAO' && <Wrench size={16} />}
                  {ativo.status === 'CRITICO' && <AlertTriangle size={16} />}
                </div>
              </div>

              {/* Health Bar (Saúde da Máquina) */}
              <div className="mb-6">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <Activity size={10} /> Integridade
                  </span>
                  <span className={`text-xs font-black ${
                    ativo.saude > 80 ? 'text-emerald-500' : 
                    ativo.saude > 40 ? 'text-amber-500' : 'text-rose-500'
                  }`}>{ativo.saude}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${
                      ativo.saude > 80 ? 'bg-emerald-500' : 
                      ativo.saude > 40 ? 'bg-amber-500' : 'bg-rose-500'
                    }`} 
                    style={{ width: `${ativo.saude}%` }}
                  ></div>
                </div>
              </div>

              {/* Datas Importantes */}
              <div className="grid grid-cols-2 gap-4 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <p className="text-[9px] text-slate-400 uppercase font-bold flex items-center gap-1"><CheckCircle size={10} /> Última</p>
                  <p className="text-xs font-black text-slate-700">{ativo.ultimaManutencao}</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 uppercase font-bold flex items-center gap-1"><Calendar size={10} /> Próxima</p>
                  <p className={`text-xs font-black ${ativo.status === 'CRITICO' ? 'text-rose-500 animate-pulse' : 'text-slate-700'}`}>
                    {ativo.proximaManutencao}
                  </p>
                </div>
              </div>

              {/* Botão de Ação */}
              {ativo.status === 'OPERACIONAL' || ativo.status === 'CRITICO' ? (
                <button 
                  onClick={() => reportarProblema(ativo.id)}
                  className="w-full py-3 bg-white border border-rose-100 text-rose-500 hover:bg-rose-50 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                >
                  <AlertTriangle size={14} /> Reportar Falha / Parada
                </button>
              ) : (
                <button 
                  onClick={() => finalizarManutencao(ativo.id)}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  <CheckCircle size={14} /> Finalizar Manutenção
                </button>
              )}

            </div>
          </div>
        ))}
      </div>
      
      {listaFiltrada.length === 0 && (
        <div className="text-center py-20 opacity-50">
          <Settings size={48} className="mx-auto mb-4 text-slate-300" />
          <p className="text-slate-500 font-bold">Nenhum ativo encontrado com este filtro.</p>
        </div>
      )}

    </div>
  );
}

export default Manutencao;