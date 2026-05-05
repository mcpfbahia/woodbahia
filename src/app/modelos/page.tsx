"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Maximize2, Truck, Loader2, Package, Tag } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "~/lib/firebase";
import { initialModels, applyModelOverrides } from "~/lib/data";
import { StaggerContainer, StaggerItem } from "~/components/common/ScrollReveal";
import Image from "next/image";
import { Header } from "~/components/layout/Header";
import { WhatsAppButton } from "~/components/common/WhatsAppButton";
import { FooterWoodBahia } from "~/components/layout/FooterWoodBahia";

// Utilitários de preço (idênticos ao ModelsSection)
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

export default function ModelsGalleryPage() {
  const [models, setModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

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
        const modelsData = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .map(applyModelOverrides);
        setModels(modelsData.length > 0 ? modelsData : initialModels);
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
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
              Estruturas em madeira pinus tratada, prontas para montagem no seu terreno por especialistas credenciados.
            </p>
          </div>

          {/* Banner desconto */}
          <div className="mb-8 flex items-center justify-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 py-3 px-5 text-center sm:mx-auto sm:max-w-md">
            <Tag className="h-4 w-4 shrink-0 text-amber-600" />
            <p className="text-sm font-semibold text-amber-800">
              5% de desconto em todos os kits para pagamento à vista
            </p>
          </div>

          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {models.map((model, idx) => {
                const kitFull = parsePriceToBRL(model.kitPrice || model.price);
                const kitDiscount = kitFull > 0 ? kitFull * 0.95 : 0;
                const freightFull = parsePriceToBRL(model.freight_value);
                const freightClient = model.freight_is_promo && freightFull > 0 ? freightFull / 2 : freightFull;

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

                        {/* Descrição */}
                        {model.description && (
                          <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                            {model.description}
                          </p>
                        )}

                        {/* Bloco de preços */}
                        <div className="mt-auto space-y-2.5 border-t border-border pt-3">

                          {/* Valor do Kit + desconto */}
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
                                <p className="font-serif text-xl font-bold text-primary">Consulte</p>
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
                              <div>
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
            </StaggerContainer>
          )}
        </div>
      </main>

      <FooterWoodBahia />
      <WhatsAppButton />
    </div>
  );
}
