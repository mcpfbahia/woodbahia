"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Maximize2, Truck, Pencil, Loader2, Package, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "~/lib/firebase";
import { initialModels, applyModelOverrides } from "~/lib/data";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from "../common/ScrollReveal";
import { cn } from "~/lib/utils";

// Utilitários de preço
function parsePriceToBRL(val: any): number {
  if (typeof val === "number") return val;
  if (!val) return 0;
  const str = val.toString().replace(/[R$\s]/gi, "");
  if (str.includes(",")) return parseFloat(str.replace(/\./g, "").replace(",", ".")) || 0;
  return parseFloat(str.replace(/[^\d.]/g, "")) || 0;
}

function formatBRL(val: number): string {
  return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export const ModelsSection = () => {
  const [models, setModels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchModels = async () => {
      if (!db) {
        setModels(initialModels);
        setIsLoading(false);
        return;
      }
      try {
        const querySnapshot = await getDocs(collection(db, "models"));
        const modelsData = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .map(applyModelOverrides);
        setModels(modelsData.length > 0 ? modelsData : initialModels);
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
            Fornecemos o kit completo em madeira pinus tratada, pronto para ser montado por especialistas credenciados no seu terreno.
          </p>
        </ScrollReveal>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {models?.slice(0, 6).map((model, idx) => {
              const kitFull = parsePriceToBRL(model.kitPrice || model.price);
              const kitDiscount = kitFull > 0 ? kitFull * 0.95 : 0;
              const freightFull = parsePriceToBRL(model.freight_value);
              const freightClient = model.freight_is_promo && freightFull > 0 ? freightFull / 2 : freightFull;

              return (
                <StaggerItem key={model.id} index={idx}>
                  <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-xl">

                    {/* Imagem */}
                    <Link href={`/modelo/${model.id}`} className="relative block h-48 shrink-0 overflow-hidden sm:h-52">
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
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-700/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow">
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
                        <Maximize2 className="h-3.5 w-3.5 shrink-0" />
                        <span>{model.infoLabel || model.area}</span>
                      </div>

                      {/* Descrição */}
                      <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:text-sm sm:line-clamp-3">
                        {model.description}
                      </p>

                      {/* Bloco de preços */}
                      <div className="mt-auto space-y-2.5 border-t border-border pt-3">

                        {/* Preço cheio + desconto */}
                        <div className="flex items-end justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                              Valor do Kit
                            </p>
                            {kitFull > 0 ? (
                              <div className="flex flex-wrap items-baseline gap-1.5">
                                <span className="text-xs text-muted-foreground line-through">
                                  {formatBRL(kitFull)}
                                </span>
                                <span className="font-serif text-lg font-bold text-primary sm:text-xl">
                                  {formatBRL(kitDiscount)}
                                </span>
                              </div>
                            ) : (
                              <p className="font-serif text-lg font-bold text-primary">Consulte</p>
                            )}
                          </div>
                          {kitFull > 0 && (
                            <div className="shrink-0 flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold text-amber-700">
                              <Tag className="h-2.5 w-2.5" />
                              5% à vista
                            </div>
                          )}
                        </div>

                        {/* Frete */}
                        {freightFull > 0 && (
                          <div className="flex items-start gap-1.5">
                            <Truck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                            <div className="min-w-0">
                              <span className="text-xs font-semibold text-emerald-700">
                                Frete compartilhado: {formatBRL(freightClient)}
                              </span>
                              {model.freight_is_promo && (
                                <span className="block text-[10px] text-emerald-600/80">
                                  (pagamos 50% — total {formatBRL(freightFull)})
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Rodapé */}
                      <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:items-end sm:justify-between">
                        <p className="text-[10px] italic leading-snug text-muted-foreground/70 sm:max-w-[170px]">
                          * Montagem e opcionais: contratação direta com rede de carpinteiros parceiros.
                        </p>
                        <Link
                          href={`/modelo/${model.id}`}
                          className="group/btn inline-flex w-full items-center justify-center gap-2 rounded-xl bg-secondary/10 px-4 py-2.5 text-sm font-bold text-secondary transition-all hover:bg-secondary hover:text-white sm:w-auto sm:shrink-0"
                        >
                          Ver Kit
                          <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                        </Link>
                      </div>
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
