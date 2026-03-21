import { CABIN_MODELS } from '@/lib/pricing';
import type { CabinModel } from '@/lib/pricing';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Home, TreePine, SlidersHorizontal } from 'lucide-react';

interface Props {
  selected: CabinModel | null;
  isCustom: boolean;
  onSelect: (model: CabinModel) => void;
  onSelectCustom: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

export function StepModelSelect({ selected, isCustom, onSelect, onSelectCustom }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35 }}
    >
      <div className="text-center mb-10">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl font-bold font-display mb-3"
        >
          Escolha o <span className="text-gradient-warm italic">Modelo</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-base"
        >
          Selecione o chalé ideal para o seu projeto
        </motion.p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {CABIN_MODELS.map((model) => {
          const isSelected = !isCustom && selected?.id === model.id;
          const isCamping = model.area < 15;
          return (
            <motion.button
              key={model.id}
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(model)}
              className={cn(
                'group relative flex flex-col items-start p-6 rounded-2xl border-2 text-left transition-all duration-300',
                isSelected
                  ? 'border-accent bg-accent/5 premium-shadow'
                  : 'border-border glass-card hover:border-accent/40 hover:premium-shadow'
              )}
            >
              {/* Badge "Mais simulado" reposicionado no topo do card */}
              {model.id === 'itacimirim' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.7, y: -6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.2 }}
                  className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-[11px] font-bold uppercase tracking-widest whitespace-nowrap"
                  style={{
                    background: 'linear-gradient(135deg, hsl(20 52% 38%), hsl(38 82% 50%))',
                    boxShadow: '0 4px 14px hsl(38 82% 50% / 0.45), 0 0 0 2px rgba(255,255,255,0.9)',
                  }}
                >
                  <span>🔥</span>
                  <span>Mais simulado</span>
                </motion.div>
              )}
              <div className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300',
                isSelected
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-secondary text-muted-foreground group-hover:bg-accent/10 group-hover:text-accent'
              )}>
                {isCamping ? <TreePine className="w-5 h-5" /> : <Home className="w-5 h-5" />}
              </div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-semibold text-lg mb-0">{model.name}</h3>
              </div>
              <span className="text-sm text-muted-foreground mb-4">{model.area.toLocaleString('pt-BR')} m²</span>
              <span className="text-sm font-semibold text-accent mt-auto">
                A partir de R$ {model.kitPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 right-4 w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </motion.div>
              )}
            </motion.button>
          );
        })}

        {/* Custom */}
        <motion.button
          variants={cardVariants}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.98 }}
          onClick={onSelectCustom}
          className={cn(
            'group relative flex flex-col items-start p-6 rounded-2xl border-2 text-left transition-all duration-300 border-dashed',
            isCustom
              ? 'border-accent bg-accent/5 premium-shadow'
              : 'border-border glass-card hover:border-accent/40 hover:premium-shadow'
          )}
        >
          <div className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300',
            isCustom
              ? 'bg-accent text-accent-foreground'
              : 'bg-secondary text-muted-foreground group-hover:bg-accent/10 group-hover:text-accent'
          )}>
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <h3 className="font-display font-semibold text-lg mb-1">Kit Personalizado</h3>
          <span className="text-sm text-muted-foreground mb-4">Escolha o tamanho e monte sob medida</span>
          <span className="text-sm font-semibold text-accent mt-auto">A partir de 6 m²</span>
          {isCustom && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-4 right-4 w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </motion.div>
          )}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
