import type { KitType, CustomOptions, CabinModel, KitAddons } from '@/lib/pricing';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const KIT_OPTIONS: { id: Exclude<KitType, 'custom'>; name: string; desc: string; highlight?: boolean }[] = [
  { id: 'madeiramento', name: '🪵 1. Apenas o Kit Madeiramento', desc: 'Madeiramento estrutural completo em Pinus tratado em autoclave (pilares, vigas, paredes, forro, estrutura de telhado). A montagem e demais materiais são de responsabilidade do cliente.' },
  { id: 'parceira', name: '🔨 2. Kit + Montagem Parceira', desc: 'Madeiramento + esquadrias (portas/janelas/ferragens) + mão de obra de carpintaria credenciada, com isenção de taxas administrativas da Wood Bahia. A cobertura, vidros e elétrica são contratados à parte.' },
  { id: 'turnkey', name: '🔑 3. Wood Bahia Chave na Mão', desc: 'Estrutura de madeira montada e acabada com responsabilidade única da Wood Bahia. Inclui madeiramento, esquadrias, cobertura completa (telhas ecológicas e manta térmica), vidros fachada, pintura em Stain (protetor), mão de obra própria e coordenação/gestão técnica total.', highlight: true },
];

const CUSTOM_ADDONS: { key: keyof CustomOptions; label: string }[] = [
  { key: 'fixtures', label: 'Portas, Janelas e Ferragens' },
  { key: 'tilesStain', label: 'Telhas e Stain' },
  { key: 'labor', label: 'Mão de Obra' },
  { key: 'electrical', label: 'Kit Elétrica/Hidráulica' },
  { key: 'glass', label: 'Vidros' },
  { key: 'project', label: 'Projeto Personalizado' },
];

const STANDARD_ADDONS: { key: keyof KitAddons; label: string }[] = [
  { key: 'electrical', label: 'Kit Elétrica/Hidráulica' },
  { key: 'glass', label: 'Vidros' },
];

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

interface StandardProps {
  mode: 'standard';
  isEligibleForTurnkey: boolean;
  model: CabinModel;
  kitType: Exclude<KitType, 'custom'> | null;
  kitAddons: KitAddons;
  slidingDoor: boolean;
  onKitSelect: (kit: KitType) => void;
  onKitAddonsChange: (addons: KitAddons) => void;
  onSlidingDoorChange: (v: boolean) => void;
  onBack: () => void;
  onNext: () => void;
}

interface CustomProps {
  mode: 'custom';
  isEligibleForTurnkey: boolean;
  customArea: number;
  customOptions: CustomOptions;
  slidingDoor: boolean;
  onCustomAreaChange: (area: number) => void;
  onCustomChange: (opts: CustomOptions) => void;
  onSlidingDoorChange: (v: boolean) => void;
  onBack: () => void;
  onNext: () => void;
}

type Props = StandardProps | CustomProps;

export function StepKitSelect(props: Props) {
  if (props.mode === 'custom') return <CustomMode {...props} />;
  return <StandardMode {...props} />;
}

function StandardMode({ isEligibleForTurnkey, model, kitType, kitAddons, slidingDoor, onKitSelect, onKitAddonsChange, onSlidingDoorChange, onBack, onNext }: StandardProps) {
  const showSlidingDoor = kitType === 'parceira' || kitType === 'turnkey';
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35 }}
    >
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold font-display mb-3">
          Escolha a <span className="text-gradient-warm italic">Modalidade de Obra</span>
        </h2>
        <p className="text-muted-foreground">Modelo selecionado: <strong className="text-foreground">{model.name}</strong> ({model.area}m²)</p>
      </div>

      <motion.div
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.06 }}
        className="flex flex-col gap-3 max-w-xl mx-auto mb-8"
      >
        {KIT_OPTIONS.map((opt) => {
          const isSelected = kitType === opt.id;
          const isDisabled = !isEligibleForTurnkey && opt.id === 'turnkey';
          return (
            <motion.button
              key={opt.id}
              variants={itemVariants}
              whileHover={!isDisabled ? { x: 4, transition: { duration: 0.15 } } : {}}
              whileTap={!isDisabled ? { scale: 0.98 } : {}}
              onClick={() => !isDisabled && onKitSelect(opt.id)}
              disabled={isDisabled}
              className={cn(
                'flex flex-col p-5 rounded-2xl border-2 text-left transition-all duration-300',
                isSelected
                  ? 'border-accent bg-accent/10 ring-1 ring-accent premium-shadow'
                  : isDisabled
                    ? 'border-border/40 opacity-60 bg-muted/20 cursor-not-allowed'
                    : 'border-border glass-card hover:border-accent/50 hover:bg-accent/5'
              )}
            >
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-display font-semibold text-base">{opt.name}</span>
                {opt.highlight && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.15 }}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-white text-[11px] font-bold uppercase tracking-widest"
                    style={{
                      background: 'linear-gradient(135deg, hsl(20 52% 38%), hsl(38 82% 50%))',
                      boxShadow: '0 3px 10px hsl(38 82% 50% / 0.40)',
                    }}
                  >
                    <span>🔥</span>
                    <span>Recomendado</span>
                  </motion.span>
                )}
              </div>
              <span className="text-sm text-muted-foreground mt-1">{opt.desc}</span>
              {isDisabled && (
                <span className="text-xs text-destructive font-medium mt-2 block">
                  * Apenas para projetos de 2+ unidades (ex: pousadas), consulte-nos
                </span>
              )}
            </motion.button>
          );
        })}
      </motion.div>

      {(kitType === 'parceira' || kitType === 'turnkey') && (
        <div className="max-w-xl mx-auto glass-card rounded-2xl p-6 mb-8">
          <p className="text-sm font-semibold mb-4 font-display">Opcionais de Obra:</p>
          <div className="flex flex-col gap-3">
            {STANDARD_ADDONS.filter(addon => !(kitType === 'turnkey' && addon.key === 'glass')).map((addon) => (
              <div key={addon.key} className="flex items-center gap-3">
                <Checkbox
                  id={`std-${addon.key}`}
                  checked={kitAddons[addon.key]}
                  onCheckedChange={(checked) =>
                    onKitAddonsChange({ ...kitAddons, [addon.key]: !!checked })
                  }
                />
                <Label htmlFor={`std-${addon.key}`} className="text-sm cursor-pointer">
                  {addon.label}
                </Label>
              </div>
            ))}
            {kitType === 'turnkey' && (
              <div className="flex items-center gap-3 opacity-80">
                <Checkbox id="std-glass-turnkey" checked disabled />
                <Label htmlFor="std-glass-turnkey" className="text-sm text-muted-foreground cursor-not-allowed">
                  Vidros Fachada (Já inclusos no pacote)
                </Label>
              </div>
            )}
          </div>
        </div>
      )}

      {showSlidingDoor && (
        <div className="max-w-xl mx-auto glass-card rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <Checkbox
              id="std-sliding-door"
              checked={slidingDoor}
              onCheckedChange={(checked) => onSlidingDoorChange(!!checked)}
            />
            <div>
              <Label htmlFor="std-sliding-door" className="text-sm cursor-pointer">
                Prefere porta de correr de 1.8m em eucalipto?
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">+R$ 3.000 com 5% de desconto no total de portas/janelas</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between max-w-xl mx-auto">
        <Button variant="outline" onClick={onBack} className="gap-2 rounded-xl">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Button>
        <Button onClick={onNext} disabled={!kitType} className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl premium-shadow">
          Continuar <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}

function CustomMode({ isEligibleForTurnkey, customArea, customOptions, slidingDoor, onCustomAreaChange, onCustomChange, onSlidingDoorChange, onBack, onNext }: CustomProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35 }}
    >
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold font-display mb-3">
          Kit <span className="text-gradient-warm italic">Personalizado</span>
        </h2>
        <p className="text-muted-foreground">Defina o tamanho e monte seu kit sob medida</p>
      </div>

      <div className="max-w-xl mx-auto mb-8 glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold font-display">Área do Chalé</span>
          <span className="text-2xl font-bold text-accent font-display">{customArea} m²</span>
        </div>
        <Slider
          value={[customArea]}
          min={6}
          max={150}
          step={0.5}
          onValueChange={([v]) => v !== undefined && onCustomAreaChange(v as number)}
        />
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>6 m²</span>
          <span>150 m²</span>
        </div>
      </div>

      <div className="max-w-xl mx-auto glass-card rounded-2xl p-6 mb-8">
        <p className="text-sm font-semibold mb-4 font-display">Itens adicionais (Kit Madeiramento incluso):</p>
        <div className="flex flex-col gap-3">
          {CUSTOM_ADDONS.map((addon) => {
            return (
              <div key={addon.key} className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id={`cust-${addon.key}`}
                    checked={customOptions[addon.key]}
                    onCheckedChange={(checked) =>
                      onCustomChange({ ...customOptions, [addon.key]: !!checked })
                    }
                  />
                  <Label htmlFor={`cust-${addon.key}`} className="text-sm cursor-pointer">
                    {addon.label}
                  </Label>
                </div>
              </div>
            );
          })}
          {customOptions.fixtures && (
            <div className="flex items-start gap-3 pt-2 border-t border-border/50">
              <Checkbox
                id="cust-sliding-door"
                checked={slidingDoor}
                onCheckedChange={(checked) => onSlidingDoorChange(!!checked)}
              />
              <div>
                <Label htmlFor="cust-sliding-door" className="text-sm cursor-pointer">
                  Prefere porta de correr de 1.8m em eucalipto?
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">+R$ 3.000 com 5% de desconto no total de portas/janelas</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between max-w-xl mx-auto">
        <Button variant="outline" onClick={onBack} className="gap-2 rounded-xl">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Button>
        <Button onClick={onNext} className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl premium-shadow">
          Continuar <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}
