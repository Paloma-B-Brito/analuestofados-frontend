import React, { useEffect, useMemo, useState } from "react";
import {
  Ruler,
  Calculator,
  Layers,
  Save,
  Package,
  ChevronDown,
  ChevronUp,
  FileText,
  Database,
  Edit,
  Trash,
  Plus,
  X,
  AlertTriangle,
  Search,
  PanelRight,
  Boxes,
  ClipboardList,
  Sparkles,
} from "lucide-react";

/* ==========================================================================
   BASE DE DADOS
   ========================================================================== */

const rawModelosIniciais = [
  {
    id: 1,
    nome: "Sofá Retrátil 3 Lugares (Luxo)",
    dimensoes: "2.40m x 1.10m (Aberto: 1.60m)",
    materiais: [
      {
        tipo: "Espuma D33",
        consumo: 1.5,
        unidade: "chapa",
        medidas: "2.20m x 1.80m x 8cm (Assento)",
      },
      {
        tipo: "Espuma D28",
        consumo: 0.8,
        unidade: "chapa",
        medidas: "2.20m x 1.80m x 5cm (Braços/Encosto)",
      },
      {
        tipo: "Espuma Soft",
        consumo: 0.4,
        unidade: "chapa",
        medidas: "Manta 2cm (Acabamento)",
      },
      { tipo: "Tecido Suede", consumo: 14.5, unidade: "metros" },
      {
        tipo: "Madeira Eucalipto Tratado",
        consumo: 18,
        unidade: "metros lineares",
      },
      {
        tipo: "Compensado Naval",
        consumo: 1.2,
        unidade: "chapa",
        medidas: "2.20x1.60m",
      },
      { tipo: "Percinta Elástica", consumo: 22, unidade: "metros" },
      { tipo: "Molas Bonnel", consumo: 12, unidade: "unidades" },
      { tipo: "Fibra Siliconada", consumo: 3.5, unidade: "kg" },
      { tipo: "TNT (Forro)", consumo: 8, unidade: "metros" },
      { tipo: "Linha de Costura", consumo: 350, unidade: "metros" },
      { tipo: "Grampos 80/10", consumo: 450, unidade: "unidades" },
      { tipo: "Rodízios Silicone", consumo: 4, unidade: "unidades" },
      { tipo: "Pés Madeira", consumo: 4, unidade: "unidades" },
    ],
  },
  {
    id: 2,
    nome: "Poltrona Eames Clássica",
    dimensoes: "85cm x 85cm",
    materiais: [
      {
        tipo: "Espuma D33",
        consumo: 0.4,
        unidade: "chapa",
        medidas: "Assento/Encosto (Moldada)",
      },
      { tipo: "Tecido Couro Natural", consumo: 4.2, unidade: "metros" },
      {
        tipo: "Madeira Curvada (Plywood)",
        consumo: 1,
        unidade: "kit",
        medidas: "Conjunto Laminado",
      },
      { tipo: "Botões Capitonê", consumo: 12, unidade: "unidades" },
      { tipo: "Base Alumínio", consumo: 1, unidade: "unidade" },
      { tipo: "Linha Pesada", consumo: 120, unidade: "metros" },
      { tipo: "Grampos", consumo: 150, unidade: "unidades" },
    ],
  },
  {
    id: 3,
    nome: "Puff Feijão (Bean Bag)",
    dimensoes: "90cm diâmetro",
    materiais: [
      { tipo: "Isopor Triturado (Pérolas)", consumo: 250, unidade: "litros" },
      { tipo: "Tecido Lona/Nylon", consumo: 3.5, unidade: "metros" },
      { tipo: "Zíper Reforçado", consumo: 1, unidade: "metro" },
      { tipo: "Linha Nylon", consumo: 80, unidade: "metros" },
      { tipo: "Forro Interno (TNT)", consumo: 3, unidade: "metros" },
    ],
  },
  {
    id: 4,
    nome: "Almofada Decorativa 45x45",
    dimensoes: "45cm x 45cm",
    materiais: [
      { tipo: "Fibra Siliconada", consumo: 0.45, unidade: "kg" },
      { tipo: "Tecido Linho", consumo: 0.55, unidade: "metro" },
      { tipo: "Zíper Invisível", consumo: 0.5, unidade: "metro" },
      { tipo: "Linha Costura", consumo: 40, unidade: "metros" },
    ],
  },
  {
    id: 5,
    nome: "Maca Estética Fixa",
    dimensoes: "1.90m (C) x 0.80m (L) x 0.75m (A)",
    materiais: [
      {
        tipo: "Espuma D28",
        consumo: 0.6,
        unidade: "chapa",
        medidas: "1.90m x 0.80m x 5cm",
      },
      { tipo: "Tecido Courvin Náutico", consumo: 2.5, unidade: "metros" },
      { tipo: "Estrutura Tubular Aço", consumo: 6, unidade: "metros" },
      {
        tipo: "Madeira MDF (Base)",
        consumo: 1,
        unidade: "chapa",
        medidas: "1.90m x 0.80m",
      },
      { tipo: "Ponteiras Plásticas", consumo: 4, unidade: "unidades" },
      { tipo: "TNT (Acabamento inf.)", consumo: 2, unidade: "metros" },
      { tipo: "Grampos", consumo: 80, unidade: "unidades" },
    ],
  },
  {
    id: 6,
    nome: "Escadinha Pet 3 Degraus",
    dimensoes: "45cm (A) x 40cm (L) x 60cm (P)",
    materiais: [
      {
        tipo: "Espuma D23",
        consumo: 0.2,
        unidade: "chapa",
        medidas: "Bloco Escalonado",
      },
      { tipo: "Tecido Pelúcia/Suede", consumo: 1.8, unidade: "metros" },
      { tipo: "Madeira MDF 6mm", consumo: 0.3, unidade: "chapa" },
      { tipo: "Cola de Contato", consumo: 0.2, unidade: "litro" },
      {
        tipo: "Zíper (Capa Removível)",
        consumo: 1.5,
        unidade: "metros",
      },
    ],
  },
];

/* ==========================================================================
   HELPERS
   ========================================================================== */

let materialSequence = 1000;

function createMaterialId() {
  materialSequence += 1;
  return materialSequence;
}

function deepClone(value) {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value));
}

function toNumber(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

function formatDecimal(value) {
  const numeric = Number(value);

  if (!Number.isFinite(numeric)) return "0";
  if (Number.isInteger(numeric)) return String(numeric);

  return numeric
    .toFixed(2)
    .replace(/\.00$/, "")
    .replace(/(\.\d*[1-9])0+$/, "$1");
}

function isSheetUnit(unidade) {
  return String(unidade).trim().toLowerCase() === "chapa";
}

function isFoamMaterial(tipo) {
  return String(tipo).toLowerCase().includes("espuma");
}

function sanitizeMaterial(material) {
  return {
    ...material,
    tipo: String(material.tipo ?? "").trim() || "Material sem nome",
    consumo: toNumber(material.consumo),
    unidade: String(material.unidade ?? "").trim() || "un",
    medidas: String(material.medidas ?? "").trim(),
  };
}

function sanitizeModel(model) {
  return {
    ...model,
    nome: String(model.nome ?? "").trim() || "Produto sem nome",
    dimensoes: String(model.dimensoes ?? "").trim() || "-",
    materiais: (model.materiais ?? []).map(sanitizeMaterial),
  };
}

function normalizeModels(models) {
  return models.map((model) => ({
    ...model,
    materiais: model.materiais.map((material) => ({
      id: material.id ?? createMaterialId(),
      tipo: material.tipo ?? "",
      consumo: material.consumo ?? 0,
      unidade: material.unidade ?? "un",
      medidas: material.medidas ?? "",
    })),
  }));
}

function calculateMaterialRequirement(material, quantity) {
  const consumoBase = toNumber(material.consumo);
  const totalBruto = consumoBase * quantity;

  if (isSheetUnit(material.unidade)) {
    const chapasInteiras = Math.ceil(totalBruto);
    const sobraPercentual =
      chapasInteiras > 0 ? (chapasInteiras - totalBruto) * 100 : 0;

    return {
      ...material,
      totalBruto,
      totalNumerico: chapasInteiras,
      totalCalculado: String(chapasInteiras),
      sobraPercentual,
      sobraEstimada:
        sobraPercentual > 5
          ? `${sobraPercentual.toFixed(1)}% da última chapa`
          : null,
    };
  }

  return {
    ...material,
    totalBruto,
    totalNumerico: totalBruto,
    totalCalculado: formatDecimal(totalBruto),
    sobraPercentual: 0,
    sobraEstimada: null,
  };
}

function generateWasteSuggestions(materiaisCalculados) {
  const espumaPrincipal = materiaisCalculados.find(
    (item) => isFoamMaterial(item.tipo) && item.sobraPercentual > 20
  );

  if (!espumaPrincipal) return [];

  const suggestions = [];
  const qtdEscadinhas = Math.floor(espumaPrincipal.sobraPercentual / 20);
  const qtdAlmofadas = Math.floor(espumaPrincipal.sobraPercentual / 5);

  if (qtdEscadinhas > 0) {
    suggestions.push({
      id: "escadinha-pet",
      produto: "Escadinha Pet",
      qtd: qtdEscadinhas,
      obs: "Aproveita retalhos maiores de espuma.",
    });
  }

  if (qtdAlmofadas > 0) {
    suggestions.push({
      id: "enchimento-almofada",
      produto: "Enchimento de Almofada",
      qtd: qtdAlmofadas,
      obs: "Pode ser triturado para flocos de enchimento.",
    });
  }

  return suggestions;
}

function buildProductionResult(model, quantity) {
  const materiaisCalculados = model.materiais.map((material) =>
    calculateMaterialRequirement(material, quantity)
  );

  return {
    modelId: model.id,
    modelo: model.nome,
    qtd: quantity,
    materiais: materiaisCalculados,
    sugestoes: generateWasteSuggestions(materiaisCalculados),
  };
}

function validateProductionForm(form) {
  if (!form.modelo) {
    return "Selecione um modelo para simular.";
  }

  const quantidade = toNumber(form.quantidade);

  if (!quantidade || quantidade <= 0) {
    return "Informe uma quantidade maior que zero.";
  }

  if (!Number.isInteger(quantidade)) {
    return "A quantidade deve ser um número inteiro.";
  }

  return "";
}

function createEmptyMaterial() {
  return {
    id: createMaterialId(),
    tipo: "Novo Material",
    consumo: 1,
    unidade: "un",
    medidas: "",
  };
}

/* ==========================================================================
   COMPONENTES VISUAIS
   ========================================================================== */

function MetricCard({ icon: Icon, label, value, hint }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {label}
          </p>
          <h3 className="mt-2 text-2xl font-black text-[#064e3b] break-words">
            {value}
          </h3>
          {hint ? (
            <p className="mt-2 text-[11px] font-bold text-slate-400">{hint}</p>
          ) : null}
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[#b49157] shrink-0">
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

function ValidationInline({ message }) {
  if (!message) return null;

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 flex items-start gap-2">
      <AlertTriangle size={16} className="text-amber-700 mt-0.5 shrink-0" />
      <div className="text-[11px] font-bold uppercase tracking-wide text-amber-800">
        {message}
      </div>
    </div>
  );
}

function SimulatorSidebar({
  modelos,
  producao,
  validationMessage,
  selectedModel,
  onChange,
  onClear,
}) {
  return (
    <div className="space-y-6 sticky top-6">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-black text-[#064e3b] uppercase flex items-center gap-2">
            <Calculator size={18} />
            Painel de Simulação
          </h3>
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mt-2">
            Automação ativa para cálculo em tempo real
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
              O que vamos produzir?
            </label>

            <select
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:border-[#b49157]"
              value={producao.modelo}
              onChange={(e) => onChange("modelo", e.target.value)}
            >
              <option value="">Selecione um Modelo...</option>
              {modelos.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
              Quantidade Desejada
            </label>

            <input
              type="number"
              min="0"
              step="1"
              value={producao.quantidade}
              placeholder="Ex: 10"
              onChange={(e) => onChange("quantidade", e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:border-[#b49157]"
            />
          </div>

          <ValidationInline message={validationMessage} />

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-3">
              <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                Modo
              </span>
              <span className="block mt-2 text-xs font-black text-[#064e3b] uppercase">
                Automático
              </span>
            </div>

            <div className="bg-slate-50 rounded-xl border border-slate-200 p-3">
              <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                Status
              </span>
              <span className="block mt-2 text-xs font-black text-[#064e3b] uppercase">
                {validationMessage ? "Aguardando" : "Calculando"}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClear}
            className="w-full py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-black uppercase text-xs rounded-xl transition-colors"
          >
            Limpar Simulação
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-black text-[#064e3b] uppercase flex items-center gap-2">
            <ClipboardList size={18} />
            Preview Técnico
          </h3>
        </div>

        <div className="p-6">
          {selectedModel ? (
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Produto Selecionado
                </p>
                <h4 className="mt-2 text-lg font-black text-slate-700 uppercase leading-tight">
                  {selectedModel.nome}
                </h4>
                <p className="mt-2 text-xs font-bold uppercase text-slate-400">
                  Dimensões: {selectedModel.dimensoes}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-3">
                  <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Materiais
                  </span>
                  <span className="block mt-2 text-xl font-black text-[#064e3b]">
                    {selectedModel.materiais.length}
                  </span>
                </div>

                <div className="bg-slate-50 rounded-xl border border-slate-200 p-3">
                  <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Categoria
                  </span>
                  <span className="block mt-2 text-xs font-black uppercase text-[#064e3b]">
                    Engenharia
                  </span>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                  Principais itens
                </p>

                <div className="space-y-2">
                  {selectedModel.materiais.slice(0, 4).map((mat) => (
                    <div
                      key={mat.id}
                      className="flex items-center justify-between gap-3 bg-slate-50 rounded-xl border border-slate-200 px-3 py-2"
                    >
                      <span className="text-[11px] font-black text-slate-700 uppercase">
                        {mat.tipo}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400 uppercase shrink-0">
                        {formatDecimal(mat.consumo)} {mat.unidade}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <Database size={36} className="mx-auto mb-3 text-slate-300" />
              <p className="text-xs font-bold uppercase text-slate-400">
                Selecione um modelo para ver o preview técnico
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultWorkspace({ resultado }) {
  if (!resultado) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm min-h-[420px] flex items-center justify-center p-10">
        <div className="text-center">
          <Layers size={48} className="mx-auto mb-4 text-slate-300" />
          <p className="font-black uppercase text-sm text-slate-400">
            A lista técnica aparecerá aqui automaticamente
          </p>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-300 mt-2">
            Escolha um modelo e informe a quantidade
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-24 bg-[#b49157] opacity-10 rounded-bl-full" />

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-6">
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Lista de Corte (BOM)
            </p>
            <h3 className="mt-2 text-2xl font-black break-words">
              {resultado.qtd}x {resultado.modelo}
            </h3>
          </div>

          <div className="flex gap-2 flex-wrap">
            <span className="px-3 py-2 rounded-lg bg-white/10 text-[10px] font-black uppercase tracking-widest text-slate-200">
              {resultado.materiais.length} insumos
            </span>
            <span className="px-3 py-2 rounded-lg bg-white/10 text-[10px] font-black uppercase tracking-widest text-slate-200">
              Automação ativa
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1">
          {resultado.materiais.map((mat) => (
            <div
              key={mat.id}
              className="bg-white/5 p-4 rounded-xl border border-white/5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase text-slate-100 break-words">
                    {mat.tipo}
                  </p>

                  {mat.medidas ? (
                    <p className="text-[10px] text-slate-400 mt-1 break-words">
                      {mat.medidas}
                    </p>
                  ) : null}
                </div>

                <div className="text-right shrink-0">
                  <p className="text-lg font-black text-[#b49157]">
                    {mat.totalCalculado}
                  </p>
                  <p className="text-[10px] font-bold uppercase text-slate-400">
                    {mat.unidade}
                  </p>
                </div>
              </div>

              {mat.sobraEstimada ? (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                    Sobra: {mat.sobraEstimada}
                  </span>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      {resultado.sugestoes.length > 0 ? (
        <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full">
              <Sparkles size={22} />
            </div>

            <div className="flex-1">
              <h4 className="font-black text-emerald-800 uppercase text-sm">
                Sugestões de reaproveitamento
              </h4>
              <p className="text-xs text-emerald-700 mt-1 mb-4">
                Itens sugeridos automaticamente a partir da sobra estimada.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {resultado.sugestoes.map((sug) => (
                  <div
                    key={sug.id}
                    className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <span className="block font-black text-emerald-800 uppercase text-xs">
                          {sug.produto}
                        </span>
                        <span className="block text-[10px] text-emerald-600 mt-1">
                          {sug.obs}
                        </span>
                      </div>

                      <div className="text-lg font-black text-emerald-600 shrink-0">
                        +{sug.qtd}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function TechnicalSheetsToolbar({
  search,
  onSearchChange,
  onExpandAll,
  onCollapseAll,
  total,
  filtered,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <h3 className="font-black text-[#064e3b] uppercase flex items-center gap-2">
            <FileText size={18} />
            Fichas Técnicas Detalhadas
          </h3>
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mt-2">
            {filtered} de {total} produtos visíveis
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <div className="relative min-w-[260px]">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Buscar produto, material ou medida..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:border-[#b49157]"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onExpandAll}
              className="px-4 py-3 bg-slate-200 text-slate-700 text-[10px] font-black uppercase rounded-xl hover:bg-slate-300 transition-colors"
            >
              Expandir Tudo
            </button>

            <button
              type="button"
              onClick={onCollapseAll}
              className="px-4 py-3 bg-slate-200 text-slate-700 text-[10px] font-black uppercase rounded-xl hover:bg-slate-300 transition-colors"
            >
              Recolher Tudo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TechnicalSheetRow({ item, isOpen, onToggle, onEdit }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
      <div className="p-5 hover:bg-slate-50 cursor-pointer" onClick={onToggle}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="min-w-0">
            <h4 className="font-black text-slate-700 uppercase text-sm break-words">
              {item.nome}
            </h4>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-2 break-words">
              Dimensões: {item.dimensoes}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">
              {item.materiais.length} itens
            </span>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="px-3 py-2 bg-[#b49157] text-white text-[10px] font-black uppercase rounded-lg hover:bg-[#9a7b48] transition-colors flex items-center gap-2"
            >
              <Edit size={12} />
              Editar
            </button>

            {isOpen ? (
              <ChevronUp size={18} className="text-[#b49157]" />
            ) : (
              <ChevronDown size={18} className="text-slate-400" />
            )}
          </div>
        </div>
      </div>

      {isOpen ? (
        <div className="border-t border-slate-100 bg-slate-50 p-5 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            {item.materiais.map((mat) => (
              <div
                key={mat.id}
                className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col justify-between"
              >
                <div>
                  <p className="text-[10px] font-black text-[#064e3b] uppercase mb-1">
                    {mat.tipo}
                  </p>
                  {mat.medidas ? (
                    <p className="text-[9px] text-slate-400">{mat.medidas}</p>
                  ) : null}
                </div>

                <div className="border-t border-slate-100 pt-2 mt-3 text-right">
                  <span className="text-sm font-black text-slate-700">
                    {formatDecimal(mat.consumo)}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase ml-1">
                    {mat.unidade}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function EditModelDrawer({
  model,
  onClose,
  onSave,
  onChangeModelField,
  onChangeMaterialField,
  onRemoveMaterial,
  onAddMaterial,
}) {
  if (!model) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm">
      <div className="absolute inset-y-0 right-0 w-full max-w-3xl bg-white shadow-2xl flex flex-col animate-fade-in">
        <div className="bg-[#064e3b] p-4 text-white flex justify-between items-center border-b border-white/10">
          <div className="flex items-center gap-3">
            <PanelRight size={18} className="text-[#b49157]" />
            <div>
              <h3 className="font-black uppercase tracking-widest text-sm">
                Edição Técnica
              </h3>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/70 mt-1">
                {model.nome}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-50 p-6 space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">
                Nome do Produto
              </label>
              <input
                type="text"
                value={model.nome}
                onChange={(e) => onChangeModelField("nome", e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-700 bg-white"
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">
                Dimensões Gerais
              </label>
              <input
                type="text"
                value={model.dimensoes}
                onChange={(e) =>
                  onChangeModelField("dimensoes", e.target.value)
                }
                className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-700 bg-white"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center gap-3">
              <div>
                <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-600">
                  Composição
                </h4>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">
                  {model.materiais.length} materiais
                </p>
              </div>

              <button
                type="button"
                onClick={onAddMaterial}
                className="px-4 py-2 bg-[#b49157] text-white text-[10px] font-black uppercase rounded-lg hover:bg-[#9a7b48] transition-colors flex items-center gap-2"
              >
                <Plus size={12} />
                Adicionar
              </button>
            </div>

            <div className="p-4 space-y-3">
              {model.materiais.map((mat) => (
                <div
                  key={mat.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                    <div className="md:col-span-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">
                        Material
                      </label>
                      <input
                        value={mat.tipo}
                        onChange={(e) =>
                          onChangeMaterialField(mat.id, "tipo", e.target.value)
                        }
                        className="w-full p-2 border border-slate-300 rounded-lg text-xs font-bold text-[#064e3b] bg-white"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">
                        Consumo
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={mat.consumo}
                        onChange={(e) =>
                          onChangeMaterialField(mat.id, "consumo", e.target.value)
                        }
                        className="w-full p-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 bg-white"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">
                        Unidade
                      </label>
                      <input
                        value={mat.unidade}
                        onChange={(e) =>
                          onChangeMaterialField(mat.id, "unidade", e.target.value)
                        }
                        className="w-full p-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 bg-white"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">
                        Medidas
                      </label>
                      <input
                        value={mat.medidas || ""}
                        onChange={(e) =>
                          onChangeMaterialField(mat.id, "medidas", e.target.value)
                        }
                        className="w-full p-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 bg-white"
                        placeholder="-"
                      />
                    </div>

                    <div className="md:col-span-1 flex md:items-end">
                      <button
                        type="button"
                        onClick={() => onRemoveMaterial(mat.id)}
                        className="w-full md:w-auto p-2 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {model.materiais.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center">
                  <p className="text-xs font-black uppercase text-slate-400">
                    Nenhum material cadastrado
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="p-4 bg-white border-t border-slate-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 border border-slate-300 text-slate-600 font-black uppercase text-xs rounded-xl hover:bg-slate-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onSave}
            className="px-6 py-3 bg-[#064e3b] text-white font-black uppercase text-xs rounded-xl hover:bg-[#08634b] shadow-lg flex items-center gap-2"
          >
            <Save size={14} />
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   COMPONENTE PRINCIPAL
   ========================================================================== */

function Engenharia() {
  const [modelos, setModelos] = useState(() =>
    normalizeModels(rawModelosIniciais)
  );
  const [producao, setProducao] = useState({
    modelo: "",
    quantidade: "",
  });
  const [resultado, setResultado] = useState(null);
  const [modelosAbertos, setModelosAbertos] = useState([]);
  const [modeloEmEdicao, setModeloEmEdicao] = useState(null);
  const [buscaFicha, setBuscaFicha] = useState("");

  const validationMessage = useMemo(() => {
    return validateProductionForm(producao);
  }, [producao]);

  const modeloSelecionado = useMemo(() => {
    return (
      modelos.find((m) => String(m.id) === String(producao.modelo)) || null
    );
  }, [modelos, producao.modelo]);

  const totalMateriaisCadastrados = useMemo(() => {
    return modelos.reduce((acc, item) => acc + item.materiais.length, 0);
  }, [modelos]);

  const modelosFiltrados = useMemo(() => {
    const termo = buscaFicha.trim().toLowerCase();

    if (!termo) return modelos;

    return modelos.filter((modelo) => {
      const matchNome = modelo.nome.toLowerCase().includes(termo);
      const matchDimensoes = modelo.dimensoes.toLowerCase().includes(termo);
      const matchMateriais = modelo.materiais.some(
        (mat) =>
          mat.tipo.toLowerCase().includes(termo) ||
          String(mat.medidas || "").toLowerCase().includes(termo) ||
          String(mat.unidade || "").toLowerCase().includes(termo)
      );

      return matchNome || matchDimensoes || matchMateriais;
    });
  }, [modelos, buscaFicha]);

  useEffect(() => {
    const hasError = validateProductionForm(producao);

    if (hasError || !modeloSelecionado) {
      setResultado(null);
      return;
    }

    const qtd = toNumber(producao.quantidade);
    const novoResultado = buildProductionResult(modeloSelecionado, qtd);
    setResultado(novoResultado);
  }, [producao, modeloSelecionado]);

  function handleChangeProducao(field, value) {
    setProducao((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function limparSimulacao() {
    setProducao({
      modelo: "",
      quantidade: "",
    });
    setResultado(null);
  }

  function toggleFicha(id) {
    setModelosAbertos((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  }

  function expandirTudo() {
    setModelosAbertos(modelosFiltrados.map((m) => m.id));
  }

  function recolherTudo() {
    setModelosAbertos([]);
  }

  function abrirDrawerEdicao(modelo) {
    setModeloEmEdicao(deepClone(modelo));
  }

  function fecharDrawerEdicao() {
    setModeloEmEdicao(null);
  }

  function atualizarCampoModelo(campo, valor) {
    setModeloEmEdicao((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  }

  function atualizarCampoMaterial(materialId, campo, valor) {
    setModeloEmEdicao((prev) => ({
      ...prev,
      materiais: prev.materiais.map((mat) =>
        mat.id === materialId
          ? {
              ...mat,
              [campo]: valor,
            }
          : mat
      ),
    }));
  }

  function removerMaterial(materialId) {
    setModeloEmEdicao((prev) => ({
      ...prev,
      materiais: prev.materiais.filter((mat) => mat.id !== materialId),
    }));
  }

  function adicionarMaterial() {
    setModeloEmEdicao((prev) => ({
      ...prev,
      materiais: [...prev.materiais, createEmptyMaterial()],
    }));
  }

  function salvarEdicao() {
    if (!modeloEmEdicao) return;

    const modeloSanitizado = sanitizeModel(modeloEmEdicao);

    setModelos((prev) =>
      prev.map((m) => (m.id === modeloSanitizado.id ? modeloSanitizado : m))
    );

    setResultado((prev) => {
      if (!prev) return prev;
      if (prev.modelId !== modeloSanitizado.id) return prev;

      return buildProductionResult(modeloSanitizado, prev.qtd);
    });

    setModeloEmEdicao(null);
  }

  return (
    <div className="animate-fade-in space-y-6 pb-10 relative">
      <EditModelDrawer
        model={modeloEmEdicao}
        onClose={fecharDrawerEdicao}
        onSave={salvarEdicao}
        onChangeModelField={atualizarCampoModelo}
        onChangeMaterialField={atualizarCampoMaterial}
        onRemoveMaterial={removerMaterial}
        onAddMaterial={adicionarMaterial}
      />

      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-[#064e3b] uppercase tracking-tighter flex items-center gap-2">
            <Ruler className="text-[#b49157]" />
            Engenharia <span className="text-slate-300">|</span> Otimização
          </h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
            Cálculo de Corte, Ficha Técnica e Gestão de Materiais
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          icon={Boxes}
          label="Modelos"
          value={modelos.length}
          hint="Produtos cadastrados"
        />

        <MetricCard
          icon={Package}
          label="Insumos"
          value={totalMateriaisCadastrados}
          hint="Total de itens técnicos"
        />

        <MetricCard
          icon={Layers}
          label="Modelo ativo"
          value={modeloSelecionado ? modeloSelecionado.nome : "--"}
          hint="Produto em simulação"
        />

        <MetricCard
          icon={Sparkles}
          label="Automação"
          value="ON"
          hint="Resultado em tempo real"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-4">
          <SimulatorSidebar
            modelos={modelos}
            producao={producao}
            validationMessage={validationMessage}
            selectedModel={modeloSelecionado}
            onChange={handleChangeProducao}
            onClear={limparSimulacao}
          />
        </div>

        <div className="xl:col-span-8">
          <ResultWorkspace resultado={resultado} />
        </div>
      </div>

      <div className="pt-4 space-y-4">
        <TechnicalSheetsToolbar
          search={buscaFicha}
          onSearchChange={setBuscaFicha}
          onExpandAll={expandirTudo}
          onCollapseAll={recolherTudo}
          total={modelos.length}
          filtered={modelosFiltrados.length}
        />

        <div className="grid grid-cols-1 gap-4">
          {modelosFiltrados.map((item) => (
            <TechnicalSheetRow
              key={item.id}
              item={item}
              isOpen={modelosAbertos.includes(item.id)}
              onToggle={() => toggleFicha(item.id)}
              onEdit={() => abrirDrawerEdicao(item)}
            />
          ))}
        </div>

        {modelosFiltrados.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center">
            <Search size={36} className="mx-auto mb-3 text-slate-300" />
            <p className="text-xs font-black uppercase text-slate-400">
              Nenhuma ficha encontrada para a busca informada
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Engenharia;