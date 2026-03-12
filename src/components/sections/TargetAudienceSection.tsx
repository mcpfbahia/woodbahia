"use client";

import { TrendingUp, Building, TreePine, Waves } from "lucide-react";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from "../common/ScrollReveal";

const targets = [
  {
    icon: TrendingUp,
    title: "Investidores de Renda",
    description:
      "Para quem busca renda recorrente com locação, seja por temporada (Airbnb) ou longo prazo.",
  },
  {
    icon: Building,
    title: "Investidores de Valorização",
    description:
      "Para quem deseja construir com rapidez para vender o imóvel pronto, focado em alta valorização.",
  },
  {
    icon: TreePine,
    title: "Campo e Áreas Rurais",
    description:
      "Sítios, chácaras e fazendas. Perfeito para quem quer integração total com a natureza.",
  },
  {
    icon: Waves,
    title: "Praia e Litoral",
    description:
      "Casas de veraneio e projetos turísticos em regiões litorâneas, com materiais resistentes à maresia.",
  },
];

export const TargetAudienceSection = () => {
  return (
    <section className="bg-muted/30 py-20 md:py-32">
      <div className="container mx-auto px-4">
        <ScrollReveal className="mb-16 text-center">
          <span className="mb-6 inline-block rounded-full bg-secondary/10 px-4 py-2 text-sm font-medium text-secondary">
            Para quem é
          </span>
          <h2 className="section-title text-3xl font-bold md:text-5xl text-[#4A2B1D] mb-6 tracking-tight">
            Projetos{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent italic">
              ideais para:
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg lg:text-xl mt-4">
            Soluções inteligentes para diferentes perfis de investimento e estilos de vida.
          </p>
        </ScrollReveal>

        <StaggerContainer className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-4">
          {targets.map((target, index) => (
            <StaggerItem key={index} index={index} className="h-full">
              <div className="group h-full rounded-2xl border border-border/50 bg-background p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-transform duration-300 group-hover:scale-110">
                  <target.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-3 font-serif text-xl font-bold text-foreground">
                  {target.title}
                </h3>
                <p className="leading-relaxed text-muted-foreground">
                  {target.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};
