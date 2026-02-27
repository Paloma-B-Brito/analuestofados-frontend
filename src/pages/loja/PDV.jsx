/**
 * @file PDV.jsx
 * @description Módulo de Ponto de Venda (PDV)
 * @author © 2026 Rickman Brown • Software Engineering
 */

import React, { useEffect, useMemo, useState } from "react";
import ModalPDV from "../../components/modals/ModalPDV";
import { createPortal } from "react-dom";
import "../../App.css";
import {
  Store,
  ShoppingCart,
  Receipt,
  Wallet,
  Users,
  Boxes,
  Clock3,
  Search,
  Plus,
  Crown,
  ShieldCheck,
  TrendingUp,
  BadgeDollarSign,
  CheckCircle2,
  AlertTriangle,
  Package2,
  UserRound,
  BellRing,
  ClipboardList,
  ArrowUpRight,
  X,
  CalendarDays,
  Phone,
  MessageSquare,
  Filter,
  Target,
} from "lucide-react";

/* ==========================================================================
   HELPERS
   ========================================================================== */

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatDateTime(value) {
  if (!value) return "--";
  const date = new Date(value);

  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatShortDate(value) {
  if (!value) return "--";
  const date = new Date(value);

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getRoleConfig(role) {
  const normalizedRole = String(role || "").toUpperCase();
  const isLoja = normalizedRole === "LOJA";
  const isAdmin = normalizedRole !== "LOJA";

  return {
    normalizedRole,
    isLoja,
    isAdmin,
    permissions: {
      canOpenSale: true,
      canSeeFullFinancials: isAdmin,
      canSeeMyPerformance: isLoja,
      canSeeTeamPerformance: isAdmin,
      canSeeRecentSales: true,
      canSeeAvailableStock: true,
      canSeeCustomerInterests: true,
      canManageCashDesk: isAdmin,
      canGiveStrategicDiscount: isAdmin,
      canSearchCustomer: true,
      canOpenSalesHistory: true,
    },
  };
}

function getSaleStatusClasses(status) {
  const normalized = String(status || "").toLowerCase();

  if (normalized.includes("finalizada")) {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }

  if (normalized.includes("pendente")) {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }

  if (normalized.includes("cancelada")) {
    return "bg-rose-50 text-rose-700 border-rose-200";
  }

  return "bg-slate-50 text-slate-700 border-slate-200";
}

function getInterestPriorityClasses(prioridade) {
  const normalized = String(prioridade || "").toLowerCase();

  if (normalized.includes("urgente")) {
    return "bg-rose-50 text-rose-700 border-rose-200";
  }

  if (normalized.includes("alta")) {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }

  if (normalized.includes("média") || normalized.includes("media")) {
    return "bg-blue-50 text-blue-700 border-blue-200";
  }

  return "bg-slate-50 text-slate-700 border-slate-200";
}

/* ==========================================================================
   COMPONENTES PEQUENOS
   ========================================================================== */

function MetricCard({
  icon: Icon,
  label,
  value,
  hint,
  valueClassName = "text-[#064e3b]",
  highlighted = false,
}) {
  return (
    <div
      className={`bg-white rounded-2xl border p-5 shadow-sm ${
        highlighted ? "border-[#b49157]/40" : "border-slate-200"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {label}
          </p>
          <p className={`mt-3 text-3xl font-black break-words ${valueClassName}`}>
            {value}
          </p>
          {hint ? (
            <p className="mt-2 text-xs font-bold uppercase text-slate-400">
              {hint}
            </p>
          ) : null}
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[#b49157] shrink-0">
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

function SectionCard({ title, icon: Icon, extra, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 min-w-0">
          <Icon size={18} className="text-[#b49157] shrink-0" />
          <h3 className="font-black text-[#064e3b] uppercase text-sm tracking-wide break-words">
            {title}
          </h3>
        </div>

        {extra ? <div className="shrink-0">{extra}</div> : null}
      </div>

      <div className="p-6">{children}</div>
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={`px-2 py-1 rounded-lg border text-[10px] font-black uppercase tracking-wide ${getSaleStatusClasses(
        status
      )}`}
    >
      {status}
    </span>
  );
}

function InterestPriorityBadge({ prioridade }) {
  return (
    <span
      className={`px-2 py-1 rounded-lg border text-[10px] font-black uppercase tracking-wide ${getInterestPriorityClasses(
        prioridade
      )}`}
    >
      {prioridade}
    </span>
  );
}

function ActionButton({
  icon: Icon,
  title,
  subtitle,
  onClick,
  accent = false,
  disabled = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-2xl border p-4 text-left transition-all ${
        disabled
          ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
          : accent
          ? "bg-[#064e3b] border-[#064e3b] text-white hover:bg-[#08634b]"
          : "bg-white border-slate-200 hover:bg-slate-50"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Icon
              size={18}
              className={
                disabled
                  ? "text-slate-400"
                  : accent
                  ? "text-white"
                  : "text-[#b49157]"
              }
            />
            <p
              className={`text-xs font-black uppercase tracking-widest ${
                disabled
                  ? "text-slate-400"
                  : accent
                  ? "text-white"
                  : "text-[#064e3b]"
              }`}
            >
              {title}
            </p>
          </div>

          <p
            className={`mt-2 text-[11px] font-bold ${
              disabled
                ? "text-slate-400"
                : accent
                ? "text-white/80"
                : "text-slate-500"
            }`}
          >
            {subtitle}
          </p>
        </div>

        <ArrowUpRight
          size={16}
          className={disabled ? "text-slate-400" : accent ? "text-white" : "text-[#b49157]"}
        />
      </div>
    </button>
  );
}

/* ==========================================================================
   PAINEL LATERAL GENÉRICO
   ========================================================================== */

function SidePanel({ open, title, icon: Icon, subtitle, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120]">
      <div
        className="absolute inset-0 bg-black/35 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-slide-up">
        <div className="px-6 py-5 border-b border-slate-100 bg-[#064e3b] text-white flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Icon size={18} className="text-[#b49157]" />
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#b49157]">
                PDV Workspace
              </p>
            </div>

            <h3 className="mt-2 text-2xl font-black uppercase tracking-tight">
              {title}
            </h3>

            {subtitle ? (
              <p className="mt-2 text-xs font-bold uppercase tracking-widest text-white/70">
                {subtitle}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors mt-1"
          >
            <X size={26} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#f8f9f5] p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   COMPONENTE PRINCIPAL
   ========================================================================== */

function PDV({ role = "LOJA", usuarioLogado = { nome: "Usuária" } }) {
  const roleConfig = useMemo(() => getRoleConfig(role), [role]);
  const { isAdmin, isLoja, permissions } = roleConfig;

  const [modalPDVAberto, setModalPDVAberto] = useState(false);
  const [painelAberto, setPainelAberto] = useState(null); // "buscar-cliente" | "historico-vendas" | null
  const [carregando, setCarregando] = useState(true);

  const [estoqueDisponivel, setEstoqueDisponivel] = useState([]);
  const [clientesCadastrados, setClientesCadastrados] = useState([]);
  const [resumoPDV, setResumoPDV] = useState({
    vendasHoje: 0,
    totalHoje: 0,
    ticketMedio: 0,
    clientesAtendidos: 0,
    itensDisponiveis: 0,
    pendencias: 0,
    minhaMetaDia: 0,
    meuRealizadoDia: 0,
    metaLojaDia: 0,
    realizadoLojaDia: 0,
    caixaAtual: 0,
  });

  const [vendasRecentes, setVendasRecentes] = useState([]);
  const [clientesInteresses, setClientesInteresses] = useState([]);

  const [buscaCliente, setBuscaCliente] = useState("");
  const [buscaHistorico, setBuscaHistorico] = useState("");
  const [filtroHistoricoStatus, setFiltroHistoricoStatus] = useState("TODOS");

  const nomeUsuario =
    usuarioLogado?.nome || (isLoja ? "Vendedora" : "Administradora");

  const progressoMetaMinha = resumoPDV.minhaMetaDia
    ? Math.min((resumoPDV.meuRealizadoDia / resumoPDV.minhaMetaDia) * 100, 100)
    : 0;

  const progressoMetaLoja = resumoPDV.metaLojaDia
    ? Math.min((resumoPDV.realizadoLojaDia / resumoPDV.metaLojaDia) * 100, 100)
    : 0;

  const clientesFiltrados = useMemo(() => {
    const termo = buscaCliente.trim().toLowerCase();

    if (!termo) return clientesCadastrados;

    return clientesCadastrados.filter((cliente) => {
      return (
        String(cliente.nome || "").toLowerCase().includes(termo) ||
        String(cliente.telefone || "").toLowerCase().includes(termo) ||
        String(cliente.cpf || "").toLowerCase().includes(termo) ||
        String(cliente.ultimoInteresse || "").toLowerCase().includes(termo)
      );
    });
  }, [clientesCadastrados, buscaCliente]);

  const historicoFiltrado = useMemo(() => {
    const termo = buscaHistorico.trim().toLowerCase();

    return vendasRecentes.filter((venda) => {
      const statusOk =
        filtroHistoricoStatus === "TODOS"
          ? true
          : String(venda.status || "").toUpperCase() === filtroHistoricoStatus;

      const termoOk =
        !termo ||
        String(venda.id || "").toLowerCase().includes(termo) ||
        String(venda.clienteNome || "").toLowerCase().includes(termo) ||
        String(venda.produtoModelo || "").toLowerCase().includes(termo) ||
        String(venda.vendedor || "").toLowerCase().includes(termo) ||
        String(venda.formaPagamento || "").toLowerCase().includes(termo);

      return statusOk && termoOk;
    });
  }, [vendasRecentes, buscaHistorico, filtroHistoricoStatus]);

  async function carregarDadosPDV() {
    setCarregando(true);

    try {
      const [resResumo, resEstoque, resVendas, resInteresses, resClientes] =
        await Promise.all([
          fetch("http://localhost:8080/api/pdv/resumo"),
          fetch("http://localhost:8080/api/estoque/disponiveis"),
          fetch("http://localhost:8080/api/pdv/vendas-recentes"),
          fetch("http://localhost:8080/api/pdv/interesses-clientes"),
          fetch("http://localhost:8080/api/clientes"),
        ]);

      let resumo = null;
      let estoque = null;
      let vendas = null;
      let interesses = null;
      let clientes = null;

      if (resResumo.ok) resumo = await resResumo.json();
      if (resEstoque.ok) estoque = await resEstoque.json();
      if (resVendas.ok) vendas = await resVendas.json();
      if (resInteresses.ok) interesses = await resInteresses.json();
      if (resClientes.ok) clientes = await resClientes.json();

      setResumoPDV({
        vendasHoje: resumo?.vendasHoje || 8,
        totalHoje: resumo?.totalHoje || 18450,
        ticketMedio: resumo?.ticketMedio || 3075,
        clientesAtendidos: resumo?.clientesAtendidos || 11,
        itensDisponiveis:
          resumo?.itensDisponiveis || (Array.isArray(estoque) ? estoque.length : 6),
        pendencias: resumo?.pendencias || 3,
        minhaMetaDia: resumo?.minhaMetaDia || 8000,
        meuRealizadoDia: resumo?.meuRealizadoDia || 5120,
        metaLojaDia: resumo?.metaLojaDia || 25000,
        realizadoLojaDia: resumo?.realizadoLojaDia || 18450,
        caixaAtual: resumo?.caixaAtual || 6230,
      });

      setEstoqueDisponivel(
        Array.isArray(estoque) && estoque.length > 0
          ? estoque.map((item) => ({
              id: item.id,
              modelo: item.modelo || item.nome || "Produto sem nome",
              categoria: item.categoria || item.tipo || "",
              preco: Number(item.preco || 0),
              status: item.status || "DISPONÍVEL",
            }))
          : [
              {
                id: "EST-001",
                modelo: "Sofá Retrátil 3 Lugares",
                categoria: "Sofás",
                preco: 4890,
                status: "DISPONÍVEL",
              },
              {
                id: "EST-002",
                modelo: "Poltrona Eames",
                categoria: "Poltronas",
                preco: 2150,
                status: "DISPONÍVEL",
              },
              {
                id: "EST-003",
                modelo: "Maca Estética Fixa",
                categoria: "Maca",
                preco: 1980,
                status: "DISPONÍVEL",
              },
              {
                id: "EST-004",
                modelo: "Escadinha Pet",
                categoria: "Pet",
                preco: 420,
                status: "DISPONÍVEL",
              },
            ]
      );

      setVendasRecentes(
        Array.isArray(vendas) && vendas.length > 0
          ? vendas
          : [
              {
                id: "VEN-1001",
                clienteNome: "Mariana Souza",
                produtoModelo: "Sofá Retrátil 3 Lugares",
                vendedor: "Ana Paula",
                totalLiquido: 4890,
                formaPagamento: "Cartão",
                status: "FINALIZADA",
                dataHora: new Date().toISOString(),
              },
              {
                id: "VEN-1002",
                clienteNome: "João Pedro",
                produtoModelo: "Poltrona Eames",
                vendedor: "Carlos A.",
                totalLiquido: 2150,
                formaPagamento: "PIX",
                status: "FINALIZADA",
                dataHora: new Date(Date.now() - 3600000).toISOString(),
              },
              {
                id: "VEN-1003",
                clienteNome: "Cláudia Lima",
                produtoModelo: "Maca Estética Fixa",
                vendedor: "Patrícia R.",
                totalLiquido: 1980,
                formaPagamento: "Dinheiro",
                status: "PENDENTE",
                dataHora: new Date(Date.now() - 7200000).toISOString(),
              },
              {
                id: "VEN-1004",
                clienteNome: "Fernanda Alves",
                produtoModelo: "Escadinha Pet",
                vendedor: "Ana Paula",
                totalLiquido: 420,
                formaPagamento: "PIX",
                status: "CANCELADA",
                dataHora: new Date(Date.now() - 10800000).toISOString(),
              },
            ]
      );

      setClientesInteresses(
        Array.isArray(interesses) && interesses.length > 0
          ? interesses
          : [
              {
                id: "INT-01",
                nome: "Tatiane Rocha",
                interesse: "Sofá 2 Lugares",
                paraQuando: "Até 15/03/2026",
                canal: "WhatsApp",
                prioridade: "Alta",
                orcamentoEstimado: 3200,
                observacao: "Quer tecido em tom bege e entrega rápida.",
              },
              {
                id: "INT-02",
                nome: "Camila Freire",
                interesse: "Poltrona Eames",
                paraQuando: "Antes do fim do mês",
                canal: "Loja Física",
                prioridade: "Urgente",
                orcamentoEstimado: 2300,
                observacao: "Está decidindo entre couro natural e sintético.",
              },
              {
                id: "INT-03",
                nome: "Roberto Nunes",
                interesse: "Maca Estética",
                paraQuando: "Daqui a 20 dias",
                canal: "Instagram",
                prioridade: "Média",
                orcamentoEstimado: 2100,
                observacao: "Quer avaliar parcelamento antes de fechar.",
              },
            ]
      );

      setClientesCadastrados(
        Array.isArray(clientes) && clientes.length > 0
          ? clientes
          : [
              {
                id: "CLI-001",
                nome: "Mariana Souza",
                telefone: "(83) 99999-1111",
                cpf: "123.456.789-00",
                ultimaCompra: "Sofá Retrátil 3 Lugares",
                ultimoInteresse: "Sofá 2 Lugares",
                ultimoAtendimento: new Date(Date.now() - 86400000).toISOString(),
                totalComprado: 4890,
              },
              {
                id: "CLI-002",
                nome: "João Pedro",
                telefone: "(83) 99999-2222",
                cpf: "987.654.321-00",
                ultimaCompra: "Poltrona Eames",
                ultimoInteresse: "Base giratória premium",
                ultimoAtendimento: new Date(Date.now() - 172800000).toISOString(),
                totalComprado: 2150,
              },
              {
                id: "CLI-003",
                nome: "Tatiane Rocha",
                telefone: "(83) 98888-3333",
                cpf: "111.222.333-44",
                ultimaCompra: "—",
                ultimoInteresse: "Sofá 2 Lugares",
                ultimoAtendimento: new Date(Date.now() - 36000000).toISOString(),
                totalComprado: 0,
              },
            ]
      );
    } catch (error) {
      console.error("Erro ao carregar dados do PDV:", error);

      setResumoPDV({
        vendasHoje: 8,
        totalHoje: 18450,
        ticketMedio: 3075,
        clientesAtendidos: 11,
        itensDisponiveis: 6,
        pendencias: 3,
        minhaMetaDia: 8000,
        meuRealizadoDia: 5120,
        metaLojaDia: 25000,
        realizadoLojaDia: 18450,
        caixaAtual: 6230,
      });

      setEstoqueDisponivel([
        {
          id: "EST-001",
          modelo: "Sofá Retrátil 3 Lugares",
          categoria: "Sofás",
          preco: 4890,
          status: "DISPONÍVEL",
        },
        {
          id: "EST-002",
          modelo: "Poltrona Eames",
          categoria: "Poltronas",
          preco: 2150,
          status: "DISPONÍVEL",
        },
        {
          id: "EST-003",
          modelo: "Maca Estética Fixa",
          categoria: "Maca",
          preco: 1980,
          status: "DISPONÍVEL",
        },
        {
          id: "EST-004",
          modelo: "Escadinha Pet",
          categoria: "Pet",
          preco: 420,
          status: "DISPONÍVEL",
        },
      ]);

      setVendasRecentes([
        {
          id: "VEN-1001",
          clienteNome: "Mariana Souza",
          produtoModelo: "Sofá Retrátil 3 Lugares",
          vendedor: "Ana Paula",
          totalLiquido: 4890,
          formaPagamento: "Cartão",
          status: "FINALIZADA",
          dataHora: new Date().toISOString(),
        },
        {
          id: "VEN-1002",
          clienteNome: "João Pedro",
          produtoModelo: "Poltrona Eames",
          vendedor: "Carlos A.",
          totalLiquido: 2150,
          formaPagamento: "PIX",
          status: "FINALIZADA",
          dataHora: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: "VEN-1003",
          clienteNome: "Cláudia Lima",
          produtoModelo: "Maca Estética Fixa",
          vendedor: "Patrícia R.",
          totalLiquido: 1980,
          formaPagamento: "Dinheiro",
          status: "PENDENTE",
          dataHora: new Date(Date.now() - 7200000).toISOString(),
        },
      ]);

      setClientesInteresses([
        {
          id: "INT-01",
          nome: "Tatiane Rocha",
          interesse: "Sofá 2 Lugares",
          paraQuando: "Até 15/03/2026",
          canal: "WhatsApp",
          prioridade: "Alta",
          orcamentoEstimado: 3200,
          observacao: "Quer tecido em tom bege e entrega rápida.",
        },
        {
          id: "INT-02",
          nome: "Camila Freire",
          interesse: "Poltrona Eames",
          paraQuando: "Antes do fim do mês",
          canal: "Loja Física",
          prioridade: "Urgente",
          orcamentoEstimado: 2300,
          observacao: "Está decidindo entre couro natural e sintético.",
        },
      ]);

      setClientesCadastrados([
        {
          id: "CLI-001",
          nome: "Mariana Souza",
          telefone: "(83) 99999-1111",
          cpf: "123.456.789-00",
          ultimaCompra: "Sofá Retrátil 3 Lugares",
          ultimoInteresse: "Sofá 2 Lugares",
          ultimoAtendimento: new Date(Date.now() - 86400000).toISOString(),
          totalComprado: 4890,
        },
        {
          id: "CLI-002",
          nome: "João Pedro",
          telefone: "(83) 99999-2222",
          cpf: "987.654.321-00",
          ultimaCompra: "Poltrona Eames",
          ultimoInteresse: "Base giratória premium",
          ultimoAtendimento: new Date(Date.now() - 172800000).toISOString(),
          totalComprado: 2150,
        },
        {
          id: "CLI-003",
          nome: "Tatiane Rocha",
          telefone: "(83) 98888-3333",
          cpf: "111.222.333-44",
          ultimaCompra: "—",
          ultimoInteresse: "Sofá 2 Lugares",
          ultimoAtendimento: new Date(Date.now() - 36000000).toISOString(),
          totalComprado: 0,
        },
      ]);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarDadosPDV();
  }, []);

  async function handleFinalizarVenda(payloadVenda) {
    try {
      const response = await fetch("http://localhost:8080/api/vendas/pdv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payloadVenda),
      });

      if (!response.ok) {
        throw new Error("Falha ao registrar venda.");
      }

      setModalPDVAberto(false);
      await carregarDadosPDV();
    } catch (error) {
      console.error("Erro ao registrar venda:", error);
      alert("Não foi possível registrar a venda no momento.");
    }
  }

  function abrirPainelBuscarCliente() {
    setBuscaCliente("");
    setPainelAberto("buscar-cliente");
  }

  function abrirPainelHistorico() {
    setBuscaHistorico("");
    setFiltroHistoricoStatus("TODOS");
    setPainelAberto("historico-vendas");
  }

  function fecharPainel() {
    setPainelAberto(null);
  }

  return (
    <div className="animate-fade-in p-6 pb-10 space-y-6 bg-[#f8f9f5] min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-[#064e3b] uppercase flex items-center gap-2">
            <Store className="text-[#b49157]" />
            Ponto de Venda <span className="text-slate-300">|</span>
            <span className="text-[#b49157] italic font-light">PDV</span>
          </h1>

          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">
            Checkout, atendimento, vendas do dia e operação comercial
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="px-4 py-3 rounded-xl bg-white border border-slate-200 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Usuária logada
            </p>
            <p className="mt-1 text-sm font-black text-[#064e3b] uppercase">
              {nomeUsuario}
            </p>
          </div>

          <div className="px-4 py-3 rounded-xl bg-white border border-slate-200 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Perfil
            </p>
            <p className="mt-1 text-sm font-black text-[#064e3b] uppercase flex items-center gap-2">
              {isAdmin ? (
                <Crown size={14} className="text-[#b49157]" />
              ) : (
                <ShieldCheck size={14} className="text-[#b49157]" />
              )}
              {isAdmin ? "Admin / Dona" : "Loja"}
            </p>
          </div>
        </div>
      </div>

      {/* AÇÕES RÁPIDAS */}
      <SectionCard
        title="Ações Rápidas do PDV"
        icon={ShoppingCart}
        extra={
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            checkout operacional
          </span>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <ActionButton
            icon={Plus}
            title="Nova Venda"
            subtitle="Abrir checkout do PDV"
            onClick={() => setModalPDVAberto(true)}
            accent
            disabled={!permissions.canOpenSale}
          />

          <ActionButton
            icon={Search}
            title="Buscar Cliente"
            subtitle="Consultar histórico e dados"
            onClick={abrirPainelBuscarCliente}
            disabled={!permissions.canSearchCustomer}
          />

          <ActionButton
            icon={ClipboardList}
            title="Histórico de Vendas"
            subtitle="Ver últimas vendas realizadas"
            onClick={abrirPainelHistorico}
            disabled={!permissions.canOpenSalesHistory}
          />

          <ActionButton
            icon={Wallet}
            title="Gerenciar Caixa"
            subtitle="Abertura, fechamento e saldo"
            onClick={() => {}}
            disabled={!permissions.canManageCashDesk}
          />
        </div>
      </SectionCard>

      {/* KPIS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard
          icon={Receipt}
          label="Vendas Hoje"
          value={resumoPDV.vendasHoje}
          hint="quantidade de pedidos fechados"
          valueClassName="text-[#064e3b]"
        />

        <MetricCard
          icon={BadgeDollarSign}
          label="Total Vendido"
          value={formatCurrency(resumoPDV.totalHoje)}
          hint="movimento financeiro do dia"
          valueClassName="text-rose-500"
          highlighted
        />

        <MetricCard
          icon={Users}
          label="Clientes Atendidos"
          value={resumoPDV.clientesAtendidos}
          hint="atendimentos realizados hoje"
          valueClassName="text-[#064e3b]"
        />

        <MetricCard
          icon={Boxes}
          label="Itens Disponíveis"
          value={resumoPDV.itensDisponiveis}
          hint="produtos prontos no estoque"
          valueClassName="text-[#b49157]"
        />
      </div>

      {/* META + STATUS */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <SectionCard
            title={isAdmin ? "Meta da Loja no Dia" : "Minha Meta no Dia"}
            icon={Target}
          >
            {isAdmin ? (
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Realizado
                    </p>
                    <p className="text-3xl font-black text-[#064e3b]">
                      {formatCurrency(resumoPDV.realizadoLojaDia)}
                    </p>
                  </div>

                  <div className="text-left md:text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Meta
                    </p>
                    <p className="text-xl font-black text-slate-700">
                      {formatCurrency(resumoPDV.metaLojaDia)}
                    </p>
                  </div>
                </div>

                <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#064e3b] rounded-full"
                    style={{ width: `${progressoMetaLoja}%` }}
                  />
                </div>

                <div className="flex justify-between items-center gap-4 flex-wrap">
                  <span className="text-xs font-black uppercase text-slate-500">
                    {progressoMetaLoja.toFixed(0)}% da meta concluída
                  </span>
                  <span className="text-xs font-bold uppercase text-slate-400">
                    visão geral da loja
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Meu realizado
                    </p>
                    <p className="text-3xl font-black text-[#064e3b]">
                      {formatCurrency(resumoPDV.meuRealizadoDia)}
                    </p>
                  </div>

                  <div className="text-left md:text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Minha meta
                    </p>
                    <p className="text-xl font-black text-slate-700">
                      {formatCurrency(resumoPDV.minhaMetaDia)}
                    </p>
                  </div>
                </div>

                <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#b49157] rounded-full"
                    style={{ width: `${progressoMetaMinha}%` }}
                  />
                </div>

                <div className="flex justify-between items-center gap-4 flex-wrap">
                  <span className="text-xs font-black uppercase text-slate-500">
                    {progressoMetaMinha.toFixed(0)}% da meta concluída
                  </span>
                  <span className="text-xs font-bold uppercase text-slate-400">
                    desempenho individual
                  </span>
                </div>
              </div>
            )}
          </SectionCard>
        </div>

        <div className="xl:col-span-1">
          <SectionCard title="Status do Caixa" icon={Wallet}>
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Caixa Atual
                </p>
                <p className="mt-2 text-3xl font-black text-[#064e3b]">
                  {formatCurrency(resumoPDV.caixaAtual)}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Pendências
                </p>
                <p className="mt-2 text-2xl font-black text-rose-500">
                  {resumoPDV.pendencias}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex items-start gap-3">
                {resumoPDV.pendencias > 0 ? (
                  <>
                    <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-xs font-bold text-slate-600">
                      Existem pendências de atendimento e/ou fechamento.
                    </p>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-xs font-bold text-slate-600">
                      Operação do PDV sem pendências no momento.
                    </p>
                  </>
                )}
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      {/* CORPO PRINCIPAL */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7 space-y-6">
          <SectionCard
            title="Itens Disponíveis para Venda"
            icon={Package2}
            extra={
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                estoque pronto
              </span>
            }
          >
            {permissions.canSeeAvailableStock ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {estoqueDisponivel.slice(0, 6).map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#b49157]">
                          {item.id}
                        </p>
                        <p className="mt-2 text-sm font-black text-[#064e3b] uppercase break-words">
                          {item.modelo}
                        </p>
                        {item.categoria ? (
                          <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            {item.categoria}
                          </p>
                        ) : null}
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-sm font-black text-rose-500">
                          {formatCurrency(item.preco)}
                        </p>
                        <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-emerald-600">
                          {item.status}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {estoqueDisponivel.length === 0 && !carregando && (
                  <div className="md:col-span-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                    <Boxes size={28} className="mx-auto mb-3 text-slate-300" />
                    <p className="text-xs font-black uppercase text-slate-400">
                      Nenhum item disponível para venda
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <p className="text-xs font-black uppercase text-slate-400">
                  Sem acesso aos itens disponíveis
                </p>
              </div>
            )}
          </SectionCard>

          <SectionCard title="Vendas Recentes" icon={Receipt}>
            {permissions.canSeeRecentSales ? (
              <div className="space-y-3">
                {vendasRecentes.slice(0, 4).map((venda) => (
                  <div
                    key={venda.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            {venda.id}
                          </span>
                          <StatusBadge status={venda.status} />
                        </div>

                        <p className="mt-2 text-sm font-black text-[#064e3b] uppercase break-words">
                          {venda.clienteNome}
                        </p>

                        <p className="mt-1 text-xs font-bold text-slate-500 break-words">
                          {venda.produtoModelo}
                        </p>

                        <div className="mt-2 flex gap-2 flex-wrap">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Vendedor: {venda.vendedor}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                            •
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            {venda.formaPagamento}
                          </span>
                        </div>
                      </div>

                      <div className="text-left lg:text-right shrink-0">
                        <p className="text-lg font-black text-rose-500">
                          {formatCurrency(venda.totalLiquido)}
                        </p>
                        <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                          {formatDateTime(venda.dataHora)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {vendasRecentes.length === 0 && !carregando && (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                    <Receipt size={28} className="mx-auto mb-3 text-slate-300" />
                    <p className="text-xs font-black uppercase text-slate-400">
                      Nenhuma venda registrada ainda
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <p className="text-xs font-black uppercase text-slate-400">
                  Sem acesso às vendas recentes
                </p>
              </div>
            )}
          </SectionCard>
        </div>

        <div className="xl:col-span-5 space-y-6">
          <SectionCard
            title="Clientes Interessados / Para Quando"
            icon={Clock3}
            extra={
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                intenção de compra
              </span>
            }
          >
            {permissions.canSeeCustomerInterests ? (
              <div className="space-y-3">
                {clientesInteresses.map((cliente) => (
                  <div
                    key={cliente.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-black text-[#064e3b] uppercase break-words">
                          {cliente.nome}
                        </p>

                        <p className="mt-2 text-xs font-bold text-slate-500">
                          Quer: <span className="text-slate-700">{cliente.interesse}</span>
                        </p>

                        <p className="mt-1 text-xs font-bold text-slate-500">
                          Para quando:{" "}
                          <span className="text-slate-700">{cliente.paraQuando}</span>
                        </p>

                        <div className="mt-3 flex gap-2 flex-wrap">
                          <span className="px-2 py-1 rounded-lg border border-slate-200 bg-white text-[10px] font-black uppercase tracking-wide text-slate-500 flex items-center gap-1">
                            <MessageSquare size={12} />
                            {cliente.canal}
                          </span>

                          <span className="px-2 py-1 rounded-lg border border-slate-200 bg-white text-[10px] font-black uppercase tracking-wide text-slate-500">
                            Estimativa: {formatCurrency(cliente.orcamentoEstimado)}
                          </span>
                        </div>

                        {cliente.observacao ? (
                          <p className="mt-3 text-[11px] font-bold text-slate-500">
                            {cliente.observacao}
                          </p>
                        ) : null}
                      </div>

                      <div className="shrink-0">
                        <InterestPriorityBadge prioridade={cliente.prioridade} />
                      </div>
                    </div>
                  </div>
                ))}

                {clientesInteresses.length === 0 && !carregando && (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                    <Users size={28} className="mx-auto mb-3 text-slate-300" />
                    <p className="text-xs font-black uppercase text-slate-400">
                      Nenhum interesse de cliente registrado
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <p className="text-xs font-black uppercase text-slate-400">
                  Sem acesso aos interesses de clientes
                </p>
              </div>
            )}
          </SectionCard>

          {permissions.canSeeMyPerformance && (
            <SectionCard title="Meu Painel de Vendas" icon={UserRound}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Meu realizado
                  </p>
                  <p className="mt-2 text-2xl font-black text-[#064e3b]">
                    {formatCurrency(resumoPDV.meuRealizadoDia)}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Minha meta
                  </p>
                  <p className="mt-2 text-2xl font-black text-[#b49157]">
                    {formatCurrency(resumoPDV.minhaMetaDia)}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                    Progresso
                  </p>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#b49157] rounded-full"
                      style={{ width: `${progressoMetaMinha}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs font-black uppercase text-slate-500">
                    {progressoMetaMinha.toFixed(0)}% da meta concluída
                  </p>
                </div>
              </div>
            </SectionCard>
          )}

          {permissions.canSeeTeamPerformance && (
            <SectionCard title="Painel Gerencial do PDV" icon={TrendingUp}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Total vendido
                  </p>
                  <p className="mt-2 text-2xl font-black text-[#064e3b]">
                    {formatCurrency(resumoPDV.totalHoje)}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Ticket médio
                  </p>
                  <p className="mt-2 text-2xl font-black text-rose-500">
                    {formatCurrency(resumoPDV.ticketMedio)}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 md:col-span-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Desempenho da loja
                  </p>

                  <div className="mt-3 w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#064e3b] rounded-full"
                      style={{ width: `${progressoMetaLoja}%` }}
                    />
                  </div>

                  <p className="mt-2 text-xs font-black uppercase text-slate-500">
                    {progressoMetaLoja.toFixed(0)}% da meta do dia concluída
                  </p>
                </div>
              </div>
            </SectionCard>
          )}

          <SectionCard title="Avisos do PDV" icon={BellRing}>
            <div className="space-y-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex items-start gap-3">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-xs font-bold text-slate-600">
                  Checkout disponível para registrar vendas com estoque pronto.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex items-start gap-3">
                <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs font-bold text-slate-600">
                  Revise descontos e pagamentos antes de finalizar a operação.
                </p>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      {/* MODAL PDV */}
      {modalPDVAberto && (
        <ModalPDV
          onClose={() => setModalPDVAberto(false)}
          estoqueDisponivel={estoqueDisponivel}
          onFinalizarVenda={handleFinalizarVenda}
          role={role}
          usuarioLogado={usuarioLogado}
        />
      )}

      {/* PAINEL BUSCAR CLIENTE */}
      <SidePanel
        open={painelAberto === "buscar-cliente"}
        title="Buscar Cliente"
        icon={Search}
        subtitle="Consulta de cadastro, compras e último interesse"
        onClose={fecharPainel}
      >
        <div className="space-y-5">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={buscaCliente}
              onChange={(e) => setBuscaCliente(e.target.value)}
              placeholder="Buscar por nome, telefone, CPF ou interesse..."
              className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-slate-700 outline-none focus:border-[#b49157]"
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            {clientesFiltrados.length > 0 ? (
              clientesFiltrados.map((cliente) => (
                <div
                  key={cliente.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-black text-[#064e3b] uppercase break-words">
                        {cliente.nome}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-black uppercase tracking-wide text-slate-500 flex items-center gap-1">
                          <Phone size={12} />
                          {cliente.telefone || "Sem telefone"}
                        </span>

                        <span className="px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-black uppercase tracking-wide text-slate-500">
                          CPF: {cliente.cpf || "Não informado"}
                        </span>
                      </div>

                      <div className="mt-4 space-y-2">
                        <p className="text-xs font-bold text-slate-500">
                          Última compra:{" "}
                          <span className="text-slate-700 font-black">
                            {cliente.ultimaCompra || "—"}
                          </span>
                        </p>

                        <p className="text-xs font-bold text-slate-500">
                          Último interesse:{" "}
                          <span className="text-slate-700 font-black">
                            {cliente.ultimoInteresse || "—"}
                          </span>
                        </p>

                        <p className="text-xs font-bold text-slate-500">
                          Último atendimento:{" "}
                          <span className="text-slate-700 font-black">
                            {formatDateTime(cliente.ultimoAtendimento)}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="lg:text-right shrink-0">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Total comprado
                      </p>
                      <p className="mt-2 text-lg font-black text-rose-500">
                        {formatCurrency(cliente.totalComprado)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center">
                <Users size={28} className="mx-auto mb-3 text-slate-300" />
                <p className="text-xs font-black uppercase text-slate-400">
                  Nenhum cliente encontrado para a busca informada
                </p>
              </div>
            )}
          </div>
        </div>
      </SidePanel>

      {/* PAINEL HISTÓRICO DE VENDAS */}
      <SidePanel
        open={painelAberto === "historico-vendas"}
        title="Histórico de Vendas"
        icon={ClipboardList}
        subtitle="Consulta detalhada das vendas realizadas no PDV"
        onClose={fecharPainel}
      >
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_180px] gap-4">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={buscaHistorico}
                onChange={(e) => setBuscaHistorico(e.target.value)}
                placeholder="Buscar por ID, cliente, produto, vendedor..."
                className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-slate-700 outline-none focus:border-[#b49157]"
              />
            </div>

            <div className="relative">
              <Filter
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <select
                value={filtroHistoricoStatus}
                onChange={(e) => setFiltroHistoricoStatus(e.target.value)}
                className="w-full appearance-none bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-black text-slate-700 outline-none focus:border-[#b49157]"
              >
                <option value="TODOS">Todos</option>
                <option value="FINALIZADA">Finalizadas</option>
                <option value="PENDENTE">Pendentes</option>
                <option value="CANCELADA">Canceladas</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {historicoFiltrado.length > 0 ? (
              historicoFiltrado.map((venda) => (
                <div
                  key={venda.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"
                >
                  <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          {venda.id}
                        </span>
                        <StatusBadge status={venda.status} />
                      </div>

                      <p className="mt-3 text-sm font-black text-[#064e3b] uppercase break-words">
                        {venda.clienteNome}
                      </p>

                      <p className="mt-1 text-xs font-bold text-slate-500 break-words">
                        {venda.produtoModelo}
                      </p>

                      <div className="mt-3 flex gap-2 flex-wrap">
                        <span className="px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-black uppercase tracking-wide text-slate-500">
                          Vendedor: {venda.vendedor}
                        </span>

                        <span className="px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-black uppercase tracking-wide text-slate-500">
                          {venda.formaPagamento}
                        </span>

                        <span className="px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-black uppercase tracking-wide text-slate-500">
                          {formatDateTime(venda.dataHora)}
                        </span>
                      </div>
                    </div>

                    <div className="xl:text-right shrink-0">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Total líquido
                      </p>
                      <p className="mt-2 text-lg font-black text-rose-500">
                        {formatCurrency(venda.totalLiquido)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center">
                <Receipt size={28} className="mx-auto mb-3 text-slate-300" />
                <p className="text-xs font-black uppercase text-slate-400">
                  Nenhuma venda encontrada para os filtros aplicados
                </p>
              </div>
            )}
          </div>
        </div>
      </SidePanel>
    </div>
  );
}

export default PDV;