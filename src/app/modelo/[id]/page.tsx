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
  Hammer,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "~/lib/firebase";
import { initialModels, applyModelOverrides } from "~/lib/data";
import { getTilesStainPrice, getFixturesPrice } from "~/lib/pricing";
import { Header } from "~/components/layout/Header";
import { WhatsAppButton } from "~/components/common/WhatsAppButton";
import { ScrollReveal } from "~/components/common/ScrollReveal";
import { Dialog, DialogContent, DialogTitle } from "~/components/ui/dialog";
import Image from "next/image";
import { FooterWoodBahia } from "~/components/layout/FooterWoodBahia";
import { TransparencySection } from "~/components/sections/TransparencySection";

const renderFormattedText = (text: string) => {
  if (!text) return null;
  return text.split('\n').map((paragraph, index) => {
    if (!paragraph.trim()) return null;
    
    const formatBold = (str: string) => {
      const parts = str.split(/(\*\*.*?\*\*)/g);
      return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-semibold text-[#5C3317]">{part.slice(2, -2)}</strong>;
        }
        return part;
      });
    };

    const cleanPara = paragraph.trim();
    const startsWithIcon = /^[\p{Emoji}\p{Emoji_Presentation}\p{Extended_Pictographic}]/u.test(cleanPara);

    if (startsWithIcon || cleanPara.endsWith(':')) {
      return (
        <p key={index} className="text-base font-bold text-[#5C3317] mt-3">
          {formatBold(paragraph)}
        </p>
      );
    }

    return (
      <p key={index} className="text-base text-muted-foreground mt-1">
        {formatBold(paragraph)}
      </p>
    );
  });
};

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

  // Calculadora Opcionais Dinâmicos
  const [selectedOptions, setSelectedOptions] = useState<Record<string, boolean>>({});

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
          setModel(applyModelOverrides({ id: docSnap.id, ...docSnap.data() }));
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
                setModel(applyModelOverrides({ id, ...fbSnap.data() }));
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

  // Cálculos Dinâmicos
  // Corrige o bug da vírgula antes de limpar: '10,5m²' -> '10.5'
  const numericArea = parseFloat((model.area || "0").toString().replace(',', '.').replace(/[^\d.]/g, ''));
  
  const parseCurrencyToNumber = (val: any) => {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    
    let str = val.toString().replace(/[R$\s]/gi, ''); // Limpa 'R$' e espaços
    
    // Se não tiver vírgula (ex: 8906.00), usa parseFloat normal limpando R$
    if (!str.includes(',')) {
      return parseFloat(str.replace(/[^\d.-]/g, '')) || 0;
    }
    // Formato PT-BR (ex: 8.906,00)
    return parseFloat(str.replace(/\./g, '').replace(',', '.')) || 0;
  };

  const kitBasePriceNum = model.kitPrice ? parseCurrencyToNumber(model.kitPrice) : parseCurrencyToNumber(model.price);

  // ── Tabela de opcionais por modelo (hardcoded) ─────────────────────────────
  type Addon = { id: string; name: string; price: number; note?: string };
  const MODEL_ADDONS: Record<string, Addon[]> = {
    // Camping Arembepe (sem portas e janelas)
    arembepe: [
      { id: 'cobertura', name: 'Kit Cobertura (telhas ecológicas e manta térmica)', price: 3500 },
      { id: 'pintura',   name: 'Kit Pintura (Stain impregnante)',                   price: 1100 },
      { id: 'ferragens', name: 'Kit Ferragens (parafusos, porcas, barras roscadas, etc...)', price: 900 },
    ],
    // Casa Jorge Amado (sem portas e janelas)
    'jorge-amado': [
      { id: 'cobertura', name: 'Kit Cobertura (telhas ecológicas e manta térmica)', price: 12900 },
      { id: 'pintura',   name: 'Kit Pintura (Stain impregnante)',                   price: 3500  },
      { id: 'ferragens', name: 'Kit Ferragens (parafusos, porcas, barras roscadas, etc...)', price: 2700  },
    ],
    // Chalé Baixios
    baixios: [
      { id: 'cobertura', name: 'Kit Cobertura (telhas ecológicas e manta térmica)', price: 9500  },
      { id: 'pintura',   name: 'Kit Pintura (Stain impregnante)',                   price: 3000  },
      { id: 'ferragens', name: 'Kit Ferragens (parafusos, porcas, barras roscadas, etc...)', price: 1900  },
      { id: 'portas',    name: 'Kit Portas e Janelas em Madeira',                  price: 1500  },
    ],
    // Chalé Guarajuba
    guarajuba: [
      { id: 'cobertura', name: 'Kit Cobertura (telhas ecológicas e manta térmica)', price: 9500  },
      { id: 'pintura',   name: 'Kit Pintura (Stain impregnante)',                   price: 3000  },
      { id: 'ferragens', name: 'Kit Ferragens (parafusos, porcas, barras roscadas, etc...)', price: 2500  },
      { id: 'portas',    name: 'Kit Portas e Janelas em Madeira',                  price: 2500  },
    ],
    // Chalé Itacimirim (com porta de correr)
    itacimirim: [
      { id: 'cobertura', name: 'Kit Cobertura (telhas ecológicas e manta térmica)', price: 9000  },
      { id: 'pintura',   name: 'Kit Pintura (Stain impregnante)',                   price: 3000  },
      { id: 'ferragens', name: 'Kit Ferragens (parafusos, porcas, barras roscadas, etc...)', price: 2000  },
      { id: 'portas',    name: 'Kit Portas e Janelas em Madeira (porta de correr inclusa)', price: 4500, note: 'Porta de correr inclusa' },
    ],
    // Chalé Praia do Forte (com porta de correr)
    'praia-do-forte': [
      { id: 'cobertura', name: 'Kit Cobertura (telhas ecológicas e manta térmica)', price: 7500  },
      { id: 'pintura',   name: 'Kit Pintura (Stain impregnante)',                   price: 2500  },
      { id: 'ferragens', name: 'Kit Ferragens (parafusos, porcas, barras roscadas, etc...)', price: 1800  },
      { id: 'portas',    name: 'Kit Portas e Janelas em Madeira (porta de correr inclusa)', price: 3500, note: 'Porta de correr inclusa' },
    ],
  };

  // Normaliza o ID da URL para bater com as chaves do mapa
  const normalizedId = id
    .toLowerCase()
    .replace(/^chale-/, '')       // remove prefixo 'chale-'
    .replace(/^cabana-camping-/, '') // remove prefixo 'cabana-camping-'
    .replace(/^camping-/, '');   // remove prefixo 'camping-'

  // Determinar as opções disponíveis para o modelo
  let availableOptions: Addon[] = [];

  // Procura primeiro no mapa de configuração local (MODEL_ADDONS)
  const matchedKey = Object.keys(MODEL_ADDONS).find(key =>
    normalizedId.includes(key) || model.name?.toLowerCase().includes(key)
  );

  if (matchedKey) {
    // Prioridade 1: Nossa configuração local (garante que modelos como Jorge Amado sigam a regra nova)
    availableOptions = MODEL_ADDONS[matchedKey] ?? [];
  } else if (model.addOns && Array.isArray(model.addOns)) {
    // Prioridade 2: dados do Firebase (campo addOns)
    availableOptions = model.addOns;
  } else {
    // Fallback genérico: divisão percentual (75/25 Cobertura/Pintura — 30/70 Ferragens/Portas)
      const tilesTotalNum = model.tilesStainPrice ? parseCurrencyToNumber(model.tilesStainPrice) : getTilesStainPrice(numericArea).total;
      const fixturesTotalNum = model.fixturesPrice ? parseCurrencyToNumber(model.fixturesPrice) : getFixturesPrice(numericArea).base;
      const coberturaPrice = Math.round(tilesTotalNum * 0.75);
      const pinturaPrice = tilesTotalNum - coberturaPrice;
      const ferragensPrice = Math.round(fixturesTotalNum * 0.30);
      const portasPrice = fixturesTotalNum - ferragensPrice;

      availableOptions = [
        { id: 'cobertura', name: 'Kit Cobertura (telhas ecológicas e manta térmica)', price: coberturaPrice },
        { id: 'pintura',   name: 'Kit Pintura (Stain impregnante)',                   price: pinturaPrice  },
        { id: 'ferragens', name: 'Kit Ferragens (parafusos, porcas, barras roscadas, etc...)', price: ferragensPrice },
        { id: 'portas',    name: 'Kit Portas e Janelas em Madeira',                  price: portasPrice   },
      ];
    }

  const subtotalOptions = availableOptions.reduce((acc, opt) => {
    return acc + (selectedOptions[opt.id] ? opt.price : 0);
  }, 0);
  
  const totalKitPurchase = kitBasePriceNum + subtotalOptions;

  const toggleOption = (optId: string) => {
    setSelectedOptions(prev => ({ ...prev, [optId]: !prev[optId] }));
  };

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
                    <span className="inline-block rounded-full px-4 py-2 text-sm font-bold text-white shadow-md animate-pulse" style={{ backgroundColor: '#B8860B' }}>
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

                <div className="relative mb-8 flex flex-col gap-6 overflow-hidden rounded-3xl border border-border bg-card shadow-sm p-6 md:p-8 lg:flex-row lg:gap-8">
                  {/* Bloco 1: Produto (Kit) */}
                  <div className="relative z-10 flex-1 flex flex-col">
                    <div className="mb-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/80 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-800">
                        <Package className="h-3 w-3" />
                        Nosso Produto
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-[#4A2B1D] mb-1">Kit Madeiramento Premium</h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      Estrutura completa em pinus tratado. As peças são enviadas em tamanhos próximos para ajuste e corte na obra. Inclui manual técnico.
                    </p>
                    
                    <div className="mb-6 flex justify-between items-end border-b border-border/50 pb-4">
                      <div>
                        <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-1">
                          Valor Base do Kit
                        </p>
                        <p className="text-[#4A2B1D] font-serif text-2xl font-bold">
                          {kitBasePriceNum.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </p>
                      </div>
                    </div>

                    <div className="mt-2">
                      <p className="text-xs uppercase tracking-widest font-bold text-emerald-800 mb-3 flex items-center gap-2">
                        + Opcionais Disponíveis no Kit:
                      </p>
                      <div className="space-y-3">
                        {availableOptions.map((opt) => (
                          <label key={opt.id} className="flex items-center justify-between cursor-pointer group hover:bg-emerald-50/50 p-2 -mx-2 rounded-lg transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="relative flex items-center">
                                <input 
                                  type="checkbox" 
                                  checked={!!selectedOptions[opt.id]}
                                  onChange={() => toggleOption(opt.id)}
                                  className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                />
                              </div>
                              <span className="text-sm text-[#735F53] font-medium group-hover:text-[#4A2B1D]">{opt.name}</span>
                            </div>
                            <span className="text-sm font-bold text-emerald-700">
                              + {opt.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="mt-auto pt-6 border-t border-emerald-100">
                      <div className="bg-emerald-50 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-emerald-100/50 shadow-sm">
                        <p className="text-sm font-bold text-emerald-900 uppercase tracking-widest">
                          Subtotal do Kit:
                        </p>
                        <p className="font-serif text-3xl font-bold text-emerald-700">
                          {totalKitPurchase.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4">
                      <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-1">
                        Frete
                      </p>
                      {model.freight_value ? (
                        <div>
                          {model.freight_is_promo ? (
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-3">
                                <span className="text-base text-muted-foreground line-through font-serif">{model.freight_value}</span>
                                <span className="font-serif text-xl font-bold text-emerald-600">
                                  R$ {(parseFloat(model.freight_value.replace(/[^\d,]/g, '').replace(',', '.')) / 2).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </span>
                              </div>
                              <p className="text-[10px] font-bold text-emerald-600 uppercase mt-1">
                                Frete compartilhado (pagamos 50%)
                              </p>
                            </div>
                          ) : (
                            <p className="text-[#4A2B1D] font-serif text-xl font-bold">
                              {model.freight_value}
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">
                          Frete compartilhado por R$ 700,00
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Bloco 2: Serviço Independente */}
                  <div className="relative z-10 flex flex-1 flex-col border-t border-border/60 pt-6 lg:border-l lg:border-t-0 lg:pt-0 lg:pl-8">
                    <div className="rounded-2xl bg-[#F8F9FA] border border-slate-200/60 p-6 h-full flex flex-col">
                      <div className="mb-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-200 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-700">
                          <Hammer className="h-3 w-3" />
                          Serviço Independente
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-1">Montagem por Credenciados</h3>
                      <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                        Conectamos você a carpinteiros especialistas. Contrato direto com o profissional, garantindo isenção de taxas ocultas. Eles realizam todos os cortes e ajustes sob medida no local.
                      </p>

                      <div className="mb-6">
                        <p className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-1">Custo Estimado (Mão de Obra)</p>
                        <p className="font-serif text-2xl font-bold text-slate-800">
                          A partir de R$ {(numericArea * 500).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>

                      <div className="mt-auto text-xs text-slate-500 italic bg-white p-3 rounded-xl border border-slate-100">
                        * O valor acima é uma estimativa. O pagamento da montagem é feito diretamente ao profissional escolhido, conforme andamento da obra.
                      </div>
                    </div>
                  </div>
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
                <h2 className="text-3xl font-bold mb-4 text-[#4A2B1D]">Sobre o Projeto</h2>
                <div className="mb-8">
                  {renderFormattedText(details.fullDescription)}
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-lg font-semibold mb-2">
                      Conceito Arquitetônico
                    </h3>
                    <p className="text-muted-foreground mb-4">{details.concept}</p>
                    <div className="bg-amber-50/50 border border-amber-200/50 rounded-xl p-4 text-sm text-[#5C3317]">
                      <p className="font-semibold mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        Atenção aos detalhes do Kit:
                      </p>
                      <p className="mb-2">
                        As peças de madeira são fornecidas em tamanhos aproximados. O ajuste fino, os cortes precisos e o encaixe perfeito são realizados no local da obra por carpinteiros especializados.
                      </p>
                      <p>
                        <strong>Quer alterar a posição de uma parede, porta ou janela?</strong> A personalização do layout pode ser combinada e executada diretamente com os carpinteiros parceiros durante a montagem.
                      </p>
                    </div>
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
