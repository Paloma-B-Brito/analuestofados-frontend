import React, { useEffect, useMemo, useState } from "react";
import {
  X,
  Search,
  UserRound,
  CreditCard,
  Package2,
  ReceiptText,
  BadgePercent,
  Phone,
  IdCard,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Calculator,
  Banknote,
  Boxes,
  Crown,
  ShieldCheck,
} from "lucide-react";
import "../../App.css";

/**
 * @file ModalPDV.jsx
 * @description Ponto de Venda (Retail POS)
 * @author © 2026 Rickman Brown • Software Engineering
 */

const VENDEDORES_PADRAO = [
  { id: "v1", nome: "Ana Paula" },
  { id: "v2", nome: "Carlos A." },
  { id: "v3", nome: "Juliana M." },
  { id: "v4", nome: "Patrícia R." },
];

const METODOS_PAGAMENTO = [
  "Cartão",
  "Cartão de Crédito",
  "Cartão de Débito",
  "PIX",
  "Dinheiro",
  "Boleto",
];

const PARCELAS_CARTAO = [
  "1x",
  "2x",
  "3x",
  "4x",
  "5x",
  "6x",
  "7x",
  "8x",
  "9x",
  "10x",
  "11x",
  "12x",
];

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function onlyNumbers(value) {
  return String(value || "").replace(/\D/g, "");
}

function formatCPF(value) {
  const numbers = onlyNumbers(value).slice(0, 11);

  return numbers
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

function formatPhone(value) {
  const numbers = onlyNumbers(value).slice(0, 11);

  if (numbers.length <= 10) {
    return numbers
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }

  return numbers
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

function normalizeDiscount(value) {
  const numeric = Number(value);

  if (!Number.isFinite(numeric)) return 0;
  if (numeric < 0) return 0;

  return numeric;
}

function isCashPayment(method) {
  return String(method || "").toLowerCase() === "dinheiro";
}

function isCardPayment(method) {
  const normalized = String(method || "").toLowerCase();
  return normalized.includes("cartão") || normalized.includes("cartao");
}

function isAvailableProduct(item) {
  const status = String(item?.status || "").toUpperCase();
  return status === "DISPONÍVEL" || status === "DISPONIVEL";
}

function InputLabel({ children }) {
  return (
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.22em] mb-2 block">
      {children}
    </label>
  );
}

function ValidationMessage({ message }) {
  if (!message) return null;

  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 flex items-start gap-2">
      <AlertTriangle size={16} className="text-rose-600 mt-0.5 shrink-0" />
      <p className="text-[11px] font-black uppercase tracking-wide text-rose-700">
        {message}
      </p>
    </div>
  );
}

function SuccessMessage({ message }) {
  if (!message) return null;

  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 flex items-start gap-2">
      <CheckCircle2 size={16} className="text-emerald-600 mt-0.5 shrink-0" />
      <p className="text-[11px] font-black uppercase tracking-wide text-emerald-700">
        {message}
      </p>
    </div>
  );
}

function SummaryLine({ label, value, valueClassName = "text-white" }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
        {label}
      </span>
      <span className={`text-sm font-black ${valueClassName}`}>{value}</span>
    </div>
  );
}

function ProdutoCard({ produto, selecionado, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(produto.id)}
      className={`w-full text-left rounded-2xl border p-4 transition-all ${
        selecionado
          ? "border-[#b49157] bg-[#b49157]/10 shadow-sm"
          : "border-slate-200 bg-white hover:bg-slate-50"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[9px] font-black text-[#b49157] uppercase tracking-[0.22em]">
            {produto.id}
          </p>
          <p className="mt-2 text-sm font-black text-[#064e3b] uppercase break-words">
            {produto.modelo}
          </p>

          {produto.categoria ? (
            <p className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {produto.categoria}
            </p>
          ) : null}
        </div>

        <div className="text-right shrink-0">
          <p className="text-sm font-black text-[#064e3b]">
            {formatCurrency(produto.preco)}
          </p>
          <p className="mt-2 text-[10px] font-black uppercase tracking-wide text-emerald-600">
            Disponível
          </p>
        </div>
      </div>
    </button>
  );
}

function ModalPDV({
  onClose,
  estoqueDisponivel = [],
  onFinalizarVenda,
  vendedores = VENDEDORES_PADRAO,
  role = "LOJA",
  usuarioLogado = null,
  maxDiscountPercentLoja = 10,
  maxDiscountPercentAdmin = 30,
}) {
  const roleNormalized = String(role || "").toUpperCase();
  const isAdmin = roleNormalized !== "LOJA";

  const vendedorInicial =
    !isAdmin && usuarioLogado?.nome
      ? usuarioLogado.nome
      : vendedores?.[0]?.nome || "";

  const [buscaProduto, setBuscaProduto] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successHint, setSuccessHint] = useState("");

  const [venda, setVenda] = useState({
    vendedor: vendedorInicial,
    produtoId: "",
    clienteNome: "",
    clienteCPF: "",
    clienteTelefone: "",
    formaPagamento: "Cartão",
    parcelas: "1x",
    descontoPercentual: 0,
    valorRecebido: "",
    observacoes: "",
  });

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleEscape(event) {
      if (event.key === "Escape") {
        onClose?.();
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const produtosDisponiveis = useMemo(() => {
    return estoqueDisponivel.filter(isAvailableProduct);
  }, [estoqueDisponivel]);

  const produtosFiltrados = useMemo(() => {
    const termo = buscaProduto.trim().toLowerCase();

    if (!termo) return produtosDisponiveis;

    return produtosDisponiveis.filter((produto) => {
      const id = String(produto.id || "").toLowerCase();
      const modelo = String(produto.modelo || "").toLowerCase();
      const categoria = String(produto.categoria || "").toLowerCase();

      return (
        id.includes(termo) ||
        modelo.includes(termo) ||
        categoria.includes(termo)
      );
    });
  }, [produtosDisponiveis, buscaProduto]);

  const produtoSelecionado = useMemo(() => {
    return produtosDisponiveis.find(
      (produto) => String(produto.id) === String(venda.produtoId)
    );
  }, [produtosDisponiveis, venda.produtoId]);

  const maxDiscountAllowed = isAdmin
    ? maxDiscountPercentAdmin
    : maxDiscountPercentLoja;

  const descontoPercentualAplicado = Math.min(
    normalizeDiscount(venda.descontoPercentual),
    maxDiscountAllowed
  );

  const valorBase = Number(produtoSelecionado?.preco || 0);
  const valorDesconto = (valorBase * descontoPercentualAplicado) / 100;
  const totalLiquido = Math.max(valorBase - valorDesconto, 0);
  const valorRecebido = Number(venda.valorRecebido || 0);
  const troco = isCashPayment(venda.formaPagamento)
    ? Math.max(valorRecebido - totalLiquido, 0)
    : 0;

  const descontoFoiLimitado =
    Number(venda.descontoPercentual || 0) > maxDiscountAllowed;

  const vendedorBloqueado = !isAdmin && Boolean(usuarioLogado?.nome);

  function atualizarCampo(campo, valor) {
    setErrorMessage("");
    setSuccessHint("");

    setVenda((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  }

  function handleSelecionarProduto(produtoId) {
    atualizarCampo("produtoId", produtoId);
  }

  function handleChangeCPF(event) {
    atualizarCampo("clienteCPF", formatCPF(event.target.value));
  }

  function handleChangeTelefone(event) {
    atualizarCampo("clienteTelefone", formatPhone(event.target.value));
  }

  function handleChangeDesconto(event) {
    atualizarCampo("descontoPercentual", normalizeDiscount(event.target.value));
  }

  function handleChangeValorRecebido(event) {
    const raw = event.target.value.replace(",", ".");
    atualizarCampo("valorRecebido", raw);
  }

  function validateForm() {
    if (!venda.vendedor.trim()) {
      return "Selecione o vendedor responsável pela venda.";
    }

    if (!venda.produtoId) {
      return "Selecione um item do estoque para continuar.";
    }

    if (!venda.clienteNome.trim()) {
      return "Informe o nome do cliente.";
    }

    if (venda.clienteCPF && onlyNumbers(venda.clienteCPF).length !== 11) {
      return "O CPF informado está incompleto.";
    }

    if (
      venda.clienteTelefone &&
      ![10, 11].includes(onlyNumbers(venda.clienteTelefone).length)
    ) {
      return "O telefone informado está incompleto.";
    }

    if (!venda.formaPagamento.trim()) {
      return "Selecione um método de pagamento.";
    }

    if (isCashPayment(venda.formaPagamento)) {
      if (!venda.valorRecebido && totalLiquido > 0) {
        return "Informe o valor recebido em dinheiro.";
      }

      if (valorRecebido < totalLiquido) {
        return "O valor recebido não pode ser menor que o total líquido.";
      }
    }

    if (descontoPercentualAplicado > 0 && !isAdmin && descontoPercentualAplicado > maxDiscountPercentLoja) {
      return `Para perfil LOJA, o desconto máximo é ${maxDiscountPercentLoja}%.`;
    }

    return "";
  }

  const formError = validateForm();
  const formValido = !formError && Boolean(produtoSelecionado);

  function handleFinalizar() {
    const validationError = validateForm();

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    const payloadVenda = {
      vendedor: venda.vendedor,
      produtoId: venda.produtoId,
      produtoModelo: produtoSelecionado?.modelo || "",
      produtoCategoria: produtoSelecionado?.categoria || "",
      clienteNome: venda.clienteNome.trim(),
      clienteCPF: onlyNumbers(venda.clienteCPF),
      clienteTelefone: onlyNumbers(venda.clienteTelefone),
      formaPagamento: venda.formaPagamento,
      parcelas: isCardPayment(venda.formaPagamento) ? venda.parcelas : "1x",
      descontoPercentual: descontoPercentualAplicado,
      valorBase,
      valorDesconto,
      totalLiquido,
      valorRecebido: isCashPayment(venda.formaPagamento) ? valorRecebido : totalLiquido,
      troco: isCashPayment(venda.formaPagamento) ? troco : 0,
      observacoes: venda.observacoes.trim(),
      dataHora: new Date().toISOString(),
      status: "FINALIZADA",
      origem: "PDV_LOJA",
      roleResponsavel: roleNormalized,
    };

    setSuccessHint("Venda validada e pronta para ser registrada.");

    onFinalizarVenda?.(payloadVenda);
    onClose?.();
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 font-sans text-left">
      <div
        className="absolute inset-0 bg-[#064e3b]/60 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-6xl overflow-hidden animate-slide-up border border-emerald-50 flex flex-col max-h-[95vh]">
        {/* HEADER */}
        <div className="bg-[#064e3b] px-6 sm:px-8 py-6 text-white flex justify-between items-start gap-4">
          <div>
            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-[#b49157]">
              Executive POS
            </p>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter leading-none mt-1">
              Checkout de Ativo
            </h2>

            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-white/10 text-[10px] font-black uppercase tracking-widest text-white/80">
                {isAdmin ? "Modo Gerencial" : "Modo Loja"}
              </span>

              <span className="px-3 py-1 rounded-full bg-white/10 text-[10px] font-black uppercase tracking-widest text-white/80">
                Desconto máximo: {maxDiscountAllowed}%
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-white/50 hover:text-white transition-colors mt-1"
            aria-label="Fechar modal"
          >
            <X size={30} />
          </button>
        </div>

        {/* CORPO */}
        <div className="grid grid-cols-1 xl:grid-cols-[1.25fr_0.95fr] gap-0 overflow-hidden bg-[#f6f6f4]">
          {/* COLUNA ESQUERDA */}
          <div className="p-6 sm:p-7 overflow-y-auto custom-scrollbar border-r border-slate-200/70 space-y-6">
            {/* BUSCA E PRODUTO */}
            <section className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <InputLabel>Selecionar item do estoque</InputLabel>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    escolha um ativo disponível para faturamento
                  </p>
                </div>

                <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {produtosDisponiveis.length} disponíveis
                </div>
              </div>

              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={buscaProduto}
                  onChange={(e) => setBuscaProduto(e.target.value)}
                  placeholder="Buscar por código, modelo ou categoria..."
                  className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-5 py-4 text-slate-700 text-sm font-bold outline-none focus:border-[#b49157]"
                />
              </div>

              <div className="max-h-[320px] overflow-y-auto custom-scrollbar pr-1 space-y-3">
                {produtosFiltrados.length > 0 ? (
                  produtosFiltrados.map((produto) => (
                    <ProdutoCard
                      key={produto.id}
                      produto={produto}
                      selecionado={String(venda.produtoId) === String(produto.id)}
                      onSelect={handleSelecionarProduto}
                    />
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
                    <Boxes size={28} className="mx-auto mb-3 text-slate-300" />
                    <p className="text-xs font-black uppercase text-slate-400">
                      Nenhum item encontrado na busca
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* DADOS DE VENDA */}
            <section className="space-y-4">
              <div>
                <InputLabel>Responsável e pagamento</InputLabel>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <InputLabel>Vendedor</InputLabel>
                  <div className="relative">
                    <select
                      value={venda.vendedor}
                      onChange={(e) => atualizarCampo("vendedor", e.target.value)}
                      disabled={vendedorBloqueado}
                      className={`w-full appearance-none border rounded-2xl px-5 py-4 pr-12 text-[#064e3b] text-base font-black outline-none focus:border-[#b49157] ${
                        vendedorBloqueado
                          ? "bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed"
                          : "bg-white border-slate-200"
                      }`}
                    >
                      {vendedores.map((vendedor) => (
                        <option key={vendedor.id || vendedor.nome} value={vendedor.nome}>
                          {vendedor.nome}
                        </option>
                      ))}
                    </select>

                    {isAdmin ? (
                      <Crown
                        size={18}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#064e3b]"
                      />
                    ) : (
                      <ShieldCheck
                        size={18}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#064e3b]"
                      />
                    )}
                  </div>
                </div>

                <div>
                  <InputLabel>Método de pagamento</InputLabel>
                  <div className="relative">
                    <select
                      value={venda.formaPagamento}
                      onChange={(e) =>
                        atualizarCampo("formaPagamento", e.target.value)
                      }
                      className="w-full appearance-none bg-white border border-slate-200 rounded-2xl px-5 py-4 pr-12 text-[#064e3b] text-base font-black outline-none focus:border-[#b49157]"
                    >
                      {METODOS_PAGAMENTO.map((metodo) => (
                        <option key={metodo} value={metodo}>
                          {metodo}
                        </option>
                      ))}
                    </select>

                    {isCashPayment(venda.formaPagamento) ? (
                      <Banknote
                        size={18}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#064e3b]"
                      />
                    ) : (
                      <CreditCard
                        size={18}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#064e3b]"
                      />
                    )}
                  </div>
                </div>
              </div>

              {isCardPayment(venda.formaPagamento) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <InputLabel>Parcelamento</InputLabel>
                    <select
                      value={venda.parcelas}
                      onChange={(e) => atualizarCampo("parcelas", e.target.value)}
                      className="w-full appearance-none bg-white border border-slate-200 rounded-2xl px-5 py-4 text-[#064e3b] text-base font-black outline-none focus:border-[#b49157]"
                    >
                      {PARCELAS_CARTAO.map((parcela) => (
                        <option key={parcela} value={parcela}>
                          {parcela}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <InputLabel>Desconto (%)</InputLabel>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max={maxDiscountAllowed}
                        step="1"
                        value={venda.descontoPercentual}
                        onChange={handleChangeDesconto}
                        className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 pr-12 text-[#064e3b] text-base font-black outline-none focus:border-[#b49157]"
                      />
                      <BadgePercent
                        size={18}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {!isCardPayment(venda.formaPagamento) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <InputLabel>Desconto (%)</InputLabel>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max={maxDiscountAllowed}
                        step="1"
                        value={venda.descontoPercentual}
                        onChange={handleChangeDesconto}
                        className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 pr-12 text-[#064e3b] text-base font-black outline-none focus:border-[#b49157]"
                      />
                      <BadgePercent
                        size={18}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                    </div>
                  </div>

                  {isCashPayment(venda.formaPagamento) ? (
                    <div>
                      <InputLabel>Valor recebido</InputLabel>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={venda.valorRecebido}
                          onChange={handleChangeValorRecebido}
                          placeholder="0,00"
                          className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 pr-12 text-[#064e3b] text-base font-black outline-none focus:border-[#b49157]"
                        />
                        <Calculator
                          size={18}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                      </div>
                    </div>
                  ) : (
                    <div />
                  )}
                </div>
              )}
            </section>

            {/* CLIENTE */}
            <section className="space-y-4">
              <div>
                <InputLabel>Dados do cliente</InputLabel>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <InputLabel>Nome do cliente</InputLabel>
                  <div className="relative">
                    <input
                      type="text"
                      value={venda.clienteNome}
                      onChange={(e) =>
                        atualizarCampo("clienteNome", e.target.value)
                      }
                      placeholder="Nome completo"
                      className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 pr-12 text-[#064e3b] text-base font-bold outline-none focus:border-[#b49157]"
                    />
                    <UserRound
                      size={18}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <InputLabel>CPF</InputLabel>
                  <div className="relative">
                    <input
                      type="text"
                      value={venda.clienteCPF}
                      onChange={handleChangeCPF}
                      placeholder="000.000.000-00"
                      className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 pr-12 text-[#064e3b] text-base font-bold outline-none focus:border-[#b49157]"
                    />
                    <IdCard
                      size={18}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <InputLabel>Telefone</InputLabel>
                  <div className="relative">
                    <input
                      type="text"
                      value={venda.clienteTelefone}
                      onChange={handleChangeTelefone}
                      placeholder="(83) 99999-9999"
                      className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 pr-12 text-[#064e3b] text-base font-bold outline-none focus:border-[#b49157]"
                    />
                    <Phone
                      size={18}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <InputLabel>Observações</InputLabel>
                  <div className="relative">
                    <textarea
                      value={venda.observacoes}
                      onChange={(e) =>
                        atualizarCampo("observacoes", e.target.value)
                      }
                      rows={4}
                      placeholder="Ex: entrega combinada para sexta, cliente pediu contato por WhatsApp..."
                      className="w-full resize-none bg-white border border-slate-200 rounded-2xl px-5 py-4 pr-12 text-[#064e3b] text-base font-bold outline-none focus:border-[#b49157]"
                    />
                    <FileText
                      size={18}
                      className="absolute right-4 top-4 text-slate-400"
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* COLUNA DIREITA */}
          <div className="p-6 sm:p-7 overflow-y-auto custom-scrollbar bg-[#f0f0ec] space-y-5">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.22em] mb-3">
                Resumo financeiro da venda
              </p>
            </div>

            <div className="bg-[#071437] p-6 rounded-[2rem] text-white relative overflow-hidden shadow-xl">
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-[#b49157]/10" />
              <div className="relative z-10 space-y-5">
                <div className="pb-4 border-b border-white/10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#b49157]">
                    Item selecionado
                  </p>
                  <p className="mt-2 text-lg font-black uppercase break-words">
                    {produtoSelecionado?.modelo || "Nenhum item selecionado"}
                  </p>
                  {produtoSelecionado?.id ? (
                    <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Código: {produtoSelecionado.id}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-3">
                  <SummaryLine
                    label="Vendedor"
                    value={venda.vendedor || "--"}
                  />
                  <SummaryLine
                    label="Pagamento"
                    value={venda.formaPagamento || "--"}
                  />
                  {isCardPayment(venda.formaPagamento) && (
                    <SummaryLine
                      label="Parcelas"
                      value={venda.parcelas || "1x"}
                    />
                  )}
                  <SummaryLine
                    label="Valor base"
                    value={formatCurrency(valorBase)}
                  />
                  <SummaryLine
                    label="Desconto"
                    value={`${descontoPercentualAplicado}%`}
                    valueClassName="text-rose-400"
                  />
                  <SummaryLine
                    label="Valor do desconto"
                    value={formatCurrency(valorDesconto)}
                    valueClassName="text-rose-400"
                  />

                  {isCashPayment(venda.formaPagamento) && (
                    <>
                      <SummaryLine
                        label="Valor recebido"
                        value={formatCurrency(valorRecebido)}
                      />
                      <SummaryLine
                        label="Troco"
                        value={formatCurrency(troco)}
                        valueClassName="text-emerald-400"
                      />
                    </>
                  )}
                </div>

                <div className="pt-5 border-t border-white/10 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Total líquido
                    </p>
                    <p className="mt-2 text-4xl font-black tracking-tighter text-[#d6ae67]">
                      {formatCurrency(totalLiquido)}
                    </p>
                  </div>

                  <div className="px-3 py-2 rounded-xl bg-emerald-900/70 text-emerald-300 text-[10px] font-black uppercase tracking-wide whitespace-nowrap">
                    Pronto para receber
                  </div>
                </div>
              </div>
            </div>

            <ValidationMessage message={errorMessage} />

            {descontoFoiLimitado && (
              <ValidationMessage
                message={`O desconto foi ajustado automaticamente para o limite permitido de ${maxDiscountAllowed}%.`}
              />
            )}

            {!errorMessage && formValido && (
              <SuccessMessage message="Checkout validado. Você já pode finalizar a venda." />
            )}

            <div className="bg-white rounded-[2rem] border border-slate-200 p-5 space-y-4">
              <div className="flex items-center gap-2">
                <ReceiptText size={18} className="text-[#b49157]" />
                <p className="text-xs font-black uppercase tracking-widest text-[#064e3b]">
                  Checklist do checkout
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold text-slate-500">
                    Produto selecionado
                  </span>
                  {venda.produtoId ? (
                    <CheckCircle2 size={16} className="text-emerald-600" />
                  ) : (
                    <AlertTriangle size={16} className="text-amber-500" />
                  )}
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold text-slate-500">
                    Cliente identificado
                  </span>
                  {venda.clienteNome.trim() ? (
                    <CheckCircle2 size={16} className="text-emerald-600" />
                  ) : (
                    <AlertTriangle size={16} className="text-amber-500" />
                  )}
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold text-slate-500">
                    Pagamento definido
                  </span>
                  {venda.formaPagamento ? (
                    <CheckCircle2 size={16} className="text-emerald-600" />
                  ) : (
                    <AlertTriangle size={16} className="text-amber-500" />
                  )}
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold text-slate-500">
                    Valor validado
                  </span>
                  {totalLiquido >= 0 && produtoSelecionado ? (
                    <CheckCircle2 size={16} className="text-emerald-600" />
                  ) : (
                    <AlertTriangle size={16} className="text-amber-500" />
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <button
                type="button"
                onClick={handleFinalizar}
                disabled={!formValido}
                className="w-full py-4 bg-[#064e3b] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg hover:bg-[#08634b] transition-colors disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ReceiptText size={16} />
                Finalizar e gerar recibo
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-colors"
              >
                Cancelar operação
              </button>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="bg-slate-50 py-3 border-t border-slate-100">
          <p className="text-[7px] font-black text-slate-300 uppercase tracking-[0.5em] text-center">
            Analu Executive POS • Rickman Brown
          </p>
        </div>
      </div>
    </div>
  );
}

export default ModalPDV;