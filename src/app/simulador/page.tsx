"use client";
import { useState, useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { StepProgress } from '@/components/simulador/StepProgress';
import { StepLocation } from '@/components/simulador/StepLocation';
import { StepModelSelect } from '@/components/simulador/StepModelSelect';
import { StepKitSelect } from '@/components/simulador/StepKitSelect';
import { StepFoundation } from '@/components/simulador/StepFoundation';
import { StepSummary } from '@/components/simulador/StepSummary';
import { StepCustomProject, type CustomProjectConfig } from '@/components/simulador/StepCustomProject';
import { StepCustomSummary } from '@/components/simulador/StepCustomSummary';
import { UserManual } from '@/components/simulador/UserManual';
import type {
  CabinModel, KitType, FoundationType, CustomOptions, KitAddons,
  SimulationState
} from '@/lib/pricing';
import { needsFoundationStep } from '@/lib/pricing';
import { TreePine, Sparkles, BookOpen, Home, ArrowRight, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const INITIAL_CUSTOM: CustomOptions = {
  doorsWindows: false, hardware: false, tiles: false, stain: false, labor: false, electrical: false, glass: false, project: false,
};

const INITIAL_ADDONS: KitAddons = { electrical: false, glass: false };

export default function Index() {
  const [step, setStep] = useState(0); // 0 = hero, 1 = location, 2+ = wizard
  const [clientData, setClientData] = useState<{ name: string; city: string; state: string; distance?: number }>({ name: '', city: '', state: '' });
  const [model, setModel] = useState<CabinModel | null>(null);
  const [isCustomPath, setIsCustomPath] = useState(false);
  const [kitType, setKitType] = useState<KitType | null>(null);
  const [customOptions, setCustomOptions] = useState<CustomOptions>(INITIAL_CUSTOM);
  const [kitAddons, setKitAddons] = useState<KitAddons>(INITIAL_ADDONS);
  const [customArea, setCustomArea] = useState(20);
  const [foundationType, setFoundationType] = useState<FoundationType | null>(null);
  const [showManual, setShowManual] = useState(false);

  // Estado do Projeto Sob Medida
  const [customConfig, setCustomConfig] = useState<CustomProjectConfig>({
    customType: 'casa',
    isDuplex: false,
    area: 65,
    bedrooms: 2,
    suites: 1,
    hasSocialBathroom: true,
  });

  const simState: SimulationState = useMemo(() => ({
    clientData,
    model,
    kitType: isCustomPath ? 'custom' : kitType,
    customOptions,
    kitAddons,
    foundationType,
    customArea: isCustomPath ? customConfig.area : customArea,
  }), [clientData, model, isCustomPath, kitType, customOptions, kitAddons, foundationType, customArea, customConfig.area]);

  const showFoundation = needsFoundationStep(simState);

  const stepLabels = useMemo(() => {
    if (isCustomPath) {
      return ['Local', 'Projeto Sob Medida', 'Simulação Global'];
    }
    const labels = ['Local', 'Modelo', 'Kit'];
    if (showFoundation) labels.push('Base');
    labels.push('Resumo');
    return labels;
  }, [isCustomPath, showFoundation]);

  const totalSteps = stepLabels.length;

  const displayStep = useMemo(() => {
    if (isCustomPath) {
      return step;
    }
    if (!showFoundation && step >= 4) return step - 1;
    return step;
  }, [step, isCustomPath, showFoundation]);

  const handleLocationNext = useCallback((data: { name: string; city: string; state: string; distance?: number }) => {
    setClientData(data);
    setStep(2);
  }, []);

  const handleModelSelect = useCallback((m: CabinModel) => {
    setModel(m);
    setIsCustomPath(false);
    setKitType(null);
    setStep(3);
  }, []);

  const handleCustomSelect = useCallback(() => {
    setIsCustomPath(true);
    setModel(null);
    setKitType(null);
    setStep(2);
  }, []);

  const handleKitNext = useCallback(() => {
    if (showFoundation) setStep(4);
    else setStep(5);
  }, [showFoundation]);

  const handleFoundationNext = useCallback(() => setStep(5), []);

  const handleReset = useCallback(() => {
    setStep(0);
    setClientData({ name: '', city: '', state: '', distance: undefined });
    setModel(null);
    setIsCustomPath(false);
    setKitType(null);
    setCustomOptions(INITIAL_CUSTOM);
    setKitAddons(INITIAL_ADDONS);
    setCustomArea(20);
    setFoundationType(null);
    setCustomConfig({
      customType: 'casa',
      isDuplex: false,
      area: 65,
      bedrooms: 2,
      suites: 1,
      hasSocialBathroom: true,
    });
  }, []);

  const handleBack = useCallback((target: number) => setStep(target), []);

  const effectiveArea = isCustomPath ? customConfig.area : (model?.area ?? 0);

  // Hero screen
  if (step === 0) {
    return (
      <div className="min-h-screen flex flex-col overflow-hidden">
        <div className="flex-1 flex items-center justify-center px-4 py-16 relative">
          
          {/* Background decorativo */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-amber/8 blur-[120px]" />
            <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full bg-accent/6 blur-[140px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-warm-glow/60 blur-[100px]" />
            <div className="absolute inset-0 opacity-[0.015]" style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 60px, hsl(22 40% 22%) 60px, hsl(22 40% 22%) 61px)',
            }} />
          </div>

          {/* Botão de Voltar ao Site no Hero */}
          <div className="absolute top-6 left-6 z-20">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-accent hover:bg-accent/8 rounded-xl font-semibold text-sm py-5 px-5"
              >
                <Home className="w-4 h-4" /> Voltar ao Site
              </Button>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center max-w-4xl mx-auto relative z-10"
          >
            {/* Badge de credibilidade */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5, ease: 'backOut' }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-8 border"
              style={{
                background: 'linear-gradient(135deg, hsl(20 52% 38% / 0.10), hsl(38 82% 50% / 0.08))',
                borderColor: 'hsl(20 52% 38% / 0.22)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <span className="w-2 h-2 rounded-full bg-amber animate-pulse" />
              <span className="text-accent font-bold text-sm tracking-wider uppercase">
                Simulador de Investimento 360°
              </span>
              <TreePine className="w-4 h-4 text-accent/70" />
            </motion.div>

            {/* Título principal */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="font-display font-bold leading-[1.08] mb-6 tracking-tight"
              style={{ fontSize: 'clamp(2.6rem, 6.5vw, 4.6rem)' }}
            >
              Descubra o investimento do{' '}
              <br className="hidden sm:block" />
              <span className="text-gradient-warm italic">
                Projeto dos Seus Sonhos
              </span>
            </motion.h1>

            {/* Subtítulo */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.44, duration: 0.7 }}
              className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-normal"
            >
              Planeje sua construção em poucos cliques. Escolha entre nossos modelos de linha ou monte um projeto 100% sob medida.
            </motion.p>

            {/* 2 OPÇÕES DIRETAS NA ENTRADA: CATÁLOGO OU SOB MEDIDA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto mb-12 text-left"
            >
              {/* Opção 1: Modelo do Catálogo */}
              <motion.button
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setIsCustomPath(false);
                  setStep(1);
                }}
                className="p-6 rounded-2xl border-2 border-border/80 hover:border-accent bg-white/70 hover:bg-white text-left transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Home className="w-6 h-6 text-[#5C3317]" />
                  </div>
                  <h3 className="font-serif font-bold text-xl text-[#4A2B1D] mb-1.5">
                    1. Modelos do Catálogo
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Simule entre os 11 modelos consagrados (Guarajuba, Caymmi, Itacimirim, etc.) com áreas e plantas otimizadas.
                  </p>
                </div>
                <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-accent">
                  <span>Escolher modelo de catálogo</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </motion.button>

              {/* Opção 2: Montar Projeto Sob Medida */}
              <motion.button
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setIsCustomPath(true);
                  setStep(1);
                }}
                className="p-6 rounded-2xl border-2 border-accent/50 hover:border-accent bg-accent/5 hover:bg-white text-left transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between group ring-1 ring-accent/30"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#5C3317] text-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <SlidersHorizontal className="w-6 h-6" />
                  </div>
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-accent/20 text-accent font-bold text-[10px] uppercase tracking-wider mb-1.5">
                    100% Personalizado
                  </div>
                  <h3 className="font-serif font-bold text-xl text-[#4A2B1D] mb-1.5">
                    2. Montar Projeto Sob Medida
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Casa ou Chalé, Térreo ou Duplex, escolha o tamanho em m², quantidade de quartos e suítes ao seu gosto.
                  </p>
                </div>
                <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-[#5C3317]">
                  <span>Configurar projeto do zero</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </motion.button>
            </motion.div>

            {/* Como Funciona & Prova Social */}
            <div className="flex justify-center mb-10">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowManual(true)}
                className="gap-2 text-stone-500 hover:text-[#5C3317] rounded-xl text-xs font-semibold"
              >
                <BookOpen className="w-4 h-4" /> Entenda como funciona a metodologia de cálculo
              </Button>
            </div>

            {/* Estatísticas */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.72, duration: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-8 sm:gap-12"
            >
              {[
                { value: '+100', label: 'Projetos entregues' },
                { value: '15 anos', label: 'Garantia na madeira' },
                { value: '+ 48MIL', label: 'Seguidores no Instagram' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="font-display font-bold text-2xl text-accent">{stat.value}</div>
                  <div className="text-xs text-muted-foreground font-medium mt-0.5 tracking-wide">{stat.label}</div>
                </div>
              ))}
            </motion.div>

          </motion.div>
        </div>

        <footer className="border-t border-border/50 py-5 text-center text-xs text-muted-foreground/60 font-medium tracking-wide">
          © {new Date().getFullYear()} Wood Bahia — Chalés e Casas Pré-fabricadas na Bahia
        </footer>

        <AnimatePresence>
          {showManual && <UserManual open={showManual} onClose={() => setShowManual(false)} />}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border/50 sticky top-0 z-50 bg-card/85 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 8, scale: 1.08 }}
              className="w-10 h-10 rounded-2xl flex items-center justify-center premium-shadow bg-gradient-to-br from-amber-700 to-amber-900"
            >
              <TreePine className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h1 className="text-base font-display font-bold leading-tight tracking-tight">
                Simulador de Investimento
              </h1>
              <span className="text-[11px] text-muted-foreground font-medium tracking-widest uppercase">
                {isCustomPath ? 'Projeto Sob Medida' : 'Modelos do Catálogo'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="hidden sm:inline-flex">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-accent hover:bg-accent/8 rounded-xl font-semibold text-sm transition-colors"
              >
                <Home className="w-4 h-4" /> Ir para o Site
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="gap-2 text-muted-foreground hover:text-accent hover:bg-accent/8 rounded-xl font-semibold text-sm transition-colors"
            >
              Reiniciar
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        <StepProgress
          currentStep={displayStep}
          totalSteps={totalSteps}
          labels={stepLabels}
        />

        <AnimatePresence mode="wait">
          
          {/* PASSO 1: LOCALIZAÇÃO */}
          {step === 1 && (
            <StepLocation
              key="location"
              initialData={clientData}
              onNext={handleLocationNext}
              onBack={() => handleBack(0)}
            />
          )}

          {/* PASSO 2: ESCOLHA DE MODELO OU CONFIGURAÇÃO SOB MEDIDA */}
          {step === 2 && isCustomPath && (
            <StepCustomProject
              key="custom-project"
              config={customConfig}
              onChange={setCustomConfig}
              onBack={() => handleBack(1)}
              onNext={() => setStep(3)}
            />
          )}

          {step === 2 && !isCustomPath && (
            <div>
              {/* Banner de atalho para Projeto Sob Medida */}
              <div className="max-w-3xl mx-auto mb-6 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#5C3317] text-white flex items-center justify-center shrink-0">
                    <SlidersHorizontal className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-[#4A2B1D] block">Quer um projeto 100% exclusivo?</span>
                    <span className="text-xs text-stone-600">Defina Casa ou Chalé, Duplex, quartos e metragem sob medida.</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={handleCustomSelect}
                  className="bg-[#5C3317] hover:bg-[#4A2B1D] text-white text-xs font-bold rounded-xl shrink-0"
                >
                  Montar Sob Medida
                </Button>
              </div>

              <StepModelSelect
                key="model"
                selected={model}
                isCustom={false}
                onSelect={handleModelSelect}
                onSelectCustom={handleCustomSelect}
              />
            </div>
          )}

          {/* FLUXO SOB MEDIDA: PASSO 3 = RESUMO E SIMULAÇÃO 360° */}
          {step === 3 && isCustomPath && (
            <StepCustomSummary
              key="custom-summary"
              clientData={clientData}
              config={customConfig}
              onBack={() => handleBack(2)}
              onReset={handleReset}
            />
          )}

          {/* FLUXO CATÁLOGO: PASSO 3 = MODALIDADE */}
          {step === 3 && !isCustomPath && model && (
            <StepKitSelect
              key="kit-standard"
              mode="standard"
              isEligibleForTurnkey={clientData.distance === undefined || clientData.distance <= 250}
              clientState={clientData.state}
              clientDistance={clientData.distance}
              model={model}
              kitType={kitType as Exclude<KitType, 'custom'> | null}
              kitAddons={kitAddons}
              onKitSelect={(k) => setKitType(k)}
              onKitAddonsChange={setKitAddons}
              onBack={() => handleBack(2)}
              onNext={handleKitNext}
            />
          )}

          {/* FLUXO CATÁLOGO: PASSO 4 = FUNDAÇÃO */}
          {step === 4 && !isCustomPath && showFoundation && (
            <StepFoundation
              key="foundation"
              area={effectiveArea}
              modelName={model?.name ?? ''}
              foundationType={foundationType}
              onSelect={setFoundationType}
              onBack={() => handleBack(3)}
              onNext={handleFoundationNext}
            />
          )}

          {/* FLUXO CATÁLOGO: PASSO 5 = RESUMO E SIMULAÇÃO */}
          {step === 5 && !isCustomPath && (
            <StepSummary
              key="summary"
              state={simState}
              onBack={() => handleBack(showFoundation ? 4 : 3)}
              onReset={handleReset}
            />
          )}

        </AnimatePresence>
      </main>

      <footer className="border-t border-border/50 py-5 text-center text-xs text-muted-foreground/60 font-medium tracking-wide">
        © {new Date().getFullYear()} Wood Bahia — Chalés e Casas Pré-fabricadas na Bahia
      </footer>

      <AnimatePresence>
        {showManual && <UserManual open={showManual} onClose={() => setShowManual(false)} />}
      </AnimatePresence>
    </div>
  );
}
