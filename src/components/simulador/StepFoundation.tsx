import { getEucalyptusFoundation, getMasonryFoundation, getRadierFoundation } from '@/lib/pricing';
import type { FoundationType } from '@/lib/pricing';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const FOUNDATION_OPTIONS: { id: FoundationType; name: string; desc: string }[] = [
  { id: 'eucalyptus', name: 'Sapatas em Eucalipto', desc: 'Base econômica em eucalipto tratado' },
  { id: 'masonry', name: 'Sapatas Manilhas de Alvenaria', desc: 'Base em manilhas de alvenaria — maior durabilidade' },
  { id: 'radier', name: 'Radier + Banheiro Alvenaria', desc: 'Laje radier com banheiro em alvenaria rebocado' },
  { id: 'none', name: 'Sem Base (já possuo)', desc: 'Não incluir base na simulação' },
];

function getPrice(id: FoundationType, area: number): number | null {
  switch (id) {
    case 'eucalyptus': return getEucalyptusFoundation(area);
    case 'masonry': return getMasonryFoundation(area);
    case 'radier': return getRadierFoundation(area);
    default: return null;
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

interface Props {
  area: number;
  modelName: string;
  foundationType: FoundationType | null;
  onSelect: (f: FoundationType) => void;
  onBack: () => void;
  onNext: () => void;
}

export function StepFoundation({ area, modelName, foundationType, onSelect, onBack, onNext }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35 }}
    >
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold font-display mb-3">
          Escolha a <span className="text-gradient-warm italic">Base</span>
        </h2>
        <p className="text-muted-foreground">Tipo de fundação para o seu <strong className="text-foreground">{modelName}</strong></p>
      </div>

      <motion.div
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.06 }}
        className="flex flex-col gap-3 max-w-xl mx-auto mb-8"
      >
        {FOUNDATION_OPTIONS.map((opt) => {
          const isSelected = foundationType === opt.id;
          const price = getPrice(opt.id, area);
          return (
            <motion.button
              key={opt.id}
              variants={itemVariants}
              whileHover={{ x: 4, transition: { duration: 0.15 } }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(opt.id)}
              className={cn(
                'flex items-center justify-between p-5 rounded-2xl border-2 text-left transition-all duration-300',
                isSelected
                  ? 'border-accent bg-accent/5 premium-shadow'
                  : 'border-border glass-card hover:border-accent/40'
              )}
            >
              <div>
                <span className="font-display font-semibold text-base">{opt.name}</span>
                <span className="block text-sm text-muted-foreground mt-1">{opt.desc}</span>
              </div>
              {price !== null && (
                <span className="text-sm font-bold text-accent whitespace-nowrap ml-4">
                  R$ {price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              )}
            </motion.button>
          );
        })}
      </motion.div>

      <div className="flex justify-between max-w-xl mx-auto">
        <Button variant="outline" onClick={onBack} className="gap-2 rounded-xl">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Button>
        <Button onClick={onNext} disabled={!foundationType} className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl premium-shadow">
          Ver Resumo <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}
