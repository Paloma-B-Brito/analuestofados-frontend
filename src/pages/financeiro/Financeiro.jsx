/**
 * @file Financeiro.jsx
 * @description Gestão de Custos, Necessidade de Materiais e Precificação por Estofado
 * @author © 2026 Rickman Brown • Software Engineering
 * @requires npm install xlsx
 */

import { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import "../../App.css";
import {
  Calculator,
  Package,
  Boxes,
  Wallet,
  Search,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Factory,
  BadgeDollarSign,
  Scale,
} from "lucide-react";

/* ==========================================================================
   BASE DE DADOS INICIAL
   ========================================================================== */

const catalogoInicial = [
  {
    id: "MOD-CH-01",
    nome: "Sofá Chesterfield 3 Lugares",
    categoria: "Sofás",
    markup: 2.4,
    maoDeObra: 650,
    custoFixoRateio: 150,
    materiais: [
      {
        id: "MAT-001",
        item: "Couro Legítimo",
        unidade: "m²",
        consumoUnitario: 15,
        precoUnitario: 120,
        estoqueDisponivel: 72,
        loteCompra: 5,
      },
      {
        id: "MAT-002",
        item: "Madeira Eucalipto",
        unidade: "m³",
        consumoUnitario: 0.8,
        precoUnitario: 850,
        estoqueDisponivel: 6.4,
        loteCompra: 0.5,
      },
      {
        id: "MAT-003",
        item: "Espuma D33 Soft",
        unidade: "chapas",
        consumoUnitario: 4,
        precoUnitario: 150,
        estoqueDisponivel: 24,
        loteCompra: 2,
      },
      {
        id: "MAT-004",
        item: "Molas e Percintas",
        unidade: "kit",
        consumoUnitario: 1,
        precoUnitario: 220,
        estoqueDisponivel: 9,
        loteCompra: 1,
      },
    ],
  },
  {
    id: "MOD-EAM-02",
    nome: "Poltrona Charles Eames",
    categoria: "Poltronas",
    markup: 2.5,
    maoDeObra: 450,
    custoFixoRateio: 100,
    materiais: [
      {
        id: "MAT-005",
        item: "Couro Natural",
        unidade: "m²",
        consumoUnitario: 4,
        precoUnitario: 120,
        estoqueDisponivel: 19,
        loteCompra: 2,
      },
      {
        id: "MAT-006",
        item: "Lâmina Pau-Ferro",
        unidade: "un",
        consumoUnitario: 1,
        precoUnitario: 750,
        estoqueDisponivel: 6,
        loteCompra: 1,
      },
      {
        id: "MAT-007",
        item: "Base Alumínio",
        unidade: "un",
        consumoUnitario: 1,
        precoUnitario: 420,
        estoqueDisponivel: 8,
        loteCompra: 1,
      },
      {
        id: "MAT-008",
        item: "Espuma Injetada",
        unidade: "bloco",
        consumoUnitario: 2,
        precoUnitario: 180,
        estoqueDisponivel: 15,
        loteCompra: 1,
      },
    ],
  },
  {
    id: "MOD-SL-03",
    nome: "Sofá Retrátil Slim",
    categoria: "Sofás",
    markup: 2.35,
    maoDeObra: 500,
    custoFixoRateio: 120,
    materiais: [
      {
        id: "MAT-009",
        item: "Linho Cinza",
        unidade: "m",
        consumoUnitario: 12,
        precoUnitario: 45,
        estoqueDisponivel: 110,
        loteCompra: 10,
      },
      {
        id: "MAT-010",
        item: "Madeira Pinus",
        unidade: "m³",
        consumoUnitario: 0.6,
        precoUnitario: 400,
        estoqueDisponivel: 8,
        loteCompra: 0.5,
      },
      {
        id: "MAT-011",
        item: "Mecanismo Aço",
        unidade: "un",
        consumoUnitario: 2,
        precoUnitario: 350,
        estoqueDisponivel: 14,
        loteCompra: 2,
      },
    ],
  },
  {
    id: "MOD-PUF-04",
    nome: "Puff Capitonê",
    categoria: "Puffs",
    markup: 2.6,
    maoDeObra: 150,
    custoFixoRateio: 40,
    materiais: [
      {
        id: "MAT-012",
        item: "Veludo",
        unidade: "m",
        consumoUnitario: 3,
        precoUnitario: 60,
        estoqueDisponivel: 40,
        loteCompra: 5,
      },
      {
        id: "MAT-013",
        item: "Espuma D28",
        unidade: "chapas",
        consumoUnitario: 1.5,
        precoUnitario: 90,
        estoqueDisponivel: 10,
        loteCompra: 1,
      },
    ],
  },
  {
    id: "MOD-DIN-05",
    nome: "Cadeira Jantar Lux",
    categoria: "Cadeiras",
    markup: 2.3,
    maoDeObra: 120,
    custoFixoRateio: 30,
    materiais: [
      {
        id: "MAT-014",
        item: "Suede",
        unidade: "m",
        consumoUnitario: 2,
        precoUnitario: 35,
        estoqueDisponivel: 25,
        loteCompra: 5,
      },
      {
        id: "MAT-015",
        item: "Pés Carvalho",
        unidade: "un",
        consumoUnitario: 4,
        precoUnitario: 45,
        estoqueDisponivel: 40,
        loteCompra: 4,
      },
    ],
  },
];

/* ==========================================================================
   HELPERS
   ========================================================================== */

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function formatCurrency(value) {
  return toNumber(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatDecimal(value, max = 2) {
  return toNumber(value).toLocaleString("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: max,
  });
}

function roundUpToLot(value, lot) {
  const safeValue = toNumber(value);
  const safeLot = toNumber(lot);

  if (safeLot <= 0) return safeValue;
  return Math.ceil(safeValue / safeLot) * safeLot;
}

function createMaterialId() {
  return `MAT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  hint,
  valueClassName = "text-[#064e3b]",
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {label}
          </p>
          <p className={`mt-3 text-2xl font-black break-words ${valueClassName}`}>
            {value}
          </p>
          {hint ? (
            <p className="mt-2 text-[11px] font-bold text-slate-400 uppercase">
              {hint}
            </p>
          ) : null}
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[#b49157] shrink-0">
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   COMPONENTE PRINCIPAL
   ========================================================================== */

function FinanceiroEditavel() {
  const [produtos, setProdutos] = useState(catalogoInicial);
  const [idAtivo, setIdAtivo] = useState(catalogoInicial[0].id);
  const [pagina, setPagina] = useState(1);
  const [buscaModelo, setBuscaModelo] = useState("");
  const [quantidadeProduzir, setQuantidadeProduzir] = useState(1);

  const itensPorPagina = 4;

  const produtosFiltrados = useMemo(() => {
    const termo = buscaModelo.trim().toLowerCase();

    if (!termo) return produtos;

    return produtos.filter(
      (produto) =>
        produto.nome.toLowerCase().includes(termo) ||
        produto.id.toLowerCase().includes(termo) ||
        String(produto.categoria || "").toLowerCase().includes(termo)
    );
  }, [produtos, buscaModelo]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(produtosFiltrados.length / itensPorPagina)
  );

  const paginaAjustada = Math.min(pagina, totalPaginas);

  const produtosExibidos = useMemo(() => {
    const inicio = (paginaAjustada - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    return produtosFiltrados.slice(inicio, fim);
  }, [produtosFiltrados, paginaAjustada]);

  const produtoAtivo = useMemo(() => {
    const encontrado = produtos.find((produto) => produto.id === idAtivo);
    return encontrado || produtos[0];
  }, [produtos, idAtivo]);

  const quantidade = Math.max(1, Math.floor(toNumber(quantidadeProduzir) || 1));

  const materiaisCalculados = useMemo(() => {
    if (!produtoAtivo) return [];

    return produtoAtivo.materiais.map((material) => {
      const consumoUnitario = toNumber(material.consumoUnitario);
      const precoUnitario = toNumber(material.precoUnitario);
      const estoqueDisponivel = toNumber(material.estoqueDisponivel);
      const loteCompra = toNumber(material.loteCompra);

      const custoPorUnidadeProduto = consumoUnitario * precoUnitario;
      const necessidadeTotal = consumoUnitario * quantidade;
      const custoTotalLote = necessidadeTotal * precoUnitario;

      const faltante = Math.max(necessidadeTotal - estoqueDisponivel, 0);
      const sobra = Math.max(estoqueDisponivel - necessidadeTotal, 0);
      const compraSugerida = roundUpToLot(faltante, loteCompra);

      return {
        ...material,
        consumoUnitario,
        precoUnitario,
        estoqueDisponivel,
        loteCompra,
        custoPorUnidadeProduto,
        necessidadeTotal,
        custoTotalLote,
        faltante,
        sobra,
        compraSugerida,
        status:
          faltante > 0
            ? "FALTA MATERIAL"
            : sobra > 0
            ? "HÁ SOBRA"
            : "ESTOQUE EXATO",
      };
    });
  }, [produtoAtivo, quantidade]);

  const resumoFinanceiro = useMemo(() => {
    const custoMateriaisUnitario = materiaisCalculados.reduce(
      (acc, material) => acc + material.custoPorUnidadeProduto,
      0
    );

    const custoMateriaisLote = materiaisCalculados.reduce(
      (acc, material) => acc + material.custoTotalLote,
      0
    );

    const custoProducaoUnitario =
      custoMateriaisUnitario +
      toNumber(produtoAtivo?.maoDeObra) +
      toNumber(produtoAtivo?.custoFixoRateio);

    const custoProducaoLote = custoProducaoUnitario * quantidade;

    const markup = toNumber(produtoAtivo?.markup || 2.5);
    const precoVendaSugeridoUnitario = custoProducaoUnitario * markup;
    const faturamentoSugeridoLote = precoVendaSugeridoUnitario * quantidade;
    const lucroEstimadoLote = faturamentoSugeridoLote - custoProducaoLote;

    const materiaisComFalta = materiaisCalculados.filter(
      (material) => material.faltante > 0
    ).length;

    const materiaisComSobra = materiaisCalculados.filter(
      (material) => material.sobra > 0
    ).length;

    return {
      custoMateriaisUnitario,
      custoMateriaisLote,
      custoProducaoUnitario,
      custoProducaoLote,
      precoVendaSugeridoUnitario,
      faturamentoSugeridoLote,
      lucroEstimadoLote,
      materiaisComFalta,
      materiaisComSobra,
      markup,
    };
  }, [materiaisCalculados, produtoAtivo, quantidade]);

  function handleUpdateProduto(campo, valor) {
    const value =
      campo === "nome" || campo === "categoria"
        ? valor
        : valor === ""
        ? 0
        : parseFloat(valor);

    setProdutos((prev) =>
      prev.map((produto) =>
        produto.id === idAtivo ? { ...produto, [campo]: value } : produto
      )
    );
  }

  function handleUpdateMaterial(index, campo, valor) {
    const fieldsTexto = ["item", "unidade"];
    const value = fieldsTexto.includes(campo)
      ? valor
      : valor === ""
      ? 0
      : parseFloat(valor);

    setProdutos((prev) =>
      prev.map((produto) => {
        if (produto.id !== idAtivo) return produto;

        const novosMateriais = [...produto.materiais];
        novosMateriais[index] = {
          ...novosMateriais[index],
          [campo]: value,
        };

        return { ...produto, materiais: novosMateriais };
      })
    );
  }

  function adicionarMaterial() {
    setProdutos((prev) =>
      prev.map((produto) => {
        if (produto.id !== idAtivo) return produto;

        return {
          ...produto,
          materiais: [
            ...produto.materiais,
            {
              id: createMaterialId(),
              item: "Novo Material",
              unidade: "un",
              consumoUnitario: 1,
              precoUnitario: 0,
              estoqueDisponivel: 0,
              loteCompra: 1,
            },
          ],
        };
      })
    );
  }

  function removerMaterial(index) {
    setProdutos((prev) =>
      prev.map((produto) => {
        if (produto.id !== idAtivo) return produto;

        return {
          ...produto,
          materiais: produto.materiais.filter((_, i) => i !== index),
        };
      })
    );
  }

  function gerarPlanilhaElegante() {
    if (!produtoAtivo) return;

    const dados = [
      ["ANALU ESTOFADOS • FICHA DE CUSTOS E NECESSIDADE DE MATERIAIS"],
      ["Gerado em:", new Date().toLocaleString("pt-BR")],
      [""],
      ["MODELO", produtoAtivo.nome],
      ["CÓDIGO", produtoAtivo.id],
      ["CATEGORIA", produtoAtivo.categoria],
      ["QUANTIDADE SIMULADA", quantidade],
      [""],
      ["I. CUSTO POR UNIDADE"],
      ["Total de materiais por unidade", resumoFinanceiro.custoMateriaisUnitario],
      ["Mão de obra por unidade", toNumber(produtoAtivo.maoDeObra)],
      ["Custo fixo rateado por unidade", toNumber(produtoAtivo.custoFixoRateio)],
      ["CUSTO TOTAL POR UNIDADE", resumoFinanceiro.custoProducaoUnitario],
      ["MARKUP", resumoFinanceiro.markup],
      ["PREÇO SUGERIDO POR UNIDADE", resumoFinanceiro.precoVendaSugeridoUnitario],
      [""],
      ["II. CUSTO TOTAL DO LOTE"],
      ["Total de materiais do lote", resumoFinanceiro.custoMateriaisLote],
      ["CUSTO TOTAL DO LOTE", resumoFinanceiro.custoProducaoLote],
      ["FATURAMENTO SUGERIDO DO LOTE", resumoFinanceiro.faturamentoSugeridoLote],
      ["LUCRO ESTIMADO DO LOTE", resumoFinanceiro.lucroEstimadoLote],
      [""],
      ["III. NECESSIDADE DE MATERIAIS"],
      [
        "Material",
        "Unidade",
        "Consumo por 1 estofado",
        "Preço unitário",
        "Custo por 1 estofado",
        "Necessidade total",
        "Estoque disponível",
        "Faltante",
        "Compra sugerida",
        "Sobra",
        "Status",
      ],
    ];

    materiaisCalculados.forEach((material) => {
      dados.push([
        material.item,
        material.unidade,
        material.consumoUnitario,
        material.precoUnitario,
        material.custoPorUnidadeProduto,
        material.necessidadeTotal,
        material.estoqueDisponivel,
        material.faltante,
        material.compraSugerida,
        material.sobra,
        material.status,
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(dados);

    ws["!cols"] = [
      { wch: 28 },
      { wch: 12 },
      { wch: 18 },
      { wch: 16 },
      { wch: 18 },
      { wch: 16 },
      { wch: 16 },
      { wch: 14 },
      { wch: 16 },
      { wch: 14 },
      { wch: 16 },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Custos e Materiais");
    XLSX.writeFile(wb, `Custos_Materiais_${produtoAtivo.id}.xlsx`);
  }

  return (
    <div className="animate-fade-in min-h-screen bg-[#f8f9f5] p-6 space-y-6">
      {/* HEADER */}
      <div className="bg-[#064e3b] rounded-3xl border border-[#064e3b] shadow-xl overflow-hidden">
        <div className="p-6 md:p-8 text-white">
          <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#b49157] mb-2">
                Engenharia de Custos
              </p>
              <h1 className="text-3xl font-black uppercase tracking-tighter leading-tight">
                Custeio por Estofado • Materiais • Sobras
              </h1>
              <p className="text-xs font-bold uppercase tracking-widest text-white/60 mt-3">
                cálculo unitário, produção em lote, necessidade de compra e sobra de estoque
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full xl:w-auto">
              <div className="bg-white/10 border border-white/10 rounded-2xl p-4 min-w-[180px]">
                <p className="text-[9px] font-black uppercase tracking-widest text-white/50">
                  Custo unitário
                </p>
                <p className="mt-2 text-xl font-black text-white">
                  {formatCurrency(resumoFinanceiro.custoProducaoUnitario)}
                </p>
              </div>

              <div className="bg-[#b49157]/20 border border-[#b49157]/30 rounded-2xl p-4 min-w-[180px]">
                <p className="text-[9px] font-black uppercase tracking-widest text-[#e4c999]">
                  Venda sugerida
                </p>
                <p className="mt-2 text-xl font-black text-[#f0d7a8]">
                  {formatCurrency(resumoFinanceiro.precoVendaSugeridoUnitario)}
                </p>
              </div>

              <div className="bg-white/10 border border-white/10 rounded-2xl p-4 min-w-[180px]">
                <p className="text-[9px] font-black uppercase tracking-widest text-white/50">
                  Produzir agora
                </p>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={quantidade}
                  onChange={(e) => setQuantidadeProduzir(e.target.value)}
                  className="mt-2 w-full bg-transparent border-b border-white/20 focus:border-[#b49157] outline-none text-xl font-black text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPIS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <SummaryCard
          icon={Calculator}
          label="Custo total do lote"
          value={formatCurrency(resumoFinanceiro.custoProducaoLote)}
          hint={`${quantidade} unidade(s) simulada(s)`}
          valueClassName="text-[#064e3b]"
        />

        <SummaryCard
          icon={BadgeDollarSign}
          label="Faturamento sugerido"
          value={formatCurrency(resumoFinanceiro.faturamentoSugeridoLote)}
          hint="com markup aplicado"
          valueClassName="text-[#b49157]"
        />

        <SummaryCard
          icon={Factory}
          label="Materiais com falta"
          value={resumoFinanceiro.materiaisComFalta}
          hint="precisam de compra"
          valueClassName="text-rose-500"
        />

        <SummaryCard
          icon={Scale}
          label="Materiais com sobra"
          value={resumoFinanceiro.materiaisComSobra}
          hint="sobram após produção"
          valueClassName="text-emerald-600"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* SIDEBAR */}
        <div className="xl:col-span-3">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <Package size={18} className="text-[#b49157]" />
                <h3 className="text-sm font-black uppercase text-[#064e3b] tracking-widest">
                  Modelos
                </h3>
              </div>

              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={buscaModelo}
                  onChange={(e) => {
                    setBuscaModelo(e.target.value);
                    setPagina(1);
                  }}
                  placeholder="Buscar modelo..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-[#b49157]"
                />
              </div>
            </div>

            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Página {paginaAjustada} de {totalPaginas}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={paginaAjustada === 1}
                  onClick={() => setPagina((prev) => Math.max(1, prev - 1))}
                  className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-30"
                >
                  <ChevronLeft size={14} />
                </button>

                <button
                  type="button"
                  disabled={paginaAjustada === totalPaginas}
                  onClick={() =>
                    setPagina((prev) => Math.min(totalPaginas, prev + 1))
                  }
                  className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-30"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            <div className="p-5 space-y-3 max-h-[650px] overflow-y-auto custom-scrollbar">
              {produtosExibidos.map((produto) => (
                <button
                  key={produto.id}
                  type="button"
                  onClick={() => setIdAtivo(produto.id)}
                  className={`w-full text-left rounded-2xl border p-4 transition-all ${
                    idAtivo === produto.id
                      ? "border-[#064e3b] bg-[#064e3b]/5 shadow-sm"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#b49157]">
                    {produto.id}
                  </p>
                  <p className="mt-2 text-sm font-black text-[#064e3b] uppercase break-words">
                    {produto.nome}
                  </p>
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    {produto.categoria}
                  </p>
                </button>
              ))}

              {produtosExibidos.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                  <Package size={24} className="mx-auto mb-3 text-slate-300" />
                  <p className="text-xs font-black uppercase text-slate-400">
                    Nenhum modelo encontrado
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CONTEÚDO */}
        <div className="xl:col-span-9 space-y-6">
          {/* DADOS DO PRODUTO */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Boxes size={18} className="text-[#b49157]" />
                <h3 className="text-sm font-black uppercase text-[#064e3b] tracking-widest">
                  Configuração do Produto
                </h3>
              </div>
            </div>

            <div className="p-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
              <div className="xl:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                  Nome do estofado
                </label>
                <input
                  type="text"
                  value={produtoAtivo.nome}
                  onChange={(e) => handleUpdateProduto("nome", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-black text-[#064e3b] outline-none focus:border-[#b49157]"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                  Categoria
                </label>
                <input
                  type="text"
                  value={produtoAtivo.categoria}
                  onChange={(e) => handleUpdateProduto("categoria", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-black text-[#064e3b] outline-none focus:border-[#b49157]"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                  Mão de obra / un
                </label>
                <input
                  type="number"
                  value={produtoAtivo.maoDeObra}
                  onChange={(e) => handleUpdateProduto("maoDeObra", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-black text-[#064e3b] outline-none focus:border-[#b49157]"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                  Custo fixo / un
                </label>
                <input
                  type="number"
                  value={produtoAtivo.custoFixoRateio}
                  onChange={(e) =>
                    handleUpdateProduto("custoFixoRateio", e.target.value)
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-black text-[#064e3b] outline-none focus:border-[#b49157]"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                  Markup
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={produtoAtivo.markup}
                  onChange={(e) => handleUpdateProduto("markup", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-black text-[#064e3b] outline-none focus:border-[#b49157]"
                />
              </div>
            </div>
          </div>

          {/* MATERIAIS */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Package size={18} className="text-[#b49157]" />
                <h3 className="text-sm font-black uppercase text-[#064e3b] tracking-widest">
                  Materiais do Estofado
                </h3>
              </div>

              <button
                type="button"
                onClick={adicionarMaterial}
                className="px-4 py-2 rounded-xl bg-[#064e3b] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#08634b] flex items-center gap-2"
              >
                <Plus size={14} />
                Adicionar material
              </button>
            </div>

            <div className="p-5 space-y-3">
              {produtoAtivo.materiais.map((material, index) => (
                <div
                  key={material.id || index}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-7 gap-4">
                    <div className="xl:col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                        Material
                      </label>
                      <input
                        type="text"
                        value={material.item}
                        onChange={(e) =>
                          handleUpdateMaterial(index, "item", e.target.value)
                        }
                        className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm font-black text-[#064e3b] outline-none focus:border-[#b49157]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                        Unidade
                      </label>
                      <input
                        type="text"
                        value={material.unidade}
                        onChange={(e) =>
                          handleUpdateMaterial(index, "unidade", e.target.value)
                        }
                        className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm font-black text-[#064e3b] outline-none focus:border-[#b49157]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                        Consumo / un
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={material.consumoUnitario}
                        onChange={(e) =>
                          handleUpdateMaterial(
                            index,
                            "consumoUnitario",
                            e.target.value
                          )
                        }
                        className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm font-black text-[#064e3b] outline-none focus:border-[#b49157]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                        Preço unitário
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={material.precoUnitario}
                        onChange={(e) =>
                          handleUpdateMaterial(index, "precoUnitario", e.target.value)
                        }
                        className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm font-black text-[#064e3b] outline-none focus:border-[#b49157]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                        Estoque
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={material.estoqueDisponivel}
                        onChange={(e) =>
                          handleUpdateMaterial(
                            index,
                            "estoqueDisponivel",
                            e.target.value
                          )
                        }
                        className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm font-black text-[#064e3b] outline-none focus:border-[#b49157]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                        Lote compra
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          step="0.01"
                          value={material.loteCompra}
                          onChange={(e) =>
                            handleUpdateMaterial(index, "loteCompra", e.target.value)
                          }
                          className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm font-black text-[#064e3b] outline-none focus:border-[#b49157]"
                        />

                        <button
                          type="button"
                          onClick={() => removerMaterial(index)}
                          className="px-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-500 hover:bg-rose-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="rounded-2xl bg-white border border-slate-200 px-4 py-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Custo em 1 estofado
                      </p>
                      <p className="mt-2 text-sm font-black text-[#064e3b]">
                        {formatCurrency(
                          toNumber(material.consumoUnitario) *
                            toNumber(material.precoUnitario)
                        )}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white border border-slate-200 px-4 py-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Necessário no lote
                      </p>
                      <p className="mt-2 text-sm font-black text-[#064e3b]">
                        {formatDecimal(
                          toNumber(material.consumoUnitario) * quantidade
                        )}{" "}
                        {material.unidade}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white border border-slate-200 px-4 py-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Custo no lote
                      </p>
                      <p className="mt-2 text-sm font-black text-[#064e3b]">
                        {formatCurrency(
                          toNumber(material.consumoUnitario) *
                            quantidade *
                            toNumber(material.precoUnitario)
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {produtoAtivo.materiais.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                  <p className="text-xs font-black uppercase text-slate-400">
                    Nenhum material cadastrado
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* NECESSIDADE TOTAL / SOBRAS */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Factory size={18} className="text-[#b49157]" />
                <h3 className="text-sm font-black uppercase text-[#064e3b] tracking-widest">
                  Necessidade Total • Faltas • Sobras
                </h3>
              </div>
            </div>

            <div className="p-5 overflow-x-auto">
              <table className="w-full min-w-[1100px] text-left">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-3 pr-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Material
                    </th>
                    <th className="py-3 pr-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Unid.
                    </th>
                    <th className="py-3 pr-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Consumo / un
                    </th>
                    <th className="py-3 pr-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Necessidade total
                    </th>
                    <th className="py-3 pr-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Estoque
                    </th>
                    <th className="py-3 pr-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Faltante
                    </th>
                    <th className="py-3 pr-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Compra sugerida
                    </th>
                    <th className="py-3 pr-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Sobra
                    </th>
                    <th className="py-3 pr-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {materiaisCalculados.map((material) => (
                    <tr
                      key={material.id}
                      className="border-b border-slate-100 last:border-b-0"
                    >
                      <td className="py-4 pr-4 text-sm font-black text-[#064e3b]">
                        {material.item}
                      </td>
                      <td className="py-4 pr-4 text-sm font-bold text-slate-500 uppercase">
                        {material.unidade}
                      </td>
                      <td className="py-4 pr-4 text-sm font-bold text-slate-700">
                        {formatDecimal(material.consumoUnitario)}
                      </td>
                      <td className="py-4 pr-4 text-sm font-bold text-slate-700">
                        {formatDecimal(material.necessidadeTotal)}
                      </td>
                      <td className="py-4 pr-4 text-sm font-bold text-slate-700">
                        {formatDecimal(material.estoqueDisponivel)}
                      </td>
                      <td className="py-4 pr-4 text-sm font-black text-rose-500">
                        {formatDecimal(material.faltante)}
                      </td>
                      <td className="py-4 pr-4 text-sm font-black text-[#b49157]">
                        {formatDecimal(material.compraSugerida)}
                      </td>
                      <td className="py-4 pr-4 text-sm font-black text-emerald-600">
                        {formatDecimal(material.sobra)}
                      </td>
                      <td className="py-4 pr-4">
                        {material.faltante > 0 ? (
                          <span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-black uppercase tracking-widest">
                            <AlertTriangle size={12} />
                            Falta material
                          </span>
                        ) : material.sobra > 0 ? (
                          <span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-black uppercase tracking-widest">
                            <CheckCircle2 size={12} />
                            Há sobra
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest">
                            Estoque exato
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* RESUMO DE CUSTOS */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Wallet size={18} className="text-[#b49157]" />
                  <h3 className="text-sm font-black uppercase text-[#064e3b] tracking-widest">
                    Custo por Unidade
                  </h3>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-slate-500">
                    Materiais
                  </span>
                  <span className="text-lg font-black text-[#064e3b]">
                    {formatCurrency(resumoFinanceiro.custoMateriaisUnitario)}
                  </span>
                </div>

                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-slate-500">
                    Mão de obra
                  </span>
                  <span className="text-lg font-black text-[#064e3b]">
                    {formatCurrency(produtoAtivo.maoDeObra)}
                  </span>
                </div>

                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-slate-500">
                    Custo fixo rateado
                  </span>
                  <span className="text-lg font-black text-[#064e3b]">
                    {formatCurrency(produtoAtivo.custoFixoRateio)}
                  </span>
                </div>

                <div className="rounded-2xl bg-[#064e3b] text-white border border-[#064e3b] p-4 flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-white/70">
                    Custo total por unidade
                  </span>
                  <span className="text-xl font-black">
                    {formatCurrency(resumoFinanceiro.custoProducaoUnitario)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <BadgeDollarSign size={18} className="text-[#b49157]" />
                  <h3 className="text-sm font-black uppercase text-[#064e3b] tracking-widest">
                    Resultado do Lote
                  </h3>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-slate-500">
                    Custo total do lote
                  </span>
                  <span className="text-lg font-black text-[#064e3b]">
                    {formatCurrency(resumoFinanceiro.custoProducaoLote)}
                  </span>
                </div>

                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-slate-500">
                    Venda sugerida / un
                  </span>
                  <span className="text-lg font-black text-[#b49157]">
                    {formatCurrency(resumoFinanceiro.precoVendaSugeridoUnitario)}
                  </span>
                </div>

                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-slate-500">
                    Faturamento sugerido do lote
                  </span>
                  <span className="text-lg font-black text-[#b49157]">
                    {formatCurrency(resumoFinanceiro.faturamentoSugeridoLote)}
                  </span>
                </div>

                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-emerald-700">
                    Lucro estimado do lote
                  </span>
                  <span className="text-xl font-black text-emerald-700">
                    {formatCurrency(resumoFinanceiro.lucroEstimadoLote)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* AÇÕES */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Exportação
              </p>
              <p className="mt-1 text-sm font-bold text-slate-500">
                Gere uma planilha com custos, necessidade de compra e sobras.
              </p>
            </div>

            <button
              type="button"
              onClick={gerarPlanilhaElegante}
              className="w-full md:w-auto bg-[#064e3b] text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg hover:bg-[#08634b] transition-colors flex items-center justify-center gap-2"
            >
              <FileSpreadsheet size={16} />
              Exportar planilha .xlsx
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FinanceiroEditavel;