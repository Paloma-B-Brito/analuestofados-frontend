/**
 * @file Engenharia.jsx
 * @description Otimização de Corte, Ficha Técnica Detalhada e Engenharia de Produto 
 * @author © 2026 Minister Noiret • Software Architecture
 */

import React, { useState } from 'react';
import { 
  Ruler, Scissors, Calculator, Layers, 
  Save, AlertTriangle, CheckCircle, Package, ArrowRight, 
  ChevronDown, ChevronUp, FileText, Database, Edit, Trash, Plus, X
} from 'lucide-react';

const modelosIniciais = [
  { 
    id: 1, 
    nome: "Sofá Retrátil 3 Lugares (Luxo)", 
    dimensoes: "2.40m x 1.10m (Aberto: 1.60m)",
    materiais: [
      { tipo: "Espuma D33", consumo: 1.5, unidade: "chapa", medidas: "2.20m x 1.80m x 8cm (Assento)" }, 
      { tipo: "Espuma D28", consumo: 0.8, unidade: "chapa", medidas: "2.20m x 1.80m x 5cm (Braços/Encosto)" },
      { tipo: "Espuma Soft", consumo: 0.4, unidade: "chapa", medidas: "Manta 2cm (Acabamento)" },
      { tipo: "Tecido Suede", consumo: 14.5, unidade: "metros" },
      { tipo: "Madeira Eucalipto Tratado", consumo: 18, unidade: "metros lineares" },
      { tipo: "Compensado Naval", consumo: 1.2, unidade: "chapa", medidas: "2.20x1.60m" },
      { tipo: "Percinta Elástica", consumo: 22, unidade: "metros" },
      { tipo: "Molas Bonnel", consumo: 12, unidade: "unidades" },
      { tipo: "Fibra Siliconada", consumo: 3.5, unidade: "kg" },
      { tipo: "TNT (Forro)", consumo: 8, unidade: "metros" },
      { tipo: "Linha de Costura", consumo: 350, unidade: "metros" },
      { tipo: "Grampos 80/10", consumo: 450, unidade: "unidades" },
      { tipo: "Rodízios Silicone", consumo: 4, unidade: "unidades" },
      { tipo: "Pés Madeira", consumo: 4, unidade: "unidades" }
    ]
  },
  { 
    id: 2, 
    nome: "Poltrona Eames Clássica", 
    dimensoes: "85cm x 85cm",
    materiais: [
      { tipo: "Espuma D33", consumo: 0.4, unidade: "chapa", medidas: "Assento/Encosto (Moldada)" }, 
      { tipo: "Tecido Couro Natural", consumo: 4.2, unidade: "metros" },
      { tipo: "Madeira Curvada (Plywood)", consumo: 1, unidade: "kit", medidas: "Conjunto Laminado" },
      { tipo: "Botões Capitonê", consumo: 12, unidade: "unidades" },
      { tipo: "Base Alumínio", consumo: 1, unidade: "unidade" },
      { tipo: "Linha Pesada", consumo: 120, unidade: "metros" },
      { tipo: "Grampos", consumo: 150, unidade: "unidades" }
    ]
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
      { tipo: "Forro Interno (TNT)", consumo: 3, unidade: "metros" }
    ]
  },
  { 
    id: 4, 
    nome: "Almofada Decorativa 45x45", 
    dimensoes: "45cm x 45cm",
    materiais: [
      { tipo: "Fibra Siliconada", consumo: 0.450, unidade: "kg" }, 
      { tipo: "Tecido Linho", consumo: 0.55, unidade: "metro" },
      { tipo: "Zíper Invisível", consumo: 0.5, unidade: "metro" },
      { tipo: "Linha Costura", consumo: 40, unidade: "metros" }
    ]
  },
  { 
    id: 5, 
    nome: "Maca Estética Fixa", 
    dimensoes: "1.90m (C) x 0.80m (L) x 0.75m (A)",
    materiais: [
      { tipo: "Espuma D28", consumo: 0.6, unidade: "chapa", medidas: "1.90m x 0.80m x 5cm" },
      { tipo: "Tecido Courvin Náutico", consumo: 2.5, unidade: "metros" },
      { tipo: "Estrutura Tubular Aço", consumo: 6, unidade: "metros" },
      { tipo: "Madeira MDF (Base)", consumo: 1, unidade: "chapa", medidas: "1.90m x 0.80m" },
      { tipo: "Ponteiras Plásticas", consumo: 4, unidade: "unidades" },
      { tipo: "TNT (Acabamento inf.)", consumo: 2, unidade: "metros" },
      { tipo: "Grampos", consumo: 80, unidade: "unidades" }
    ]
  },
  { 
    id: 6, 
    nome: "Escadinha Pet 3 Degraus", 
    dimensoes: "45cm (A) x 40cm (L) x 60cm (P)",
    materiais: [
      { tipo: "Espuma D23", consumo: 0.2, unidade: "chapa", medidas: "Bloco Escalonado" },
      { tipo: "Tecido Pelúcia/Suede", consumo: 1.8, unidade: "metros" },
      { tipo: "Madeira MDF 6mm", consumo: 0.3, unidade: "chapa" },
      { tipo: "Cola de Contato", consumo: 0.2, unidade: "litro" },
      { tipo: "Zíper (Capa Removível)", consumo: 1.5, unidade: "metros" }
    ]
  }
];

function Engenharia() {
  const [modelos, setModelos] = useState(modelosIniciais);
  const [producao, setProducao] = useState({ modelo: "", quantidade: 0 });
  const [resultado, setResultado] = useState(null);
  const [fichaAberta, setFichaAberta] = useState(null); 
  const [modeloEmEdicao, setModeloEmEdicao] = useState(null);
  const toggleFicha = (id) => {
    setFichaAberta(fichaAberta === id ? null : id);
  };

  const calcularOtimizacao = () => {
    if (!producao.modelo || producao.quantidade <= 0) return;

    // Busca no state 'modelos', não na constante inicial
    const modeloSelecionado = modelos.find(m => m.id === parseInt(producao.modelo));
    const qtdProduzir = parseInt(producao.quantidade);

    const listaMateriaisCalculada = modeloSelecionado.materiais.map(mat => {
      let total = mat.consumo * qtdProduzir;
      let sobra = null;
      
      if (mat.unidade === 'chapa') {
        const chapasInteiras = Math.ceil(total);
        const resto = chapasInteiras - total;
        total = chapasInteiras; 
        if (resto > 0.05) sobra = `${(resto * 100).toFixed(1)}% da última chapa`;
      } else {
        total = total.toFixed(2);
      }

      return { ...mat, totalCalculado: total, sobraEstimada: sobra };
    });

    let sugestaoSobra = [];
    const materialEspumaPrincipal = listaMateriaisCalculada.find(m => m.tipo.includes("Espuma") && m.sobraEstimada);
    
    if (materialEspumaPrincipal) {
      const pctSobra = parseFloat(materialEspumaPrincipal.sobraEstimada); 
      if (pctSobra > 20) {
         const qtdEscadinhas = Math.floor(pctSobra / 20); 
         if (qtdEscadinhas > 0) {
           sugestaoSobra.push({ produto: "Escadinha Pet", qtd: qtdEscadinhas, obs: "Aproveita retalhos de espuma." });
         }
         sugestaoSobra.push({ produto: "Enchimento de Almofada", qtd: Math.floor(pctSobra / 5), obs: "Triturar para flocos." });
      }
    }

    setResultado({
      modelo: modeloSelecionado.nome,
      qtd: qtdProduzir,
      materiais: listaMateriaisCalculada,
      sugestoes: sugestaoSobra
    });
  };

  // --- LÓGICA DE EDIÇÃO ---
  const abrirModalEdicao = (modelo) => {
    // Clona o objeto para não editar o state diretamente antes de salvar
    setModeloEmEdicao(JSON.parse(JSON.stringify(modelo)));
  };

  const fecharModalEdicao = () => {
    setModeloEmEdicao(null);
  };

  const atualizarCampoMaterial = (index, campo, valor) => {
    const novosMateriais = [...modeloEmEdicao.materiais];
    novosMateriais[index][campo] = valor;
    setModeloEmEdicao({ ...modeloEmEdicao, materiais: novosMateriais });
  };

  const removerMaterial = (index) => {
    const novosMateriais = modeloEmEdicao.materiais.filter((_, i) => i !== index);
    setModeloEmEdicao({ ...modeloEmEdicao, materiais: novosMateriais });
  };

  const adicionarMaterial = () => {
    const novo = { tipo: "Novo Material", consumo: 1, unidade: "un", medidas: "-" };
    setModeloEmEdicao({ ...modeloEmEdicao, materiais: [...modeloEmEdicao.materiais, novo] });
  };

  const salvarEdicao = () => {
    const novaListaModelos = modelos.map(m => 
      m.id === modeloEmEdicao.id ? modeloEmEdicao : m
    );
    setModelos(novaListaModelos);
    setModeloEmEdicao(null);
    if (resultado && resultado.modelo === modeloEmEdicao.nome) {
      setResultado(null);
    }
  };

  return (
    <div className="animate-fade-in space-y-6 pb-10 relative">
      {modeloEmEdicao && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            
            {/* Header Modal */}
            <div className="bg-[#064e3b] p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Edit size={18} className="text-[#b49157]" />
                <h3 className="font-black uppercase tracking-widest text-sm">Editando: {modeloEmEdicao.nome}</h3>
              </div>
              <button onClick={fecharModalEdicao} className="hover:bg-white/20 p-1 rounded transition-colors"><X size={20} /></button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
              
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 mb-1 block">Nome do Produto</label>
                  <input 
                    type="text" 
                    value={modeloEmEdicao.nome}
                    onChange={(e) => setModeloEmEdicao({...modeloEmEdicao, nome: e.target.value})}
                    className="w-full p-2 border border-slate-300 rounded font-bold text-slate-700"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 mb-1 block">Dimensões Gerais</label>
                  <input 
                    type="text" 
                    value={modeloEmEdicao.dimensoes}
                    onChange={(e) => setModeloEmEdicao({...modeloEmEdicao, dimensoes: e.target.value})}
                    className="w-full p-2 border border-slate-300 rounded font-bold text-slate-700"
                  />
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-[10px] font-black uppercase text-slate-500">
                    <tr>
                      <th className="p-3">Material / Tipo</th>
                      <th className="p-3 w-24">Consumo</th>
                      <th className="p-3 w-24">Unidade</th>
                      <th className="p-3">Medidas / Detalhes</th>
                      <th className="p-3 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {modeloEmEdicao.materiais.map((mat, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-2">
                          <input 
                            value={mat.tipo} 
                            onChange={(e) => atualizarCampoMaterial(idx, 'tipo', e.target.value)}
                            className="w-full p-1 border border-transparent hover:border-slate-300 rounded text-xs font-bold text-[#064e3b]"
                          />
                        </td>
                        <td className="p-2">
                          <input 
                            type="number"
                            step="0.1"
                            value={mat.consumo} 
                            onChange={(e) => atualizarCampoMaterial(idx, 'consumo', e.target.value)}
                            className="w-full p-1 border border-transparent hover:border-slate-300 rounded text-xs text-center font-mono"
                          />
                        </td>
                        <td className="p-2">
                          <input 
                            value={mat.unidade} 
                            onChange={(e) => atualizarCampoMaterial(idx, 'unidade', e.target.value)}
                            className="w-full p-1 border border-transparent hover:border-slate-300 rounded text-xs text-center text-slate-500"
                          />
                        </td>
                        <td className="p-2">
                          <input 
                            value={mat.medidas || ''} 
                            onChange={(e) => atualizarCampoMaterial(idx, 'medidas', e.target.value)}
                            className="w-full p-1 border border-transparent hover:border-slate-300 rounded text-xs text-slate-600"
                            placeholder="-"
                          />
                        </td>
                        <td className="p-2 text-center">
                          <button onClick={() => removerMaterial(idx)} className="text-rose-400 hover:text-rose-600 p-1">
                            <Trash size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button 
                  onClick={adicionarMaterial}
                  className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-500 uppercase flex items-center justify-center gap-2 transition-colors"
                >
                  <Plus size={14} /> Adicionar Novo Insumo
                </button>
              </div>

            </div>

            <div className="p-4 border-t border-slate-200 bg-white flex justify-end gap-3">
              <button 
                onClick={fecharModalEdicao}
                className="px-6 py-2 border border-slate-300 text-slate-600 font-bold uppercase text-xs rounded-lg hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button 
                onClick={salvarEdicao}
                className="px-6 py-2 bg-[#064e3b] text-white font-bold uppercase text-xs rounded-lg hover:bg-[#08634b] shadow-lg flex items-center gap-2"
              >
                <Save size={14} /> Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-lg h-fit sticky top-6">
          <h3 className="font-black text-[#064e3b] uppercase flex items-center gap-2 mb-6">
            <Calculator size={18} /> Simulador de Produção
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">O que vamos produzir?</label>
              <select 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:border-[#b49157]"
                onChange={(e) => setProducao({...producao, modelo: e.target.value})}
              >
                <option value="">Selecione um Modelo...</option>
                {modelos.map(m => (
                  <option key={m.id} value={m.id}>{m.nome}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Quantidade Desejada</label>
              <input 
                type="number" 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:border-[#b49157]"
                placeholder="Ex: 10"
                onChange={(e) => setProducao({...producao, quantidade: e.target.value})}
              />
            </div>

            <button 
              onClick={calcularOtimizacao}
              className="w-full py-4 bg-[#064e3b] hover:bg-[#08634b] text-white font-black uppercase text-xs rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <Scissors size={18} /> Calcular Lista de Materiais
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {resultado ? (
            <>
              <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-24 bg-[#b49157] opacity-10 rounded-bl-full"></div>
                
                <h3 className="font-black uppercase tracking-widest text-sm mb-4 flex items-center gap-2">
                  <Layers size={16} className="text-[#b49157]" /> Lista de Corte (BOM)
                </h3>

                <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4 relative z-10">
                  <div>
                     <span className="text-xs font-bold text-slate-400 uppercase block">Pedido</span>
                     <span className="text-xl font-black text-white">{resultado.qtd}x {resultado.modelo}</span>
                  </div>
                </div>

                <div className="space-y-3 relative z-10 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {resultado.materiais.map((mat, idx) => (
                    <div key={idx} className="bg-white/5 p-3 rounded-lg border border-white/5 flex justify-between items-center">
                      <div>
                        <p className="text-xs font-bold text-slate-200">{mat.tipo}</p>
                        {mat.medidas && <p className="text-[10px] text-slate-400">{mat.medidas}</p>}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-[#b49157]">{mat.totalCalculado} <span className="text-[10px] text-slate-400 uppercase">{mat.unidade}</span></p>
                        {mat.sobraEstimada && (
                          <p className="text-[9px] text-emerald-400 font-bold">Sobra: {mat.sobraEstimada}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {resultado.sugestoes.length > 0 && (
                <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl animate-fade-in-up">
                  <div className="flex items-start gap-3">
                    <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full">
                      <Package size={24} />
                    </div>
                    <div>
                      <h4 className="font-black text-emerald-800 uppercase text-sm">Otimização de Sobras</h4>
                      <p className="text-xs text-emerald-700 mt-1 mb-3">Sugestões para zerar o desperdício:</p>
                      
                      {resultado.sugestoes.map((sug, i) => (
                        <div key={i} className="bg-white p-3 rounded-lg border border-emerald-100 shadow-sm flex items-center justify-between mb-2 last:mb-0">
                          <div>
                            <span className="block font-black text-emerald-800 uppercase text-xs">{sug.produto}</span>
                            <span className="text-[10px] text-emerald-600">{sug.obs}</span>
                          </div>
                          <div className="text-xl font-black text-emerald-600">+{sug.qtd} un</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-200 rounded-2xl p-10 min-h-[300px]">
              <Database size={48} className="mb-4 opacity-20" />
              <p className="font-bold uppercase text-xs text-center">Selecione um produto e quantidade para gerar a lista de materiais</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-slate-200">
        <h3 className="font-black text-[#064e3b] uppercase flex items-center gap-2 mb-6">
          <FileText size={18} /> Fichas Técnicas Detalhadas
        </h3>
        
        <div className="grid grid-cols-1 gap-4">
          {modelos.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all">
              <div 
                className="p-4 flex justify-between items-center cursor-pointer hover:bg-slate-50"
                onClick={() => toggleFicha(item.id)}
              >
                <div>
                   <h4 className="font-black text-slate-700 uppercase text-sm">{item.nome}</h4>
                   <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Dimensões: {item.dimensoes}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">{item.materiais.length} Itens</span>
                  {fichaAberta === item.id ? <ChevronUp size={18} className="text-[#b49157]" /> : <ChevronDown size={18} className="text-slate-400" />}
                </div>
              </div>
              {fichaAberta === item.id && (
                <div className="p-4 bg-slate-50 border-t border-slate-100 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {item.materiais.map((mat, idx) => (
                      <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col justify-between">
                        <div>
                          <p className="text-[10px] font-black text-[#064e3b] uppercase mb-1">{mat.tipo}</p>
                          {mat.medidas && <p className="text-[9px] text-slate-400 mb-1">{mat.medidas}</p>}
                        </div>
                        <div className="text-right border-t border-slate-100 pt-2 mt-1">
                          <span className="text-sm font-bold text-slate-700">{mat.consumo}</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase ml-1">{mat.unidade}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <button className="px-4 py-2 bg-slate-200 text-slate-600 text-[10px] font-black uppercase rounded hover:bg-slate-300 transition-colors">
                      Imprimir Ficha
                    </button>
                    <button 
                      onClick={() => abrirModalEdicao(item)}
                      className="px-4 py-2 bg-[#b49157] text-white text-[10px] font-black uppercase rounded hover:bg-[#9a7b48] transition-colors flex items-center gap-2"
                    >
                      <Edit size={12} /> Editar Composição
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default Engenharia;