"use client";

import React from 'react';
import { Home, Hammer, Calculator, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { ScrollReveal, StaggerContainer, StaggerItem } from '~/components/common/ScrollReveal';

export const SimulatorSection = () => {
  return (
    <section id="simulador" className="w-full bg-white py-24 lg:py-32 relative overflow-hidden">
      
      {/* Efeito de brilho de fundo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
        
        <ScrollReveal className="flex flex-col items-center">
          <span className="mb-6 inline-block rounded-full bg-secondary/10 px-4 py-2 text-sm font-medium text-secondary transition-transform hover:scale-105 cursor-default">
            Experiência Exclusiva
          </span>

          <h2 className="text-3xl font-bold md:text-5xl text-[#4A2B1D] leading-tight mb-6 max-w-4xl">
            Quanto custa o seu <br/>
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent italic">chalé dos sonhos?</span>
          </h2>

          <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg lg:text-xl mt-4 mb-16">
            Não fique apenas no desejo. Use nossa inteligência de cálculo para descobrir o investimento real do seu projeto em menos de <strong className="text-[#4A2B1D]">2 minutos</strong>.
          </p>
        </ScrollReveal>

        {/* Container dos Cards com Linha Conectora (Desktop) */}
        <div className="relative w-full max-w-5xl mb-16">
          
          {/* Linha horizontal conectando os cards (Visível apenas em telas maiores) */}
          <div className="hidden md:block absolute top-[45%] left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-stone-200 to-transparent -translate-y-1/2 z-0"></div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            
            {/* Passo 1 */}
            <StaggerItem index={0}>
              <div className="h-full bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100 transition-transform duration-500 hover:-translate-y-2 text-left">
                <div className="w-14 h-14 rounded-2xl bg-[#FAF8F5] flex items-center justify-center mb-6">
                  <Home className="w-6 h-6 text-[#A46A45]" />
                </div>
                <h3 className="text-xl font-bold text-[#111827] mb-3">1. Escolha a Área</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Personalize de 15m² até 200m² para o seu projeto.
                </p>
              </div>
            </StaggerItem>

            {/* Passo 2 */}
            <StaggerItem index={1}>
              <div className="h-full bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100 transition-transform duration-500 hover:-translate-y-2 text-left">
                <div className="w-14 h-14 rounded-2xl bg-[#FAF8F5] flex items-center justify-center mb-6">
                  <Hammer className="w-6 h-6 text-[#A46A45]" />
                </div>
                <h3 className="text-xl font-bold text-[#111827] mb-3">2. Defina o Kit</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Do madeiramento básico ao acabamento Premium.
                </p>
              </div>
            </StaggerItem>

            {/* Passo 3 (Destaque) */}
            <StaggerItem index={2}>
              <div className="h-full bg-[#F6EFE9] p-8 rounded-3xl shadow-lg border border-[#E8DCCF] transition-transform duration-500 hover:scale-[1.02] text-left relative overflow-hidden group">
                <div className="w-14 h-14 rounded-2xl bg-white/50 flex items-center justify-center mb-6">
                   <Calculator className="w-6 h-6 text-[#8A3A1B]" />
                </div>
                <h3 className="text-xl font-bold text-[#111827] mb-3 relative z-10">3. Resultado na Hora</h3>
                <p className="text-gray-600 text-sm leading-relaxed relative z-10">
                  Transparência total e detalhada do seu investimento estimado.
                </p>
                {/* Marca d'água R$ no fundo do card */}
                <span className="absolute bottom-[-10px] right-2 text-6xl font-black text-[#E8DCCF] opacity-50 group-hover:scale-110 transition-transform duration-500">
                  R$
                </span>
              </div>
            </StaggerItem>

          </StaggerContainer>
        </div>

        {/* Botão de Ação (CTA) */}
        <ScrollReveal className="flex flex-col items-center">
          <Link 
            href="/simulador"
            className="btn-cta w-full"
          >
            <Calculator className="w-6 h-6 animate-pulse" />
            <span>Iniciar Simulação</span>
            <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" />
          </Link>

          {/* Prova Social */}
          <div className="mt-6 flex items-center gap-2 text-sm font-medium text-gray-500">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Mais de 1.200 simulações realizadas este mês
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};
