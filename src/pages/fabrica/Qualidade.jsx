/**
 * @file Qualidade.jsx
 * @description Portal de Certificação de Excelência e Inspeção Técnica
 * @author © 2026 Minister Noiret • Software Engineering
 */

import React, { useState } from 'react';
import { 
  ClipboardCheck, CheckCircle, XCircle, AlertTriangle, 
  Search, Eye, Camera, ThumbsUp, ThumbsDown, ShieldCheck 
} from 'lucide-react';

// DADOS MOCKADOS (Fila de Inspeção)
const inspecoesIniciais = [
  { id: "#QC-8821", produto: "Sofá Chesterfield 3L", artesao: "Carlos Silva", lote: "L-2026-001", status: "PENDENTE", foto: "url-fake" },
  { id: "#QC-8822", produto: "Poltrona Eames Couro", artesao: "Mariana Souza", lote: "L-2026-002", status: "APROVADO", foto: "url-fake" },
  { id: "#QC-8823", produto: "Cadeira Jantar Lux", artesao: "Roberto Lima", lote: "L-2026-003", status: "REPROVADO", motivo: "Costura torta no encosto", foto: "url-fake" },
  { id: "#QC-8824", produto: "Sofá Retrátil Slim", artesao: "Carlos Silva", lote: "L-2026-004", status: "PENDENTE", foto: "url-fake" },
];

function Qualidade() {
  const [lista, setLista] = useState(inspecoesIniciais);
  const [modalAberto, setModalAberto] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [filtro, setFiltro] = useState("TODOS");

  // KPIs Calculados
  const total = lista.length;
  const aprovados = lista.filter(i => i.status === 'APROVADO').length;
  const taxaAprovacao = Math.round((aprovados / (lista.filter(i => i.status !== 'PENDENTE').length || 1)) * 100);

  // ABRIR INSPEÇÃO
  const abrirInspecao = (item) => {
    setItemSelecionado(item);
    setModalAberto(true);
  };

  // AÇÃO DE APROVAR/REPROVAR
  const finalizarInspecao = (status, motivo = "") => {
    const novaLista = lista.map(item => 
      item.id === itemSelecionado.id ? { ...item, status, motivo } : item
    );
    setLista(novaLista);
    setModalAberto(false);
  };

  // FILTRAGEM
  const listaFiltrada = lista.filter(item => filtro === "TODOS" ? true : item.status === filtro);

  return (
    <div className="animate-fade-in space-y-6 pb-10 relative">

      {/* --- MODAL DE AVALIAÇÃO TÉCNICA --- */}
      {modalAberto && itemSelecionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            <div className="bg-[#064e3b] p-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-2">
                <ShieldCheck />
                <h3 className="font-black uppercase tracking-widest text-sm">Avaliação Técnica {itemSelecionado.id}</h3>
              </div>
              <button onClick={() => setModalAberto(false)} className="hover:bg-white/20 p-1 rounded transition-colors"><XCircle /></button>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="flex gap-6 flex-col md:flex-row">
                {/* Lado Esquerdo: Info Produto */}
                <div className="flex-1 space-y-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Produto</p>
                    <p className="font-black text-slate-800 text-lg">{itemSelecionado.produto}</p>
                    <p className="text-xs text-slate-500 mt-1">Lote: {itemSelecionado.lote} • Artesão: {itemSelecionado.artesao}</p>
                  </div>

                  {/* Checklist Visual */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Checklist Obrigatório</p>
                    {["Alinhamento da Costura", "Tensão do Tecido", "Estabilidade da Estrutura", "Limpeza / Acabamento"].map((check, i) => (
                      <label key={i} className="flex items-center gap-3 p-3 border border-slate-100 rounded-lg hover:bg-slate-50 cursor-pointer">
                        <input type="checkbox" className="accent-[#b49157] w-4 h-4" defaultChecked={itemSelecionado.status === 'APROVADO'} />
                        <span className="text-sm font-medium text-slate-700">{check}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Lado Direito: Ações */}
                <div className="w-full md:w-1/3 flex flex-col gap-3">
                  <div className="aspect-square bg-slate-100 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-200 text-slate-400 flex-col gap-2 cursor-pointer hover:border-[#b49157] hover:text-[#b49157] transition-all">
                    <Camera size={24} />
                    <span className="text-[10px] font-black uppercase">Anexar Foto</span>
                  </div>
                  
                  <div className="mt-auto space-y-2">
                     <button 
                        onClick={() => finalizarInspecao("APROVADO")}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black uppercase text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
                     >
                       <ThumbsUp size={16} /> Aprovar Lote
                     </button>
                     <button 
                        onClick={() => finalizarInspecao("REPROVADO", "Falha no checklist")}
                        className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-black uppercase text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20 transition-all"
                     >
                       <ThumbsDown size={16} /> Reprovar
                     </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- HEADER DA PÁGINA --- */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#064e3b] uppercase tracking-tighter">
            Controle de <span className="text-[#b49157]">Qualidade</span>
          </h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">
            Garantia de Excelência & Padrão Analu
          </p>
        </div>
        
        {/* Filtros */}
        <div className="bg-white p-1 rounded-lg border border-slate-200 shadow-sm flex">
           {["TODOS", "PENDENTE", "APROVADO", "REPROVADO"].map(f => (
             <button 
               key={f}
               onClick={() => setFiltro(f)}
               className={`px-4 py-2 text-[10px] font-black uppercase rounded-md transition-all ${filtro === f ? 'bg-[#064e3b] text-white' : 'text-slate-400 hover:bg-slate-50'}`}
             >
               {f}
             </button>
           ))}
        </div>
      </div>

      {/* --- KPI CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Taxa de Aprovação</p>
            <p className="text-3xl font-black text-[#b49157]">{taxaAprovacao}%</p>
          </div>
          <div className="w-12 h-12 bg-[#b49157]/10 rounded-full flex items-center justify-center text-[#b49157]">
            <CheckCircle size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Itens Pendentes</p>
            <p className="text-3xl font-black text-blue-600">{lista.filter(i => i.status === 'PENDENTE').length}</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            <ClipboardCheck size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Retrabalhos Hoje</p>
            <p className="text-3xl font-black text-rose-500">{lista.filter(i => i.status === 'REPROVADO').length}</p>
          </div>
          <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center text-rose-600">
            <AlertTriangle size={24} />
          </div>
        </div>
      </div>

      {/* --- TABELA DE INSPEÇÃO --- */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-wider border-b border-slate-100">
              <th className="px-6 py-4">ID Inspeção</th>
              <th className="px-6 py-4">Produto / Lote</th>
              <th className="px-6 py-4">Artesão Resp.</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {listaFiltrada.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4 font-mono text-xs font-bold text-slate-500">{item.id}</td>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-[#064e3b]">{item.produto}</p>
                  <p className="text-[10px] text-slate-400 uppercase">{item.lote}</p>
                </td>
                <td className="px-6 py-4 text-xs font-medium text-slate-600">{item.artesao}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase
                    ${item.status === 'APROVADO' ? 'bg-emerald-100 text-emerald-700' : 
                      item.status === 'REPROVADO' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}
                  `}>
                    {item.status}
                  </span>
                  {item.status === 'REPROVADO' && (
                    <p className="text-[9px] text-rose-500 mt-1 font-bold">Obs: {item.motivo}</p>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  {item.status === 'PENDENTE' ? (
                    <button 
                      onClick={() => abrirInspecao(item)}
                      className="bg-[#064e3b] text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-[#08634b] transition-all shadow-lg shadow-emerald-900/20"
                    >
                      Avaliar
                    </button>
                  ) : (
                    <button className="text-slate-300 cursor-not-allowed px-4 py-2 text-[10px] font-black uppercase flex items-center justify-end gap-1 w-full">
                      <CheckCircle size={14} /> Finalizado
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {listaFiltrada.length === 0 && (
          <div className="p-12 text-center text-slate-300 font-bold uppercase text-xs">
            Nenhum item encontrado neste filtro.
          </div>
        )}
      </div>

    </div>
  );
}

export default Qualidade;