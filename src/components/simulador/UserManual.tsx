import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, MousePointerClick, SlidersHorizontal, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  open: boolean;
  onClose: () => void;
}

const steps = [
  {
    icon: MousePointerClick,
    title: '1. Escolha o Modelo',
    desc: 'Selecione um dos chalés padrão ou escolha "Kit Personalizado" para definir a metragem desejada.',
  },
  {
    icon: SlidersHorizontal,
    title: '2. Configure o Kit',
    desc: 'Escolha o nível de acabamento (Kit 1 a 4). Adicione opcionais como elétrica, vidros e porta de correr.',
  },
  {
    icon: FileText,
    title: '3. Base / Fundação',
    desc: 'Quando a mão de obra está inclusa, selecione o tipo de fundação desejado (radier, sapata ou estaca).',
  },
  {
    icon: BookOpen,
    title: '4. Resumo',
    desc: 'Veja o detalhamento completo, valor à vista com desconto e condições de pagamento parcelado.',
  },
];

export function UserManual({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="glass-card border-0 rounded-2xl premium-shadow overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center premium-shadow"
                  style={{ background: 'linear-gradient(135deg, hsl(var(--copper)), hsl(var(--amber)))' }}
                >
                  <BookOpen className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <h2 className="font-display font-bold text-xl text-accent">Como Usar</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-accent/10 hover:text-accent">
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex flex-col gap-5">
              {steps.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className="flex items-start gap-4 p-3 rounded-xl hover:bg-accent/5 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-amber/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-amber/20 transition-colors">
                    <s.icon className="w-5 h-5 text-amber" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-foreground tracking-tight">{s.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-1 font-medium">{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <p className="text-xs text-muted-foreground mt-6 text-center">
              Os valores são estimativas. Solicite uma proposta formal para um orçamento detalhado.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
