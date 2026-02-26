/**
 * @file ModalAdicionarMaterial.jsx
 * @description Registro de Insumos 
 * @author © 2026 Rickman Brown • Software Engineering
 */

import { useState } from "react";

function ModalAdicionarMaterial({ onClose, onSalvar }) {
  const [formData, setFormData] = useState({
    material: "",
    categoria: "Têxtil",
    unidade: "Metros",
    quantidade: "",
    custoUnidade: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.material || !formData.quantidade || !formData.custoUnidade) {
      alert("⚠️ Parâmetros Insuficientes: Preencha todos os campos técnicos.");
      return;
    }
    onSalvar(formData); 
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 font-sans">
      <div 
        className="absolute inset-0 bg-[#064e3b]/85 backdrop-blur-md transition-opacity duration-300" 
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden border border-emerald-50/20 flex flex-col scale-100 transition-all">
        <div className="bg-[#064e3b] p-6 text-white flex justify-between items-center shrink-0 border-b border-white/5">
          <div className="text-left">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#b49157] mb-0.5">Supply Chain</p>
            <h2 className="text-xl font-black uppercase tracking-tighter leading-none">Novo Insumo</h2>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-rose-500/80 transition-all border border-white/10"
          >
            ✕
          </button>
        </div>

        {/* FORMULÁRIO TÉCNICO */}
        <form onSubmit={handleSubmit} className="p-7 space-y-5 bg-white">
          
          {/* ESPECIFICAÇÃO DO MATERIAL */}
          <div className="space-y-1.5 text-left">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Especificação Técnica</label>
            <input 
              required
              type="text" 
              placeholder="Ex: Espuma D33 Soft"
              className="w-full p-4 bg-slate-50 border border-slate-100 focus:border-[#b49157] focus:bg-white rounded-2xl font-bold text-[#064e3b] outline-none transition-all text-sm placeholder:text-slate-200"
              value={formData.material}
              onChange={(e) => setFormData({...formData, material: e.target.value.toUpperCase()})}
            />
          </div>

          {/* GRID: CATEGORIA E UNIDADE */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 text-left">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Categoria</label>
              <div className="relative">
                <select 
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-[#064e3b] outline-none text-xs appearance-none cursor-pointer"
                  value={formData.categoria}
                  onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                >
                  <option value="Têxtil">Têxtil</option>
                  <option value="Preenchimento">Preenchimento</option>
                  <option value="Estrutura">Estrutura</option>
                  <option value="Acabamento">Acabamento</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#b49157] text-[10px]">▼</div>
              </div>
            </div>
            <div className="space-y-1.5 text-left">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Unidade</label>
              <div className="relative">
                <select 
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-[#064e3b] outline-none text-xs appearance-none cursor-pointer"
                  value={formData.unidade}
                  onChange={(e) => setFormData({...formData, unidade: e.target.value})}
                >
                  <option value="Metros">Metros (m)</option>
                  <option value="Blocos">Blocos (un)</option>
                  <option value="Kg">Quilos (kg)</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#b49157] text-[10px]">▼</div>
              </div>
            </div>
          </div>

          {/* DASHBOARD FINANCEIRO */}
          <div className="grid grid-cols-2 gap-4 p-5 bg-slate-900 rounded-[2rem] shadow-inner relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#b49157]/10 to-transparent pointer-events-none"></div>
            
            <div className="text-left relative z-10 border-r border-slate-800 pr-2">
              <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Qtd. Entrada</label>
              <input 
                required
                type="number" 
                placeholder="0"
                className="w-full bg-transparent py-1 font-black text-white outline-none focus:border-emerald-500 text-lg transition-all"
                value={formData.quantidade}
                onChange={(e) => setFormData({...formData, quantidade: e.target.value})}
              />
            </div>

            <div className="text-left relative z-10 pl-2">
              <label className="text-[8px] font-black text-[#b49157] uppercase tracking-widest block text-right mb-1">Custo Un.</label>
              <div className="flex items-center justify-end gap-1">
                <input 
                  required
                  type="number" 
                  step="0.01"
                  placeholder="0.00"
                  className="w-full bg-transparent py-1 font-black text-white outline-none focus:border-[#b49157] text-lg text-right transition-all"
                  value={formData.custoUnidade}
                  onChange={(e) => setFormData({...formData, custoUnidade: e.target.value})}
                />
                <span className="text-[10px] font-black text-[#b49157]/50">R$</span>
              </div>
            </div>
          </div>

          {/* BOTÃO DE REGISTRO */}
          <button 
            type="submit"
            className="w-full py-4.5 bg-[#064e3b] text-white rounded-2xl font-black uppercase tracking-[0.3em] shadow-xl hover:bg-[#b49157] hover:-translate-y-0.5 transition-all active:scale-[0.97] text-[10px] mt-2"
          >
            Registrar no Sistema
          </button>
        </form>

        {/* FOOTER AUDIT */}
        <div className="bg-slate-50 py-4 border-t border-slate-100">
          <p className="text-[7px] font-black text-slate-300 uppercase tracking-[0.5em] text-center flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Inventory Protocol • Rickman Brown
          </p>
        </div>
      </div>
    </div>
  );
}

export default ModalAdicionarMaterial;