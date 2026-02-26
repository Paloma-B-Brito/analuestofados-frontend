/**
 * @file Entregas.jsx
 * @description Gestão Logística - Controle de Rotas e Status de Entrega
 * @author © 2026 Rickman Brown • Software Engineering
 */

import React, { useState } from 'react';
import { Truck, MapPin, CheckCircle, Clock, Package, Phone, Navigation, Map } from 'lucide-react';

const entregasIniciais = [
  {
    id: "#PED-901",
    cliente: "Fernanda Torres",
    endereco: "Av. Paulista, 1578 - Bela Vista, SP",
    itens: ["1x Sofá Retrátil 3m", "2x Almofadas Decorativas"],
    status: "PENDENTE", // PENDENTE, EM_ROTA, ENTREGUE
    telefone: "11999999999",
    horarioPrevisto: "14:00 - 16:00"
  },
  {
    id: "#PED-905",
    cliente: "Roberto Carlos",
    endereco: "Rua Augusta, 500 - Consolação, SP",
    itens: ["1x Poltrona Eames Couro"],
    status: "EM_ROTA",
    telefone: "11988888888",
    horarioPrevisto: "10:00 - 12:00"
  },
  {
    id: "#PED-880",
    cliente: "Escritório & Cia",
    endereco: "Rua Funchal, 200 - Vila Olímpia, SP",
    itens: ["4x Cadeiras Office Lux"],
    status: "ENTREGUE",
    telefone: "11977777777",
    horarioPrevisto: "09:00"
  }
];

function Entregas() {
  const [entregas, setEntregas] = useState(entregasIniciais);
  const [filtro, setFiltro] = useState("TODOS"); // TODOS, PENDENTE, EM_ROTA, ENTREGUE

  // Função para avançar o status da entrega
  const avancarStatus = (id, statusAtual) => {
    let novoStatus = statusAtual;
    if (statusAtual === "PENDENTE") novoStatus = "EM_ROTA";
    else if (statusAtual === "EM_ROTA") novoStatus = "ENTREGUE";

    const novaLista = entregas.map(item => 
      item.id === id ? { ...item, status: novoStatus } : item
    );
    setEntregas(novaLista);
  };

  // Abrir GPS (Google Maps)
  const abrirMapa = (endereco) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco)}`;
    window.open(url, "_blank");
  };

  // Abrir WhatsApp
  const abrirZap = (telefone) => {
    window.open(`https://wa.me/55${telefone}`, "_blank");
  };

  // Filtragem
  const listaFiltrada = entregas.filter(item => 
    filtro === "TODOS" ? true : item.status === filtro
  );

  return (
    <div className="animate-fade-in space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#064e3b] uppercase tracking-tighter">
            Logística & <span className="text-[#b49157]">Entregas</span>
          </h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">
            Gestão de Rotas do Dia
          </p>
        </div>

        {/* Filtros em Abas */}
        <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          {["TODOS", "PENDENTE", "EM_ROTA", "ENTREGUE"].map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`px-4 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${
                filtro === f 
                ? 'bg-[#064e3b] text-white shadow-md' 
                : 'text-slate-400 hover:bg-slate-50'
              }`}
            >
              {f.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* GRID DE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {listaFiltrada.map((item) => (
          <div key={item.id} className={`bg-white rounded-2xl border-l-4 shadow-sm hover:shadow-xl transition-all p-6 group relative overflow-hidden
            ${item.status === 'ENTREGUE' ? 'border-emerald-500 opacity-80' : 
              item.status === 'EM_ROTA' ? 'border-blue-500' : 'border-[#b49157]'}
          `}>
            
            {/* Topo do Card */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-1 rounded-md">
                  {item.id}
                </span>
                <h3 className="text-lg font-black text-[#064e3b] mt-2">{item.cliente}</h3>
              </div>
              
              {/* Badge de Status */}
              <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase flex items-center gap-1
                ${item.status === 'ENTREGUE' ? 'bg-emerald-100 text-emerald-700' : 
                  item.status === 'EM_ROTA' ? 'bg-blue-100 text-blue-700 animate-pulse' : 'bg-yellow-100 text-yellow-700'}
              `}>
                {item.status === 'EM_ROTA' && <Truck size={12} />}
                {item.status === 'ENTREGUE' && <CheckCircle size={12} />}
                {item.status === 'PENDENTE' && <Clock size={12} />}
                {item.status.replace("_", " ")}
              </div>
            </div>

            {/* Endereço & Mapa */}
            <div className="bg-slate-50 rounded-xl p-3 mb-4 border border-slate-100 group-hover:border-[#b49157]/30 transition-colors">
              <div className="flex items-start gap-3">
                <MapPin className="text-[#b49157] shrink-0 mt-1" size={16} />
                <div>
                  <p className="text-xs font-bold text-slate-700">{item.endereco}</p>
                  <button 
                    onClick={() => abrirMapa(item.endereco)}
                    className="text-[10px] font-black text-blue-600 hover:underline mt-1 flex items-center gap-1"
                  >
                    <Map size={10} /> Abrir no Google Maps
                  </button>
                </div>
              </div>
            </div>

            {/* Lista de Itens */}
            <div className="mb-6">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                <Package size={12} /> Carga
              </p>
              <ul className="space-y-1">
                {item.itens.map((prod, i) => (
                  <li key={i} className="text-xs font-medium text-slate-600 border-b border-slate-50 pb-1 last:border-0">
                    • {prod}
                  </li>
                ))}
              </ul>
            </div>

            {/* Ações (Botões) */}
            <div className="flex gap-2 mt-auto pt-4 border-t border-slate-100">
              <button 
                onClick={() => abrirZap(item.telefone)}
                className="flex-1 bg-white border border-slate-200 text-slate-600 py-2 rounded-lg text-xs font-black uppercase hover:bg-slate-50 hover:text-emerald-600 transition-colors flex items-center justify-center gap-2"
              >
                <Phone size={14} /> Contato
              </button>

              {item.status !== "ENTREGUE" && (
                <button 
                  onClick={() => avancarStatus(item.id, item.status)}
                  className={`flex-1 py-2 rounded-lg text-xs font-black uppercase text-white shadow-lg transition-all flex items-center justify-center gap-2
                    ${item.status === 'PENDENTE' 
                      ? 'bg-[#064e3b] hover:bg-[#08634b]' 
                      : 'bg-emerald-500 hover:bg-emerald-600'}
                  `}
                >
                  {item.status === 'PENDENTE' ? (
                    <> <Navigation size={14} /> Iniciar Rota </>
                  ) : (
                    <> <CheckCircle size={14} /> Confirmar </>
                  )}
                </button>
              )}
              
              {item.status === "ENTREGUE" && (
                <div className="flex-1 bg-slate-100 text-slate-400 rounded-lg flex items-center justify-center text-xs font-black uppercase cursor-not-allowed">
                  Finalizado
                </div>
              )}
            </div>

          </div>
        ))}
      </div>
      
      {listaFiltrada.length === 0 && (
        <div className="text-center py-20 opacity-50">
          <Truck size={48} className="mx-auto mb-4 text-slate-300" />
          <p className="text-slate-500 font-bold">Nenhuma entrega encontrada neste filtro.</p>
        </div>
      )}

    </div>
  );
}

export default Entregas;