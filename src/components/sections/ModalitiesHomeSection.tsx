"use client";

import React from "react";
import { Package, Hammer, Home, ChevronRight, Check } from "lucide-react";
import Link from "next/link";
import { ScrollReveal, StaggerContainer, StaggerItem } from "~/components/common/ScrollReveal";

export const ModalitiesHomeSection = () => {
  const cards = [
    {
      title: "Kit Madeiramento",
      icon: Package,
      description: "Receba toda a estrutura em madeira Pinus tratada para construir com sua própria equipe.",
      features: [
        "Pilares e vigas de sustentação",
        "Estrutura completa de telhado e paredes",
        "Madeira tratada com 15 anos de garantia",
        "Manual técnico detalhado de montagem",
      ],
      btnText: "Ver modelos",
      btnLink: "/modelos",
      theme: "border-stone-200 hover:border-amber-500 bg-white",
      iconBg: "bg-stone-50 text-stone-700 group-hover:bg-stone-100",
      btnClass: "bg-stone-100 hover:bg-stone-200 text-stone-800",
    },
    {
      title: "Kit + Montagem Parceira",
      icon: Hammer,
      description: "Economize utilizando carpinteiros parceiros especializados indicados pela Wood Bahia.",
      features: [
        "Toda a estrutura do Kit Madeiramento",
        "Indicação de carpinteiros homologados",
        "Contratação e pagamento direto ao montador",
        "Economia sem taxas de administração",
      ],
      btnText: "Saiba mais",
      btnLink: "/modalidades",
      theme: "border-stone-200 hover:border-[#B06D46] bg-white",
      iconBg: "bg-amber-50 text-[#B06D46] group-hover:bg-amber-100",
      btnClass: "bg-amber-50 hover:bg-[#B06D46]/10 text-[#B06D46] border border-[#B06D46]/20",
    },
    {
      title: "Wood Bahia Chave na Mão",
      icon: Home,
      description: "Receba sua estrutura montada com coordenação e responsabilidade da Wood Bahia.",
      features: [
        "Kit Madeiramento + Portas, janelas e ferragens",
        "Cobertura com manta térmica e vidros",
        "Pintura protetora em Stain aplicada",
        "Montagem e coordenação completa inclusas",
      ],
      btnText: "Solicitar orçamento",
      btnLink: "https://wa.me/5571992936290?text=Olá! Gostaria de um orçamento para a modalidade Chave na Mão.",
      theme: "border-[#E8DCCF] hover:border-[#8A3A1B] bg-[#FAF8F5] shadow-[0_12px_40px_rgba(182,109,70,0.05)]",
      iconBg: "bg-white text-[#8A3A1B]",
      btnClass: "bg-[#8A3A1B] hover:bg-[#732F14] text-white hover:shadow-md transition-shadow",
      isPopular: true,
    },
  ];

  return (
    <section id="modalidades-construcao" className="w-full bg-white py-24 lg:py-32 relative overflow-hidden">
      {/* Efeitos visuais premium de fundo */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-50/40 rounded-full blur-3xl opacity-60 pointer-events-none -mr-48"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-stone-50 rounded-full blur-3xl opacity-70 pointer-events-none -ml-36"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Cabeçalho */}
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <span className="mb-4 inline-block rounded-full bg-secondary/10 px-4 py-2 text-sm font-semibold text-secondary">
            Modalidades de Construção
          </span>
          <h2 className="text-3xl font-bold md:text-5xl text-[#4A2B1D] tracking-tight mb-6 leading-tight">
            Como você deseja <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent italic">
              construir seu chalé?
            </span>
          </h2>
          <p className="text-base text-muted-foreground md:text-lg lg:text-xl leading-relaxed">
            Oferecemos total flexibilidade para você planejar sua obra. Escolha entre a máxima economia da montagem independente ou a comodidade do serviço completo.
          </p>
        </ScrollReveal>

        {/* Grid de Cards */}
        <StaggerContainer className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <StaggerItem key={idx} index={idx} className="flex">
                <div className={`group relative w-full flex flex-col justify-between p-8 md:p-10 rounded-[2.5rem] border transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] ${card.theme}`}>
                  
                  {card.isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[#8A3A1B] text-white px-5 py-1.5 text-xs font-bold uppercase tracking-wider shadow">
                      Mais Procurado
                    </div>
                  )}

                  <div>
                    {/* Ícone */}
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-110 shadow-sm ${card.iconBg}`}>
                      <Icon className="w-8 h-8" />
                    </div>

                    {/* Título */}
                    <h3 className="text-2xl font-bold text-[#111827] mb-4 group-hover:text-primary transition-colors">
                      {card.title}
                    </h3>

                    {/* Descrição */}
                    <p className="text-gray-500 text-sm leading-relaxed mb-8">
                      {card.description}
                    </p>

                    {/* Divisor */}
                    <div className="w-full h-[1px] bg-stone-100 mb-8"></div>

                    {/* Checklist */}
                    <ul className="space-y-4 mb-10">
                      {card.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-3 text-sm text-[#5C3317]">
                          <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center mt-0.5">
                            <Check className="w-3.5 h-3.5 text-emerald-600" strokeWidth={3} />
                          </span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Botão */}
                  <Link
                    href={card.btnLink}
                    target={card.btnLink.startsWith("http") ? "_blank" : "_self"}
                    className={`w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold text-sm transition-all duration-300 ${card.btnClass}`}
                  >
                    <span>{card.btnText}</span>
                    <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>

                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

      </div>
    </section>
  );
};
