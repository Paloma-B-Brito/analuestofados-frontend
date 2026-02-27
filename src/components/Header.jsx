/**
 * @file Header.jsx
 * @description Navegação ERP Enterprise
 * @author © 2026 Rickman Brown • Software Engineering
 */

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  ChevronDown,
  Menu,
  X,
  LogOut,
  BarChart2,
  PieChart,
  Activity,
  Factory,
  Package,
  Wrench,
  ClipboardList,
  ShoppingBag,
  Users,
  CreditCard,
  Tag,
  DollarSign,
  TrendingUp,
  FileText,
  Wallet,
  LayoutDashboard,
} from "lucide-react";

// --- ESTRUTURA DO ERP ---
const menuStructure = [
  {
    id: "dashboard",
    label: "Geral",
    icon: <BarChart2 size={15} />,
    color: "group-hover:text-emerald-300",
    roles: ["ADMIN"],
    subItems: [
      { label: "Painel", page: "Dashboard", icon: <Activity size={13} /> },
      { label: "KPIs", page: "KPIs", icon: <PieChart size={13} /> },
      { label: "Relatórios", page: "Relatorios", icon: <FileText size={13} /> },
    ],
  },
  {
    id: "fabrica",
    label: "Fábrica",
    icon: <Factory size={15} />,
    color: "group-hover:text-blue-300",
    roles: ["ADMIN", "FABRICA"],
    subItems: [
      { label: "Painel", page: "DashboardFabricaFuncionarios", icon: <LayoutDashboard size={13} /> },
      { label: "Produção", page: "Estoque", icon: <Factory size={13} /> },
      { label: "Insumos", page: "Suprimentos", icon: <Package size={13} /> },
      { label: "Qualidade", page: "Qualidade", icon: <ClipboardList size={13} /> },
      { label: "Ativos", page: "Manutencao", icon: <Wrench size={13} /> },
    ],
  },
  {
    id: "loja",
    label: "Loja",
    icon: <ShoppingBag size={15} />,
    color: "group-hover:text-rose-300",
    roles: ["ADMIN", "LOJA"],
    subItems: [
      { label: "Painel", page: "DashboardLoja", icon: <LayoutDashboard size={13} /> },
      { label: "Showroom", page: "Loja", icon: <Tag size={13} /> },
      { label: "PDV", page: "PDV", icon: <CreditCard size={13} /> },
      { label: "CRM", page: "Clientes", icon: <Users size={13} /> },
    ],
  },
  {
    id: "financeiro",
    label: "Financeiro",
    icon: <DollarSign size={15} />,
    color: "group-hover:text-[#b49157]",
    roles: ["ADMIN"],
    subItems: [
      { label: "Painel", page: "DashboardFinanceiro", icon: <LayoutDashboard size={13} /> },
      { label: "Custos", page: "Financeiro", icon: <Wrench size={13} /> },
      { label: "Caixa", page: "FluxoCaixa", icon: <TrendingUp size={13} /> },
      { label: "DRE", page: "DRE", icon: <FileText size={13} /> },
      { label: "Contas", page: "Contas", icon: <Wallet size={13} /> },
    ],
  },
];

function Header({ paginaAtual, setPagina, onLogout, userRole }) {
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);
  const [dropdownAtivo, setDropdownAtivo] = useState(null);
  const dropdownRef = useRef(null);

  const isAdmin = userRole === "ADMIN";
  const isLoja = userRole === "LOJA";
  const isFabrica = userRole === "FABRICA";

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownAtivo(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        setMenuMobileAberto(false);
        setDropdownAtivo(null);
      }
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (menuMobileAberto) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = previousOverflow || "";
    }

    return () => {
      document.body.style.overflow = previousOverflow || "";
    };
  }, [menuMobileAberto]);

  const getPaginaInicialPorRole = (role) => {
    if (role === "LOJA") return "DashboardLoja";
    if (role === "FABRICA") return "DashboardFabrica";
    return "Dashboard";
  };

  const handleNavegar = (pagina) => {
    setPagina(pagina);
    setMenuMobileAberto(false);
    setDropdownAtivo(null);
  };

  const toggleDropdown = (id) => {
    setDropdownAtivo((prev) => (prev === id ? null : id));
  };

  const fecharMenuMobile = () => {
    setMenuMobileAberto(false);
  };

  const handleLogoClick = () => {
    handleNavegar(getPaginaInicialPorRole(userRole));
  };

  const menuFiltrado = useMemo(() => {
    return menuStructure.filter((section) => section.roles.includes(userRole));
  }, [userRole]);

  const menuLinearOperacional = useMemo(() => {
    if (isLoja) {
      return (
        menuStructure.find((section) => section.id === "loja")?.subItems || []
      );
    }

    if (isFabrica) {
      return (
        menuStructure.find((section) => section.id === "fabrica")?.subItems || []
      );
    }

    return [];
  }, [isLoja, isFabrica]);

  const getSectionActiveState = (section) => {
    return section.subItems.some((item) => item.page === paginaAtual);
  };

  const getRoleLabel = () => {
    if (isAdmin) return "ADMIN";
    if (isLoja) return "LOJA";
    if (isFabrica) return "FÁBRICA";
    return userRole;
  };

  return (
    <header className="sticky top-0 z-50 bg-[#064e3b] border-b border-white/10 shadow-2xl font-sans">
      <div className="max-w-[1800px] mx-auto px-4 md:px-6 xl:px-8 h-20 flex justify-between items-center gap-3">
        {/* LOGO */}
        <div
          className="flex items-center gap-3 z-50 cursor-pointer group shrink-0"
          onClick={handleLogoClick}
        >
          <div className="w-10 h-10 bg-[#b49157] rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-black/20 border border-white/20 group-hover:scale-105 transition-transform">
            A
          </div>

          <div className="hidden md:block leading-none">
            <h1 className="text-lg font-black tracking-tighter text-white">ANALU</h1>
            <p className="text-[8px] text-[#b49157] uppercase tracking-[0.32em] font-bold mt-0.5">
              Executive Portal
            </p>
          </div>
        </div>

        {/* MENU DESKTOP */}
        {isAdmin ? (
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7" ref={dropdownRef}>
            {menuFiltrado.map((section) => {
              const sectionAtiva = getSectionActiveState(section);

              return (
                <div key={section.id} className="relative group">
                  <button
                    onClick={() => toggleDropdown(section.id)}
                    className={`flex items-center gap-2 px-1.5 py-2 text-[10px] font-black uppercase tracking-[0.18em] transition-all duration-300 relative ${
                      dropdownAtivo === section.id || sectionAtiva
                        ? "text-white"
                        : "text-emerald-100/65 hover:text-white"
                    }`}
                  >
                    <span
                      className={`transition-colors duration-300 ${
                        dropdownAtivo === section.id || sectionAtiva
                          ? "text-[#b49157]"
                          : "text-emerald-100/40"
                      } ${section.color}`}
                    >
                      {section.icon}
                    </span>

                    <span className="whitespace-nowrap">{section.label}</span>

                    <ChevronDown
                      size={11}
                      className={`transition-transform duration-300 opacity-50 ${
                        dropdownAtivo === section.id
                          ? "rotate-180 text-[#b49157] opacity-100"
                          : ""
                      }`}
                    />

                    <span
                      className={`absolute bottom-0 left-0 h-[2px] bg-[#b49157] transition-all duration-300 ${
                        dropdownAtivo === section.id || sectionAtiva
                          ? "w-full"
                          : "w-0 group-hover:w-full"
                      }`}
                    />
                  </button>

                  {dropdownAtivo === section.id && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-64 bg-[#064e3b]/95 backdrop-blur-xl border border-white/10 border-t-[#b49157] border-t-2 rounded-b-xl rounded-t-sm shadow-2xl overflow-hidden animate-fade-in-down z-50">
                      <div className="py-2">
                        <p className="px-4 py-3 text-[8px] font-black text-emerald-100/30 uppercase tracking-widest border-b border-white/5 mb-2">
                          {section.label}
                        </p>

                        {section.subItems.map((subItem, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleNavegar(subItem.page)}
                            className={`w-full text-left px-4 py-3 text-[11px] font-medium transition-all flex items-center gap-3 group/item ${
                              paginaAtual === subItem.page
                                ? "bg-white/10 text-[#b49157]"
                                : "text-emerald-100/70 hover:bg-white/5 hover:text-white hover:pl-5"
                            }`}
                          >
                            <span
                              className={
                                paginaAtual === subItem.page
                                  ? "text-[#b49157]"
                                  : "text-emerald-100/40 group-hover/item:text-white"
                              }
                            >
                              {subItem.icon}
                            </span>

                            {subItem.label}

                            {paginaAtual === subItem.page && (
                              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#b49157] shadow-[0_0_8px_#b49157]"></div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        ) : (
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2">
            {menuLinearOperacional.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleNavegar(item.page)}
                className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-2 rounded-xl text-[9px] xl:text-[10px] font-black uppercase tracking-[0.14em] transition-all border ${
                  paginaAtual === item.page
                    ? "bg-white/10 text-white border-[#b49157]/50"
                    : "bg-transparent text-emerald-100/70 border-transparent hover:bg-white/5 hover:text-white hover:border-white/10"
                }`}
              >
                <span
                  className={
                    paginaAtual === item.page
                      ? "text-[#b49157]"
                      : "text-emerald-100/40"
                  }
                >
                  {item.icon}
                </span>
                <span className="whitespace-nowrap">{item.label}</span>
              </button>
            ))}
          </nav>
        )}

        {/* PERFIL / SAIR / MOBILE */}
        <div className="flex items-center gap-3 xl:gap-5 shrink-0">
          <div className="hidden xl:flex flex-col text-right leading-tight border-r border-white/10 pr-4">
            <p className="text-[8px] font-black uppercase text-[#b49157] tracking-wider mb-0.5">
              {getRoleLabel()}
            </p>
            <p className="text-[10px] font-bold text-emerald-100/80">
              Rickman Brown
            </p>
          </div>

          <button
            onClick={onLogout}
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-black/20 hover:bg-rose-500/20 border border-white/5 hover:border-rose-500/30 rounded-xl group transition-all duration-300"
          >
            <LogOut
              size={13}
              className="text-emerald-100/50 group-hover:text-rose-400 transition-colors"
            />
            <span className="text-[9px] font-black uppercase text-emerald-100/50 group-hover:text-rose-400 transition-colors">
              Sair
            </span>
          </button>

          <button
            onClick={() => setMenuMobileAberto(true)}
            className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* MENU MOBILE */}
      <div
        className={`lg:hidden fixed inset-0 z-[70] transition-all duration-300 ${
          menuMobileAberto
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-[#021f18]/80 backdrop-blur-md"
          onClick={fecharMenuMobile}
        />

        <div
          className={`absolute top-0 right-0 h-full w-full max-w-[360px] bg-[#064e3b] border-l border-white/10 shadow-2xl transition-transform duration-300 ${
            menuMobileAberto ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="h-full flex flex-col">
            {/* TOPO MOBILE */}
            <div className="px-5 py-5 border-b border-white/10">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[8px] font-black uppercase tracking-[0.35em] text-[#b49157]">
                    Navigation
                  </p>
                  <h3 className="mt-2 text-xl font-black text-white uppercase tracking-tight">
                    Menu
                  </h3>
                  <p className="mt-2 text-[10px] font-bold text-emerald-100/60 uppercase tracking-widest">
                    Perfil {getRoleLabel()}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={fecharMenuMobile}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors"
                >
                  <X size={22} />
                </button>
              </div>

              <button
                type="button"
                onClick={fecharMenuMobile}
                className="mt-4 w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest transition-colors"
              >
                Fechar menu
              </button>
            </div>

            {/* CONTEÚDO MOBILE */}
            <div className="flex-1 overflow-y-auto px-5 py-4 custom-scrollbar">
              {isAdmin ? (
                <div className="space-y-2">
                  {menuFiltrado.map((section) => (
                    <div
                      key={section.id}
                      className="border border-white/5 rounded-2xl overflow-hidden bg-white/[0.02]"
                    >
                      <button
                        onClick={() => toggleDropdown(section.id)}
                        className="w-full flex items-center justify-between py-4 px-4 text-sm font-black text-white uppercase tracking-wider"
                      >
                        <div className="flex items-center gap-3">
                          <span className={section.color.replace("group-hover:", "")}>
                            {section.icon}
                          </span>
                          {section.label}
                        </div>

                        <ChevronDown
                          size={16}
                          className={`transition-transform ${
                            dropdownAtivo === section.id
                              ? "rotate-180 text-[#b49157]"
                              : "text-emerald-100/40"
                          }`}
                        />
                      </button>

                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          dropdownAtivo === section.id
                            ? "max-h-[600px] opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="px-3 pb-3 flex flex-col gap-1">
                          {section.subItems.map((subItem, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleNavegar(subItem.page)}
                              className={`w-full text-left py-3 px-3 text-xs font-bold rounded-xl transition-all flex items-center gap-3 ${
                                paginaAtual === subItem.page
                                  ? "bg-white/10 text-[#b49157]"
                                  : "text-emerald-100/70 hover:bg-white/5 hover:text-white"
                              }`}
                            >
                              {subItem.icon}
                              {subItem.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {menuLinearOperacional.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleNavegar(item.page)}
                      className={`w-full text-left py-4 px-4 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-3 border ${
                        paginaAtual === item.page
                          ? "bg-white/10 text-[#b49157] border-[#b49157]/30"
                          : "bg-white/[0.02] text-emerald-100/75 border-white/5 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span
                        className={
                          paginaAtual === item.page
                            ? "text-[#b49157]"
                            : "text-emerald-100/40"
                        }
                      >
                        {item.icon}
                      </span>
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RODAPÉ MOBILE */}
            <div className="px-5 py-5 border-t border-white/10">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="min-w-0">
                  <p className="text-white font-bold text-sm truncate">
                    Rickman Brown
                  </p>
                  <p className="text-[#b49157] text-xs font-black uppercase tracking-widest">
                    {getRoleLabel()}
                  </p>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 text-rose-400 text-xs font-black uppercase border border-rose-500/20 px-4 py-3 rounded-xl hover:bg-rose-500/10 transition-colors"
              >
                <LogOut size={14} />
                Sair da conta
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;