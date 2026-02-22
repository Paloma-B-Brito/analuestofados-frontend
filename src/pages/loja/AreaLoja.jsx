/**
 * @file AreaLoja.jsx
 * @description Gestão Comercial com Dual-View: Operacional (Loja) e Gerencial (Admin)
 * @author © 2026 Minister Noiret • Software Engineering
 */

import { useState, useEffect } from "react";

const mockEstoqueLoja = [
  { id: "LJ-CH-001", modelo: "Sofá Chesterfield 3 Lugares", categoria: "Sofás", acabamento: "Couro Legítimo", preco: 8500.00, custo: 4200.00, status: "DISPONÍVEL", vendedor: null, dataVenda: null, pagamento: null },
  { id: "COS-SK-022", modelo: "Kit Skin Care Advanced", categoria: "Cosméticos", acabamento: "Sérum + Hidratante", preco: 249.90, custo: 90.00, status: "DISPONÍVEL", vendedor: null, dataVenda: null, pagamento: null },
  { id: "LJ-EAM-042", modelo: "Poltrona Charles Eames", categoria: "Poltronas", acabamento: "Pau-Ferro / Preto", preco: 4200.00, custo: 1800.00, status: "VENDIDO", vendedor: "Mestre Ricardo", dataVenda: "2026-02-09", pagamento: "Pix" },
  { id: "LJ-SL-003", modelo: "Sofá Retrátil Slim", categoria: "Sofás", acabamento: "Linho Cinza", preco: 5800.00, custo: 2900.00, status: "DISPONÍVEL", vendedor: null, dataVenda: null, pagamento: null },
];

const vendedoresEquipe = ["Ana Paula", "Juliana Silva", "Fernanda Costa", "Mestre Ricardo"];
const formasPagamento = ["Dinheiro", "Pix", "Cartão de Crédito", "Cartão de Débito", "Boleto"];

function AreaLoja({ userRole }) {
  const [abaAtiva, setAbaAtiva] = useState("estoque");
  const [produtos, setProdutos] = useState(mockEstoqueLoja);
  const [categoriaFiltro, setCategoriaFiltro] = useState("TODOS");
  
  const [pagEstoque, setPagEstoque] = useState(1);
  const [pagVendas, setPagVendas] = useState(1);
  const itensPorPagina = 4;

  const [vendaEmCurso, setVendaEmCurso] = useState(null);
  const [dadosVenda, setDadosVenda] = useState({ vendedor: "", pagamento: "" });
  const [filtroDataImpressao, setFiltroDataImpressao] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, []);

  // Lógica de Filtros
  const estoqueFiltrado = produtos.filter(p => (categoriaFiltro === "TODOS" || p.categoria === categoriaFiltro) && p.status === "DISPONÍVEL");
  const totalPagEstoque = Math.max(1, Math.ceil(estoqueFiltrado.length / itensPorPagina));
  const listaEstoque = estoqueFiltrado.slice((pagEstoque - 1) * itensPorPagina, pagEstoque * itensPorPagina);

  const vendasData = produtos.filter(p => p.status === "VENDIDO" && p.dataVenda === filtroDataImpressao);
  const totalPagVendas = Math.max(1, Math.ceil(vendasData.length / itensPorPagina));
  const listaVendas = vendasData.slice((pagVendas - 1) * itensPorPagina, pagVendas * itensPorPagina);

  // KPIs Exclusivos do ADMIN
  const totalVendasValor = vendasData.reduce((acc, v) => acc + v.preco, 0);
  const lucroEstimado = vendasData.reduce((acc, v) => acc + (v.preco - v.custo), 0);

  const finalizarVenda = (id) => {
    if (!dadosVenda.vendedor || !dadosVenda.pagamento) return alert("Credenciais de venda incompletas.");
    setProdutos(produtos.map(p => 
      p.id === id ? { ...p, status: "VENDIDO", vendedor: dadosVenda.vendedor, pagamento: dadosVenda.pagamento, dataVenda: new Date().toISOString().split('T')[0] } : p
    ));
    setVendaEmCurso(null);
    setDadosVenda({ vendedor: "", pagamento: "" });
  };

  return (
    <div className="fixed inset-0 bg-[#f8f9f5] flex flex-col overflow-hidden px-4 md:px-8 py-6 animate-fade-in font-sans">
      
      <div className="flex-1 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col">

        {/* HEADER DINÂMICO BASEADO NA ROLE */}
        <div className={`p-6 text-white shrink-0 no-print transition-colors ${userRole === 'ADMIN' ? 'bg-[#1e293b]' : 'bg-[#064e3b]'}`}>
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#b49157]">
                  {userRole === 'ADMIN' ? 'Governança Unidade Loja' : 'Terminal Comercial'}
                </p>
                
                {/* SELO DE ENGENHARIA (Apenas Rickman/ADMIN vê) */}
                {userRole === "ADMIN" && (
                  <div className="hidden md:flex items-center gap-2 bg-[#b49157]/10 px-2 py-0.5 rounded-full border border-[#b49157]/20">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-[7px] font-black text-[#b49157] uppercase tracking-tighter">Engenharia Ativa: Rickman Brown</span>
                  </div>
                )}
              </div>

              <h2 className="text-2xl font-black uppercase tracking-tighter">
                {userRole === 'ADMIN' ? 'Painel de Controle' : 'Área da Loja'}
              </h2>
            </div>
            
            <div className="flex gap-4">
              <button onClick={() => setAbaAtiva("estoque")} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${abaAtiva === "estoque" ? 'bg-[#b49157]' : 'bg-white/10'}`}>Vitrine</button>
              
              {/* RESTRIÇÃO: Apenas ADMIN vê o botão de Relatórios Completos */}
              {userRole === "ADMIN" && (
                <button onClick={() => setAbaAtiva("vendas")} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${abaAtiva === "vendas" ? 'bg-[#b49157]' : 'bg-white/10'}`}>Relatórios Master</button>
              )}
            </div>
          </div>

          {/* INDICADORES FINANCEIROS (Apenas ADMIN vê os valores reais) */}
          {userRole === "ADMIN" && abaAtiva === "vendas" && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 animate-slide-up">
              <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                <p className="text-[8px] font-black uppercase text-slate-400">Receita Bruta</p>
                <p className="text-lg font-black text-[#b49157]">R$ {totalVendasValor.toLocaleString()}</p>
              </div>
              <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                <p className="text-[8px] font-black uppercase text-slate-400">Margem Estimada</p>
                <p className="text-lg font-black text-emerald-400">R$ {lucroEstimado.toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>

        {/* BARRA DE FERRAMENTAS */}
        <div className="bg-slate-50 border-b p-3 flex justify-between items-center px-6 no-print">
          {abaAtiva === "estoque" ? (
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
              {["TODOS", "Sofás", "Poltronas", "Cosméticos"].map(cat => (
                <button key={cat} onClick={() => setCategoriaFiltro(cat)} className={`px-4 py-1 rounded-full text-[9px] font-black uppercase whitespace-nowrap ${categoriaFiltro === cat ? 'bg-[#064e3b] text-white' : 'bg-white text-slate-400 border border-slate-200'}`}>{cat}</button>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <input type="date" className="bg-white border rounded-lg px-3 py-1 text-[10px] font-black text-[#064e3b]" value={filtroDataImpressao} onChange={(e) => setFiltroDataImpressao(e.target.value)} />
              
              {/* Apenas ADMIN pode imprimir relatórios financeiros */}
              {userRole === "ADMIN" && (
                <button onClick={() => window.print()} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-[9px] font-black uppercase flex items-center gap-2 hover:bg-[#b49157] transition-colors">
                  <span>🖨️</span> Master Print
                </button>
              )}
            </div>
          )}
        </div>

        {/* CONTEÚDO */}
        <div id="printable-area" className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
          <div className="max-w-4xl mx-auto space-y-4">
            
            {abaAtiva === "estoque" ? (
              listaEstoque.map(p => (
                <div key={p.id} className="bg-white p-5 rounded-2xl border border-slate-100 flex flex-col sm:flex-row justify-between items-center no-print shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-left w-full sm:w-auto mb-4 sm:mb-0">
                    {/* VISÃO SIMPLIFICADA PARA LOJA: Mostra Categoria em vez de ID Técnico */}
                    <span className="text-[8px] font-black text-[#b49157] uppercase tracking-wider">
                      {userRole === 'ADMIN' ? `REF: ${p.id}` : p.categoria}
                    </span>
                    
                    <h3 className="text-lg font-black text-[#064e3b] uppercase leading-tight mt-1">{p.modelo}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                      {userRole === 'ADMIN' ? p.acabamento : "✨ Disponível para Entrega Imediata"}
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto justify-end">
                    <div className="text-right">
                      <p className="text-xl font-black text-slate-800">R$ {p.preco.toLocaleString()}</p>
                      
                      {/* PROTEÇÃO DE DADOS: Apenas ADMIN vê o Custo */}
                      {userRole === "ADMIN" && (
                        <p className="text-[8px] font-bold text-rose-400 uppercase tracking-tighter">Custo Ind.: R$ {p.custo}</p>
                      )}
                    </div>

                    {/* BOTÃO DE AÇÃO */}
                    {vendaEmCurso === p.id ? (
                      <div className="flex flex-col gap-2 p-3 bg-slate-50 rounded-xl border border-emerald-100 animate-fade-in w-full sm:w-auto">
                        <select className="text-[9px] font-black border rounded p-1.5 bg-white text-[#064e3b]" onChange={(e) => setDadosVenda({...dadosVenda, vendedor: e.target.value})}>
                          <option value="">SELECIONE O VENDEDOR</option>
                          {vendedoresEquipe.map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                        <select className="text-[9px] font-black border rounded p-1.5 bg-white text-[#064e3b]" onChange={(e) => setDadosVenda({...dadosVenda, pagamento: e.target.value})}>
                          <option value="">FORMA DE PAGAMENTO</option>
                          {formasPagamento.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                        <div className="flex gap-2">
                          <button onClick={() => setVendaEmCurso(null)} className="flex-1 bg-slate-200 text-slate-500 text-[8px] font-black py-2 rounded-lg uppercase hover:bg-slate-300">Cancelar</button>
                          <button onClick={() => finalizarVenda(p.id)} className="flex-[2] bg-emerald-600 text-white text-[8px] font-black py-2 rounded-lg uppercase hover:bg-emerald-700 shadow-lg shadow-emerald-200">Confirmar Venda</button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => setVendaEmCurso(p.id)} className="w-full sm:w-auto bg-[#064e3b] text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#b49157] transition-all shadow-lg shadow-emerald-900/10 active:scale-95">
                        Iniciar Venda
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              // VISÃO DE VENDAS (Apenas acessível se for ADMIN, pois o botão sumiu para LOJA)
              listaVendas.map(v => (
                <div key={v.id} className="bg-white p-5 rounded-2xl border-l-4 border-l-[#b49157] flex justify-between items-center shadow-sm">
                  <div className="text-left">
                    <h3 className="text-md font-black text-[#064e3b] uppercase">{v.modelo}</h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Vendedor: <span className="text-[#b49157]">{v.vendedor}</span> | {v.pagamento}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-slate-800">R$ {v.preco.toLocaleString()}</p>
                    {userRole === "ADMIN" && <p className="text-[8px] font-black text-emerald-500 uppercase">Lucro: R$ {(v.preco - v.custo).toLocaleString()}</p>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* PAGINAÇÃO */}
        <div className="p-4 border-t bg-white flex justify-center items-center gap-8 no-print">
          <button disabled={abaAtiva === "estoque" ? pagEstoque === 1 : pagVendas === 1} onClick={() => abaAtiva === "estoque" ? setPagEstoque(p => p - 1) : setPagVendas(p => p - 1)} className="text-[10px] font-black text-slate-400 uppercase disabled:opacity-30 hover:text-[#064e3b] transition-colors">〈 Anterior</button>
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{abaAtiva === "estoque" ? pagEstoque : pagVendas}</span>
          <button disabled={abaAtiva === "estoque" ? pagEstoque === totalPagEstoque : pagVendas === totalPagVendas} onClick={() => abaAtiva === "estoque" ? setPagEstoque(p => p + 1) : setPagVendas(p => p + 1)} className="text-[10px] font-black text-slate-400 uppercase disabled:opacity-30 hover:text-[#064e3b] transition-colors">Próxima 〉</button>
        </div>
      </div>
    </div>
  );
}

export default AreaLoja;