/**
 * @file Relatorios.jsx
 * @description Relatórios Gerenciais de Vendas 
 * @author © 2026 Minister Noiret • Software Architecture
 */

import React, { useState, useMemo } from 'react';
import * as XLSX from 'xlsx'; 
import { 
  Download, Printer, Search, Filter, Calendar, 
  ChevronLeft, ChevronRight, ArrowUp, ArrowDown, 
  TrendingUp, DollarSign, Users, ShoppingBag 
} from 'lucide-react';

const gerarDados = () => {
  const dados = [];
  const statusList = ['CONCLUÍDO', 'PENDENTE', 'CANCELADO', 'EM_ROTA'];
  const vendedores = ['Ana Silva', 'Carlos Eduardo', 'Roberto Campos', 'Mariana X.'];
  const produtos = ['Sofá Chesterfield', 'Poltrona Eames', 'Mesa de Jantar', 'Cadeira Office'];

  for (let i = 1; i <= 64; i++) {
    dados.push({
      id: `#PED-${1000 + i}`,
      data: `2026-02-${Math.floor(Math.random() * 28) + 1}`.replace(/-(\d)$/, '-0$1'),
      cliente: `Cliente ${String.fromCharCode(65 + Math.floor(Math.random() * 26))} - Empresa`,
      vendedor: vendedores[Math.floor(Math.random() * vendedores.length)],
      produto: produtos[Math.floor(Math.random() * produtos.length)],
      qtd: Math.floor(Math.random() * 5) + 1,
      valor: Math.floor(Math.random() * 5000) + 1200,
      status: statusList[Math.floor(Math.random() * statusList.length)]
    });
  }
  return dados;
};

const DADOS_VENDAS = gerarDados();

function Relatorios() {
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("TODOS");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina] = useState(10);
  const [ordenacao, setOrdenacao] = useState({ campo: 'data', direcao: 'desc' });
  const [loadingExport, setLoadingExport] = useState(false);
  const dadosFiltrados = useMemo(() => {
    let lista = DADOS_VENDAS.filter(item => {
      const matchTexto = 
        item.cliente.toLowerCase().includes(busca.toLowerCase()) ||
        item.vendedor.toLowerCase().includes(busca.toLowerCase()) ||
        item.id.toLowerCase().includes(busca.toLowerCase());
      const matchStatus = filtroStatus === "TODOS" ? true : item.status === filtroStatus;
      return matchTexto && matchStatus;
    });

    lista.sort((a, b) => {
      if (a[ordenacao.campo] < b[ordenacao.campo]) return ordenacao.direcao === 'asc' ? -1 : 1;
      if (a[ordenacao.campo] > b[ordenacao.campo]) return ordenacao.direcao === 'asc' ? 1 : -1;
      return 0;
    });

    return lista;
  }, [busca, filtroStatus, ordenacao]);


  const indexUltimo = paginaAtual * itensPorPagina;
  const indexPrimeiro = indexUltimo - itensPorPagina;
  const dadosAtuais = dadosFiltrados.slice(indexPrimeiro, indexUltimo);
  const totalPaginas = Math.ceil(dadosFiltrados.length / itensPorPagina);

  const totalFaturado = dadosFiltrados.reduce((acc, item) => acc + item.valor, 0);
  const ticketMedio = totalFaturado / (dadosFiltrados.length || 1);

  const exportarExcel = () => {
    setLoadingExport(true);
    setTimeout(() => {
      const ws = XLSX.utils.json_to_sheet(dadosFiltrados);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Relatorio_Vendas");
      XLSX.writeFile(wb, "Analu_Relatorio.xlsx");
      setLoadingExport(false);
    }, 1000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSort = (campo) => {
    const isAsc = ordenacao.campo === campo && ordenacao.direcao === 'asc';
    setOrdenacao({ campo, direcao: isAsc ? 'desc' : 'asc' });
  };

  return (
    <div className="animate-fade-in font-sans pb-20 print:pb-0 print:bg-white print:m-0 print:p-0 print:text-black">
      <style>{`
        @media print {
          @page { margin: 15mm; size: A4 portrait; }
          
          /* Esconde TUDO que não for o container principal (.print-area) */
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }

          /* Oculta os controles dentro da área de impressão */
          .no-print { display: none !important; }
          
          /* Estilo específico para a tabela impressa (Puro CSS) */
          table.relatorio-oficial {
            width: 100%;
            border-collapse: collapse;
            font-size: 10px;
            font-family: Arial, Helvetica, sans-serif;
            margin-top: 15px;
          }
          table.relatorio-oficial th {
            background-color: #f1f5f9 !important; /* Cinza claro */
            -webkit-print-color-adjust: exact;
            color: #334155;
            font-weight: bold;
            text-transform: uppercase;
            border: 1px solid #cbd5e1;
            padding: 8px;
            text-align: left;
          }
          table.relatorio-oficial td {
            border: 1px solid #e2e8f0;
            padding: 8px;
            color: #1e293b;
          }
          table.relatorio-oficial tr:nth-child(even) {
             background-color: #f8fafc !important; /* Efeito zebrado */
             -webkit-print-color-adjust: exact;
          }
          .quebra-pagina { break-inside: avoid; }
        }
      `}</style>

      <div className="print-area">
        <div className="hidden print:block border-b-2 border-slate-800 pb-4 mb-6 pt-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#064e3b] rounded-lg flex items-center justify-center text-white font-black text-2xl shadow-sm">
                A
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter leading-none">ANALU</h1>
                <p className="text-[9px] font-bold text-[#b49157] uppercase tracking-[0.3em] mt-1">Indústria de Estofados</p>
              </div>
            </div>
            <div className="text-right text-[10px] text-slate-600 space-y-1">
              <p className="font-black text-xs text-slate-800 tracking-widest uppercase">Relatório de Vendas</p>
              <p>CNPJ: 00.000.000/0001-00</p>
              <p>Emitido em: {new Date().toLocaleDateString()} às {new Date().toLocaleTimeString()}</p>
              <p className="font-bold text-[#064e3b] mt-1">Responsável: Analu</p>
            </div>
          </div>
          <div className="mt-4 bg-slate-50 border border-slate-200 p-2 rounded text-[10px] text-slate-600">
             <strong>Parâmetros do Relatório:</strong> Status: {filtroStatus} | Busca: {busca || 'Nenhuma'} | Total de Itens: {dadosFiltrados.length}
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 no-print">
          <div>
            <h1 className="text-3xl font-black text-[#064e3b] uppercase tracking-tighter">
              Relatórios <span className="text-[#b49157] font-light italic">& Analytics</span>
            </h1>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">
              Análise de Desempenho Comercial • Fev/2026
            </p>
          </div>
          
          <div className="flex gap-2">
            <button onClick={handlePrint} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-xs font-black uppercase hover:bg-slate-50 transition-all shadow-sm">
              <Printer size={16} /> Imprimir Relatório
            </button>
            <button onClick={exportarExcel} disabled={loadingExport} className="flex items-center gap-2 bg-[#064e3b] text-white px-6 py-2 rounded-lg text-xs font-black uppercase hover:bg-[#08634b] transition-all shadow-lg hover:shadow-emerald-900/20 disabled:opacity-50">
              {loadingExport ? 'Gerando...' : <><Download size={16} /> Exportar Excel</>}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 print:grid-cols-4 print:gap-2 print:mb-6">
          <div className="bg-white p-6 print:p-3 rounded-2xl border border-slate-100 shadow-sm print:shadow-none print:border print:border-slate-300 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest print:text-slate-600">Faturamento</p>
              <p className="text-2xl print:text-base font-black text-[#064e3b] print:text-black">R$ {totalFaturado.toLocaleString('pt-BR')}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 no-print"><DollarSign size={20} /></div>
          </div>
          <div className="bg-white p-6 print:p-3 rounded-2xl border border-slate-100 shadow-sm print:shadow-none print:border print:border-slate-300 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest print:text-slate-600">Pedidos</p>
              <p className="text-2xl print:text-base font-black text-blue-600 print:text-black">{dadosFiltrados.length}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 no-print"><ShoppingBag size={20} /></div>
          </div>
          <div className="bg-white p-6 print:p-3 rounded-2xl border border-slate-100 shadow-sm print:shadow-none print:border print:border-slate-300 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest print:text-slate-600">Ticket Médio</p>
              <p className="text-2xl print:text-base font-black text-[#b49157] print:text-black">R$ {ticketMedio.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-[#b49157] no-print"><TrendingUp size={20} /></div>
          </div>
          <div className="bg-white p-6 print:p-3 rounded-2xl border border-slate-100 shadow-sm print:shadow-none print:border print:border-slate-300 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest print:text-slate-600">Conversão</p>
              <p className="text-2xl print:text-base font-black text-rose-500 print:text-black">18.4%</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 no-print"><Users size={20} /></div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between no-print">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <input 
                type="text" 
                placeholder="Buscar..." 
                value={busca}
                onChange={(e) => { setBusca(e.target.value); setPaginaAtual(1); }}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:border-[#b49157] transition-colors"
              />
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            </div>
            <div className="relative">
              <select 
                value={filtroStatus}
                onChange={(e) => { setFiltroStatus(e.target.value); setPaginaAtual(1); }}
                className="pl-10 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold uppercase text-slate-600 focus:outline-none appearance-none cursor-pointer hover:bg-slate-100"
              >
                <option value="TODOS">Todos Status</option>
                <option value="CONCLUÍDO">Concluídos</option>
                <option value="PENDENTE">Pendentes</option>
                <option value="CANCELADO">Cancelados</option>
                <option value="EM_ROTA">Em Rota</option>
              </select>
              <Filter className="absolute left-3 top-2.5 text-slate-400" size={16} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden no-print">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#064e3b] text-white text-[10px] uppercase font-black tracking-wider">
                <th className="px-6 py-4 cursor-pointer hover:bg-[#08634b]" onClick={() => handleSort('id')}>
                  <div className="flex items-center gap-1">ID {ordenacao.campo === 'id' && (ordenacao.direcao === 'asc' ? <ArrowUp size={10} /> : <ArrowDown size={10} />)}</div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:bg-[#08634b]" onClick={() => handleSort('data')}>
                  <div className="flex items-center gap-1">Data {ordenacao.campo === 'data' && (ordenacao.direcao === 'asc' ? <ArrowUp size={10} /> : <ArrowDown size={10} />)}</div>
                </th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Produto</th>
                <th className="px-6 py-4">Vendedor</th>
                <th className="px-6 py-4 cursor-pointer hover:bg-[#08634b] text-right" onClick={() => handleSort('valor')}>
                   <div className="flex items-center gap-1 justify-end">Valor {ordenacao.campo === 'valor' && (ordenacao.direcao === 'asc' ? <ArrowUp size={10} /> : <ArrowDown size={10} />)}</div>
                </th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dadosAtuais.map((item, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors text-xs font-medium text-slate-600">
                  <td className="px-6 py-4 font-bold text-[#b49157] font-mono">{item.id}</td>
                  <td className="px-6 py-4">{new Date(item.data).toLocaleDateString('pt-BR')}</td>
                  <td className="px-6 py-4 font-bold text-slate-700">{item.cliente}</td>
                  <td className="px-6 py-4">{item.produto} <span className="text-slate-400">({item.qtd})</span></td>
                  <td className="px-6 py-4">{item.vendedor}</td>
                  <td className="px-6 py-4 font-black text-slate-800 text-right">R$ {item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase ${
                      item.status === 'CONCLUÍDO' ? 'bg-emerald-100 text-emerald-700' : 
                      item.status === 'CANCELADO' ? 'bg-rose-100 text-rose-700' : 
                      item.status === 'EM_ROTA' ? 'bg-blue-100 text-blue-700' : 
                      'bg-slate-100 text-slate-700'
                    }`}>{item.status.replace("_", " ")}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="bg-slate-50 border-t border-slate-200 p-4 flex justify-between items-center">
            <p className="text-[10px] font-bold text-slate-500 uppercase">Mostrando {indexPrimeiro + 1} a {Math.min(indexUltimo, dadosFiltrados.length)} de {dadosFiltrados.length}</p>
            <div className="flex gap-2">
              <button onClick={() => setPaginaAtual(prev => Math.max(prev - 1, 1))} disabled={paginaAtual === 1} className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-50"><ChevronLeft size={16} /></button>
              <button onClick={() => setPaginaAtual(prev => Math.min(prev + 1, totalPaginas))} disabled={paginaAtual === totalPaginas} className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-50"><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>
        <div className="hidden print:block">
          <table className="relatorio-oficial">
            <thead>
              <tr>
                <th>ID Pedido</th>
                <th>Data Emissão</th>
                <th>Cliente / Razão Social</th>
                <th>Item / Produto</th>
                <th>Resp. Vendas</th>
                <th style={{textAlign: 'right'}}>Valor Bruto (R$)</th>
                <th style={{textAlign: 'center'}}>Situação</th>
              </tr>
            </thead>
            <tbody>
              {dadosFiltrados.map((item, index) => (
                <tr key={index} className="quebra-pagina">
                  <td style={{fontFamily: 'monospace', fontWeight: 'bold'}}>{item.id}</td>
                  <td>{new Date(item.data).toLocaleDateString('pt-BR')}</td>
                  <td>{item.cliente}</td>
                  <td>{item.produto} (Qtd: {item.qtd})</td>
                  <td>{item.vendedor}</td>
                  <td style={{textAlign: 'right', fontWeight: 'bold'}}>{item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td style={{textAlign: 'center'}}>{item.status.replace("_", " ")}</td>
                </tr>
              ))}
              {dadosFiltrados.length === 0 && (
                <tr>
                   <td colSpan="7" style={{textAlign: 'center', padding: '20px'}}>Nenhum registro encontrado para os filtros aplicados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="hidden print:block mt-16 pt-10 border-t border-slate-300 break-inside-avoid">
          <div className="grid grid-cols-2 gap-16">
            <div className="text-center">
              <div className="border-t-2 border-slate-800 w-3/4 mx-auto mb-2"></div>
              <p className="font-black text-xs uppercase tracking-widest text-slate-800">Analu</p>
              <p className="text-[10px] text-slate-500 uppercase mt-1">Diretoria Executiva</p>
            </div>
            <div className="text-center">
              <div className="border-t-2 border-slate-800 w-3/4 mx-auto mb-2"></div>
              <p className="font-black text-xs uppercase tracking-widest text-slate-800">Gerência Comercial</p>
              <p className="text-[10px] text-slate-500 uppercase mt-1">Visto e Conferência</p>
            </div>
          </div>
          <p className="text-center text-[8px] text-slate-400 mt-16 font-mono uppercase">
            Analu Enterprise ERP • Relatório Confidencial • Hash: 8XF2-P9K1-M4W7
          </p>
        </div>

      </div> 
    </div>
  );
}

export default Relatorios;