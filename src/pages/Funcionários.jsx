/**
 * @file Funcionarios.jsx
 * @description Gestão de Capital Humano - Fixed Version
 * @author © 2026 Minister Noiret • Software Engineering
 */

import { useState, useEffect } from "react";
import "../App.css";

const mockFuncionarios = [
  { id: 1, matricula: "2026-001", nome: "Mestre Ricardo", setor: "FÁBRICA", cargo: "Estofador Master", senha: "ANLU-123", admissao: "10/01/2026" },
  { id: 2, matricula: "2026-002", nome: "Ana Paula", setor: "LOJA", cargo: "Gerente de Vendas", senha: "ANLU-456", admissao: "12/01/2026" },
  { id: 3, matricula: "2026-003", nome: "Carlos Lima", setor: "FÁBRICA", cargo: "Cortador", senha: "ANLU-789", admissao: "15/01/2026" },
  { id: 4, matricula: "2026-004", nome: "Juliana Silva", setor: "LOJA", cargo: "Consultora", senha: "ANLU-000", admissao: "20/01/2026" },
  { id: 5, matricula: "2026-005", nome: "Marcos Viana", setor: "FÁBRICA", cargo: "Armador", senha: "ANLU-111", admissao: "22/01/2026" },
  { id: 6, matricula: "2026-006", nome: "Fernanda Costa", setor: "LOJA", cargo: "Vendas", senha: "ANLU-222", admissao: "25/01/2026" },
  { id: 7, matricula: "2026-007", nome: "Roberto Souza", setor: "FÁBRICA", cargo: "Acabador", senha: "ANLU-333", admissao: "01/02/2026" },
];

const SENHA_MESTRA_ANALU = "analu123";

function ModuloRH() {
  const [colaboradores, setColaboradores] = useState(mockFuncionarios);
  const [filtroBusca, setFiltroBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(null); 
  const [selecionado, setSelecionado] = useState(null);
  const [autenticado, setAutenticado] = useState(false);
  
  const [senhaMestraInput, setSenhaMestraInput] = useState("");
  const [novoMembro, setNovoMembro] = useState({ nome: "", cargo: "", setor: "FÁBRICA", matricula: "", senha: "" });

  const [pagina, setPagina] = useState(1);
  const itensPorPagina = 6;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    };
  }, []);

  const colaboradoresFiltrados = colaboradores.filter(c => 
    c.nome.toLowerCase().includes(filtroBusca.toLowerCase())
  );

  // CORREÇÃO: Definir inicio e fim ANTES de usar na listaExibida
  const totalPaginas = Math.ceil(colaboradoresFiltrados.length / itensPorPagina);
  const inicio = (pagina - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const listaExibida = colaboradoresFiltrados.slice(inicio, fim);

  const fecharModais = () => {
    setModalAberto(null);
    setSenhaMestraInput("");
  };

  const handleOverlayClick = (e) => {
    if (e.target.id === "modal-overlay") fecharModais();
  };

  const gerarMatricula = () => {
    const ano = new Date().getFullYear();
    return `${ano}-${(colaboradores.length + 1).toString().padStart(3, '0')}`;
  };

  const abrirAcessoSeguro = (tipo, func = null) => {
    if (!autenticado) {
      setModalAberto('login');
      setSelecionado({ tipo, func });
    } else {
      if (tipo === 'novo') setNovoMembro({ ...novoMembro, matricula: gerarMatricula() });
      if (tipo === 'ficha') setSelecionado(func);
      setModalAberto(tipo);
    }
  };

  const validarLoginAnalu = () => {
    if (senhaMestraInput === SENHA_MESTRA_ANALU) {
      setAutenticado(true);
      const { tipo, func } = selecionado;
      if (tipo === 'novo') setNovoMembro({ ...novoMembro, matricula: gerarMatricula(), nome: "", cargo: "", senha: "" });
      if (tipo === 'ficha') setSelecionado(func);
      setModalAberto(tipo);
      setSenhaMestraInput("");
    } else {
      alert("Credencial Analu Inválida!");
    }
  };

  const cadastrarMembro = () => {
    if (!novoMembro.nome || !novoMembro.senha) return alert("Dados obrigatórios ausentes!");
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    setColaboradores([...colaboradores, { ...novoMembro, id: Date.now(), admissao: dataAtual }]);
    fecharModais();
  };

  return (
    <div className="fixed inset-0 bg-[#f8f9f5] flex flex-col overflow-hidden px-4 md:px-8 py-6 animate-fade-in font-sans">
      
      <div className="flex-1 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col">
        
        {/* Header RH */}
        <div className="bg-[#064e3b] p-6 text-white shrink-0">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-left w-full md:w-auto">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#b49157] mb-1">Gestão de Pessoas</p>
              <h2 className="text-2xl font-black uppercase tracking-tighter leading-none">Equipe Analu</h2>
            </div>
            
            <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
              <input 
                type="text" 
                placeholder="BUSCAR NOME..."
                className="bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#b49157] placeholder:text-white/30"
                value={filtroBusca}
                onChange={(e) => { setFiltroBusca(e.target.value); setPagina(1); }}
              />
              <button 
                onClick={() => abrirAcessoSeguro('novo')}
                className="bg-[#b49157] text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-[#a38046] transition-all whitespace-nowrap"
              >
                + Novo Cadastro
              </button>
            </div>
          </div>
        </div>

        {/* Grid de Cards */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listaExibida.map((colaborador) => (
              <div key={colaborador.id} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-[#b49157]/30 transition-all text-left group">
                <div className={`inline-block px-3 py-1 rounded-full text-[8px] font-black mb-4 ${colaborador.setor === 'FÁBRICA' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {colaborador.setor}
                </div>
                <h3 className="text-lg font-black text-[#064e3b] uppercase leading-tight">{colaborador.nome}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-6">{colaborador.cargo}</p>
                <button 
                  onClick={() => abrirAcessoSeguro('ficha', colaborador)}
                  className="w-full py-3 bg-slate-50 text-[10px] font-black text-slate-500 uppercase rounded-xl group-hover:bg-[#064e3b] group-hover:text-white transition-colors"
                >
                  Ficha & Credenciais
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Paginação */}
        {totalPaginas > 1 && (
          <div className="p-4 border-t border-slate-100 bg-white flex justify-center items-center gap-6 shrink-0">
            <button 
              disabled={pagina === 1}
              onClick={() => setPagina(p => p - 1)}
              className="text-[10px] font-black text-slate-400 hover:text-[#064e3b] disabled:opacity-20 uppercase"
            >
              〈 Anterior
            </button>
            <span className="text-[10px] font-black text-slate-300 uppercase">Pág {pagina} de {totalPaginas}</span>
            <button 
              disabled={pagina === totalPaginas}
              onClick={() => setPagina(p => p + 1)}
              className="text-[10px] font-black text-slate-400 hover:text-[#064e3b] disabled:opacity-20 uppercase"
            >
              Próxima 〉
            </button>
          </div>
        )}
      </div>

      {/* Modais */}
      {modalAberto && (
        <div id="modal-overlay" onClick={handleOverlayClick} className="fixed inset-0 bg-[#064e3b]/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl relative">
            <button onClick={fecharModais} className="absolute top-6 right-6 text-slate-300 hover:text-slate-600 font-black">✕</button>

            {modalAberto === 'login' && (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#064e3b] text-2xl mx-auto mb-6">🔒</div>
                <h3 className="text-xl font-black text-[#064e3b] uppercase mb-2">Segurança Analu</h3>
                <input 
                  type="password" 
                  autoFocus
                  placeholder="••••"
                  className="w-full border-2 border-slate-100 rounded-2xl px-4 py-4 mb-4 text-center font-black outline-none focus:border-[#b49157] text-2xl"
                  value={senhaMestraInput}
                  onChange={(e) => setSenhaMestraInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && validarLoginAnalu()}
                />
                <button onClick={validarLoginAnalu} className="w-full py-4 bg-[#064e3b] text-white rounded-2xl text-[10px] font-black uppercase">Confirmar</button>
              </div>
            )}

            {modalAberto === 'novo' && (
              <div>
                <h3 className="text-xl font-black text-[#064e3b] uppercase mb-6">Novo Registro</h3>
                <div className="space-y-4">
                  <input type="text" value={novoMembro.matricula} readOnly className="w-full border bg-slate-50 rounded-xl p-3 text-sm font-mono font-black text-slate-500" />
                  <input type="text" placeholder="NOME DO COLABORADOR" className="w-full border rounded-xl p-3 text-xs font-bold outline-none uppercase" onChange={(e) => setNovoMembro({...novoMembro, nome: e.target.value.toUpperCase()})} />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="CARGO" className="border rounded-xl p-3 text-xs font-bold outline-none uppercase" onChange={(e) => setNovoMembro({...novoMembro, cargo: e.target.value.toUpperCase()})} />
                    <select className="border rounded-xl p-3 text-[10px] font-black outline-none" onChange={(e) => setNovoMembro({...novoMembro, setor: e.target.value})}>
                        <option value="FÁBRICA">FÁBRICA</option>
                        <option value="LOJA">LOJA</option>
                    </select>
                  </div>
                  <input type="text" placeholder="SENHA DE ACESSO" className="w-full border rounded-xl p-3 text-xs font-bold outline-none" onChange={(e) => setNovoMembro({...novoMembro, senha: e.target.value})} />
                  <button onClick={cadastrarMembro} className="w-full py-4 bg-[#064e3b] text-white rounded-2xl font-black uppercase text-[10px] mt-4">Gravar Dados</button>
                </div>
              </div>
            )}

            {modalAberto === 'ficha' && selecionado && (
              <div className="text-left">
                <span className="text-[#b49157] text-[10px] font-black uppercase">Perfil Verificado</span>
                <h3 className="text-2xl font-black text-[#064e3b] uppercase mb-6">{selecionado.nome}</h3>
                <div className="space-y-3 bg-slate-50 p-6 rounded-3xl mb-6 text-[11px] font-bold uppercase">
                    <div className="flex justify-between border-b border-slate-200 pb-2"><span className="text-slate-400">ID Matrícula</span>{selecionado.matricula}</div>
                    <div className="flex justify-between border-b border-slate-200 pb-2"><span className="text-slate-400">Setor</span>{selecionado.setor}</div>
                    <div className="flex justify-between border-b border-slate-200 pb-2"><span className="text-slate-400">Ingresso</span>{selecionado.admissao}</div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-rose-500">Senha</span>
                      <span className="bg-rose-50 text-rose-600 px-3 py-1 rounded-lg text-xs">{selecionado.senha}</span>
                    </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ModuloRH;