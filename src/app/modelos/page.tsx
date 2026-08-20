"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Maximize2, Truck, Loader2, Package, Tag } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "~/lib/firebase";
import { initialModels, applyModelOverrides } from "~/lib/data";
import { getTilesStainPrice, getFixturesPrice, getGlassPrice, getLaborCost, getEucalyptusFoundation, getElectricalKit, getFreight, getModelDiscountRate } from "~/lib/pricing";
import { StaggerContainer, StaggerItem } from "~/components/common/ScrollReveal";
import Image from "next/image";
import { Header } from "~/components/layout/Header";
import { WhatsAppButton } from "~/components/common/WhatsAppButton";
import { FooterWoodBahia } from "~/components/layout/FooterWoodBahia";
import { cn } from "~/lib/utils";

// Utilitários de preço (idênticos ao ModelsSection)
function parsePriceToBRL(val: any): number {
  if (typeof val === "number") return val;
  if (!val) return 0;
  const str = val.toString().replace(/[R$\s]/gi, "");
  if (str.includes(",")) return parseFloat(str.replace(/\./g, "").replace(",", ".")) || 0;
  return parseFloat(str.replace(/[^\d.]/g, "")) || 0;
}

function formatBRL(val: any): string {
  if (val == null || isNaN(Number(val))) return "R$ 0,00";
  return Number(val).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function ModelsGalleryPage() {
  const [models, setModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [selectedModalidade, setSelectedModalidade] = useState<'kit' | 'parceira' | 'turnkey'>('kit');

  useEffect(() => {
    setMounted(true);
    const fetchModels = async () => {
      if (!db) {
        setModels(initialModels);
        setLoading(false);
        return;
      }
      try {
        const querySnapshot = await getDocs(collection(db, "models"));
        let modelsData = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .map(applyModelOverrides);
        
        if (modelsData.length > 0) {
          const dbIds = new Set(modelsData.map((m: any) => m.id));
          const missingModels = initialModels.filter(m => !dbIds.has(m.id));
          modelsData = [...modelsData, ...missingModels].map(applyModelOverrides);
          setModels(modelsData);
        } else {
          setModels(initialModels.map(applyModelOverrides));
        }
      } catch {
        setModels(initialModels);
      } finally {
        setLoading(false);
      }
    };
    fetchModels();
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-primary/5 to-transparent" />

      <main className="relative z-10 pb-24 pt-28 sm:pt-32">
        <div className="container mx-auto px-4">

          {/* Hero */}
          <div className="mb-10 text-center sm:mb-14">
            <span className="mb-4 inline-block rounded-full bg-secondary/10 px-4 py-2 text-sm font-medium text-secondary">
              Kits Pré-fabricados de Madeira
            </span>
            <h1 className="font-serif mb-4 text-3xl font-bold leading-tight tracking-tight text-primary sm:text-4xl md:text-5xl lg:text-6xl">
              Nossos Modelos
              <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                de Kits Estruturais
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Estruturas em madeira pinus tratada e total flexibilidade de implantação de acordo com o seu orçamento.
            </p>

            {/* Seletor de Modalidade Dinâmico */}
            <div className="mt-8 flex justify-center">
              <div className="inline-flex flex-col sm:flex-row rounded-2xl bg-muted/65 p-1.5 border border-border/50 gap-1.5 shadow-inner backdrop-blur-sm">
                {[
                  { id: 'kit', label: '1. Kit Madeiramento', emoji: '🪵', desc: 'Apenas a estrutura' },
                  { id: 'parceira', label: '2. Kit + Montagem Parceira', emoji: '🔨', desc: 'Indicação credenciada' },
                  { id: 'turnkey', label: '3. Wood Bahia Chave na Mão', emoji: '🔑', desc: 'Obra 100% coordenada' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedModalidade(tab.id as any)}
                    className={cn(
                      "flex flex-col items-center sm:items-start rounded-xl px-4 py-2.5 text-center sm:text-left transition-all duration-300 min-w-[150px] md:min-w-[190px]",
                      selectedModalidade === tab.id
                        ? "bg-white text-primary shadow-md scale-105 border border-primary/5 font-bold"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/30 font-medium"
                    )}
                  >
                    <div className="flex items-center gap-1.5 text-xs md:text-sm">
                      <span>{tab.emoji}</span>
                      <span>{tab.label}</span>
                    </div>
                    <span className="hidden sm:inline text-[9px] opacity-70 mt-0.5 font-medium">
                      {tab.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Banner desconto */}
          {selectedModalidade === 'kit' && (
            <div className="mb-8 flex items-center justify-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 py-3 px-5 text-center sm:mx-auto sm:max-w-xl">
              <Tag className="h-4 w-4 shrink-0 text-amber-600" />
              <p className="text-sm font-semibold text-amber-800">
                10% de desconto à vista em todos os modelos
              </p>
            </div>
          )}

          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {models.map((model, idx) => {
                const kitFull = parsePriceToBRL(model.kitPrice || model.price);
                
                // Metragem e cálculos dinâmicos correspondentes
                const areaStr = model.area || '';
                const numericArea = parseFloat(areaStr.toString().replace(',', '.').replace(/[^\d.]/g, '')) || 0;

                const laborCost = getLaborCost(numericArea);
                const modelFixturesPrice = model.fixturesPrice ? parsePriceToBRL(model.fixturesPrice) : getFixturesPrice(numericArea).base;
                const modelTilesPrice = model.tilesStainPrice ? parsePriceToBRL(model.tilesStainPrice) : getTilesStainPrice(numericArea).total;
                const modelGlassPrice = getGlassPrice(numericArea);
                const adminCost = Math.round(laborCost * 0.25); // 25% de coordenação
                
                const discountRate = getModelDiscountRate(model.id || model.name, model.discountRate);

                // 1. Kit Madeiramento (Completo com Frete)
                const kitEstimation = kitFull + getFreight(numericArea);
                const kitPriceDiscounted = kitEstimation - (kitFull * discountRate);

                // 2. Montagem Parceira (Completo com Frete + Fundação Eucalipto)
                const partnerEstimation = kitFull + laborCost + getEucalyptusFoundation(numericArea) + getFreight(numericArea);
                const partnerEstimationDiscounted = partnerEstimation - (kitFull * discountRate);

                // 3. Chave na Mão (Obra Completa)
                const paintCost = numericArea <= 25 ? 2000 : numericArea <= 55 ? 3000 : 4500;
                const basePrice = numericArea * 150;
                const turnkeyEstimation = kitFull + basePrice + laborCost + adminCost + getEucalyptusFoundation(numericArea) + modelTilesPrice + modelFixturesPrice + modelGlassPrice + paintCost + getElectricalKit(numericArea) + getFreight(numericArea);
                const turnkeyEstimationDiscounted = turnkeyEstimation - ((kitFull + basePrice) * discountRate);

                return (
                  <StaggerItem key={model.id} index={idx}>
                    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-sm transition-all hover:border-primary/40 hover:shadow-xl">

                      {/* Imagem */}
                      <Link href={`/modelo/${model.id}`} className="relative block h-52 shrink-0 overflow-hidden sm:h-56">
                        <Image
                          src={model.image || "/placeholder.svg"}
                          alt={`${model.title || model.name} - Kit pré-fabricado de madeira`}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent opacity-80 transition-opacity group-hover:opacity-60" />

                        {/* Badge */}
                        <div className="absolute top-3 left-3 z-10">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-700/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow">
                            <Package className="h-3 w-3" />
                            Kit Premium
                          </span>
                        </div>

                        {/* Nome */}
                        <div className="absolute bottom-3 left-4 right-4">
                          <p className="font-serif text-base font-bold text-white drop-shadow-md sm:text-xl">
                            {model.title || model.name}
                          </p>
                        </div>
                      </Link>

                      {/* Corpo */}
                      <div className="flex flex-grow flex-col gap-3 p-4 sm:p-5 md:p-6">

                        {/* Info área */}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
                          <Maximize2 className="h-3.5 w-3.5 shrink-0 text-primary" />
                          <span>{model.infoLabel || model.area}</span>
                        </div>

                        {/* Finalidades */}
                        {(() => {
                          const staticModel = initialModels.find(
                            (m) => m.id === model.id || model.id.includes(m.id) || m.id.includes(model.id)
                          );
                          const purposes = model.purposes || staticModel?.purposes || [];
                          
                          if (purposes.length === 0) return null;

                          const labels: Record<string, string> = {
                            airbnb: "Airbnb",
                            moradia: "Moradia",
                            campo: "Campo",
                            praia: "Praia",
                          };

                          return (
                            <div className="flex flex-wrap gap-1.5 mt-0.5">
                              {purposes.map((p: string) => (
                                <span 
                                  key={p} 
                                  className="inline-flex items-center rounded-md bg-[#FAF8F5] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#B06D46] border border-[#E8DCCF]/60"
                                >
                                  {labels[p] || p}
                                </span>
                              ))}
                            </div>
                          );
                        })()}

                        {/* Descrição */}
                        {model.description && (
                          <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                            {model.description}
                          </p>
                        )}

                        {/* Bloco de preços dinâmico por modalidade */}
                        <div className="mt-auto border-t border-border pt-3">
                          <div className="grid grid-cols-2 gap-3">
                            {/* Coluna Esquerda: Kit Madeiramento sempre */}
                            <div className="flex flex-col justify-between border-r border-border/60 pr-2">
                              <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-primary/60 mb-0.5 leading-none">
                                  🪵 Kit Madeiramento
                                </p>
                                {kitFull > 0 ? (
                                  <div className="flex flex-col mt-1">
                                    <span className="text-[9px] text-muted-foreground line-through leading-none mb-0.5">
                                      {formatBRL(kitEstimation)}
                                    </span>
                                    <span className="font-serif text-sm font-bold text-primary leading-tight sm:text-base">
                                      {formatBRL(kitPriceDiscounted)}
                                    </span>
                                  </div>
                                ) : (
                                  <p className="font-serif text-xs font-bold text-primary mt-1">Consulte</p>
                                )}
                              </div>
                              {kitFull > 0 && (
                                <div className="flex flex-col mt-1">
                                  <span className="text-[8px] sm:text-[9px] text-emerald-700 font-bold block">
                                    {discountRate * 100}% desc. à vista
                                  </span>
                                  <span className="text-[8px] font-medium text-slate-500 mt-0.5 block leading-tight">
                                    ou 18x s/ juros de {formatBRL(kitEstimation / 18)}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Coluna Direita: Depende da modalidade selecionada (Parceira ou Chave na Mão) */}
                            <div className="flex flex-col justify-between pl-1">
                              {selectedModalidade === 'parceira' ? (
                                <>
                                  <div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-[#8C6239] mb-0.5 leading-none">
                                      🔨 Montagem Parceira
                                    </p>
                                    {kitFull > 0 ? (
                                      <div className="flex flex-col mt-1">
                                        <span className="text-[9px] text-muted-foreground line-through leading-none mb-0.5">
                                          {formatBRL(partnerEstimation)}
                                        </span>
                                        <span className="font-serif text-sm font-bold text-[#8C6239] leading-tight sm:text-base">
                                          {formatBRL(partnerEstimationDiscounted)}
                                        </span>
                                      </div>
                                    ) : (
                                      <p className="font-serif text-xs font-bold text-[#8C6239] mt-1">Consulte</p>
                                    )}
                                  </div>
                                  <div className="flex flex-col mt-1">
                                    <span className="text-[8px] sm:text-[9px] text-[#8C6239] font-bold block">
                                      {discountRate * 100}% desc. à vista
                                    </span>
                                    <span className="text-[8px] font-medium text-slate-500 mt-0.5 block leading-tight">
                                      ou Kit em 18x s/ juros de {formatBRL(kitEstimation / 18)}
                                    </span>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-emerald-700 mb-0.5 leading-none">
                                      🔑 Chave na Mão
                                    </p>
                                    {kitFull > 0 ? (
                                      <div className="flex flex-col mt-1">
                                        <span className="text-[9px] text-muted-foreground line-through leading-none mb-0.5">
                                          {formatBRL(turnkeyEstimation)}
                                        </span>
                                        <span className="font-serif text-sm font-bold text-emerald-700 leading-tight sm:text-base">
                                          {formatBRL(turnkeyEstimationDiscounted)}
                                        </span>
                                      </div>
                                    ) : (
                                      <p className="font-serif text-xs font-bold text-emerald-700 mt-1">Consulte</p>
                                    )}
                                  </div>
                                  <div className="flex flex-col mt-1">
                                    <span className="text-[8px] sm:text-[9px] text-emerald-700 font-bold block">
                                      {discountRate * 100}% desc. à vista
                                    </span>
                                    <span className="text-[8px] font-medium text-slate-500 mt-0.5 block leading-tight">
                                      ou Kit em 18x s/ juros de {formatBRL(kitEstimation / 18)}
                                    </span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>

                          {selectedModalidade === 'kit' && kitFull > 0 && (
                            <div className="text-[10px] text-[#8C6239] font-bold bg-[#E8DCCF]/20 px-2 py-1 rounded-lg border border-[#E8DCCF]/45 mt-2.5 inline-block">
                              🪵 Opcional Kit Base + Assoalho: {formatBRL(numericArea * 150)}
                            </div>
                          )}
                        </div>
                      </div>

                    {/* Rodapé */}
                    <div className="mt-auto flex flex-col gap-2 p-4 pt-1 sm:flex-row sm:items-end sm:justify-between border-t border-stone-50">
                      <p className="text-[9px] italic leading-snug text-muted-foreground/70 sm:max-w-[220px]">
                        {selectedModalidade === 'kit' && "*Valores estimativos. Inclui frete. Solicite uma proposta para valores reais do frete e fundação para o seu terreno."}
                        {selectedModalidade === 'parceira' && "*Valores estimativos. Inclui frete e fundação. Solicite uma proposta para obter valores reais."}
                        {selectedModalidade === 'turnkey' && "*Valores estimativos. Obra completa. Solicite uma proposta para obter valores reais de frete e fundação no seu terreno."}
                      </p>
                      <Link
                        href={`/modelo/${model.id}`}
                        className="group/btn inline-flex w-full items-center justify-center gap-2 rounded-xl bg-secondary/10 px-4 py-2.5 text-sm font-bold text-secondary transition-all hover:bg-secondary hover:text-white sm:w-auto sm:shrink-0"
                      >
                        Simular
                        <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </StaggerItem>
                );
              })}
            </StaggerContainer>
          )}
        </div>
      </main>

      <FooterWoodBahia />
      <WhatsAppButton />
    </div>
  );
}
