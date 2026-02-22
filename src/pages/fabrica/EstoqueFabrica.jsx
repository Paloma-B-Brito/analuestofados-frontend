/**
 * @file EstoqueFabrica.jsx
 * @description Gestão de Fluxo de Fábrica com Visão Executiva (Financeira) e Operacional (Técnica)
 * @author © 2026 Minister Noiret • Software Engineering
 */

import { useState } from "react";


const mockEstofadosFabrica = [
  { id: "FAB-CH-001", modelo: "Sofá Chesterfield 3L", cliente: "Showroom", responsavel: "Mestre Ricardo", progresso: 65, status: "EM ANDAMENTO", materiais: "Couro Legítimo / Espuma D33", detalhes: "Estrutura Concluída", custoProducao: 3100.00, valorMercado: 8500.00 },
  { id: "FAB-EAM-042", modelo: "Poltrona Charles Eames", cliente: "VIP #982", responsavel: "Marcenaria", progresso: 100, status: "PRONTO", materiais: "Pau-Ferro / Couro", detalhes: "Finalizado", custoProducao: 1550.00, valorMercado: 4200.00 },
  { id: "FAB-SL-003", modelo: "Sofá Retrátil Slim", cliente: "Loja Jardins", responsavel: "Mestre Ricardo", progresso: 30, status: "EM ANDAMENTO", materiais: "Linho Europeu", detalhes: "Madeira Iniciada", custoProducao: 2200.00, valorMercado: 5800.00 },
  { id: "FAB-PUF-004", modelo: "Puff Capitonê Lux", cliente: "Showroom", responsavel: "Ana Paula", progresso: 100, status: "PRONTO", materiais: "Veludo Italiano", detalhes: "Embalagem Finalizada", custoProducao: 450.00, valorMercado: 1200.00 },
];

function EstoqueFabrica({ userRole }) {
  const [pedidos, setPedidos] = useState(mockEstofadosFabrica);
  const [historicoLoja, setHistoricoLoja] = useState([]);
  const [itemDetalhado, setItemDetalhado] = useState(null);
  const [abaAtiva, setAbaAtiva] = useState("PRODUCAO");
  const [pagina, setPagina] = useState(1);
  const itensPorPagina = 6; 

  // KPIs EXCLUSIVOS ADMIN (Cálculo Financeiro Blindado)
  const totalCustoEmLinha = pedidos.reduce((acc, p) => acc + p.custoProducao, 0);
  const valorVendaEstimado = pedidos.reduce((acc, p) => acc + p.valorMercado, 0);

  const enviarParaLoja = (item) => {
    // Simula a saída física do produto da fábrica para a logística
    setHistoricoLoja([{ ...item, status: "ENTREGUE", dataSaida: new Date().toLocaleDateString() }, ...historicoLoja]);
    setPedidos(pedidos.filter(p => p.id !== item.id));
  };

  const listaBase = abaAtiva === "PRODUCAO" ? pedidos : historicoLoja;
  const exibidos = listaBase.slice((pagina - 1) * itensPorPagina, pagina * itensPorPagina);
  const totalPaginas = Math.ceil(listaBase.length / itensPorPagina);

  return (
    <div className="w-full bg-white rounded-[2rem] shadow-xl border border-slate-100 flex flex-col overflow-hidden font-sans animate-fade-in">
      
      {/* HEADER DINÂMICO */}
      <header className={`px-6 md:px-8 py-6 text-white flex flex-col md:flex-row justify-between items-start md:items-center shrink-0 transition-colors ${userRole === 'ADMIN' ? 'bg-[#1e293b]' : 'bg-[#064e3b]'}`}>
        <div className="text-left mb-4 md:mb-0">
          <div className="flex items-center gap-3 mb-1">
            <p className="text-[#b49157] text-[9px] font-black uppercase tracking-[0.5em]">
              {userRole === 'ADMIN' ? 'Industrial Governance' : 'Production Control'}
            </p>
            
            {/* SELO DE ENGENHARIA (Apenas Rickman vê) */}
            {userRole === "ADMIN" && (
              <div className="hidden md:flex items-center gap-2 bg-[#b49157]/10 px-2 py-0.5 rounded-full border border-[#b49157]/20">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[7px] font-black text-[#b49157] uppercase tracking-tighter">Engenharia Ativa: Rickman Brown</span>
              </div>
            )}
          </div>

          <h2 className="text-2xl font-black uppercase tracking-tighter leading-none">
            {userRole === 'ADMIN' ? 'Gestão de Produção' : 'Chão de Fábrica'}
          </h2>
        </div>
        
        <div className="flex gap-4 items-center self-end md:self-auto">
            <div className="flex bg-black/20 p-1 rounded-xl border border-white/5">
                {["PRODUCAO", "HISTORICO"].map(aba => (
                    <button 
                    key={aba}
                    onClick={() => { setAbaAtiva(aba); setPagina(1); }}
                    className={`px-4 md:px-6 py-2 text-[9px] md:text-[10px] font-black uppercase rounded-lg transition-all ${abaAtiva === aba ? "bg-[#b49157] text-white shadow-lg" : "opacity-60 hover:opacity-100"}`}
                    >
                    {aba === "PRODUCAO" ? "Em Linha" : "Expedição"}
                    </button>
                ))}
            </div>
        </div>
      </header>

      {/* PAINEL DE KPI FINANCEIRO - VISÍVEL APENAS PARA ADMIN */}
      {userRole === 'ADMIN' && abaAtiva === "PRODUCAO" && (
        <div className="bg-slate-50 border-b px-8 py-6 grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-down">
            <div className="border-l-4 border-[#b49157] pl-4">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Custo em Linha (Investimento)</p>
                <p className="text-xl font-black text-slate-700">R$ {totalCustoEmLinha.toLocaleString()}</p>
            </div>
            <div className="border-l-4 border-emerald-500 pl-4">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Valor de Mercado (Potencial)</p>
                <p className="text-xl font-black text-emerald-600">R$ {valorVendaEstimado.toLocaleString()}</p>
            </div>
            <div className="border-l-4 border-slate-300 pl-4">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Lotes em Fabricação</p>
                <p className="text-xl font-black text-[#b49157]">{pedidos.length} <span className="text-[10px] text-slate-400">UNIDADES</span></p>
            </div>
        </div>
      )}

      {/* LISTAGEM OPERACIONAL */}
      <main className="p-5 space-y-3 bg-[#fcfcf9] flex-1 overflow-y-auto">
        {exibidos.length > 0 ? (
          exibidos.map((item) => (
            <div key={item.id} className={`group border rounded-[1.5rem] p-5 bg-white transition-all hover:shadow-lg ${item.status === "PRONTO" ? "border-emerald-100 shadow-emerald-50" : "border-slate-100"}`}>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                
                {/* BLOCO DE IDENTIFICAÇÃO (Comum a todos) */}
                <div className="flex-1 w-full">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wide ${item.status === "PRONTO" ? "bg-emerald-500 text-white" : "bg-amber-100 text-amber-700"}`}>
                      {item.status}
                    </span>
                    <span className="text-[9px] font-bold text-slate-300 tracking-wider">#{item.id}</span>
                  </div>
                  <h3 className="text-lg font-black text-[#064e3b] uppercase leading-none">{item.modelo}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                    Resp: <span className="text-slate-600">{item.responsavel}</span> • Cliente: <span className="text-[#b49157]">{item.cliente}</span>
                  </p>
                </div>

                {/* BARRA DE PROGRESSO (Foco da Fábrica) */}
                <div className="w-full md:w-48 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex justify-between mb-1">
                    <span className="text-[8px] font-black text-slate-400 uppercase">Progresso</span>
                    <span className="text-[10px] font-black text-[#064e3b]">{item.progresso}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-1000 ease-out ${item.status === "PRONTO" ? 'bg-emerald-500' : 'bg-[#064e3b]'}`} style={{ width: `${item.progresso}%` }}></div>
                  </div>
                </div>

                {/* DADOS FINANCEIROS ( Só ADMIN vê) */}
                {userRole === 'ADMIN' && abaAtiva === "PRODUCAO" && (
                  <div className="hidden md:block text-right border-l pl-6 min-w-[120px]">
                    <p className="text-[8px] font-black text-slate-400 uppercase">Custo Unit.</p>
                    <p className="text-sm font-black text-slate-700">R$ {item.custoProducao.toLocaleString()}</p>
                    <p className="text-[8px] font-black text-emerald-600 uppercase mt-1">Venda: R$ {item.valorMercado.toLocaleString()}</p>
                  </div>
                )}

                {/* AÇÕES */}
                <div className="flex gap-2 w-full md:w-auto">
                  <button onClick={() => setItemDetalhado(itemDetalhado === item.id ? null : item.id)} className="flex-1 md:flex-none px-4 py-3 bg-slate-50 text-slate-600 text-[9px] font-black uppercase rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
                    {itemDetalhado === item.id ? "Fechar" : "Ficha Técnica"}
                  </button>
                  
                  {/* Botão de Liberar: Disponível para Fábrica (quando termina) e Admin */}
                  {item.status === "PRONTO" && abaAtiva === "PRODUCAO" && (
                    <button onClick={() => enviarParaLoja(item)} className="flex-1 md:flex-none px-5 py-3 bg-[#b49157] text-white text-[9px] font-black uppercase rounded-xl shadow-lg hover:bg-[#9a7b48] hover:-translate-y-0.5 transition-all">
                      Expedir p/ Loja
                    </button>
                  )}
                </div>
              </div>

              {/* FICHA TÉCNICA EXPANDIDA */}
              {itemDetalhado === item.id && (
                <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in bg-slate-50/50 p-4 rounded-xl">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-[#064e3b] uppercase tracking-widest flex items-center gap-2">
                      <span className="w-1 h-1 bg-[#064e3b] rounded-full"></span> Materiais & Insumos
                    </p>
                    <p className="text-[11px] font-bold text-slate-600 uppercase pl-3 border-l-2 border-slate-200">{item.materiais}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-[#b49157] uppercase tracking-widest flex items-center gap-2">
                      <span className="w-1 h-1 bg-[#b49157] rounded-full"></span> Diário de Bordo
                    </p>
                    <p className="text-[11px] font-bold text-slate-600 uppercase pl-3 border-l-2 border-slate-200">{item.detalhes}</p>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-20 opacity-40">
            <p className="text-4xl mb-4">🏭</p>
            <p className="text-[10px] font-black uppercase tracking-widest">Nenhum item nesta lista</p>
          </div>
        )}
      </main>

      {/* PAGINAÇÃO */}
      <footer className="bg-slate-50 px-8 py-4 border-t border-slate-100 flex justify-between items-center no-print">
        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Página {pagina} de {totalPaginas}</span>
        <div className="flex gap-2">
            <button disabled={pagina === 1} onClick={() => setPagina(p => p - 1)} className="w-8 h-8 flex items-center justify-center rounded-lg border bg-white disabled:opacity-20 hover:border-[#b49157] transition-colors">←</button>
            <button disabled={pagina === totalPaginas} onClick={() => setPagina(p => p + 1)} className="w-8 h-8 flex items-center justify-center rounded-lg border bg-white disabled:opacity-20 hover:border-[#b49157] transition-colors">→</button>
        </div>
      </footer>
    </div>
  );
}

export default EstoqueFabrica;