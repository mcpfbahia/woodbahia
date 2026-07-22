"use client";

import React, { useState, useEffect } from "react";
import { 
  Calculator, 
  HelpCircle, 
  Check, 
  Truck, 
  Layers, 
  Hammer, 
  Wrench, 
  Sparkles, 
  Phone,
  Settings
} from "lucide-react";
import { 
  getTimberRate,
  getTilesStainPrice,
  getFixturesPrice,
  getGlassPrice,
  getElectricalKit,
  getLaborCost,
  getEucalyptusFoundation,
  getMasonryFoundation,
  getRadierFoundation,
  getFreight,
  getModelDiscountRate
} from "~/lib/pricing";
import { ScrollReveal } from "~/components/common/ScrollReveal";

export const SimulatorSection = () => {
  // Estados do Simulador
  const [area, setArea] = useState<number>(35);
  const [modalidade, setModalidade] = useState<"madeiramento" | "parceira" | "turnkey" | "custom">("turnkey");
  const [includeFreight, setIncludeFreight] = useState<boolean>(true);
  const [foundationType, setFoundationType] = useState<"none" | "radier" | "wooden_eucalyptus" | "wooden_masonry">("wooden_eucalyptus");
  const includeWoodenBase = foundationType === "wooden_eucalyptus" || foundationType === "wooden_masonry";
  const [includeLabor, setIncludeLabor] = useState<boolean>(true);
  const [includeAdmin, setIncludeAdmin] = useState<boolean>(true); // Taxa de 25% de coordenação
  const [includeTiles, setIncludeTiles] = useState<boolean>(true);
  const [includeElectrical, setIncludeElectrical] = useState<boolean>(false);
  const [includeGlass, setIncludeGlass] = useState<boolean>(true);
  const [includeFixtures, setIncludeFixtures] = useState<boolean>(true);
  const [includePaint, setIncludePaint] = useState<boolean>(true);

  // Valores calculados
  const [timberPrice, setTimberPrice] = useState<number>(0);
  const [freightPrice, setFreightPrice] = useState<number>(0);
  const [foundationPrice, setFoundationPrice] = useState<number>(0);
  const [woodenBasePrice, setWoodenBasePrice] = useState<number>(0);
  const [laborPrice, setLaborPrice] = useState<number>(0);
  const [adminPrice, setAdminPrice] = useState<number>(0);
  const [tilesPrice, setTilesPrice] = useState<number>(0);
  const [electricalPrice, setElectricalPrice] = useState<number>(0);
  const [glassPrice, setGlassPrice] = useState<number>(0);
  const [fixturesPrice, setFixturesPrice] = useState<number>(0);
  const [paintPrice, setPaintPrice] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const isWoodenBaseEligible = foundationType === "wooden_eucalyptus" || foundationType === "wooden_masonry";

  const handleSelectModalidade = (mod: "madeiramento" | "parceira" | "turnkey") => {
    setModalidade(mod);
    if (mod === "madeiramento") {
      setIncludeFixtures(false);
      setIncludeTiles(false);
      setIncludeLabor(false);
      setIncludeAdmin(false);
      setIncludeGlass(false);
      setIncludeElectrical(false);
      setIncludePaint(false);
    } else if (mod === "parceira") {
      setIncludeFixtures(true);
      setIncludeTiles(false);
      setIncludeLabor(true);
      setIncludeAdmin(false);
      setIncludeGlass(false);
      setIncludeElectrical(false);
      setIncludePaint(false);
    } else if (mod === "turnkey") {
      setIncludeFixtures(true);
      setIncludeTiles(true);
      setIncludeLabor(true);
      setIncludeAdmin(true);
      setIncludeGlass(true);
      setIncludeElectrical(false);
      setIncludePaint(true);
    }
  };

  // Sincroniza os switches com o botão de modalidade comercial selecionado
  useEffect(() => {
    const isMadeiramento = !includeFixtures && !includeTiles && !includeLabor && !includeAdmin && !includeGlass && !includeElectrical && !includePaint;
    const isParceira = includeFixtures && !includeTiles && includeLabor && !includeAdmin && !includeGlass && !includeElectrical && !includePaint;
    const isTurnkey = includeFixtures && includeTiles && includeLabor && includeAdmin && includeGlass && !includeElectrical && includePaint;

    if (isMadeiramento) {
      setModalidade("madeiramento");
    } else if (isParceira) {
      setModalidade("parceira");
    } else if (isTurnkey) {
      setModalidade("turnkey");
    } else {
      setModalidade("custom");
    }
  }, [
    includeFixtures,
    includeTiles,
    includeLabor,
    includeAdmin,
    includeGlass,
    includeElectrical,
    includePaint
  ]);

  // Atualiza os preços quando as opções mudam
  useEffect(() => {
    const rate = getTimberRate(area);
    const timber = area * rate;
    setTimberPrice(timber);

    const freight = includeFreight ? getFreight(area) : 0;
    setFreightPrice(freight);

    let foundation = 0;
    if (foundationType === "wooden_eucalyptus") foundation = getEucalyptusFoundation(area);
    else if (foundationType === "wooden_masonry") foundation = getMasonryFoundation(area);
    else if (foundationType === "radier") foundation = getRadierFoundation(area);
    setFoundationPrice(foundation);

    const labor = includeLabor ? getLaborCost(area) : 0;
    setLaborPrice(labor);

    // Coordenação e adm: 25% sobre a mão de obra de montagem
    const admin = (includeLabor && includeAdmin) ? Math.round(labor * 0.25) : 0;
    setAdminPrice(admin);

    const tiles = includeTiles ? getTilesStainPrice(area).total : 0;
    setTilesPrice(tiles);

    const electrical = includeElectrical ? getElectricalKit(area) : 0;
    setElectricalPrice(electrical);

    const glass = includeGlass ? getGlassPrice(area) : 0;
    setGlassPrice(glass);

    const fixtures = includeFixtures ? getFixturesPrice(area).base : 0;
    setFixturesPrice(fixtures);

    // Pintura completa aproximada baseada na área
    const paint = includePaint ? (area <= 25 ? 2000 : area <= 55 ? 3000 : 4500) : 0;
    setPaintPrice(paint);

    // Base estrutural com assoalho: R$ 150/m²
    const woodenBase = includeWoodenBase ? area * 150 : 0;
    setWoodenBasePrice(woodenBase);

    // Total final
    const total = timber + freight + foundation + labor + admin + tiles + electrical + glass + fixtures + paint + woodenBase;
    setTotalPrice(total);
  }, [
    area,
    includeFreight,
    foundationType,
    includeWoodenBase,
    isWoodenBaseEligible,
    includeLabor,
    includeAdmin,
    includeTiles,
    includeElectrical,
    includeGlass,
    includeFixtures,
    includePaint
  ]);

  const formatBRL = (val: number) => {
    return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  // Montagem do texto do WhatsApp
  const handleWhatsappLink = () => {
    const modalidadeNomes = {
      madeiramento: "Apenas o Kit Madeiramento",
      parceira: "Kit + Montagem Parceira",
      turnkey: "Wood Bahia Chave na Mão",
      custom: "Customizada (Personalizada)"
    };

    const itens = [
      `- Modalidade comercial: ${modalidadeNomes[modalidade]}`,
      `- Área: ${area}m²`,
      `- Kit Madeiramento: ${formatBRL(timberPrice)}`,
      includeWoodenBase ? `- Base estrutural + Assoalho de piso: ${formatBRL(woodenBasePrice)}` : null,
      includeFreight ? `- Frete estimado: ${formatBRL(freightPrice)}` : null,
      foundationType !== "none" ? `- Fundação (${foundationType === "wooden_eucalyptus" ? "Pilares de Eucalipto" : foundationType === "wooden_masonry" ? "Pilares de Alvenaria" : "Radier"}): ${formatBRL(foundationPrice)}` : null,
      includeLabor ? `- Mão de Obra de Montagem: ${formatBRL(laborPrice)}` : null,
      (includeLabor && includeAdmin) ? `- Coordenação e Adm de Obra: ${formatBRL(adminPrice)}` : null,
      includeTiles ? `- Cobertura (Telhas/Manta): ${formatBRL(tilesPrice)}` : null,
      includeElectrical ? `- Kit Instalações Elétrica/Hidro: ${formatBRL(electricalPrice)}` : null,
      includeGlass ? `- Vidros: ${formatBRL(glassPrice)}` : null,
      includeFixtures ? `- Portas, Janelas e Ferragens: ${formatBRL(fixturesPrice)}` : null,
      includePaint ? `- Pintura com Stain: ${formatBRL(paintPrice)}` : null,
    ].filter(Boolean).join("\n");

    const mensagem = `Olá Wood Bahia! Fiz uma simulação de custos no site para um projeto de ${area}m² e gostaria de receber uma proposta detalhada.\n\n*Itens Selecionados:*\n${itens}\n\n*Investimento Total Estimado: ${formatBRL(totalPrice)}*`;
    return `https://wa.me/5571992936290?text=${encodeURIComponent(mensagem)}`;
  };

  const discountRate = getModelDiscountRate();

  return (
    <section id="simulador" className="w-full bg-[#FAF8F5] py-24 lg:py-32 relative overflow-hidden">
      {/* Detalhe estético de fundo */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-amber-100/30 rounded-full blur-3xl opacity-50 pointer-events-none -translate-y-1/2 -ml-40"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Cabeçalho */}
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="mb-4 inline-block rounded-full bg-secondary/10 px-4 py-2 text-sm font-semibold text-secondary">
            Simulador de Investimento
          </span>
          <h2 className="text-3xl font-bold md:text-5xl text-[#4A2B1D] mb-6 tracking-tight leading-tight">
            Quanto custa realmente construir?
          </h2>
          <p className="text-base text-muted-foreground md:text-lg">
            Mostramos o investimento completo estimado para que você planeje seu chalé sem surpresas financeiras no meio do caminho.
          </p>
        </ScrollReveal>

        {/* Container Principal do Simulador */}
        <ScrollReveal className="w-full max-w-6xl mx-auto">
          <div className="bg-white rounded-[2.5rem] shadow-[0_15px_60px_rgba(0,0,0,0.03)] border border-stone-150 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
            
            {/* Painel Esquerdo: Controles */}
            <div className="lg:col-span-7 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-stone-100">
              <h3 className="text-xl font-bold text-stone-900 mb-8 flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#B06D46]" />
                Personalize as Opções da Obra
              </h3>

              {/* Seletor de Modalidade Comercial */}
              <div className="mb-10 bg-[#FAF8F5] p-6 rounded-[2rem] border border-stone-200 shadow-sm">
                <span className="text-xs uppercase tracking-wider font-extrabold text-stone-500 block mb-4">
                  1. Escolha a Modalidade Comercial
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: "madeiramento", name: "🪵 Kit Madeiramento", desc: "Apenas estrutura" },
                    { id: "parceira", name: "🔨 Kit + M. Parceira", desc: "Montador credenciado" },
                    { id: "turnkey", name: "🔑 Chave na Mão", desc: "Obra 100% Wood Bahia" }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => handleSelectModalidade(m.id as any)}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 relative ${
                        modalidade === m.id
                          ? "bg-[#8A3A1B] border-[#8A3A1B] text-white shadow-md scale-[1.02] font-bold"
                          : "bg-white border-stone-200 text-stone-700 hover:bg-stone-50 hover:border-stone-300"
                      }`}
                    >
                      {m.id === "parceira" && (
                        <span className="absolute -top-2.5 right-2 rounded-full bg-emerald-600 text-white text-[8px] font-black tracking-wider uppercase px-2 py-0.5 shadow-sm border border-emerald-500/20">
                          Custo-Benefício
                        </span>
                      )}
                      <span className="text-xs block font-bold tracking-tight">{m.name}</span>
                      <span className={`text-[9px] block mt-0.5 font-medium ${modalidade === m.id ? "text-amber-100" : "text-stone-400"}`}>
                        {m.desc}
                      </span>
                    </button>
                  ))}
                </div>
                {modalidade === "custom" && (
                  <p className="text-[10px] text-[#8A3A1B] font-semibold mt-3 text-center animate-pulse">
                    ✨ Você personalizou as opções! Modalidade atual: Personalizada.
                  </p>
                )}
              </div>

              {/* Slider de Área */}
              <div className="mb-10">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs uppercase tracking-wider font-extrabold text-stone-500">2. Área Construída Estimada</span>
                  <span className="bg-[#FAF8F5] text-[#8A3A1B] font-serif font-black text-xl px-4 py-1.5 rounded-xl border border-stone-200">
                    {area} m²
                  </span>
                </div>
                <input 
                  type="range" 
                  min="15" 
                  max="150" 
                  value={area} 
                  onChange={(e) => setArea(parseInt(e.target.value))}
                  className="w-full h-2 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-[#8A3A1B] focus:outline-none"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>15 m² (Chalés Compactos)</span>
                  <span>75 m²</span>
                  <span>150 m² (Casas Amplas)</span>
                </div>
              </div>

              {/* Opções Inclusas e Opcionais */}
              <div className="space-y-6">
                <span className="text-xs uppercase tracking-wider font-extrabold text-stone-500 block mb-4">
                  3. Detalhamento e Opcionais
                </span>
                
                {/* Kit Madeiramento - Bloqueado como Ativo */}
                <div className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-150">
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center mt-0.5">
                      <Check className="w-4 h-4 text-emerald-600" />
                    </span>
                    <div>
                      <span className="text-sm font-bold text-stone-800 block">Kit Madeiramento Estrutural</span>
                      <span className="text-xs text-gray-400 leading-normal">Pilares, vigas, linhas, caibros, paredes e estrutura de telhado.</span>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-stone-600 shrink-0">Obrigatório</span>
                </div>


                {/* Grid de Switches */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Cobertura */}
                  <label className="flex items-start justify-between p-4 bg-white hover:bg-stone-50/50 rounded-2xl border border-stone-150 cursor-pointer transition-colors">
                    <div className="flex items-start gap-3">
                      <input 
                        type="checkbox" 
                        checked={includeTiles}
                        onChange={(e) => setIncludeTiles(e.target.checked)}
                        className="w-5 h-5 rounded border-stone-300 text-[#8A3A1B] focus:ring-[#8A3A1B] mt-0.5"
                      />
                      <div>
                        <span className="text-sm font-bold text-stone-800 block">Cobertura e Manta</span>
                        <span className="text-xs text-gray-400">Telhas ecológicas onduladas e manta térmica subcobertura.</span>
                      </div>
                    </div>
                  </label>

                  {/* Frete */}
                  <label className="flex items-start justify-between p-4 bg-white hover:bg-stone-50/50 rounded-2xl border border-stone-150 cursor-pointer transition-colors">
                    <div className="flex items-start gap-3">
                      <input 
                        type="checkbox" 
                        checked={includeFreight}
                        onChange={(e) => setIncludeFreight(e.target.checked)}
                        className="w-5 h-5 rounded border-stone-300 text-[#8A3A1B] focus:ring-[#8A3A1B] mt-0.5"
                      />
                      <div>
                        <span className="text-sm font-bold text-stone-800 block">Frete até o Terreno</span>
                        <span className="text-xs text-gray-400">Transporte e logística compartilhada garantida.</span>
                      </div>
                    </div>
                  </label>

                  {/* Montagem */}
                  <label className="flex items-start justify-between p-4 bg-white hover:bg-stone-50/50 rounded-2xl border border-stone-150 cursor-pointer transition-colors">
                    <div className="flex items-start gap-3">
                      <input 
                        type="checkbox" 
                        checked={includeLabor}
                        onChange={(e) => {
                          setIncludeLabor(e.target.checked);
                          if (!e.target.checked) setIncludeAdmin(false);
                        }}
                        className="w-5 h-5 rounded border-stone-300 text-[#8A3A1B] focus:ring-[#8A3A1B] mt-0.5"
                      />
                      <div>
                        <span className="text-sm font-bold text-stone-800 block">Mão de Obra de Montagem</span>
                        <span className="text-xs text-gray-400">Carpinteiros especializados para cortes e estruturação.</span>
                      </div>
                    </div>
                  </label>

                  {/* Administração da obra - visível apenas se montagem ativa */}
                  <label className={`flex items-start justify-between p-4 rounded-2xl border transition-all duration-300 cursor-pointer 
                    ${includeLabor 
                      ? "bg-white hover:bg-stone-50/50 border-stone-150 opacity-100" 
                      : "bg-stone-50 border-stone-100 opacity-50 cursor-not-allowed"}`}
                  >
                    <div className="flex items-start gap-3">
                      <input 
                        type="checkbox" 
                        checked={includeAdmin}
                        disabled={!includeLabor}
                        onChange={(e) => setIncludeAdmin(e.target.checked)}
                        className="w-5 h-5 rounded border-stone-300 text-[#8A3A1B] focus:ring-[#8A3A1B] mt-0.5 disabled:opacity-50"
                      />
                      <div>
                        <span className="text-sm font-bold text-stone-800 block">Gestão e Coordenação Obra</span>
                        <span className="text-xs text-gray-400">Supervisão técnica e gestão de equipe Wood Bahia.</span>
                      </div>
                    </div>
                  </label>

                  {/* Portas e Janelas */}
                  <label className="flex items-start justify-between p-4 bg-white hover:bg-stone-50/50 rounded-2xl border border-stone-150 cursor-pointer transition-colors">
                    <div className="flex items-start gap-3">
                      <input 
                        type="checkbox" 
                        checked={includeFixtures}
                        onChange={(e) => setIncludeFixtures(e.target.checked)}
                        className="w-5 h-5 rounded border-stone-300 text-[#8A3A1B] focus:ring-[#8A3A1B] mt-0.5"
                      />
                      <div>
                        <span className="text-sm font-bold text-stone-800 block">Portas, Janelas e Ferragens</span>
                        <span className="text-xs text-gray-400">Esquadrias de madeira, fechaduras, pregos e parafusos.</span>
                      </div>
                    </div>
                  </label>

                  {/* Vidros */}
                  <label className="flex items-start justify-between p-4 bg-white hover:bg-stone-50/50 rounded-2xl border border-stone-150 cursor-pointer transition-colors">
                    <div className="flex items-start gap-3">
                      <input 
                        type="checkbox" 
                        checked={includeGlass}
                        onChange={(e) => setIncludeGlass(e.target.checked)}
                        className="w-5 h-5 rounded border-stone-300 text-[#8A3A1B] focus:ring-[#8A3A1B] mt-0.5"
                      />
                      <div>
                        <span className="text-sm font-bold text-stone-800 block">Kit de Vidros</span>
                        <span className="text-xs text-gray-400">Vidros temperados de 8mm e acabamentos de fixação.</span>
                      </div>
                    </div>
                  </label>

                  {/* Elétrica e Hidráulica */}
                  <label className="flex items-start justify-between p-4 bg-white hover:bg-stone-50/50 rounded-2xl border border-stone-150 cursor-pointer transition-colors">
                    <div className="flex items-start gap-3">
                      <input 
                        type="checkbox" 
                        checked={includeElectrical}
                        onChange={(e) => setIncludeElectrical(e.target.checked)}
                        className="w-5 h-5 rounded border-stone-300 text-[#8A3A1B] focus:ring-[#8A3A1B] mt-0.5"
                      />
                      <div>
                        <span className="text-sm font-bold text-stone-800 block">Elétrica e Hidráulica Básica</span>
                        <span className="text-xs text-gray-400">Tubulações básicas de esgoto, água e fiação.</span>
                      </div>
                    </div>
                  </label>

                  {/* Pintura/Stain */}
                  <label className="flex items-start justify-between p-4 bg-white hover:bg-stone-50/50 rounded-2xl border border-stone-150 cursor-pointer transition-colors">
                    <div className="flex items-start gap-3">
                      <input 
                        type="checkbox" 
                        checked={includePaint}
                        onChange={(e) => setIncludePaint(e.target.checked)}
                        className="w-5 h-5 rounded border-stone-300 text-[#8A3A1B] focus:ring-[#8A3A1B] mt-0.5"
                      />
                      <div>
                        <span className="text-sm font-bold text-stone-800 block">Pintura e Tratamento (Stain)</span>
                        <span className="text-xs text-gray-400">Aplicação de stain impregnante hidrorrepelente na madeira.</span>
                      </div>
                    </div>
                  </label>

                </div>

                {/* Seleção de Fundação */}
                <div className="p-5 bg-[#FAF8F5] rounded-2xl border border-stone-200">
                  <span className="text-sm font-bold text-stone-800 block mb-3">Tipo de Fundação da Obra (Base)</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: "none", name: "Sem Base" },
                      { id: "wooden_eucalyptus", name: "Base Madeira + Eucalipto" },
                      { id: "wooden_masonry", name: "Base Madeira + Alvenaria" },
                      { id: "radier", name: "Base Radier + Banheiro" }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setFoundationType(opt.id as any)}
                        className={`py-3 px-2 text-xs font-bold rounded-xl border text-center transition-all ${
                          foundationType === opt.id
                            ? "bg-[#8A3A1B] border-[#8A3A1B] text-white shadow-sm"
                            : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                        }`}
                      >
                        {opt.name}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Painel Direito: Resumo Financeiro */}
            <div className="lg:col-span-5 bg-[#FAF8F5] p-8 md:p-12 flex flex-col justify-between">
              
              <div>
                <h3 className="text-xl font-bold text-stone-900 mb-6 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-[#8A3A1B]" />
                  Resumo do Investimento
                </h3>

                {/* Lista de Custos */}
                <div className="space-y-3.5 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5C3317] font-medium">Kit Madeiramento:</span>
                    <span className="font-bold text-stone-800">{formatBRL(timberPrice)}</span>
                  </div>

                  {includeWoodenBase && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[#5C3317] font-medium">Base de Madeira + Assoalho:</span>
                      <span className="font-bold text-stone-800">{formatBRL(woodenBasePrice)}</span>
                    </div>
                  )}

                  {includeFreight && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[#5C3317] font-medium flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-stone-400" />
                        Frete Estimado:
                      </span>
                      <span className="font-bold text-stone-800">{formatBRL(freightPrice)}</span>
                    </div>
                  )}

                  {foundationType !== "none" && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[#5C3317] font-medium flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-stone-400" />
                        Fundação ({foundationType === "wooden_eucalyptus" ? "Pilares de Eucalipto" : foundationType === "wooden_masonry" ? "Pilares de Alvenaria" : "Radier"}):
                      </span>
                      <span className="font-bold text-stone-800">{formatBRL(foundationPrice)}</span>
                    </div>
                  )}

                  {includeLabor && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[#5C3317] font-medium flex items-center gap-1.5">
                        <Hammer className="w-3.5 h-3.5 text-stone-400" />
                        Mão de Obra de Montagem:
                      </span>
                      <span className="font-bold text-stone-800">{formatBRL(laborPrice)}</span>
                    </div>
                  )}

                  {includeLabor && includeAdmin && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[#5C3317] font-medium flex items-center gap-1.5">
                        <Wrench className="w-3.5 h-3.5 text-stone-400" />
                        Administração de Obra:
                      </span>
                      <span className="font-bold text-stone-800">{formatBRL(adminPrice)}</span>
                    </div>
                  )}

                  {includeTiles && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[#5C3317] font-medium">Cobertura (Telha/Manta):</span>
                      <span className="font-bold text-stone-800">{formatBRL(tilesPrice)}</span>
                    </div>
                  )}

                  {includeElectrical && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[#5C3317] font-medium">Kit Elétrica/Hidráulica:</span>
                      <span className="font-bold text-stone-800">{formatBRL(electricalPrice)}</span>
                    </div>
                  )}

                  {includeGlass && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[#5C3317] font-medium">Vidros Temperados 8mm:</span>
                      <span className="font-bold text-stone-800">{formatBRL(glassPrice)}</span>
                    </div>
                  )}

                  {includeFixtures && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[#5C3317] font-medium">Portas, Janelas e Ferragens:</span>
                      <span className="font-bold text-stone-800">{formatBRL(fixturesPrice)}</span>
                    </div>
                  )}

                  {includePaint && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[#5C3317] font-medium">Pintura e Tratamento:</span>
                      <span className="font-bold text-stone-800">{formatBRL(paintPrice)}</span>
                    </div>
                  )}
                </div>

                <div className="w-full h-[1px] bg-stone-200 my-6"></div>
              </div>

              {/* Total Final do Investimento */}
              <div>
                <div className="mb-6 space-y-4">
                  <div>
                    <span className="text-xs uppercase tracking-wider font-bold text-gray-400 block mb-1">
                      Investimento Parcelado (A Prazo)
                    </span>
                    <div className="font-serif font-black text-2xl sm:text-3xl text-stone-850 leading-none">
                      {formatBRL(totalPrice)}
                    </div>
                  </div>
                  
                  <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-100">
                    <span className="text-xs uppercase tracking-wider font-bold text-emerald-800 block mb-1">
                      Investimento à Vista (PIX/Boleto)
                    </span>
                    <div className="font-serif font-black text-2xl sm:text-3xl text-emerald-800 leading-none">
                      {formatBRL(totalPrice - ((timberPrice + woodenBasePrice) * discountRate))}
                    </div>
                    <span className="text-[10px] text-emerald-700/95 font-semibold mt-1.5 block leading-relaxed">
                      *Com desconto de {discountRate * 100}% aplicado sobre o madeiramento e base estrutural. Economia de {formatBRL((timberPrice + woodenBasePrice) * discountRate)}.
                    </span>
                  </div>

                  <span className="text-[10px] text-gray-400 mt-2 block leading-relaxed italic">
                    *Valores aproximados. Variações podem ocorrer de acordo com a região da obra e padrão de acabamentos civis finais escolhidos.
                  </span>
                </div>

                {/* WhatsApp CTA */}
                <a
                  href={handleWhatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-3 bg-[#8A3A1B] hover:bg-[#732F14] text-white py-4 px-6 rounded-2xl font-bold text-sm transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  <Phone className="w-5 h-5 fill-current" />
                  <span>Pedir Orçamento Completo</span>
                </a>

                {/* Prova social ou nota rápida */}
                <div className="mt-4 flex items-center justify-center gap-2 text-[11px] font-semibold text-stone-500">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                  Simulador de custos atualizado para 2026
                </div>
              </div>

            </div>

          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};
