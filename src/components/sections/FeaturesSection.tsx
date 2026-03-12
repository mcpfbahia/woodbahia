
"use client";

import { Hammer, Zap, ClipboardCheck, TrendingUp } from "lucide-react";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from "../common/ScrollReveal";

const features = [
  {
    icon: Hammer,
    title: "Sistema Construtivo Racional",
    description:
      "Processo industrializado que reduz desperdícios e garante precisão milimétrica na montagem da sua casa.",
  },
  {
    icon: Zap,
    title: "Execução Mais Rápida",
    description:
      "Sua obra pronta em tempo recorde. Nosso método construtivo acelera a entrega sem abrir mão da qualidade.",
  },
  {
    icon: ClipboardCheck,
    title: "Manutenção Previsível",
    description:
      "Madeira tratada e acabamentos duráveis. Cuidados simples e programados garantem a longevidade do imóvel.",
  },
  {
    icon: TrendingUp,
    title: "Excelente Custo-Benefício",
    description:
      "Investimento inteligente com alta valorização. Economia na obra e retorno garantido na revenda ou locação.",
  },
];

export const FeaturesSection = () => {
  return (
    <section className="relative overflow-hidden bg-background py-20 md:py-32">
      <div className="container mx-auto px-4">
        <ScrollReveal className="mb-16 text-center">
          <span className="mb-6 inline-block rounded-full bg-secondary/10 px-4 py-2 text-sm font-medium text-secondary">
            Diferenciais Técnicos
          </span>
          <h2 className="section-title text-3xl font-bold md:text-5xl text-[#4A2B1D] mb-6 tracking-tight">
            Por que escolher
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent italic">
              {" "}
              madeira?
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg lg:text-xl mt-4">
            Tecnologia e eficiência para quem busca um investimento sólido e uma construção sem dores de cabeça.
          </p>
        </ScrollReveal>

        <StaggerContainer className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <StaggerItem key={feature.title} index={index}>
              <div className="group h-full rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-lg">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 transition-transform group-hover:scale-110">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-3 font-serif text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};
