"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Maximize2,
  Layers,
  Bed,
  Home,
  Check,
  Phone,
  X,
  Clock,
  AlertTriangle,
  Package,
  ChevronLeft,
  ChevronRight,
  Instagram,
  ZoomIn,
  Loader2,
  CreditCard,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "~/lib/firebase";
import { initialModels } from "~/lib/data";
import { Header } from "~/components/layout/Header";
import { WhatsAppButton } from "~/components/common/WhatsAppButton";
import { ScrollReveal } from "~/components/common/ScrollReveal";
import { Dialog, DialogContent, DialogTitle } from "~/components/ui/dialog";
import Image from "next/image";
import { FooterWoodBahia } from "~/components/layout/FooterWoodBahia";
import { TransparencySection } from "~/components/sections/TransparencySection";

export default function ModelDetailPage() {
  const { id } = useParams() as { id: string };
  const [model, setModel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Carrossel Embla
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
    const fetchModel = async () => {
      if (!id) return;

      if (!db) {
        const staticModel = initialModels.find((m) => m.id === id);
        if (staticModel) {
          setModel(staticModel);
        }
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, "models", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setModel({ id: docSnap.id, ...docSnap.data() });
        } else {
          // Tentar no initialModels antes de desistir
          const staticModel = initialModels.find((m) => m.id === id);
          if (staticModel) {
            setModel(staticModel);
          } else {
            // Fallback para IDs específicos baseados no projeto antigo
            const fallbackIds: Record<string, string> = {
              "chale-boipeba": "chale-itacimirim",
              "chale-arraial-dajuda": "chale-itacimirim",
              "chale-praia-do-forte-2": "chale-itacare",
            };

            if (fallbackIds[id]) {
              const mappedId = fallbackIds[id]!;
              const fbFallbackRef = doc(db, "models", mappedId);
              const fbSnap = await getDoc(fbFallbackRef);
              if (fbSnap.exists()) {
                setModel({ id, ...fbSnap.data() });
              } else {
                const staticFallback = initialModels.find(m => m.id === mappedId);
                if (staticFallback) setModel({ ...staticFallback, id });
              }
            }
          }
        }
      } catch (error) {
        console.error("Erro ao buscar modelo:", error);
        const staticModel = initialModels.find((m) => m.id === id);
        if (staticModel) setModel(staticModel);
      } finally {
        setLoading(false);
      }
    };

    fetchModel();
  }, [id]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!model) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="font-serif mb-4 text-2xl font-bold text-primary">
            Modelo não encontrado
          </h1>
          <Link href="/" className="btn-cta bg-primary px-8 py-3 text-white rounded-xl">
            Voltar ao início
          </Link>
        </div>
      </div>
    );
  }

  const details = {
    fullDescription:
      model.fullDescription ||
      model.description ||
      "Descrição detalhada em breve.",
    concept: model.concept || "Conceito arquitetônico sob medida.",
    ideal: model.ideal || "Famílias, investidores e lazer.",
    composition:
      model.composition && model.composition.length > 0
        ? model.composition
        : ["Detalhes sob consulta"],
    features:
      model.features && model.features.length > 0
        ? model.features
        : ["Acabamento Premium", "Design Exclusivo"],
  };

  const allImages = [model.image, ...(model.gallery || [])].filter(Boolean);
  const allCaptions = [
    "Foto Principal",
    ...(model.gallery || []).map(() => "Imagem da Galeria"),
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20">
        {/* Hero do Modelo */}
        <section className="relative overflow-hidden bg-card py-12 md:py-20">
          <div className="absolute inset-0 bg-primary/5 opacity-30" />

          <div className="container relative z-10 mx-auto px-4">
            <Link
              href="/modelos"
              className="mb-8 inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar aos modelos
            </Link>

            <div className="grid items-center gap-12 lg:grid-cols-2">
              {/* Carrossel de Imagens */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div
                  className="overflow-hidden rounded-3xl shadow-xl"
                  ref={emblaRef}
                >
                  <div className="flex">
                    {allImages.map((image, index) => (
                      <div
                        key={index}
                        className="relative flex-[0_0_100%] min-w-0 cursor-pointer group"
                        onClick={() => openLightbox(index)}
                      >
                        <div className="relative aspect-[4/3] w-full">
                          <Image
                            src={image}
                            alt={`${model.name} - ${allCaptions[index]}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                        {/* Overlay de zoom */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90">
                            <ZoomIn className="h-6 w-6 text-primary" />
                          </div>
                        </div>

                        {/* Legenda */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                          <p className="text-sm font-medium text-white">
                            {allCaptions[index]}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Setas de navegação */}
                <button
                  onClick={() => emblaApi?.scrollPrev()}
                  className="shadow-lg absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 transition-colors hover:bg-white"
                  aria-label="Foto anterior"
                >
                  <ChevronLeft className="h-6 w-6 text-primary" />
                </button>
                <button
                  onClick={() => emblaApi?.scrollNext()}
                  className="shadow-lg absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 transition-colors hover:bg-white"
                  aria-label="Próxima foto"
                >
                  <ChevronRight className="h-6 w-6 text-primary" />
                </button>

                {/* Indicadores */}
                <div className="mt-4 flex justify-center gap-2">
                  {allImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => emblaApi?.scrollTo(index)}
                      className={`h-2.5 rounded-full transition-all ${
                        index === selectedIndex
                          ? "w-8 bg-primary"
                          : "bg-muted-foreground/30 h-2.5 w-2.5 hover:bg-muted-foreground/50"
                      }`}
                      aria-label={`Ir para foto ${index + 1}`}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Info */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span className="inline-block rounded-full bg-secondary/10 px-4 py-2 text-sm font-medium text-secondary">
                    Modelo Exclusivo
                  </span>
                  {model.promoBadge && (
                    <span className="inline-block rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white shadow-md animate-pulse">
                      {model.promoBadge}
                    </span>
                  )}
                </div>

                <h1 className="font-serif mb-4 text-4xl font-bold text-[#4A2B1D] md:text-5xl">
                  {model.name}
                </h1>

                <div className="mb-6 flex flex-wrap gap-4">
                  <span className="flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm">
                    <Maximize2 className="h-4 w-4 text-primary" />
                    {model.area}
                  </span>
                  <span className="flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm">
                    <Layers className="h-4 w-4 text-primary" />
                    {model.floors}
                  </span>
                  <span className="flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm">
                    <Bed className="h-4 w-4 text-primary" />
                    {model.bedrooms}{" "}
                    {model.bedrooms === 1 ? "Quarto" : "Quartos"}
                  </span>
                </div>

                <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
                  {model.description}
                </p>

                <div className="relative mb-8 flex flex-col gap-6 overflow-hidden rounded-2xl border-2 border-primary/20 bg-card p-6 md:flex-row md:gap-12">
                  <div className="relative z-10 flex-1">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
                      Kit Completamente Montado
                    </p>
                    {model.promoPrice ? (
                       <div className="flex flex-col">
                         <span className="text-xl text-muted-foreground line-through decoration-red-500/50 font-serif">{model.price}</span>
                         <span className="text-[#4A2B1D] font-serif text-4xl font-bold md:text-5xl text-red-600">{model.promoPrice}</span>
                       </div>
                    ) : (
                       <p className="text-[#4A2B1D] font-serif text-4xl font-bold md:text-5xl">
                         {model.price}
                       </p>
                    )}
                    <p className="mt-2 text-sm text-muted-foreground">
                      Investimento a partir de
                    </p>
                    <p className="mt-1 text-sm font-medium text-cta">
                      * Frete grátis (consulte condições)
                    </p>
                  </div>

                  {model.kitPrice && (
                    <div className="relative z-10 flex flex-1 flex-col justify-center border-t border-border/50 pt-6 md:border-l md:border-t-0 md:pt-0 md:pl-12">
                      <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                        <Package className="h-3.5 w-3.5" />
                        Compre Apenas o Kit
                      </p>
                      <p className="font-serif text-3xl font-bold text-foreground">
                        {model.kitPrice}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Ideal para auto-montagem
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <a
                      href={`https://wa.me/5571992936290?text=Olá! Tenho interesse no ${model.name}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-cta bg-primary !shadow-lg px-6 py-4 text-base flex items-center justify-center gap-2 rounded-xl font-bold"
                    >
                      <Phone className="h-5 w-5" />
                      Pedir Proposta
                    </a>
                    
                    <Link
                      href={`/modelo/${id}/planta`}
                      className="inline-flex items-center justify-center gap-2 border-2 border-primary/20 bg-transparent px-6 py-4 font-bold text-primary rounded-xl hover:bg-primary/5 hover:-translate-y-1 transition-all text-center text-base"
                    >
                      <Layers className="h-5 w-5" />
                      Planta Baixa
                    </Link>
                  </div>

                  <Link
                    href="/simulador/parcelamento"
                    className="group inline-flex items-center justify-between gap-4 border border-[#B06D46]/20 bg-[#B06D46]/5 px-5 py-3 rounded-xl hover:bg-[#B06D46]/10 transition-all w-full sm:w-auto self-start"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#B06D46]/10 rounded-lg text-[#B06D46]">
                        <CreditCard className="h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-[#B06D46] leading-none">Simular Parcela</p>
                        <p className="text-[10px] text-[#B06D46]/70 font-medium uppercase mt-1 tracking-wider">cartão credito até 18X</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-[#B06D46]/40 group-hover:text-[#B06D46] transition-colors" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Detalhes */}
        <section className="bg-background py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-2">
              <ScrollReveal>
                <h2 className="text-3xl font-bold mb-6 text-[#4A2B1D]">Sobre o Projeto</h2>
                <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
                  {details.fullDescription}
                </p>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-lg font-semibold mb-2">
                      Conceito Arquitetônico
                    </h3>
                    <p className="text-muted-foreground">{details.concept}</p>
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-semibold mb-2">Ideal para</h3>
                    <p className="text-muted-foreground">{details.ideal}</p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <div className="mb-8 rounded-2xl bg-card border border-border p-6 md:p-8">
                  <h3 className="font-serif mb-6 flex items-center gap-3 text-xl font-semibold">
                    <Home className="h-6 w-6 text-primary" />
                    Composição
                  </h3>
                  <ul className="grid grid-cols-2 gap-4">
                    {details.composition.map((item: string) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 text-muted-foreground"
                      >
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="card-wood rounded-2xl border border-border bg-background p-6 md:p-8">
                  <h3 className="font-serif mb-6 text-xl font-semibold">
                    Diferenciais do Modelo
                  </h3>
                  <ul className="space-y-3">
                    {details.features.map((feature: string) => (
                      <li
                        key={feature}
                        className="flex items-center gap-3 text-muted-foreground"
                      >
                        <span className="h-2 w-2 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Transparência Total */}
        <TransparencySection />

        {/* Prova Social Instagram */}
        <section className="py-10 md:py-12">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/95 to-secondary p-8 text-center shadow-lg md:p-10"
            >
              <div className="relative z-10">
                <div className="mb-4 flex items-center justify-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#bc1888] shadow-lg">
                    <Instagram className="h-7 w-7 text-white" />
                  </div>
                </div>
                <h3 className="font-serif mb-3 text-2xl font-bold text-white md:text-3xl">
                  Mais de <span className="text-amber-400">45 mil pessoas</span>{" "}
                  acompanham a Wood Bahia.
                </h3>
                <p className="mx-auto mb-6 max-w-lg text-white/70">
                  Siga nosso Instagram e acompanhe as obras em tempo real.
                </p>
                <a
                  href="https://www.instagram.com/woodbahiacasasprefabricadas/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-primary shadow-md transition-colors hover:bg-white/90"
                >
                  <Instagram className="h-5 w-5" />
                  Seguir @woodbahia
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <FooterWoodBahia />
      <WhatsAppButton />

      {/* Lightbox Dialog */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="p-0 border-none bg-black/95 max-w-[95vw] max-h-[95vh]">
          <DialogTitle className="sr-only">Visualização de Imagem</DialogTitle>
          <div className="relative flex h-full min-h-[60vh] w-full items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative h-full w-full"
              >
                <Image
                  src={allImages[lightboxIndex]}
                  alt={allCaptions[lightboxIndex]}
                  fill
                  className="object-contain"
                />
              </motion.div>
            </AnimatePresence>

            {/* Setas Lightbox */}
            <button
              onClick={() =>
                setLightboxIndex((prev) =>
                  prev === 0 ? allImages.length - 1 : prev - 1
                )
              }
              className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
            >
              <ChevronLeft className="h-8 w-8 text-white" />
            </button>
            <button
              onClick={() =>
                setLightboxIndex((prev) =>
                  prev === allImages.length - 1 ? 0 : prev + 1
                )
              }
              className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
            >
              <ChevronRight className="h-8 w-8 text-white" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
