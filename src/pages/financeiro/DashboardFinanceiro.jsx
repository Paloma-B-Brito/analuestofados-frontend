import React, { useMemo, useState } from "react";
import {
  ShieldAlert,
  Crown,
  Wallet,
  Landmark,
  ArrowDownCircle,
  ArrowUpCircle,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  CalendarDays,
  BellRing,
  BadgeDollarSign,
  Receipt,
  Factory,
  Store,
  CreditCard,
  Percent,
  CircleDollarSign,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  FileBarChart,
  BarChart3,
  Target,
  Users,
  Truck,
} from "lucide-react"; 

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

function formatPercent(value) {
  return `${Number(value || 0).toFixed(1)}%`;
}

function getStatusClasses(status) {
  const normalized = String(status || "").toLowerCase();

  if (normalized.includes("vencido")) {
    return "bg-rose-50 text-rose-700 border-rose-200";
  }

  if (normalized.includes("hoje")) {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }

  if (normalized.includes("recebido") || normalized.includes("pago")) {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }

  if (normalized.includes("previsto")) {
    return "bg-blue-50 text-blue-700 border-blue-200";
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

function DashboardFinanceiro({
  role = "ADMIN",
  usuarioLogado = { nome: "Administradora" },
}) {
  const [periodo, setPeriodo] = useState("30D");

  const normalizedRole = String(role || "").toUpperCase();
  const isAdminFinanceiro = !["LOJA", "FABRICA"].includes(normalizedRole);

  const nomeUsuario = usuarioLogado?.nome || "Administradora";

  const fluxoPorPeriodo = {
    "7D": [
      { label: "Seg", entradas: 12400, saidas: 5800, saldo: 6600 },
      { label: "Ter", entradas: 9800, saidas: 6200, saldo: 3600 },
      { label: "Qua", entradas: 15400, saidas: 7300, saldo: 8100 },
      { label: "Qui", entradas: 11200, saidas: 6900, saldo: 4300 },
      { label: "Sex", entradas: 17800, saidas: 8400, saldo: 9400 },
      { label: "Sáb", entradas: 13200, saidas: 4900, saldo: 8300 },
      { label: "Dom", entradas: 6100, saidas: 2800, saldo: 3300 },
    ],
    "30D": [
      { label: "S1", entradas: 48200, saidas: 29800, saldo: 18400 },
      { label: "S2", entradas: 53300, saidas: 32100, saldo: 21200 },
      { label: "S3", entradas: 61500, saidas: 35500, saldo: 26000 },
      { label: "S4", entradas: 57200, saidas: 34400, saldo: 22800 },
    ],
    MES: [
      { label: "Sem 1", entradas: 48200, saidas: 29800, saldo: 18400 },
      { label: "Sem 2", entradas: 53300, saidas: 32100, saldo: 21200 },
      { label: "Sem 3", entradas: 61500, saidas: 35500, saldo: 26000 },
      { label: "Sem 4", entradas: 57200, saidas: 34400, saldo: 22800 },
      { label: "Extra", entradas: 8600, saidas: 4900, saldo: 3700 },
    ],
  };

  const contasPagar = [
    {
      id: "PAG-101",
      descricao: "Fornecedor de espuma D33",
      categoria: "Matéria-prima",
      vencimento: "2026-02-28",
      valor: 4200,
      status: "Vence hoje",
    },
    {
      id: "PAG-102",
      descricao: "Frete terceirizado",
      categoria: "Logística",
      vencimento: "2026-03-01",
      valor: 1850,
      status: "Previsto",
    },
    {
      id: "PAG-103",
      descricao: "Energia da fábrica",
      categoria: "Infraestrutura",
      vencimento: "2026-03-02",
      valor: 2360,
      status: "Previsto",
    },
    {
      id: "PAG-104",
      descricao: "Parcela de maquinário",
      categoria: "Imobilizado",
      vencimento: "2026-02-26",
      valor: 5900,
      status: "Vencido",
    },
  ];

  const contasReceber = [
    {
      id: "REC-301",
      cliente: "Mariana Souza",
      referencia: "Sofá Retrátil 3 Lugares",
      vencimento: "2026-02-28",
      valor: 3200,
      status: "Vence hoje",
    },
    {
      id: "REC-302",
      cliente: "João Pedro",
      referencia: "Poltrona Eames",
      vencimento: "2026-03-01",
      valor: 2150,
      status: "Previsto",
    },
    {
      id: "REC-303",
      cliente: "Clínica Bella Face",
      referencia: "Maca Estética",
      vencimento: "2026-03-02",
      valor: 1980,
      status: "Previsto",
    },
    {
      id: "REC-304",
      cliente: "Fernanda Alves",
      referencia: "Escadinha Pet",
      vencimento: "2026-02-26",
      valor: 420,
      status: "Recebido",
    },
  ];

  const rentabilidadeAreas = [
    {
      area: "Loja",
      receita: 286900,
      custo: 187400,
      margem: 34.7,
      icon: Store,
    },
    {
      area: "Fábrica",
      receita: 214300,
      custo: 162800,
      margem: 24.0,
      icon: Factory,
    },
    {
      area: "Serviços / Entregas",
      receita: 23800,
      custo: 12300,
      margem: 48.3,
      icon: Truck,
    },
  ];

  const despesasPrincipais = [
    { nome: "Matéria-prima", valor: 68400, percentual: 32 },
    { nome: "Folha de pagamento", valor: 52100, percentual: 24 },
    { nome: "Logística", valor: 18300, percentual: 9 },
    { nome: "Energia e estrutura", valor: 14900, percentual: 7 },
    { nome: "Marketing", valor: 8600, percentual: 4 },
  ];

  const recebimentosPorCanal = [
    { nome: "PIX", valor: 118200, percentual: 41 },
    { nome: "Cartão de Crédito", valor: 104600, percentual: 36 },
    { nome: "Cartão de Débito", valor: 26700, percentual: 9 },
    { nome: "Dinheiro", valor: 18900, percentual: 7 },
    { nome: "Boleto", valor: 18500, percentual: 7 },
  ];

  const alertasFinanceiros = [
    "1 conta importante está vencida e exige regularização imediata.",
    "O volume em cartão aumentou; revise taxas e conciliação bancária.",
    "A margem da fábrica está abaixo da margem da loja neste período.",
    "Há pedidos aguardando pagamento que podem afetar o fluxo dos próximos dias.",
  ];

  const metasFinanceiras = [
    { nome: "Meta de faturamento mensal", atual: 572300, alvo: 650000 },
    { nome: "Meta de caixa mínimo", atual: 142000, alvo: 160000 },
    { nome: "Meta de margem líquida", atual: 18.6, alvo: 22.0, percentual: true },
    { nome: "Meta de inadimplência máxima", atual: 3.8, alvo: 2.5, percentual: true, invertida: true },
  ];

  const fluxoAtual = useMemo(() => {
    return fluxoPorPeriodo[periodo] || fluxoPorPeriodo["30D"];
  }, [periodo]);

  const resumoExecutivo = useMemo(() => {
    const entradas = fluxoAtual.reduce((acc, item) => acc + item.entradas, 0);
    const saidas = fluxoAtual.reduce((acc, item) => acc + item.saidas, 0);
    const saldo = fluxoAtual.reduce((acc, item) => acc + item.saldo, 0);

    return {
      entradas,
      saidas,
      saldo,
      saldoCaixa: 142000,
      saldoBancos: 218500,
      aPagarHoje: 4200,
      aReceberHoje: 8500,
      faturamentoMes: 572300,
      lucroEstimado: 106400,
      margemLiquida: 18.6,
      inadimplencia: 3.8,
      ticketMedio: 3240,
      clientesAtivos: 148,
      custoFixo: 84600,
      custoVariavel: 143800,
    };
  }, [fluxoAtual]);

  const maiorBarraFluxo = useMemo(() => {
    return Math.max(...fluxoAtual.map((item) => Math.max(item.entradas, item.saidas, item.saldo)), 1);
  }, [fluxoAtual]);

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
            O dashboard financeiro é visível apenas para a administração.
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
            Diretoria <span className="text-slate-300">|</span>
            <span className="text-[#b49157]">Financeiro</span>
          </h1>

          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">
            visão estratégica de caixa, rentabilidade, obrigações e performance financeira
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
        title="Recorte de Análise"
        icon={CalendarDays}
        extra={
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            período financeiro
          </span>
        }
      >
        <div className="flex gap-3 flex-wrap">
          <PeriodButton active={periodo === "7D"} onClick={() => setPeriodo("7D")}>
            Últimos 7 dias
          </PeriodButton>

          <PeriodButton active={periodo === "30D"} onClick={() => setPeriodo("30D")}>
            Últimos 30 dias
          </PeriodButton>

          <PeriodButton active={periodo === "MES"} onClick={() => setPeriodo("MES")}>
            Mês Atual
          </PeriodButton>
        </div>
      </SectionCard>

      {/* CARDS PRINCIPAIS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard
          icon={Wallet}
          label="Saldo em Caixa"
          value={formatCurrency(resumoExecutivo.saldoCaixa)}
          hint="disponibilidade imediata"
          valueClassName="text-emerald-600"
          highlighted
        />

        <MetricCard
          icon={Landmark}
          label="Saldo em Bancos"
          value={formatCurrency(resumoExecutivo.saldoBancos)}
          hint="contas e aplicações"
          valueClassName="text-[#064e3b]"
        />

        <MetricCard
          icon={ArrowDownCircle}
          label="A Pagar Hoje"
          value={formatCurrency(resumoExecutivo.aPagarHoje)}
          hint="obrigações do dia"
          valueClassName="text-rose-500"
        />

        <MetricCard
          icon={ArrowUpCircle}
          label="A Receber Hoje"
          value={formatCurrency(resumoExecutivo.aReceberHoje)}
          hint="entradas previstas"
          valueClassName="text-blue-500"
        />
      </div>

      {/* CARDS SECUNDÁRIOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard
          icon={BadgeDollarSign}
          label="Faturamento do Mês"
          value={formatCurrency(resumoExecutivo.faturamentoMes)}
          hint="receita consolidada"
          valueClassName="text-[#064e3b]"
        />

        <MetricCard
          icon={PiggyBank}
          label="Lucro Estimado"
          value={formatCurrency(resumoExecutivo.lucroEstimado)}
          hint="resultado operacional"
          valueClassName="text-emerald-600"
        />

        <MetricCard
          icon={Percent}
          label="Margem Líquida"
          value={formatPercent(resumoExecutivo.margemLiquida)}
          hint="eficiência financeira"
          valueClassName="text-[#b49157]"
        />

        <MetricCard
          icon={TrendingDown}
          label="Inadimplência"
          value={formatPercent(resumoExecutivo.inadimplencia)}
          hint="clientes em atraso"
          valueClassName="text-rose-500"
        />
      </div>

      {/* FLUXO + ALERTAS */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <SectionCard
            title="Fluxo de Caixa"
            icon={BarChart3}
            extra={
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                entradas x saídas
              </span>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Entradas
                </p>
                <p className="mt-2 text-2xl font-black text-emerald-600">
                  {formatCurrency(resumoExecutivo.entradas)}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Saídas
                </p>
                <p className="mt-2 text-2xl font-black text-rose-500">
                  {formatCurrency(resumoExecutivo.saidas)}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Saldo do período
                </p>
                <p className="mt-2 text-2xl font-black text-[#064e3b]">
                  {formatCurrency(resumoExecutivo.saldo)}
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {fluxoAtual.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <span className="text-xs font-black uppercase text-slate-600">
                      {item.label}
                    </span>

                    <div className="flex gap-4 flex-wrap text-[10px] font-black uppercase tracking-widest">
                      <span className="text-emerald-600">
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
                        className="h-full bg-emerald-500 rounded-full"
                        style={{
                          width: `${(item.entradas / maiorBarraFluxo) * 100}%`,
                        }}
                      />
                    </div>

                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-rose-500 rounded-full"
                        style={{
                          width: `${(item.saidas / maiorBarraFluxo) * 100}%`,
                        }}
                      />
                    </div>

                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#064e3b] rounded-full"
                        style={{
                          width: `${(item.saldo / maiorBarraFluxo) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="xl:col-span-1">
          <SectionCard title="Alertas Financeiros" icon={BellRing}>
            <div className="space-y-3">
              {alertasFinanceiros.map((alerta, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex items-start gap-3"
                >
                  <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs font-bold text-slate-600 leading-relaxed">
                    {alerta}
                  </p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      {/* CONTAS A PAGAR / RECEBER */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <SectionCard
          title="Contas a Pagar"
          icon={TrendingDown}
          extra={
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              obrigações próximas
            </span>
          }
        >
          <div className="space-y-4">
            {contasPagar.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-white p-4"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {item.id}
                      </span>
                      <StatusBadge status={item.status} />
                    </div>

                    <p className="mt-3 text-sm font-black text-[#064e3b] uppercase break-words">
                      {item.descricao}
                    </p>

                    <p className="mt-1 text-xs font-bold text-slate-500">
                      {item.categoria}
                    </p>

                    <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      vence em {formatDate(item.vencimento)}
                    </p>
                  </div>

                  <div className="lg:text-right shrink-0">
                    <p className="text-lg font-black text-rose-500">
                      {formatCurrency(item.valor)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Contas a Receber"
          icon={TrendingUp}
          extra={
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              entradas previstas
            </span>
          }
        >
          <div className="space-y-4">
            {contasReceber.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-white p-4"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {item.id}
                      </span>
                      <StatusBadge status={item.status} />
                    </div>

                    <p className="mt-3 text-sm font-black text-[#064e3b] uppercase break-words">
                      {item.cliente}
                    </p>

                    <p className="mt-1 text-xs font-bold text-slate-500">
                      {item.referencia}
                    </p>

                    <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      vence em {formatDate(item.vencimento)}
                    </p>
                  </div>

                  <div className="lg:text-right shrink-0">
                    <p className="text-lg font-black text-blue-500">
                      {formatCurrency(item.valor)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* RENTABILIDADE + DESPESAS */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <SectionCard
            title="Rentabilidade por Área"
            icon={FileBarChart}
            extra={
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                performance operacional
              </span>
            }
          >
            <div className="space-y-4">
              {rentabilidadeAreas.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.area}
                    className="rounded-2xl border border-slate-200 bg-white p-5"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[#b49157] shrink-0">
                          <Icon size={18} />
                        </div>

                        <div>
                          <p className="text-sm font-black text-[#064e3b] uppercase">
                            {item.area}
                          </p>
                          <p className="mt-1 text-xs font-bold text-slate-500">
                            Receita {formatCurrency(item.receita)} • Custo {formatCurrency(item.custo)}
                          </p>
                        </div>
                      </div>

                      <div className="lg:text-right shrink-0">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Margem
                        </p>
                        <p className="mt-2 text-xl font-black text-[#b49157]">
                          {formatPercent(item.margem)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#064e3b] rounded-full"
                        style={{ width: `${Math.min(item.margem, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </div>

        <div className="xl:col-span-1">
          <SectionCard title="Principais Despesas" icon={Receipt}>
            <div className="space-y-4">
              {despesasPrincipais.map((item) => (
                <div key={item.nome}>
                  <div className="flex justify-between items-center gap-4 mb-2">
                    <span className="text-xs font-black text-slate-700 uppercase">
                      {item.nome}
                    </span>
                    <span className="text-xs font-black text-slate-400">
                      {formatCurrency(item.valor)}
                    </span>
                  </div>

                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-500 rounded-full"
                      style={{ width: `${item.percentual}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      {/* CANAIS + METAS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <SectionCard
          title="Formas de Recebimento"
          icon={CreditCard}
          extra={
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              composição das entradas
            </span>
          }
        >
          <div className="space-y-4">
            {recebimentosPorCanal.map((item) => (
              <div key={item.nome}>
                <div className="flex justify-between items-center gap-4 mb-2">
                  <span className="text-xs font-black text-slate-700 uppercase">
                    {item.nome}
                  </span>
                  <div className="text-right">
                    <span className="block text-xs font-black text-slate-400">
                      {item.percentual}%
                    </span>
                    <span className="block text-xs font-bold text-[#064e3b]">
                      {formatCurrency(item.valor)}
                    </span>
                  </div>
                </div>

                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#b49157] rounded-full"
                    style={{ width: `${item.percentual}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Metas Financeiras"
          icon={Target}
          extra={
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              acompanhamento estratégico
            </span>
          }
        >
          <div className="space-y-5">
            {metasFinanceiras.map((meta) => {
              const progresso = meta.invertida
                ? Math.min((meta.alvo / Math.max(meta.atual, 0.0001)) * 100, 100)
                : Math.min((meta.atual / Math.max(meta.alvo, 0.0001)) * 100, 100);

              return (
                <div key={meta.nome}>
                  <div className="flex justify-between items-center gap-4 mb-2">
                    <span className="text-xs font-black text-slate-700 uppercase">
                      {meta.nome}
                    </span>
                    <span className="text-xs font-black text-slate-400">
                      {meta.percentual
                        ? `${meta.atual}${meta.percentual ? "%" : ""} / ${meta.alvo}%`
                        : `${formatCurrency(meta.atual)} / ${formatCurrency(meta.alvo)}`}
                    </span>
                  </div>

                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        progresso >= 100 ? "bg-emerald-500" : "bg-[#064e3b]"
                      }`}
                      style={{ width: `${progresso}%` }}
                    />
                  </div>

                  <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {progresso.toFixed(0)}% do objetivo
                  </p>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>

      {/* RESUMO EXECUTIVO */}
      <SectionCard
        title="Resumo Executivo"
        icon={Users}
        extra={
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            diretoria financeira
          </span>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Ticket médio
            </p>
            <p className="mt-2 text-2xl font-black text-[#064e3b]">
              {formatCurrency(resumoExecutivo.ticketMedio)}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Clientes ativos
            </p>
            <p className="mt-2 text-2xl font-black text-[#064e3b]">
              {resumoExecutivo.clientesAtivos}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Custo fixo
            </p>
            <p className="mt-2 text-2xl font-black text-rose-500">
              {formatCurrency(resumoExecutivo.custoFixo)}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Custo variável
            </p>
            <p className="mt-2 text-2xl font-black text-[#b49157]">
              {formatCurrency(resumoExecutivo.custoVariavel)}
            </p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

export default DashboardFinanceiro;