import { calculateSummary, getEffectiveArea, calculateInstallmentValue, getModelDiscountRate, getPaymentBases } from '@/lib/pricing';
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

function fmt(v: any) {
  if (v == null || isNaN(Number(v))) return "R$ 0,00";
  return Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

const KIT_NAMES: Record<string, string> = {
  madeiramento: 'Modalidade 1 — Apenas o Kit Madeiramento',
  parceira: 'Modalidade 2 — Kit + Montagem Parceira',
  turnkey: 'Modalidade 3 — Wood Bahia Chave na Mão',
  custom: 'Kit Personalizado',
};

export function StepSummary({ state, onBack, onReset }: Props) {
  const { items, freight, additionalFreight, additionalTravelCost, total } = calculateSummary(state);
  const area = getEffectiveArea(state);
  const { creditCardBase, pixBase } = getPaymentBases(items, total);
  
  const isCustom = state.kitType === 'custom';
  const modelLabel = isCustom
    ? `Kit Personalizado — ${area}m²`
    : `${state.model!.name} — ${state.model!.area}m²`;
  const kitLabel = state.kitType ? KIT_NAMES[state.kitType] || state.kitType : '';

  const CASH_DISCOUNT = getModelDiscountRate(state.model?.id || state.model?.name, state.model?.discountRate);
  const totalAVista = Math.round(total - (creditCardBase * CASH_DISCOUNT));
  
  const isMadeiramento = state.kitType === 'madeiramento';
  const sinalPix = isMadeiramento ? total * 0.3 : total / 2;
  const saldoPix = isMadeiramento ? total * 0.7 : total / 2;
  const pctSinal = isMadeiramento ? '30%' : '50%';
  const pctSaldo = isMadeiramento ? '70%' : '50%';
  const descSinal = isMadeiramento ? 'Na assinatura do contrato' : 'Para iniciar o projeto';
  const descSaldo = isMadeiramento ? '24h antes do embarque do kit (Saída da fábrica)' : 'Na saída da fábrica';

  // Build WhatsApp message with full report
  const whatsappMessage = [
    `Olá! Fiz uma simulação no site e gostaria de uma proposta real.`,
    ``,
    `📋 *RELATÓRIO DA SIMULAÇÃO*`,
    `👤 Cliente: ${state.clientData?.name || 'Não informado'} - ${state.clientData?.city || '-'}/${state.clientData?.state || '-'}`,
    state.clientData?.distance ? `📍 Distância: ${state.clientData.distance} km` : ``,
    `🏡 Modelo: ${modelLabel}`,
    `📦 Kit: ${kitLabel}`,
    ``,
    `📊 *Detalhamento:*`,
    ...items.map((item: LineItem) => `• ${item.label}: ${fmt(item.value)}`),
    `• Frete Estimado: ${fmt(freight)}`,
    additionalFreight > 0 ? `• Frete Adicional (> 200km): ${fmt(additionalFreight)}` : ``,
    additionalTravelCost > 0 ? `• Deslocamento Adicional Chave na Mão (> 200km): ${fmt(additionalTravelCost)}` : ``,
    ``,
    `💰 *Total do Investimento: ${fmt(total)}*`,
    `💚 *À Vista (Desconto no Kit): ${fmt(totalAVista)}*`,
    ``,
    `📅 *OPÇÃO 1: PIX/BOLETO*`,
    `• Sinal (${pctSinal}): ${fmt(sinalPix)} — ${descSinal}`,
    `• Saldo Final (${pctSaldo}): ${fmt(saldoPix)} — ${descSaldo}`,
    ``,
    `💳 *OPÇÃO 2: PARCELAMENTO (ATÉ 18X SEM JUROS)*`,
    pixBase > 0 ? `*⚠️ Mão de Obra e Complementos (Via PIX)*: ${fmt(pixBase)} pago durante a obra.` : ``,
    `*18x Sem Juros do Kit Madeiramento*: ${fmt(calculateInstallmentValue(creditCardBase, 18).installment)} por mês.`,
    ``,
    `*Status:* Gostaria de uma análise de crédito ou tem dúvidas sobre a proposta?`,
  ].filter(Boolean).join('\n');

  const whatsappUrl = `https://wa.me/5571992936290?text=${encodeURIComponent(whatsappMessage)}`;

  // Filtragem de itens por categoria
  const materialItems = items.filter(item => {
    const label = item.label.toLowerCase();
    const isService = label.includes('mão de obra') || 
                      label.includes('gestão') || 
                      label.includes('coordenação') || 
                      label.includes('deslocamento');
    return !isService;
  });

  const serviceItems = items.filter(item => {
    const label = item.label.toLowerCase();
    const isService = label.includes('mão de obra') || 
                      label.includes('gestão') || 
                      label.includes('coordenação') || 
                      label.includes('deslocamento');
    return isService;
  });

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
              <h3 className="font-display font-semibold text-lg mb-5">Detalhamento do Orçamento</h3>
              
              <div className="flex flex-col gap-6">
                {/* 1. Materiais do Kit & Logística */}
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-[#B06D46] mb-3 flex items-center gap-1.5 border-b border-stone-100 pb-1.5">
                    <span>🪵</span> Materiais do Kit & Logística
                  </h4>
                  <div className="flex flex-col gap-2.5 pl-1">
                    {materialItems.map((item: LineItem, i: number) => {
                      const isIncFoundation = item.value === 0 && (
                        item.label.toLowerCase().includes('sapata') || 
                        item.label.toLowerCase().includes('base radier') || 
                        item.label.toLowerCase().includes('base estrutural') || 
                        item.label.toLowerCase().includes('fundação') ||
                        item.label.toLowerCase().includes('alicerce')
                      );
                      return (
                        <div key={i} className="flex justify-between items-center text-sm py-0.5">
                          <span className="text-muted-foreground">{item.label}</span>
                          {isIncFoundation ? (
                            <span className="font-semibold text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full text-[10px] border border-green-100 uppercase tracking-wider">
                              Incluso
                            </span>
                          ) : (
                            <span className="font-semibold tabular-nums text-stone-850">{fmt(item.value)}</span>
                          )}
                        </div>
                      );
                    })}
                    <div className="flex justify-between items-center text-sm py-0.5">
                      <span className="text-muted-foreground">Frete Compartilhado Estimado ({area}m² × R$ 90)</span>
                      <span className="font-semibold tabular-nums text-stone-850">{fmt(freight)}</span>
                    </div>
                    {additionalFreight > 0 && (
                      <div className="flex justify-between items-center text-sm py-0.5 text-amber-600 font-semibold">
                        <span>Frete Adicional (&gt; 200km)</span>
                        <span className="tabular-nums">+{fmt(additionalFreight)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Serviços & Montagem de Obra */}
                {(serviceItems.length > 0 || additionalTravelCost > 0) && (
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-[#B06D46] mb-3 flex items-center gap-1.5 border-b border-stone-100 pb-1.5">
                      <span>🔨</span> Montagem & Serviços de Obra
                    </h4>
                    <div className="flex flex-col gap-2.5 pl-1">
                      {serviceItems.map((item: LineItem, i: number) => {
                        const isIncFoundation = item.value === 0 && (
                          item.label.toLowerCase().includes('sapata') || 
                          item.label.toLowerCase().includes('base radier') || 
                          item.label.toLowerCase().includes('base estrutural') || 
                          item.label.toLowerCase().includes('fundação') ||
                          item.label.toLowerCase().includes('alicerce')
                        );
                        return (
                          <div key={i} className="flex justify-between items-center text-sm py-0.5">
                            <span className="text-muted-foreground">{item.label}</span>
                            {isIncFoundation ? (
                              <span className="font-semibold text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full text-[10px] border border-green-100 uppercase tracking-wider">
                                Incluso
                              </span>
                            ) : (
                              <span className="font-semibold tabular-nums text-stone-850">{fmt(item.value)}</span>
                            )}
                          </div>
                        );
                      })}
                      {additionalTravelCost > 0 && (
                        <div className="flex justify-between items-center text-sm py-0.5 text-amber-600 font-semibold">
                          <span>Deslocamento Adicional Chave na Mão (&gt; 200km)</span>
                          <span className="tabular-nums">+{fmt(additionalTravelCost)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
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
                  <span className="text-sm font-bold font-display text-green-700 dark:text-green-400">💰 À Vista ({CASH_DISCOUNT * 100}% desc.)</span>
                  <p className="text-xs text-muted-foreground mt-0.5">Aplicado sobre o madeiramento e base</p>
                </div>
                <span className="text-xl md:text-2xl font-bold text-green-700 dark:text-green-400 font-display">{fmt(totalAVista)}</span>
              </motion.div>

              <Separator className="my-6" />

              <h3 className="font-display font-semibold text-base mb-4">Condições de Pagamento (Boleto/PIX)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: `Sinal (${pctSinal})`, value: sinalPix, desc: descSinal },
                  { label: `Saldo Final (${pctSaldo})`, value: saldoPix, desc: descSaldo },
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

                {pixBase > 0 && (
                  <div className="bg-accent/10 border border-accent/20 rounded-xl p-3 mb-4 flex items-start gap-3">
                    <div className="bg-accent/20 p-2 rounded-full text-accent mt-0.5"><Info size={16} /></div>
                    <p className="text-[11px] text-foreground/80 leading-snug">
                      Na modalidade <b>Chave na Mão</b> ou <b>Parceira</b>, os itens complementares e a mão de obra (<span className="font-bold text-accent">{fmt(pixBase)}</span>) 
                      são pagos de forma independente via PIX (Sinal + Saldo no andamento da obra). <br/>
                      A tabela de 18x abaixo é baseada <b>exclusivamente</b> no valor do Kit Madeiramento (<b>{fmt(creditCardBase)}</b>).
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[3, 6, 10, 12, 15, 18].map((n, i) => {
                    const res = calculateInstallmentValue(creditCardBase, n);
                    return (
                      <motion.div
                        key={n}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 + i * 0.06 }}
                        className={`rounded-xl p-4 border transition-all duration-300 hover:shadow-md ${
                          n === 18
                            ? 'bg-accent/15 border-accent/30 ring-2 ring-accent/40 shadow-lg'
                            : res.isInterestFree
                            ? 'bg-green-500/10 border-green-500/20'
                            : 'bg-secondary/40 border-secondary/20 hover:bg-secondary/60'
                        }`}
                      >
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${
                          n === 18 ? 'text-accent font-black' : res.isInterestFree ? 'text-green-700 dark:text-green-400' : 'text-foreground/70'
                        }`}>
                          {n}x {res.isInterestFree ? 'sem juros' : 'c/ taxas'}
                        </span>
                        <p className={`font-bold text-xl mt-1 font-display tabular-nums ${
                          n === 18 ? 'text-accent' : res.isInterestFree ? 'text-green-700 dark:text-green-400' : 'text-primary'
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

      {/* Alerta Kit Madeiramento */}
      {state.kitType === 'madeiramento' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="max-w-4xl mx-auto mt-6 px-2"
        >
          <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-amber-800 dark:text-amber-300">
            <span className="text-lg leading-none mt-0.5">⚠️</span>
            <div>
              <strong className="text-xs uppercase font-bold block mb-1">Atenção sobre o Kit Madeiramento:</strong>
              <p className="text-xs leading-relaxed opacity-95">
                Esta modalidade contempla <strong>exclusivamente as madeiras estruturais</strong> da fábrica. Para a conclusão da sua obra, você precisará adquirir por conta própria todos os itens de acabamento e complementares (como portas, janelas, ferragens de fixação, telhas de cobertura, stain de pintura, vidros de esquadrias, drywall, placa cimentícia, fiação elétrica e encanamentos hidráulicos).
              </p>
            </div>
          </div>
        </motion.div>
      )}

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
