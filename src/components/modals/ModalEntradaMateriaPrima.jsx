/**
 * @file ModalEntradaMateriaPrima.jsx
 * @description Controle de Entrada
 * @author © 2026 Rickman Brown • Software Engineering
 */

import { useState } from "react";
import "../../App.css";

function ModalEntradaMateriaPrima({ onClose }) {
  const [insumo, setInsumo] = useState({
    tipo: "Tecido",
    quantidade: "",
    unidadeMedida: "Metros (m)",
    peso: "",
    valorNota: "",
    fornecedor: ""
  });

  const tiposInsumo = ["Tecido", "Espuma", "Madeira", "Ferragens", "Outros"];

  const handleConfirmar = () => {
    if (!insumo.fornecedor || !insumo.valorNota) {
      return alert("Preencha o fornecedor e o valor da nota.");
    }
    alert(`Entrada registrada com sucesso!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans">
      <div className="absolute inset-0 bg-[#064e3b]/60 backdrop-blur-sm animate-fade-in" onClick={onClose}></div>
      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-slide-up border border-emerald-50">
        
        {/* HEADER */}
        <div className="bg-[#064e3b] px-6 py-4 text-white flex justify-between items-center">
          <div className="text-left">
            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-[#b49157]">Inventory Protocol</p>
            <h2 className="text-lg font-black uppercase tracking-tighter">Entrada de Material</h2>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors text-xl font-light">✕</button>
        </div>

        <div className="p-6 space-y-4">
          
          {/* SELEÇÃO DE TIPO */}
          <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {tiposInsumo.map(t => (
              <button
                key={t}
                onClick={() => setInsumo({...insumo, tipo: t})}
                className={`whitespace-nowrap px-4 py-2 rounded-lg text-[9px] font-black uppercase border-2 transition-all ${
                  insumo.tipo === t ? "bg-[#064e3b] text-white border-[#064e3b]" : "bg-white text-slate-400 border-slate-100"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* DADOS DO FORNECEDOR */}
          <div className="space-y-1.5 text-left">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Fornecedor / Origem</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-[#064e3b] outline-none focus:border-[#b49157] transition-all text-sm"
              onChange={(e) => setInsumo({...insumo, fornecedor: e.target.value})}
            />
          </div>

          {/* QUANTIDADE E UNIDADE */}
          <div className="grid grid-cols-2 gap-3">
            <div className="text-left space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Qtd.</label>
              <input 
                type="number" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-black text-[#064e3b] outline-none text-sm"
                onChange={(e) => setInsumo({...insumo, quantidade: e.target.value})}
              />
            </div>
            <div className="text-left space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Unidade</label>
              <select 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-500 outline-none text-sm"
                onChange={(e) => setInsumo({...insumo, unidadeMedida: e.target.value})}
              >
                <option>Metros (m)</option>
                <option>Unid (un)</option>
                <option>Kg (massa)</option>
              </select>
            </div>
          </div>

          {/* FINANCEIRO DESTAQUE */}
          <div className="bg-slate-900 p-4 rounded-2xl flex justify-between items-center shadow-inner">
            <div className="text-left">
              <p className="text-[8px] font-black text-[#b49157] uppercase tracking-widest">Valor da Nota</p>
              <p className="text-[7px] text-white/30 uppercase">Sincronização ERP</p>
            </div>
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[#b49157] font-black text-xs italic">R$</span>
              <input 
                type="number" 
                placeholder="0,00"
                className="pl-8 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg font-black text-xl text-white outline-none focus:border-[#b49157] transition-all text-right w-32"
                onChange={(e) => setInsumo({...insumo, valorNota: e.target.value})}
              />
            </div>
          </div>

          <button 
            onClick={handleConfirmar}
            className="w-full py-4 bg-[#064e3b] text-white rounded-xl font-black uppercase tracking-[0.2em] shadow-lg active:scale-[0.98] transition-all hover:bg-emerald-800 text-[10px]"
          >
            Confirmar Recebimento
          </button>
        </div>

        {/* FOOTER DISCRETO */}
        <div className="bg-slate-50 px-6 py-2 border-t border-slate-100 flex justify-between items-center">
          <p className="text-[7px] font-black text-slate-300 uppercase tracking-widest">Auth: Rickman Brown</p>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
        </div>
      </div>
    </div>
  );
}

export default ModalEntradaMateriaPrima;