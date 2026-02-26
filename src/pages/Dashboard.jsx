/**
 * @file Dashboard.jsx
 * @description Core do Portal Executivo - Conectado à API Java/Postgres
 * @author © 2026 Rickman Brown • Software Engineering
 */

import { useState, useEffect } from "react";
import "../App.css";
import ModalNovoEstofado from "../components/modals/ModalNovoEstofado";
import ModalEntradaMateriaPrima from "../components/modals/ModalEntradaMateriaPrima";
import ModalSaidaProdutoVenda from "../components/modals/ModalSaidaProdutoVenda";
import ModalSaidaProdutoEstofado from "../components/modals/ModalSaidaProdutoEstofado";
import ModalPerdaProducao from "../components/modals/ModalPerdaProducao";
import ModalConsultaGeral from "../components/modals/ModalConsultaGeral";

function Dashboard() {
  const [modalAberto, setModalAberto] = useState(null);
  
  // 1. ESTADO PARA DADOS REAIS (Inicia zerado aguardando o Backend)
  const [kpis, setKpis] = useState({
    showroom: 0,
    producao: 0,
    criticos: 0,
    receita: 0
  });

  const [statusSistema, setStatusSistema] = useState("Conectando...");
  const [corStatus, setCorStatus] = useState("bg-slate-300");

  // 2. FUNÇÃO QUE BUSCA DADOS NO JAVA (GET)
  const carregarIndicadores = async () => {
    try {
      // Nota: Precisará criar este endpoint no Java depois
      const response = await fetch("http://localhost:8080/api/dashboard/resumo");
      
      if (response.ok) {
        const dados = await response.json();
        setKpis({
          showroom: dados.totalShowroom || 0,
          producao: dados.totalProducao || 0,
          criticos: dados.totalCriticos || 0,
          receita: dados.totalReceita || 0
        });
        setStatusSistema("Operacional");
        setCorStatus("bg-emerald-500");
      } else {
        setStatusSistema("Erro API");
        setCorStatus("bg-rose-500");
      }
    } catch (error) {
      console.error("Erro ao conectar com o backend:", error);
      setStatusSistema("Offline");
      setCorStatus("bg-rose-500");
      
      // MOCK DE FALLBACK (Para não ficar zerado se o Java estiver desligado)
      setKpis({ showroom: 1240, producao: 18, criticos: 5, receita: 45200 });
    }
  };

  // 3. EFEITO DE CARREGAMENTO INICIAL
  useEffect(() => {
    carregarIndicadores();
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, []);

  const fecharModal = () => {
    setModalAberto(null);
    carregarIndicadores(); 
  };

  const dataAtual = new Date().toLocaleDateString("pt-BR", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="fixed inset-0 bg-[#f8f9f5] flex flex-col overflow-hidden px-6 md:px-10 py-6 animate-fade-in font-sans">

      {/* BACKGROUND DECOR */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-100/20 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      {/* HEADER COMPACTO */}
      <header className="shrink-0 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-[#064e3b] uppercase tracking-tighter leading-none">
              Analu <span className="text-[#b49157] font-light italic text-2xl">Portal</span>
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="h-0.5 w-0.5 rounded-full bg-slate-300"></div>
              <p className="text-[12px] font-bold text-[#b49157] uppercase">{dataAtual}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/50 border border-slate-200 p-2 rounded-xl">
            <div className="text-right hidden sm:block">
              <p className="text-[8px] font-black text-slate-400 uppercase leading-none">Status Conexão</p>
              <p className={`text-[9px] font-bold uppercase ${statusSistema === "Offline" ? "text-rose-600" : "text-emerald-600"}`}>
                {statusSistema}
              </p>
            </div>
            <div className={`w-2 h-2 ${corStatus} rounded-full animate-pulse`}></div>
          </div>
        </div>
      </header>

      {/* CONTEÚDO */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* INDICADORES RÁPIDOS */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-9 shrink-0">
          {[
            { label: "Showroom", val: kpis.showroom, color: "border-[#064e3b]", text: "text-[#064e3b]" },
            { label: "Produção", val: kpis.producao, color: "border-slate-300", text: "text-slate-700" },
            { label: "Críticos", val: kpis.criticos, color: "border-rose-500", text: "text-rose-600" },
            { label: "Receita", val: `R$ ${(kpis.receita / 1000).toFixed(1)}k`, color: "border-[#b49157]", text: "text-[#b49157]" }
          ].map((item, i) => (
            <div key={i} className={`bg-white/80 p-4 border-b-2 ${item.color} rounded-xl shadow-sm transition-transform hover:translate-y-[-2px]`}>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">{item.label}</label>
              <p className={`text-2xl font-black ${item.text} tracking-tighter`}>{item.val}</p>
            </div>
          ))}
        </section>

        {/* DIVISOR */}
        <div className="flex items-center gap-4 mb-4 shrink-0">
          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#064e3b]/30">Operations Center</span>
          <div className="h-px flex-1 bg-slate-200"></div>
        </div>

        {/* GRID DE AÇÕES */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-1 pb-8 px-4 overflow-y-auto">

          <ActionCard
            title="Novo Modelo" subtitle="Engenharia" domain="Eng"
            icon="＋" color="hover:bg-emerald-50" accent="text-emerald-600" bgAccent="bg-emerald-50"
            onClick={() => setModalAberto("novo-estofado")}
          />

          <ActionCard
            title="Entrada Insumos" subtitle="Suprimentos" domain="Supply"
            icon="↓" color="hover:bg-slate-50" accent="text-slate-600" bgAccent="bg-slate-50"
            onClick={() => setModalAberto("entrada-materia")}
          />

          <ActionCard
            title="Logística" subtitle="Fábrica → Loja" domain="Log"
            icon="⇄" color="hover:bg-amber-50" accent="text-[#b49157]" bgAccent="bg-amber-50"
            onClick={() => setModalAberto("saida-fabrica-loja")}
          />

          {/* BOTÃO VENDA */}
          <button
            onClick={() => setModalAberto("saida-venda")}
            className="group relative flex flex-col justify-between p-5 bg-[#064e3b] rounded-2xl text-left transition-all duration-300 hover:shadow-lg hover:brightness-110"
          >
            <div className="flex justify-between items-start">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white text-sm">＄</div>
              <span className="text-[7px] font-black px-2 py-1 rounded-full bg-white/10 text-emerald-100 tracking-widest uppercase font-mono">Revenue</span>
            </div>
            <div>
              <span className="block text-lg font-black text-white leading-tight italic">Registrar Venda</span>
            </div>
          </button>

          <ActionCard
            title="Relatar Avaria" subtitle="Perdas" domain="Quality"
            icon="!" color="hover:bg-rose-50" accent="text-rose-600" bgAccent="bg-rose-50"
            onClick={() => setModalAberto("perda-producao")}
          />

          <ActionCard
            title="Busca Global" subtitle="Consultar" domain="Search"
            icon="🔍" color="hover:bg-slate-100" accent="text-slate-900" bgAccent="bg-slate-200"
            onClick={() => setModalAberto("consulta-geral")}
          />

        </section>
      </main>

      {/* FOOTER */}
      <footer className="shrink-0 pt-4 border-t border-slate-200 flex justify-between items-center text-[7px] font-black text-slate-400 uppercase tracking-[0.3em]">
        <p>Analu Executive </p>
        <div className="flex items-center gap-2">
          <div className={`w-1 h-1 rounded-full ${corStatus}`}></div>
          <span>Cloud Active</span>
        </div>
      </footer>

      {/* MODAIS - onSuccess para recarregar os dados ao fechar */}
      {modalAberto === "novo-estofado" && <ModalNovoEstofado onClose={fecharModal} onSuccess={carregarIndicadores} />}
      {modalAberto === "entrada-materia" && <ModalEntradaMateriaPrima onClose={fecharModal} onSuccess={carregarIndicadores} />}
      {modalAberto === "saida-fabrica-loja" && <ModalSaidaProdutoEstofado onClose={fecharModal} onSuccess={carregarIndicadores} />}
      
      {modalAberto === "saida-venda" && (
        <ModalSaidaProdutoVenda
          onClose={fecharModal}
          onSuccess={carregarIndicadores}
        />
      )}

      {modalAberto === "perda-producao" && <ModalPerdaProducao onClose={fecharModal} onSuccess={carregarIndicadores} />}
      {modalAberto === "consulta-geral" && <ModalConsultaGeral onClose={fecharModal} />}
    </div>
  );
}

// Componente Auxiliar de Card
function ActionCard({ title, subtitle, domain, icon, color, accent, bgAccent, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`group flex flex-col justify-between p-5 bg-white border border-slate-100 rounded-2xl text-left transition-all duration-300 ${color} hover:shadow-md`}
    >
      <div className="flex justify-between items-start">
        <div className={`w-8 h-8 rounded-lg ${bgAccent} flex items-center justify-center ${accent} text-sm font-bold`}>
          {icon}
        </div>
        <span className={`text-[7px] font-black px-2 py-1 rounded-full ${bgAccent} ${accent} tracking-widest uppercase`}>
          {domain}
        </span>
      </div>
      <div>
        <span className="block text-md font-black text-slate-800 leading-tight group-hover:text-[#064e3b] transition-colors">
          {title}
        </span>
        <p className="text-[9px] text-slate-400 font-medium">{subtitle}</p>
      </div>
    </button>
  );
}

export default Dashboard;