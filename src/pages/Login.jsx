/**
 * @file Login.jsx
 * @description Sistema de Autenticação Integrado 
 * @author © 2026 Rickman Brown • Software Engineering
 */

import { useState } from "react";

function Login({ onLogin }) {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [verSenha, setVerSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setErro("");

    if (!usuario || !senha) {
      setErro("Credenciais obrigatórias para acesso ao Core.");
      return;
    }

    setCarregando(true);
    setTimeout(() => {
      setCarregando(false);
      
      const userL = usuario.toLowerCase();
    
      if (userL === "admin" && senha === "123") {
        localStorage.setItem("userRole", "ADMIN");
        localStorage.setItem("userName", "Analu");
        onLogin("ADMIN");
      } 
      else if (userL === "fabrica" && senha === "123") {
        localStorage.setItem("userRole", "FABRICA");
        localStorage.setItem("userName", "Gestor Fabril");
        onLogin("FABRICA");
      } 
      else if (userL === "loja" && senha === "123") {
        localStorage.setItem("userRole", "LOJA");
        localStorage.setItem("userName", "Vendedor");
        onLogin("LOJA");
      } 
      else {
        setErro("Acesso Negado: Usuário ou senha incorretos.");
      }
    }, 1200); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfcf9] p-4 sm:p-6 font-sans overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none select-none overflow-hidden">
        <h1 className="text-[20vw] font-black leading-none">ANALU ANALU ANALU</h1>
      </div>

      <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-[0_40px_100px_-20px_rgba(6,78,59,0.15)] w-full max-w-[440px] animate-fade-in relative border border-slate-50">
    
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-[#064e3b] rounded-b-full"></div>

        <div className="text-center mb-6 sm:mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#064e3b] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-900/30 rounded-[1.5rem] rotate-3 hover:rotate-0 transition-transform duration-500">
              <span className="text-[#b49157] text-2xl sm:text-3xl font-black italic">A</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#064e3b] tracking-tighter uppercase leading-none">
            Analu System
          </h1>
          <p className="text-[9px] text-[#b49157] uppercase tracking-[0.4em] font-black mt-3 opacity-80">
            Executive Intelligence System
          </p>
        </div>
        <div className="mb-6 bg-slate-50 border border-slate-200 p-4 rounded-xl text-center">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 border-b border-slate-200 pb-2">Contas de Acesso (Demo)</p>
            <ul className="text-xs text-slate-600 font-medium flex flex-col gap-1">
                <li>CEO: <span className="font-bold text-[#064e3b]">admin</span> / Senha: <span className="font-bold">123</span></li>
                <li>Operação: <span className="font-bold text-[#b49157]">fabrica</span> / Senha: <span className="font-bold">123</span></li>
                <li>Vendas: <span className="font-bold text-rose-600">loja</span> / Senha: <span className="font-bold">123</span></li>
            </ul>
        </div>

        {erro && (
          <div className="mb-6 p-4 bg-rose-50 text-rose-700 text-[10px] font-black uppercase tracking-widest border-l-[6px] border-rose-500 flex items-center gap-3 animate-shake">
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{erro}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6 sm:space-y-8">
          <div className="group">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1 group-focus-within:text-[#064e3b] transition-colors">
              Identificação do Operador
            </label>
            <input
              type="text"
              autoComplete="username"
              className="w-full bg-slate-50 border-b-2 border-slate-100 px-5 py-4 text-sm font-bold text-[#064e3b] focus:outline-none focus:border-[#b49157] focus:bg-white transition-all placeholder:text-slate-200"
              placeholder="Ex: admin"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />
          </div>

          <div className="group">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1 group-focus-within:text-[#064e3b] transition-colors">
              Chave de Acesso Segura
            </label>
            <div className="relative">
              <input
                type={verSenha ? "text" : "password"}
                autoComplete="current-password"
                className="w-full bg-slate-50 border-b-2 border-slate-100 px-5 py-4 text-sm font-bold text-[#064e3b] focus:outline-none focus:border-[#b49157] focus:bg-white transition-all placeholder:text-slate-200"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setVerSenha(!verSenha)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-[#b49157] transition-colors p-2"
              >
                {verSenha ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={carregando}
            className={`w-full py-5 bg-[#064e3b] text-white font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl transition-all duration-300 active:scale-[0.97] rounded-xl
              ${carregando ? "opacity-70 cursor-not-allowed" : "hover:bg-[#b49157] hover:shadow-[#b49157]/20 hover:-translate-y-1"}`}
          >
            {carregando ? (
              <span className="flex items-center justify-center gap-4">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Sincronizando...
              </span>
            ) : (
              "Validar Credenciais"
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-50 text-center relative">
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.5em]">
            Protocolo de Segurança
          </p>
          <p className="text-[7px] font-bold text-slate-200 uppercase mt-2">© 2026 Rickman Brown</p>
        </div>
      </div>
    </div>
  );
}

export default Login;