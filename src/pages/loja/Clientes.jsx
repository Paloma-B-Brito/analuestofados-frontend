/**
 * @file Clientes.jsx
 * @description CRM (Customer Relationship Management) - Gestão de Carteira e Histórico
 * @author © 2026 Minister Noiret • Software Engineering
 */

import { useState } from "react";
import { Search, User, Phone, MapPin, MessageCircle, ShoppingBag, Calendar, Star } from "lucide-react";

const clientesIniciais = [
  { 
    id: 1, 
    nome: "Juliana Paes (Arquiteta)", 
    telefone: "11999998888", 
    cidade: "São Paulo, SP", 
    status: "VIP", 
    ultimaCompra: "12/01/2026", 
    totalGasto: 15400,
    historico: ["Sofá Chesterfield", "2x Poltrona Eames"]
  },
  { 
    id: 2, 
    nome: "Dr. Roberto Campos", 
    telefone: "11988887777", 
    cidade: "Campinas, SP", 
    status: "Novo", 
    ultimaCompra: "10/02/2026", 
    totalGasto: 3200,
    historico: ["Sofá Retrátil Slim"]
  },
  { 
    id: 3, 
    nome: "Mariana Ximenes", 
    telefone: "21977776666", 
    cidade: "Rio de Janeiro, RJ", 
    status: "Em Negociação", 
    ultimaCompra: "-", 
    totalGasto: 0,
    historico: []
  },
  { 
    id: 4, 
    nome: "Escritório Advocacia Silva", 
    telefone: "11966665555", 
    cidade: "São Paulo, SP", 
    status: "Recorrente", 
    ultimaCompra: "05/11/2025", 
    totalGasto: 45000,
    historico: ["Projeto Corporativo Completo", "10x Cadeiras Lux"]
  }
];

function Clientes() {
  const [busca, setBusca] = useState("");
  const [clientes, setClientes] = useState(clientesIniciais);
  const clientesFiltrados = clientes.filter(c => 
    c.nome.toLowerCase().includes(busca.toLowerCase()) ||
    c.telefone.includes(busca)
  );

  // Função para abrir WhatsApp Web
  const abrirWhatsApp = (telefone) => {
    const url = `https://wa.me/55${telefone}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#f8f9f5] animate-fade-in p-6 font-sans">
      
      {/* HEADER DO CRM */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#064e3b] uppercase tracking-tighter">
            Carteira de <span className="text-[#b49157] italic font-light">Clientes</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            CRM Inteligente • {clientes.length} Cadastros Ativos
          </p>
        </div>
        <div className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="Buscar por nome ou telefone..." 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm font-bold text-[#064e3b] focus:outline-none focus:border-[#b49157] shadow-sm transition-all"
          />
          <Search className="absolute left-3 top-3 text-slate-300" size={18} />
        </div>
      </div>

      {/* GRID DE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clientesFiltrados.map((cliente) => (
          <div key={cliente.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border border-slate-100 transition-all group relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-full h-1 ${cliente.status === 'VIP' ? 'bg-[#b49157]' : 'bg-slate-100'}`}></div>

            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 text-[#064e3b]">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="font-black text-[#064e3b] text-sm uppercase">{cliente.nome}</h3>
                  <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold uppercase">
                    <MapPin size={10} /> {cliente.cidade}
                  </div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest
                ${cliente.status === 'VIP' ? 'bg-[#b49157]/10 text-[#b49157]' : 
                  cliente.status === 'Novo' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}
              `}>
                {cliente.status}
              </span>
            </div>
            <div className="bg-slate-50/50 rounded-xl p-3 mb-4 border border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone size={14} />
                  <span className="text-xs font-bold font-mono">{cliente.telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')}</span>
                </div>
                <button 
                  onClick={() => abrirWhatsApp(cliente.telefone)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-lg transition-colors flex items-center gap-2 text-[10px] font-black uppercase shadow-lg shadow-emerald-500/20"
                >
                  <MessageCircle size={14} /> WhatsApp
                </button>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase text-slate-400 border-b border-slate-100 pb-1">
                <span>Última Compra</span>
                <span>Total Gasto</span>
              </div>
              <div className="flex justify-between items-center text-sm font-black text-[#064e3b]">
                <div className="flex items-center gap-1">
                  <Calendar size={12} className="text-[#b49157]" /> {cliente.ultimaCompra}
                </div>
                <div className="text-[#b49157]">
                   R$ {cliente.totalGasto.toLocaleString('pt-BR')}
                </div>
              </div>

              {/* O que ele comprou? */}
              {cliente.historico.length > 0 && (
                <div className="mt-4 bg-[#f8f9f5] p-3 rounded-lg border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-2 flex items-center gap-1">
                    <ShoppingBag size={10} /> Histórico Recente
                  </p>
                  <ul className="space-y-1">
                    {cliente.historico.map((item, idx) => (
                      <li key={idx} className="text-[10px] font-bold text-slate-600 truncate">• {item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <button className="w-full mt-4 border border-[#064e3b]/10 text-[#064e3b] hover:bg-[#064e3b] hover:text-white py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">
              Ver Perfil Completo
            </button>

          </div>
        ))}
        
        <button className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-300 hover:border-[#b49157] hover:text-[#b49157] hover:bg-[#b49157]/5 transition-all group min-h-[300px]">
          <div className="w-16 h-16 rounded-full bg-slate-50 group-hover:bg-white flex items-center justify-center mb-4 transition-colors">
            <span className="text-3xl font-light">+</span>
          </div>
          <span className="font-black uppercase tracking-widest text-xs">Cadastrar Novo Cliente</span>
        </button>

      </div>
    </div>
  );
}

export default Clientes;