"use client";

import { useState } from "react";
import { 
  calculateInvestmentSimulation, 
  isVerticalWallModel,
  formatBRL 
} from "~/lib/investment-calculator";
import { 
  Package, 
  Hammer, 
  ShieldCheck, 
  Layers, 
  Info, 
  CheckCircle2, 
  Sparkles,
  HelpCircle
} from "lucide-react";
import { cn } from "~/lib/utils";

interface Props {
  modelId: string;
  modelName: string;
  area: number;
}

export function InvestmentSimulationTable({ modelId, modelName, area }: Props) {
  const [foundationType, setFoundationType] = useState<'eucalyptus' | 'radier'>('eucalyptus');
  const [hasDoubleWall, setHasDoubleWall] = useState(false);
  const [includeBaseFloor, setIncludeBaseFloor] = useState(false);

  const isGuarajuba = modelId === 'guarajuba';
  const canHaveDoubleWall = isVerticalWallModel(modelId);

  const simulation = calculateInvestmentSimulation({
    modelId,
    customArea: area,
    foundationType,
    hasDoubleWall: canHaveDoubleWall && hasDoubleWall,
    includeBaseFloor: !isGuarajuba && includeBaseFloor,
  });

  return (
    <div className="w-full bg-[#FCFBF9] border border-[#EBE6DF] rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm">
      
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#EBE6DF]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F2ECE4] text-[#8C6239] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Estimativa de Custo Real 360°</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#4A2B1D]">
            Simulação de Investimento Global
          </h3>
          <p className="text-sm text-stone-600 mt-1">
            Planejamento completo com todos os materiais e serviços para entrega do seu <strong className="text-[#4A2B1D]">{modelName} ({area}m²)</strong>.
          </p>
        </div>

        {/* Resumo do m² e Total Rápido */}
        <div className="flex flex-col items-start md:items-end bg-white border border-[#E8DFC8] px-4 py-3 rounded-2xl shadow-sm">
          <span className="text-[11px] text-stone-500 font-bold uppercase tracking-wider">Investimento Total Estimado</span>
          <span className="font-serif text-2xl sm:text-3xl font-black text-[#5C3317]">
            {formatBRL(simulation.totalInvestimento)}
          </span>
          <span className="text-xs font-semibold text-emerald-700 mt-0.5">
            Aprox. {formatBRL(simulation.custoPorM2)} / m²
          </span>
        </div>
      </div>

      {/* Controles de Configuração da Obra */}
      <div className="my-6 bg-white border border-[#EBE6DF] rounded-2xl p-4 sm:p-5 space-y-4">
        <span className="text-xs font-black uppercase tracking-wider text-stone-400 block">
          Configuração Construtiva da Simulação
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Seletor de Base / Fundação */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
              <span>Tipo de Fundação:</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFoundationType('eucalyptus')}
                className={cn(
                  "px-3 py-2.5 rounded-xl text-xs font-bold border transition-all text-left flex flex-col justify-between",
                  foundationType === 'eucalyptus'
                    ? "bg-[#5C3317] text-white border-[#5C3317] shadow-sm"
                    : "bg-[#F9F7F5] text-stone-600 border-[#E5DFD7] hover:bg-white"
                )}
              >
                <span>🪵 Base Elevada Eucalipto</span>
                <span className={cn("text-[10px] mt-1 font-normal", foundationType === 'eucalyptus' ? "text-amber-200" : "text-stone-400")}>
                  {isGuarajuba ? "Chassi nativo incluso" : "Com pilares tratados"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setFoundationType('radier')}
                className={cn(
                  "px-3 py-2.5 rounded-xl text-xs font-bold border transition-all text-left flex flex-col justify-between",
                  foundationType === 'radier'
                    ? "bg-[#5C3317] text-white border-[#5C3317] shadow-sm"
                    : "bg-[#F9F7F5] text-stone-600 border-[#E5DFD7] hover:bg-white"
                )}
              >
                <span>🏗️ Laje Radier Concreto</span>
                <span className={cn("text-[10px] mt-1 font-normal", foundationType === 'radier' ? "text-amber-200" : "text-stone-400")}>
                  R$ 380,00 / m²
                </span>
              </button>
            </div>
          </div>

          {/* Seletor de Parede Dupla ou Base Estrutural */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
              <span>Acabamento Estrutural das Paredes:</span>
            </label>
            
            {canHaveDoubleWall ? (
              <label 
                className={cn(
                  "flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all",
                  hasDoubleWall 
                    ? "bg-amber-50/70 border-amber-300 text-[#5C3317]"
                    : "bg-[#F9F7F5] border-[#E5DFD7] text-stone-700 hover:bg-white"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={hasDoubleWall}
                    onChange={(e) => setHasDoubleWall(e.target.checked)}
                    className="w-4 h-4 rounded border-stone-300 text-[#5C3317] focus:ring-[#5C3317]"
                  />
                  <div>
                    <span className="text-xs font-bold block">Adicionar Parede Dupla</span>
                    <span className="text-[10px] text-stone-500">
                      Fechamento interno com tábuas de frontal (+4 peças/m²)
                    </span>
                  </div>
                </div>
                <span className="text-xs font-black text-[#5C3317]">
                  + R$ 292/m²
                </span>
              </label>
            ) : (
              <div className="p-2.5 rounded-xl bg-[#F5F2EC] border border-[#E8E2D8] flex items-start gap-2 text-stone-600">
                <Info className="w-4 h-4 text-[#8C6239] shrink-0 mt-0.5" />
                <span className="text-[11px] leading-tight">
                  <strong>Chalé A-Frame:</strong> As laterais são telhado e o fundo já possui fechamento duplo de fábrica (não requer parede dupla).
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Opcional de Estrutura da Base + Assoalho para outros modelos em eucalipto */}
        {!isGuarajuba && foundationType === 'eucalyptus' && (
          <div className="pt-2 border-t border-[#EBE6DF]">
            <label className="flex items-center gap-2.5 cursor-pointer text-stone-700 select-none">
              <input
                type="checkbox"
                checked={includeBaseFloor}
                onChange={(e) => setIncludeBaseFloor(e.target.checked)}
                className="w-4 h-4 rounded border-stone-300 text-[#5C3317] focus:ring-[#5C3317]"
              />
              <span className="text-xs font-bold text-stone-800">
                Incluir Estrutura de Madeira da Base (Barrotes) e Assoalho do Piso (+ R$ 150,00/m²)
              </span>
            </label>
          </div>
        )}
      </div>

      {/* Grid de Produtos e Serviços */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
        
        {/* BLOCO 1: PRODUTOS E MATERIAIS */}
        <div className="bg-white border border-[#EBE6DF] rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#EBE6DF]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-[#5C3317] flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
                <h4 className="font-serif font-bold text-lg text-[#4A2B1D]">
                  1. Produtos & Materiais
                </h4>
              </div>
              <span className="text-xs font-semibold text-stone-500">
                {simulation.produtos.length} itens
              </span>
            </div>

            <div className="space-y-2 text-xs divide-y divide-stone-100">
              {simulation.produtos.map((item) => (
                <div key={item.id} className="pt-2 pb-1 flex justify-between items-start gap-2">
                  <div>
                    <span className="font-medium text-stone-800 block leading-tight">{item.name}</span>
                    {item.detail && (
                      <span className="text-[10px] text-stone-400 block mt-0.5">{item.detail}</span>
                    )}
                  </div>
                  <span className="font-bold text-stone-900 shrink-0 font-mono">
                    {formatBRL(item.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t-2 border-[#EBE6DF] flex justify-between items-center bg-[#FAF8F5] -mx-4 -mb-4 p-4 rounded-b-2xl">
            <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">Subtotal Produtos</span>
            <span className="font-serif font-black text-lg text-[#5C3317]">
              {formatBRL(simulation.subtotalProdutos)}
            </span>
          </div>
        </div>

        {/* BLOCO 2: SERVIÇOS */}
        <div className="bg-white border border-[#EBE6DF] rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#EBE6DF]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Hammer className="w-4 h-4" />
                </div>
                <h4 className="font-serif font-bold text-lg text-[#4A2B1D]">
                  2. Serviços de Execução
                </h4>
              </div>
              <span className="text-xs font-semibold text-stone-500">
                {simulation.servicos.length} itens
              </span>
            </div>

            <div className="space-y-2 text-xs divide-y divide-stone-100">
              {simulation.servicos.map((item) => (
                <div key={item.id} className="pt-2 pb-1 flex justify-between items-start gap-2">
                  <div>
                    <span className="font-medium text-stone-800 block leading-tight">{item.name}</span>
                    {item.detail && (
                      <span className="text-[10px] text-stone-400 block mt-0.5">{item.detail}</span>
                    )}
                  </div>
                  <span className="font-bold text-stone-900 shrink-0 font-mono">
                    {formatBRL(item.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t-2 border-[#EBE6DF] flex justify-between items-center bg-[#FAF8F5] -mx-4 -mb-4 p-4 rounded-b-2xl">
            <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">Subtotal Serviços</span>
            <span className="font-serif font-black text-lg text-emerald-800">
              {formatBRL(simulation.subtotalServicos)}
            </span>
          </div>
        </div>

      </div>

      {/* FECHAMENTO FINANCEIRO E CONTINGÊNCIA */}
      <div className="bg-gradient-to-br from-[#5C3317] to-[#3E210F] text-white rounded-2xl p-5 sm:p-6 shadow-md mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b border-white/15 text-sm">
          
          <div>
            <span className="text-[11px] uppercase tracking-wider text-amber-200 block">Soma Produtos + Serviços</span>
            <span className="font-serif text-xl font-bold mt-0.5 block">
              {formatBRL(simulation.subtotalGeral)}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-amber-200">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[11px] uppercase tracking-wider block font-bold">Contingência e Canteiro (10%)</span>
            </div>
            <span className="font-serif text-xl font-bold mt-0.5 block text-amber-300">
              + {formatBRL(simulation.contingenciaValor)}
            </span>
            <span className="text-[10px] text-white/70 block">Despesas imprevistas e canteiro</span>
          </div>

          <div className="md:text-right">
            <span className="text-[11px] uppercase tracking-wider text-emerald-300 block font-bold">Investimento Global Aproximado</span>
            <span className="font-serif text-2xl sm:text-3xl font-black text-emerald-300 mt-0.5 block">
              {formatBRL(simulation.totalInvestimento)}
            </span>
            <span className="text-xs text-white/80 block mt-0.5">
              Custo médio: <strong>{formatBRL(simulation.custoPorM2)} / m²</strong>
            </span>
          </div>

        </div>

        {/* Observações e diretrizes de transparência */}
        <div className="pt-4 text-[11px] text-white/75 space-y-1">
          <p className="font-bold text-amber-200">
            ⚠️ OBS: Calhas, decoração, móveis NÃO compõem esse custo.
          </p>
          <p>
            *Esta simulação é um planejamento de investimento global estimado para referência de obra na Bahia. A proposta comercial contratual e o modelo Chave na Mão exclusivo Wood Bahia mantêm garantias e cronogramas próprios.
          </p>
        </div>
      </div>

    </div>
  );
}
