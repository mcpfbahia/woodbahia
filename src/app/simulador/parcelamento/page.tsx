"use client";

import { useState, useMemo, useEffect } from "react";
import { 
  ArrowLeft, CreditCard, Info, Calculator, 
  CheckCircle2, Banknote, ShieldCheck, 
  ShoppingBag, Trash2
} from "lucide-react";
import Link from "next/link";
import { Header } from "~/components/layout/Header";
import { Footer } from "~/components/layout/Footer";
import { WhatsAppButton } from "~/components/common/WhatsAppButton";
import { ScrollReveal, StaggerContainer, StaggerItem } from "~/components/common/ScrollReveal";

const TAXAS = {
  1: 3.29,           // 1x (MDR)
  2: 2.47 + 2.64,    // 5.11%
  3: 2.47 + 3.27,    // 5.74%
  4: 2.47 + 3.92,    // 6.39%
  5: 2.47 + 4.65,    // 7.12%
  6: 2.47 + 5.38,    // 7.85%
  7: 2.87 + 6.13,    // 9.00%
  8: 2.87 + 6.90,    // 9.77%
  9: 2.87 + 7.69,    // 10.56%
  10: 2.87 + 8.49,   // 11.36%
  11: 2.87 + 9.32,   // 12.19%
  12: 2.87 + 10.15,  // 13.02%
  13: 2.99 + 11.13,  // 14.12%
  14: 2.99 + 12.01,  // 15.00%
  15: 2.99 + 12.91,  // 15.90%
  16: 2.99 + 13.84,  // 16.83%
  17: 2.99 + 14.77,  // 17.76%
  18: 2.99 + 15.78   // 18.77%
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export default function InstallmentSimulatorPage() {
  const [valorProjeto, setValorProjeto] = useState<number>(10000);
  const [entrada, setEntrada] = useState<number>(0);
  const [parcelasSelecionadas, setParcelasSelecionadas] = useState<number>(18);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const valorFinanciado = Math.max(0, valorProjeto - entrada);

  const tabelaSimulacao = useMemo(() => {
    return Object.entries(TAXAS).map(([parc, taxa]) => {
      const p = parseInt(parc);
      const taxaDecimal = taxa / 100;
      
      const totalNoCartao = valorFinanciado / (1 - taxaDecimal);
      const valorDaParcela = totalNoCartao / p;
      
      return {
        parcelas: p,
        valorDaParcela,
        totalNoCartao,
        taxa,
        jurosTotal: totalNoCartao - valorFinanciado
      };
    });
  }, [valorFinanciado]);

  const simulacaoAtual = useMemo(() => {
    const s = tabelaSimulacao.find(t => t.parcelas === parcelasSelecionadas);
    return s || { valorDaParcela: 0, totalNoCartao: 0, taxa: 0, jurosTotal: 0, parcelas: parcelasSelecionadas };
  }, [tabelaSimulacao, parcelasSelecionadas]);

  const generateWhatsAppParams = () => {
    const telefone = "5571992936290";
    const texto = `Olá! Fiz uma simulação de financiamento no site da Wood Bahia e gostaria de receber uma proposta detalhada.
*Projeto:* ${formatCurrency(valorProjeto)}
*Entrada:* ${formatCurrency(entrada)}
*Parcelamento:* ${parcelasSelecionadas}x de ${formatCurrency(simulacaoAtual.valorDaParcela)}
*Total no Cartão:* ${formatCurrency(simulacaoAtual.totalNoCartao)}`;

    return `https://wa.me/${telefone}?text=${encodeURIComponent(texto)}`;
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background font-sans text-slate-900 selection:bg-primary/20">
      <Header />

      <main className="relative z-10 pb-24 pt-32">
        <div className="container mx-auto px-4 max-w-6xl">
          
          <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-primary/5 to-transparent -z-10" />
          
          <Link
            href="/#pagamento"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para a página inicial
          </Link>

          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary uppercase tracking-wider">
                <CreditCard className="h-4 w-4" /> Parcelamento no Cartão
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary mb-6 leading-tight">
                Simule o Parcelamento do<br className="hidden md:block" /> Seu Projeto
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto md:text-xl">
                Veja quanto você pagará por mês e escolha a melhor forma de pagamento. Você pode simular pagamento <span className="font-semibold text-foreground">com ou sem entrada</span>.
              </p>
            </div>
          </ScrollReveal>

          <div className="bg-card rounded-[2rem] shadow-2xl shadow-slate-200/40 overflow-hidden border border-border mb-20 relative z-10">
            <div className="grid lg:grid-cols-5">
              <div className="lg:col-span-3 p-8 md:p-12">
                <div className="space-y-10">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">
                      <ShoppingBag className="w-4 h-4 text-primary" /> Valor do Projeto (Kit ou Casa)
                    </label>
                    <div className="relative group">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold group-focus-within:text-primary transition-colors text-xl">R$</span>
                      <input 
                        type="number" 
                        value={valorProjeto}
                        onChange={(e) => setValorProjeto(Number(e.target.value))}
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-5 pl-14 pr-6 text-2xl font-black text-slate-800 focus:outline-none focus:border-primary focus:bg-white transition-all shadow-inner"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">
                      <span className="flex items-center gap-2"><Banknote className="w-4 h-4 text-primary" /> Valor da Entrada (Opcional)</span>
                      <span className="text-primary bg-primary/10 px-3 py-1 rounded-lg text-xs tracking-normal">Dobra o limite de aprovação</span>
                    </label>
                    <div className="relative group">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold group-focus-within:text-primary transition-colors text-xl">R$</span>
                      <input 
                        type="number" 
                        value={entrada}
                        onChange={(e) => setEntrada(Number(e.target.value))}
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-5 pl-14 pr-6 text-2xl font-black text-slate-800 focus:outline-none focus:border-primary focus:bg-white transition-all shadow-inner"
                        placeholder="0,00"
                      />
                      {entrada > 0 && (
                        <button 
                          onClick={() => setEntrada(0)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">
                      <span className="flex items-center gap-2"><Calculator className="w-4 h-4 text-primary" /> Número de Parcelas</span>
                      <span className="text-slate-500 text-xs font-medium tracking-normal">Até 18x no cartão</span>
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                      {[3, 6, 10, 12, 15, 18].map((n) => (
                        <button
                          key={n}
                          onClick={() => setParcelasSelecionadas(n)}
                          className={`py-4 rounded-xl font-bold text-lg transition-all border-2 ${parcelasSelecionadas === n ? "bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105" : "bg-white border-slate-100 text-slate-500 hover:border-primary/30 hover:bg-slate-50"}`}
                        >
                          {n}x
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 bg-slate-950 p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -mr-32 -mt-32" />
                <div className="relative z-10 h-full flex flex-col">
                  <div className="mb-10">
                    <p className="text-primary/70 text-xs font-bold uppercase tracking-[0.2em] mb-4">Resultado da Simulação</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-primary text-2xl font-black">{parcelasSelecionadas}x de</span>
                    </div>
                    <div className="text-white text-5xl md:text-6xl font-black tracking-tight my-4">
                      {formatCurrency(simulacaoAtual.valorDaParcela)}
                    </div>
                    <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                      <Info className="w-4 h-4 text-primary" />
                      <p className="text-white/70 text-sm">Taxa da operadora inclusa: <b>{simulacaoAtual.taxa?.toFixed(2)}%</b></p>
                    </div>
                  </div>

                  <div className="space-y-4 mt-auto">
                    <div className="flex justify-between items-center py-4 border-b border-white/10">
                      <span className="text-white/50 text-sm font-medium">Valor Financiado no Cartão</span>
                      <span className="text-white font-bold">{formatCurrency(valorFinanciado)}</span>
                    </div>
                    <div className="flex justify-between items-center py-4 border-b border-white/10">
                      <span className="text-white/50 text-sm font-medium">Total com juros da operadora</span>
                      <span className="text-primary font-black text-xl">{formatCurrency(simulacaoAtual.totalNoCartao)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                       <p className="text-[10px] text-white/30 leading-relaxed">
                        * Simulação baseada nas taxas MDR/Antecipação fornecidas. Sujeito à análise de crédito e disponibilidade de limite no cartão.
                       </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ScrollReveal delay={0.1}>
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6 justify-center mb-24">
              <a 
                href={generateWhatsAppParams()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto bg-green-500 text-white flex items-center justify-center gap-3 px-8 py-5 rounded-2xl font-bold text-lg hover:-translate-y-1 hover:bg-green-600 transition-all shadow-xl shadow-green-500/30"
              >
                <Banknote className="w-6 h-6" />
                Receber proposta detalhada
              </a>
              <a 
                href={generateWhatsAppParams()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto bg-secondary text-white flex items-center justify-center gap-3 px-8 py-5 rounded-2xl font-bold text-lg hover:-translate-y-1 hover:bg-secondary/90 transition-all shadow-xl shadow-secondary/20"
              >
                Solicitar Orçamento no WhatsApp
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="max-w-4xl mx-auto mb-20 bg-card rounded-3xl p-6 md:p-10 shadow-lg border border-border">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Tabela de Parcelamento Completa</h3>
                <p className="text-sm text-slate-500">Mude os valores no painel acima e a tabela será atualizada automaticamente.</p>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-xs border-b border-slate-200">
                    <tr>
                      <th className="p-4 rounded-tl-xl">Condição</th>
                      <th className="p-4">Valor da Parcela</th>
                      <th className="p-4">Taxa Opr.</th>
                      <th className="p-4 text-right rounded-tr-xl">Total no Cartão</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tabelaSimulacao.slice(1).map((opcao) => (
                      <tr 
                        key={opcao.parcelas} 
                        className={`transition-colors hover:bg-primary/5 cursor-pointer ${parcelasSelecionadas === opcao.parcelas ? "bg-primary/10 border-l-4 border-primary" : "border-l-4 border-transparent"}`}
                        onClick={() => setParcelasSelecionadas(opcao.parcelas)}
                      >
                        <td className="p-4 font-bold text-slate-800">{opcao.parcelas}x</td>
                        <td className="p-4 font-bold text-primary">{formatCurrency(opcao.valorDaParcela)}</td>
                        <td className="p-4 text-slate-500">{opcao.taxa.toFixed(2)}%</td>
                        <td className="p-4 text-right font-medium text-slate-700">{formatCurrency(opcao.totalNoCartao)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
             <StaggerItem>
                <div className="bg-primary/5 p-8 rounded-2xl border border-primary/10 h-full">
                  <ShieldCheck className="w-10 h-10 text-primary mb-4" />
                  <h4 className="text-xl font-bold text-slate-800 mb-2">Planeje seu investimento com tranquilidade</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Com o simulador você consegue visualizar exatamente quanto pagará por mês e escolher a melhor forma de pagamento. Sem surpresas ou letras miúdas.
                  </p>
                </div>
             </StaggerItem>
             <StaggerItem>
                <div className="bg-primary/5 p-8 rounded-2xl border border-primary/10 h-full">
                  <CheckCircle2 className="w-10 h-10 text-primary mb-4" />
                  <h4 className="text-xl font-bold text-slate-800 mb-2">Condições transparentes</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    A taxa informada é a do mercado (MDR + Antecipação) repassada pela operadora. Com maior entrada, o saldo a simular no cartão diminiu os juros finais.
                  </p>
                </div>
             </StaggerItem>
          </StaggerContainer>

        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
