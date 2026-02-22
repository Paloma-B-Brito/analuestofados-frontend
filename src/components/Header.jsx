/**
 * @file Header.jsx
 * @description Navegação ERP Enterprise
 * @author © 2026 Minister Noiret • Software Engineering
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronDown, Menu, X, LogOut, 
  BarChart2, PieChart, Activity,
  Factory, Package, Wrench, ClipboardList, Truck,
  ShoppingBag, Users, CreditCard, Tag, 
  DollarSign, TrendingUp, FileText, Wallet,
  LayoutDashboard, Ruler 
} from 'lucide-react';

// --- ESTRUTURA DO ERP ---
const menuStructure = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <BarChart2 size={16} />,
    color: 'group-hover:text-emerald-300',
    role: 'ADMIN',
    subItems: [
      { label: 'Visão Geral (Real-Time)', page: 'Dashboard', icon: <Activity size={14} /> },
      { label: 'Indicadores (KPIs)', page: 'KPIs', icon: <PieChart size={14} /> },
      { label: 'Relatórios Gerenciais', page: 'Relatorios', icon: <FileText size={14} /> }
    ]
  },
  {
    id: 'fabrica',
    label: 'Fábrica',
    icon: <Factory size={16} />,
    color: 'group-hover:text-blue-300',
    role: 'FABRICA', 
    subItems: [
      { label: 'Dashboard Fábrica', page: 'DashboardFabrica', icon: <LayoutDashboard size={14} /> },
      { label: 'Engenharia de Produto', page: 'Engenharia', icon: <Ruler size={14} /> },
      { label: 'Linha de Produção (PCP)', page: 'Estoque', icon: <Factory size={14} /> },
      { label: 'Estoque de Matéria-Prima', page: 'Suprimentos', icon: <Package size={14} /> },
      { label: 'Controle de Qualidade', page: 'Qualidade', icon: <ClipboardList size={14} /> },
      { label: 'Manutenção de Ativos', page: 'Manutencao', icon: <Wrench size={14} /> }
    ]
  },
  {
    id: 'loja',
    label: 'Loja',
    icon: <ShoppingBag size={16} />,
    color: 'group-hover:text-rose-300',
    role: 'LOJA',
    subItems: [
      { label: 'Dashboard Loja', page: 'DashboardLoja', icon: <LayoutDashboard size={14} /> },
      { label: 'Showroom Digital', page: 'Loja', icon: <Tag size={14} /> },
      { label: 'PDV (Frente de Caixa)', page: 'PDV', icon: <CreditCard size={14} /> },
      { label: 'Gestão de Pedidos', page: 'Pedidos', icon: <ClipboardList size={14} /> },
      { label: 'Logística & Entregas', page: 'Entregas', icon: <Truck size={14} /> },
      { label: 'CRM (Clientes)', page: 'Clientes', icon: <Users size={14} /> }
    ]
  },
  {
    id: 'financeiro',
    label: 'Financeiro',
    icon: <DollarSign size={16} />,
    color: 'group-hover:text-[#b49157]',
    role: 'ADMIN',
    subItems: [
      { label: 'Dashboard Financeiro', page: 'DashboardFinanceiro', icon: <LayoutDashboard size={14} /> },
      { label: 'Engenharia de Custos', page: 'Financeiro', icon: <Wrench size={14} /> },
      { label: 'Fluxo de Caixa', page: 'FluxoCaixa', icon: <TrendingUp size={14} /> },
      { label: 'DRE Gerencial', page: 'DRE', icon: <FileText size={14} /> },
      { label: 'Contas a Pagar/Receber', page: 'Contas', icon: <Wallet size={14} /> }
    ]
  }
];

function Header({ paginaAtual, setPagina, onLogout, userRole }) {
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);
  const [dropdownAtivo, setDropdownAtivo] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownAtivo(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavegar = (pagina) => {
    setPagina(pagina);
    setMenuMobileAberto(false);
    setDropdownAtivo(null);
  };

  const toggleDropdown = (id) => {
    setDropdownAtivo(dropdownAtivo === id ? null : id);
  };

  const menuFiltrado = menuStructure.filter(section => {
    if (userRole === 'ADMIN') return true; 
    return section.role === userRole || section.id === 'dashboard'; 
  });

  return (
    <header className="sticky top-0 z-50 bg-[#064e3b] border-b border-white/10 shadow-2xl font-sans transition-colors duration-300">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 h-20 flex justify-between items-center">
        <div className="flex items-center gap-4 z-50 cursor-pointer group" onClick={() => handleNavegar('Dashboard')}>
          <div className="w-10 h-10 bg-[#b49157] rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-black/20 border border-white/20 group-hover:scale-105 transition-transform">
            A
          </div>
          <div className="hidden md:block leading-none">
            <h1 className="text-lg font-black tracking-tighter text-white">ANALU</h1>
            <p className="text-[9px] text-[#b49157] uppercase tracking-[0.35em] font-bold mt-0.5 group-hover:tracking-[0.45em] transition-all">Executive Portal</p>
          </div>
        </div>

        {/* --- 2. MENU DESKTOP --- */}
        <nav className="hidden lg:flex items-center gap-16" ref={dropdownRef}>
          {menuFiltrado.map((section) => (
            <div key={section.id} className="relative group">
              <button 
                onClick={() => toggleDropdown(section.id)}
                className={`flex items-center gap-3 px-2 py-2 text-[11px] font-bold uppercase tracking-widest transition-all duration-300 relative
                  ${dropdownAtivo === section.id ? 'text-white' : 'text-emerald-100/60 hover:text-white'}
                `}
              >
                <span className={`transition-colors duration-300 ${dropdownAtivo === section.id ? 'text-[#b49157]' : 'text-emerald-100/40'} ${section.color}`}>
                  {section.icon}
                </span>
                
                {section.label}
                
                <ChevronDown size={12} className={`transition-transform duration-300 opacity-50 ${dropdownAtivo === section.id ? 'rotate-180 text-[#b49157] opacity-100' : ''}`} />
                <span className={`absolute bottom-0 left-0 h-[2px] bg-[#b49157] transition-all duration-300 ${dropdownAtivo === section.id ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </button>
              {dropdownAtivo === section.id && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-5 w-72 bg-[#064e3b]/95 backdrop-blur-xl border border-white/10 border-t-[#b49157] border-t-2 rounded-b-xl rounded-t-sm shadow-2xl overflow-hidden animate-fade-in-down z-50">
                  <div className="py-2">
                    <p className="px-5 py-3 text-[9px] font-black text-emerald-100/30 uppercase tracking-widest border-b border-white/5 mb-2">
                      Módulos de {section.label}
                    </p>
                    {section.subItems.map((subItem, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleNavegar(subItem.page)}
                        className={`w-full text-left px-5 py-3 text-xs font-medium transition-all flex items-center gap-3 group/item
                          ${paginaAtual === subItem.page 
                            ? 'bg-white/10 text-[#b49157]' 
                            : 'text-emerald-100/70 hover:bg-white/5 hover:text-white hover:pl-7'}
                        `}
                      >
                        <span className={paginaAtual === subItem.page ? 'text-[#b49157]' : 'text-emerald-100/40 group-hover/item:text-white'}>
                          {subItem.icon}
                        </span>
                        {subItem.label}
                        {paginaAtual === subItem.page && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#b49157] shadow-[0_0_8px_#b49157]"></div>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* --- 3. PERFIL & SAIR --- */}
        <div className="flex items-center gap-8">
          <div className="hidden xl:flex flex-col text-right leading-tight border-r border-white/10 pr-6">
            <p className="text-[9px] font-black uppercase text-[#b49157] tracking-wider mb-0.5">{userRole}</p>
            {/* Atualizado para Minister Noiret */}
            <p className="text-[10px] font-bold text-emerald-100/80">Minister Noiret</p>
          </div>

          <button 
            onClick={onLogout} 
            className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-black/20 hover:bg-rose-500/20 border border-white/5 hover:border-rose-500/30 rounded-xl group transition-all duration-300"
          >
            <LogOut size={14} className="text-emerald-100/50 group-hover:text-rose-400 transition-colors" />
            <span className="text-[10px] font-black uppercase text-emerald-100/50 group-hover:text-rose-400 transition-colors">Sair</span>
          </button>
          <button 
            onClick={() => setMenuMobileAberto(!menuMobileAberto)}
            className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            {menuMobileAberto ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* --- 4. MENU MOBILE--- */}
      <div className={`lg:hidden fixed inset-0 z-40 bg-[#043327]/95 backdrop-blur-xl transition-all duration-300 ${menuMobileAberto ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="flex flex-col h-full pt-24 px-6 pb-6 overflow-y-auto">
          {menuFiltrado.map((section) => (
            <div key={section.id} className="border-b border-white/5 pb-2 mb-2">
              <button onClick={() => toggleDropdown(section.id)} className="w-full flex items-center justify-between py-4 text-sm font-black text-white uppercase tracking-wider">
                <div className="flex items-center gap-3">
                  <span className={section.color.replace('group-hover:', '')}>{section.icon}</span>
                  {section.label}
                </div>
                <ChevronDown size={16} className={`transition-transform ${dropdownAtivo === section.id ? 'rotate-180 text-[#b49157]' : 'text-emerald-100/40'}`} />
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ${dropdownAtivo === section.id ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="pl-4 flex flex-col gap-1 pb-4">
                  {section.subItems.map((subItem, idx) => (
                    <button key={idx} onClick={() => handleNavegar(subItem.page)} className={`w-full text-left py-3 text-xs font-bold border-l-2 pl-4 transition-all flex items-center gap-3 ${paginaAtual === subItem.page ? 'border-[#b49157] text-[#b49157]' : 'border-white/10 text-emerald-100/60'}`}>
                      {subItem.icon}
                      {subItem.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
          <div className="mt-auto pt-8 border-t border-white/10 flex justify-between items-center">
             <div><p className="text-white font-bold text-sm">Minister Noiret</p><p className="text-[#b49157] text-xs">{userRole}</p></div>
             <button onClick={onLogout} className="text-rose-400 text-xs font-black uppercase border border-rose-500/20 px-4 py-2 rounded-lg">Sair</button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;