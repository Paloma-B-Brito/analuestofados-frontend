/**
 * @file MenuBotao.jsx
 * @description Unidade de Navegação da Sidebar - Botão com Indicador de Status
 * @author © 2026 Rickman Brown • Software Engineering
 */

function MenuBotao({ label, ativo, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left px-5 py-4 rounded-2xl mb-2 
        transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
        flex items-center gap-4 group relative overflow-hidden
        ${ativo 
          ? "bg-[#064e3b] text-white shadow-[0_10px_20px_-5px_rgba(6,78,59,0.3)] translate-x-2" 
          : "text-slate-400 hover:bg-slate-50 hover:text-[#064e3b]"
        }
      `}
    >
      {/* INDICADOR LATERAL (O "FILÉ" DOURADO) */}
      <div className={`
        absolute left-0 w-1.5 h-6 rounded-r-full transition-all duration-500
        ${ativo ? "bg-[#b49157] scale-y-100 opacity-100" : "bg-slate-200 scale-y-0 opacity-0"}
      `} />

      {/* LABEL COM TRACKING EXECUTIVO */}
      <span className={`
        text-[10px] md:text-[11px] font-black uppercase tracking-[0.25em] whitespace-nowrap
        ${ativo ? "text-white" : "group-hover:translate-x-2 transition-transform duration-300"}
      `}>
        {label}
      </span>

      {/* STATUS INDICATOR (O PONTO DE PULSAÇÃO) */}
      <div className="ml-auto flex items-center">
        {ativo ? (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#b49157] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#b49157]"></span>
          </span>
        ) : (
          <div className="w-1 h-1 rounded-full bg-slate-200 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </div>

      {/* EFEITO DE BRILHO AO FUNDO (SUBTIL) */}
      {ativo && (
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none" />
      )}
    </button>
  );
}

export default MenuBotao;