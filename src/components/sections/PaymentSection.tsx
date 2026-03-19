"use client";

import React from 'react';
import { CreditCard, Home, CheckCircle2, MessageCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { ScrollReveal, StaggerContainer, StaggerItem } from '~/components/common/ScrollReveal';

export const PaymentSection = () => {
  return (
    <section id="pagamento" className="w-full bg-[#FAF8F5] py-20 lg:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        
        {/* Cabeçalho Padronizado */}
        <ScrollReveal className="text-center mb-16 md:mb-20">
          <span className="mb-6 inline-block rounded-full bg-secondary/10 px-4 py-2 text-sm font-medium text-secondary">
            Formas de Pagamento
          </span>
          <h2 className="text-3xl font-bold md:text-5xl text-[#4A2B1D] mb-6 tracking-tight">
            Facilidades no <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent italic">Pagamento</span>
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg lg:text-xl mt-4">
            Facilitamos o pagamento para tornar seu projeto de casa pré-fabricada mais acessível e seguro.
          </p>
        </ScrollReveal>

        {/* Grid dos Cards de Pagamento */}
        <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl mb-16">
          
          {/* Card 1: Cartão de Crédito */}
          <StaggerItem index={0}>
            <div className="h-full relative bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-stone-100 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 overflow-hidden group">
              
              {/* Ícone de Marca d'água no fundo com Movimento */}
              <CreditCard className="absolute -top-12 -right-12 w-80 h-80 text-[#4A2B1D]/5 rotate-12 transition-all duration-1000 ease-out group-hover:scale-110 group-hover:-translate-x-8 group-hover:-translate-y-8 group-hover:rotate-[20deg] pointer-events-none" />

              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-[#F9F6F0] border border-[#EFE8DF] flex items-center justify-center mb-8">
                  <CreditCard className="w-6 h-6 text-[#A46A45]" />
                </div>

                <h3 className="text-2xl md:text-3xl font-extrabold text-[#111827] mb-8">
                  Cartão de Crédito
                </h3>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#B06D46] shrink-0" />
                    <span className="text-[#57463A] font-medium">Pagamento no cartão de crédito em até 3X sem juros</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#B06D46] shrink-0" />
                    <span className="text-[#57463A] font-medium">Parcelamento fácil e sem burocracia</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#B06D46] shrink-0" />
                    <span className="text-[#57463A] font-medium">Juros baixos aplicados conforme operadora do cartão</span>
                  </li>
                </ul>

                {/* Box de Destaque */}
                <div className="bg-[#F9F6F0] rounded-2xl p-6 border border-[#EFE8DF]">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-2xl font-black text-[#111827]">
                      Até <span className="text-[#B06D46]">18x</span> no cartão
                    </h4>
                    <div className="w-3 h-3 rounded-full bg-[#B06D46] animate-pulse"></div>
                  </div>
                  <p className="text-sm text-[#735F53] mb-4">
                    Simule o valor das parcelas e descubra quanto pagará pelo seu kit.
                  </p>
                  <Link 
                    href="/simulador/parcelamento"
                    className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-[#B06D46] hover:bg-[#8A5638] text-white font-bold rounded-xl transition-all duration-300 shadow-sm hover:shadow-md active:scale-[0.98] whitespace-nowrap"
                  >
                    <span className="text-sm sm:text-base">Simular parcelas no cartão</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </StaggerItem>

          {/* Card 2: Pagamento Progressivo */}
          <StaggerItem index={1}>
            <div className="h-full relative bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-stone-100 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 overflow-hidden group">
              
              {/* Ícone de Marca d'água no fundo com Movimento */}
              <Home className="absolute -top-12 -right-12 w-80 h-80 text-[#4A2B1D]/5 -rotate-6 transition-all duration-1000 ease-out group-hover:scale-110 group-hover:-translate-x-8 group-hover:-translate-y-8 group-hover:rotate-[0deg] pointer-events-none" />

              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-[#F9F6F0] border border-[#EFE8DF] flex items-center justify-center mb-8">
                  <Home className="w-6 h-6 text-[#A46A45]" />
                </div>

                <h3 className="text-2xl md:text-3xl font-extrabold text-[#111827] mb-8 pr-12">
                  Pagamento Progressivo da Obra
                </h3>

                {/* Timeline de Pagamento Progressivo */}
                <div className="relative pl-6 border-l-2 border-[#EFE8DF] space-y-8">
                  
                  {/* Passo 1 */}
                  <div className="relative group/step">
                    <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-[#B06D46] border-4 border-white transition-transform group-hover/step:scale-125"></div>
                    <h4 className="text-xl font-black text-[#B06D46] mb-1">30%</h4>
                    <p className="text-[#57463A] font-medium text-sm">Sinal na assinatura do contrato</p>
                  </div>

                  {/* Passo 2 */}
                  <div className="relative group/step">
                    <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-[#B06D46] border-4 border-white transition-transform group-hover/step:scale-125"></div>
                    <h4 className="text-xl font-black text-[#B06D46] mb-1">20%</h4>
                    <p className="text-[#57463A] font-medium text-sm">Na entrega do kit no local da obra</p>
                  </div>

                  {/* Passo 3 */}
                  <div className="relative group/step">
                    <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-[#EFE8DF] border-4 border-white transition-transform group-hover/step:scale-125"></div>
                    <h4 className="text-lg font-bold text-[#735F53] mb-1">Parcelas proporcionais</h4>
                    <p className="text-[#8A6B5B] text-sm">Conforme o andamento da construção</p>
                  </div>

                </div>
              </div>
            </div>
          </StaggerItem>

        </StaggerContainer>

        {/* Citação / Transparência */}
        <ScrollReveal className="relative w-full max-w-4xl bg-white p-8 md:p-10 rounded-3xl shadow-md border border-stone-100 text-center mb-12 group">
          {/* Etiqueta Flutuante */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#8A3A1B] text-white text-xs font-bold px-4 py-1.5 rounded-full tracking-widest uppercase shadow-sm group-hover:scale-110 transition-transform">
            Transparência
          </div>
          
          <p className="text-xl md:text-2xl italic font-medium text-[#4A2B1D] leading-relaxed">
            "Nosso modelo de pagamento acompanha o avanço da obra, garantindo segurança e transparência para ambas as partes."
          </p>
        </ScrollReveal>

        {/* Botão WhatsApp */}
        <ScrollReveal>
          <a 
            href="https://wa.me/5571992936290" 
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cta !bg-[#25D366] hover:!bg-[#1DA851] !shadow-green-500/30"
          >
            <MessageCircle className="w-7 h-7" />
            <span>Falar no WhatsApp</span>
          </a>
        </ScrollReveal>

      </div>
    </section>
  );
};
