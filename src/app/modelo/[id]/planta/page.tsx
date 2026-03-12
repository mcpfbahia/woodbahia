"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Maximize2, 
  Layers, 
  Bed, 
  Phone, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Loader2,
  RefreshCw,
  Move
} from "lucide-react";
import { motion } from "framer-motion";
import { doc, getDoc } from "firebase/firestore";
import { db } from "~/lib/firebase";
import { Header } from "~/components/layout/Header";
import { Footer } from "~/components/layout/Footer";
import { WhatsAppButton } from "~/components/common/WhatsAppButton";
import { ScrollReveal } from "~/components/common/ScrollReveal";
import { initialModels } from "~/lib/data";
import { modelFloorPlans } from "~/lib/floorPlanData";

export default function FloorPlanPage() {
  const { id } = useParams() as { id: string };
  const getFirebaseId = (slug: string) => {
    const mappings: Record<string, string> = {
      'chale-praia-do-forte-2': 'chale-itacare',
      'chale-boipeba': 'chale-itacimirim',
      'chale-arraial-dajuda': 'chale-itacimirim'
    };
    return mappings[slug] || slug;
  };
  const firebaseId = getFirebaseId(id);
  const [model, setModel] = useState<any>(null);
  const [floorPlan, setFloorPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [activeTab, setActiveTab] = useState<'terreo' | 'superior'>('terreo');
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
    const fetchModelData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const docRef = doc(db, "models", firebaseId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setModel({ id: id, ...data });

          const staticPlan = modelFloorPlans[id];
          const staticImage = (staticPlan?.floorPlanImage && staticPlan.floorPlanImage !== '')
            ? staticPlan.floorPlanImage
            : (id === 'chale-itacimirim' ? '/planta-terrea-itacimirim.jpg' : '/placeholder.svg');

          const terreaImage = data.floorPlanImage || staticImage;
          const terreaLabel = data.floorPlanLabel || staticPlan?.label || 'Planta Térrea';
          const superiorImage = data.floorPlanSuperiorImage || '';
          const superiorLabel = data.floorPlanSuperiorLabel || 'Planta Superior';
          const rooms = (data.rooms && data.rooms.length > 0) ? data.rooms : (staticPlan?.rooms || []);
          const totalArea = data.area || staticPlan?.totalArea || '';
          const builtArea = data.builtArea || staticPlan?.builtArea || '';

          setFloorPlan({
            terreo: { image: terreaImage, label: terreaLabel },
            superior: superiorImage ? { image: superiorImage, label: superiorLabel } : null,
            rooms: rooms || [],
            totalArea: totalArea || '',
            builtArea: builtArea || '',
          });
        } else {
          // Tentar buscar nos dados estáticos (incluindo mapeamento de fallback)
          const staticId = firebaseId; // Já mapeado acima
          const staticModel = initialModels.find(m => m.id === staticId);
          
          if (staticModel) {
            setModel({ ...staticModel, id: id }); // Preserva o ID original da URL
            const staticPlan = modelFloorPlans[staticId];
            if (staticPlan) {
              setFloorPlan({
                terreo: { image: staticPlan.floorPlanImage || (staticId === 'chale-itacimirim' ? '/planta-terrea-itacimirim.jpg' : '/placeholder.svg'), label: staticPlan.label || 'Planta Térrea' },
                superior: null,
                rooms: staticPlan.rooms || [],
                totalArea: staticPlan.totalArea || '',
                builtArea: staticPlan.builtArea || ''
              });
              return;
            }
          }
          
          // Fallback final
          const staticModelOriginalId = initialModels.find(m => m.id === id);
          if (staticModelOriginalId) {
            setModel(staticModelOriginalId);
            const staticPlan = modelFloorPlans[id];
            if (staticPlan) {
              setFloorPlan({
                terreo: { image: staticPlan.floorPlanImage || (id === 'chale-itacimirim' ? '/planta-terrea-itacimirim.jpg' : '/placeholder.svg'), label: staticPlan.label || 'Planta Térrea' },
                superior: null,
                rooms: staticPlan.rooms || [],
                totalArea: staticPlan.totalArea || '',
                builtArea: staticPlan.builtArea || ''
              });
            } else {
              setFloorPlan({
                terreo: { image: id === 'chale-itacimirim' ? '/planta-terrea-itacimirim.jpg' : '/placeholder.svg', label: 'Planta Térrea' },
                superior: null,
                rooms: [],
                totalArea: '',
                builtArea: ''
              });
            }
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados da planta:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchModelData();
  }, [id, firebaseId]);

  useEffect(() => {
    setZoom(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  }, [activeTab]);

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!model || !floorPlan) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="font-serif mb-4 text-2xl font-bold text-primary">
            Modelo não encontrado
          </h1>
          <Link href="/modelos" className="btn-cta bg-primary px-8 py-3 text-white rounded-xl">
            Voltar aos modelos
          </Link>
        </div>
      </div>
    );
  }

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 2));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20">
        <section className="py-12 md:py-16 bg-card relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 opacity-30" />

          <div className="container mx-auto px-4 relative z-10">
            <Link
              href={`/modelo/${id}`}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao modelo
            </Link>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <span className="inline-block px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
                  {floorPlan[activeTab]?.label || 'Planta Baixa'}
                </span>
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary">
                  {model.name}
                </h1>
              </div>

              <div className="flex flex-wrap gap-3">
                <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm">
                  <Maximize2 className="w-4 h-4 text-primary" />
                  {model.area}
                </span>
                <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm">
                  <Layers className="w-4 h-4 text-primary" />
                  {model.floors}
                </span>
                <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm">
                  <Bed className="w-4 h-4 text-primary" />
                  {model.bedrooms} {model.bedrooms === 1 ? 'Quarto' : 'Quartos'}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8">
              <ScrollReveal className="lg:col-span-2">
                <div className="rounded-3xl border-2 border-primary/10 bg-white p-4 shadow-xl md:p-8">
                  {floorPlan.superior && (
                    <div className="flex p-1 bg-muted rounded-lg mb-6 w-fit mx-auto md:mx-0">
                      <button
                        onClick={() => setActiveTab('terreo')}
                        className={`px-6 py-2 rounded-md transition-all ${
                          activeTab === 'terreo' 
                            ? 'bg-background shadow-sm text-primary font-medium' 
                            : 'text-muted-foreground hover:text-primary'
                        }`}
                      >
                        Pavimento Térreo
                      </button>
                      <button
                        onClick={() => setActiveTab('superior')}
                        className={`px-6 py-2 rounded-md transition-all ${
                          activeTab === 'superior' 
                            ? 'bg-background shadow-sm text-primary font-medium' 
                            : 'text-muted-foreground hover:text-primary'
                        }`}
                      >
                        Pavimento Superior
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-serif font-bold text-primary">
                      {floorPlan[activeTab]?.label || 'Visualização da Planta'}
                    </h2>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleZoomOut}
                        className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                        title="Diminuir zoom"
                      >
                        <ZoomOut className="w-5 h-5 text-primary" />
                      </button>
                      <span className="text-sm font-medium min-w-[50px] text-center text-primary">
                        {Math.round(zoom * 100)}%
                      </span>
                      <button
                        onClick={handleZoomIn}
                        className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                        title="Aumentar zoom"
                      >
                        <ZoomIn className="w-5 h-5 text-primary" />
                      </button>
                      <button
                        onClick={handleRotate}
                        className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors ml-2"
                        title="Rotacionar"
                      >
                        <RotateCw className="w-5 h-5 text-primary" />
                      </button>
                      <button
                        onClick={handleReset}
                        className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                        title="Resetar visualização"
                      >
                        <RefreshCw className="w-5 h-5 text-primary" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground bg-primary/5 p-2 rounded-lg w-fit">
                    <Move className="w-3 h-3" />
                    <span>Dica: Clique e arraste para mover a planta ampliada</span>
                  </div>

                    <div className="bg-muted/50 rounded-2xl border border-muted overflow-hidden aspect-[4/3] flex items-center justify-center relative backdrop-blur-sm cursor-grab active:cursor-grabbing">
                      <motion.div
                        drag
                        dragConstraints={{ left: -2000, right: 2000, top: -2000, bottom: 2000 }}
                        dragElastic={0}
                        dragMomentum={false}
                        animate={{
                          scale: zoom,
                          rotate: rotation,
                          x: position.x,
                          y: position.y
                        }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="relative w-full h-full flex items-center justify-center"
                      >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={floorPlan[activeTab]?.image || '/placeholder.svg'}
                        alt={`${floorPlan[activeTab]?.label || 'Planta baixa'} - ${model.name}`}
                        className="max-w-full max-h-full object-contain pointer-events-none"
                        draggable="false"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/800x600?text=Planta+em+Breve';
                        }}
                      />
                      {(!floorPlan[activeTab]?.image || floorPlan[activeTab]?.image === '/placeholder.svg' || floorPlan[activeTab]?.image === '') && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <p className="text-muted-foreground text-center p-4 bg-background/80 rounded-lg shadow-sm">
                            Planta baixa em breve.<br />
                            Solicite pelo WhatsApp para receber o arquivo completo.
                          </p>
                        </div>
                      )}
                    </motion.div>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <div className="space-y-6">
                  <div className="rounded-2xl border border-border bg-white p-6 md:p-8 shadow-sm">
                    <h3 className="font-serif font-semibold text-lg mb-4 text-primary">Área Total</h3>
                    <div className="text-4xl font-serif font-bold text-primary mb-2">
                      {floorPlan.totalArea || model.area}
                    </div>
                    {floorPlan.builtArea && (
                      <p className="text-sm text-muted-foreground">Área construída: {floorPlan.builtArea}</p>
                    )}
                  </div>

                  {floorPlan.rooms && floorPlan.rooms.length > 0 && (
                     <div className="rounded-2xl border border-border bg-white p-6 md:p-8 shadow-sm">
                       <h3 className="font-serif font-semibold text-lg mb-4 text-primary">Distribuição dos Ambientes</h3>
                       <ul className="space-y-3">
                         {floorPlan.rooms.map((room: any, index: number) => (
                           <li key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0 text-sm">
                             <span className="text-muted-foreground">{room.name}</span>
                             <span className="font-medium text-primary">{room.size}</span>
                           </li>
                         ))}
                       </ul>
                     </div>
                  )}

                  <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 md:p-8 shadow-sm">
                    <h4 className="font-serif font-semibold mb-3 text-lg text-primary">Quer a planta completa?</h4>
                    <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                      Entre em contato e receba o arquivo PDF da planta baixa com todas as medidas detalhadas.
                    </p>
                    <a
                      href={`https://wa.me/5571992936290?text=Olá! Gostaria de receber a planta baixa completa do ${model.name}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-cta bg-primary px-8 py-4 font-bold text-white rounded-xl shadow-lg hover:opacity-90 transition-all w-full inline-flex justify-center flex-row gap-2"
                    >
                      <Phone className="w-5 h-5" />
                      Solicitar Planta
                    </a>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/modelos" 
                className="inline-flex items-center justify-center gap-2 border-2 border-primary/20 bg-transparent px-8 py-4 font-bold text-primary rounded-xl hover:bg-primary/5 transition-all text-center"
              >
                Voltar aos Modelos
              </Link>
              <Link 
                href={`/modelo/${id}`} 
                className="inline-flex items-center justify-center gap-2 border-2 border-primary text-primary px-8 py-4 font-bold rounded-xl hover:bg-primary/5 transition-all text-center"
              >
                Voltar aos Detalhes
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
