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
import { getTilesStainPrice, getFixturesPrice, getGlassPrice, getLaborCost, getEucalyptusFoundation, getElectricalKit, getFreight, getModelDiscountRate } from "~/lib/pricing";
import { cn } from "~/lib/utils";
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
  const [simModalidade, setSimModalidade] = useState<'kit' | 'parceira' | 'turnkey'>('turnkey');
  const [includeBaseInSim, setIncludeBaseInSim] = useState(false);

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
    'arembepe-plus': [
      { id: 'cobertura', name: 'Kit Cobertura (telhas ecológicas e manta térmica)', price: 5500 },
      { id: 'pintura',   name: 'Kit Pintura (Stain impregnante)',                   price: 1200 },
      { id: 'ferragens', name: 'Kit Ferragens (parafusos, porcas, barras roscadas, etc...)', price: 1200 },
      { id: 'portas',    name: 'Kit Portas e Janelas em Madeira',                  price: 0 },
      { id: 'vidros',    name: 'Vidro Fachada',                                     price: 2500 },
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

  const getScopeItems = (modalidade: 'kit' | 'parceira' | 'turnkey') => {
    // Definimos se a base/assoalho está inclusa na simulação atual
    const hasBase = modalidade === 'turnkey' || includeBaseInSim;

    if (modalidade === 'kit') {
      return {
        title: "Análise do Kit Madeiramento",
        inclusionsTitle: "O que está Incluso no Kit:",
        exclusionsTitle: "O que NÃO está Incluso no Kit:",
        inclusions: [
          "Pilares de sustentação em autoclave",
          "Vigas de travamento",
          "Linhas e caibros de telhado",
          "Estrutura completa das paredes",
          "Estrutura do telhado e forros",
          "Madeira Pinus tratada sob pressão",
          "Projeto estrutural e manual técnico",
          ...(hasBase ? [
            "Barrotes de sustentação de piso",
            "Assoalho de madeira (Base estrutural)"
          ] : [])
        ],
        exclusions: [
          "Portas e janelas (esquadrias)",
          "Ferragens, pregos e parafusos",
          "Barras roscadas e fixadores",
          "Telhas e manta térmica",
          "Vidros fachada",
          "Stain e pintura protetora",
          "Fundação e base civil",
          "Mão de obra de montagem",
          "Instalações de elétrica/hidro",
          "Frete de entrega na obra",
          ...(!hasBase ? [
            "Barrotes de sustentação de piso e assoalho"
          ] : [])
        ]
      };
    } else if (modalidade === 'parceira') {
      return {
        title: "Análise da Montagem Parceira",
        inclusionsTitle: "O que está Incluso na Parceria:",
        exclusionsTitle: "O que NÃO está Incluso na Parceria:",
        inclusions: [
          "Pilares de sustentação em autoclave",
          "Vigas de travamento",
          "Linhas e caibros de telhado",
          "Estrutura completa das paredes",
          "Estrutura do telhado e forros",
          "Madeira Pinus tratada sob pressão",
          "Projeto estrutural e manual técnico",
          "Portas e janelas (esquadrias)",
          "Ferragens, pregos e parafusos",
          "Barras roscadas e fixadores",
          "Mão de obra de montagem credenciada",
          "Fundação estimada (Sapatas Eucalipto)",
          ...(hasBase ? [
            "Barrotes de sustentação de piso",
            "Assoalho de madeira (Base estrutural)"
          ] : [])
        ],
        exclusions: [
          "Telhas e manta térmica (cobertura)",
          "Vidros fachada",
          "Stain e pintura protetora",
          "Instalações de elétrica/hidro",
          "Base civil / Laje radier",
          "Frete de entrega na obra",
          "Taxa de gestão/coordenação (Isento!)",
          ...(!hasBase ? [
            "Barrotes de sustentação de piso e assoalho"
          ] : [])
        ]
      };
    } else {
      return {
        title: "Análise do Chave na Mão",
        inclusionsTitle: "O que está Incluso no Chave na Mão:",
        exclusionsTitle: "O que NÃO está Incluso no Chave na Mão:",
        inclusions: [
          "Pilares de sustentação em autoclave",
          "Vigas de travamento",
          "Linhas e caibros de telhado",
          "Estrutura completa das paredes",
          "Estrutura do telhado e forros",
          "Madeira Pinus tratada sob pressão",
          "Projeto estrutural e manual técnico",
          "Portas e janelas (esquadrias)",
          "Ferragens, pregos e parafusos",
          "Barras roscadas e fixadores",
          "Mão de obra própria e montagem",
          "Fundação de sapatas eucalipto",
          "Telhas ecológicas e manta térmica",
          "Vidros fachada",
          "Pintura protetora em Stain (1 cor)",
          "Instalações de elétrica/hidráulica básica",
          "Gestão, coordenação e garantia Wood Bahia",
          "Barrotes de sustentação de piso",
          "Assoalho de madeira (Base estrutural)"
        ],
        exclusions: [
          "Base civil / Laje radier",
          "Frete de entrega na obra",
          "Louças, metais e pisos cerâmicos"
        ]
      };
    }
  };

  // Cálculos das Modalidades Comerciais
  const formatBRL = (val: number) => {
    return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const staticModel = initialModels.find(m => m.id === id || id.includes(m.id) || m.id.includes(id));
  const purposes = model.purposes || staticModel?.purposes || [];

  const laborCost = getLaborCost(numericArea);
  const modelFixturesPrice = model.fixturesPrice ? parseCurrencyToNumber(model.fixturesPrice) : getFixturesPrice(numericArea).base;
  const modelTilesPrice = model.tilesStainPrice ? parseCurrencyToNumber(model.tilesStainPrice) : getTilesStainPrice(numericArea).total;
  const modelGlassPrice = getGlassPrice(numericArea);
  const adminCost = Math.round(laborCost * 0.25); // 25% de coordenação

  const discountRate = getModelDiscountRate(model.id || model.name, model.discountRate);

  // Kit Madeiramento (Completo com Frete)
  const kitEstimation = kitBasePriceNum + getFreight(numericArea);
  const kitPriceDiscounted = kitEstimation - (kitBasePriceNum * discountRate);

  // Montagem Parceira (Completo com Frete + Fundação Eucalipto + Portas/Janelas)
  const partnerEstimation = kitBasePriceNum + modelFixturesPrice + laborCost + getEucalyptusFoundation(numericArea) + getFreight(numericArea);
  const partnerEstimationDiscounted = partnerEstimation - (kitBasePriceNum * discountRate);

  // Chave na Mão (Obra Completa)
  const paintCost = numericArea <= 25 ? 2000 : numericArea <= 55 ? 3000 : 4500;
  const basePrice = numericArea * 150;
  const isVilas = id.includes('vilas') || (model.name && (model.name.toLowerCase().includes('vilas') || model.name.toLowerCase().includes('villas')));
  const turnkeyEstimation = kitBasePriceNum + basePrice + laborCost + adminCost + getEucalyptusFoundation(numericArea) + modelTilesPrice + modelFixturesPrice + modelGlassPrice + paintCost + getElectricalKit(numericArea) + getFreight(numericArea);
  const turnkeyEstimationDiscounted = turnkeyEstimation - ((kitBasePriceNum + basePrice) * discountRate);
  const hasPromo = !!model.promoPrice && model.promoPrice.trim() !== "" && model.promoPrice !== "R$ 0,00" && model.promoPrice !== "0";

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

                <div className="mb-4 flex flex-wrap gap-4">
                  <span className="flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-semibold text-stone-700">
                    <Maximize2 className="h-4 w-4 text-primary" />
                    {model.area}
                  </span>
                  <span className="flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-semibold text-stone-700">
                    <Layers className="h-4 w-4 text-primary" />
                    {model.floors}
                  </span>
                  <span className="flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-semibold text-stone-700">
                    <Bed className="h-4 w-4 text-primary" />
                    {model.bedrooms}{" "}
                    {model.bedrooms === 1 ? "Quarto" : "Quartos"}
                  </span>
                </div>

                {/* Finalidades do Modelo */}
                {purposes && purposes.length > 0 && (
                  <div className="mb-6 flex flex-wrap gap-2 items-center">
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-wider mr-1">Ideal para:</span>
                    {purposes.map((p: string) => {
                      const labels: Record<string, string> = {
                        airbnb: "Airbnb",
                        moradia: "Moradia",
                        campo: "Campo",
                        praia: "Praia",
                      };
                      return (
                        <span 
                          key={p} 
                          className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-[#B06D46] border border-amber-100"
                        >
                          {labels[p] || p}
                        </span>
                      );
                    })}
                  </div>
                )}

                <p className="mb-8 text-base leading-relaxed text-muted-foreground">
                  {model.description}
                </p>

                {/* Cards de Preços por Modalidade */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                  {/* Card 1: Kit Madeiramento */}
                  <div className="bg-white p-5 rounded-3xl border border-stone-200 flex flex-col justify-between hover:border-stone-400 transition-colors">
                    <div>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-stone-600 mb-3">
                        <Package className="h-3.5 w-3.5" />
                        1. Kit Madeiramento
                      </span>
                      <p className="text-[11px] text-gray-400 leading-normal mb-3">
                        Estrutura completa em madeira tratada de autoclave para montagem própria.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-stone-50">
                      <span className="text-[9px] text-gray-400 block uppercase font-bold">Investimento Estimado</span>
                      <div className="flex flex-wrap items-baseline gap-1.5 mt-0.5">
                        {hasPromo ? (
                          <>
                            <span className="text-[11px] text-muted-foreground line-through">{model.kitPrice || formatBRL(kitEstimation)}</span>
                            <span className="font-serif text-xl font-bold text-primary">{model.promoPrice}</span>
                          </>
                        ) : (
                          <>
                            <span className="text-[11px] text-muted-foreground line-through">{formatBRL(kitEstimation)}</span>
                            <span className="font-serif text-xl font-bold text-primary">{formatBRL(kitPriceDiscounted)}</span>
                          </>
                        )}
                      </div>
                    <div className="flex flex-col mt-0.5">
                      <span className="text-[9px] text-emerald-600 font-bold block">{discountRate * 100}% de desc. à vista no madeiramento</span>
                      <span className="text-[9px] text-slate-500 font-medium block">ou 18x s/ juros de {formatBRL(kitEstimation / 18)}</span>
                    </div>
                      <div className="text-[10px] text-[#8C6239] font-bold bg-[#E8DCCF]/20 px-2 py-1 rounded-lg border border-[#E8DCCF]/45 mt-2.5 self-start inline-block">
                        Consulte Kit Base + Assoalho
                      </div>
                      <span className="text-[9px] text-stone-500 block mt-2.5 font-medium italic">*Inclui frete. Solicite proposta para valores reais.</span>
                    </div>
                  </div>

                  {/* Card 2: Kit + Montagem Parceira */}
                  <div className="bg-white p-5 rounded-3xl border border-stone-200 flex flex-col justify-between hover:border-[#B06D46] transition-colors">
                    <div>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-[#B06D46] mb-3">
                        <Hammer className="h-3.5 w-3.5" />
                        2. Montagem Parceira
                      </span>
                      <p className="text-[11px] text-gray-400 leading-normal mb-3">
                        Compra do kit estrutural montado por carpinteiros homologados indicados.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-stone-50">
                      <span className="text-[9px] text-gray-400 block uppercase font-bold">Investimento Estimado</span>
                      <div className="flex flex-wrap items-baseline gap-1.5 mt-0.5">
                        <span className="text-[11px] text-muted-foreground line-through">{formatBRL(partnerEstimation)}</span>
                        <span className="font-serif text-xl font-bold text-[#B06D46]">{formatBRL(partnerEstimationDiscounted)}</span>
                      </div>
                    <div className="flex flex-col mt-0.5">
                      <span className="text-[9px] text-emerald-600 font-bold block">{discountRate * 100}% de desc. à vista no madeiramento</span>
                      <span className="text-[9px] text-slate-500 font-medium block">ou 18x s/ juros de {formatBRL(partnerEstimation / 18)}</span>
                    </div>
                      <span className="text-[9px] text-stone-555 block mt-2.5 font-medium italic">*Obra Completa. Solicite proposta para valores reais do frete/fundação no seu terreno.</span>
                    </div>
                  </div>

                  {/* Card 3: Chave na Mão */}
                  <div className="bg-[#FAF8F5] p-5 rounded-3xl border border-[#E8DCCF] flex flex-col justify-between hover:border-[#8A3A1B] transition-colors shadow-[0_8px_30px_rgba(138,58,27,0.03)] relative">
                    <div className="absolute -top-2.5 right-4 rounded-full bg-[#8A3A1B] text-white text-[8px] font-bold tracking-widest uppercase px-2.5 py-0.5">
                      Pronto
                    </div>
                    <div>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-[#8A3A1B] mb-3 shadow-sm">
                        <Home className="h-3.5 w-3.5" />
                        3. Chave na Mão
                      </span>
                      <p className="text-[11px] text-gray-400 leading-normal mb-3">
                        Estrutura pronta, coberta, pintada, com portas, janelas e vidros instalados.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#E8DCCF]/60">
                      <span className="text-[9px] text-[#8A3A1B] block uppercase font-black tracking-wider mb-1">Preço de Tabela (Montado)</span>
                      <div className="flex flex-wrap items-baseline gap-1.5 mt-0.5">
                        {model.price && model.price.trim() !== "" && model.price !== "R$ 0,00" && !isVilas ? (
                          <>
                            <span className="text-[11px] text-muted-foreground line-through">{model.price}</span>
                            <span className="font-serif text-xl font-bold text-[#8A3A1B]">{formatBRL(turnkeyEstimationDiscounted)}</span>
                          </>
                        ) : (
                          <>
                            <span className="text-[11px] text-muted-foreground line-through">{formatBRL(turnkeyEstimation)}</span>
                            <span className="font-serif text-xl font-bold text-[#8A3A1B]">{formatBRL(turnkeyEstimationDiscounted)}</span>
                          </>
                        )}
                      </div>
                    <div className="flex flex-col mt-0.5">
                      <span className="text-[9px] text-emerald-600 font-bold block">{discountRate * 100}% de desc. à vista aplicado</span>
                      <span className="text-[9px] text-slate-500 font-medium block">ou 18x s/ juros de {formatBRL(turnkeyEstimation / 18)}</span>
                    </div>
                      <span className="text-[9px] text-stone-555 block mt-2.5 font-medium italic">*Obra Completa. Solicite proposta para valores reais do frete/fundação no seu terreno.</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <a
                      href={`https://wa.me/5571992936290?text=Olá! Tenho interesse no modelo ${model.name}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-cta bg-primary !shadow-lg px-6 py-4 text-base flex items-center justify-center gap-2 rounded-xl font-bold"
                    >
                      <Phone className="h-5 w-5" />
                      Pedir Proposta Comercial
                    </a>
                    
                    <Link
                      href={`/modelo/${id}/planta`}
                      className="inline-flex items-center justify-center gap-2 border-2 border-primary/20 bg-transparent px-6 py-4 font-bold text-primary rounded-xl hover:bg-primary/5 hover:-translate-y-1 transition-all text-center text-base"
                    >
                      <Layers className="h-5 w-5" />
                      Visualizar Planta Baixa
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
                        <p className="text-sm font-bold text-[#B06D46] leading-none">Simular Parcelas</p>
                        <p className="text-[10px] text-[#B06D46]/70 font-medium uppercase mt-1 tracking-wider">No cartão de crédito em até 18x</p>
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

        {/* O que está incluso e Simulação de Investimento */}
        <section className="bg-[#FAF8F5] py-20 lg:py-28 border-t border-stone-200">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-2">
              
              {/* O que está Incluso / Não Incluso */}
              {(() => {
                const scope = getScopeItems(simModalidade);
                return (
                  <ScrollReveal>
                    <h3 className="text-2xl font-bold text-[#4A2B1D] font-serif mb-8 flex items-center gap-2">
                      {scope.title}
                    </h3>
                    
                    <div className="space-y-8">
                      {/* Incluso */}
                      <div className="bg-white p-6 rounded-[2rem] border border-stone-150 shadow-sm">
                        <h4 className="text-base font-bold text-emerald-700 mb-4 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          {scope.inclusionsTitle}
                        </h4>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-500">
                          {scope.inclusions.map((item) => (
                            <li key={item} className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={3} />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Não Incluso */}
                      <div className="bg-white p-6 rounded-[2rem] border border-stone-150 shadow-sm">
                        <h4 className="text-base font-bold text-red-650 mb-4 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-red-500" />
                          {scope.exclusionsTitle}
                        </h4>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-400">
                          {scope.exclusions.map((item) => (
                            <li key={item} className="flex items-center gap-2">
                              <X className="w-3.5 h-3.5 text-red-400 shrink-0" strokeWidth={2.5} />
                              <span className="line-through">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })()}

              {/* Simulação de Investimento */}
              <ScrollReveal delay={0.2}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                  <h3 className="text-2xl font-bold text-[#4A2B1D] font-serif flex items-center gap-2">
                    Simulação de Investimento Detalhada
                  </h3>
                  
                  {/* Seletor de Modalidade da Simulação */}
                  <div className="inline-flex rounded-xl bg-stone-100 p-1 border border-stone-200">
                    {[
                      { id: 'kit', label: '1. Kit', emoji: '🪵' },
                      { id: 'parceira', label: '2. Parceira', emoji: '🔨' },
                      { id: 'turnkey', label: '3. Chave na Mão', emoji: '🔑' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setSimModalidade(tab.id as any)}
                        className={cn(
                          "inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg transition-all",
                          simModalidade === tab.id
                            ? "bg-white text-primary shadow-sm"
                            : "text-stone-500 hover:text-stone-800"
                        )}
                      >
                        <span>{tab.emoji}</span>
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-[2rem] border border-stone-200 p-6 md:p-8 shadow-sm">
                  <span className="text-xs uppercase tracking-wider font-bold text-gray-400 block mb-4">
                    Estimativa detalhada — Modalidade {simModalidade === 'kit' ? 'Kit Madeiramento' : simModalidade === 'parceira' ? 'Montagem Parceira' : 'Chave na Mão'}
                  </span>

                  <div className="space-y-4 text-sm mb-6">
                    {/* Item 1: Kit Madeiramento */}
                    <div className="flex justify-between pb-3 border-b border-stone-100">
                      <span className="text-stone-700 font-medium">1. Kit Madeiramento Estrutural:</span>
                      <span className="font-bold text-stone-850">{formatBRL(kitBasePriceNum)}</span>
                    </div>

                    {/* Item 2: Kit Base + Assoalho de Madeira */}
                    {simModalidade === 'turnkey' ? (
                      <div className="flex justify-between pb-3 border-b border-stone-100">
                        <span className="text-stone-700 font-medium">2. Kit Base + Assoalho de Madeira (Incluso):</span>
                        <span className="font-bold text-stone-850">{formatBRL(numericArea * 150)}</span>
                      </div>
                    ) : (
                      <div className="flex justify-between pb-3 border-b border-stone-100 items-center">
                        <label className="flex items-center gap-2 cursor-pointer select-none text-stone-700 font-medium">
                          <input 
                            type="checkbox"
                            checked={includeBaseInSim}
                            onChange={(e) => setIncludeBaseInSim(e.target.checked)}
                            className="rounded border-stone-300 text-primary focus:ring-primary h-4 w-4"
                          />
                          <span>2. Kit Base + Assoalho de Madeira (Opcional):</span>
                        </label>
                        <span className={cn("font-bold transition-colors", includeBaseInSim ? "text-stone-850" : "text-stone-400")}>
                          {includeBaseInSim ? formatBRL(numericArea * 150) : `+ ${formatBRL(numericArea * 150)}`}
                        </span>
                      </div>
                    )}

                    {/* Item 3: Mão de Obra de Montagem */}
                    {simModalidade !== 'kit' ? (
                      <div className="flex justify-between pb-3 border-b border-stone-100">
                        <span className="text-stone-700 font-medium">3. Mão de Obra de Montagem (Incluso no Parceira/Chave na Mão):</span>
                        <span className="font-bold text-stone-850">{formatBRL(laborCost)}</span>
                      </div>
                    ) : (
                      <div className="flex justify-between pb-3 border-b border-stone-100 text-stone-300">
                        <span className="font-medium">3. Mão de Obra de Montagem:</span>
                        <span className="italic text-xs font-semibold">Não Incluso (Por conta do cliente nesta modalidade)</span>
                      </div>
                    )}

                    {/* Item 4: Gestão e Coordenação Obra */}
                    {simModalidade === 'turnkey' ? (
                      <div className="flex justify-between pb-3 border-b border-stone-100">
                        <span className="text-[#8A3A1B] font-medium">4. Gestão e Coordenação Obra (Incluso no Chave na Mão):</span>
                        <span className="font-bold text-[#8A3A1B]">{formatBRL(adminCost)}</span>
                      </div>
                    ) : (
                      <div className="flex justify-between pb-3 border-b border-stone-100 text-stone-300">
                        <span className="font-medium">4. Gestão e Coordenação Obra:</span>
                        <span className="italic text-xs font-semibold">Não Incluso (Isento nesta modalidade)</span>
                      </div>
                    )}

                    {/* Item 5: Fundação Estimada (Sapatas Eucalipto) */}
                    {simModalidade !== 'kit' ? (
                      <div className="flex justify-between pb-3 border-b border-stone-100">
                        <span className="text-stone-700 font-medium">
                          5. Fundação Estimada (Incluso no Parceira/Chave na Mão):
                        </span>
                        <span className="font-bold text-stone-850">{formatBRL(getEucalyptusFoundation(numericArea))}</span>
                      </div>
                    ) : (
                      <div className="flex justify-between pb-3 border-b border-stone-100 text-stone-300">
                        <span className="font-medium">5. Fundação Estimada (Sapatas Eucalipto):</span>
                        <span className="italic text-xs font-semibold">Não Incluso (Por conta do cliente nesta modalidade)</span>
                      </div>
                    )}

                    {/* Item 6: Cobertura (Telhas/Manta) */}
                    {simModalidade === 'turnkey' ? (
                      <div className="flex justify-between pb-3 border-b border-stone-100">
                        <span className="text-stone-700 font-medium">6. Cobertura Premium (Incluso apenas no Chave na Mão):</span>
                        <span className="font-bold text-stone-850">{formatBRL(modelTilesPrice)}</span>
                      </div>
                    ) : (
                      <div className="flex justify-between pb-3 border-b border-stone-100 text-stone-300">
                        <span className="font-medium">6. Cobertura Premium (Telhas e Manta):</span>
                        <span className="italic text-xs font-semibold">Não Incluso (Por conta do cliente nesta modalidade)</span>
                      </div>
                    )}

                    {/* Item 7: Portas e Janelas */}
                    {simModalidade === 'turnkey' || simModalidade === 'parceira' ? (
                      <div className="flex justify-between pb-3 border-b border-stone-100">
                        <span className="text-stone-700 font-medium">7. Portas, Janelas e Ferragens (Incluso no Parceira/Chave na Mão):</span>
                        <span className="font-bold text-stone-850">{formatBRL(modelFixturesPrice)}</span>
                      </div>
                    ) : (
                      <div className="flex justify-between pb-3 border-b border-stone-100 text-stone-300">
                        <span className="font-medium">7. Portas, Janelas e Ferragens:</span>
                        <span className="italic text-xs font-semibold">Não Incluso (Por conta do cliente nesta modalidade)</span>
                      </div>
                    )}

                    {/* Item 8: Vidros Temperados */}
                    {simModalidade === 'turnkey' ? (
                      <div className="flex justify-between pb-3 border-b border-stone-100">
                        <span className="text-stone-700 font-medium">8. Vidros Fachada (Incluso apenas no Chave na Mão):</span>
                        <span className="font-bold text-stone-850">{formatBRL(modelGlassPrice)}</span>
                      </div>
                    ) : (
                      <div className="flex justify-between pb-3 border-b border-stone-100 text-stone-300">
                        <span className="font-medium">8. Vidros Fachada:</span>
                        <span className="italic text-xs font-semibold">Não Incluso (Por conta do cliente nesta modalidade)</span>
                      </div>
                    )}

                    {/* Item 9: Pintura completa */}
                    {simModalidade === 'turnkey' ? (
                      <div className="flex justify-between pb-3 border-b border-stone-100">
                        <span className="text-stone-700 font-medium">9. Pintura Completa Stain (Incluso apenas no Chave na Mão):</span>
                        <span className="font-bold text-stone-850">{formatBRL(numericArea <= 25 ? 2000 : numericArea <= 55 ? 3000 : 4500)}</span>
                      </div>
                    ) : (
                      <div className="flex justify-between pb-3 border-b border-stone-100 text-stone-300">
                        <span className="font-medium">9. Pintura Completa com Stain:</span>
                        <span className="italic text-xs font-semibold">Não Incluso (Por conta do cliente nesta modalidade)</span>
                      </div>
                    )}

                    {/* Item 10: Elétrica/Hidráulica */}
                    {simModalidade === 'turnkey' ? (
                      <div className="flex justify-between pb-3 border-b border-stone-100">
                        <span className="text-stone-700 font-medium">10. Instalações Elétrica/Hidro (Incluso apenas no Chave na Mão):</span>
                        <span className="font-bold text-stone-850">{formatBRL(getElectricalKit(numericArea))}</span>
                      </div>
                    ) : (
                      <div className="flex justify-between pb-3 border-b border-stone-100 text-stone-300">
                        <span className="font-medium">10. Instalações de Elétrica/Hidráulica Básica:</span>
                        <span className="italic text-xs font-semibold">Não Incluso (Por conta do cliente nesta modalidade)</span>
                      </div>
                    )}

                    {/* Item 11: Frete Estimado */}
                    <div className="flex justify-between pb-3 border-b border-stone-100">
                      <span className="text-stone-700 font-medium">Frete Estimado (Litoral/Região Metropolitana):</span>
                      <span className="font-bold text-stone-850">{formatBRL(getFreight(numericArea))}</span>
                    </div>
                  </div>
                    
                  {/* Totais de investimento com base de cálculo rigorosa */}
                    {(() => {
                      const basePrice = numericArea * 150;
                      
                      // 1. Kit
                      const kitAPrazo = kitBasePriceNum + getFreight(numericArea) + (includeBaseInSim ? basePrice : 0);
                      const kitDiscountable = kitBasePriceNum + (includeBaseInSim ? basePrice : 0);
                      const kitDesconto = Math.round(kitDiscountable * discountRate);
                      const kitAVista = kitAPrazo - kitDesconto;
                      
                      // 2. Parceira
                      const partnerAPrazo = kitBasePriceNum + laborCost + getEucalyptusFoundation(numericArea) + getFreight(numericArea) + (includeBaseInSim ? basePrice : 0);
                      const partnerDiscountable = kitBasePriceNum + (includeBaseInSim ? basePrice : 0);
                      const partnerDesconto = Math.round(partnerDiscountable * discountRate);
                      const partnerAVista = partnerAPrazo - partnerDesconto;
                      
                      // 3. Chave na mão (base está inclusa por padrão)
                      const turnkeyAPrazo = kitBasePriceNum + basePrice + laborCost + adminCost + getEucalyptusFoundation(numericArea) + modelTilesPrice + modelFixturesPrice + modelGlassPrice + (numericArea <= 25 ? 2000 : numericArea <= 55 ? 3000 : 4500) + getElectricalKit(numericArea) + getFreight(numericArea);
                      const turnkeyDiscountable = kitBasePriceNum + basePrice;
                      const turnkeyDesconto = Math.round(turnkeyDiscountable * discountRate);
                      const turnkeyAVista = turnkeyAPrazo - turnkeyDesconto;
                      
                      const totalAPrazo = simModalidade === 'kit' ? kitAPrazo : simModalidade === 'parceira' ? partnerAPrazo : turnkeyAPrazo;
                      const totalAVista = simModalidade === 'kit' ? kitAVista : simModalidade === 'parceira' ? partnerAVista : turnkeyAVista;
                      const descontoAVista = simModalidade === 'kit' ? kitDesconto : simModalidade === 'parceira' ? partnerDesconto : turnkeyDesconto;

                      return (
                        <div className="space-y-4">
                          <div className="flex justify-between pb-3 border-b border-stone-100 text-emerald-700 bg-emerald-50/50 p-2 rounded-lg text-xs font-semibold">
                            <span>Desconto de {discountRate * 100}% (Aplicado à Vista no Madeiramento {includeBaseInSim || simModalidade === 'turnkey' ? "+ Base" : ""}):</span>
                            <span>- {formatBRL(descontoAVista)}</span>
                          </div>

                            {/* Lógica de parcelamento híbrido */}
                            {(() => {
                              const baseParceladaCartao = includeBaseInSim || simModalidade === 'turnkey' 
                                ? (kitFull + modelBasePrice)
                                : kitFull;
                              
                              const complementosPix = totalAPrazo - baseParceladaCartao;

                              if (complementosPix > 0) {
                                return (
                                  <div className="space-y-3 mb-6">
                                    <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-stone-200 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                      <div>
                                        <span className="text-[10px] text-[#8C6239] font-bold uppercase tracking-wider block">Parcelamento do Kit Madeiramento</span>
                                        <span className="text-[11px] text-stone-500 italic mt-0.5 block">
                                          Parcelável em até 18x sem juros no cartão
                                        </span>
                                      </div>
                                      <span className="font-serif font-black text-2xl text-[#5C3317]">
                                        {formatBRL(baseParceladaCartao)}
                                      </span>
                                    </div>
                                    
                                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                      <div>
                                        <span className="text-[10px] text-stone-600 font-bold uppercase tracking-wider block">Complementos e Serviços (Via PIX)</span>
                                        <span className="text-[11px] text-stone-500 italic mt-0.5 block">
                                          Sinal e saldo conforme cronograma de evolução da obra
                                        </span>
                                      </div>
                                      <span className="font-serif font-black text-xl text-stone-800">
                                        {formatBRL(complementosPix)}
                                      </span>
                                    </div>
                                  </div>
                                );
                              }

                              return (
                                <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-stone-200 mb-6 space-y-4">
                                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                    <div>
                                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Investimento Parcelado (A Prazo)</span>
                                      <span className="text-[11px] text-stone-500 italic mt-0.5 block">
                                        Apenas compra do material estrutural + frete
                                      </span>
                                    </div>
                                    <span className="font-serif font-black text-2xl text-stone-800">
                                      {formatBRL(totalAPrazo)}
                                    </span>
                                  </div>
                                </div>
                              );
                            })()}

                            <div className="w-full h-[1px] bg-stone-200"></div>

                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                              <div>
                                <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider block">Investimento à Vista (PIX/Boleto)</span>
                                <span className="text-[11px] text-emerald-700 italic mt-0.5 block">
                                  Com desconto de 5% aplicado sobre o madeiramento {includeBaseInSim || simModalidade === 'turnkey' ? "e base estrutural" : ""}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="font-serif font-black text-2xl text-emerald-800">
                                  {formatBRL(totalAVista)}
                                </span>
                                <span className="block text-[10px] text-emerald-600 font-semibold mt-0.5">
                                  Economia de {formatBRL(descontoAVista)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                  <p className="text-[10px] text-gray-400 leading-relaxed italic">
                    *Valores estimativos baseados no m² do projeto. Podem variar conforme a topografia do lote, logística de frete e padrão de acabamento civil escolhido.
                  </p>
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
                  Mais de <span className="text-amber-400">47 mil pessoas</span>{" "}
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
