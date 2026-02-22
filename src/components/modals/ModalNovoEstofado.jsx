import { useState } from "react";

function ModalNovoEstofado({ onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    modelo: "",
    status: "EM_PRODUCAO",
    valor: "",
    custo: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const salvarNoBanco = async () => {
    if (!formData.modelo || !formData.valor) return alert("Preencha os campos obrigatórios!");

    setLoading(true);

    try {
      // O FETCH (POST) QUE MANDA PRO JAVA
      const response = await fetch("http://localhost:8080/api/estofados", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelo: formData.modelo,
          status: formData.status,
          valor: parseFloat(formData.valor),
          custo: parseFloat(formData.custo)
        })
      });

      if (response.ok) {
        alert("✅ Estofado cadastrado com sucesso!");
        if (onSuccess) onSuccess();
        onClose(); 
      } else {
        alert("Erro ao salvar no sistema.");
      }
    } catch (error) {
      console.error("Erro de conexão:", error);
      alert("Erro: O Java parece estar desligado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#064e3b] p-6 text-white flex justify-between items-center">
          <h2 className="text-xl font-black uppercase tracking-tighter">Novo Modelo</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">✕</button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Modelo do Estofado</label>
            <input 
              name="modelo" 
              value={formData.modelo} 
              onChange={handleChange}
              type="text" 
              placeholder="Ex: Sofá Retrátil 3 Lugares" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-[#064e3b] focus:outline-none focus:border-[#b49157]" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Destino Inicial</label>
              <select 
                name="status" 
                value={formData.status} 
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-600 focus:outline-none focus:border-[#b49157]"
              >
                <option value="EM_PRODUCAO">Fábrica (Produção)</option>
                <option value="DISPONIVEL">Showroom (Pronto)</option>
                <option value="CRITICO">Manutenção</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Custo Produção (R$)</label>
              <input 
                name="custo" 
                type="number" 
                value={formData.custo} 
                onChange={handleChange}
                placeholder="0.00" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-rose-500 focus:outline-none focus:border-[#b49157]" 
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Preço Venda (R$)</label>
              <input 
                name="valor" 
                type="number" 
                value={formData.valor} 
                onChange={handleChange}
                placeholder="0.00" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-emerald-600 focus:outline-none focus:border-[#b49157]" 
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t bg-slate-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-3 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:bg-slate-200 transition-colors">
            Cancelar
          </button>
          <button 
            onClick={salvarNoBanco} 
            disabled={loading}
            className="px-8 py-3 rounded-xl text-[10px] font-black uppercase bg-[#064e3b] text-white hover:bg-[#b49157] transition-all disabled:opacity-50"
          >
            {loading ? "Salvando..." : "Confirmar Cadastro"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalNovoEstofado;