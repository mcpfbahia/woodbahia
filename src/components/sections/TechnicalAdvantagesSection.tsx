"use client";

import React from 'react';
import { Hammer, Zap, ShieldCheck, Banknote } from 'lucide-react'; 
import { ScrollReveal, StaggerContainer, StaggerItem } from '../common/ScrollReveal';

interface DiferencialProps {
  icon: React.ComponentType<{ className?: string, strokeWidth?: number }>;
  title: string;
  description: string;
}

const diferencialData: DiferencialProps[] = [
  {
    icon: Hammer,
    title: "Sistema Construtivo Racionalizado",
    description: "Componentes modulados que proporcionam uma obra mais limpa, montagem simplificada e menor desperdício de materiais no canteiro."
  },
  {
    icon: Zap,
    title: "Construção Rápida e Ágil",
    description: "Seu chalé pronto em tempo recorde. Reduza o prazo de obra e antecipe seu retorno financeiro no Airbnb."
  },
  {
    icon: ShieldCheck,
    title: "Alta Durabilidade e Baixa Manutenção",
    description: "Madeira Pinus tratada em autoclave com proteção total contra cupins e umidade. Perfeito para litoral ou campo."
  },
  {
    icon: Banknote,
    title: "Excelente Custo-Benefício",
    description: "Baixo investimento inicial e alta valorização imobiliária. A escolha inteligente para investimento ou moradia."
  }
];

export const TechnicalAdvantagesSection = () => {
  return (
    <section id="tecnico" className="w-full bg-[#FAF8F5] py-20 lg:py-28 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 flex flex-col items-center text-center">
        
        {/* Título e Subtítulo */}
        <ScrollReveal className="mb-16 text-center">
          <span className="mb-6 inline-block rounded-full bg-secondary/10 px-4 py-2 text-sm font-medium text-secondary transition-transform hover:scale-105 cursor-default">
            Diferenciais Técnicos
          </span>
          <h2 className="text-3xl font-bold md:text-5xl text-[#4A2B1D] leading-tight mb-6">
            Eficiência e Qualidade em <br className="hidden lg:block" />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent italic">Chalés de Madeira</span>
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg lg:text-xl mt-4">
            A união perfeita entre rapidez construtiva, sustentabilidade e alta rentabilidade para investidores.
          </p>
        </ScrollReveal>

        {/* Grid de 4 Cards com animações de scroll */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
          {diferencialData.map((item, index) => (
            <StaggerItem 
              key={index} 
              index={index}
              className="h-full"
            >
              <div className="
                h-full bg-white p-8 rounded-[2.5rem] shadow-sm border border-stone-100 
                group cursor-pointer transition-all duration-500 ease-in-out
                hover:shadow-2xl hover:border-amber-100 hover:-translate-y-2
                flex flex-col items-center text-center
              ">
                {/* Círculo do Ícone */}
                <div className="
                  w-16 h-16 rounded-full bg-[#FAF8F5] border border-stone-200 
                  flex items-center justify-center mb-6 
                  group-hover:bg-amber-100 transition-colors duration-300
                ">
                  <item.icon className="w-8 h-8 text-[#A05E3D]" strokeWidth={1.5} />
                </div>

                {/* Título do Card */}
                <h3 className="text-2xl font-extrabold text-[#4A2B1D] mb-4 leading-tight">
                  {item.title}
                </h3>

                {/* Descrição Enxuta */}
                <p className="text-[#735F53] text-base leading-relaxed font-medium">
                  {item.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};
