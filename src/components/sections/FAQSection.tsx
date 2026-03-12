"use client";

import { useEffect, useState } from "react";
import { ChevronDown, MessageCircleQuestion } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { faqItems } from "~/lib/data";
import { ScrollReveal } from "../common/ScrollReveal";

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
  index: number;
}

const FAQItem = ({
  question,
  answer,
  isOpen,
  onClick,
  index,
}: FAQItemProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    className="group"
  >
    <button
      onClick={onClick}
      className={`flex w-full items-start gap-3 rounded-xl border border-border p-4 text-left transition-all duration-300 md:gap-4 md:rounded-2xl md:p-5 lg:p-6 ${
        isOpen
          ? "bg-primary text-primary-foreground shadow-lg"
          : "bg-card hover:bg-card/80"
      }`}
    >
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md font-bold transition-colors md:h-8 md:w-8 md:rounded-lg md:text-sm ${
          isOpen ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
        }`}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="min-w-0 flex-1">
        <h3
          className={`font-serif text-sm font-semibold pr-6 md:pr-8 md:text-base lg:text-lg ${
            isOpen ? "text-white" : "text-foreground"
          }`}
        >
          {question}
        </h3>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <p className="mt-2 text-xs leading-relaxed text-white/80 md:mt-3 md:text-sm lg:text-base">
                {answer}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <ChevronDown
        className={`h-4 w-4 shrink-0 transition-transform duration-300 md:h-5 md:w-5 ${
          isOpen ? "rotate-180 text-white" : "text-muted-foreground"
        }`}
      />
    </button>
  </motion.div>
);

export const FAQSection = () => {
  const [mounted, setMounted] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <section id="faq" className="bg-background py-16 md:py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl h-64 flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="faq" className="bg-background py-16 md:py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="mb-8 text-center md:mb-12 lg:mb-16">
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary md:mb-4 md:gap-2 md:px-4 md:py-2 md:text-sm">
              <MessageCircleQuestion className="h-3.5 w-3.5 md:h-4 md:w-4" />
              Tire suas dúvidas
            </span>
            <h2 className="section-title text-2xl font-bold sm:text-3xl md:text-4xl lg:text-5xl">
              Perguntas Frequentes sobre Chalés de Madeira e Casas Pré-Fabricadas
            </h2>
            <p className="mx-auto mt-4 max-w-2xl px-2 text-sm text-muted-foreground md:text-base lg:text-lg">
              Respostas para as principais dúvidas sobre nossos <strong className="text-foreground">chalés de madeira</strong> e <strong className="text-foreground">casas pré-fabricadas</strong>, incluindo prazos de construção, materiais utilizados e formas de pagamento.
            </p>
          </div>

          <div className="mx-auto max-w-3xl">
            <div className="space-y-2 md:space-y-3">
              {faqItems.map((item, index) => (
                <FAQItem
                  key={index}
                  question={item.question}
                  answer={item.answer}
                  isOpen={openIndex === index}
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  index={index}
                />
              ))}
            </div>

            <ScrollReveal delay={0.2}>
              <div className="mt-8 rounded-xl border border-border bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 p-4 text-center md:mt-12 md:rounded-2xl md:p-6 lg:p-8">
                <p className="mb-3 text-sm text-muted-foreground md:mb-4 md:text-base">
                  Fale com um especialista e tire todas as dúvidas sobre chalés de madeira, casas pré-fabricadas e projetos personalizados.
                </p>
                <a
                  href="https://wa.me/5571992936290?text=Olá! Gostaria de tirar dúvidas sobre os chalés de madeira e casas pré-fabricadas."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-cta inline-flex text-sm md:text-base"
                >
                  Falar com Especialista
                </a>
              </div>
            </ScrollReveal>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
