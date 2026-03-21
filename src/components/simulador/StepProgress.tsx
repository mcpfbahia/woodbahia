import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export function StepProgress({ currentStep, totalSteps, labels }: StepProgressProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-10">
      {/* Barra de progresso linear superior */}
      <div className="h-1 w-full bg-muted rounded-full mb-6 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, hsl(var(--copper)), hsl(var(--amber)))'
          }}
          initial={false}
          animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      </div>

      {/* Steps */}
      <div className="flex items-start justify-center gap-0 w-full">
        {labels.map((label, i) => {
          const step = i + 1;
          const isActive = step === currentStep;
          const isDone = step < currentStep;
          return (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-2">
                <motion.div
                  initial={false}
                  animate={{
                    scale: isActive ? 1.12 : 1,
                  }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className={cn(
                    'relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all duration-300',
                    isDone && 'text-white',
                    isActive && 'text-white ring-4 ring-accent/20',
                    !isActive && !isDone && 'text-muted-foreground'
                  )}
                  style={{
                    background: isDone
                      ? 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-foreground)/0.1))'
                      : isActive
                      ? 'linear-gradient(135deg, hsl(var(--copper)), hsl(var(--amber)))'
                      : 'hsl(var(--muted))',
                    boxShadow: isActive
                      ? '0 4px 16px hsl(var(--accent) / 0.32), 0 0 0 4px hsl(var(--accent) / 0.10)'
                      : isDone
                      ? '0 2px 8px hsl(var(--primary) / 0.3)'
                      : 'none',
                  }}
                >
                  {isDone ? <Check className="w-4 h-4" strokeWidth={3} /> : step}
                  {/* Pulsação no step ativo */}
                  {isActive && (
                    <span className="absolute inset-0 rounded-full animate-ping opacity-20"
                      style={{ background: 'hsl(var(--accent))' }}
                    />
                  )}
                </motion.div>
                <span className={cn(
                  'text-xs font-semibold text-center whitespace-nowrap transition-colors duration-300 tracking-wide',
                  isActive ? 'text-accent' : isDone ? 'text-primary' : 'text-muted-foreground/60'
                )}>
                  {label}
                </span>
              </div>
              {i < totalSteps - 1 && (
                <div className="relative h-0.5 flex-1 mx-3 rounded-full mt-[-1.5rem] bg-muted overflow-hidden">
                  <motion.div
                    initial={false}
                    animate={{ scaleX: step < currentStep ? 1 : 0 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className="absolute inset-0 origin-left rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--copper)))',
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
