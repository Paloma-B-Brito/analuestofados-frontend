/**
 * @file ModalConsultaGeral.jsx
 * @description Central de Busca 
 * @author © 2026 — Rickman Brown
 */

import { useState } from "react";
import "../../App.css";

function ModalConsultaGeral({ onClose }) {
  const [termoBusca, setTermoBusca] = useState("");
  const [itemExpandido, setItemExpandido] = useState(null);
  
  const baseGlobal = [
    { 
      id: "SOF-001", nome: "Sofá Chesterfield", tipo: "Estofado", 
      local: "Fábrica", estoque: 2, progresso: 65, estimativa: "4 dias",
      detalhes: "Estrutura montada, aguardando aplicação do capitonê em couro legítimo."
    },
    { 
      id: "COS-042", nome: "Perfume Analu Noir", tipo: "Cosmético", 
      local: "Showroom", estoque: 15, progresso: 100, estimativa: "Imediata",
      detalhes: "Lote premium de 100ml. Armazenamento climatizado ok."
    },
    { 
      id: "INS-992", nome: "Tecido Linho Europeu", tipo: "Matéria-Prima", 
      local: "Almoxarifado", estoque: "45m", progresso: 100, estimativa: "Disponível",
      detalhes: "Fornecedor: Império dos Tecidos. Rolo lacrado e auditado."
    }
  ];

  const resultados = baseGlobal.filter(item => 
    item.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
    item.id.toLowerCase().includes(termoBusca.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[120] flex items-start justify-center p-4 pt-10 font-sans">
      <div className="absolute inset-0 bg-[#064e3b]/50 backdrop-blur-md animate-fade-in" onClick={onClose}></div>

      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-slide-up border border-emerald-50 flex flex-col max-h-[85vh]">
        
        {/* BUSCA */}
        <div className="p-5 bg-white border-b border-slate-50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-[#064e3b] rounded-xl flex items-center justify-center text-[#b49157] font-black text-[10px]">A</div>
            <div className="text-left">
              <p className="text-[7px] font-black uppercase tracking-[0.4em] text-[#b49157]">Intelligence</p>
              <h3 className="text-sm font-black text-[#064e3b] uppercase tracking-tighter">Consulta Unificada</h3>
            </div>
            <button onClick={onClose} className="ml-auto text-slate-300 hover:text-rose-500 transition-colors">✕</button>
          </div>
          
          <div className="relative">
            <input 
              autoFocus
              type="text"
              placeholder="SKU, Nome ou Categoria..."
              className="w-full pl-5 pr-12 py-3.5 bg-slate-50 border border-transparent rounded-xl font-bold text-[#064e3b] outline-none focus:border-[#b49157] focus:bg-white transition-all placeholder:text-slate-300 text-sm"
              onChange={(e) => { setTermoBusca(e.target.value); setItemExpandido(null); }}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#b49157]/50">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
               </svg>
            </div>
          </div>
        </div>

        {/* LISTAGEM */}
        <div className="overflow-y-auto flex-1 p-4 space-y-2 bg-slate-50/30 custom-scrollbar">
          {resultados.length > 0 ? (
            resultados.map((item) => (
              <div 
                key={item.id} 
                className={`border rounded-2xl transition-all ${
                  itemExpandido === item.id ? 'border-[#b49157] bg-white shadow-xl' : 'border-slate-100 bg-white'
                }`}
              >
                <button 
                  onClick={() => setItemExpandido(itemExpandido === item.id ? null : item.id)}
                  className="w-full p-4 flex justify-between items-center text-left"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                       <span className="text-[7px] font-black text-[#b49157] uppercase tracking-widest">{item.id}</span>
                       <span className="text-[7px] font-black px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 uppercase">{item.local}</span>
                    </div>
                    <h4 className="text-sm font-black text-[#064e3b] uppercase tracking-tight">{item.nome}</h4>
                  </div>
                  <div className={`transition-transform duration-300 ${itemExpandido === item.id ? 'rotate-180 text-[#b49157]' : 'text-slate-300'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </button>

                {itemExpandido === item.id && (
                  <div className="px-5 pb-5 animate-fade-in border-t border-slate-50 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1">Stock</p>
                          <p className="text-xl font-black text-[#064e3b] leading-none">{item.estoque}</p>
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic">"{item.detalhes}"</p>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-[7px] font-black text-[#064e3b] uppercase">Prontidão</p>
                          <span className="text-[9px] font-black text-[#b49157]">{item.progresso}%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                          <div className="bg-[#b49157] h-full transition-all duration-1000" style={{ width: `${item.progresso}%` }}></div>
                        </div>
                        <div className="mt-3 flex justify-between items-center border-t border-slate-200/50 pt-2">
                           <p className="text-[7px] font-bold text-slate-400 uppercase">Lead Time:</p>
                           <p className="text-[9px] font-black text-[#064e3b] uppercase">{item.estimativa}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="py-16 text-center opacity-30">
              <p className="text-[9px] font-black uppercase tracking-[0.3em]">Nenhum ativo localizado</p>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="bg-slate-900 px-6 py-3 flex justify-between items-center">
          <p className="text-[6px] font-black text-white/20 uppercase tracking-[0.5em]">Real-Time Engine • ANALU</p>
          <div className="flex gap-1.5">
             <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div>
             <div className="w-1 h-1 rounded-full bg-[#b49157] animate-pulse delay-75"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalConsultaGeral;