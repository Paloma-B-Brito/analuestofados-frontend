import React, { useMemo, useState } from "react";
import "../../App.css";
import {
  ShieldAlert,
  Crown,
  Landmark,
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Search,
  Filter,
  Receipt,
  CalendarDays,
  UserRound,
  Building2,
  CreditCard,
  FileText,
  X,
  BarChart3,
  TrendingUp,
  TrendingDown,
  BadgeDollarSign,
} from "lucide-react";

/**
 * @file Contas.jsx
 * @description Contas a Pagar e Receber
 * @author © 2026 Rickman Brown • Software Engineering
 */

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

  if (normalized.includes("vence hoje")) {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }

  if (normalized.includes("previsto")) {
    return "bg-blue-50 text-blue-700 border-blue-200";
  }

  if (normalized.includes("pago") || normalized.includes("recebido")) {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }

  return "bg-slate-50 text-slate-700 border-slate-200";
}

function getTypeClasses(tipo) {
  const normalized = String(tipo || "").toLowerCase();

  if (normalized.includes("receber")) {
    return "bg-blue-50 text-blue-700 border-blue-200";
  }

  if (normalized.includes("pagar")) {
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

function FilterButton({ active, children, onClick }) {
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

function ContaDrawer({ conta, onClose }) {
  if (!conta) return null;

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
                Financial Workspace
              </p>
            </div>

            <h3 className="mt-2 text-2xl font-black uppercase tracking-tight">
              {conta.id}
            </h3>

            <p className="mt-2 text-xs font-bold uppercase tracking-widest text-white/70">
              detalhamento completo da conta
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
                  <TypeBadge tipo={conta.tipo} />
                  <StatusBadge status={conta.status} />
                </div>

                <p className="mt-3 text-xl font-black text-[#064e3b] uppercase break-words">
                  {conta.descricao}
                </p>

                <p className="mt-2 text-sm font-bold text-slate-500">
                  {conta.categoria}
                </p>
              </div>

              <div className="lg:text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Valor
                </p>
                <p
                  className={`mt-2 text-2xl font-black ${
                    conta.tipo === "RECEBER" ? "text-blue-500" : "text-rose-500"
                  }`}
                >
                  {formatCurrency(conta.valor)}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Favorecido / Cliente
              </p>
              <p className="mt-2 text-sm font-black text-[#064e3b] uppercase">
                {conta.nomePrincipal}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Documento
              </p>
              <p className="mt-2 text-sm font-black text-[#064e3b] uppercase">
                {conta.documento}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Emissão
              </p>
              <p className="mt-2 text-sm font-black text-[#064e3b] uppercase">
                {formatDate(conta.dataEmissao)}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Vencimento
              </p>
              <p className="mt-2 text-sm font-black text-[#064e3b] uppercase">
                {formatDate(conta.dataVencimento)}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Centro de custo
              </p>
              <p className="mt-2 text-sm font-black text-[#064e3b] uppercase">
                {conta.centroCusto}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Forma de pagamento
              </p>
              <p className="mt-2 text-sm font-black text-[#064e3b] uppercase">
                {conta.formaPagamento}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
              Observações
            </p>
            <p className="text-sm font-bold text-slate-600 leading-relaxed">
              {conta.observacoes || "Sem observações registradas."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Contas() {
  const [role] = useState("ADMIN");
  const [usuarioLogado] = useState({ nome: "Administradora" });

  const [aba, setAba] = useState("TODAS");
  const [statusFiltro, setStatusFiltro] = useState("TODOS");
  const [busca, setBusca] = useState("");
  const [contaSelecionada, setContaSelecionada] = useState(null);

  const normalizedRole = String(role || "").toUpperCase();
  const isAdminFinanceiro = !["LOJA", "FABRICA"].includes(normalizedRole);
  const nomeUsuario = usuarioLogado?.nome || "Administradora";

  const contas = [
    {
      id: "PAG-1001",
      tipo: "PAGAR",
      descricao: "Fornecedor de espuma D33",
      categoria: "Matéria-prima",
      nomePrincipal: "Espumas Nordeste Ltda",
      documento: "NF-38491",
      dataEmissao: createRelativeDate(-5),
      dataVencimento: createRelativeDate(0),
      valor: 4200,
      status: "VENCE HOJE",
      centroCusto: "Fábrica",
      formaPagamento: "Transferência",
      observacoes: "Compra programada para produção da semana.",
    },
    {
      id: "PAG-1002",
      tipo: "PAGAR",
      descricao: "Conta de energia da fábrica",
      categoria: "Infraestrutura",
      nomePrincipal: "Concessionária Energia",
      documento: "BOL-23811",
      dataEmissao: createRelativeDate(-10),
      dataVencimento: createRelativeDate(2),
      valor: 2360,
      status: "PREVISTO",
      centroCusto: "Fábrica",
      formaPagamento: "Boleto",
      observacoes: "Vencimento normal do mês.",
    },
    {
      id: "PAG-1003",
      tipo: "PAGAR",
      descricao: "Parcela de maquinário",
      categoria: "Imobilizado",
      nomePrincipal: "Tecno Máquinas",
      documento: "CTR-0921",
      dataEmissao: createRelativeDate(-15),
      dataVencimento: createRelativeDate(-1),
      valor: 5900,
      status: "VENCIDO",
      centroCusto: "Administrativo",
      formaPagamento: "Boleto",
      observacoes: "Necessita regularização imediata.",
    },
    {
      id: "PAG-1004",
      tipo: "PAGAR",
      descricao: "Frete terceirizado",
      categoria: "Logística",
      nomePrincipal: "Entrega Rápida Transportes",
      documento: "NF-77813",
      dataEmissao: createRelativeDate(-3),
      dataVencimento: createRelativeDate(4),
      valor: 1850,
      status: "PREVISTO",
      centroCusto: "Operação",
      formaPagamento: "PIX",
      observacoes: "Referente a entregas da semana.",
    },
    {
      id: "REC-2001",
      tipo: "RECEBER",
      descricao: "Pedido • Sofá Retrátil 3 Lugares",
      categoria: "Receita de vendas",
      nomePrincipal: "Mariana Souza",
      documento: "PED-1001",
      dataEmissao: createRelativeDate(-2),
      dataVencimento: createRelativeDate(0),
      valor: 3200,
      status: "VENCE HOJE",
      centroCusto: "Loja",
      formaPagamento: "Cartão de Crédito",
      observacoes: "Última parcela do pedido.",
    },
    {
      id: "REC-2002",
      tipo: "RECEBER",
      descricao: "Pedido • Poltrona Eames",
      categoria: "Recebíveis",
      nomePrincipal: "João Pedro",
      documento: "PED-1002",
      dataEmissao: createRelativeDate(-4),
      dataVencimento: createRelativeDate(3),
      valor: 2150,
      status: "PREVISTO",
      centroCusto: "Loja",
      formaPagamento: "PIX",
      observacoes: "Pagamento confirmado para os próximos dias.",
    },
    {
      id: "REC-2003",
      tipo: "RECEBER",
      descricao: "Pedido corporativo • Maca Estética",
      categoria: "Recebíveis",
      nomePrincipal: "Clínica Bella Face",
      documento: "PED-8840",
      dataEmissao: createRelativeDate(-8),
      dataVencimento: createRelativeDate(-2),
      valor: 1980,
      status: "VENCIDO",
      centroCusto: "Comercial",
      formaPagamento: "Transferência",
      observacoes: "Necessário follow-up com financeiro do cliente.",
    },
    {
      id: "REC-2004",
      tipo: "RECEBER",
      descricao: "Sinal • Sofá sob medida",
      categoria: "Receita de vendas",
      nomePrincipal: "Tatiane Rocha",
      documento: "PED-1018",
      dataEmissao: createRelativeDate(-1),
      dataVencimento: createRelativeDate(5),
      valor: 2500,
      status: "PREVISTO",
      centroCusto: "Loja",
      formaPagamento: "PIX",
      observacoes: "Entrada inicial para início de produção.",
    },
    {
      id: "PAG-1005",
      tipo: "PAGAR",
      descricao: "Campanha de mídia paga",
      categoria: "Marketing",
      nomePrincipal: "Meta Ads",
      documento: "ADS-3401",
      dataEmissao: createRelativeDate(-6),
      dataVencimento: createRelativeDate(-3),
      valor: 860,
      status: "PAGO",
      centroCusto: "Administrativo",
      formaPagamento: "Cartão corporativo",
      observacoes: "Pagamento já compensado.",
    },
    {
      id: "REC-2005",
      tipo: "RECEBER",
      descricao: "Venda showroom • Escadinha Pet",
      categoria: "Receita de vendas",
      nomePrincipal: "Fernanda Alves",
      documento: "VEN-1008",
      dataEmissao: createRelativeDate(-3),
      dataVencimento: createRelativeDate(-3),
      valor: 420,
      status: "RECEBIDO",
      centroCusto: "Loja",
      formaPagamento: "Cartão de Débito",
      observacoes: "Venda de pronta entrega.",
    },
  ];

  const contasFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return contas.filter((conta) => {
      const matchAba = aba === "TODAS" ? true : conta.tipo === aba;

      const matchStatus =
        statusFiltro === "TODOS"
          ? true
          : String(conta.status || "").toUpperCase() === statusFiltro;

      const matchBusca =
        !termo ||
        String(conta.id || "").toLowerCase().includes(termo) ||
        String(conta.descricao || "").toLowerCase().includes(termo) ||
        String(conta.nomePrincipal || "").toLowerCase().includes(termo) ||
        String(conta.categoria || "").toLowerCase().includes(termo) ||
        String(conta.centroCusto || "").toLowerCase().includes(termo);

      return matchAba && matchStatus && matchBusca;
    });
  }, [contas, aba, statusFiltro, busca]);

  const resumo = useMemo(() => {
    const pagarTotal = contas
      .filter((conta) => conta.tipo === "PAGAR")
      .reduce((acc, conta) => acc + toNumber(conta.valor), 0);

    const receberTotal = contas
      .filter((conta) => conta.tipo === "RECEBER")
      .reduce((acc, conta) => acc + toNumber(conta.valor), 0);

    const vencidas = contas.filter((conta) =>
      String(conta.status || "").toUpperCase().includes("VENCIDO")
    ).length;

    const venceHoje = contas.filter(
      (conta) => String(conta.status || "").toUpperCase() === "VENCE HOJE"
    ).length;

    const saldoProjetado = receberTotal - pagarTotal;

    return {
      pagarTotal,
      receberTotal,
      vencidas,
      venceHoje,
      saldoProjetado,
    };
  }, [contas]);

  const proximasContas = useMemo(() => {
    return [...contas]
      .filter((conta) =>
        ["VENCE HOJE", "PREVISTO", "VENCIDO"].includes(
          String(conta.status || "").toUpperCase()
        )
      )
      .sort((a, b) => new Date(a.dataVencimento) - new Date(b.dataVencimento))
      .slice(0, 6);
  }, [contas]);

  const resumoCentroCusto = useMemo(() => {
    const mapa = {};

    contas.forEach((conta) => {
      const key = conta.centroCusto;

      if (!mapa[key]) {
        mapa[key] = {
          nome: key,
          pagar: 0,
          receber: 0,
        };
      }

      if (conta.tipo === "PAGAR") {
        mapa[key].pagar += toNumber(conta.valor);
      } else {
        mapa[key].receber += toNumber(conta.valor);
      }
    });

    return Object.values(mapa)
      .map((item) => ({
        ...item,
        saldo: item.receber - item.pagar,
      }))
      .sort((a, b) => Math.abs(b.saldo) - Math.abs(a.saldo));
  }, [contas]);

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
            O módulo de contas a pagar e receber é visível apenas para a administração.
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
            Contas a Pagar e Receber <span className="text-slate-300">|</span>
            <span className="text-[#b49157]">Diretoria</span>
          </h1>

          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">
            gestão financeira de obrigações, recebíveis, vencimentos e carteira
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

      {/* KPIS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
        <MetricCard
          icon={ArrowDownCircle}
          label="Total a Pagar"
          value={formatCurrency(resumo.pagarTotal)}
          hint="obrigações registradas"
          valueClassName="text-rose-500"
        />

        <MetricCard
          icon={ArrowUpCircle}
          label="Total a Receber"
          value={formatCurrency(resumo.receberTotal)}
          hint="recebíveis registrados"
          valueClassName="text-blue-500"
        />

        <MetricCard
          icon={AlertTriangle}
          label="Vencidas"
          value={resumo.vencidas}
          hint="exigem atenção"
          valueClassName="text-rose-500"
          highlighted
        />

        <MetricCard
          icon={Clock3}
          label="Vence Hoje"
          value={resumo.venceHoje}
          hint="prioridade do dia"
          valueClassName="text-[#b49157]"
        />

        <MetricCard
          icon={Wallet}
          label="Saldo Projetado"
          value={formatCurrency(resumo.saldoProjetado)}
          hint="receber menos pagar"
          valueClassName={resumo.saldoProjetado >= 0 ? "text-emerald-600" : "text-rose-500"}
        />
      </div>

      {/* FILTROS */}
      <SectionCard
        title="Filtro de Contas"
        icon={Filter}
        extra={
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            carteira financeira
          </span>
        }
      >
        <div className="flex gap-3 flex-wrap mb-4">
          <FilterButton active={aba === "TODAS"} onClick={() => setAba("TODAS")}>
            Todas
          </FilterButton>

          <FilterButton active={aba === "PAGAR"} onClick={() => setAba("PAGAR")}>
            Contas a pagar
          </FilterButton>

          <FilterButton active={aba === "RECEBER"} onClick={() => setAba("RECEBER")}>
            Contas a receber
          </FilterButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por ID, descrição, nome, categoria ou centro de custo..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-slate-700 outline-none focus:border-[#b49157]"
            />
          </div>

          <select
            value={statusFiltro}
            onChange={(e) => setStatusFiltro(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-sm font-black text-slate-700 outline-none focus:border-[#b49157]"
          >
            <option value="TODOS">Todos os status</option>
            <option value="VENCE HOJE">Vence hoje</option>
            <option value="PREVISTO">Previsto</option>
            <option value="VENCIDO">Vencido</option>
            <option value="PAGO">Pago</option>
            <option value="RECEBIDO">Recebido</option>
          </select>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4 flex-wrap">
          <span className="text-xs font-black uppercase text-slate-500">
            {contasFiltradas.length} conta(s) encontrada(s)
          </span>

          <span className="text-xs font-black uppercase text-[#064e3b]">
            monitoramento executivo da carteira
          </span>
        </div>
      </SectionCard>

      {/* CORPO */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8">
          <SectionCard
            title="Lista de Contas"
            icon={Receipt}
            extra={
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                análise detalhada
              </span>
            }
          >
            <div className="space-y-4">
              {contasFiltradas.length > 0 ? (
                contasFiltradas.map((conta) => (
                  <button
                    key={conta.id}
                    type="button"
                    onClick={() => setContaSelecionada(conta)}
                    className="w-full text-left rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors p-5"
                  >
                    <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            {conta.id}
                          </span>
                          <TypeBadge tipo={conta.tipo} />
                          <StatusBadge status={conta.status} />
                        </div>

                        <p className="mt-3 text-sm font-black text-[#064e3b] uppercase break-words">
                          {conta.descricao}
                        </p>

                        <p className="mt-1 text-xs font-bold text-slate-500 break-words">
                          {conta.nomePrincipal}
                        </p>

                        <div className="mt-3 flex gap-2 flex-wrap">
                          <span className="px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-black uppercase tracking-wide text-slate-500">
                            {conta.categoria}
                          </span>

                          <span className="px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-black uppercase tracking-wide text-slate-500">
                            {conta.centroCusto}
                          </span>

                          <span className="px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-black uppercase tracking-wide text-slate-500">
                            {conta.formaPagamento}
                          </span>
                        </div>
                      </div>

                      <div className="xl:text-right shrink-0">
                        <p
                          className={`text-lg font-black ${
                            conta.tipo === "RECEBER" ? "text-blue-500" : "text-rose-500"
                          }`}
                        >
                          {formatCurrency(conta.valor)}
                        </p>

                        <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                          vence em {formatDate(conta.dataVencimento)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                  <Receipt size={28} className="mx-auto mb-3 text-slate-300" />
                  <p className="text-xs font-black uppercase text-slate-400">
                    Nenhuma conta encontrada para os filtros aplicados
                  </p>
                </div>
              )}
            </div>
          </SectionCard>
        </div>

        <div className="xl:col-span-4 space-y-6">
          <SectionCard
            title="Próximos Vencimentos"
            icon={CalendarDays}
            extra={
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                agenda financeira
              </span>
            }
          >
            <div className="space-y-3">
              {proximasContas.map((conta) => (
                <button
                  key={conta.id}
                  type="button"
                  onClick={() => setContaSelecionada(conta)}
                  className="w-full text-left rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white transition-colors p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-black text-[#064e3b] uppercase break-words">
                        {conta.nomePrincipal}
                      </p>
                      <p className="mt-1 text-xs font-bold text-slate-500 break-words">
                        {conta.descricao}
                      </p>
                      <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {formatDate(conta.dataVencimento)}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <StatusBadge status={conta.status} />
                      <p
                        className={`mt-2 text-sm font-black ${
                          conta.tipo === "RECEBER" ? "text-blue-500" : "text-rose-500"
                        }`}
                      >
                        {formatCurrency(conta.valor)}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="Resumo por Centro de Custo"
            icon={BarChart3}
            extra={
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                consolidação
              </span>
            }
          >
            <div className="space-y-4">
              {resumoCentroCusto.map((item) => (
                <div
                  key={item.nome}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <p className="text-sm font-black text-[#064e3b] uppercase break-words">
                    {item.nome}
                  </p>

                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between items-center gap-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        A pagar
                      </span>
                      <span className="text-xs font-black text-rose-500">
                        {formatCurrency(item.pagar)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center gap-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        A receber
                      </span>
                      <span className="text-xs font-black text-blue-500">
                        {formatCurrency(item.receber)}
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
            </div>
          </SectionCard>

          <SectionCard title="Avisos Financeiros" icon={AlertTriangle}>
            <div className="space-y-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex items-start gap-3">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-xs font-bold text-slate-600">
                  O módulo consolida obrigações e recebíveis em uma única visão.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex items-start gap-3">
                <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs font-bold text-slate-600">
                  Contas vencidas precisam de regularização ou negociação imediata.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex items-start gap-3">
                <TrendingUp size={18} className="text-blue-500 shrink-0 mt-0.5" />
                <p className="text-xs font-bold text-slate-600">
                  Acompanhar recebíveis reduz pressão sobre o fluxo de caixa.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex items-start gap-3">
                <TrendingDown size={18} className="text-rose-500 shrink-0 mt-0.5" />
                <p className="text-xs font-bold text-slate-600">
                  Despesas de fábrica e operação concentram boa parte das saídas.
                </p>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      <ContaDrawer
        conta={contaSelecionada}
        onClose={() => setContaSelecionada(null)}
      />
    </div>
  );
}

export default Contas;