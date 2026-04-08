"use client";
import { useState, useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { StepProgress } from '@/components/simulador/StepProgress';
import { StepLocation } from '@/components/simulador/StepLocation';
import { StepModelSelect } from '@/components/simulador/StepModelSelect';
import { StepKitSelect } from '@/components/simulador/StepKitSelect';
import { StepFoundation } from '@/components/simulador/StepFoundation';
import { StepSummary } from '@/components/simulador/StepSummary';
import { UserManual } from '@/components/simulador/UserManual';
import type {
  CabinModel, KitType, FoundationType, CustomOptions, KitAddons,
  SimulationState
} from '@/lib/pricing';
import { needsFoundationStep } from '@/lib/pricing';
import { TreePine, Sparkles, BookOpen, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const INITIAL_CUSTOM: CustomOptions = {
  fixtures: false, tilesStain: false, labor: false, electrical: false, glass: false, project: false,
};

const INITIAL_ADDONS: KitAddons = { electrical: false, glass: false };

export default function Index() {
  const [step, setStep] = useState(0); // 0 = hero, 1 = location, 2+ = wizard
  const [clientData, setClientData] = useState({ name: '', city: '', state: '' });
  const [model, setModel] = useState<CabinModel | null>(null);
  const [isCustomPath, setIsCustomPath] = useState(false);
  const [kitType, setKitType] = useState<KitType | null>(null);
  const [customOptions, setCustomOptions] = useState<CustomOptions>(INITIAL_CUSTOM);
  const [kitAddons, setKitAddons] = useState<KitAddons>(INITIAL_ADDONS);
  const [customArea, setCustomArea] = useState(20);
  const [foundationType, setFoundationType] = useState<FoundationType | null>(null);
  const [slidingDoor, setSlidingDoor] = useState(false);
  const [showManual, setShowManual] = useState(false);

  const simState: SimulationState = useMemo(() => ({
    clientData,
    model,
    kitType: isCustomPath ? 'custom' : kitType,
    customOptions,
    kitAddons,
    foundationType,
    customArea,
    slidingDoor,
  }), [clientData, model, isCustomPath, kitType, customOptions, kitAddons, foundationType, customArea, slidingDoor]);

  const showFoundation = needsFoundationStep(simState);

  const stepLabels = useMemo(() => {
    const labels = ['Local', 'Modelo', 'Kit'];
    if (showFoundation) labels.push('Base');
    labels.push('Resumo');
    return labels;
  }, [showFoundation]);

  const totalSteps = stepLabels.length;

  const displayStep = useMemo(() => {
    if (!showFoundation && step >= 4) return step - 1;
    return step;
  }, [step, showFoundation]);

  const handleLocationNext = useCallback((data: { name: string; city: string; state: string }) => {
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
    setStep(3);
  }, []);

  const handleKitNext = useCallback(() => {
    if (showFoundation) setStep(4);
    else setStep(5);
  }, [showFoundation]);

  const handleFoundationNext = useCallback(() => setStep(5), []);

  const handleReset = useCallback(() => {
    setStep(0);
    setClientData({ name: '', city: '', state: '' });
    setModel(null);
    setIsCustomPath(false);
    setKitType(null);
    setCustomOptions(INITIAL_CUSTOM);
    setKitAddons(INITIAL_ADDONS);
    setCustomArea(20);
    setFoundationType(null);
    setSlidingDoor(false);
  }, []);

  const handleBack = useCallback((target: number) => setStep(target), []);

  const effectiveArea = isCustomPath ? customArea : (model?.area ?? 0);

  // Hero screen
  if (step === 0) {
    return (
      <div className="min-h-screen flex flex-col overflow-hidden">
        <div className="flex-1 flex items-center justify-center px-4 py-16 relative">
          
          {/* Background decorativo — idêntico ao woodbahia.com */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-amber/8 blur-[120px]" />
            <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full bg-accent/6 blur-[140px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-warm-glow/60 blur-[100px]" />
            {/* Linhas de textura sutil */}
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
            {/* Badge de credibilidade — estilo woodbahia.com */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5, ease: 'backOut' }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-10 border"
              style={{
                background: 'linear-gradient(135deg, hsl(20 52% 38% / 0.10), hsl(38 82% 50% / 0.08))',
                borderColor: 'hsl(20 52% 38% / 0.22)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <span className="w-2 h-2 rounded-full bg-amber animate-pulse" />
              <span className="text-accent font-bold text-sm tracking-wider uppercase">
                Calculadora de Investimento
              </span>
              <TreePine className="w-4 h-4 text-accent/70" />
            </motion.div>

            {/* Título principal — tipografia Playfair Display */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="font-display font-bold leading-[1.08] mb-6 tracking-tight"
              style={{ fontSize: 'clamp(2.8rem, 7vw, 5rem)' }}
            >
              Descubra o valor do{' '}
              <br className="hidden sm:block" />
              <span className="text-gradient-warm italic">
                Chalé dos Seus Sonhos
              </span>
            </motion.h1>

            {/* Subtítulo */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.44, duration: 0.7 }}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed font-normal"
            >
              Simule seu investimento em poucos passos e receba uma estimativa personalizada.
              Chalés em madeira Pinus tratada com{' '}
              <strong className="text-foreground font-semibold">15 anos de garantia</strong>.
            </motion.p>

            {/* CTA principal */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.58, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
            >
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setStep(1)}
                className="wood-button text-white inline-flex items-center gap-3 px-9 py-4 rounded-2xl text-base"
              >
                <Sparkles className="w-5 h-5 transition-transform group-hover:rotate-12" />
                Iniciar Simulação Gratuita
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowManual(true)}
                className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl text-base font-semibold text-muted-foreground border border-border/60 hover:border-accent/30 hover:text-accent transition-all duration-300"
                style={{ background: 'hsl(var(--card) / 0.7)', backdropFilter: 'blur(12px)' }}
              >
                <BookOpen className="w-4 h-4" />
                Como funciona
              </motion.button>
            </motion.div>

            {/* Prova social — estatísticas */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.72, duration: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-8 sm:gap-12"
            >
              {[
                { value: '+100', label: 'Projetos entregues' },
                { value: '15 anos', label: 'Garantia na madeira' },
                { value: '45 mil', label: 'Seguidores no Instagram' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.78 + i * 0.1 }}
                  className="text-center"
                >
                  <div className="font-display font-bold text-2xl text-accent">{stat.value}</div>
                  <div className="text-xs text-muted-foreground font-medium mt-0.5 tracking-wide">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Trust line */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              className="mt-10 text-xs text-muted-foreground/60 font-medium tracking-widest uppercase"
            >
              ✦ Rápido, gratuito e sem compromisso
            </motion.p>
          </motion.div>
        </div>

        <footer className="border-t border-border/50 py-5 text-center text-xs text-muted-foreground/60 font-medium tracking-wide">
          © {new Date().getFullYear()} Wood Bahia — Chalés de Madeira na Bahia
        </footer>

        <AnimatePresence>
          {showManual && <UserManual open={showManual} onClose={() => setShowManual(false)} />}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header — estilo woodbahia.com */}
      <header className="border-b border-border/50 sticky top-0 z-50"
        style={{
          background: 'hsl(var(--card) / 0.85)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        }}
      >
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 8, scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="w-10 h-10 rounded-2xl flex items-center justify-center premium-shadow"
              style={{
                background: 'linear-gradient(135deg, hsl(var(--copper)), hsl(var(--timber)))',
              }}
            >
              <TreePine className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h1 className="text-base font-display font-bold leading-tight tracking-tight">
                Calculadora do Chalé dos Sonhos
              </h1>
              <span className="text-[11px] text-muted-foreground font-medium tracking-widest uppercase">
                Wood Bahia
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
              onClick={() => setShowManual(true)}
              className="gap-2 text-muted-foreground hover:text-accent hover:bg-accent/8 rounded-xl font-semibold text-sm transition-colors"
            >
              <BookOpen className="w-4 h-4" /> Como Usar
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
          {step === 1 && (
            <StepLocation
              key="location"
              initialData={clientData}
              onNext={handleLocationNext}
              onBack={() => handleBack(0)}
            />
          )}
          {step === 2 && (
            <StepModelSelect
              key="model"
              selected={model}
              isCustom={isCustomPath}
              onSelect={handleModelSelect}
              onSelectCustom={handleCustomSelect}
            />
          )}
          {step === 3 && !isCustomPath && model && (
            <StepKitSelect
              key="kit-standard"
              mode="standard"
              isEligibleForFull={['BA', 'SE'].includes(clientData.state)}
              model={model}
              kitType={kitType as Exclude<KitType, 'custom'> | null}
              kitAddons={kitAddons}
              slidingDoor={slidingDoor}
              onKitSelect={(k) => setKitType(k)}
              onKitAddonsChange={setKitAddons}
              onSlidingDoorChange={setSlidingDoor}
              onBack={() => handleBack(2)}
              onNext={handleKitNext}
            />
          )}
          {step === 3 && isCustomPath && (
            <StepKitSelect
              key="kit-custom"
              mode="custom"
              isEligibleForFull={['BA', 'SE'].includes(clientData.state)}
              customArea={customArea}
              customOptions={customOptions}
              slidingDoor={slidingDoor}
              onCustomAreaChange={setCustomArea}
              onCustomChange={setCustomOptions}
              onSlidingDoorChange={setSlidingDoor}
              onBack={() => handleBack(2)}
              onNext={handleKitNext}
            />
          )}
          {step === 4 && showFoundation && (
            <StepFoundation
              key="foundation"
              area={effectiveArea}
              modelName={isCustomPath ? `Personalizado (${customArea}m²)` : model?.name ?? ''}
              foundationType={foundationType}
              onSelect={setFoundationType}
              onBack={() => handleBack(3)}
              onNext={handleFoundationNext}
            />
          )}
          {step === 5 && (
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
        © {new Date().getFullYear()} Wood Bahia — Chalés de Madeira na Bahia
      </footer>

      <AnimatePresence>
        {showManual && <UserManual open={showManual} onClose={() => setShowManual(false)} />}
      </AnimatePresence>
    </div>
  );
}

