/**
 * @file App.js
 * @description Core da Aplicação - Roteamento Inteligente e Gestão de Módulos
 * @author © 2026 Minister Noiret • Software Engineering
 */

import { useState, useEffect } from "react";

// --- 1. COMPONENTES ESTRUTURAIS ---
import Login from "./pages/Login"; 
import Header from "./components/Header";

// --- 2. PÁGINAS GERAIS (RAIZ DE PAGES) ---
import Dashboard from "./pages/Dashboard";         
import KPIs from "./pages/KPIs";                   
import Relatorios from './pages/Relatorios';       
import Funcionarios from "./pages/Funcionários";   

// --- 3. MÓDULO FÁBRICA (PASTA /fabrica) ---
import DashboardFabrica from './pages/fabrica/DashboardFabrica';
import EstoqueFabrica from "./pages/fabrica/EstoqueFabrica";
import GestaoInsumos from "./pages/fabrica/GestaoInsumos";
import Qualidade from './pages/fabrica/Qualidade';   
import Manutencao from './pages/fabrica/Manutencao'; 
import Engenharia from './pages/fabrica/Engenharia'; // NOVO MÓDULO

// --- 4. MÓDULO LOJA (PASTA /loja) ---
import DashboardLoja from './pages/loja/DashboardLoja';
import AreaLoja from "./pages/loja/AreaLoja";      
import PDV from "./pages/loja/PDV";                
import Pedidos from './pages/loja/Pedidos';        
import Clientes from './pages/loja/Clientes';      
import Entregas from './pages/loja/Entregas';      

// --- 5. MÓDULO FINANCEIRO (PASTA /financeiro) ---
import DashboardFinanceiro from './pages/financeiro/DashboardFinanceiro';
import Financeiro from "./pages/financeiro/Financeiro"; // Engenharia de Custos
import FluxoCaixa from './pages/financeiro/FluxoCaixa'; 
import DRE from './pages/financeiro/DRE';              
import Contas from './pages/financeiro/Contas';         

function App() {
  const [logado, setLogado] = useState(false);
  const [role, setRole] = useState(null); 
  const [pagina, setPagina] = useState("Dashboard");

  // Recupera sessão ao dar F5
  useEffect(() => {
    const savedRole = localStorage.getItem("userRole");
    if (savedRole) {
      setLogado(true);
      setRole(savedRole);
    }
  }, []);

  // Define a página inicial baseada no cargo
  const direcionarUsuario = (userRole) => {
    if (userRole === "LOJA") setPagina("DashboardLoja"); // Começa no Dashboard da Loja
    else if (userRole === "FABRICA") setPagina("DashboardFabrica"); // Começa no Dashboard da Fábrica
    else setPagina("Dashboard"); // Admin começa no Geral
  };

  const handleLoginSuccess = (userRole) => {
    setLogado(true);
    setRole(userRole);
    localStorage.setItem("userRole", userRole);
    direcionarUsuario(userRole);
  };

  const handleLogout = () => {
    localStorage.clear();
    setLogado(false);
    setRole(null);
    setPagina("Dashboard");
  };

  if (!logado) {
    return <Login onLogin={handleLoginSuccess} />;
  }

  /**
   * MOTOR DE RENDERIZAÇÃO (ROUTER)
   * Decide qual componente mostrar na tela central
   */
  function renderizarPagina() {
    
    // --- 1. VISÃO DO VENDEDOR (LOJA) ---
    if (role === "LOJA") {
      switch (pagina) {
        case "DashboardLoja": return <DashboardLoja />; 
        case "Loja": return <AreaLoja userRole={role} />; 
        case "PDV": return <PDV />;                       
        case "Pedidos": return <Pedidos />;               
        case "Clientes": return <Clientes />;             
        case "Entregas": return <Entregas />; 
        default: return <DashboardLoja />;
      }
    }

    // --- 2. VISÃO DO OPERADOR (FÁBRICA) ---
    if (role === "FABRICA") {
      switch (pagina) {
        case "DashboardFabrica": return <DashboardFabrica />; 
        case "Engenharia": return <Engenharia />; // NOVO
        case "Estoque": return <EstoqueFabrica userRole={role} />;
        case "Suprimentos": return <GestaoInsumos />;
        case "Qualidade": return <Qualidade />;
        case "Manutencao": return <Manutencao />;
        default: return <DashboardFabrica />;
      }
    }

    switch (pagina) {
      
      // === MÓDULO DASHBOARD GERAL ===
      case "Dashboard": return <Dashboard />;
      case "KPIs": return <KPIs />;
      case "Relatorios": return <Relatorios />;

      // === MÓDULO FÁBRICA ===
      case "DashboardFabrica": return <DashboardFabrica />;
      case "Engenharia": return <Engenharia />; // NOVO
      case "Estoque": return <EstoqueFabrica userRole={role} />;
      case "Suprimentos": return <GestaoInsumos />;
      case "Qualidade": return <Qualidade />;
      case "Manutencao": return <Manutencao />;

      // === MÓDULO LOJA ===
      case "DashboardLoja": return <DashboardLoja />;
      case "Loja": return <AreaLoja userRole={role} />;
      case "PDV": return <PDV />;
      case "Pedidos": return <Pedidos />;
      case "Clientes": return <Clientes />;
      case "Entregas": return <Entregas />;

      // === MÓDULO FINANCEIRO ===
      case "DashboardFinanceiro": return <DashboardFinanceiro />;
      case "Financeiro": return <Financeiro />; 
      case "FluxoCaixa": return <FluxoCaixa />;
      case "DRE": return <DRE />;
      case "Contas": return <Contas />;

      // === MÓDULO RH ===
      case "Funcionários": return <Funcionarios />;

      default: return <Dashboard />;
    }
  }

  return (
    <div className="min-h-screen bg-[#fcfcf9] flex flex-col font-sans selection:bg-[#b49157]/20">
      
      <Header
        paginaAtual={pagina}
        setPagina={setPagina}
        userRole={role} 
        onLogout={handleLogout}
      />
      <main className="flex-1 w-full max-w-[1920px] mx-auto p-4 md:p-6 animate-fade-in relative">
        {renderizarPagina()}
      </main>

      <footer className="p-4 text-center border-t border-slate-100 bg-white mt-auto">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">
          Analu Executive Suite • Nível de Acesso: <span className="text-[#b49157] font-bold">{role}</span> • © 2026 Minister Noiret
        </p>
      </footer>
    </div>
  );
}

export default App;