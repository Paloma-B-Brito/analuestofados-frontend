import React, { useMemo, useState } from "react";
import "../../App.css";
import {
  ShieldAlert,
  Crown,
  Landmark,
  CalendarDays,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Percent,
  BadgeDollarSign,
  FileBarChart,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  Wallet,
  Receipt,
  Factory,
  Store,
  ChevronRight,
} from "lucide-react";

/**
 * @file DRE.jsx
 * @description Demonstrativo de Resultados Gerencial
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

function formatPercent(value) {
  return `${toNumber(value).toFixed(1)}%`;
}

function calculatePercentOfRevenue(value, revenue) {
  if (!revenue || revenue <= 0) return 0;
  return (toNumber(value) / toNumber(revenue)) * 100;
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

function DRELine({
  label,
  value,
  revenueBase,
  strong = false,
  negative = false,
  level = 0,
  dividerTop = false,
}) {
  const percentual = calculatePercentOfRevenue(value, revenueBase);

  return (
    <div
      className={`grid grid-cols-[1fr_auto_auto] gap-4 items-center py-3 ${
        dividerTop ? "border-t border-slate-200 mt-2 pt-4" : ""
      }`}
      style={{ paddingLeft: `${level * 18}px` }}
    >
      <div className="min-w-0">
        <p
          className={`uppercase break-words ${
            strong
              ? "text-sm font-black text-[#064e3b]"
              : "text-xs font-black text-slate-600"
          }`}
        >
          {label}
        </p>
      </div>

      <div className="text-right min-w-[110px]">
        <p
          className={`${
            strong
              ? negative
                ? "text-lg font-black text-rose-500"
                : "text-lg font-black text-[#064e3b]"
              : negative
              ? "text-sm font-black text-rose-500"
              : "text-sm font-black text-slate-700"
          }`}
        >
          {negative ? `(${formatCurrency(value)})` : formatCurrency(value)}
        </p>
      </div>

      <div className="text-right min-w-[70px]">
        <p
          className={`${
            strong
              ? "text-xs font-black text-[#b49157]"
              : "text-[11px] font-black text-slate-400"
          }`}
        >
          {formatPercent(percentual)}
        </p>
      </div>
    </div>
  );
}

function DRE() {
  const [periodo, setPeriodo] = useState("MES");
  const [visao, setVisao] = useState("GERENCIAL");
  const [role] = useState("ADMIN");
  const [usuarioLogado] = useState({ nome: "Administradora" });

  const normalizedRole = String(role || "").toUpperCase();
  const isAdminFinanceiro = !["LOJA", "FABRICA"].includes(normalizedRole);

  const nomeUsuario = usuarioLogado?.nome || "Administradora";

  const drePorPeriodo = {
    "7D": {
      receitaBruta: 84200,
      deducoes: 6930,
      receitaLiquida: 77270,
      custoProdutosVendidos: 38120,
      lucroBruto: 39150,
      despesasComerciais: 8420,
      despesasAdministrativas: 6230,
      despesasOperacionais: 4210,
      despesasFinanceiras: 1380,
      outrasReceitas: 520,
      outrasDespesas: 240,
      impostoSobreLucro: 5210,
    },
    "30D": {
      receitaBruta: 572300,
      deducoes: 49710,
      receitaLiquida: 522590,
      custoProdutosVendidos: 254800,
      lucroBruto: 267790,
      despesasComerciais: 48200,
      despesasAdministrativas: 36400,
      despesasOperacionais: 28800,
      despesasFinanceiras: 9100,
      outrasReceitas: 3200,
      outrasDespesas: 1500,
      impostoSobreLucro: 37490,
    },
    MES: {
      receitaBruta: 598400,
      deducoes: 52110,
      receitaLiquida: 546290,
      custoProdutosVendidos: 266900,
      lucroBruto: 279390,
      despesasComerciais: 49750,
      despesasAdministrativas: 38100,
      despesasOperacionais: 30180,
      despesasFinanceiras: 9840,
      outrasReceitas: 4100,
      outrasDespesas: 1760,
      impostoSobreLucro: 40150,
    },
    ANO: {
      receitaBruta: 6894200,
      deducoes: 611300,
      receitaLiquida: 6282900,
      custoProdutosVendidos: 3144800,
      lucroBruto: 3138100,
      despesasComerciais: 566200,
      despesasAdministrativas: 438500,
      despesasOperacionais: 361400,
      despesasFinanceiras: 117600,
      outrasReceitas: 44900,
      outrasDespesas: 21400,
      impostoSobreLucro: 481700,
    },
  };

  const dre = useMemo(() => {
    const base = drePorPeriodo[periodo] || drePorPeriodo.MES;

    const lucroOperacionalAntesFinanceiro =
      base.lucroBruto -
      base.despesasComerciais -
      base.despesasAdministrativas -
      base.despesasOperacionais;

    const resultadoAntesImpostos =
      lucroOperacionalAntesFinanceiro -
      base.despesasFinanceiras +
      base.outrasReceitas -
      base.outrasDespesas;

    const lucroLiquido = resultadoAntesImpostos - base.impostoSobreLucro;

    return {
      ...base,
      lucroOperacionalAntesFinanceiro,
      resultadoAntesImpostos,
      lucroLiquido,
      margemBruta: calculatePercentOfRevenue(base.lucroBruto, base.receitaLiquida),
      margemOperacional: calculatePercentOfRevenue(
        lucroOperacionalAntesFinanceiro,
        base.receitaLiquida
      ),
      margemLiquida: calculatePercentOfRevenue(lucroLiquido, base.receitaLiquida),
    };
  }, [periodo]);

  const comparativoAreas = useMemo(() => {
    if (periodo === "7D") {
      return [
        { nome: "Loja", receita: 52100, custo: 30300, margem: 41.8, icon: Store },
        { nome: "Fábrica", receita: 26100, custo: 18400, margem: 29.5, icon: Factory },
        { nome: "Logística / Serviços", receita: 6000, custo: 2700, margem: 55.0, icon: Receipt },
      ];
    }

    if (periodo === "30D" || periodo === "MES") {
      return [
        { nome: "Loja", receita: 312400, custo: 186300, margem: 40.4, icon: Store },
        { nome: "Fábrica", receita: 245700, custo: 181400, margem: 26.2, icon: Factory },
        { nome: "Serviços / Entregas", receita: 40300, custo: 18100, margem: 55.1, icon: Receipt },
      ];
    }

    return [
      { nome: "Loja", receita: 3618200, custo: 2157300, margem: 40.4, icon: Store },
      { nome: "Fábrica", receita: 2814900, custo: 2089000, margem: 25.8, icon: Factory },
      { nome: "Serviços / Entregas", receita: 421100, custo: 195600, margem: 53.5, icon: Receipt },
    ];
  }, [periodo]);

  const alertas = useMemo(() => {
    return [
      "A margem operacional está pressionada por despesas comerciais e administrativas.",
      "Despesas financeiras merecem atenção para reduzir erosão do resultado.",
      "A linha de outras receitas ajuda, mas não deve sustentar o lucro recorrente.",
      "O CPV ainda é a maior alavanca para melhorar a margem bruta.",
    ];
  }, []);

  const indicadores = useMemo(() => {
    return {
      ticketMedio: periodo === "ANO" ? 3380 : periodo === "7D" ? 3120 : 3240,
      pedidosFaturados: periodo === "ANO" ? 2038 : periodo === "7D" ? 27 : 176,
      pontoEquilibrio: periodo === "ANO" ? 468000 : periodo === "7D" ? 61200 : 402000,
      eficienciaOperacional:
        periodo === "ANO" ? 81.4 : periodo === "7D" ? 79.2 : 80.1,
    };
  }, [periodo]);

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
            O DRE gerencial é visível apenas para a administração.
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
            Demonstrativo de Resultados <span className="text-slate-300">|</span>
            <span className="text-[#b49157]">Gerencial</span>
          </h1>

          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">
            visão executiva da receita, custos, despesas e lucro da operação
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

      {/* CONTROLES */}
      <SectionCard
        title="Configuração da Análise"
        icon={CalendarDays}
        extra={
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            visão executiva
          </span>
        }
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
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

            <PeriodButton active={periodo === "ANO"} onClick={() => setPeriodo("ANO")}>
              Ano Atual
            </PeriodButton>
          </div>

          <div className="flex gap-3 flex-wrap">
            <PeriodButton
              active={visao === "GERENCIAL"}
              onClick={() => setVisao("GERENCIAL")}
            >
              Gerencial
            </PeriodButton>

            <PeriodButton
              active={visao === "EXECUTIVA"}
              onClick={() => setVisao("EXECUTIVA")}
            >
              Executiva
            </PeriodButton>
          </div>
        </div>
      </SectionCard>

      {/* KPIS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard
          icon={BadgeDollarSign}
          label="Receita Líquida"
          value={formatCurrency(dre.receitaLiquida)}
          hint="base principal da análise"
          valueClassName="text-[#064e3b]"
        />

        <MetricCard
          icon={PiggyBank}
          label="Lucro Bruto"
          value={formatCurrency(dre.lucroBruto)}
          hint={`margem ${formatPercent(dre.margemBruta)}`}
          valueClassName="text-emerald-600"
        />

        <MetricCard
          icon={TrendingUp}
          label="Resultado Operacional"
          value={formatCurrency(dre.lucroOperacionalAntesFinanceiro)}
          hint={`margem ${formatPercent(dre.margemOperacional)}`}
          valueClassName="text-[#b49157]"
        />

        <MetricCard
          icon={Wallet}
          label="Lucro Líquido"
          value={formatCurrency(dre.lucroLiquido)}
          hint={`margem ${formatPercent(dre.margemLiquida)}`}
          valueClassName="text-rose-500"
          highlighted
        />
      </div>

      {/* KPIS SECUNDÁRIOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard
          icon={Percent}
          label="Margem Bruta"
          value={formatPercent(dre.margemBruta)}
          hint="após CPV"
          valueClassName="text-[#064e3b]"
        />

        <MetricCard
          icon={Percent}
          label="Margem Operacional"
          value={formatPercent(dre.margemOperacional)}
          hint="antes do financeiro"
          valueClassName="text-[#b49157]"
        />

        <MetricCard
          icon={Percent}
          label="Margem Líquida"
          value={formatPercent(dre.margemLiquida)}
          hint="resultado final"
          valueClassName="text-emerald-600"
        />

        <MetricCard
          icon={TrendingDown}
          label="Despesas Financeiras"
          value={formatCurrency(dre.despesasFinanceiras)}
          hint="peso no resultado"
          valueClassName="text-rose-500"
        />
      </div>

      {/* DRE + ALERTAS */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <SectionCard
            title="Estrutura do DRE"
            icon={FileBarChart}
            extra={
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                demonstrativo gerencial
              </span>
            }
          >
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="grid grid-cols-[1fr_auto_auto] gap-4 pb-3 border-b border-slate-200">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Conta
                </p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">
                  Valor
                </p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">
                  % Receita
                </p>
              </div>

              <div className="mt-2">
                <DRELine
                  label="Receita Bruta"
                  value={dre.receitaBruta}
                  revenueBase={dre.receitaLiquida}
                  strong
                />

                <DRELine
                  label="(-) Deduções / Impostos / Devoluções"
                  value={dre.deducoes}
                  revenueBase={dre.receitaLiquida}
                  negative
                  level={1}
                />

                <DRELine
                  label="(=) Receita Líquida"
                  value={dre.receitaLiquida}
                  revenueBase={dre.receitaLiquida}
                  strong
                  dividerTop
                />

                <DRELine
                  label="(-) Custo dos Produtos Vendidos"
                  value={dre.custoProdutosVendidos}
                  revenueBase={dre.receitaLiquida}
                  negative
                  level={1}
                />

                <DRELine
                  label="(=) Lucro Bruto"
                  value={dre.lucroBruto}
                  revenueBase={dre.receitaLiquida}
                  strong
                  dividerTop
                />

                <DRELine
                  label="(-) Despesas Comerciais"
                  value={dre.despesasComerciais}
                  revenueBase={dre.receitaLiquida}
                  negative
                  level={1}
                />

                <DRELine
                  label="(-) Despesas Administrativas"
                  value={dre.despesasAdministrativas}
                  revenueBase={dre.receitaLiquida}
                  negative
                  level={1}
                />

                <DRELine
                  label="(-) Despesas Operacionais"
                  value={dre.despesasOperacionais}
                  revenueBase={dre.receitaLiquida}
                  negative
                  level={1}
                />

                <DRELine
                  label="(=) Resultado Operacional"
                  value={dre.lucroOperacionalAntesFinanceiro}
                  revenueBase={dre.receitaLiquida}
                  strong
                  dividerTop
                />

                <DRELine
                  label="(-) Despesas Financeiras"
                  value={dre.despesasFinanceiras}
                  revenueBase={dre.receitaLiquida}
                  negative
                  level={1}
                />

                <DRELine
                  label="(+) Outras Receitas"
                  value={dre.outrasReceitas}
                  revenueBase={dre.receitaLiquida}
                  level={1}
                />

                <DRELine
                  label="(-) Outras Despesas"
                  value={dre.outrasDespesas}
                  revenueBase={dre.receitaLiquida}
                  negative
                  level={1}
                />

                <DRELine
                  label="(=) Resultado Antes dos Impostos"
                  value={dre.resultadoAntesImpostos}
                  revenueBase={dre.receitaLiquida}
                  strong
                  dividerTop
                />

                <DRELine
                  label="(-) Imposto sobre o Lucro"
                  value={dre.impostoSobreLucro}
                  revenueBase={dre.receitaLiquida}
                  negative
                  level={1}
                />

                <DRELine
                  label="(=) Lucro Líquido"
                  value={dre.lucroLiquido}
                  revenueBase={dre.receitaLiquida}
                  strong
                  dividerTop
                />
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="xl:col-span-1">
          <SectionCard title="Alertas Gerenciais" icon={AlertTriangle}>
            <div className="space-y-3">
              {alertas.map((alerta, index) => (
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

      {/* COMPARATIVO + INDICADORES */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <SectionCard
            title="Contribuição por Área"
            icon={BarChart3}
            extra={
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                composição do resultado
              </span>
            }
          >
            <div className="space-y-4">
              {comparativoAreas.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.nome}
                    className="rounded-2xl border border-slate-200 bg-white p-5"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[#b49157] shrink-0">
                          <Icon size={18} />
                        </div>

                        <div>
                          <p className="text-sm font-black text-[#064e3b] uppercase">
                            {item.nome}
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
          <SectionCard title="Indicadores Complementares" icon={ChevronRight}>
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Ticket médio
                </p>
                <p className="mt-2 text-2xl font-black text-[#064e3b]">
                  {formatCurrency(indicadores.ticketMedio)}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Pedidos faturados
                </p>
                <p className="mt-2 text-2xl font-black text-[#064e3b]">
                  {indicadores.pedidosFaturados}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Ponto de equilíbrio
                </p>
                <p className="mt-2 text-2xl font-black text-rose-500">
                  {formatCurrency(indicadores.pontoEquilibrio)}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Eficiência operacional
                </p>
                <p className="mt-2 text-2xl font-black text-emerald-600">
                  {formatPercent(indicadores.eficienciaOperacional)}
                </p>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      {/* ANÁLISE EXECUTIVA */}
      <SectionCard
        title="Leitura Executiva da DRE"
        icon={Receipt}
        extra={
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            resumo diretivo
          </span>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <p className="text-xs font-black uppercase text-[#064e3b]">
                Ponto forte
              </p>
            </div>
            <p className="text-sm font-bold text-slate-600 leading-relaxed">
              A margem bruta permanece saudável, indicando boa capacidade de
              geração de valor antes das despesas estruturais.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={16} className="text-amber-500" />
              <p className="text-xs font-black uppercase text-[#064e3b]">
                Atenção
              </p>
            </div>
            <p className="text-sm font-bold text-slate-600 leading-relaxed">
              A soma de despesas comerciais, administrativas e operacionais
              reduz de forma relevante o ganho gerado na operação.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={16} className="text-[#b49157]" />
              <p className="text-xs font-black uppercase text-[#064e3b]">
                Direção recomendada
              </p>
            </div>
            <p className="text-sm font-bold text-slate-600 leading-relaxed">
              O maior potencial de melhoria está em reduzir CPV e despesas
              financeiras, preservando a receita líquida e elevando o lucro final.
            </p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

export default DRE;