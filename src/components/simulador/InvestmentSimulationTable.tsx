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
  Printer,
  RotateCcw,
  Check,
  X
} from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "@/components/ui/button";

interface Props {
  modelId: string;
  modelName: string;
  area: number;
  customType?: 'casa' | 'chale';
  isDuplex?: boolean;
  customBedrooms?: number;
  customSuites?: number;
  hasSocialBathroom?: boolean;
  showCustomControls?: boolean;
}

export function InvestmentSimulationTable({ 
  modelId, 
  modelName, 
  area,
  customType = 'casa',
  isDuplex = false,
  customBedrooms = 2,
  customSuites = 1,
  hasSocialBathroom = true,
}: Props) {
  const [foundationType, setFoundationType] = useState<'eucalyptus' | 'radier'>('eucalyptus');
  const [hasDoubleWall, setHasDoubleWall] = useState(false);
  const [includeBaseFloor, setIncludeBaseFloor] = useState(false);
  
  // Itens excluídos pelo cliente da cotação
  const [excludedItemIds, setExcludedItemIds] = useState<Record<string, boolean>>({});

  const isCustom = modelId === 'custom' || modelId.startsWith('custom');
  const isGuarajuba = modelId === 'guarajuba';
  const canHaveDoubleWall = isCustom ? customType === 'casa' : isVerticalWallModel(modelId);

  const rawSimulation = calculateInvestmentSimulation({
    modelId,
    customArea: area,
    foundationType,
    hasDoubleWall: canHaveDoubleWall && hasDoubleWall,
    includeBaseFloor: !isGuarajuba && includeBaseFloor,
    customType,
    isDuplex,
    customBedrooms,
    customSuites,
    hasSocialBathroom,
  });

  const toggleItem = (id: string) => {
    setExcludedItemIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const resetExcludedItems = () => {
    setExcludedItemIds({});
  };

  const handlePrint = () => {
    window.print();
  };

  // Recalcula subtotais com base nos itens ativos (não excluídos)
  const activeProdutos = rawSimulation.produtos.filter(p => !excludedItemIds[p.id]);
  const subtotalProdutos = activeProdutos.reduce((sum, p) => sum + p.value, 0);

  const activeServicos = rawSimulation.servicos.filter(s => !excludedItemIds[s.id]);
  const subtotalServicos = activeServicos.reduce((sum, s) => sum + s.value, 0);

  const subtotalGeral = subtotalProdutos + subtotalServicos;
  const contingenciaValor = Math.round(subtotalGeral * 0.10);
  const totalInvestimento = subtotalGeral + contingenciaValor;
  const custoPorM2 = area > 0 ? Math.round(totalInvestimento / area) : 0;
  
  const totalItensExcluidos = Object.values(excludedItemIds).filter(Boolean).length;

  return (
    <div className="w-full bg-[#FCFBF9] border border-[#EBE6DF] rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm print:border-none print:shadow-none print:p-0 print:bg-white">
      
      {/* Estilos específicos para Impressão e PDF */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-area, #print-area * {
            visibility: visible;
          }
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>

      <div id="print-area" className="space-y-6">

        {/* Cabeçalho de Impressão (Visível apenas ao Imprimir / Salvar PDF) */}
        <div className="hidden print:block pb-4 mb-4 border-b-2 border-stone-800">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-black text-stone-900 tracking-tight">WOOD BAHIA</h1>
              <p className="text-xs uppercase font-bold text-stone-600">Simulação de Investimento Global & Custos de Canteiro</p>
            </div>
            <div className="text-right text-xs text-stone-500">
              <p>Data de emissão: {new Date().toLocaleDateString('pt-BR')}</p>
              <p>Validade estimativa: 15 dias</p>
            </div>
          </div>
        </div>

        {/* Aviso Orientativo de Escopo Comercial vs Simulação 360 */}
        <div className="p-4 rounded-2xl bg-[#F5EFE6] border border-[#E3D7C7] flex items-start gap-3 print:hidden">
          <Info className="w-5 h-5 text-[#8C6239] shrink-0 mt-0.5" />
          <div className="text-xs text-stone-700 leading-relaxed">
            <strong className="text-[#5C3317] block font-bold mb-0.5">
              Orientação Importante sobre a Simulação 360°:
            </strong>
            A contratação oficial <strong>Wood Bahia Chave na Mão</strong> possui contrato fechado e escopo estrutural exclusivo. Já esta <strong>Simulação Global de Investimento</strong> contempla todos os materiais e serviços de canteiro (louças, piso cerâmico, bancadas, pintura etc.), sendo o guia fundamental para quem contrata o <strong>Kit Madeiramento</strong> ou <strong>Montagem Parceira</strong> planejar o custo final da obra sem surpresas.
          </div>
        </div>

        {/* Cabeçalho da Simulação */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#EBE6DF]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F2ECE4] text-[#8C6239] text-xs font-bold uppercase tracking-wider mb-2 print:hidden">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Planejamento de Custo Real da Obra</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#4A2B1D]">
              Simulação de Investimento Global
            </h3>
            <p className="text-sm text-stone-600 mt-1">
              Estimativa detalhada para: <strong className="text-[#4A2B1D]">{rawSimulation.modelName}</strong>
            </p>
            {isCustom && (
              <div className="flex flex-wrap gap-2 mt-2 text-[11px] text-stone-600 font-medium">
                <span className="bg-white px-2.5 py-1 rounded-md border border-stone-200">📐 {area} m²</span>
                <span className="bg-white px-2.5 py-1 rounded-md border border-stone-200">🛏️ {rawSimulation.bedroomsCount} Quartos</span>
                <span className="bg-white px-2.5 py-1 rounded-md border border-stone-200">🚿 {rawSimulation.bathroomsCount} Banheiros</span>
                {isDuplex && <span className="bg-amber-100 text-amber-900 px-2.5 py-1 rounded-md font-bold">🪜 Duplex / Mezanino</span>}
              </div>
            )}
          </div>

          {/* Resumo do m² e Total Rápido + Botão Imprimir */}
          <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
            <div className="flex flex-col items-start md:items-end bg-white border border-[#E8DFC8] px-4 py-3 rounded-2xl shadow-sm">
              <span className="text-[11px] text-stone-500 font-bold uppercase tracking-wider">Investimento Total Estimado</span>
              <span className="font-serif text-2xl sm:text-3xl font-black text-[#5C3317]">
                {formatBRL(totalInvestimento)}
              </span>
              <span className="text-xs font-semibold text-emerald-700 mt-0.5">
                Aprox. {formatBRL(custoPorM2)} / m²
              </span>
            </div>

            {/* Botão de Imprimir / Salvar PDF */}
            <div className="flex items-center gap-2 print:hidden">
              {totalItensExcluidos > 0 && (
                <button
                  type="button"
                  onClick={resetExcludedItems}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-[11px] font-bold text-stone-700 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
                  Restaurar ({totalItensExcluidos})
                </button>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="gap-2 rounded-xl text-xs font-bold border-[#5C3317]/30 text-[#5C3317] hover:bg-[#5C3317]/10"
              >
                <Printer className="w-4 h-4" />
                Salvar PDF / Imprimir
              </Button>
            </div>
          </div>
        </div>

        {/* Controles de Configuração da Obra (Ocultos na Impressão) */}
        <div className="bg-white border border-[#EBE6DF] rounded-2xl p-4 sm:p-5 space-y-4 print:hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-stone-400 block">
              Configuração Construtiva da Simulação
            </span>
            <span className="text-[11px] text-stone-500 italic">
              💡 Você pode desmarcar qualquer item da tabela abaixo para excluí-lo da cotação.
            </span>
          </div>

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

            {/* Seletor de Parede Dupla */}
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
                    <strong>Chalé A-Frame:</strong> As laterais são telhado e o fundo já possui fechamento duplo nativo (não requer parede dupla).
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Opcional de Estrutura da Base + Assoalho para modelos em eucalipto */}
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6 print:grid-cols-2">
          
          {/* BLOCO 1: PRODUTOS E MATERIAIS */}
          <div className="bg-white border border-[#EBE6DF] rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-sm print:border-stone-300 print:shadow-none">
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#EBE6DF]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-[#5C3317] flex items-center justify-center print:hidden">
                    <Package className="w-4 h-4" />
                  </div>
                  <h4 className="font-serif font-bold text-lg text-[#4A2B1D]">
                    1. Produtos & Materiais
                  </h4>
                </div>
                <span className="text-xs font-semibold text-stone-500">
                  {activeProdutos.length} de {rawSimulation.produtos.length} inclusos
                </span>
              </div>

              <div className="space-y-2 text-xs divide-y divide-stone-100">
                {rawSimulation.produtos.map((item) => {
                  const isExcluded = !!excludedItemIds[item.id];
                  const isMandatoryKit = item.id === 'kit-madeiramento';

                  return (
                    <div 
                      key={item.id} 
                      className={cn(
                        "pt-2 pb-1.5 flex justify-between items-start gap-2 transition-opacity",
                        isExcluded ? "opacity-35 line-through bg-stone-50/50 -mx-2 px-2 rounded" : "opacity-100"
                      )}
                    >
                      <div className="flex items-start gap-2">
                        {/* Checkbox para excluir/incluir item */}
                        {!isMandatoryKit && (
                          <input
                            type="checkbox"
                            checked={!isExcluded}
                            onChange={() => toggleItem(item.id)}
                            title={isExcluded ? "Clique para incluir este item" : "Clique para excluir este item da cotação"}
                            className="mt-0.5 w-3.5 h-3.5 rounded border-stone-300 text-[#5C3317] focus:ring-[#5C3317] cursor-pointer print:hidden shrink-0"
                          />
                        )}
                        <div>
                          <span className={cn("font-medium block leading-tight", isExcluded ? "text-stone-400" : "text-stone-800")}>
                            {item.name}
                          </span>
                          {item.detail && (
                            <span className="text-[10px] text-stone-400 block mt-0.5">{item.detail}</span>
                          )}
                          {isExcluded && (
                            <span className="text-[9px] text-red-500 font-bold block mt-0.5 not-italic">
                              (Excluído da simulação)
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={cn("font-bold font-mono", isExcluded ? "text-stone-400 line-through" : "text-stone-900")}>
                          {isExcluded ? "R$ 0,00" : formatBRL(item.value)}
                        </span>
                        {!isMandatoryKit && (
                          <button
                            type="button"
                            onClick={() => toggleItem(item.id)}
                            className="text-stone-400 hover:text-stone-700 p-0.5 rounded print:hidden"
                            title={isExcluded ? "Restaurar item" : "Remover item"}
                          >
                            {isExcluded ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 hover:text-red-500" />}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t-2 border-[#EBE6DF] flex justify-between items-center bg-[#FAF8F5] -mx-4 -mb-4 p-4 rounded-b-2xl print:bg-stone-100">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">Subtotal Produtos</span>
              <span className="font-serif font-black text-lg text-[#5C3317]">
                {formatBRL(subtotalProdutos)}
              </span>
            </div>
          </div>

          {/* BLOCO 2: SERVIÇOS */}
          <div className="bg-white border border-[#EBE6DF] rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-sm print:border-stone-300 print:shadow-none">
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#EBE6DF]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center print:hidden">
                    <Hammer className="w-4 h-4" />
                  </div>
                  <h4 className="font-serif font-bold text-lg text-[#4A2B1D]">
                    2. Serviços de Execução
                  </h4>
                </div>
                <span className="text-xs font-semibold text-stone-500">
                  {activeServicos.length} de {rawSimulation.servicos.length} inclusos
                </span>
              </div>

              <div className="space-y-2 text-xs divide-y divide-stone-100">
                {rawSimulation.servicos.map((item) => {
                  const isExcluded = !!excludedItemIds[item.id];

                  return (
                    <div 
                      key={item.id} 
                      className={cn(
                        "pt-2 pb-1.5 flex justify-between items-start gap-2 transition-opacity",
                        isExcluded ? "opacity-35 line-through bg-stone-50/50 -mx-2 px-2 rounded" : "opacity-100"
                      )}
                    >
                      <div className="flex items-start gap-2">
                        {/* Checkbox para excluir/incluir serviço */}
                        <input
                          type="checkbox"
                          checked={!isExcluded}
                          onChange={() => toggleItem(item.id)}
                          title={isExcluded ? "Clique para incluir este serviço" : "Clique para excluir este serviço da cotação"}
                          className="mt-0.5 w-3.5 h-3.5 rounded border-stone-300 text-emerald-700 focus:ring-emerald-700 cursor-pointer print:hidden shrink-0"
                        />
                        <div>
                          <span className={cn("font-medium block leading-tight", isExcluded ? "text-stone-400" : "text-stone-800")}>
                            {item.name}
                          </span>
                          {item.detail && (
                            <span className="text-[10px] text-stone-400 block mt-0.5">{item.detail}</span>
                          )}
                          {isExcluded && (
                            <span className="text-[9px] text-red-500 font-bold block mt-0.5 not-italic">
                              (Excluído da simulação)
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={cn("font-bold font-mono", isExcluded ? "text-stone-400 line-through" : "text-stone-900")}>
                          {isExcluded ? "R$ 0,00" : formatBRL(item.value)}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleItem(item.id)}
                          className="text-stone-400 hover:text-stone-700 p-0.5 rounded print:hidden"
                          title={isExcluded ? "Restaurar item" : "Remover item"}
                        >
                          {isExcluded ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 hover:text-red-500" />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t-2 border-[#EBE6DF] flex justify-between items-center bg-[#FAF8F5] -mx-4 -mb-4 p-4 rounded-b-2xl print:bg-stone-100">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">Subtotal Serviços</span>
              <span className="font-serif font-black text-lg text-emerald-800">
                {formatBRL(subtotalServicos)}
              </span>
            </div>
          </div>

        </div>

        {/* FECHAMENTO FINANCEIRO E CONTINGÊNCIA */}
        <div className="bg-gradient-to-br from-[#5C3317] to-[#3E210F] text-white rounded-2xl p-5 sm:p-6 shadow-md mt-6 print:bg-none print:text-black print:border-2 print:border-stone-800 print:shadow-none">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b border-white/15 print:border-stone-400 text-sm">
            
            <div>
              <span className="text-[11px] uppercase tracking-wider text-amber-200 print:text-stone-600 block">Soma Produtos + Serviços</span>
              <span className="font-serif text-xl font-bold mt-0.5 block print:text-stone-900">
                {formatBRL(subtotalGeral)}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-amber-200 print:text-stone-600">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[11px] uppercase tracking-wider block font-bold">Contingência e Canteiro (10%)</span>
              </div>
              <span className="font-serif text-xl font-bold mt-0.5 block text-amber-300 print:text-stone-900">
                + {formatBRL(contingenciaValor)}
              </span>
              <span className="text-[10px] text-white/70 print:text-stone-500 block">Despesas imprevistas e canteiro</span>
            </div>

            <div className="md:text-right">
              <span className="text-[11px] uppercase tracking-wider text-emerald-300 print:text-stone-700 block font-bold">Investimento Global Aproximado</span>
              <span className="font-serif text-2xl sm:text-3xl font-black text-emerald-300 print:text-stone-900 mt-0.5 block">
                {formatBRL(totalInvestimento)}
              </span>
              <span className="text-xs text-white/80 print:text-stone-600 block mt-0.5">
                Custo médio: <strong>{formatBRL(custoPorM2)} / m²</strong>
              </span>
            </div>

          </div>

          {/* Observações e diretrizes de transparência */}
          <div className="pt-4 text-[11px] text-white/75 print:text-stone-600 space-y-1">
            <p className="font-bold text-amber-200 print:text-stone-900">
              ⚠️ OBS: Calhas, decoração, móveis NÃO compõem esse custo.
            </p>
            <p>
              *Esta simulação é um planejamento de investimento global estimado para referência de obra na Bahia. A proposta comercial contratual e o modelo Chave na Mão exclusivo Wood Bahia mantêm garantias e cronogramas próprios.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
