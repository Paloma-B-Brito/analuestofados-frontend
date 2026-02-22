/**
 * @file ModalPerdaProducao.jsx
 * @description Gestão de Avarias e Controle de Qualidade 
 * @author © 2026 Minister Noiret • Software Engineering
 */

import { useState } from "react";
import "../../App.css";

function ModalPerdaProducao({ onClose }) {
  const [avaria, setAvaria] = useState({
    item: "",
    origem: "Loja / Showroom",
    severidade: "Média",
    causa: "Transporte",
    descricao: "",
    acao: "Manutenção"
  });

  const handleSalvar = (e) => {
    e.preventDefault();
    alert(`Protocolo Gerado: ${avaria.item} -> ${avaria.acao.toUpperCase()}`);
    onClose();
  };

  const getSeverityStyle = () => {
    if (avaria.severidade === "Alta") return "bg-rose-600 text-white border-rose-600";
    if (avaria.severidade === "Média") return "bg-amber-500 text-white border-amber-500";
    return "bg-emerald-500 text-white border-emerald-500";
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 font-sans">
      {/* OVERLAY DE ALERTA */}
      <div className="absolute inset-0 bg-[#450a0a]/60 backdrop-blur-sm animate-fade-in" onClick={onClose}></div>

      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-slide-up border border-rose-50 flex flex-col">
        
        {/* HEADER DE INCIDENTE */}
        <div className="bg-[#8b0000] px-6 py-4 text-white flex justify-between items-center">
          <div className="text-left">
            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-rose-300">Quality Control</p>
            <h2 className="text-lg font-black uppercase tracking-tighter">Relatar Avaria</h2>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors text-xl font-light">✕</button>
        </div>

        <form onSubmit={handleSalvar} className="p-5 space-y-4 bg-white text-left">
          
          <div className="space-y-1">
            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Identificação do Ativo</label>
            <input 
              required
              type="text" 
              placeholder="SKU ou Nome do Produto..."
              className="w-full px-4 py-2.5 bg-rose-50/30 border border-rose-100 rounded-xl font-bold text-rose-950 outline-none focus:border-rose-600 text-xs transition-all"
              onChange={(e) => setAvaria({...avaria, item: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Ponto Crítico</label>
              <select 
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-700 outline-none text-[10px]"
                onChange={(e) => setAvaria({...avaria, origem: e.target.value})}
              >
                <option>Loja / Showroom</option>
                <option>Fábrica / Produção</option>
                <option>Logística</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Impacto</label>
              <select 
                className={`w-full px-3 py-2.5 border rounded-xl font-black outline-none text-[10px] transition-all duration-300 ${getSeverityStyle()}`}
                onChange={(e) => setAvaria({...avaria, severidade: e.target.value})}
                value={avaria.severidade}
              >
                <option value="Baixa">Baixo (Retoque)</option>
                <option value="Média">Médio (Reparo)</option>
                <option value="Alta">Alto (Perda)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Laudo Técnico</label>
            <textarea 
              rows="2"
              required
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl font-medium text-slate-700 outline-none text-[10px] resize-none"
              placeholder="Descreva o dano..."
              onChange={(e) => setAvaria({...avaria, descricao: e.target.value})}
            ></textarea>
          </div>

          {/* PROTOCOLO DE DESTINO*/}
          <div className="flex gap-2">
            {[
              { id: "Manutenção", label: "🛠️ Recuperar" },
              { id: "Descarte", label: "🗑️ Descartar" }
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setAvaria({...avaria, acao: opt.id})}
                className={`flex-1 py-3 rounded-xl border-2 font-black uppercase text-[9px] tracking-widest transition-all ${
                  avaria.acao === opt.id 
                  ? "border-rose-600 bg-rose-50 text-rose-900" 
                  : "border-slate-50 text-slate-300 bg-slate-50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-[#8b0000] text-white rounded-xl font-black uppercase tracking-[0.2em] shadow-lg hover:bg-rose-700 transition-all text-[10px] active:scale-[0.98]"
          >
            Emitir Relatório de Perda
          </button>
        </form>

        {/* FOOTER AUDIT*/}
        <div className="bg-rose-50/30 py-2 border-t border-rose-100">
          <p className="text-[7px] font-black text-rose-400 uppercase tracking-[0.4em] text-center">
            Quality Unit • Rickman Brown Engineering
          </p>
        </div>
      </div>
    </div>
  );
}

export default ModalPerdaProducao;