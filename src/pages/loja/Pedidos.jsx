import React, { useEffect, useMemo, useState } from "react";
import "../../App.css";
import {
  ShoppingBag,
  Search,
  Filter,
  PackageCheck,
  Clock3,
  BadgeDollarSign,
  Truck,
  ClipboardList,
  AlertTriangle,
  CheckCircle2,
  Crown,
  ShieldCheck,
  UserRound,
  CalendarDays,
  Phone,
  MessageSquare,
  Receipt,
  X,
  Wallet,
  Boxes,
  Store,
  ArrowUpRight,
  FileText,
} from "lucide-react";

/**
 * @file Pedidos.jsx
 * @description Gestão de Pedidos da Loja
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

function getRoleConfig(role) {
  const normalizedRole = String(role || "").toUpperCase();
  const isLoja = normalizedRole === "LOJA";
  const isAdmin = normalizedRole !== "LOJA";

  return {
    normalizedRole,
    isLoja,
    isAdmin,
    permissions: {
      canSeeAllOrders: isAdmin,
      canSeeOnlyOwnOrders: isLoja,
      canCreateOrder: true,
      canUpdateOwnOrders: true,
      canChangeAnyOrderStatus: isAdmin,
      canCancelOrder: isAdmin,
      canSeeFinancialSummary: isAdmin,
      canSeeOperationalSummary: true,
      canSeeDeliveryAlerts: true,
    },
  };
}

function getStatusStyles(status) {
  const normalized = String(status || "").toLowerCase();

  if (normalized.includes("aguardando pagamento")) {
    return "bg-rose-50 text-rose-700 border-rose-200";
  }

  if (normalized.includes("em produção") || normalized.includes("em producao")) {
    return "bg-blue-50 text-blue-700 border-blue-200";
  }

  if (normalized.includes("pronto")) {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }

  if (normalized.includes("entrega")) {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }

  if (normalized.includes("cancelado")) {
    return "bg-slate-100 text-slate-600 border-slate-200";
  }

  return "bg-slate-50 text-slate-700 border-slate-200";
}

function getPriorityStyles(priority) {
  const normalized = String(priority || "").toLowerCase();

  if (normalized.includes("alta")) {
    return "bg-rose-50 text-rose-700 border-rose-200";
  }

  if (normalized.includes("média") || normalized.includes("media")) {
    return "bg-amber-50 text-amber-700 border-amber-200";
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
      className={`px-2 py-1 rounded-lg border text-[10px] font-black uppercase tracking-wide ${getStatusStyles(
        status
      )}`}
    >
      {status}
    </span>
  );
}

function PriorityBadge({ priority }) {
  return (
    <span
      className={`px-2 py-1 rounded-lg border text-[10px] font-black uppercase tracking-wide ${getPriorityStyles(
        priority
      )}`}
    >
      {priority}
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

function PedidoDrawer({
  pedido,
  onClose,
  isAdmin,
  canUpdateOwnOrders,
  canChangeAnyOrderStatus,
  canCancelOrder,
}) {
  if (!pedido) return null;

  const podeAtualizar =
    isAdmin || canUpdateOwnOrders;

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
              <ClipboardList size={18} className="text-[#b49157]" />
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#b49157]">
                Order Workspace
              </p>
            </div>

            <h3 className="mt-2 text-2xl font-black uppercase tracking-tight">
              Pedido {pedido.id}
            </h3>

            <p className="mt-2 text-xs font-bold uppercase tracking-widest text-white/70">
              Gestão detalhada do pedido de venda
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
                  <StatusBadge status={pedido.status} />
                  <PriorityBadge priority={pedido.prioridade} />
                </div>

                <p className="mt-3 text-xl font-black text-[#064e3b] uppercase break-words">
                  {pedido.clienteNome}
                </p>

                <p className="mt-2 text-sm font-bold text-slate-500 break-words">
                  {pedido.produto}
                </p>
              </div>

              <div className="lg:text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Valor do pedido
                </p>
                <p className="mt-2 text-2xl font-black text-rose-500">
                  {formatCurrency(pedido.valor)}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Vendedor responsável
              </p>
              <p className="mt-2 text-sm font-black text-[#064e3b] uppercase">
                {pedido.vendedor}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Origem
              </p>
              <p className="mt-2 text-sm font-black text-[#064e3b] uppercase">
                {pedido.origem}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Data da venda
              </p>
              <p className="mt-2 text-sm font-black text-[#064e3b] uppercase">
                {formatDateTime(pedido.dataVenda)}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Entrega prevista
              </p>
              <p className="mt-2 text-sm font-black text-[#064e3b] uppercase">
                {formatDate(pedido.dataEntrega)}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Pagamento
              </p>
              <p className="mt-2 text-sm font-black text-[#064e3b] uppercase">
                {pedido.pagamento}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Contato
              </p>
              <p className="mt-2 text-sm font-black text-[#064e3b] break-words">
                {pedido.telefone}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Observações do pedido
            </p>
            <p className="mt-3 text-sm font-bold text-slate-600 leading-relaxed">
              {pedido.observacoes || "Sem observações registradas."}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
              Ações disponíveis
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ActionButton
                icon={FileText}
                title="Atualizar Pedido"
                subtitle="Editar informações e acompanhamento"
                onClick={() => {}}
                disabled={!podeAtualizar}
              />

              <ActionButton
                icon={Truck}
                title="Atualizar Status"
                subtitle="Mover etapa do pedido"
                onClick={() => {}}
                disabled={!canChangeAnyOrderStatus && !isAdmin}
              />

              <ActionButton
                icon={Wallet}
                title="Registrar Pagamento"
                subtitle="Atualizar condição financeira"
                onClick={() => {}}
                disabled={!podeAtualizar}
              />

              <ActionButton
                icon={AlertTriangle}
                title="Cancelar Pedido"
                subtitle="Ação restrita"
                onClick={() => {}}
                disabled={!canCancelOrder}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Pedidos({ role = "LOJA", usuarioLogado = { nome: "Usuária" } }) {
  const roleConfig = useMemo(() => getRoleConfig(role), [role]);
  const { isAdmin, isLoja, permissions } = roleConfig;

  const [carregando, setCarregando] = useState(true);
  const [pedidos, setPedidos] = useState([]);
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);

  const [busca, setBusca] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("TODOS");
  const [origemFiltro, setOrigemFiltro] = useState("TODAS");

  const nomeUsuario =
    usuarioLogado?.nome || (isLoja ? "Vendedora" : "Administradora");

  async function carregarPedidos() {
    setCarregando(true);

    try {
      const response = await fetch("http://localhost:8080/api/pedidos/loja");

      if (!response.ok) {
        throw new Error("Falha ao carregar pedidos.");
      }

      const dados = await response.json();

      setPedidos(
        Array.isArray(dados) && dados.length > 0
          ? dados
          : criarPedidosMockados()
      );
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error);
      setPedidos(criarPedidosMockados());
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarPedidos();
  }, []);

  function criarPedidosMockados() {
    return [
      {
        id: "PED-1001",
        clienteNome: "Mariana Souza",
        produto: "Sofá Retrátil 3 Lugares",
        valor: 4890,
        status: "AGUARDANDO PAGAMENTO",
        prioridade: "Alta",
        vendedor: "Ana Paula",
        origem: "WhatsApp",
        pagamento: "Cartão de Crédito",
        telefone: "(83) 99999-1111",
        dataVenda: new Date().toISOString(),
        dataEntrega: new Date(Date.now() + 4 * 86400000).toISOString(),
        observacoes: "Cliente pediu confirmação da entrega um dia antes.",
      },
      {
        id: "PED-1002",
        clienteNome: "João Pedro",
        produto: "Poltrona Eames",
        valor: 2150,
        status: "EM PRODUÇÃO",
        prioridade: "Média",
        vendedor: "Carlos A.",
        origem: "Instagram",
        pagamento: "PIX",
        telefone: "(83) 99999-2222",
        dataVenda: new Date(Date.now() - 86400000).toISOString(),
        dataEntrega: new Date(Date.now() + 8 * 86400000).toISOString(),
        observacoes: "Cliente aceitou tecido alternativo.",
      },
      {
        id: "PED-1003",
        clienteNome: "Fernanda Alves",
        produto: "Escadinha Pet",
        valor: 420,
        status: "PRONTO PARA ENTREGA",
        prioridade: "Baixa",
        vendedor: "Ana Paula",
        origem: "Loja Física",
        pagamento: "Dinheiro",
        telefone: "(83) 99999-3333",
        dataVenda: new Date(Date.now() - 2 * 86400000).toISOString(),
        dataEntrega: new Date(Date.now() + 1 * 86400000).toISOString(),
        observacoes: "Retirada preferencial pela manhã.",
      },
      {
        id: "PED-1004",
        clienteNome: "Cláudia Lima",
        produto: "Maca Estética Fixa",
        valor: 1980,
        status: "EM ROTA DE ENTREGA",
        prioridade: "Alta",
        vendedor: "Patrícia R.",
        origem: "Indicação",
        pagamento: "Boleto",
        telefone: "(83) 99999-4444",
        dataVenda: new Date(Date.now() - 3 * 86400000).toISOString(),
        dataEntrega: new Date(Date.now()).toISOString(),
        observacoes: "Endereço comercial, entregar até 17h.",
      },
      {
        id: "PED-1005",
        clienteNome: "Roberto Nunes",
        produto: "Sofá 2 Lugares",
        valor: 3190,
        status: "CANCELADO",
        prioridade: "Baixa",
        vendedor: "Carlos A.",
        origem: "WhatsApp",
        pagamento: "Cartão",
        telefone: "(83) 99999-5555",
        dataVenda: new Date(Date.now() - 5 * 86400000).toISOString(),
        dataEntrega: new Date(Date.now() + 10 * 86400000).toISOString(),
        observacoes: "Cliente desistiu por prazo.",
      },
      {
        id: "PED-1006",
        clienteNome: "Tatiane Rocha",
        produto: "Poltrona Eames Premium",
        valor: 2590,
        status: "AGUARDANDO PAGAMENTO",
        prioridade: "Alta",
        vendedor: "Ana Paula",
        origem: "WhatsApp",
        pagamento: "PIX",
        telefone: "(83) 98888-1111",
        dataVenda: new Date(Date.now() - 36000000).toISOString(),
        dataEntrega: new Date(Date.now() + 6 * 86400000).toISOString(),
        observacoes: "Cliente pediu retorno ainda hoje.",
      },
    ];
  }

  const pedidosVisiveis = useMemo(() => {
    if (permissions.canSeeAllOrders) return pedidos;

    if (permissions.canSeeOnlyOwnOrders && usuarioLogado?.nome) {
      const meusPedidos = pedidos.filter(
        (pedido) =>
          String(pedido.vendedor || "").toLowerCase() ===
          String(usuarioLogado.nome || "").toLowerCase()
      );

      return meusPedidos.length > 0 ? meusPedidos : pedidos;
    }

    return pedidos;
  }, [pedidos, permissions, usuarioLogado]);

  const pedidosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return pedidosVisiveis.filter((pedido) => {
      const matchBusca =
        !termo ||
        String(pedido.id || "").toLowerCase().includes(termo) ||
        String(pedido.clienteNome || "").toLowerCase().includes(termo) ||
        String(pedido.produto || "").toLowerCase().includes(termo) ||
        String(pedido.vendedor || "").toLowerCase().includes(termo) ||
        String(pedido.telefone || "").toLowerCase().includes(termo);

      const matchStatus =
        statusFiltro === "TODOS"
          ? true
          : String(pedido.status || "").toUpperCase() === statusFiltro;

      const matchOrigem =
        origemFiltro === "TODAS"
          ? true
          : String(pedido.origem || "").toUpperCase() === origemFiltro;

      return matchBusca && matchStatus && matchOrigem;
    });
  }, [pedidosVisiveis, busca, statusFiltro, origemFiltro]);

  const indicadores = useMemo(() => {
    const total = pedidosVisiveis.length;
    const emAberto = pedidosVisiveis.filter((pedido) =>
      ["AGUARDANDO PAGAMENTO", "EM PRODUÇÃO", "PRONTO PARA ENTREGA", "EM ROTA DE ENTREGA"].includes(
        String(pedido.status || "").toUpperCase()
      )
    ).length;

    const aguardandoPagamento = pedidosVisiveis.filter(
      (pedido) =>
        String(pedido.status || "").toUpperCase() === "AGUARDANDO PAGAMENTO"
    ).length;

    const entregasHoje = pedidosVisiveis.filter((pedido) => {
      const hoje = new Date();
      const entrega = new Date(pedido.dataEntrega);

      return (
        entrega.getDate() === hoje.getDate() &&
        entrega.getMonth() === hoje.getMonth() &&
        entrega.getFullYear() === hoje.getFullYear()
      );
    }).length;

    const totalFinanceiro = pedidosVisiveis.reduce(
      (acc, pedido) => acc + Number(pedido.valor || 0),
      0
    );

    return {
      total,
      emAberto,
      aguardandoPagamento,
      entregasHoje,
      totalFinanceiro,
    };
  }, [pedidosVisiveis]);

  const alertasEntrega = useMemo(() => {
    return pedidosVisiveis
      .filter((pedido) =>
        ["PRONTO PARA ENTREGA", "EM ROTA DE ENTREGA"].includes(
          String(pedido.status || "").toUpperCase()
        )
      )
      .slice(0, 4);
  }, [pedidosVisiveis]);

  return (
    <div className="animate-fade-in p-6 pb-10 space-y-6 bg-[#f8f9f5] min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-[#064e3b] uppercase flex items-center gap-2">
            <ShoppingBag className="text-[#b49157]" />
            Pedidos de Venda <span className="text-slate-300">|</span>
            <span className="text-[#b49157] italic font-light">Loja</span>
          </h1>

          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">
            Gestão operacional dos pedidos da loja, status, entrega e acompanhamento
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

      {/* AÇÕES */}
      <SectionCard
        title="Ações Rápidas de Pedidos"
        icon={ClipboardList}
        extra={
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            operação da loja
          </span>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <ActionButton
            icon={ShoppingBag}
            title="Novo Pedido"
            subtitle="Cadastrar pedido de venda"
            onClick={() => {}}
            accent
            disabled={!permissions.canCreateOrder}
          />

          <ActionButton
            icon={PackageCheck}
            title="Atualizar Status"
            subtitle="Acompanhar andamento dos pedidos"
            onClick={() => {}}
            disabled={!permissions.canUpdateOwnOrders && !isAdmin}
          />

          <ActionButton
            icon={Truck}
            title="Programar Entrega"
            subtitle="Organizar prazos e saídas"
            onClick={() => {}}
          />

          <ActionButton
            icon={Receipt}
            title="Resumo Financeiro"
            subtitle="Pedidos e total em carteira"
            onClick={() => {}}
            disabled={!permissions.canSeeFinancialSummary}
          />
        </div>
      </SectionCard>

      {/* KPIS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard
          icon={ClipboardList}
          label="Pedidos"
          value={indicadores.total}
          hint="total visível no módulo"
          valueClassName="text-[#064e3b]"
        />

        <MetricCard
          icon={Clock3}
          label="Em Aberto"
          value={indicadores.emAberto}
          hint="pedidos em andamento"
          valueClassName="text-[#b49157]"
        />

        <MetricCard
          icon={AlertTriangle}
          label="Aguardando Pagamento"
          value={indicadores.aguardandoPagamento}
          hint="pedidos com pendência"
          valueClassName="text-rose-500"
          highlighted
        />

        <MetricCard
          icon={Truck}
          label="Entregas Hoje"
          value={indicadores.entregasHoje}
          hint="saídas previstas para hoje"
          valueClassName="text-[#064e3b]"
        />
      </div>

      {/* FILTROS + RESUMO */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <SectionCard
            title="Filtros de Pedidos"
            icon={Filter}
          >
            <div className="grid grid-cols-1 md:grid-cols-[1fr_220px_220px] gap-4">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Buscar por pedido, cliente, produto, vendedor ou telefone..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-slate-700 outline-none focus:border-[#b49157]"
                />
              </div>

              <select
                value={statusFiltro}
                onChange={(e) => setStatusFiltro(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-sm font-black text-slate-700 outline-none focus:border-[#b49157]"
              >
                <option value="TODOS">Todos os status</option>
                <option value="AGUARDANDO PAGAMENTO">Aguardando pagamento</option>
                <option value="EM PRODUÇÃO">Em produção</option>
                <option value="PRONTO PARA ENTREGA">Pronto para entrega</option>
                <option value="EM ROTA DE ENTREGA">Em rota de entrega</option>
                <option value="CANCELADO">Cancelado</option>
              </select>

              <select
                value={origemFiltro}
                onChange={(e) => setOrigemFiltro(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-sm font-black text-slate-700 outline-none focus:border-[#b49157]"
              >
                <option value="TODAS">Todas as origens</option>
                <option value="WHATSAPP">WhatsApp</option>
                <option value="INSTAGRAM">Instagram</option>
                <option value="LOJA FÍSICA">Loja Física</option>
                <option value="INDICAÇÃO">Indicação</option>
              </select>
            </div>

            <div className="mt-4 flex items-center justify-between gap-4 flex-wrap">
              <span className="text-xs font-black uppercase text-slate-500">
                {pedidosFiltrados.length} pedido(s) encontrado(s)
              </span>

              {permissions.canSeeFinancialSummary ? (
                <span className="text-xs font-black uppercase text-[#064e3b]">
                  carteira total: {formatCurrency(indicadores.totalFinanceiro)}
                </span>
              ) : (
                <span className="text-xs font-black uppercase text-slate-400">
                  visão financeira restrita
                </span>
              )}
            </div>
          </SectionCard>
        </div>

        <div className="xl:col-span-1">
          <SectionCard title="Alertas de Entrega" icon={CalendarDays}>
            <div className="space-y-3">
              {alertasEntrega.length > 0 ? (
                alertasEntrega.map((pedido) => (
                  <div
                    key={pedido.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-black text-[#064e3b] uppercase break-words">
                          {pedido.clienteNome}
                        </p>
                        <p className="mt-1 text-xs font-bold text-slate-500 break-words">
                          {pedido.produto}
                        </p>
                        <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                          {formatDate(pedido.dataEntrega)}
                        </p>
                      </div>

                      <StatusBadge status={pedido.status} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                  <CheckCircle2 size={24} className="mx-auto mb-3 text-emerald-500" />
                  <p className="text-xs font-black uppercase text-slate-400">
                    Sem alertas de entrega no momento
                  </p>
                </div>
              )}
            </div>
          </SectionCard>
        </div>
      </div>

      {/* CORPO PRINCIPAL */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8">
          <SectionCard
            title="Lista de Pedidos"
            icon={ShoppingBag}
            extra={
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                gestão ativa
              </span>
            }
          >
            <div className="space-y-4">
              {pedidosFiltrados.length > 0 ? (
                pedidosFiltrados.map((pedido) => (
                  <button
                    key={pedido.id}
                    type="button"
                    onClick={() => setPedidoSelecionado(pedido)}
                    className="w-full text-left rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors p-5"
                  >
                    <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            {pedido.id}
                          </span>
                          <StatusBadge status={pedido.status} />
                          <PriorityBadge priority={pedido.prioridade} />
                        </div>

                        <p className="mt-3 text-sm font-black text-[#064e3b] uppercase break-words">
                          {pedido.clienteNome}
                        </p>

                        <p className="mt-1 text-xs font-bold text-slate-500 break-words">
                          {pedido.produto}
                        </p>

                        <div className="mt-3 flex gap-2 flex-wrap">
                          <span className="px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-black uppercase tracking-wide text-slate-500 flex items-center gap-1">
                            <UserRound size={12} />
                            {pedido.vendedor}
                          </span>

                          <span className="px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-black uppercase tracking-wide text-slate-500 flex items-center gap-1">
                            <Store size={12} />
                            {pedido.origem}
                          </span>

                          <span className="px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-black uppercase tracking-wide text-slate-500 flex items-center gap-1">
                            <Phone size={12} />
                            {pedido.telefone}
                          </span>
                        </div>
                      </div>

                      <div className="xl:text-right shrink-0">
                        <p className="text-lg font-black text-rose-500">
                          {formatCurrency(pedido.valor)}
                        </p>
                        <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                          entrega: {formatDate(pedido.dataEntrega)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                  <ShoppingBag size={28} className="mx-auto mb-3 text-slate-300" />
                  <p className="text-xs font-black uppercase text-slate-400">
                    Nenhum pedido encontrado para os filtros aplicados
                  </p>
                </div>
              )}
            </div>
          </SectionCard>
        </div>

        <div className="xl:col-span-4 space-y-6">
          <SectionCard title="Resumo Operacional" icon={Boxes}>
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Pedidos em produção
                </p>
                <p className="mt-2 text-2xl font-black text-[#064e3b]">
                  {
                    pedidosVisiveis.filter(
                      (pedido) =>
                        String(pedido.status || "").toUpperCase() === "EM PRODUÇÃO"
                    ).length
                  }
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Prontos para entrega
                </p>
                <p className="mt-2 text-2xl font-black text-[#b49157]">
                  {
                    pedidosVisiveis.filter(
                      (pedido) =>
                        String(pedido.status || "").toUpperCase() === "PRONTO PARA ENTREGA"
                    ).length
                  }
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Em rota hoje
                </p>
                <p className="mt-2 text-2xl font-black text-rose-500">
                  {
                    pedidosVisiveis.filter(
                      (pedido) =>
                        String(pedido.status || "").toUpperCase() === "EM ROTA DE ENTREGA"
                    ).length
                  }
                </p>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Avisos do Módulo" icon={AlertTriangle}>
            <div className="space-y-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex items-start gap-3">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-xs font-bold text-slate-600">
                  Os pedidos podem ser acompanhados por status, entrega e vendedor.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex items-start gap-3">
                <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs font-bold text-slate-600">
                  Pedidos aguardando pagamento precisam de atenção antes de seguir fluxo.
                </p>
              </div>

              {permissions.canSeeFinancialSummary ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex items-start gap-3">
                  <BadgeDollarSign size={18} className="text-[#b49157] shrink-0 mt-0.5" />
                  <p className="text-xs font-bold text-slate-600">
                    A visão admin acompanha também o valor total em carteira.
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex items-start gap-3">
                  <MessageSquare size={18} className="text-[#b49157] shrink-0 mt-0.5" />
                  <p className="text-xs font-bold text-slate-600">
                    A visão da loja foca no acompanhamento operacional dos próprios pedidos.
                  </p>
                </div>
              )}
            </div>
          </SectionCard>
        </div>
      </div>

      <PedidoDrawer
        pedido={pedidoSelecionado}
        onClose={() => setPedidoSelecionado(null)}
        isAdmin={isAdmin}
        canUpdateOwnOrders={permissions.canUpdateOwnOrders}
        canChangeAnyOrderStatus={permissions.canChangeAnyOrderStatus}
        canCancelOrder={permissions.canCancelOrder}
      />
    </div>
  );
}

export default Pedidos;