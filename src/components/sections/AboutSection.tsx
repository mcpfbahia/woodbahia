
"use client";

import Image from "next/image";
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
              {/* Lado Esquerdo: Conteúdo Textual Otimizado */}
              <div className="space-y-8">
                <div>
                  <span className="mb-6 inline-block rounded-full bg-secondary/10 px-4 py-2 text-sm font-semibold text-secondary">
                    Nossa Essência
                  </span>
                  <h2 className="section-title mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl text-foreground">
                    Experiência em Casas e{" "}
                    <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent italic">
                      Chalés de Madeira na Bahia
                    </span>
                  </h2>
                  <h3 className="mb-8 font-serif text-xl font-medium text-muted-foreground md:text-2xl">
                    Especialistas em Chalés A-Frame e Casas Pré-Fabricadas de Madeira
                  </h3>
                  
                  <div className="space-y-6 text-lg leading-relaxed text-muted-foreground/90">
                    <p>
                      A <strong className="text-foreground">Wood Bahia</strong> é referência em <strong className="text-foreground">chalés de madeira</strong> de alto padrão. Nossas soluções de <strong className="text-foreground">pinus tratado</strong> são ideais para <strong className="text-foreground">investimento em Airbnb</strong>, lazer e moradia sustentável.
                    </p>
                    <p>
                      Atendemos do <strong className="text-foreground">Litoral Norte da Bahia</strong> à <strong className="text-foreground">Chapada Diamantina</strong> e Sergipe, entregando construções rápidas, duráveis e com estética premium.
                    </p>
                  </div>
                </div>

                {/* Diferenciais em Grid Compacto no Lado Esquerdo */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  {[
                    { icon: Instagram, label: "+45k seguidores", sub: "no Instagram", color: "bg-pink-500/10 text-pink-500" },
                    { icon: TreePine, label: "Madeira Certificada", sub: "Pinus Autoclavado", color: "bg-primary/10 text-primary" },
                    { icon: Shield, label: "Especialistas", sub: "Construção em madeira", color: "bg-secondary/10 text-secondary" },
                    { icon: Heart, label: "Consultivo", sub: "Atendimento humano", color: "bg-amber-500/10 text-amber-500" },
                  ].map((item, i) => (
                    <StaggerItem key={i} index={i}>
                      <div className="flex items-center gap-3 p-3 rounded-2xl border border-border/50 bg-card/50 transition-colors hover:bg-card">
                        <div className={`p-2.5 rounded-xl ${item.color}`}>
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div className="leading-tight">
                          <span className="block text-sm font-bold text-foreground">{item.label}</span>
                          <span className="text-[11px] text-muted-foreground uppercase tracking-wider">{item.sub}</span>
                        </div>
                      </div>
                    </StaggerItem>
                  ))}
                </div>
              </div>

              {/* Lado Direito: Composição Visual e Estatísticas Flutuantes */}
              <div className="relative">
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Imagem Principal */}
                  <div className="col-span-12 row-start-1 h-[400px] md:h-[500px] relative overflow-hidden rounded-[2.5rem] shadow-2xl">
                    <Image
                      src="/images/models/model-4.jpg" // Chalé A-Frame de exemplo
                      alt="casa pré-fabricada de madeira para praia na Bahia construída pela Wood Bahia"
                      fill
                      className="object-cover transition-transform duration-700 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>

                  {/* Cards de Estatísticas Flutuantes */}
                  <div className="col-span-7 col-start-6 row-start-1 z-20 space-y-4 -mr-4 md:-mr-8">
                    <StaggerItem index={0}>
                      <div className="p-6 rounded-3xl bg-background/80 backdrop-blur-xl border border-white/20 shadow-xl transform hover:-translate-y-1 transition-transform">
                        <div className="flex items-center gap-4">
                          <div className="text-4xl font-black text-primary">+15</div>
                          <div className="text-xs font-bold text-muted-foreground uppercase leading-tight">
                            Anos de<br />Garantia Fixa
                          </div>
                        </div>
                      </div>
                    </StaggerItem>
                    
                    <StaggerItem index={1}>
                      <div className="p-6 rounded-3xl bg-secondary/90 backdrop-blur-xl border border-white/10 shadow-xl transform translate-x-4 md:translate-x-8 hover:-translate-y-1 transition-transform">
                        <div className="flex items-center gap-4 text-white">
                          <div className="text-4xl font-black text-white">+100</div>
                          <div className="text-xs font-bold text-white/80 uppercase leading-tight">
                            Projetos<br />Entregues
                          </div>
                        </div>
                      </div>
                    </StaggerItem>
                  </div>

                  {/* Detalhe Visual Adicional (Badge) */}
                  <div className="col-span-5 row-start-1 mt-auto mb-8 z-20 -ml-4">
                    <div className="p-4 rounded-full bg-primary/20 backdrop-blur-md border border-primary/20 text-center animate-bounce-slow">
                      <span className="text-xs font-black text-primary uppercase tracking-widest">
                        100% Madeira
                      </span>
                    </div>
                  </div>
                </div>

                {/* Texto Extra de Fechamento (Proporção) */}
                <div className="mt-8 p-6 rounded-[2rem] border border-border/50 bg-background/50 text-sm leading-relaxed text-muted-foreground italic">
                  "Nossas construções entregam o máximo conforto térmico e durabilidade superior em locais como Praia do Forte, Guarajuba e toda a região baiana."
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
