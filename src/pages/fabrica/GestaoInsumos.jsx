/**
 * @file GestaoInsumos.jsx
 * @description Gestão de Insumos
 * @author © 2026 Minister Noiret • Software Engineering
 */

import { useState } from "react";
import "../../App.css";
import ModalAdicionarMaterial from "../../components/modals/ModalAdicionarMaterial";

const mockInsumos = [
  { id: "INS-TEC-01", material: "Tecido Linho Europeu", unidade: "m", quantidade: 150, estoqueMinimo: 50, custoUnidade: 45.00, consumoPorEstofado: 8.5, categoria: "Têxtil" },
  { id: "INS-ESP-33", material: "Espuma Selada D33", unidade: "un", quantidade: 8, estoqueMinimo: 15, custoUnidade: 120.00, consumoPorEstofado: 2, categoria: "Preenchimento" },
  { id: "INS-MAD-EUC", material: "Madeira Eucalipto", unidade: "m³", quantidade: 5, estoqueMinimo: 2, custoUnidade: 850.00, consumoPorEstofado: 0.4, categoria: "Estrutura" },
  { id: "INS-GRA-01", material: "Grampos Galvanizados", unidade: "cx", quantidade: 20, estoqueMinimo: 5, custoUnidade: 25.00, consumoPorEstofado: 0.1, categoria: "Ferragens" },
  { id: "INS-COL-SP", material: "Cola Spray", unidade: "un", quantidade: 3, estoqueMinimo: 10, custoUnidade: 65.00, consumoPorEstofado: 0.5, categoria: "Adesivos" },
];

function GestaoInsumos() {
  const [materiais, setMateriais] = useState(mockInsumos);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 6; // Aumentado para 6 pois agora cabem mais itens

  const totalPaginas = Math.ceil(materiais.length / itensPorPagina);
  const materiaisExibidos = materiais.slice((paginaAtual - 1) * itensPorPagina, paginaAtual * itensPorPagina);

  const adicionarNovoMaterial = (dados) => {
    const novoItem = { ...dados, id: `INS-${Math.random().toString(36).substr(2, 4).toUpperCase()}`, 
      quantidade: Number(dados.quantidade), custoUnidade: Number(dados.custoUnidade), 
      estoqueMinimo: 10, consumoPorEstofado: 2 };
    setMateriais([novoItem, ...materiais]);
  };

  const custoTotalGeral = materiais.reduce((acc, item) => acc + (item.quantidade * item.custoUnidade), 0);

  return (
    <div className="w-full bg-white rounded-[1.5rem] shadow-xl border border-slate-100 flex flex-col overflow-hidden">
      
      {/* HEADER COMPACTO */}
      <div className="bg-[#064e3b] px-6 py-4 text-white flex justify-between items-center">
        <div className="text-left">
          <p className="text-[8px] font-black uppercase tracking-[0.4em] text-[#b49157]">Supply Intelligence</p>
          <h2 className="text-xl font-black uppercase tracking-tighter">Insumos & MP</h2>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#b49157] hover:bg-white hover:text-[#064e3b] px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all shadow-md active:scale-95"
        >
          + Novo Material
        </button>
      </div>

      {/* ÁREA DA TABELA - ALTA DENSIDADE */}
      <div className="p-2 md:p-4">
        
        {/* CABEÇALHO DISCRETO */}
        <div className="hidden lg:grid lg:grid-cols-6 px-4 py-2 text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-50 mb-2">
          <span>Item / SKU</span>
          <span className="text-center">Status</span>
          <span className="text-center">Saldo</span>
          <span className="text-center">Custo Un.</span>
          <span className="text-center">Total</span>
          <span className="text-right">Capacidade</span>
        </div>

        {/* LISTA ACHATADA */}
        <div className="space-y-1.5">
          {materiaisExibidos.map((item) => {
            const capacidade = Math.floor(item.quantidade / (item.consumoPorEstofado || 1));
            const critico = item.quantidade <= (item.estoqueMinimo || 5);

            return (
              <div 
                key={item.id} 
                className={`flex flex-col lg:grid lg:grid-cols-6 items-center px-2 py-4 border rounded-xl transition-all ${
                  critico ? 'bg-rose-50/40 border-rose-100' : 'bg-white border-slate-50 hover:border-[#b49157]/40'
                }`}
              >
                <div className="w-full lg:w-auto text-left">
                  <p className="text-[12px] font-black text-[#064e3b] uppercase leading-none">{item.material}</p>
                  <p className="text-[10px] font-mono text-slate-300 tracking-tighter">{item.id}</p>
                </div>

                <div className="flex justify-center py-1 lg:py-0">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${
                    critico ? 'bg-rose-500 text-white border-rose-600' : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}>
                    {critico ? "Repor" : "OK"}
                  </span>
                </div>

                <div className="text-center">
                  <p className={`text-sm font-black ${critico ? 'text-rose-600' : 'text-slate-800'}`}>
                    {item.quantidade}<span className="text-[13px] ml-0.5 opacity-50">{item.unidade}</span>
                  </p>
                </div>

                <div className="text-center hidden lg:block">
                  <p className="text-[16px] font-bold text-slate-500">R$ {item.custoUnidade.toFixed(2)}</p>
                </div>

                <div className="text-center">
                  <p className="text-[16px] font-black text-[#064e3b]">R$ {(item.quantidade * item.custoUnidade).toLocaleString('pt-BR')}</p>
                </div>

                <div className="w-full lg:text-right flex justify-center lg:justify-end">
                  <div className={`px-2 py-1 rounded-lg border flex items-center gap-2 ${
                    capacidade < 5 ? 'bg-rose-50 border-rose-100' : 'bg-emerald-50 border-emerald-100'
                  }`}>
                    <span className="text-[7px] font-black uppercase opacity-50">Cap:</span>
                    <span className={`text-[11px] font-black ${capacidade < 5 ? 'text-rose-600' : 'text-emerald-700'}`}>{capacidade} un</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* PAGINAÇÃO SLIM */}
        <div className="mt-4 pt-3 flex justify-between items-center border-t border-slate-50 px-2">
          <button 
            disabled={paginaAtual === 1}
            onClick={() => setPaginaAtual(prev => prev - 1)}
            className="text-[8px] font-black uppercase tracking-tighter opacity-50 hover:opacity-100 transition-all"
          >
            ← Voltar
          </button>
          <p className="text-[8px] font-black text-slate-300 uppercase">{paginaAtual} / {totalPaginas}</p>
          <button 
            disabled={paginaAtual === totalPaginas}
            onClick={() => setPaginaAtual(prev => prev + 1)}
            className="text-[8px] font-black uppercase tracking-tighter opacity-50 hover:opacity-100 transition-all"
          >
            Próximo →
          </button>
        </div>
      </div>

      {/* FOOTER BARRA ÚNICA */}
      <div className="bg-slate-50 px-6 py-2 border-t border-slate-100 flex justify-between items-center">
        <p className="text-[9px] font-black text-slate-400 uppercase">
          Total: <span className="text-[#064e3b] ml-1">{custoTotalGeral.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
        </p>
      </div>

      {isModalOpen && (
        <ModalAdicionarMaterial 
          onClose={() => setIsModalOpen(false)} 
          onSalvar={adicionarNovoMaterial} 
        />
      )}
    </div>
  );
}

export default GestaoInsumos;