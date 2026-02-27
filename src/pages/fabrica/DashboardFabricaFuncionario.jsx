/**
 * @file DashboardFabricaFuncionario.jsx
 * @description Dashboard Operacional da Fábrica - Uso da Equipe
 * @author © 2026 Rickman Brown • Software Engineering
 */

import React, { useMemo, useState } from "react";
import "../../App.css";
import {
  Factory,
  Package,
  ClipboardList,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Plus,
  Send,
  Boxes,
  Hammer,
  Scissors,
  ShieldCheck,
  UserRound,
  BadgeCheck,
  ChevronRight,
  XCircle,
  Settings2,
  ClipboardPen,
} from "lucide-react";

/* ==========================================================================
   HELPERS
   ========================================================================== */

function createId(prefix = "ID") {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
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

function getPriorityClasses(priority) {
  const normalized = String(priority || "").toLowerCase();

  if (normalized.includes("alta")) {
    return "bg-rose-50 text-rose-700 border-rose-200";
  }

  if (normalized.includes("média") || normalized.includes("media")) {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }

  if (normalized.includes("baixa")) {
    return "bg-blue-50 text-blue-700 border-blue-200";
  }

  return "bg-slate-50 text-slate-700 border-slate-200";
}

function getOrderStatusClasses(status) {
  const normalized = String(status || "").toLowerCase();

  if (normalized.includes("concluída") || normalized.includes("concluida")) {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }

  if (normalized.includes("em andamento")) {
    return "bg-blue-50 text-blue-700 border-blue-200";
  }

  if (normalized.includes("aguardando")) {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }

  if (normalized.includes("pausada")) {
    return "bg-rose-50 text-rose-700 border-rose-200";
  }

  return "bg-slate-50 text-slate-700 border-slate-200";
}

function getSectorStatusClasses(status) {
  const normalized = String(status || "").toLowerCase();

  if (normalized.includes("crítico") || normalized.includes("critico")) {
    return "bg-rose-50 text-rose-700 border-rose-200";
  }

  if (normalized.includes("atenção") || normalized.includes("atencao")) {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }

  if (normalized.includes("normal")) {
    return "bg-blue-50 text-blue-700 border-blue-200";
  }

  if (normalized.includes("ok")) {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }

  return "bg-slate-50 text-slate-700 border-slate-200";
}

function Badge({ text, className = "" }) {
  return (
    <span
      className={`px-2 py-1 rounded-lg border text-[10px] font-black uppercase tracking-wide ${className}`}
    >
      {text}
    </span>
  );
}

function SectionCard({ title, icon: Icon, subtitle, children, extra }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Icon size={18} className="text-[#b49157] shrink-0" />
            <h3 className="font-black text-[#064e3b] uppercase text-sm tracking-wide break-words">
              {title}
            </h3>
          </div>
          {subtitle ? (
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-2">
              {subtitle}
            </p>
          ) : null}
        </div>

        {extra ? <div className="shrink-0">{extra}</div> : null}
      </div>

      <div className="p-5">{children}</div>
    </div>
  );
}

function MetricCard({
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
          <p className={`mt-3 text-3xl font-black break-words ${valueClassName}`}>
            {value}
          </p>
          {hint ? (
            <p className="mt-2 text-[11px] font-bold uppercase text-slate-400">
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

/* ==========================================================================
   DADOS INICIAIS
   ========================================================================== */

const setoresIniciais = [
  {
    id: "SET-01",
    nome: "Corte",
    fila: 8,
    finalizados: 12,
    status: "Normal",
    icon: <Scissors size={16} />,
  },
  {
    id: "SET-02",
    nome: "Costura",
    fila: 11,
    finalizados: 7,
    status: "Atenção",
    icon: <Factory size={16} />,
  },
  {
    id: "SET-03",
    nome: "Montagem",
    fila: 5,
    finalizados: 9,
    status: "Normal",
    icon: <Hammer size={16} />,
  },
  {
    id: "SET-04",
    nome: "Qualidade",
    fila: 3,
    finalizados: 14,
    status: "OK",
    icon: <ShieldCheck size={16} />,
  },
];

const ordensIniciais = [
  {
    id: "OP-2401",
    modelo: "Sofá Retrátil Slim",
    etapa: "Costura",
    prazo: "Hoje • 16:00",
    prioridade: "Alta",
    status: "Em andamento",
  },
  {
    id: "OP-2402",
    modelo: "Poltrona Charles Eames",
    etapa: "Montagem",
    prazo: "Hoje • 17:30",
    prioridade: "Média",
    status: "Aguardando",
  },
  {
    id: "OP-2403",
    modelo: "Puff Capitonê",
    etapa: "Corte",
    prazo: "Hoje • 18:00",
    prioridade: "Baixa",
    status: "Em andamento",
  },
  {
    id: "OP-2404",
    modelo: "Cadeira Jantar Lux",
    etapa: "Qualidade",
    prazo: "Amanhã • 09:00",
    prioridade: "Alta",
    status: "Aguardando",
  },
];

const checklistInicial = [
  { id: "CHK-01", label: "Conferir EPIs do turno", done: true },
  { id: "CHK-02", label: "Validar máquinas antes de iniciar", done: true },
  { id: "CHK-03", label: "Separar matéria-prima da OP atual", done: false },
  { id: "CHK-04", label: "Atualizar produção do turno", done: false },
  { id: "CHK-05", label: "Registrar perdas / retrabalho", done: false },
];

/* ==========================================================================
   COMPONENTE
   ========================================================================== */

function DashboardFabricaFuncionario({
  usuarioLogado = { nome: "Operador(a)" },
}) {
  const [setores, setSetores] = useState(setoresIniciais);
  const [ordens, setOrdens] = useState(ordensIniciais);
  const [checklist, setChecklist] = useState(checklistInicial);

  const [lancamentos, setLancamentos] = useState([
    {
      id: "PRD-101",
      modelo: "Sofá Retrátil Slim",
      setor: "Costura",
      quantidade: 4,
      responsavel: usuarioLogado?.nome || "Operador(a)",
      observacao: "Lote da manhã finalizado.",
      criadoEm: new Date().toISOString(),
    },
    {
      id: "PRD-102",
      modelo: "Puff Capitonê",
      setor: "Corte",
      quantidade: 6,
      responsavel: usuarioLogado?.nome || "Operador(a)",
      observacao: "Material liberado sem avarias.",
      criadoEm: new Date(Date.now() - 3600 * 1000).toISOString(),
    },
  ]);

  const [solicitacoes, setSolicitacoes] = useState([
    {
      id: "SOL-201",
      tipo: "Insumo",
      item: "Grampos 80/10",
      quantidade: "12 caixas",
      prioridade: "Alta",
      status: "Aberta",
      setor: "Montagem",
      criadoEm: new Date().toISOString(),
    },
    {
      id: "SOL-202",
      tipo: "Manutenção",
      item: "Máquina de costura 03",
      quantidade: "Revisão",
      prioridade: "Média",
      status: "Em análise",
      setor: "Costura",
      criadoEm: new Date(Date.now() - 7200 * 1000).toISOString(),
    },
  ]);

  const [ocorrencias, setOcorrencias] = useState([
    {
      id: "OCR-301",
      tipo: "Qualidade",
      descricao: "Peça com costura fora do padrão.",
      setor: "Qualidade",
      prioridade: "Média",
      status: "Aberta",
      criadoEm: new Date().toISOString(),
    },
  ]);

  const [formProducao, setFormProducao] = useState({
    modelo: "",
    setor: "Corte",
    quantidade: "",
    observacao: "",
  });

  const [formSolicitacao, setFormSolicitacao] = useState({
    tipo: "Insumo",
    item: "",
    quantidade: "",
    prioridade: "Média",
    setor: "Corte",
  });

  const [formOcorrencia, setFormOcorrencia] = useState({
    tipo: "Qualidade",
    descricao: "",
    setor: "Qualidade",
    prioridade: "Média",
  });

  const [mensagem, setMensagem] = useState("");

  const nomeUsuario = usuarioLogado?.nome || "Operador(a)";

  const totalProduzidoHoje = useMemo(() => {
    return lancamentos.reduce((acc, item) => acc + Number(item.quantidade || 0), 0);
  }, [lancamentos]);

  const ordensPendentes = useMemo(() => {
    return ordens.filter((ordem) => ordem.status !== "Concluída").length;
  }, [ordens]);

  const solicitacoesAbertas = useMemo(() => {
    return solicitacoes.filter((item) => item.status !== "Atendida").length;
  }, [solicitacoes]);

  const checklistConcluido = useMemo(() => {
    return checklist.filter((item) => item.done).length;
  }, [checklist]);

  function mostrarMensagem(texto) {
    setMensagem(texto);
    setTimeout(() => setMensagem(""), 2500);
  }

  function handleRegistrarProducao() {
    if (!formProducao.modelo.trim() || !Number(formProducao.quantidade)) {
      mostrarMensagem("Preencha modelo e quantidade para registrar.");
      return;
    }

    const novoLancamento = {
      id: createId("PRD"),
      modelo: formProducao.modelo.trim(),
      setor: formProducao.setor,
      quantidade: Number(formProducao.quantidade),
      responsavel: nomeUsuario,
      observacao: formProducao.observacao.trim(),
      criadoEm: new Date().toISOString(),
    };

    setLancamentos((prev) => [novoLancamento, ...prev]);

    setSetores((prev) =>
      prev.map((setor) =>
        setor.nome === formProducao.setor
          ? {
              ...setor,
              finalizados: setor.finalizados + Number(formProducao.quantidade),
              fila: Math.max(setor.fila - Number(formProducao.quantidade), 0),
            }
          : setor
      )
    );

    setFormProducao({
      modelo: "",
      setor: "Corte",
      quantidade: "",
      observacao: "",
    });

    mostrarMensagem("Produção registrada com sucesso.");
  }

  function handleAdicionarSolicitacao() {
    if (!formSolicitacao.item.trim() || !formSolicitacao.quantidade.trim()) {
      mostrarMensagem("Informe item e quantidade da solicitação.");
      return;
    }

    const novaSolicitacao = {
      id: createId("SOL"),
      tipo: formSolicitacao.tipo,
      item: formSolicitacao.item.trim(),
      quantidade: formSolicitacao.quantidade.trim(),
      prioridade: formSolicitacao.prioridade,
      status: "Aberta",
      setor: formSolicitacao.setor,
      criadoEm: new Date().toISOString(),
    };

    setSolicitacoes((prev) => [novaSolicitacao, ...prev]);

    setFormSolicitacao({
      tipo: "Insumo",
      item: "",
      quantidade: "",
      prioridade: "Média",
      setor: "Corte",
    });

    mostrarMensagem("Solicitação enviada para análise.");
  }

  function handleAdicionarOcorrencia() {
    if (!formOcorrencia.descricao.trim()) {
      mostrarMensagem("Descreva a ocorrência antes de salvar.");
      return;
    }

    const novaOcorrencia = {
      id: createId("OCR"),
      tipo: formOcorrencia.tipo,
      descricao: formOcorrencia.descricao.trim(),
      setor: formOcorrencia.setor,
      prioridade: formOcorrencia.prioridade,
      status: "Aberta",
      criadoEm: new Date().toISOString(),
    };

    setOcorrencias((prev) => [novaOcorrencia, ...prev]);

    setFormOcorrencia({
      tipo: "Qualidade",
      descricao: "",
      setor: "Qualidade",
      prioridade: "Média",
    });

    mostrarMensagem("Ocorrência registrada com sucesso.");
  }

  function atualizarStatusSetor(setorId, novoStatus) {
    setSetores((prev) =>
      prev.map((setor) =>
        setor.id === setorId ? { ...setor, status: novoStatus } : setor
      )
    );
  }

  function ajustarFila(setorId, delta) {
    setSetores((prev) =>
      prev.map((setor) =>
        setor.id === setorId
          ? { ...setor, fila: Math.max(setor.fila + delta, 0) }
          : setor
      )
    );
  }

  function marcarOrdemConcluida(ordemId) {
    setOrdens((prev) =>
      prev.map((ordem) =>
        ordem.id === ordemId ? { ...ordem, status: "Concluída" } : ordem
      )
    );

    mostrarMensagem("Ordem marcada como concluída.");
  }

  function toggleChecklist(itemId) {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, done: !item.done } : item
      )
    );
  }

  function atenderSolicitacao(solicitacaoId) {
    setSolicitacoes((prev) =>
      prev.map((item) =>
        item.id === solicitacaoId ? { ...item, status: "Atendida" } : item
      )
    );

    mostrarMensagem("Solicitação marcada como atendida.");
  }

  return (
    <div className="animate-fade-in space-y-6 pb-10">
      {/* HEADER */}
      <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-[#064e3b] uppercase tracking-tighter flex items-center gap-2">
            <Factory className="text-[#b49157]" />
            Fábrica <span className="text-slate-300">|</span> Operação
          </h1>

          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">
            painel operacional da equipe • registros • solicitações • acompanhamento do turno
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="px-4 py-3 rounded-xl bg-white border border-slate-200 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Operador(a)
            </p>
            <p className="mt-1 text-sm font-black text-[#064e3b] uppercase flex items-center gap-2">
              <UserRound size={14} className="text-[#b49157]" />
              {nomeUsuario}
            </p>
          </div>

          <div className="px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-100 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
              Turno
            </p>
            <p className="mt-1 text-sm font-black text-emerald-700 uppercase">
              Operação ativa
            </p>
          </div>
        </div>
      </div>

      {/* AVISO */}
      {mensagem ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 flex items-center gap-3">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <p className="text-xs font-black uppercase tracking-wide text-emerald-700">
            {mensagem}
          </p>
        </div>
      ) : null}

      {/* KPIS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          icon={BadgeCheck}
          label="Produzido hoje"
          value={totalProduzidoHoje}
          hint="lançamentos do turno"
          valueClassName="text-[#064e3b]"
        />

        <MetricCard
          icon={ClipboardList}
          label="Ordens pendentes"
          value={ordensPendentes}
          hint="ordens não concluídas"
          valueClassName="text-[#b49157]"
        />

        <MetricCard
          icon={Package}
          label="Solicitações abertas"
          value={solicitacoesAbertas}
          hint="insumos e manutenção"
          valueClassName="text-rose-500"
        />

        <MetricCard
          icon={ShieldCheck}
          label="Checklist"
          value={`${checklistConcluido}/${checklist.length}`}
          hint="itens do turno"
          valueClassName="text-emerald-600"
        />
      </div>

      {/* REGISTRO + ORDENS */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-6">
          <SectionCard
            title="Registrar Produção"
            icon={ClipboardPen}
            subtitle="lançamento rápido do que foi produzido"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                    Modelo
                  </label>
                  <input
                    type="text"
                    value={formProducao.modelo}
                    onChange={(e) =>
                      setFormProducao((prev) => ({ ...prev, modelo: e.target.value }))
                    }
                    placeholder="Ex: Sofá Retrátil Slim"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-[#b49157]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                    Setor
                  </label>
                  <select
                    value={formProducao.setor}
                    onChange={(e) =>
                      setFormProducao((prev) => ({ ...prev, setor: e.target.value }))
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-black text-slate-700 outline-none focus:border-[#b49157]"
                  >
                    <option>Corte</option>
                    <option>Costura</option>
                    <option>Montagem</option>
                    <option>Qualidade</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                    Quantidade
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formProducao.quantidade}
                    onChange={(e) =>
                      setFormProducao((prev) => ({
                        ...prev,
                        quantidade: e.target.value,
                      }))
                    }
                    placeholder="Ex: 4"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-black text-slate-700 outline-none focus:border-[#b49157]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                    Responsável
                  </label>
                  <input
                    type="text"
                    disabled
                    value={nomeUsuario}
                    className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-black text-slate-500 outline-none cursor-not-allowed"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                    Observação
                  </label>
                  <textarea
                    rows={3}
                    value={formProducao.observacao}
                    onChange={(e) =>
                      setFormProducao((prev) => ({
                        ...prev,
                        observacao: e.target.value,
                      }))
                    }
                    placeholder="Ex: lote finalizado sem divergências..."
                    className="w-full resize-none bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-[#b49157]"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleRegistrarProducao}
                className="w-full py-4 bg-[#064e3b] hover:bg-[#08634b] text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-lg flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                Registrar produção
              </button>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Últimos lançamentos
                </p>

                {lancamentos.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-black text-[#064e3b] uppercase break-words">
                          {item.modelo}
                        </p>
                        <p className="mt-1 text-xs font-bold text-slate-500">
                          Setor: {item.setor} • Qtde: {item.quantidade}
                        </p>
                        {item.observacao ? (
                          <p className="mt-2 text-[11px] font-bold text-slate-500">
                            {item.observacao}
                          </p>
                        ) : null}
                      </div>

                      <div className="text-left md:text-right shrink-0">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          {item.id}
                        </p>
                        <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                          {formatDateTime(item.criadoEm)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="xl:col-span-6">
          <SectionCard
            title="Ordens do Dia"
            icon={Clock3}
            subtitle="o que a equipe precisa acompanhar agora"
          >
            <div className="space-y-3">
              {ordens.map((ordem) => (
                <div
                  key={ordem.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          text={ordem.prioridade}
                          className={getPriorityClasses(ordem.prioridade)}
                        />
                        <Badge
                          text={ordem.status}
                          className={getOrderStatusClasses(ordem.status)}
                        />
                      </div>

                      <p className="mt-3 text-sm font-black text-[#064e3b] uppercase break-words">
                        {ordem.modelo}
                      </p>

                      <div className="mt-2 flex gap-2 flex-wrap">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          {ordem.id}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                          •
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Etapa: {ordem.etapa}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                          •
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          {ordem.prazo}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {ordem.status !== "Concluída" ? (
                        <button
                          type="button"
                          onClick={() => marcarOrdemConcluida(ordem.id)}
                          className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-100"
                        >
                          Concluir
                        </button>
                      ) : (
                        <div className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                          Finalizada
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      {/* SETORES + SOLICITAÇÕES */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7">
          <SectionCard
            title="Linha da Fábrica"
            icon={Settings2}
            subtitle="ajuste rápido do andamento por setor"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {setores.map((setor) => (
                <div
                  key={setor.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-white border border-slate-200 text-[#b49157]">
                          {setor.icon}
                        </div>
                        <p className="text-sm font-black text-[#064e3b] uppercase break-words">
                          {setor.nome}
                        </p>
                      </div>

                      <div className="mt-3 flex gap-2 flex-wrap">
                        <Badge
                          text={setor.status}
                          className={getSectorStatusClasses(setor.status)}
                        />
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Finalizados
                      </p>
                      <p className="mt-1 text-2xl font-black text-[#064e3b]">
                        {setor.finalizados}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-white border border-slate-200 p-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Em fila
                      </p>
                      <p className="mt-2 text-xl font-black text-[#b49157]">
                        {setor.fila}
                      </p>

                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          onClick={() => ajustarFila(setor.id, -1)}
                          className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-black uppercase hover:bg-slate-200"
                        >
                          -1
                        </button>
                        <button
                          type="button"
                          onClick={() => ajustarFila(setor.id, 1)}
                          className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-black uppercase hover:bg-slate-200"
                        >
                          +1
                        </button>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white border border-slate-200 p-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Status
                      </p>

                      <div className="mt-3 space-y-2">
                        <button
                          type="button"
                          onClick={() => atualizarStatusSetor(setor.id, "Normal")}
                          className="w-full py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-black uppercase"
                        >
                          Normal
                        </button>

                        <button
                          type="button"
                          onClick={() => atualizarStatusSetor(setor.id, "Atenção")}
                          className="w-full py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-black uppercase"
                        >
                          Atenção
                        </button>

                        <button
                          type="button"
                          onClick={() => atualizarStatusSetor(setor.id, "Crítico")}
                          className="w-full py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-black uppercase"
                        >
                          Crítico
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="xl:col-span-5">
          <SectionCard
            title="Solicitações Internas"
            icon={Send}
            subtitle="pedidos rápidos para insumo ou manutenção"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                    Tipo
                  </label>
                  <select
                    value={formSolicitacao.tipo}
                    onChange={(e) =>
                      setFormSolicitacao((prev) => ({ ...prev, tipo: e.target.value }))
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-black text-slate-700 outline-none focus:border-[#b49157]"
                  >
                    <option>Insumo</option>
                    <option>Manutenção</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                    Item / Equipamento
                  </label>
                  <input
                    type="text"
                    value={formSolicitacao.item}
                    onChange={(e) =>
                      setFormSolicitacao((prev) => ({ ...prev, item: e.target.value }))
                    }
                    placeholder="Ex: Cola de contato / Máquina 02"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-[#b49157]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                      Quantidade / Ação
                    </label>
                    <input
                      type="text"
                      value={formSolicitacao.quantidade}
                      onChange={(e) =>
                        setFormSolicitacao((prev) => ({
                          ...prev,
                          quantidade: e.target.value,
                        }))
                      }
                      placeholder="Ex: 10 rolos / revisão"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-[#b49157]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                      Prioridade
                    </label>
                    <select
                      value={formSolicitacao.prioridade}
                      onChange={(e) =>
                        setFormSolicitacao((prev) => ({
                          ...prev,
                          prioridade: e.target.value,
                        }))
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-black text-slate-700 outline-none focus:border-[#b49157]"
                    >
                      <option>Alta</option>
                      <option>Média</option>
                      <option>Baixa</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                    Setor
                  </label>
                  <select
                    value={formSolicitacao.setor}
                    onChange={(e) =>
                      setFormSolicitacao((prev) => ({ ...prev, setor: e.target.value }))
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-black text-slate-700 outline-none focus:border-[#b49157]"
                  >
                    <option>Corte</option>
                    <option>Costura</option>
                    <option>Montagem</option>
                    <option>Qualidade</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAdicionarSolicitacao}
                className="w-full py-4 bg-[#b49157] hover:bg-[#9a7b48] text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-lg flex items-center justify-center gap-2"
              >
                <Send size={16} />
                Enviar solicitação
              </button>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Solicitações recentes
                </p>

                {solicitacoes.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge
                            text={item.prioridade}
                            className={getPriorityClasses(item.prioridade)}
                          />
                          <Badge
                            text={item.status}
                            className={getOrderStatusClasses(item.status)}
                          />
                        </div>

                        <p className="mt-3 text-sm font-black text-[#064e3b] uppercase break-words">
                          {item.item}
                        </p>
                        <p className="mt-1 text-xs font-bold text-slate-500">
                          {item.tipo} • {item.quantidade} • {item.setor}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          {item.id}
                        </p>

                        {item.status !== "Atendida" ? (
                          <button
                            type="button"
                            onClick={() => atenderSolicitacao(item.id)}
                            className="mt-3 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-100"
                          >
                            Atender
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      {/* OCORRÊNCIAS + CHECKLIST */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-5">
          <SectionCard
            title="Ocorrências do Turno"
            icon={AlertTriangle}
            subtitle="registre desvios, retrabalho ou problemas"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                    Tipo
                  </label>
                  <select
                    value={formOcorrencia.tipo}
                    onChange={(e) =>
                      setFormOcorrencia((prev) => ({ ...prev, tipo: e.target.value }))
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-black text-slate-700 outline-none focus:border-[#b49157]"
                  >
                    <option>Qualidade</option>
                    <option>Retrabalho</option>
                    <option>Parada</option>
                    <option>Segurança</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                    Setor
                  </label>
                  <select
                    value={formOcorrencia.setor}
                    onChange={(e) =>
                      setFormOcorrencia((prev) => ({ ...prev, setor: e.target.value }))
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-black text-slate-700 outline-none focus:border-[#b49157]"
                  >
                    <option>Corte</option>
                    <option>Costura</option>
                    <option>Montagem</option>
                    <option>Qualidade</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                    Prioridade
                  </label>
                  <select
                    value={formOcorrencia.prioridade}
                    onChange={(e) =>
                      setFormOcorrencia((prev) => ({
                        ...prev,
                        prioridade: e.target.value,
                      }))
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-black text-slate-700 outline-none focus:border-[#b49157]"
                  >
                    <option>Alta</option>
                    <option>Média</option>
                    <option>Baixa</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                    Descrição
                  </label>
                  <textarea
                    rows={4}
                    value={formOcorrencia.descricao}
                    onChange={(e) =>
                      setFormOcorrencia((prev) => ({
                        ...prev,
                        descricao: e.target.value,
                      }))
                    }
                    placeholder="Ex: atraso na costura por ajuste da máquina..."
                    className="w-full resize-none bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-[#b49157]"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleAdicionarOcorrencia}
                className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-lg flex items-center justify-center gap-2"
              >
                <AlertTriangle size={16} />
                Registrar ocorrência
              </button>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                {ocorrencias.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex gap-2 flex-wrap">
                          <Badge
                            text={item.prioridade}
                            className={getPriorityClasses(item.prioridade)}
                          />
                          <Badge
                            text={item.status}
                            className={getOrderStatusClasses(item.status)}
                          />
                        </div>

                        <p className="mt-3 text-sm font-black text-[#064e3b] uppercase break-words">
                          {item.tipo}
                        </p>
                        <p className="mt-1 text-xs font-bold text-slate-500">
                          Setor: {item.setor}
                        </p>
                        <p className="mt-2 text-[11px] font-bold text-slate-600 leading-relaxed">
                          {item.descricao}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          {item.id}
                        </p>
                        <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                          {formatDateTime(item.criadoEm)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="xl:col-span-7 space-y-6">
          <SectionCard
            title="Checklist do Turno"
            icon={CheckCircle2}
            subtitle="controle básico das rotinas da equipe"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {checklist.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleChecklist(item.id)}
                  className={`w-full text-left rounded-2xl border p-4 transition-all ${
                    item.done
                      ? "bg-emerald-50 border-emerald-200"
                      : "bg-slate-50 border-slate-200 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        item.done
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-white border border-slate-200 text-slate-400"
                      }`}
                    >
                      {item.done ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                    </div>

                    <div className="min-w-0">
                      <p
                        className={`text-sm font-black uppercase break-words ${
                          item.done ? "text-emerald-700" : "text-slate-700"
                        }`}
                      >
                        {item.label}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="Painel Rápido da Equipe"
            icon={Boxes}
            subtitle="resumo operacional do que mais importa no turno"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Setor com maior fila
                </p>
                <p className="mt-2 text-lg font-black text-[#064e3b]">
                  {
                    [...setores].sort((a, b) => b.fila - a.fila)[0]?.nome
                  }
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Solicitações do turno
                </p>
                <p className="mt-2 text-lg font-black text-[#b49157]">
                  {solicitacoes.length}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Ocorrências abertas
                </p>
                <p className="mt-2 text-lg font-black text-rose-500">
                  {ocorrencias.filter((item) => item.status === "Aberta").length}
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex items-start gap-3">
                <ChevronRight size={18} className="text-[#b49157] shrink-0 mt-0.5" />
                <p className="text-xs font-bold text-slate-600">
                  Use este painel para lançar o andamento do turno sem precisar entrar em módulos estratégicos.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex items-start gap-3">
                <ChevronRight size={18} className="text-[#b49157] shrink-0 mt-0.5" />
                <p className="text-xs font-bold text-slate-600">
                  Toda solicitação aberta aqui pode depois alimentar compras, manutenção e controle interno.
                </p>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

export default DashboardFabricaFuncionario;