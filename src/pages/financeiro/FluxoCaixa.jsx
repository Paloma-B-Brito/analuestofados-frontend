import React, { useMemo, useState } from "react";
import "../../App.css";
import {
  ShieldAlert,
  Crown,
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  CalendarDays,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Receipt,
  BarChart3,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Banknote,
  CreditCard,
  FileBarChart,
  X,
  FileText,
  Truck,
  Factory,
  Store,
  Landmark,
} from "lucide-react";

/**
 * @file FluxoCaixa.jsx
 * @description Fluxo de Caixa Executivo
 * @author © 2026 Rickman Brown • Software Engineering
 */

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatDate(value) {
  if (!value) return "--";

  const date = new Date(value);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatDateTime(value) {
  if (!value) return "--";

  const date = new Date(value);
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function createRelativeDate(daysOffset = 0, hour = 10, minute = 0) {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

function getStatusClasses(status) {
  const normalized = String(status || "").toLowerCase();

  if (normalized.includes("vencido")) {
    return "bg-rose-50 text-rose-700 border-rose-200";
  }

  if (normalized.includes("previsto")) {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }

  if (normalized.includes("realizado") || normalized.includes("compensado")) {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }

  return "bg-slate-50 text-slate-700 border-slate-200";
}

function getTypeClasses(tipo) {
  const normalized = String(tipo || "").toLowerCase();

  if (normalized.includes("entrada")) {
    return "bg-blue-50 text-blue-700 border-blue-200";
  }

  if (normalized.includes("saída") || normalized.includes("saida")) {
    return "bg-rose-50 text-rose-700 border-rose-200";
  }

  return "bg-slate-50 text-slate-700 border-slate-200";
}

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
      className={`px-2 py-1 rounded-lg border text-[10px] font-black uppercase tracking-wide ${getStatusClasses(
        status
      )}`}
    >
      {status}
    </span>
  );
}

function TypeBadge({ tipo }) {
  return (
    <span
      className={`px-2 py-1 rounded-lg border text-[10px] font-black uppercase tracking-wide ${getTypeClasses(
        tipo
      )}`}
    >
      {tipo}
    </span>
  );
}

function PeriodButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors ${
        active
          ? "bg-[#064e3b] text-white"
          : "bg-slate-100 text-slate-500 hover:bg-slate-200"
      }`}
    >
      {children}
    </button>
  );
}

function MovimentoDrawer({ movimento, onClose }) {
  if (!movimento) return null;

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
              <Receipt size={18} className="text-[#b49157]" />
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#b49157]">
                Cash Flow Workspace
              </p>
            </div>

            <h3 className="mt-2 text-2xl font-black uppercase tracking-tight">
              {movimento.id}
            </h3>

            <p className="mt-2 text-xs font-bold uppercase tracking-widest text-white/70">
              detalhamento completo da movimentação
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors mt-1"
          >
            <X size={26} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#f8f9f5] p-6 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <TypeBadge tipo={movimento.tipo} />
                  <StatusBadge status={movimento.status} />
                </div>

                <p className="mt-3 text-xl font-black text-[#064e3b] uppercase break-words">
                  {movimento.descricao}
                </p>

                <p className="mt-2 text-sm font-bold text-slate-500">
                  {movimento.categoria}
                </p>
              </div>

              <div className="lg:text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Valor
                </p>
                <p
                  className={`mt-2 text-2xl font-black ${
                    movimento.tipo === "ENTRADA" ? "text-blue-500" : "text-rose-500"
                  }`}
                >
                  {formatCurrency(movimento.valor)}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Data
              </p>
              <p className="mt-2 text-sm font-black text-[#064e3b] uppercase">
                {formatDateTime(movimento.data)}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Origem
              </p>
              <p className="mt-2 text-sm font-black text-[#064e3b] uppercase">
                {movimento.origem}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Forma de pagamento
              </p>
              <p className="mt-2 text-sm font-black text-[#064e3b] uppercase">
                {movimento.formaPagamento}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Responsável
              </p>
              <p className="mt-2 text-sm font-black text-[#064e3b] uppercase">
                {movimento.responsavel}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
              Observações
            </p>
            <p className="text-sm font-bold text-slate-600 leading-relaxed">
              {movimento.observacoes || "Sem observações registradas."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FluxoCaixa({
  role = "ADMIN",
  usuarioLogado = { nome: "Administradora" },
}) {
  const normalizedRole = String(role || "").toUpperCase();
  const isAdminFinanceiro = !["LOJA", "FABRICA"].includes(normalizedRole);

  const [periodo, setPeriodo] = useState("30D");
  const [busca, setBusca] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("TODOS");
  const [statusFiltro, setStatusFiltro] = useState("TODOS");
  const [movimentoSelecionado, setMovimentoSelecionado] = useState(null);

  const nomeUsuario = usuarioLogado?.nome || "Administradora";

  const movimentacoes = [
    {
      id: "FCX-001",
      descricao: "Venda showroom • Sofá Retrátil 3 Lugares",
      categoria: "Receita de vendas",
      tipo: "ENTRADA",
      origem: "Loja",
      formaPagamento: "PIX",
      valor: 4890,
      data: createRelativeDate(-1, 10, 30),
      status: "REALIZADO",
      responsavel: "Ana Paula",
      observacoes: "Recebimento total confirmado no caixa.",
    },
    {
      id: "FCX-002",
      descricao: "Compra de espuma D33",
      categoria: "Matéria-prima",
      tipo: "SAÍDA",
      origem: "Fábrica",
      formaPagamento: "Transferência",
      valor: 4200,
      data: createRelativeDate(0, 9, 0),
      status: "PREVISTO",
      responsavel: "Diretoria",
      observacoes: "Pagamento programado para o fornecedor principal.",
    },
    {
      id: "FCX-003",
      descricao: "Recebimento parcelado • Poltrona Eames",
      categoria: "Recebíveis",
      tipo: "ENTRADA",
      origem: "Loja",
      formaPagamento: "Cartão de Crédito",
      valor: 2150,
      data: createRelativeDate(0, 14, 20),
      status: "REALIZADO",
      responsavel: "Carlos A.",
      observacoes: "Venda confirmada com adquirente.",
    },
    {
      id: "FCX-004",
      descricao: "Frete terceirizado de entrega",
      categoria: "Logística",
      tipo: "SAÍDA",
      origem: "Operação",
      formaPagamento: "PIX",
      valor: 680,
      data: createRelativeDate(-2, 15, 45),
      status: "REALIZADO",
      responsavel: "Patrícia R.",
      observacoes: "Entrega da região metropolitana.",
    },
    {
      id: "FCX-005",
      descricao: "Conta de energia da fábrica",
      categoria: "Infraestrutura",
      tipo: "SAÍDA",
      origem: "Fábrica",
      formaPagamento: "Boleto",
      valor: 2360,
      data: createRelativeDate(2, 8, 0),
      status: "PREVISTO",
      responsavel: "Diretoria",
      observacoes: "Vencimento da concessionária.",
    },
    {
      id: "FCX-006",
      descricao: "Entrada • Maca Estética Fixa",
      categoria: "Receita de vendas",
      tipo: "ENTRADA",
      origem: "Loja",
      formaPagamento: "Dinheiro",
      valor: 1980,
      data: createRelativeDate(-4, 16, 10),
      status: "REALIZADO",
      responsavel: "Patrícia R.",
      observacoes: "Recebimento integral em espécie.",
    },
    {
      id: "FCX-007",
      descricao: "Folha salarial parcial",
      categoria: "Pessoal",
      tipo: "SAÍDA",
      origem: "Administrativo",
      formaPagamento: "Transferência",
      valor: 12500,
      data: createRelativeDate(-5, 11, 0),
      status: "COMPENSADO",
      responsavel: "Diretoria",
      observacoes: "Pagamento de colaboradores da quinzena.",
    },
    {
      id: "FCX-008",
      descricao: "Venda • Escadinha Pet",
      categoria: "Receita de vendas",
      tipo: "ENTRADA",
      origem: "Loja",
      formaPagamento: "Cartão de Débito",
      valor: 420,
      data: createRelativeDate(-3, 13, 5),
      status: "REALIZADO",
      responsavel: "Ana Paula",
      observacoes: "Venda rápida de balcão.",
    },
    {
      id: "FCX-009",
      descricao: "Parcela de maquinário",
      categoria: "Imobilizado",
      tipo: "SAÍDA",
      origem: "Administrativo",
      formaPagamento: "Boleto",
      valor: 5900,
      data: createRelativeDate(-1, 8, 30),
      status: "VENCIDO",
      responsavel: "Diretoria",
      observacoes: "Necessita regularização imediata.",
    },
    {
      id: "FCX-010",
      descricao: "Recebimento de pedido corporativo",
      categoria: "Recebíveis",
      tipo: "ENTRADA",
      origem: "Comercial",
      formaPagamento: "Transferência",
      valor: 8350,
      data: createRelativeDate(1, 10, 0),
      status: "PREVISTO",
      responsavel: "Diretoria",
      observacoes: "Cliente empresarial com confirmação por contrato.",
    },
    {
      id: "FCX-011",
      descricao: "Compra de tecido premium",
      categoria: "Matéria-prima",
      tipo: "SAÍDA",
      origem: "Fábrica",
      formaPagamento: "PIX",
      valor: 3150,
      data: createRelativeDate(-7, 9, 40),
      status: "REALIZADO",
      responsavel: "Diretoria",
      observacoes: "Reposição estratégica de estoque.",
    },
    {
      id: "FCX-012",
      descricao: "Pagamento de campanha digital",
      categoria: "Marketing",
      tipo: "SAÍDA",
      origem: "Administrativo",
      formaPagamento: "Cartão corporativo",
      valor: 860,
      data: createRelativeDate(-6, 18, 0),
      status: "COMPENSADO",
      responsavel: "Diretoria",
      observacoes: "Impulsionamento de campanha de showroom.",
    },
    {
      id: "FCX-013",
      descricao: "Entrada de sinal • Sofá sob medida",
      categoria: "Receita de vendas",
      tipo: "ENTRADA",
      origem: "Loja",
      formaPagamento: "PIX",
      valor: 2500,
      data: createRelativeDate(3, 11, 20),
      status: "PREVISTO",
      responsavel: "Ana Paula",
      observacoes: "Cliente confirmou sinal para início de produção.",
    },
  ];

  const diasPeriodo = {
    "7D": 7,
    "15D": 15,
    "30D": 30,
  };

  const dataLimite = useMemo(() => {
    const dias = diasPeriodo[periodo] || 30;
    const date = new Date();
    date.setDate(date.getDate() - dias);
    return date;
  }, [periodo]);

  const movimentacoesPeriodo = useMemo(() => {
    return movimentacoes.filter((item) => new Date(item.data) >= dataLimite);
  }, [movimentacoes, dataLimite]);

  const movimentacoesFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return movimentacoesPeriodo.filter((item) => {
      const matchBusca =
        !termo ||
        String(item.id || "").toLowerCase().includes(termo) ||
        String(item.descricao || "").toLowerCase().includes(termo) ||
        String(item.categoria || "").toLowerCase().includes(termo) ||
        String(item.origem || "").toLowerCase().includes(termo) ||
        String(item.responsavel || "").toLowerCase().includes(termo);

      const matchTipo =
        tipoFiltro === "TODOS"
          ? true
          : String(item.tipo || "").toUpperCase() === tipoFiltro;

      const matchStatus =
        statusFiltro === "TODOS"
          ? true
          : String(item.status || "").toUpperCase() === statusFiltro;

      return matchBusca && matchTipo && matchStatus;
    });
  }, [movimentacoesPeriodo, busca, tipoFiltro, statusFiltro]);

  const resumo = useMemo(() => {
    const saldoInicial = 142000;

    const entradasRealizadas = movimentacoesPeriodo
      .filter((item) => item.tipo === "ENTRADA" && item.status !== "PREVISTO")
      .reduce((acc, item) => acc + Number(item.valor || 0), 0);

    const saidasRealizadas = movimentacoesPeriodo
      .filter((item) => item.tipo === "SAÍDA" && item.status !== "PREVISTO")
      .reduce((acc, item) => acc + Number(item.valor || 0), 0);

    const entradasPrevistas = movimentacoesPeriodo
      .filter((item) => item.tipo === "ENTRADA" && item.status === "PREVISTO")
      .reduce((acc, item) => acc + Number(item.valor || 0), 0);

    const saidasPrevistas = movimentacoesPeriodo
      .filter((item) => item.tipo === "SAÍDA" && item.status === "PREVISTO")
      .reduce((acc, item) => acc + Number(item.valor || 0), 0);

    const saldoAtual = saldoInicial + entradasRealizadas - saidasRealizadas;
    const saldoProjetado = saldoAtual + entradasPrevistas - saidasPrevistas;

    const vencidos = movimentacoesPeriodo.filter(
      (item) => String(item.status || "").toUpperCase() === "VENCIDO"
    ).length;

    return {
      saldoInicial,
      entradasRealizadas,
      saidasRealizadas,
      entradasPrevistas,
      saidasPrevistas,
      saldoAtual,
      saldoProjetado,
      vencidos,
    };
  }, [movimentacoesPeriodo]);

  const fluxoAgrupado = useMemo(() => {
    const mapa = new Map();

    movimentacoesPeriodo.forEach((item) => {
      const chave = formatDate(item.data);

      if (!mapa.has(chave)) {
        mapa.set(chave, {
          label: chave,
          entradas: 0,
          saidas: 0,
          saldo: 0,
        });
      }

      const registro = mapa.get(chave);
      const valor = Number(item.valor || 0);

      if (item.tipo === "ENTRADA") {
        registro.entradas += valor;
      } else {
        registro.saidas += valor;
      }

      registro.saldo = registro.entradas - registro.saidas;
    });

    return Array.from(mapa.values()).slice(-8);
  }, [movimentacoesPeriodo]);

  const maiorBarra = useMemo(() => {
    return Math.max(
      ...fluxoAgrupado.map((item) =>
        Math.max(item.entradas, item.saidas, Math.abs(item.saldo))
      ),
      1
    );
  }, [fluxoAgrupado]);

  const contasCriticas = useMemo(() => {
    return movimentacoesPeriodo
      .filter((item) =>
        ["PREVISTO", "VENCIDO"].includes(String(item.status || "").toUpperCase())
      )
      .sort((a, b) => new Date(a.data) - new Date(b.data))
      .slice(0, 6);
  }, [movimentacoesPeriodo]);

  const resumoCategorias = useMemo(() => {
    const categorias = {};

    movimentacoesPeriodo.forEach((item) => {
      const key = item.categoria;
      if (!categorias[key]) {
        categorias[key] = {
          categoria: key,
          entradas: 0,
          saidas: 0,
        };
      }

      if (item.tipo === "ENTRADA") {
        categorias[key].entradas += Number(item.valor || 0);
      } else {
        categorias[key].saidas += Number(item.valor || 0);
      }
    });

    return Object.values(categorias)
      .map((item) => ({
        ...item,
        saldo: item.entradas - item.saidas,
      }))
      .sort((a, b) => Math.abs(b.saldo) - Math.abs(a.saldo));
  }, [movimentacoesPeriodo]);

  if (!isAdminFinanceiro) {
    return (
      <div className="animate-fade-in p-6 min-h-screen bg-[#f8f9f5]">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-sm p-8 text-center mt-10">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mb-5">
            <ShieldAlert size={28} />
          </div>

          <h1 className="text-2xl font-black text-[#064e3b] uppercase">
            Acesso Restrito
          </h1>

          <p className="mt-4 text-sm font-bold text-slate-500 leading-relaxed">
            O fluxo de caixa é visível apenas para a administração.
            Perfis de loja e fábrica não possuem acesso a esta área.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Perfil atual
            </span>
            <span className="text-sm font-black text-[#064e3b] uppercase">
              {normalizedRole || "SEM PERFIL"}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in p-6 pb-10 space-y-6 bg-[#f8f9f5] min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-[#064e3b] uppercase flex items-center gap-2">
            <Landmark className="text-[#b49157]" />
            Fluxo de Caixa <span className="text-slate-300">|</span>
            <span className="text-[#b49157]">Diretoria</span>
          </h1>

          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">
            entradas, saídas, previsões financeiras e acompanhamento executivo do caixa
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
              <Crown size={14} className="text-[#b49157]" />
              Admin / Diretoria
            </p>
          </div>
        </div>
      </div>

      {/* FILTRO DE PERÍODO */}
      <SectionCard
        title="Janela de Análise"
        icon={CalendarDays}
        extra={
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            recorte financeiro
          </span>
        }
      >
        <div className="flex gap-3 flex-wrap">
          <PeriodButton active={periodo === "7D"} onClick={() => setPeriodo("7D")}>
            Últimos 7 dias
          </PeriodButton>

          <PeriodButton active={periodo === "15D"} onClick={() => setPeriodo("15D")}>
            Últimos 15 dias
          </PeriodButton>

          <PeriodButton active={periodo === "30D"} onClick={() => setPeriodo("30D")}>
            Últimos 30 dias
          </PeriodButton>
        </div>
      </SectionCard>

      {/* KPIS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard
          icon={Wallet}
          label="Saldo Inicial"
          value={formatCurrency(resumo.saldoInicial)}
          hint="base do período"
          valueClassName="text-[#064e3b]"
        />

        <MetricCard
          icon={ArrowUpCircle}
          label="Entradas Realizadas"
          value={formatCurrency(resumo.entradasRealizadas)}
          hint="recebimentos confirmados"
          valueClassName="text-blue-500"
        />

        <MetricCard
          icon={ArrowDownCircle}
          label="Saídas Realizadas"
          value={formatCurrency(resumo.saidasRealizadas)}
          hint="pagamentos efetivados"
          valueClassName="text-rose-500"
        />

        <MetricCard
          icon={PiggyBank}
          label="Saldo Atual"
          value={formatCurrency(resumo.saldoAtual)}
          hint="posição consolidada"
          valueClassName="text-emerald-600"
          highlighted
        />
      </div>

      {/* KPIS SECUNDÁRIOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard
          icon={TrendingUp}
          label="Entradas Previstas"
          value={formatCurrency(resumo.entradasPrevistas)}
          hint="a receber"
          valueClassName="text-[#064e3b]"
        />

        <MetricCard
          icon={TrendingDown}
          label="Saídas Previstas"
          value={formatCurrency(resumo.saidasPrevistas)}
          hint="a pagar"
          valueClassName="text-[#b49157]"
        />

        <MetricCard
          icon={Wallet}
          label="Saldo Projetado"
          value={formatCurrency(resumo.saldoProjetado)}
          hint="com previsões"
          valueClassName="text-emerald-600"
        />

        <MetricCard
          icon={AlertTriangle}
          label="Lançamentos Vencidos"
          value={resumo.vencidos}
          hint="pendências críticas"
          valueClassName="text-rose-500"
        />
      </div>

      {/* FLUXO + CONTAS CRÍTICAS */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <SectionCard
            title="Evolução do Fluxo"
            icon={BarChart3}
            extra={
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                entradas x saídas por dia
              </span>
            }
          >
            <div className="space-y-5">
              {fluxoAgrupado.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <span className="text-xs font-black uppercase text-slate-600">
                      {item.label}
                    </span>

                    <div className="flex gap-4 flex-wrap text-[10px] font-black uppercase tracking-widest">
                      <span className="text-blue-500">
                        Entradas {formatCurrency(item.entradas)}
                      </span>
                      <span className="text-rose-500">
                        Saídas {formatCurrency(item.saidas)}
                      </span>
                      <span className="text-[#064e3b]">
                        Saldo {formatCurrency(item.saldo)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{
                          width: `${(item.entradas / maiorBarra) * 100}%`,
                        }}
                      />
                    </div>

                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-rose-500 rounded-full"
                        style={{
                          width: `${(item.saidas / maiorBarra) * 100}%`,
                        }}
                      />
                    </div>

                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#064e3b] rounded-full"
                        style={{
                          width: `${(Math.abs(item.saldo) / maiorBarra) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}

              {fluxoAgrupado.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                  <BarChart3 size={28} className="mx-auto mb-3 text-slate-300" />
                  <p className="text-xs font-black uppercase text-slate-400">
                    Nenhuma movimentação encontrada no período
                  </p>
                </div>
              )}
            </div>
          </SectionCard>
        </div>

        <div className="xl:col-span-1">
          <SectionCard title="Contas Críticas" icon={Clock3}>
            <div className="space-y-3">
              {contasCriticas.length > 0 ? (
                contasCriticas.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setMovimentoSelecionado(item)}
                    className="w-full text-left rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white transition-colors p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-black text-[#064e3b] uppercase break-words">
                          {item.descricao}
                        </p>
                        <p className="mt-1 text-xs font-bold text-slate-500">
                          {item.categoria}
                        </p>
                        <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                          {formatDate(item.data)}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <StatusBadge status={item.status} />
                        <p
                          className={`mt-2 text-sm font-black ${
                            item.tipo === "ENTRADA" ? "text-blue-500" : "text-rose-500"
                          }`}
                        >
                          {formatCurrency(item.valor)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                  <CheckCircle2 size={24} className="mx-auto mb-3 text-emerald-500" />
                  <p className="text-xs font-black uppercase text-slate-400">
                    Sem contas críticas no período
                  </p>
                </div>
              )}
            </div>
          </SectionCard>
        </div>
      </div>

      {/* FILTROS DE LANÇAMENTOS */}
      <SectionCard
        title="Filtro de Lançamentos"
        icon={Filter}
        extra={
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            caixa analítico
          </span>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-[1fr_180px_180px] gap-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por ID, descrição, categoria, origem ou responsável..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-slate-700 outline-none focus:border-[#b49157]"
            />
          </div>

          <select
            value={tipoFiltro}
            onChange={(e) => setTipoFiltro(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-sm font-black text-slate-700 outline-none focus:border-[#b49157]"
          >
            <option value="TODOS">Todos os tipos</option>
            <option value="ENTRADA">Entradas</option>
            <option value="SAÍDA">Saídas</option>
          </select>

          <select
            value={statusFiltro}
            onChange={(e) => setStatusFiltro(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-sm font-black text-slate-700 outline-none focus:border-[#b49157]"
          >
            <option value="TODOS">Todos os status</option>
            <option value="REALIZADO">Realizado</option>
            <option value="COMPENSADO">Compensado</option>
            <option value="PREVISTO">Previsto</option>
            <option value="VENCIDO">Vencido</option>
          </select>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4 flex-wrap">
          <span className="text-xs font-black uppercase text-slate-500">
            {movimentacoesFiltradas.length} lançamento(s) encontrado(s)
          </span>

          <span className="text-xs font-black uppercase text-[#064e3b]">
            monitoramento executivo do caixa
          </span>
        </div>
      </SectionCard>

      {/* LANÇAMENTOS + CATEGORIAS */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8">
          <SectionCard
            title="Lançamentos do Caixa"
            icon={Receipt}
            extra={
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                razão financeira
              </span>
            }
          >
            <div className="space-y-4">
              {movimentacoesFiltradas.length > 0 ? (
                movimentacoesFiltradas.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setMovimentoSelecionado(item)}
                    className="w-full text-left rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors p-5"
                  >
                    <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            {item.id}
                          </span>
                          <TypeBadge tipo={item.tipo} />
                          <StatusBadge status={item.status} />
                        </div>

                        <p className="mt-3 text-sm font-black text-[#064e3b] uppercase break-words">
                          {item.descricao}
                        </p>

                        <p className="mt-1 text-xs font-bold text-slate-500 break-words">
                          {item.categoria}
                        </p>

                        <div className="mt-3 flex gap-2 flex-wrap">
                          <span className="px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-black uppercase tracking-wide text-slate-500">
                            {item.origem}
                          </span>

                          <span className="px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-black uppercase tracking-wide text-slate-500">
                            {item.formaPagamento}
                          </span>

                          <span className="px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-black uppercase tracking-wide text-slate-500">
                            {item.responsavel}
                          </span>
                        </div>
                      </div>

                      <div className="xl:text-right shrink-0">
                        <p
                          className={`text-lg font-black ${
                            item.tipo === "ENTRADA" ? "text-blue-500" : "text-rose-500"
                          }`}
                        >
                          {formatCurrency(item.valor)}
                        </p>

                        <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                          {formatDateTime(item.data)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                  <Receipt size={28} className="mx-auto mb-3 text-slate-300" />
                  <p className="text-xs font-black uppercase text-slate-400">
                    Nenhum lançamento encontrado para os filtros aplicados
                  </p>
                </div>
              )}
            </div>
          </SectionCard>
        </div>

        <div className="xl:col-span-4 space-y-6">
          <SectionCard
            title="Resumo por Categoria"
            icon={FileBarChart}
            extra={
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                consolidação
              </span>
            }
          >
            <div className="space-y-4">
              {resumoCategorias.map((item) => (
                <div
                  key={item.categoria}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <p className="text-sm font-black text-[#064e3b] uppercase break-words">
                    {item.categoria}
                  </p>

                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between items-center gap-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Entradas
                      </span>
                      <span className="text-xs font-black text-blue-500">
                        {formatCurrency(item.entradas)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center gap-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Saídas
                      </span>
                      <span className="text-xs font-black text-rose-500">
                        {formatCurrency(item.saidas)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center gap-4 pt-2 border-t border-slate-200">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Saldo
                      </span>
                      <span
                        className={`text-sm font-black ${
                          item.saldo >= 0 ? "text-emerald-600" : "text-rose-500"
                        }`}
                      >
                        {formatCurrency(item.saldo)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {resumoCategorias.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                  <FileBarChart size={24} className="mx-auto mb-3 text-slate-300" />
                  <p className="text-xs font-black uppercase text-slate-400">
                    Sem categorias no período
                  </p>
                </div>
              )}
            </div>
          </SectionCard>

          <SectionCard title="Avisos do Caixa" icon={AlertTriangle}>
            <div className="space-y-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex items-start gap-3">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-xs font-bold text-slate-600">
                  O módulo reúne entradas, saídas, previsões e vencimentos do caixa.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex items-start gap-3">
                <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs font-bold text-slate-600">
                  Lançamentos vencidos ou previstos precisam ser acompanhados de perto.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex items-start gap-3">
                <Wallet size={18} className="text-[#b49157] shrink-0 mt-0.5" />
                <p className="text-xs font-bold text-slate-600">
                  O saldo projetado ajuda a antecipar aperto ou folga de caixa.
                </p>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      <MovimentoDrawer
        movimento={movimentoSelecionado}
        onClose={() => setMovimentoSelecionado(null)}
      />
    </div>
  );
}

export default FluxoCaixa;