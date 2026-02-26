import React, { useMemo } from "react";
import {
  Store,
  ShoppingBag,
  Trophy,
  PackageCheck,
  Target,
  AlertTriangle,
  Crown,
  ShieldCheck,
  Wallet,
  Truck,
  Users,
  ClipboardList,
  TrendingUp,
  Search,
  Clock3,
  Receipt,
  CheckCircle2,
  XCircle,
  BadgeDollarSign,
  UserRound,
  Lock,
  Phone,
  Sofa,
  Boxes,
  BellRing,
  ArrowUpRight,
  CalendarDays,
  FileText,
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

function formatPercent(value) {
  return `${Number(value || 0).toFixed(0)}%`;
}

function getRoleConfig(role) {
  const normalizedRole = String(role || "").toUpperCase();

  const isLoja = normalizedRole === "LOJA";
  const isAdmin = normalizedRole !== "LOJA";

  return {
    normalizedRole,
    isLoja,
    isAdmin,

    // Permissões do módulo loja
    permissions: {
      canSeeFinancialCards: isAdmin,
      canSeeCommission: isLoja,
      canSeeStrategicPanel: isAdmin,
      canSeeTeamRanking: true,
      canSeeRecentOrders: true,
      canSeeClientFollowUp: true,
      canSeeQuickActions: true,
      canSeeAlerts: true,
      canSeeDeliveryBoard: true,
      canSeeMarginAndTicket: isAdmin,
      canSeeTeamGoal: isAdmin,
      canSeeMyGoal: isLoja,
      canRegisterSale: true,
      canCreateBudget: true,
      canManageDiscounts: isAdmin,
      canViewFullFinance: isAdmin,
      canViewAllStorePerformance: isAdmin,
      canViewMyPerformanceOnly: isLoja,
    },
  };
}

function getStatusClasses(status) {
  const normalized = String(status || "").toLowerCase();

  if (normalized.includes("pagamento")) {
    return "bg-rose-50 text-rose-700 border-rose-200";
  }

  if (normalized.includes("entrega")) {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }

  if (normalized.includes("produção") || normalized.includes("producao")) {
    return "bg-blue-50 text-blue-700 border-blue-200";
  }

  if (normalized.includes("retirada") || normalized.includes("concluído") || normalized.includes("concluido")) {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }

  return "bg-slate-50 text-slate-700 border-slate-200";
}

/* ==========================================================================
   COMPONENTES MENORES
   ========================================================================== */

function HeaderBadge({ icon: Icon, label, value }) {
  return (
    <div className="px-4 py-3 rounded-xl bg-white border border-slate-200 shadow-sm min-w-[150px]">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
        {label}
      </p>
      <div className="mt-1 flex items-center gap-2">
        <Icon size={14} className="text-[#b49157]" />
        <p className="text-sm font-black text-[#064e3b] uppercase">{value}</p>
      </div>
    </div>
  );
}

function CardMetrica({
  icon: Icon,
  titulo,
  valor,
  subtitulo,
  valorClassName = "text-[#064e3b]",
  iconBgClassName = "bg-slate-50",
  destaque = false,
}) {
  return (
    <div
      className={`bg-white p-6 rounded-2xl border shadow-sm ${
        destaque ? "border-[#b49157]/30" : "border-slate-100"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {titulo}
          </p>
          <p className={`mt-3 text-3xl font-black break-words ${valorClassName}`}>
            {valor}
          </p>
          {subtitulo ? (
            <p className="mt-2 text-xs font-bold text-slate-400 uppercase">
              {subtitulo}
            </p>
          ) : null}
        </div>

        <div
          className={`p-3 rounded-xl border border-slate-100 text-[#b49157] shrink-0 ${iconBgClassName}`}
        >
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

function SectionCard({ titulo, icon: Icon, extra, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 min-w-0">
          <Icon size={18} className="text-[#b49157] shrink-0" />
          <h3 className="font-black text-[#064e3b] uppercase text-sm tracking-wide break-words">
            {titulo}
          </h3>
        </div>

        {extra ? <div className="shrink-0">{extra}</div> : null}
      </div>

      <div className="p-6">{children}</div>
    </div>
  );
}

function ActionButton({
  icon: Icon,
  title,
  subtitle,
  allowed = true,
  accent = false,
}) {
  return (
    <button
      type="button"
      disabled={!allowed}
      className={`w-full rounded-2xl border p-4 text-left transition-all ${
        allowed
          ? accent
            ? "bg-[#064e3b] text-white border-[#064e3b] hover:bg-[#08634b]"
            : "bg-white border-slate-200 hover:bg-slate-50"
          : "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Icon
              size={18}
              className={allowed ? (accent ? "text-white" : "text-[#b49157]") : "text-slate-400"}
            />
            <p
              className={`text-xs font-black uppercase tracking-widest ${
                allowed ? (accent ? "text-white" : "text-[#064e3b]") : "text-slate-400"
              }`}
            >
              {title}
            </p>
          </div>

          <p
            className={`mt-2 text-[11px] font-bold ${
              allowed ? (accent ? "text-white/80" : "text-slate-500") : "text-slate-400"
            }`}
          >
            {subtitle}
          </p>
        </div>

        {!allowed ? <Lock size={16} className="text-slate-400 shrink-0" /> : null}
      </div>
    </button>
  );
}

function ProgressBar({ value, colorClass = "bg-[#064e3b]" }) {
  const safeValue = Math.min(Math.max(Number(value || 0), 0), 100);

  return (
    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all ${colorClass}`}
        style={{ width: `${safeValue}%` }}
      />
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

function EmptyPermissionMessage({ text }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
      <Lock size={24} className="mx-auto mb-3 text-slate-300" />
      <p className="text-xs font-black uppercase text-slate-400">{text}</p>
    </div>
  );
}

/* ==========================================================================
   COMPONENTE PRINCIPAL
   ========================================================================== */

function DashboardLoja({ role, usuarioLogado }) {
  const roleConfig = useMemo(() => getRoleConfig(role), [role]);
  const { permissions, isLoja, isAdmin } = roleConfig;

  const nomeUsuario = usuarioLogado?.nome || (isLoja ? "Vendedora" : "Administradora");

  /* ------------------------------------------------------------------------
     DADOS MOCKADOS
     ------------------------------------------------------------------------ */

  const dados = {
    vendasHoje: 18450,
    pedidosPendentes: 3,
    melhorVendedor: "Carlos A.",
    atendimentosHoje: 14,
    orcamentosAbertos: 6,
    metaDiaLoja: 25000,
    realizadoDiaLoja: 18450,
    metaDiaMinha: 8000,
    realizadoDiaMinha: 5120,
    faturamentoMes: 286900,
    ticketMedio: 3240,
    conversao: 38,
    clientesNovosMes: 17,
    entregasHoje: 2,
    comissaoPrevista: 420,
    lucroEstimadoMes: 68400,
    descontosLiberadosHoje: 4,
    pedidosFechadosHoje: 5,
    followUpsAbertos: 7,
  };

  const pedidosRecentes = [
    {
      id: "PED-1024",
      cliente: "Mariana Souza",
      produto: "Sofá Retrátil 3 Lugares",
      valor: 4890,
      status: "Separando Entrega",
      vendedor: "Carlos A.",
      origem: "Loja Física",
    },
    {
      id: "PED-1025",
      cliente: "João Pedro",
      produto: "Poltrona Eames",
      valor: 2150,
      status: "Aguardando Pagamento",
      vendedor: "Juliana M.",
      origem: "Instagram",
    },
    {
      id: "PED-1026",
      cliente: "Cláudia Lima",
      produto: "Maca Estética Fixa",
      valor: 1980,
      status: "Produção",
      vendedor: "Patrícia R.",
      origem: "Indicação",
    },
    {
      id: "PED-1027",
      cliente: "Fernanda Alves",
      produto: "Escadinha Pet",
      valor: 420,
      status: "Pronto para Retirada",
      vendedor: "Carlos A.",
      origem: "WhatsApp",
    },
  ];

  const rankingSemanal = [
    {
      nome: "Carlos A.",
      vendas: 32400,
      pedidos: 9,
      meta: 88,
      destaque: true,
    },
    {
      nome: "Juliana M.",
      vendas: 27800,
      pedidos: 7,
      meta: 76,
      destaque: false,
    },
    {
      nome: "Patrícia R.",
      vendas: 19600,
      pedidos: 5,
      meta: 61,
      destaque: false,
    },
  ];

  const alertasOperacionais = [
    {
      titulo: "Pagamentos pendentes",
      descricao: "2 pedidos precisam confirmar pagamento ainda hoje.",
      prioridade: "Alta",
    },
    {
      titulo: "Entregas do período da tarde",
      descricao: "1 entrega precisa sair até 15h para cumprir rota.",
      prioridade: "Média",
    },
    {
      titulo: "Orçamentos sem retorno",
      descricao: "3 clientes estão sem contato há mais de 48 horas.",
      prioridade: "Alta",
    },
  ];

  const entregasDoDia = [
    {
      cliente: "Marcos Silva",
      produto: "Sofá Retrátil 3 Lugares",
      horario: "10:30",
      status: "Confirmada",
      endereco: "Centro",
    },
    {
      cliente: "Elaine Costa",
      produto: "Poltrona Eames",
      horario: "15:00",
      status: "Aguardando Saída",
      endereco: "Bairro Novo",
    },
  ];

  const clientesEmFollowUp = [
    {
      nome: "Tatiane Rocha",
      interesse: "Sofá 2 Lugares",
      ultimoContato: "Ontem",
      canal: "WhatsApp",
      prioridade: "Quente",
    },
    {
      nome: "Roberto Nunes",
      interesse: "Maca Estética",
      ultimoContato: "2 dias",
      canal: "Instagram",
      prioridade: "Média",
    },
    {
      nome: "Camila Freire",
      interesse: "Poltrona Eames",
      ultimoContato: "Hoje",
      canal: "Loja Física",
      prioridade: "Quente",
    },
  ];

  const produtosMaisVendidos = [
    { nome: "Sofá Retrátil 3 Lugares", percentual: 78 },
    { nome: "Poltrona Eames", percentual: 58 },
    { nome: "Maca Estética Fixa", percentual: 43 },
    { nome: "Escadinha Pet", percentual: 31 },
  ];

  const acoesRapidas = [
    {
      icon: Receipt,
      title: "Registrar Venda",
      subtitle: "Lançar pedido e pagamento",
      allowed: permissions.canRegisterSale,
      accent: true,
    },
    {
      icon: FileText,
      title: "Criar Orçamento",
      subtitle: "Montar proposta para cliente",
      allowed: permissions.canCreateBudget,
      accent: false,
    },
    {
      icon: BadgeDollarSign,
      title: "Liberar Desconto",
      subtitle: "Permissão gerencial de preço",
      allowed: permissions.canManageDiscounts,
      accent: false,
    },
    {
      icon: Wallet,
      title: "Ver Financeiro da Loja",
      subtitle: "Receitas, metas e indicadores",
      allowed: permissions.canViewFullFinance,
      accent: false,
    },
  ];

  const progressoMetaLoja = Math.min(
    (dados.realizadoDiaLoja / dados.metaDiaLoja) * 100,
    100
  );

  const progressoMetaMinha = Math.min(
    (dados.realizadoDiaMinha / dados.metaDiaMinha) * 100,
    100
  );

  /* ------------------------------------------------------------------------
     RENDER
     ------------------------------------------------------------------------ */

  return (
    <div className="animate-fade-in space-y-6 pb-10">
      {/* HEADER */}
      <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-[#064e3b] uppercase flex items-center gap-2">
            <Store className="text-[#b49157]" />
            Dashboard <span className="text-slate-300">|</span>
            <span className="text-rose-500">Loja</span>
          </h1>

          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">
            Acompanhamento comercial, pedidos, clientes, metas e operação
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <HeaderBadge
            icon={UserRound}
            label="Usuária logada"
            value={nomeUsuario}
          />

          <HeaderBadge
            icon={isAdmin ? Crown : ShieldCheck}
            label="Perfil"
            value={isAdmin ? "Admin / Dona" : "Loja"}
          />

          <HeaderBadge
            icon={BellRing}
            label="Pendências"
            value={`${dados.followUpsAbertos + dados.pedidosPendentes}`}
          />
        </div>
      </div>

      {/* AÇÕES RÁPIDAS */}
      {permissions.canSeeQuickActions && (
        <SectionCard
          titulo="Ações Rápidas do Módulo Loja"
          icon={ArrowUpRight}
          extra={
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              com restrição por perfil
            </span>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {acoesRapidas.map((action) => (
              <ActionButton
                key={action.title}
                icon={action.icon}
                title={action.title}
                subtitle={action.subtitle}
                allowed={action.allowed}
                accent={action.accent}
              />
            ))}
          </div>
        </SectionCard>
      )}

      {/* CARDS PRINCIPAIS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <CardMetrica
          icon={ShoppingBag}
          titulo="Vendas Hoje"
          valor={formatCurrency(dados.vendasHoje)}
          subtitulo="movimento comercial do dia"
          valorClassName="text-rose-500"
          destaque
        />

        <CardMetrica
          icon={PackageCheck}
          titulo="Pedidos Pendentes"
          valor={dados.pedidosPendentes}
          subtitulo="pedidos aguardando ação"
          valorClassName="text-[#b49157]"
        />

        <CardMetrica
          icon={ClipboardList}
          titulo="Orçamentos Abertos"
          valor={dados.orcamentosAbertos}
          subtitulo="clientes em negociação"
          valorClassName="text-[#064e3b]"
        />

        <CardMetrica
          icon={Trophy}
          titulo="Melhor Vendedor"
          valor={dados.melhorVendedor}
          subtitulo="desempenho da semana"
          valorClassName="text-[#064e3b]"
        />
      </div>

      {/* META + ALERTAS */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <SectionCard
            titulo={permissions.canSeeTeamGoal ? "Meta Comercial da Loja" : "Minha Meta do Dia"}
            icon={Target}
          >
            {permissions.canSeeTeamGoal ? (
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Realizado
                    </p>
                    <p className="text-3xl font-black text-[#064e3b]">
                      {formatCurrency(dados.realizadoDiaLoja)}
                    </p>
                  </div>

                  <div className="text-left md:text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Meta
                    </p>
                    <p className="text-xl font-black text-slate-700">
                      {formatCurrency(dados.metaDiaLoja)}
                    </p>
                  </div>
                </div>

                <ProgressBar value={progressoMetaLoja} colorClass="bg-[#064e3b]" />

                <div className="flex justify-between items-center gap-4 flex-wrap">
                  <span className="text-xs font-black uppercase text-slate-500">
                    {formatPercent(progressoMetaLoja)} da meta concluída
                  </span>
                  <span className="text-xs font-bold uppercase text-slate-400">
                    visão geral da loja
                  </span>
                </div>
              </div>
            ) : permissions.canSeeMyGoal ? (
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Meu realizado
                    </p>
                    <p className="text-3xl font-black text-[#064e3b]">
                      {formatCurrency(dados.realizadoDiaMinha)}
                    </p>
                  </div>

                  <div className="text-left md:text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Minha meta
                    </p>
                    <p className="text-xl font-black text-slate-700">
                      {formatCurrency(dados.metaDiaMinha)}
                    </p>
                  </div>
                </div>

                <ProgressBar value={progressoMetaMinha} colorClass="bg-[#b49157]" />

                <div className="flex justify-between items-center gap-4 flex-wrap">
                  <span className="text-xs font-black uppercase text-slate-500">
                    {formatPercent(progressoMetaMinha)} da meta concluída
                  </span>
                  <span className="text-xs font-bold uppercase text-slate-400">
                    foco individual
                  </span>
                </div>
              </div>
            ) : (
              <EmptyPermissionMessage text="Meta indisponível para este perfil" />
            )}
          </SectionCard>
        </div>

        <div className="xl:col-span-1">
          <SectionCard titulo="Alertas da Loja" icon={AlertTriangle}>
            {permissions.canSeeAlerts ? (
              <div className="space-y-3">
                {alertasOperacionais.map((alerta) => (
                  <div
                    key={alerta.titulo}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-black text-[#064e3b] uppercase">
                          {alerta.titulo}
                        </p>
                        <p className="mt-1 text-xs font-bold text-slate-500">
                          {alerta.descricao}
                        </p>
                      </div>

                      <span className="text-[10px] font-black uppercase tracking-widest text-rose-500 shrink-0">
                        {alerta.prioridade}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyPermissionMessage text="Sem acesso aos alertas operacionais" />
            )}
          </SectionCard>
        </div>
      </div>

      {/* CORPO PRINCIPAL */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7 space-y-6">
          <SectionCard titulo="Pedidos Recentes" icon={Receipt}>
            {permissions.canSeeRecentOrders ? (
              <div className="space-y-3">
                {pedidosRecentes.map((pedido) => (
                  <div
                    key={pedido.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            {pedido.id}
                          </span>
                          <StatusBadge status={pedido.status} />
                        </div>

                        <h4 className="mt-2 text-sm font-black text-[#064e3b] uppercase break-words">
                          {pedido.cliente}
                        </h4>

                        <p className="mt-1 text-xs font-bold text-slate-500 break-words">
                          {pedido.produto}
                        </p>

                        <div className="mt-2 flex gap-2 flex-wrap">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Vendedor: {pedido.vendedor}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                            •
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Origem: {pedido.origem}
                          </span>
                        </div>
                      </div>

                      <div className="text-left lg:text-right shrink-0">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Valor
                        </p>
                        <p className="text-lg font-black text-rose-500">
                          {formatCurrency(pedido.valor)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyPermissionMessage text="Sem permissão para visualizar pedidos" />
            )}
          </SectionCard>

          <SectionCard titulo="Clientes em Follow-up" icon={Phone}>
            {permissions.canSeeClientFollowUp ? (
              <div className="space-y-3">
                {clientesEmFollowUp.map((cliente) => (
                  <div
                    key={cliente.nome}
                    className="rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <p className="text-sm font-black text-[#064e3b] uppercase">
                          {cliente.nome}
                        </p>
                        <p className="mt-1 text-xs font-bold text-slate-500">
                          Interesse: {cliente.interesse}
                        </p>
                        <div className="mt-2 flex gap-2 flex-wrap">
                          <span className="px-2 py-1 rounded-lg bg-slate-100 text-[10px] font-black uppercase text-slate-500">
                            Último contato: {cliente.ultimoContato}
                          </span>
                          <span className="px-2 py-1 rounded-lg bg-slate-100 text-[10px] font-black uppercase text-slate-500">
                            Canal: {cliente.canal}
                          </span>
                        </div>
                      </div>

                      <div className="text-left md:text-right">
                        <span
                          className={`px-2 py-1 rounded-lg border text-[10px] font-black uppercase tracking-wide ${
                            cliente.prioridade === "Quente"
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {cliente.prioridade}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyPermissionMessage text="Sem acesso ao follow-up de clientes" />
            )}
          </SectionCard>

          <SectionCard titulo="Produtos Mais Vendidos" icon={TrendingUp}>
            <div className="space-y-4">
              {produtosMaisVendidos.map((produto) => (
                <div key={produto.nome}>
                  <div className="flex justify-between items-center gap-4 mb-2">
                    <span className="text-xs font-black text-slate-700 uppercase">
                      {produto.nome}
                    </span>
                    <span className="text-xs font-black text-slate-400">
                      {produto.percentual}%
                    </span>
                  </div>

                  <ProgressBar value={produto.percentual} colorClass="bg-[#b49157]" />
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="xl:col-span-5 space-y-6">
          <SectionCard titulo="Ranking de Vendas da Semana" icon={Trophy}>
            {permissions.canSeeTeamRanking ? (
              <div className="space-y-3">
                {rankingSemanal.map((item, index) => (
                  <div
                    key={item.nome}
                    className={`rounded-2xl border p-4 ${
                      item.destaque
                        ? "border-[#b49157]/40 bg-[#b49157]/10"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          {index + 1}º lugar
                        </p>
                        <p className="mt-1 text-sm font-black text-[#064e3b] uppercase break-words">
                          {item.nome}
                        </p>
                        <p className="mt-1 text-[11px] font-bold text-slate-500">
                          {item.pedidos} pedidos fechados
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-lg font-black text-rose-500">
                          {formatCurrency(item.vendas)}
                        </p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
                          Meta: {formatPercent(item.meta)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyPermissionMessage text="Sem acesso ao ranking semanal" />
            )}
          </SectionCard>

          <SectionCard titulo="Entregas do Dia" icon={Truck}>
            {permissions.canSeeDeliveryBoard ? (
              <div className="space-y-3">
                {entregasDoDia.map((entrega) => (
                  <div
                    key={`${entrega.cliente}-${entrega.horario}`}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-black text-[#064e3b] uppercase break-words">
                          {entrega.cliente}
                        </p>
                        <p className="mt-1 text-xs font-bold text-slate-500 break-words">
                          {entrega.produto}
                        </p>

                        <div className="mt-2 flex gap-2 flex-wrap">
                          <span className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-[10px] font-black uppercase text-slate-500 flex items-center gap-1">
                            <CalendarDays size={12} />
                            {entrega.horario}
                          </span>

                          <span className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-[10px] font-black uppercase text-slate-500">
                            {entrega.endereco}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0">
                        <StatusBadge status={entrega.status} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyPermissionMessage text="Sem acesso ao quadro de entregas" />
            )}
          </SectionCard>

          {isLoja && (
            <SectionCard titulo="Painel da Vendedora" icon={UserRound}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Atendimentos Hoje
                  </p>
                  <p className="mt-2 text-2xl font-black text-[#064e3b]">
                    {dados.atendimentosHoje}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Comissão Prevista
                  </p>
                  <p className="mt-2 text-2xl font-black text-rose-500">
                    {formatCurrency(dados.comissaoPrevista)}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Pedidos Fechados Hoje
                  </p>
                  <p className="mt-2 text-2xl font-black text-[#b49157]">
                    {dados.pedidosFechadosHoje}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Follow-ups Pendentes
                  </p>
                  <p className="mt-2 text-2xl font-black text-[#064e3b]">
                    {dados.followUpsAbertos}
                  </p>
                </div>
              </div>
            </SectionCard>
          )}

          {isAdmin && (
            <SectionCard titulo="Painel Gerencial da Loja" icon={Wallet}>
              {permissions.canSeeStrategicPanel ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Faturamento do Mês
                    </p>
                    <p className="mt-2 text-2xl font-black text-[#064e3b]">
                      {formatCurrency(dados.faturamentoMes)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Ticket Médio
                    </p>
                    <p className="mt-2 text-2xl font-black text-rose-500">
                      {formatCurrency(dados.ticketMedio)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Conversão
                    </p>
                    <p className="mt-2 text-2xl font-black text-[#b49157]">
                      {formatPercent(dados.conversao)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Clientes Novos no Mês
                    </p>
                    <p className="mt-2 text-2xl font-black text-[#064e3b]">
                      {dados.clientesNovosMes}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Lucro Estimado do Mês
                    </p>
                    <p className="mt-2 text-2xl font-black text-emerald-600">
                      {formatCurrency(dados.lucroEstimadoMes)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Descontos Liberados Hoje
                    </p>
                    <p className="mt-2 text-2xl font-black text-[#b49157]">
                      {dados.descontosLiberadosHoje}
                    </p>
                  </div>
                </div>
              ) : (
                <EmptyPermissionMessage text="Sem acesso ao painel gerencial" />
              )}
            </SectionCard>
          )}
        </div>
      </div>

      {/* RESUMO FINAL DE ACESSO */}
      <SectionCard titulo="Resumo de Acesso por Perfil" icon={ShieldCheck}>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-black uppercase text-[#064e3b] mb-4">
              Recursos liberados para este perfil
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                <CheckCircle2 size={16} className="text-emerald-600" />
                Dashboard operacional da loja
              </div>

              <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                <CheckCircle2 size={16} className="text-emerald-600" />
                Pedidos recentes
              </div>

              <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                <CheckCircle2 size={16} className="text-emerald-600" />
                Ranking semanal
              </div>

              <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                <CheckCircle2 size={16} className="text-emerald-600" />
                Follow-up de clientes
              </div>

              {isAdmin ? (
                <>
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    Indicadores financeiros da loja
                  </div>

                  <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    Painel gerencial completo
                  </div>

                  <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    Liberação de desconto
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    Comissão prevista
                  </div>

                  <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    Meta individual
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-black uppercase text-rose-500 mb-4">
              Recursos restritos
            </p>

            <div className="space-y-3">
              {!isAdmin ? (
                <>
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                    <XCircle size={16} className="text-rose-500" />
                    Financeiro completo da loja
                  </div>

                  <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                    <XCircle size={16} className="text-rose-500" />
                    Lucro e visão gerencial
                  </div>

                  <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                    <XCircle size={16} className="text-rose-500" />
                    Liberação de descontos estratégicos
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                    <Clock3 size={16} className="text-[#b49157]" />
                    Nenhuma restrição principal neste dashboard
                  </div>

                  <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                    <Search size={16} className="text-[#b49157]" />
                    Acompanhar equipe e operação em tempo real
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

export default DashboardLoja;