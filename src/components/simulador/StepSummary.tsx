import { calculateSummary, getEffectiveArea, calculateInstallmentValue } from '@/lib/pricing';
import type { SimulationState, LineItem } from '@/lib/pricing';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, MessageCircle, RotateCcw, Info } from 'lucide-react';

interface Props {
  state: SimulationState;
  onBack: () => void;
  onReset: () => void;
}

function fmt(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

const KIT_NAMES: Record<string, string> = {
  kit1: 'Kit 1 — Essência Natural',
  kit2: 'Kit 2 — Raízes do Projeto',
  kit3: 'Kit 3 — Abrigo Natural',
  kit4: 'Kit 4 — Refúgio Completo',
  custom: 'Kit Personalizado',
};

export function StepSummary({ state, onBack, onReset }: Props) {
  const { items, freight, total, materialSubtotal } = calculateSummary(state);
  const area = getEffectiveArea(state);
  const isCustom = state.kitType === 'custom';
  const modelLabel = isCustom
    ? `Kit Personalizado — ${area}m²`
    : `${state.model!.name} — ${state.model!.area}m²`;
  const kitLabel = state.kitType ? KIT_NAMES[state.kitType] || state.kitType : '';

  const CASH_DISCOUNT = 0.05;
  const totalAVista = Math.round(total - (materialSubtotal * CASH_DISCOUNT));
  const sinal = total * 0.3;
  const entrega = total * 0.2;
  const saldo = total * 0.5;

  // Build WhatsApp message with full report
  const whatsappMessage = [
    `Olá! Fiz uma simulação no site e gostaria de uma proposta real.`,
    ``,
    `📋 *RELATÓRIO DA SIMULAÇÃO*`,
    `👤 Cliente: ${state.clientData?.name || 'Não informado'} - ${state.clientData?.city || '-'}/${state.clientData?.state || '-'}`,
    `🏡 Modelo: ${modelLabel}`,
    `📦 Kit: ${kitLabel}`,
    ``,
    `📊 *Detalhamento:*`,
    ...items.map((item: LineItem) => `• ${item.label}: ${fmt(item.value)}`),
    `• Frete Estimado (${area}m² × R$ 90): ${fmt(freight)}`,
    ``,
    `💰 *Total do Investimento: ${fmt(total)}*`,
    `💚 *À Vista (5% desc.): ${fmt(totalAVista)}*`,
    ``,
    `📅 *Condições de Pagamento:*`,
    `• Sinal (30%): ${fmt(sinal)}`,
    `• Entrega do Kit (20%): ${fmt(entrega)}`,
    `• Saldo Final (50%): ${fmt(saldo)}`,
  ].join('\n');

  const whatsappUrl = `https://wa.me/5571992936290?text=${encodeURIComponent(whatsappMessage)}`;

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
          className="text-3xl md:text-4xl font-bold font-display mb-3"
        >
          Resumo do <span className="text-gradient-warm italic">Investimento</span>
        </motion.h2>
        <p className="text-muted-foreground">{modelLabel}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {/* Main breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card className="glass-card border-0 rounded-2xl premium-shadow overflow-hidden">
            <CardContent className="p-7">
              <h3 className="font-display font-semibold text-lg mb-5">Detalhamento</h3>
              <div className="flex flex-col gap-3">
                {items.map((item: LineItem, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.04 }}
                    className="flex justify-between items-center text-sm py-1"
                  >
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-semibold tabular-nums">{fmt(item.value)}</span>
                  </motion.div>
                ))}
                <div className="flex justify-between items-center text-sm py-1">
                  <span className="text-muted-foreground">Frete Estimado ({area}m² × R$ 90)</span>
                  <span className="font-semibold tabular-nums">{fmt(freight)}</span>
                </div>
              </div>

              <Separator className="my-6" />

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="flex justify-between items-center bg-accent/5 rounded-xl p-4 -mx-1"
              >
                <span className="text-lg font-bold font-display">Total do Investimento</span>
                <span className="text-2xl md:text-3xl font-bold text-accent font-display">{fmt(total)}</span>
              </motion.div>

              {/* Cash discount highlight */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="flex justify-between items-center bg-green-500/10 border border-green-500/20 rounded-xl p-4 -mx-1 mt-3"
              >
                <div>
                  <span className="text-sm font-bold font-display text-green-700 dark:text-green-400">💰 À Vista (5% de desconto)</span>
                  <p className="text-xs text-muted-foreground mt-0.5">Pagamento integral antecipado</p>
                </div>
                <span className="text-xl md:text-2xl font-bold text-green-700 dark:text-green-400 font-display">{fmt(totalAVista)}</span>
              </motion.div>

              <Separator className="my-6" />

              <h3 className="font-display font-semibold text-base mb-4">Condições de Pagamento (Boleto/PIX)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Sinal (30%)', value: sinal, desc: 'Para iniciar o projeto' },
                  { label: 'Entrega do Kit (20%)', value: entrega, desc: 'Na chegada do material' },
                  { label: 'Saldo Final (50%)', value: saldo, desc: 'Até a entrega das chaves' },
                ].map((p, i) => (
                  <motion.div
                    key={p.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.08 }}
                    className="bg-secondary/40 border border-secondary/20 rounded-xl p-4 transition-colors hover:bg-secondary/60"
                  >
                    <span className="text-[10px] text-foreground/60 font-bold uppercase tracking-wider">{p.label}</span>
                    <p className="font-bold text-lg mt-1 font-display tabular-nums text-primary">{fmt(p.value)}</p>
                    <span className="text-[10px] text-muted-foreground font-medium">{p.desc}</span>
                  </motion.div>
                ))}
              </div>

              <Separator className="my-6" />

              {/* Simulação Cartão de Crédito */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg">💳</span>
                  <h3 className="font-display font-semibold text-base">Simulação no Cartão de Crédito</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[3, 6, 10, 12, 15, 18].map((n, i) => {
                    const res = calculateInstallmentValue(total, n);
                    return (
                      <motion.div
                        key={n}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 + i * 0.06 }}
                        className={`rounded-xl p-4 border transition-all duration-300 hover:shadow-md ${
                          n === 3
                            ? 'bg-green-500/10 border-green-500/20'
                            : n === 18
                            ? 'bg-accent/15 border-accent/30 ring-1 ring-accent/20'
                            : 'bg-secondary/40 border-secondary/20 hover:bg-secondary/60'
                        }`}
                      >
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${
                          n === 3 ? 'text-green-700 dark:text-green-400' : 'text-foreground/70'
                        }`}>
                          {n}x {res.isInterestFree ? 'sem juros' : 'c/ taxas'}
                        </span>
                        <p className={`font-bold text-xl mt-1 font-display tabular-nums ${
                          n === 3 ? 'text-green-700 dark:text-green-400' : 'text-primary'
                        }`}>
                          {fmt(res.installment)}
                        </p>
                        <span className="text-[10px] text-muted-foreground font-medium">Total: {fmt(res.total)}</span>
                      </motion.div>
                    );
                  })}
                </div>
                <p className="text-[11px] text-muted-foreground text-center mt-3 italic">
                  * Sujeito a aprovação de limite e taxas da operadora de cartão.
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA column */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="flex flex-col gap-4"
        >
          <Card className="bg-accent text-accent-foreground border-0 rounded-2xl premium-shadow overflow-hidden">
            <CardContent className="p-7 flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-full bg-accent-foreground/10 flex items-center justify-center">
                <MessageCircle className="w-7 h-7" />
              </div>
              <h3 className="font-display font-bold text-xl">Gostou?</h3>
              <p className="text-sm opacity-90 leading-relaxed">Fale agora com um especialista e tire todas as suas dúvidas.</p>
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-card text-foreground font-bold px-6 py-3 rounded-xl text-sm hover:bg-card/90 transition-colors w-full justify-center"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </motion.a>
            </CardContent>
          </Card>

          <Button variant="outline" onClick={onReset} className="gap-2 rounded-xl h-12">
            <RotateCcw className="w-4 h-4" /> Nova Simulação
          </Button>
          <Button variant="ghost" onClick={onBack} className="gap-2 rounded-xl h-12">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Button>
        </motion.div>
      </div>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="max-w-4xl mx-auto mt-8 px-2"
      >
        <div className="flex items-start gap-3 bg-secondary/50 rounded-xl p-4">
          <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Os valores apresentados são estimativas com base nas configurações selecionadas e servem apenas como referência inicial.
            Para um orçamento detalhado e personalizado, entre em contato com nossa equipe e solicite uma proposta formal.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
