"use client";

import { TrendingUp, Coins, TreePine, Waves, Calculator, ChevronRight } from "lucide-react";
import Link from "next/link";
import { ScrollReveal, StaggerContainer, StaggerItem } from "../common/ScrollReveal";

const segments = [
  {
    icon: Coins,
    title: "Investidores de Renda",
    description: "Chalés ideais para quem deseja renda recorrente com locação por temporada como Airbnb ou aluguel tradicional.",
  },
  {
    icon: TrendingUp,
    title: "Investidores de Valorização",
    description: "Projetos pensados para construção rápida e venda com valorização imobiliária em regiões turísticas.",
  },
  {
    icon: TreePine,
    title: "Campo e Áreas Rurais",
    description: "Casas e chalés de madeira ideais para sítios, chácaras e fazendas com integração total à natureza.",
  },
  {
    icon: Waves,
    title: "Praia e Litoral",
    description: "Chalés e casas de madeira ideais para casas de veraneio e projetos turísticos em regiões litorâneas.",
  },
];

export const UseCasesSection = () => {
  return (
    <section id="objetivos" className="bg-muted/30 py-20 md:py-32">
      <div className="container mx-auto px-4">
        <ScrollReveal className="mb-16 max-w-3xl mx-auto text-center">
          <span className="mb-6 inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary text-center">
            Aplicações e Versatilidade
          </span>
          <h2 className="section-title mb-6 text-4xl font-bold leading-tight md:text-5xl text-foreground">
            Projetos Ideais para <br />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent italic">
              Diferentes Objetivos
            </span>
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Nossos <strong className="text-foreground">chalés de madeira</strong> e <strong className="text-foreground">casas pré-fabricadas</strong> são projetados para máxima versatilidade. Seja para <strong className="text-foreground">investimento em Airbnb</strong>, turismo sustentável, casas de campo ou refúgios na praia, entregamos a solução perfeita para o seu terreno.
          </p>
        </ScrollReveal>

        <StaggerContainer className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-4">
          {segments.map((segment, index) => (
            <StaggerItem key={index} index={index} className="h-full">
              <article className="group h-full rounded-3xl border border-border/50 bg-background p-8 transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:-translate-y-2">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <segment.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-4 font-serif text-2xl font-bold text-foreground">
                  {segment.title}
                </h3>
                <p className="leading-relaxed text-muted-foreground font-medium">
                  {segment.description}
                </p>
                <Link
                  href="/simulador"
                  className="mt-6 flex items-center justify-between group-hover:text-primary transition-colors font-bold text-sm"
                >
                  <span className="flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    Simule o preço do seu chalé de madeira
                  </span>
                  <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </article>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};
