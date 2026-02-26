/**
 * @file ModalSaidaProdutoEstofado.jsx
 * @description Protocolo de Logística: Saída de Fábrica 
 * @author © 2026 Rickman Brown • Software Engineering
 */

import { useState } from "react";
import "../../App.css";

function ModalSaidaProdutoEstofado({ onClose }) {
  const [prontosParaEnvio, setProntosParaEnvio] = useState([
    { id: "FAB-EAM-042", modelo: "Poltrona Charles Eames", acabamento: "Pau-Ferro", selecionado: false },
    { id: "FAB-CH-005", modelo: "Sofá Chesterfield", acabamento: "Couro Legítimo", selecionado: false },
    { id: "FAB-SLM-012", modelo: "Sofá Slim Minimalista", acabamento: "Linho Europeu", selecionado: false }
  ]);

  const toggleSelecao = (id) => {
    setProntosParaEnvio(prontosParaEnvio.map(item => 
      item.id === id ? { ...item, selecionado: !item.selecionado } : item
    ));
  };

  const totalSelecionado = prontosParaEnvio.filter(i => i.selecionado).length;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans">
      {/* OVERLAY EXECUTIVO */}
      <div className="absolute inset-0 bg-[#064e3b]/60 backdrop-blur-sm animate-fade-in" onClick={onClose}></div>

      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-slide-up border border-emerald-50">
        
        {/* HEADER LOGÍSTICO*/}
        <div className="bg-[#064e3b] px-6 py-4 text-white flex justify-between items-center">
          <div className="text-left">
            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-[#b49157]">Logistics Protocol</p>
            <h2 className="text-lg font-black uppercase tracking-tighter">Despacho de Ativos</h2>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors text-xl font-light">✕</button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Doca de Saída (Unidade 01)</h3>
          </div>
          
          {/* LISTAGEM DE ITENS */}
          <div className="space-y-2 max-h-[250px] overflow-y-auto custom-scrollbar">
            {prontosParaEnvio.map((item) => (
              <div 
                key={item.id} 
                onClick={() => toggleSelecao(item.id)}
                className={`flex items-center gap-4 p-3 rounded-xl border transition-all cursor-pointer ${
                  item.selecionado 
                  ? 'border-[#064e3b] bg-emerald-50/50 shadow-sm' 
                  : 'border-slate-100 bg-white hover:border-[#b49157]/30'
                }`}
              >
                {/* CHECKBOX */}
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all ${
                  item.selecionado ? 'bg-[#064e3b] border-[#064e3b] text-white' : 'border-slate-100 bg-slate-50'
                }`}>
                  {item.selecionado && <span className="text-[10px] font-black">✓</span>}
                </div>
                
                <div className="text-left flex-1">
                  <div className="flex justify-between items-center">
                    <p className="text-[11px] font-black text-[#064e3b] uppercase leading-none">{item.modelo}</p>
                    <span className="text-[8px] font-mono text-slate-300">#{item.id}</span>
                  </div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">{item.acabamento}</p>
                </div>
              </div>
            ))}
          </div>

          {/* MANIFESTO DE CARGA */}
          <div className="bg-slate-900 p-4 rounded-2xl flex justify-between items-center shadow-inner relative overflow-hidden">
            <div className="absolute right-0 top-0 w-16 h-16 bg-[#b49157]/10 rounded-full blur-2xl"></div>
            <div className="text-left relative z-10">
              <p className="text-[8px] font-black text-[#b49157] uppercase tracking-widest">Carga Selecionada</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black text-white leading-none">{totalSelecionado}</span>
                <span className="text-[8px] font-black text-slate-500 uppercase">Unid.</span>
              </div>
            </div>
            <div className="text-right relative z-10">
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Destino</p>
              <p className="text-[10px] font-black text-white uppercase mt-1">Showroom Principal</p>
            </div>
          </div>

          <button 
            disabled={totalSelecionado === 0}
            onClick={() => {
                alert(`Protocolo ANALU-LOG Gerado.`);
                onClose();
            }}
            className={`w-full py-4 rounded-xl font-black uppercase tracking-[0.2em] transition-all active:scale-[0.98] text-[10px] shadow-lg ${
              totalSelecionado > 0 
              ? 'bg-[#064e3b] text-white hover:bg-emerald-800' 
              : 'bg-slate-50 text-slate-300 cursor-not-allowed'
            }`}
          >
            Confirmar Despacho
          </button>
        </div>

        {/* FOOTER DISCRETO */}
        <div className="bg-slate-50 py-2 border-t border-slate-100">
          <p className="text-[7px] font-black text-slate-300 uppercase tracking-[0.4em] text-center">
            Logistics Engine • Rickman Brown
          </p>
        </div>
      </div>
    </div>
  );
}

export default ModalSaidaProdutoEstofado;