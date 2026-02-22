/**
 * @file ModalPDV.jsx
 * @description Ponto de Venda (Retail POS)
 * @author © 2026 Rickman Brown • Software Engineering
 */

import { useState } from "react";
import "../../App.css";

function ModalPDV({ onClose, estoqueDisponivel = [], onFinalizarVenda }) {
  const [passo, setPasso] = useState(1);
  const [venda, setVenda] = useState({
    produtoId: "",
    clienteNome: "",
    clienteCPF: "",
    formaPagamento: "Cartão de Crédito"
  });

  const produtoSelecionado = estoqueDisponivel.find(p => p.id === venda.produtoId);

  const handleFinalizar = () => {
    if (!venda.produtoId || !venda.clienteNome) {
      return alert("Dados incompletos.");
    }
    onFinalizarVenda(venda);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 font-sans text-left">
      <div className="absolute inset-0 bg-[#064e3b]/60 backdrop-blur-md animate-fade-in" onClick={onClose}></div>

      <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-slide-up border border-emerald-50 flex flex-col max-h-[90vh]">
        
        {/* HEADER TRANSACTIONAL */}
        <div className="bg-[#064e3b] px-8 py-6 text-white flex justify-between items-center">
          <div>
            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-[#b49157]">POS Terminal</p>
            <h2 className="text-xl font-black uppercase tracking-tighter">Faturamento</h2>
          </div>
          <div className="flex gap-1">
             <div className={`h-1 rounded-full transition-all ${passo >= 1 ? 'w-6 bg-[#b49157]' : 'w-3 bg-white/20'}`}></div>
             <div className={`h-1 rounded-full transition-all ${passo === 2 ? 'w-6 bg-[#b49157]' : 'w-3 bg-white/20'}`}></div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          {passo === 1 ? (
            <div className="space-y-4 animate-fade-in">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Selecione o Ativo</p>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {estoqueDisponivel.filter(p => p.status === "DISPONÍVEL").map(p => (
                  <button 
                    key={p.id}
                    onClick={() => setVenda({...venda, produtoId: p.id})}
                    className={`w-full flex justify-between items-center p-4 rounded-2xl border transition-all ${
                      venda.produtoId === p.id ? 'border-[#b49157] bg-[#b49157]/5' : 'border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <p className="text-[7px] font-black text-[#b49157] tracking-widest uppercase">{p.id}</p>
                      <p className="text-sm font-black text-[#064e3b] uppercase">{p.modelo}</p>
                    </div>
                    <p className="text-sm font-black text-[#064e3b]">R$ {p.preco.toLocaleString('pt-BR')}</p>
                  </button>
                ))}
              </div>
              <button 
                disabled={!venda.produtoId}
                onClick={() => setPasso(2)}
                className="w-full py-4 bg-[#064e3b] text-white rounded-2xl font-black uppercase tracking-widest disabled:opacity-20 text-[10px]"
              >
                Prosseguir
              </button>
            </div>
          ) : (
            <div className="space-y-5 animate-fade-in">
              <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 space-y-4">
                <input 
                  type="text" 
                  placeholder="Nome do Cliente" 
                  className="w-full bg-transparent border-b border-slate-200 py-2 text-sm font-bold text-[#064e3b] outline-none focus:border-[#b49157]"
                  onChange={(e) => setVenda({...venda, clienteNome: e.target.value})}
                />
                <select 
                  className="w-full bg-transparent border-b border-slate-200 py-2 text-xs font-bold text-[#064e3b] outline-none cursor-pointer"
                  onChange={(e) => setVenda({...venda, formaPagamento: e.target.value})}
                >
                  <option>Cartão de Crédito</option>
                  <option>PIX (Analu Pay)</option>
                  <option>Boleto Premium</option>
                </select>
              </div>

              {/* RECIBO*/}
              <div className="bg-slate-900 p-6 rounded-[2rem] text-white relative overflow-hidden">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[7px] font-black text-[#b49157] uppercase mb-1">{venda.produtoId}</p>
                    <p className="text-md font-black uppercase tracking-tight">{produtoSelecionado?.modelo}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black text-white tracking-tighter">
                      <span className="text-[#b49157] text-[10px] mr-1 italic">R$</span>
                      {produtoSelecionado?.preco.toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setPasso(1)} className="py-4 bg-slate-50 text-slate-400 font-black uppercase text-[9px] rounded-2xl">Revisar</button>
                <button onClick={handleFinalizar} className="py-4 bg-[#b49157] text-white font-black uppercase text-[9px] rounded-2xl shadow-lg">Finalizar</button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-slate-50 py-3 border-t border-slate-100">
          <p className="text-[7px] font-black text-slate-300 uppercase tracking-[0.5em] text-center">Secure Transaction • Rickman Brown</p>
        </div>
      </div>
    </div>
  );
}

export default ModalPDV;