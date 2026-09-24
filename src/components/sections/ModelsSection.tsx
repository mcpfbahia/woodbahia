"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Maximize2, Truck, Pencil, Loader2, Package, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "~/lib/firebase";
import { initialModels, applyModelOverrides } from "~/lib/data";
import { getTilesStainPrice, getFixturesPrice, getGlassPrice, getLaborCost, getEucalyptusFoundation, getElectricalKit, getFreight, getModelDiscountRate } from "~/lib/pricing";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from "../common/ScrollReveal";
import { cn } from "~/lib/utils";
import { trackBeginSimulation, trackViewModel } from "~/lib/analytics";

// Utilitários de preço
function parsePriceToBRL(val: any): number {
  if (typeof val === "number") return isNaN(val) ? 0 : val;
  if (!val) return 0;
  const str = val.toString().replace(/[R$\s]/gi, "");
  if (str.includes(",")) return parseFloat(str.replace(/\./g, "").replace(",", ".")) || 0;
  return parseFloat(str.replace(/[^\d.]/g, "")) || 0;
}

function formatBRL(val: any): string {
  if (val == null || isNaN(Number(val))) return "R$ 0,00";
  return Number(val).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export const ModelsSection = ({ initialModelsData }: { initialModelsData?: any[] }) => {
  const [models, setModels] = useState<any[]>(() => {
    if (initialModelsData && initialModelsData.length > 0) return initialModelsData.map(applyModelOverrides);
    return initialModels.map(applyModelOverrides);
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModalidade, setSelectedModalidade] = useState<'kit' | 'parceira' | 'turnkey'>('kit');

  useEffect(() => {
    const fetchModels = async () => {
      if (!db) {
        setModels(initialModels);
        setIsLoading(false);
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
          
          // Deduplicar caso ainda existam itens com mesmo nome
          const uniqueMerged: any[] = [];
          const seenNames = new Set<string>();
          for (const m of modelsData) {
            const normalizedName = (m.name || m.title || '').trim().toLowerCase();
            if (!seenNames.has(normalizedName)) {
              seenNames.add(normalizedName);
              uniqueMerged.push(m);
            }
          }
          setModels(uniqueMerged);
        } else {
          setModels(initialModels.map(applyModelOverrides));
        }
      } catch {
        setModels(initialModels);
      } finally {
        setIsLoading(false);
      }
    };
    fetchModels();
  }, []);

  return (
    <section id="modelos" className="relative overflow-hidden bg-card py-20 md:py-32">
      <div className="absolute inset-0 bg-pattern opacity-30" />

      <div className="container relative z-10 mx-auto px-4">
        <ScrollReveal className="mb-12 text-center">
          <span className="mb-4 inline-block rounded-full bg-secondary/10 px-4 py-2 text-sm font-medium text-secondary">
            Nossos Modelos de Kits Pré-fabricados
          </span>
          <h2 className="section-title text-3xl font-bold md:text-5xl">
            Estruturas de alta precisão
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {" "}prontas para o seu terreno
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
            Fornecemos o kit completo em madeira pinus tratada e oferecemos total flexibilidade de investimento de acordo com a modalidade de obra desejada.
          </p>

          {/* Seletor de Modalidade Dinâmico */}
          <div className="mt-8 flex justify-center w-full">
            <div className="flex w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:w-auto sm:overflow-visible sm:inline-flex rounded-2xl bg-muted/65 p-1.5 border border-border/50 gap-1.5 shadow-inner backdrop-blur-sm">
              {[
                { id: 'kit', label: '1. Kit Madeiramento', emoji: '🪵', desc: 'Apenas a estrutura' },
                { id: 'parceira', label: '2. Kit + Montagem Parceira', emoji: '🔨', desc: 'Indicação credenciada' },
                { id: 'turnkey', label: '3. Wood Bahia Chave na Mão', emoji: '🔑', desc: 'Obra 100% coordenada' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedModalidade(tab.id as any)}
                  className={cn(
                    "flex flex-col items-center sm:items-start rounded-xl px-4 py-2.5 text-center sm:text-left transition-all duration-300 min-w-[200px] shrink-0 md:min-w-[190px]",
                    selectedModalidade === tab.id
                      ? "bg-white text-primary shadow-md scale-[1.02] sm:scale-105 border border-primary/5 font-bold"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/30 font-medium opacity-80 hover:opacity-100"
                  )}
                >
                  <div className="flex items-center gap-1.5 text-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-md">
                    <span>{tab.emoji}</span>
                    <span className="whitespace-nowrap">{tab.label}</span>
                  </div>
                  <span className="inline text-xs opacity-70 mt-0.5 font-medium whitespace-nowrap">
                    {tab.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {models?.slice(0, 6).map((model, idx) => {
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
              const safeNum = (n: any) => isNaN(Number(n)) ? 0 : Number(n);

              // 1. Kit Madeiramento (Completo com Frete)
              const kitEstimation = safeNum(kitFull) + safeNum(getFreight(numericArea));
              const kitPriceDiscounted = kitEstimation - (safeNum(kitFull) * safeNum(discountRate));

              // 2. Montagem Parceira (Completo com Frete + Fundação Eucalipto)
              const partnerEstimation = safeNum(kitFull) + safeNum(laborCost) + safeNum(getEucalyptusFoundation(numericArea)) + safeNum(getFreight(numericArea));
              const partnerEstimationDiscounted = partnerEstimation - (safeNum(kitFull) * safeNum(discountRate));

              // 3. Chave na Mão (Obra Completa)
              const paintCost = numericArea <= 25 ? 2000 : numericArea <= 55 ? 3000 : 4500;
              const basePrice = numericArea * 150;
              const turnkeyEstimation = safeNum(kitFull) + safeNum(basePrice) + safeNum(laborCost) + safeNum(adminCost) + safeNum(getEucalyptusFoundation(numericArea)) + safeNum(modelTilesPrice) + safeNum(modelFixturesPrice) + safeNum(modelGlassPrice) + safeNum(paintCost) + safeNum(getElectricalKit(numericArea)) + safeNum(getFreight(numericArea));
              const turnkeyEstimationDiscounted = turnkeyEstimation - ((safeNum(kitFull) + safeNum(basePrice)) * safeNum(discountRate));

              return (
                <StaggerItem key={model.id} index={idx}>
                  <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-xl">

                    {/* Imagem */}
                    <Link 
                      href={`/modelo/${model.id}`} 
                      className="relative block h-48 shrink-0 overflow-hidden sm:h-52"
                      onClick={() => trackViewModel(model.id, model.name)}
                    >
                      <Image
                        src={model.image || "/placeholder.svg"}
                        alt={`${model.name} - Kit pré-fabricado de madeira`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />

                      {/* Badge */}
                      <div className="absolute top-3 left-3 z-10">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-700/90 backdrop-blur-sm px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest text-white shadow">
                          <Package className="h-3 w-3" />
                          Kit Premium
                        </span>
                      </div>

                      {/* Nome */}
                      <div className="absolute bottom-3 left-3 right-3">
                        <p className="font-serif text-base font-bold text-white drop-shadow sm:text-lg">
                          {model.name}
                        </p>
                      </div>
                    </Link>

                    {/* Corpo */}
                    <div className="flex flex-grow flex-col gap-3 p-4 sm:p-5">

                      {/* Info área */}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
                        <Maximize2 className="h-3.5 w-3.5 shrink-0 text-primary" />
                        <span>{model.infoLabel || model.area}</span>
                      </div>

                      {/* Badges de Finalidades */}
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
                          <div className="flex flex-wrap gap-1.5">
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
                      <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:text-sm sm:line-clamp-3">
                        {model.description}
                      </p>

                      {/* Bloco de preços dinâmico por modalidade */}
                      <div className="mt-auto border-t border-border pt-4">
                        <div className="flex flex-col">
                          <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                            {selectedModalidade === 'kit' && "🪵 Kit Madeiramento"}
                            {selectedModalidade === 'parceira' && "🔨 Montagem Parceira"}
                            {selectedModalidade === 'turnkey' && "🔑 Chave na Mão"}
                          </p>
                          
                          {kitFull > 0 ? (
                            <div className="flex flex-col">
                               <span className="text-xs text-muted-foreground line-through decoration-primary/30">
                                 {formatBRL(
                                   selectedModalidade === 'kit' ? kitEstimation :
                                   selectedModalidade === 'parceira' ? partnerEstimation :
                                   turnkeyEstimation
                                 )}
                               </span>
                               <div className="flex items-baseline gap-2">
                                 <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">A partir de</span>
                                 <span className="font-serif text-xl sm:text-2xl font-bold text-primary">
                                   {formatBRL(
                                     selectedModalidade === 'kit' ? kitPriceDiscounted :
                                     selectedModalidade === 'parceira' ? partnerEstimationDiscounted :
                                     turnkeyEstimationDiscounted
                                   )}
                                 </span>
                               </div>
                               <span className="text-xs font-bold text-emerald-700 mt-1">
                                 {discountRate * 100}% desc. à vista ou parcelado em até 12x s/ juros
                               </span>
                            </div>
                          ) : (
                            <p className="font-serif text-lg font-bold text-primary">Consulte</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Rodapé */}
                    <div className="mt-auto flex flex-col gap-2 p-4 pt-1 sm:flex-row sm:items-end sm:justify-between border-t border-stone-50">
                      <p className="text-[9px] italic leading-snug text-muted-foreground/70 sm:max-w-[200px]">
                        {selectedModalidade === 'kit' && "*Valores estimativos. Inclui frete. Solicite uma proposta para valores reais do frete e fundação para o seu terreno."}
                        {selectedModalidade === 'parceira' && "*Valores estimativos. Inclui frete e fundação. Solicite uma proposta para obter valores reais."}
                        {selectedModalidade === 'turnkey' && "*Valores estimativos. Obra completa. Solicite uma proposta para obter valores reais de frete e fundação no seu terreno."}
                      </p>
                      <Link
                        href={`/modelo/${model.id}`}
                        className="group/btn inline-flex w-full items-center justify-center gap-2 rounded-xl bg-secondary/10 px-4 py-2.5 text-sm font-bold text-secondary transition-all hover:bg-secondary hover:text-white sm:w-auto sm:shrink-0"
                        onClick={() => trackBeginSimulation(model.id, model.name)}
                      >
                        Simular
                        <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}

            {/* Card Kit Personalizado */}
            <StaggerItem index={6} className="hidden xl:block">
              <div className="group flex h-full flex-col justify-between overflow-hidden rounded-2xl border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5 p-6 transition-all duration-300 hover:border-primary/50">
                <div className="flex flex-grow flex-col items-center justify-center py-8 text-center">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 transition-transform group-hover:scale-110">
                    <Pencil className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="mb-4 font-serif text-2xl font-bold text-primary">Kit Personalizado</h3>
                  <p className="mb-6 max-w-xs text-sm leading-relaxed text-muted-foreground">
                    Tem um projeto diferente em mente? Desenvolvemos kits sob medida para qualquer dimensão ou layout.
                  </p>
                  <a
                    href="https://wa.me/5571992936290?text=Olá! Gostaria de informações sobre um kit personalizado."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-cta w-full"
                  >
                    Solicitar Orçamento
                  </a>
                </div>
                <p className="mt-4 border-t border-border pb-4 pt-2 text-center text-[10px] text-muted-foreground">
                  * Custo adicional para projetos personalizados
                </p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        )}

        {/* Ver todos */}
        <div className="mt-10 flex justify-center">
          <Link href="/modelos" className={cn("btn-cta w-full sm:w-auto")}>
            Ver Todos os Kits
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};
