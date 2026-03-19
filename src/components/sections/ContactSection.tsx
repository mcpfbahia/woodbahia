"use client";

import React, { useState, useEffect } from 'react';
import { 
  Home, 
  TreePine, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle, 
  MapPin, 
  Clock, 
  Banknote,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../common/ScrollReveal';
import { toast } from 'sonner';
import { saveLead } from '~/lib/leads';

const objectives = [
  {
    id: 'moradia',
    icon: Home,
    titulo: 'Moradia',
    descricao: 'Para morar definitivamente'
  },
  {
    id: 'campo',
    icon: TreePine,
    titulo: 'Casa de campo',
    descricao: 'Lazer e descanso'
  },
  {
    id: 'investimento',
    icon: TrendingUp,
    titulo: 'Investimento',
    descricao: 'Aluguel / Airbnb'
  }
];

const landOptions = [
  { id: "sim", label: "Sim, já possuo" },
  { id: "nao", label: "Não, ainda não" },
  { id: "negociando", label: "Em negociação" },
];

const timelineOptions = [
  { id: "3m", label: "Até 3 meses" },
  { id: "6m", label: "3 a 6 meses" },
  { id: "12m", label: "6 a 12 meses" },
  { id: "pesquisando", label: "Apenas pesquisando" },
];

const budgetOptions = [
  { id: "40k", label: "Até R$ 40 mil" },
  { id: "70k", label: "R$ 40 a 70 mil" },
  { id: "100k", label: "R$ 70 a 100 mil" },
  { id: "100k+", label: "Acima de R$ 100 mil" },
];

interface FormData {
  name: string;
  whatsapp: string;
  objective: string;
  hasLand: string;
  location: string;
  timeline: string;
  budget: string;
}

export const ContactSection = () => {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);
  const successRef = React.useRef<HTMLElement>(null);
  
  const [formData, setFormData] = useState<FormData>({
    name: "",
    whatsapp: "",
    objective: "",
    hasLand: "",
    location: "",
    timeline: "",
    budget: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isSubmitted && successRef.current) {
      successRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isSubmitted]);

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7)
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error("Por favor, preencha o seu nome.");
      return;
    }
    if (!formData.whatsapp || formData.whatsapp.length < 14) {
      toast.error("Por favor, insira um WhatsApp válido.");
      return;
    }
    if (!formData.objective) {
      toast.error("Por favor, selecione o seu objetivo com o chalé.");
      return;
    }
    setStep(2);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.hasLand) {
      toast.error("Por favor, informe se já possui terreno.");
      return;
    }
    if (!formData.timeline) {
      toast.error("Por favor, selecione o prazo para construir.");
      return;
    }
    if (!formData.budget) {
      toast.error("Por favor, informe a faixa de investimento prevista.");
      return;
    }

    setIsSaving(true);

    try {
      const objectiveTitle = objectives.find((o) => o.id === formData.objective)?.titulo;
      const landLabel = landOptions.find((l) => l.id === formData.hasLand)?.label;
      const timelineLabel = timelineOptions.find((t) => t.id === formData.timeline)?.label;
      const budgetLabel = budgetOptions.find((b) => b.id === formData.budget)?.label;

      const messageContent = 
        `Objetivo: ${objectiveTitle}\n` +
        `Possui terreno: ${landLabel}\n` +
        `Localização: ${formData.location || "Não informado"}\n` +
        `Prazo: ${timelineLabel}\n` +
        `Investimento: ${budgetLabel}`;

      // Salva no banco de dados primeiro
      await saveLead({
        name: formData.name,
        phone: formData.whatsapp,
        source: 'contato',
        message: messageContent,
        detalhes: formData
      });

      const message = encodeURIComponent(
        `🏡 *Nova Solicitação - Wood Bahia*\n\n` +
        `*Nome:* ${formData.name}\n` +
        `*WhatsApp:* ${formData.whatsapp}\n` +
        `*Objetivo:* ${objectiveTitle}\n\n` +
        `*Possui terreno:* ${landLabel}\n` +
        `*Localização:* ${formData.location || "Não informado"}\n` +
        `*Prazo:* ${timelineLabel}\n` +
        `*Investimento:* ${budgetLabel}`
      );

      const whatsappNumber = "5571992936290";
      window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
      setIsSubmitted(true);
    } catch (error) {
      console.error("Falha ao processar solicitação:", error);
      setIsSubmitted(true);
    } finally {
      setIsSaving(false);
    }
  };

  if (!mounted) return null;

  if (isSubmitted) {
    return (
      <section ref={successRef} id="contato" className="w-full bg-[#FAF8F5] py-20 lg:py-28 flex flex-col items-center px-4">
        <div className="mx-auto max-w-lg text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10"
          >
            <CheckCircle className="h-10 w-10 text-green-500" />
          </motion.div>
          <h2 className="text-2xl font-bold text-[#4A2B1D] md:text-3xl">
            Solicitação Enviada!
          </h2>
          <p className="mt-4 text-[#735F53]">
            Nossa equipe entrará em contato pelo WhatsApp em breve para apresentar os modelos ideais para você.
          </p>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setStep(1);
              setFormData({
                name: "",
                whatsapp: "",
                objective: "",
                hasLand: "",
                location: "",
                timeline: "",
                budget: "",
              });
            }}
            className="btn-cta bg-white !text-[#4A2B1D] hover:!bg-[#EFE8DF] border border-[#EFE8DF] !shadow-none !translate-y-0"
          >
            Nova Solicitação
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="contato" className="w-full bg-[#FAF8F5] py-20 lg:py-28 flex flex-col items-center px-4 sm:px-6">
      
      {/* Cabeçalho Padronizado */}
      <ScrollReveal className="text-center mb-10">
        <span className="mb-6 inline-block rounded-full bg-secondary/10 px-4 py-2 text-sm font-medium text-secondary">
          Orçamento Personalizado
        </span>
        <h2 className="text-3xl font-bold md:text-5xl text-[#4A2B1D] mb-6 tracking-tight">
          Receba sua <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent italic">Proposta</span>
        </h2>
        <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg lg:text-xl mt-4">
          Responda algumas perguntas rápidas e receba uma proposta personalizada no seu WhatsApp.
        </p>
      </ScrollReveal>

      {/* Container Principal do Formulário */}
      <div className="w-full max-w-2xl">
        
        {/* Barra de Progresso */}
        <div className="flex justify-between text-sm font-medium text-[#735F53] mb-3 px-2">
          <span>Etapa {step} de 2</span>
          <span>{step === 1 ? "Dados básicos" : "Qualificação"}</span>
        </div>
        <div className="w-full h-2 bg-[#EFE8DF] rounded-full mb-8 overflow-hidden">
          <motion.div 
            className="h-full bg-[#B06D46] rounded-full"
            initial={{ width: "50%" }}
            animate={{ width: step === 1 ? "50%" : "100%" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>

        {/* Cartão Branco do Formulário */}
        <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form 
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6" 
                onSubmit={handleStep1Submit}
              >
                
                {/* Input: Nome */}
                <div className="space-y-2">
                  <label htmlFor="nome" className="block text-sm font-bold text-[#4A2B1D]">
                    Seu nome *
                  </label>
                  <input 
                    type="text" 
                    id="nome"
                    placeholder="Como podemos te chamar?"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#EFE8DF] text-[#4A2B1D] px-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B06D46] focus:border-transparent transition-all placeholder:text-[#A89F96]"
                    required
                  />
                </div>

                {/* Input: WhatsApp */}
                <div className="space-y-2">
                  <label htmlFor="whatsapp" className="block text-sm font-bold text-[#4A2B1D]">
                    WhatsApp *
                  </label>
                  <input 
                    type="tel" 
                    id="whatsapp"
                    placeholder="(00) 00000-0000"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: formatPhone(e.target.value) })}
                    className="w-full bg-[#FAF8F5] border border-[#EFE8DF] text-[#4A2B1D] px-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B06D46] focus:border-transparent transition-all placeholder:text-[#A89F96]"
                    required
                  />
                </div>

                {/* Seleção de Objetivo */}
                <div className="space-y-3 pt-4">
                  <label className="block text-sm font-bold text-[#4A2B1D] mb-2">
                    Qual seu objetivo com o chalé? *
                  </label>
                  
                  <div className="space-y-3">
                    {objectives.map((opcao) => (
                      <div 
                        key={opcao.id}
                        onClick={() => setFormData({ ...formData, objective: opcao.id })}
                        className={`
                          flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-300
                          ${formData.objective === opcao.id 
                            ? 'bg-[#FDFBF9] border-[#B06D46] shadow-sm' 
                            : 'bg-[#FAF8F5] border-[#EFE8DF] hover:border-[#D5C1B3]'
                          }
                        `}
                      >
                        <div className={`
                          w-12 h-12 rounded-xl flex items-center justify-center transition-colors
                          ${formData.objective === opcao.id ? 'bg-[#F2E6DD]' : 'bg-[#EFE8DF]'}
                        `}>
                          <opcao.icon className={`w-6 h-6 ${formData.objective === opcao.id ? 'text-[#B06D46]' : 'text-[#735F53]'}`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-[#4A2B1D]">{opcao.titulo}</h4>
                          <p className="text-sm text-[#735F53]">{opcao.descricao}</p>
                        </div>
                        {formData.objective === opcao.id && (
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-[#B06D46]" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Botão de Submissão Passo 1 */}
                <button 
                  type="submit"
                  disabled={!formData.name || !formData.whatsapp || !formData.objective}
                  className="btn-cta w-full"
                >
                  <span>Ver modelos ideais para mim</span>
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>

              </motion.form>
            ) : (
              <motion.form 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8" 
                onSubmit={handleFinalSubmit}
              >
                {/* Terreno */}
                <div>
                  <label className="mb-4 flex items-center gap-2 text-sm font-bold text-[#4A2B1D]">
                    <MapPin className="h-4 w-4 text-[#B06D46]" />
                    Você já possui terreno?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {landOptions.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, hasLand: opt.id })}
                        className={`rounded-xl border p-4 text-sm font-bold transition-all ${
                          formData.hasLand === opt.id
                            ? "bg-[#FDFBF9] border-[#B06D46] text-[#B06D46] shadow-sm"
                            : "bg-[#FAF8F5] border-[#EFE8DF] text-[#735F53] hover:border-[#D5C1B3]"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Localização */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-[#4A2B1D]">
                    Cidade / Estado do terreno ou obra
                  </label>
                  <input 
                    type="text" 
                    placeholder="Ex: Salvador, BA"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#EFE8DF] text-[#4A2B1D] px-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B06D46] focus:border-transparent transition-all placeholder:text-[#A89F96]"
                  />
                </div>

                {/* Prazo */}
                <div>
                  <label className="mb-4 flex items-center gap-2 text-sm font-bold text-[#4A2B1D]">
                    <Clock className="h-4 w-4 text-[#B06D46]" />
                    Prazo para construir
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {timelineOptions.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, timeline: opt.id })}
                        className={`rounded-xl border p-4 text-sm font-bold transition-all ${
                          formData.timeline === opt.id
                            ? "bg-[#FDFBF9] border-[#B06D46] text-[#B06D46] shadow-sm"
                            : "bg-[#FAF8F5] border-[#EFE8DF] text-[#735F53] hover:border-[#D5C1B3]"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Faixa de Investimento */}
                <div>
                  <label className="mb-4 flex items-center gap-2 text-sm font-bold text-[#4A2B1D]">
                    <Banknote className="h-4 w-4 text-[#B06D46]" />
                    Faixa de investimento prevista
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {budgetOptions.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, budget: opt.id })}
                        className={`rounded-xl border p-4 text-sm font-bold transition-all ${
                          formData.budget === opt.id
                            ? "bg-[#FDFBF9] border-[#B06D46] text-[#B06D46] shadow-sm"
                            : "bg-[#FAF8F5] border-[#EFE8DF] text-[#735F53] hover:border-[#D5C1B3]"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Botões Passo 2 */}
                <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="rounded-xl border-2 border-[#EFE8DF] px-8 py-5 font-bold text-[#735F53] transition-all hover:bg-stone-50"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    disabled={!formData.hasLand || !formData.timeline || !formData.budget || isSaving}
                    className="btn-cta flex-1"
                  >
                    {isSaving ? "Processando..." : "Receber proposta no WhatsApp"}
                    {!isSaving && <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />}
                  </button>
                </div>

              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Rodapé do Formulário */}
        <p className="text-center text-xs text-[#8A6B5B] mt-6">
          * Custo adicional para projetos personalizados
        </p>

      </div>
    </section>
  );
};
