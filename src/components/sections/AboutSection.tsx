
"use client";

import { TreePine, Shield, Heart, Instagram } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "../common/ScrollReveal";

export const AboutSection = () => {
  return (
    <section
      id="sobre"
      className="relative overflow-hidden bg-card py-20 md:py-32"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-pattern opacity-50" />

      <div className="container relative z-10 mx-auto px-4">
        <ScrollReveal>
          <div className="rounded-3xl border border-border/50 bg-background p-6 shadow-lg md:p-12 lg:p-16">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Content */}
              <div>
                <span className="mb-6 inline-block rounded-full bg-secondary/10 px-4 py-2 text-sm font-medium text-secondary">
                  Sobre Nós
                </span>                <h2 className="section-title text-3xl font-bold md:text-5xl">
                  Experiência em Casas e{" "}
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent italic">
                    Chalés de Madeira na Bahia
                  </span>
                </h2>
                <p className="mb-6 font-serif text-xl font-medium text-foreground">
                  Especialistas em Chalés A-Frame e Casas Pré-Fabricadas de Madeira
                </p>
                <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                  A <strong className="text-foreground">Wood Bahia</strong> é especialista em <strong className="text-foreground">chalés de madeira</strong> e <strong className="text-foreground">casas pré-fabricadas de madeira</strong> feitas com pinus tratado. Nossas soluções são ideais para <strong className="text-foreground">investimento em Airbnb</strong>, casas de campo, casas de praia e chalés turísticos, unindo valorização imobiliária e bem-estar.
                </p>
                <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                  Atendemos o <strong className="text-foreground">Litoral Norte da Bahia</strong>, Salvador, <strong className="text-foreground">Chapada Diamantina</strong>, Interior da Bahia e Sergipe, levando qualidade e logística eficiente para todo o estado.
                </p>
                <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                  Nossas construções oferecem rapidez de execução, conforto térmico absoluto, estética rústica-moderna e a durabilidade superior da madeira tratada, transformando terrenos em refúgios sustentáveis rapidamente.
                </p>
                <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
                  Orgulhamo-nos de projetos entregues em <strong className="text-foreground">Praia do Forte, Guarajuba, Imbassaí, Costa do Sauípe, Baixios e Subaúma</strong>, onde a <strong className="text-foreground">cabana de madeira</strong> de alto padrão é um diferencial de mercado.
                </p>

                <StaggerContainer className="flex flex-col gap-4">
                  <StaggerItem index={0}>
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-pink-500/10 transition-colors group-hover:bg-pink-500/20">
                        <Instagram className="h-6 w-6 text-pink-500" />
                      </div>
                      <div>
                        <span className="block text-xl font-bold text-foreground">+45k seguidores no Instagram</span>
                      </div>
                    </div>
                  </StaggerItem>
                  <StaggerItem index={1}>
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                        <TreePine className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <span className="block text-lg font-bold text-foreground">Especialistas em construção em madeira</span>
                      </div>
                    </div>
                  </StaggerItem>
                  <StaggerItem index={2}>
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary/10 transition-colors group-hover:bg-secondary/20">
                        <Shield className="h-6 w-6 text-secondary" />
                      </div>
                      <span className="font-bold text-foreground">Madeira tratada e certificada</span>
                    </div>
                  </StaggerItem>
                  <StaggerItem index={3}>
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 transition-colors group-hover:bg-amber-500/20">
                        <Heart className="h-6 w-6 text-amber-500" />
                      </div>
                      <span className="font-bold text-foreground">Atendimento humano e consultivo</span>
                    </div>
                  </StaggerItem>
                </StaggerContainer>
              </div>

              {/* Stats Grid */}
              <StaggerContainer className="grid grid-cols-2 gap-4 md:gap-6">
                <StaggerItem index={0}>
                  <div className="rounded-2xl border border-border bg-background/50 p-6 text-center transition-all duration-300 hover:shadow-lg h-full">
                    <p className="mb-2 font-serif text-4xl font-bold text-primary md:text-5xl">
                      +15
                    </p>
                    <p className="font-medium text-muted-foreground text-sm">
                      Anos de garantia
                    </p>
                  </div>
                </StaggerItem>
                <StaggerItem index={1}>
                  <div className="rounded-2xl border border-border bg-background/50 p-6 text-center transition-all duration-300 hover:shadow-lg h-full">
                    <p className="mb-2 font-serif text-4xl font-bold text-primary md:text-5xl">
                      +100
                    </p>
                    <p className="font-medium text-muted-foreground text-sm">
                      Projetos realizados
                    </p>
                  </div>
                </StaggerItem>
                <StaggerItem index={2}>
                  <div className="rounded-2xl border border-border bg-background/50 p-6 text-center transition-all duration-300 hover:shadow-lg h-full">
                    <p className="mb-2 font-serif text-4xl font-bold text-primary md:text-5xl">
                      45k
                    </p>
                    <p className="font-medium text-muted-foreground text-sm">
                      Seguidores Instagram
                    </p>
                  </div>
                </StaggerItem>
                <StaggerItem index={3}>
                  <div className="rounded-2xl border border-border bg-background/50 p-6 text-center transition-all duration-300 hover:shadow-lg h-full">
                    <p className="mb-2 font-serif text-4xl font-bold text-primary md:text-5xl">
                      100%
                    </p>
                    <p className="font-medium text-muted-foreground text-sm">
                      Foco em madeira
                    </p>
                  </div>
                </StaggerItem>
              </StaggerContainer>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
