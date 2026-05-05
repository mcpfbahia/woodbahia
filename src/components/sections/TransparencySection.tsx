"use client";

import React from 'react';
import { CheckCircle2, XCircle, Clock, Info, Package, Hammer, Droplets, Zap, Ruler } from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../common/ScrollReveal';

export const TransparencySection = () => {
  const included = [
    { icon: Package, text: "Toda a estrutura de madeira (em tamanhos para ajuste no local)" },
    { icon: Ruler, text: "Projeto arquitetônico base e manual técnico" },
    { icon: CheckCircle2, text: "Opcionais se contratados: kit cobertura, ferragens e esquadrias" },
  ];

  const montadorScope = [
    { icon: Hammer, text: "Cortes precisos da madeira e ajustes finos de peças" },
    { icon: Package, text: "Montagem completa da estrutura sobre a fundação" },
    { icon: CheckCircle2, text: "Instalação dos opcionais adquiridos (portas, janelas, etc.)" },
    { icon: Ruler, text: "Alterações de planta (combinadas diretamente com eles)" },
  ];

  const notIncluded = [
    { text: "Radier/sapatas (base e fundação)" },
    { text: "Parte de alvenaria (ex: banheiros)" },
    { text: "Instalações elétricas e hidráulicas" },
    { text: "Piso, vidros, rufos e calhas" },
    { text: "Pintura/verniz final e acabamentos" },
  ];

  return (
    <section className="py-16 md:py-24 bg-[#FAF8F5] overflow-hidden">
      <div className="container mx-auto px-4">
        <ScrollReveal className="text-center mb-16">
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-[#4A2B1D]">
            Transparência Total
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#4A2B1D] mb-4">
            O Que Está Incluso no Kit
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Garantimos clareza em todas as etapas para que você saiba exatamente o que recebe em sua obra.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* O Que Está Incluso */}
          <StaggerContainer>
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-stone-100 h-full">
              <h3 className="text-xl font-bold text-[#4A2B1D] mb-8 flex items-center gap-3">
                <CheckCircle2 className="text-emerald-500 w-8 h-8" />
                Incluso (Wood Bahia)
              </h3>
              <ul className="space-y-6">
                {included.map((item, index) => (
                  <StaggerItem key={index} index={index}>
                    <li className="flex items-start gap-4">
                      <div className="mt-1 bg-primary/5 p-2 rounded-lg flex-shrink-0">
                        <item.icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                      </div>
                      <span className="text-[#735F53] font-medium leading-relaxed text-sm">
                        {item.text}
                      </span>
                    </li>
                  </StaggerItem>
                ))}
              </ul>
            </div>
          </StaggerContainer>

          {/* Escopo do Montador */}
          <StaggerContainer>
            <div className="bg-[#FAF6F0] rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-amber-100 h-full">
              <h3 className="text-xl font-bold text-[#4A2B1D] mb-8 flex items-center gap-3">
                <Hammer className="text-amber-600 w-8 h-8" />
                Escopo do Montador
              </h3>
              <ul className="space-y-6">
                {montadorScope.map((item, index) => (
                  <StaggerItem key={index} index={index}>
                    <li className="flex items-start gap-4">
                      <div className="mt-1 bg-amber-500/10 p-2 rounded-lg flex-shrink-0">
                        <item.icon className="w-5 h-5 text-amber-600" strokeWidth={1.5} />
                      </div>
                      <span className="text-[#735F53] font-medium leading-relaxed text-sm">
                        {item.text}
                      </span>
                    </li>
                  </StaggerItem>
                ))}
              </ul>
            </div>
          </StaggerContainer>

          {/* O Que Não Está Incluso */}
          <StaggerContainer>
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-stone-100 h-full flex flex-col">
              <h3 className="text-xl font-bold text-[#4A2B1D] mb-8 flex items-center gap-3">
                <XCircle className="text-red-400 w-8 h-8" />
                Não Incluso no Kit
              </h3>
              <ul className="space-y-5 mb-6">
                {notIncluded.map((item, index) => (
                  <StaggerItem key={index} index={index}>
                    <li className="flex items-start gap-4 group">
                      <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-400 group-hover:scale-150 transition-transform" />
                      <span className="text-[#9C8F86] font-medium text-sm">
                        {item.text}
                      </span>
                    </li>
                  </StaggerItem>
                ))}
              </ul>
              
              <div className="mt-auto pt-4 border-t border-stone-100">
                <p className="text-xs text-muted-foreground italic font-medium leading-relaxed">
                  * Importante: A execução de todos esses itens não inclusos pode ser negociada e contratada diretamente com a equipe parceira de montadores.
                </p>
              </div>
            </div>
          </StaggerContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Prazos */}
          <ScrollReveal delay={0.2}>
            <div className="bg-primary rounded-[2.5rem] p-8 md:p-10 text-white flex flex-col md:flex-row items-center gap-8 shadow-xl">
              <div className="bg-white/10 p-5 rounded-3xl backdrop-blur-sm">
                <Clock className="w-12 h-12 text-white" />
              </div>
              <div className="text-center md:text-left">
                <p className="text-white/70 text-sm font-semibold uppercase tracking-widest mb-2">
                  Prazos
                </p>
                <h4 className="text-xl font-bold mb-1">Chegada do kit e tempo de montagem</h4>
                <p className="text-2xl font-bold text-amber-400">15–30 dias entrega | 30–60 dias montagem</p>
                <p className="text-white/60 text-xs mt-1">* O prazo de montagem varia conforme o tamanho do modelo</p>
              </div>
            </div>
          </ScrollReveal>

          {/* Importante */}
          <ScrollReveal delay={0.4}>
            <div className="bg-[#4A2B1D] rounded-[2.5rem] p-8 md:p-10 text-white flex flex-col md:flex-row items-center gap-8 shadow-xl">
              <div className="bg-white/10 p-5 rounded-3xl backdrop-blur-sm">
                <Info className="w-12 h-12 text-amber-400" />
              </div>
              <div className="text-center md:text-left">
                <p className="text-white/60 text-sm font-semibold uppercase tracking-widest mb-2">
                  Importante
                </p>
                <p className="text-xl font-medium leading-relaxed">
                  O terreno deve estar <span className="text-amber-400 font-bold underline decoration-[#4A2B1D]/30">limpo e nivelado</span> antes da montagem.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
