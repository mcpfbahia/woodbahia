"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle,
  Home,
  TreePine,
  TrendingUp,
  MapPin,
  Clock,
  Banknote,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal, StaggerContainer, StaggerItem } from "../common/ScrollReveal";
import { Input } from "../ui/input";

const objectives = [
  {
    id: "moradia",
    label: "Moradia",
    icon: Home,
    description: "Para morar definitivamente",
  },
  {
    id: "lazer",
    label: "Casa de campo",
    icon: TreePine,
    description: "Lazer e descanso",
  },
  {
    id: "investimento",
    label: "Investimento",
    icon: TrendingUp,
    description: "Aluguel / Airbnb",
  },
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

  if (!mounted) {
    return (
      <section
        id="contato"
        className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16 md:py-28"
      >
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl h-96 flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        </div>
      </section>
    );
  }

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.whatsapp && formData.objective) {
      setStep(2);
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Nota: No projeto original havia uma função saveLead no Firebase.
      // Por enquanto, faremos apenas o redirecionamento para o WhatsApp.
      // Futuramente, isso pode ser integrado com um procedimento TRPC para salvar no banco.

      const message = encodeURIComponent(
        `🏡 *Nova Solicitação - Wood Bahia*\n\n` +
          `*Nome:* ${formData.name}\n` +
          `*WhatsApp:* ${formData.whatsapp}\n` +
          `*Objetivo:* ${
            objectives.find((o) => o.id === formData.objective)?.label
          }\n\n` +
          `*Possui terreno:* ${
            landOptions.find((l) => l.id === formData.hasLand)?.label
          }\n` +
          `*Localização:* ${formData.location || "Não informado"}\n` +
          `*Prazo:* ${
            timelineOptions.find((t) => t.id === formData.timeline)?.label
          }\n` +
          `*Investimento:* ${
            budgetOptions.find((b) => b.id === formData.budget)?.label
          }`
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

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7)
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(
      7,
      11
    )}`;
  };

  if (isSubmitted) {
    return (
      <section
        id="contato"
        className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20 md:py-28"
      >
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-lg text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10"
            >
              <CheckCircle className="h-10 w-10 text-green-500" />
            </motion.div>
            <h2 className="font-serif text-2xl font-bold text-foreground md:text-3xl">
              Solicitação Enviada!
            </h2>
            <p className="mt-4 text-muted-foreground">
              Nossa equipe entrará em contato pelo WhatsApp em breve para
              apresentar os modelos ideais para você.
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
              className="mt-8 rounded-xl border border-border px-8 py-3 font-medium transition-colors hover:bg-muted"
            >
              Nova Solicitação
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="contato"
      className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16 md:py-28"
    >
      <div className="container mx-auto px-4">
        <ScrollReveal className="mb-10 text-center">
          <span className="mb-4 inline-block rounded-full bg-secondary/10 px-4 py-2 text-sm font-medium text-secondary">
            Orçamento Personalizado
          </span>
          <h2 className="section-title text-3xl font-bold md:text-4xl lg:text-5xl">
            Encontre o modelo ideal
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground md:text-lg">
            Responda algumas perguntas rápidas e receba uma proposta
            personalizada no seu WhatsApp
          </p>
        </ScrollReveal>

        <div className="mx-auto max-w-2xl">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Etapa {step} de 2
              </span>
              <span className="text-sm text-muted-foreground">
                {step === 1 ? "Dados básicos" : "Qualificação"}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full bg-gradient-to-r from-secondary to-primary"
                initial={{ width: "50%" }}
                animate={{ width: step === 1 ? "50%" : "100%" }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <div className="glass-strong rounded-2xl p-6 md:p-10">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.form
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleStep1Submit}
                  className="space-y-6"
                >
                  <StaggerContainer className="space-y-6">
                    <StaggerItem index={0}>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">
                          Seu nome *
                        </label>
                        <Input
                          type="text"
                          placeholder="Como podemos te chamar?"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="h-12 border-border/50 bg-background/50 focus:border-secondary"
                          required
                        />
                      </div>
                    </StaggerItem>

                    <StaggerItem index={1}>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">
                          WhatsApp *
                        </label>
                        <Input
                          type="tel"
                          placeholder="(00) 00000-0000"
                          value={formData.whatsapp}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              whatsapp: formatPhone(e.target.value),
                            })
                          }
                          className="h-12 border-border/50 bg-background/50 focus:border-secondary"
                          required
                          maxLength={15}
                        />
                      </div>
                    </StaggerItem>

                    <StaggerItem index={2}>
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-foreground">
                          Qual seu objetivo com o chalé? *
                        </label>
                        <div className="grid gap-3">
                          {objectives.map((obj) => (
                            <button
                              key={obj.id}
                              type="button"
                              onClick={() =>
                                setFormData({ ...formData, objective: obj.id })
                              }
                              className={`flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all duration-200 ${
                                formData.objective === obj.id
                                  ? "border-secondary bg-secondary/10"
                                  : "border-border bg-background/50 hover:border-secondary/50"
                              }`}
                            >
                              <div
                                className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                                  formData.objective === obj.id
                                    ? "bg-secondary text-white"
                                    : "bg-muted"
                                }`}
                              >
                                <obj.icon className="h-5 w-5" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-foreground">
                                  {obj.label}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {obj.description}
                                </p>
                              </div>
                              {formData.objective === obj.id && (
                                <CheckCircle className="h-5 w-5 shrink-0 text-secondary" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    </StaggerItem>

                    <StaggerItem index={3}>
                      <button
                        type="submit"
                        disabled={
                          !formData.name || !formData.whatsapp || !formData.objective
                        }
                        className="btn-cta w-full disabled:opacity-50"
                      >
                        Ver modelos ideais para mim
                        <ArrowRight className="h-5 w-5" />
                      </button>
                    </StaggerItem>
                  </StaggerContainer>
                </motion.form>
              ) : (
                <motion.form
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleFinalSubmit}
                  className="space-y-6"
                >
                  <div>
                    <label className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                      <MapPin className="h-4 w-4 text-secondary" />
                      Você já possui terreno?
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {landOptions.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, hasLand: opt.id })
                          }
                          className={`rounded-xl border-2 p-3 text-sm font-medium transition-all ${
                            formData.hasLand === opt.id
                              ? "border-secondary bg-secondary/10 text-secondary"
                              : "border-border bg-background/50 text-muted-foreground hover:border-secondary/50"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      Cidade / Estado do terreno ou obra
                    </label>
                    <Input
                      type="text"
                      placeholder="Ex: Salvador, BA"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      className="h-12 border-border/50 bg-background/50 focus:border-secondary"
                    />
                  </div>

                  <div>
                    <label className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                      <Clock className="h-4 w-4 text-secondary" />
                      Prazo para construir
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {timelineOptions.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, timeline: opt.id })
                          }
                          className={`rounded-xl border-2 p-3 text-sm font-medium transition-all ${
                            formData.timeline === opt.id
                              ? "border-secondary bg-secondary/10 text-secondary"
                              : "border-border bg-background/50 text-muted-foreground hover:border-secondary/50"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                      <Banknote className="h-4 w-4 text-secondary" />
                      Faixa de investimento prevista
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {budgetOptions.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, budget: opt.id })
                          }
                          className={`rounded-xl border-2 p-3 text-sm font-medium transition-all ${
                            formData.budget === opt.id
                              ? "border-secondary bg-secondary/10 text-secondary"
                              : "border-border bg-background/50 text-muted-foreground hover:border-secondary/50"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="rounded-xl border-2 border-border px-6 py-3 font-medium text-muted-foreground transition-colors hover:bg-muted/50"
                    >
                      Voltar
                    </button>
                    <button
                      type="submit"
                      disabled={
                        !formData.hasLand ||
                        !formData.timeline ||
                        !formData.budget ||
                        isSaving
                      }
                      className="btn-cta flex-1 disabled:opacity-50"
                    >
                      {isSaving
                        ? "Processando..."
                        : "Receber proposta no WhatsApp"}
                      {!isSaving && <ArrowRight className="h-5 w-5" />}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            * Custo adicional para projetos personalizados
          </p>
        </div>
      </div>
    </section>
  );
};
