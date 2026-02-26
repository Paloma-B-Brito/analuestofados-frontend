/**
 * @file ModalSaidaProdutoVenda.jsx
 * @description Terminal de Checkout — Versão Integrada ao Estoque
 * @author © 2026 Rickman Brown • Software Engineering
 */

import { useState } from "react";
import '../../App.css';

function ModalSaidaProdutoVenda({ onClose, estoqueDisponivel = [], onFinalizarVenda }) {
  const [venda, setVenda] = useState({
    tipoItem: "Estofado",
    produto: "",
    valorBase: 0,
    desconto: 0,
    pagamento: "Cartão de Crédito",
    vendedor: "Ana Paula",
    obs: ""
  });

  const descontoCalculado = venda.valorBase * (venda.desconto / 100);
  const valorFinal = venda.valorBase - descontoCalculado;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans text-left">
      <div className="absolute inset-0 bg-[#064e3b]/60 backdrop-blur-sm animate-fade-in" onClick={onClose}></div>

      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-slide-up border border-emerald-50">
        
        {/* HEADER EXECUTIVO*/}
        <div className="bg-[#064e3b] px-6 py-4 text-white flex justify-between items-center">
          <div className="text-left">
            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-[#b49157]">Executive POS</p>
            <h2 className="text-lg font-black uppercase tracking-tighter">Checkout de Ativo</h2>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors text-xl font-light">✕</button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Vendedor</label>
              <select 
                value={venda.vendedor}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl font-bold text-[#064e3b] outline-none text-[10px]"
                onChange={(e) => setVenda({...venda, vendedor: e.target.value})}
              >
                <option>Ana Paula</option>
                <option>Ricardo Mestre</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Método</label>
              <select 
                className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl font-bold text-[#064e3b] outline-none text-[10px]"
                onChange={(e) => setVenda({...venda, pagamento: e.target.value})}
              >
                <option>Cartão</option>
                <option>PIX</option>
                <option>Dinheiro</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Selecionar do Estoque</label>
            <select 
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl font-bold text-[#064e3b] outline-none text-xs"
              onChange={(e) => {
                const item = estoqueDisponivel.find(i => i.modelo === e.target.value);
                if(item) setVenda({...venda, produto: item.modelo, valorBase: item.preco});
              }}
            >
              <option value="">Selecione um item...</option>
              {estoqueDisponivel.map((item) => (
                <option key={item.id} value={item.modelo}>{item.modelo} - R$ {item.preco}</option>
              ))}
            </select>
          </div>

          {/* PAINEL FINANCEIRO */}
          <div className="bg-slate-900 rounded-[1.5rem] p-4 text-white shadow-inner space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[7px] font-black text-[#b49157] uppercase block mb-1">Valor Base</span>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-white/30">R$</span>
                  <input 
                    type="number" 
                    value={venda.valorBase}
                    className="bg-transparent w-full text-lg font-black text-white outline-none"
                    onChange={(e) => setVenda({...venda, valorBase: parseFloat(e.target.value) || 0})}
                  />
                </div>
              </div>
              <div className="border-l border-white/5 pl-4">
                <span className="text-[7px] font-black text-rose-400 uppercase block mb-1">Desconto</span>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-rose-400/40">%</span>
                  <input 
                    type="number" 
                    className="bg-transparent w-full text-lg font-black text-rose-400 outline-none"
                    onChange={(e) => setVenda({...venda, desconto: parseFloat(e.target.value) || 0})}
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-white/5 flex justify-between items-end text-left">
              <div>
                <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Total Líquido</p>
                <p className="text-2xl font-black text-[#b49157] tracking-tighter">
                  R$ {valorFinal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                </p>
              </div>
              <div className="text-[7px] font-bold text-emerald-400 uppercase bg-emerald-400/10 px-2 py-1 rounded">
                Pronto para Receber
              </div>
            </div>
          </div>

          <button 
            disabled={venda.valorBase === 0 || !venda.produto}
            className="w-full py-4 bg-[#b49157] hover:bg-[#d4ae6d] disabled:bg-slate-100 disabled:text-slate-300 text-white rounded-xl font-black uppercase tracking-[0.2em] shadow-lg transition-all text-[9px] active:scale-95"
            onClick={() => {
              onFinalizarVenda(venda);
            }}
          >
            Finalizar e Gerar Recibo
          </button>
        </div>

        <div className="bg-slate-50 py-2 border-t border-slate-100">
          <p className="text-[7px] font-black text-slate-300 uppercase tracking-[0.4em] text-center">
            ANALU EXECUTIVE POS • Rickman Brown
          </p>
        </div>
      </div>
    </div>
  );
}

export default ModalSaidaProdutoVenda;