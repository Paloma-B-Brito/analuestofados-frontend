/**
 * @file Financeiro.jsx
 * @description Gestão de Precificação, Engenharia de Custos e Portal Financeiro Administrativo
 * @author © 2026 Minister Noiret • Software Engineering
 * @requires npm install xlsx
 */

import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import "../../App.css";

const catalogoInicial = [
  { id: "MOD-CH-01", nome: "Sofá Chesterfield 3 Lug", materiais: [{ item: "Couro Legítimo", qtd: 15, vlr: 120 }, { item: "Madeira Eucalipto", qtd: 0.8, vlr: 850 }, { item: "Espuma D33 Soft", qtd: 4, vlr: 150 }, { item: "Molas e Percintas", qtd: 1, vlr: 220 }], maoDeObra: 650, custoFixoRateio: 150 },
  { id: "MOD-EAM-02", nome: "Poltrona Charles Eames", materiais: [{ item: "Couro Natural", qtd: 4, vlr: 120 }, { item: "Lâmina Pau-Ferro", qtd: 1, vlr: 750 }, { item: "Base Alumínio", qtd: 1, vlr: 420 }, { item: "Espuma Injetada", qtd: 2, vlr: 180 }], maoDeObra: 450, custoFixoRateio: 100 },
  { id: "MOD-SL-03", nome: "Sofá Retrátil Slim", materiais: [{ item: "Linho Cinza", qtd: 12, vlr: 45 }, { item: "Madeira Pinus", qtd: 0.6, vlr: 400 }, { item: "Mecanismo Aço", qtd: 2, vlr: 350 }], maoDeObra: 500, custoFixoRateio: 120 },
  { id: "MOD-PUF-04", nome: "Puff Capitonê", materiais: [{ item: "Veludo", qtd: 3, vlr: 60 }, { item: "Espuma D28", qtd: 1.5, vlr: 90 }], maoDeObra: 150, custoFixoRateio: 40 },
  { id: "MOD-DIN-05", nome: "Cadeira Jantar Lux", materiais: [{ item: "Suede", qtd: 2, vlr: 35 }, { item: "Pés Carvalho", qtd: 4, vlr: 45 }], maoDeObra: 120, custoFixoRateio: 30 }
];

function FinanceiroEditavel() {
  const [produtos, setProdutos] = useState(catalogoInicial);
  const [idAtivo, setIdAtivo] = useState(catalogoInicial[0].id);
  const [pagina, setPagina] = useState(1);
  const [portalAberto, setPortalAberto] = useState(false); 
  const itensPorPagina = 4;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, []);

  // --- LÓGICA DE DADOS ---
  const totalPaginas = Math.ceil(produtos.length / itensPorPagina);
  const produtosExibidos = produtos.slice((pagina - 1) * itensPorPagina, pagina * itensPorPagina);
  const produtoAtivo = produtos.find(p => p.id === idAtivo);

  const handleUpdateGeral = (campo, valor) => {
    const num = valor === "" ? 0 : parseFloat(valor);
    setProdutos(produtos.map(p => p.id === idAtivo ? { ...p, [campo]: num } : p));
  };

  const handleUpdateMaterial = (index, campo, valor) => {
    const num = valor === "" ? 0 : parseFloat(valor);
    setProdutos(produtos.map(p => {
      if (p.id === idAtivo) {
        const novosMateriais = [...p.materiais];
        novosMateriais[index][campo] = num;
        return { ...p, materiais: novosMateriais };
      }
      return p;
    }));
  };

  const totalMateriais = produtoAtivo.materiais.reduce((acc, m) => acc + (m.qtd * m.vlr), 0);
  const custoFinal = totalMateriais + produtoAtivo.maoDeObra + produtoAtivo.custoFixoRateio;
  const precoSugerido = custoFinal * 2.5;

  // --- LÓGICA EXCEL ---
  const gerarPlanilhaElegante = () => {
    // 1. Cabeçalho da Planilha
    const dados = [
      ["FICHA TÉCNICA DE CUSTOS - ANALU ESTOFADOS"],
      ["Gerado em:", new Date().toLocaleDateString()],
      [""], // Linha em branco
      ["MODELO:", produtoAtivo.nome],
      ["CÓDIGO:", produtoAtivo.id],
      [""],
      ["I. MATERIAIS DIRETOS"],
      ["Item", "Quantidade", "Valor Unit. (R$)", "Subtotal (R$)"]
    ];

    // 2. Inserir Materiais
    produtoAtivo.materiais.forEach(m => {
      dados.push([m.item, m.qtd, m.vlr, (m.qtd * m.vlr)]);
    });

    // 3. Resumo Financeiro
    dados.push(
      [""],
      ["Total Materiais:", "", "", totalMateriais],
      [""],
      ["II. CUSTOS OPERACIONAIS"],
      ["Mão de Obra Direta:", "", "", produtoAtivo.maoDeObra],
      ["Rateio Custos Fixos:", "", "", produtoAtivo.custoFixoRateio],
      [""],
      ["III. RESULTADO FINAL"],
      ["CUSTO TOTAL FABRICAÇÃO:", "", "", custoFinal],
      ["MARKUP SUGERIDO:", "2.5x"],
      ["PREÇO DE VENDA SUGERIDO:", "", "", precoSugerido]
    );

    // 4. Criar e Salvar o Arquivo
    const ws = XLSX.utils.aoa_to_sheet(dados);
    
    // Ajuste de largura das colunas
    ws['!cols'] = [{ wch: 30 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ficha Técnica");
    XLSX.writeFile(wb, `Ficha_Tecnica_${produtoAtivo.id}.xlsx`);
  };

  return (
    <div className="fixed inset-0 bg-[#f8f9f5] flex flex-col overflow-hidden px-4 md:px-8 py-6 animate-fade-in font-sans">
      
      {/* Container Principal Estilo Card Fixo */}
      <div className="flex-1 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col relative">
        
        {/* Header Financeiro */}
        <div className="bg-[#064e3b] p-6 text-white shrink-0 shadow-md z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-left w-full md:w-auto">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#b49157] mb-1">Engenharia de Custos</p>
              <h2 className="text-2xl font-black uppercase tracking-tighter leading-tight">Ajuste de Precificação</h2>
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              {/* Cards de Resumo Rápido */}
              <div className="flex gap-4">
                <div className="bg-white/5 p-3 rounded-xl border border-white/10 flex-1 text-center min-w-[120px]">
                  <p className="text-[8px] font-bold uppercase opacity-50">Custo de Fab.</p>
                  <p className="text-lg font-black text-white">R$ {custoFinal.toLocaleString('pt-BR')}</p>
                </div>
                <div className="bg-[#b49157]/20 p-3 rounded-xl border border-[#b49157]/30 flex-1 text-center min-w-[120px]">
                  <p className="text-[8px] font-bold uppercase text-[#b49157]">Venda Sugerida</p>
                  <p className="text-lg font-black text-[#b49157]">R$ {precoSugerido.toLocaleString('pt-BR')}</p>
                </div>
              </div>

              {/* BOTÃO DO PORTAL ADMINISTRATIVO */}
              <button 
                onClick={() => setPortalAberto(true)}
                className="bg-black/20 hover:bg-black/40 p-3 rounded-xl border border-white/10 transition-all group"
                title="Acessar Portal Administrativo Financeiro"
              >
                <span className="text-xl">🔒</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-4">
          
          {/* Seletor Lateral */}
          <div className="lg:col-span-1 border-r border-slate-100 p-6 flex flex-col overflow-hidden bg-slate-50/50">
            <div className="flex justify-between items-center mb-4 shrink-0">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Modelos</label>
              <div className="flex gap-2">
                <button disabled={pagina === 1} onClick={() => setPagina(p => p - 1)} className="text-[10px] font-black disabled:opacity-20 hover:text-[#064e3b]">〈</button>
                <button disabled={pagina === totalPaginas} onClick={() => setPagina(p => p + 1)} className="text-[10px] font-black disabled:opacity-20 hover:text-[#064e3b]">〉</button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {produtosExibidos.map(p => (
                <button 
                  key={p.id}
                  onClick={() => setIdAtivo(p.id)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all group ${idAtivo === p.id ? 'border-[#064e3b] bg-white shadow-lg' : 'border-transparent hover:bg-white hover:shadow-sm'}`}
                >
                  <p className="text-[8px] font-black text-[#b49157] group-hover:text-[#b49157] transition-colors">{p.id}</p>
                  <p className="text-[10px] font-black text-[#064e3b] uppercase truncate">{p.nome}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Editor Central */}
          <div className="lg:col-span-3 p-6 overflow-y-auto custom-scrollbar bg-slate-50/30">
            <div className="max-w-4xl mx-auto space-y-6">
              
              {/* Materiais */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
                <h3 className="text-[10px] font-black text-[#064e3b] uppercase mb-4 border-b pb-2 text-left tracking-widest flex justify-between">
                  I. Composição de Materiais
                  <span className="text-slate-400">Total: R$ {totalMateriais.toLocaleString('pt-BR')}</span>
                </h3>
                <div className="space-y-2">
                  {produtoAtivo.materiais.map((m, index) => (
                    <div key={index} className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center bg-slate-50/50 p-3 rounded-xl border border-slate-100 hover:border-[#b49157]/30 transition-colors">
                      <span className="text-[10px] font-black text-slate-700 text-left uppercase truncate">{m.item}</span>
                      <div className="flex flex-col text-left">
                        <label className="text-[7px] font-black text-slate-400 uppercase text-left">Qtd</label>
                        <input type="number" value={m.qtd || ""} onChange={(e) => handleUpdateMaterial(index, 'qtd', e.target.value)} className="text-xs font-black text-[#064e3b] outline-none bg-transparent border-b border-slate-200 focus:border-[#b49157]" />
                      </div>
                      <div className="flex flex-col text-left">
                        <label className="text-[7px] font-black text-slate-400 uppercase text-left">Preço Un.</label>
                        <input type="number" value={m.vlr || ""} onChange={(e) => handleUpdateMaterial(index, 'vlr', e.target.value)} className="text-xs font-black text-[#064e3b] outline-none bg-transparent border-b border-slate-200 focus:border-[#b49157]" />
                      </div>
                      <div className="text-right hidden md:block">
                        <p className="text-[7px] font-black text-slate-400 uppercase">Subtotal</p>
                        <p className="text-[10px] font-black text-[#064e3b]">R$ {(m.qtd * m.vlr).toLocaleString('pt-BR')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mão de Obra e Custos Fixos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                  <h3 className="text-[10px] font-black text-[#064e3b] uppercase mb-3 tracking-widest">II. Mão de Obra</h3>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-[#b49157] text-xs">R$</span>
                    <input type="number" value={produtoAtivo.maoDeObra || ""} onChange={(e) => handleUpdateGeral('maoDeObra', e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-[#064e3b] font-black text-[#064e3b] outline-none text-sm transition-all" />
                  </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                  <h3 className="text-[10px] font-black text-[#064e3b] uppercase mb-3 tracking-widest">III. Custos Fixos</h3>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-[#b49157] text-xs">R$</span>
                    <input type="number" value={produtoAtivo.custoFixoRateio || ""} onChange={(e) => handleUpdateGeral('custoFixoRateio', e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-[#064e3b] font-black text-[#064e3b] outline-none text-sm transition-all" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Ações */}
        <div className="bg-white p-4 border-t border-slate-100 flex flex-col md:flex-row justify-end items-center gap-4 shrink-0 z-10">
          <button 
            onClick={gerarPlanilhaElegante}
            className="w-full md:w-auto bg-[#064e3b] text-white px-8 py-3 rounded-xl font-black uppercase text-[9px] tracking-widest shadow-lg hover:bg-[#08634b] hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
          >
            <span>📄</span> Gravar Nova Planilha (.xlsx)
          </button>
        </div>

        {portalAberto && (
          <div className="absolute inset-0 z-50 bg-[#0f172a] animate-fade-in flex flex-col text-slate-200">
            {/* Header Portal */}
            <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-[#1e293b]">
              <div>
                <h2 className="text-xl font-black text-[#b49157] uppercase tracking-widest">Portal Administrativo</h2>
                <p className="text-[10px] uppercase tracking-widest text-slate-400">Análise Financeira Global • Acesso Restrito</p>
              </div>
              <button onClick={() => setPortalAberto(false)} className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-xs font-bold uppercase transition-colors">
                Fechar Portal ✕
              </button>
            </div>

            {/* Conteúdo Dashboard Admin */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* KPI Cards */}
                <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700">
                  <p className="text-[10px] font-bold uppercase text-slate-400 mb-2">Faturamento Mensal (Proj)</p>
                  <p className="text-3xl font-black text-emerald-400">R$ 142.590,00</p>
                  <div className="mt-4 h-1 w-full bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full w-[75%] bg-emerald-500"></div>
                  </div>
                </div>

                <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700">
                  <p className="text-[10px] font-bold uppercase text-slate-400 mb-2">Lucro Líquido Real</p>
                  <p className="text-3xl font-black text-[#b49157]">R$ 38.450,00</p>
                  <div className="mt-4 h-1 w-full bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full w-[40%] bg-[#b49157]"></div>
                  </div>
                </div>

                <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700">
                  <p className="text-[10px] font-bold uppercase text-slate-400 mb-2">Custo Operacional Total</p>
                  <p className="text-3xl font-black text-rose-400">R$ 85.120,00</p>
                  <div className="mt-4 h-1 w-full bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full w-[60%] bg-rose-500"></div>
                  </div>
                </div>

                {/* Tabela DRE Simplificada */}
                <div className="md:col-span-2 bg-[#1e293b] p-6 rounded-2xl border border-slate-700">
                  <h3 className="text-sm font-bold uppercase text-white mb-6 border-b border-slate-600 pb-2">Demonstrativo de Resultado (DRE)</h3>
                  <div className="space-y-3 font-mono text-sm">
                    <div className="flex justify-between text-slate-400">
                      <span>(+) Receita Bruta</span>
                      <span>R$ 158.000,00</span>
                    </div>
                    <div className="flex justify-between text-rose-400">
                      <span>(-) Impostos e Devoluções</span>
                      <span>(R$ 15.410,00)</span>
                    </div>
                    <div className="flex justify-between text-white font-bold border-t border-slate-600 pt-2">
                      <span>(=) Receita Líquida</span>
                      <span>R$ 142.590,00</span>
                    </div>
                    <div className="flex justify-between text-rose-400 pt-2">
                      <span>(-) Custos Variáveis (Matéria Prima)</span>
                      <span>(R$ 45.200,00)</span>
                    </div>
                    <div className="flex justify-between text-rose-400">
                      <span>(-) Custos Fixos (Mão de Obra/Aluguel)</span>
                      <span>(R$ 39.920,00)</span>
                    </div>
                    <div className="flex justify-between text-[#b49157] font-black text-lg border-t border-slate-600 pt-4 mt-2">
                      <span>(=) LUCRO LÍQUIDO</span>
                      <span>R$ 57.470,00</span>
                    </div>
                  </div>
                </div>

                {/* Gráfico Simulado */}
                <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700 flex flex-col justify-between">
                  <h3 className="text-sm font-bold uppercase text-white mb-4">Meta Anual</h3>
                  <div className="flex items-end justify-between h-40 gap-2">
                    {[40, 60, 45, 70, 85, 60].map((h, i) => (
                      <div key={i} className="w-full bg-slate-700 rounded-t-sm hover:bg-[#b49157] transition-colors relative group" style={{ height: `${h}%` }}>
                         <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] bg-black px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">{h}k</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-[8px] text-slate-500 uppercase mt-2">
                    <span>Jan</span><span>Fev</span><span>Mar</span><span>Abr</span><span>Mai</span><span>Jun</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FinanceiroEditavel;