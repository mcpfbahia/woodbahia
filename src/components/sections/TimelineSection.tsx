"use client";

import React from 'react';
import { Check } from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../common/ScrollReveal';

const passos = [
  {
    numero: "01",
    titulo: "Escolha do Modelo",
    descricao: "Selecione o chalé ideal entre nossos modelos exclusivos."
  },
  {
    numero: "02",
    titulo: "Contrato Fechado",
    descricao: "Formalizamos o acordo com transparência e segurança."
  },
  {
    numero: "03",
    titulo: "Produção do Kit",
    descricao: "Fabricação do kit completo em nossa fábrica (~30 dias)."
  },
  {
    numero: "04",
    titulo: "Chegada no Terreno",
    descricao: "Transporte e entrega de todos os materiais no local da obra."
  },
  {
    numero: "05",
    titulo: "Montagem da Casa",
    descricao: "Equipe especializada realiza a montagem completa (~30 dias)."
  },
  {
    numero: "06",
    titulo: "Sonho Realizado",
    descricao: "Entrega das chaves e início de uma nova história!"
  }
];

export const TimelineSection = () => {
  return (
    <section id="como-funciona" className="w-full bg-[#FAF8F5] py-20 lg:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        
        {/* Cabeçalho da Seção */}
        <ScrollReveal className="text-center mb-16 md:mb-24">
          <span className="mb-6 inline-block rounded-full bg-secondary/10 px-4 py-2 text-sm font-medium text-secondary">
            Como Funciona
          </span>
          <h2 className="text-3xl font-bold md:text-5xl text-[#4A2B1D] mb-6 tracking-tight">
            Do sonho à <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent italic">realidade</span>
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg lg:text-xl mt-4">
            Um processo simples e transparente para você acompanhar cada etapa da construção do seu chalé.
          </p>
        </ScrollReveal>

        {/* Container da Timeline */}
        <div className="relative w-full max-w-4xl mx-auto">
          
          {/* Linha Central (Vertical) */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] bg-[#E0D4C8] md:-translate-x-1/2 rounded-full"></div>

          {/* Mapeamento dos Passos */}
          <StaggerContainer className="space-y-12 md:space-y-0 relative z-10">
            {passos.map((passo, index) => {
              const isEven = index % 2 === 0;

              return (
                <StaggerItem 
                  key={index}
                  index={index}
                  className={`relative flex items-center md:justify-between w-full
                    ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'}
                    group
                  `}
                >
                  
                  {/* Bolinha do Check (Marcador da Timeline) */}
                  <div className="absolute left-8 md:left-1/2 w-10 h-10 rounded-full bg-[#B06D46] border-4 border-[#FAF8F5] shadow-sm flex items-center justify-center -translate-x-1/2 md:-translate-x-1/2 z-20 transition-all duration-300 group-hover:scale-125 group-hover:bg-[#8A3A1B]">
                    <Check className="w-5 h-5 text-white" strokeWidth={3} />
                  </div>

                  {/* Espaçador invisível para manter o layout no Desktop */}
                  <div className="hidden md:block md:w-5/12"></div>

                  {/* Card de Conteúdo */}
                  <div 
                    className={`
                      w-full ml-20 md:ml-0 md:w-5/12 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-stone-100 
                      transition-all duration-500 ease-in-out hover:shadow-xl hover:-translate-y-1
                      ${isEven ? 'md:text-right' : 'md:text-left'} text-left
                    `}
                  >
                    <div className={`flex items-center gap-3 mb-3 ${isEven ? 'md:justify-end' : 'md:justify-start'}`}>
                      <span className="text-[#B06D46] font-black text-xl">{passo.numero}</span>
                      <h3 className="text-xl font-bold text-[#111827]">{passo.titulo}</h3>
                    </div>
                    <p className="text-[#735F53] text-base leading-relaxed font-medium">
                      {passo.descricao}
                    </p>
                  </div>

                </StaggerItem>
              );
            })}
          </StaggerContainer>
          
        </div>
      </div>
    </section>
  );
};
