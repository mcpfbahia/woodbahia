"use client";

import React from 'react';
import Image from 'next/image';
import { ShieldCheck, Target, TreePine } from 'lucide-react'; // Ícones para os selos

const selosData = [
  {
    icon: ShieldCheck,
    titulo: "+15 ANOS",
    subtitulo: "DE GARANTIA"
  },
  {
    icon: Target,
    titulo: "+100",
    subtitulo: "PROJETOS ENTREGUES"
  },
  {
    icon: TreePine,
    titulo: "100%",
    subtitulo: "MADEIRA TRATADA"
  }
];

export const AboutSection = () => {
  return (
    <section id="sobre" className="w-full bg-[#FAF8F5] py-20 lg:py-32 overflow-hidden relative">
      
      {/* Elemento decorativo de fundo */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] bg-[#F2E6DD] rounded-full blur-[120px] opacity-40"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Layout Mobile: Empilhado. Desktop: Grid 2 colunas proporcionais */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* COLUNA ESQUERDA (Desktop) / CIMA (Mobile): Texto e SEO */}
          <div className="flex flex-col items-start w-full">
            
            {/* Cabeçalho na Coluna da Esquerda */}
            <div className="text-left mb-8">
              <span className="mb-6 inline-block rounded-full bg-secondary/10 px-4 py-2 text-sm font-medium text-secondary transition-transform hover:scale-105 cursor-default">
                Nossa Essência
              </span>
              <h2 className="text-3xl font-bold md:text-5xl text-[#4A2B1D] leading-[1.15] mb-6">
                Experiência em Casas e <br/>
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent italic relative inline-block group">
                  Chalés de Madeira na Bahia
                  <span className="absolute -bottom-2 left-0 w-0 h-1.5 bg-[#B06D46]/30 transition-all duration-500 group-hover:w-full rounded-full"></span>
                </span>
              </h2>
              <p className="text-base text-[#B06D46] font-semibold md:text-lg lg:text-xl mt-4 border-l-4 border-[#B06D46] pl-4">
                Especialistas em Chalés A-Frame e Casas Pré-Fabricadas de Madeira
              </p>
            </div>
            
            {/* Parágrafos com termos-chave em Strong */}
            <div className="space-y-6 text-[#735F53] text-lg md:text-xl leading-relaxed">
              <p>
                A <strong className="text-[#4A2B1D] font-black hover:text-[#B06D46] transition-colors cursor-default">Wood Bahia</strong> é referência em <strong className="text-[#4A2B1D] font-black">chalés de madeira</strong> de alto padrão. 
                Nossas soluções de <strong className="text-[#4A2B1D] font-black">pinus tratado</strong> são ideais para <strong className="text-[#4A2B1D] font-black">investimento em Airbnb</strong>, 
                lazer e moradia sustentável.
              </p>
              <p>
                Atendemos do <strong className="text-[#4A2B1D] font-black">Litoral Norte da Bahia</strong> à <strong className="text-[#4A2B1D] font-black">Chapada Diamantina</strong> e 
                Sergipe, entregando construções rápidas, duráveis e com estética premium.
              </p>
            </div>
          </div>

          {/* COLUNA DIREITA (Desktop) / BAIXO (Mobile): Imagem e Selos Customizados */}
          <div className="relative w-full h-[600px] lg:h-[750px] flex justify-center lg:justify-end">
            
            {/* Container da Imagem com efeito "Pílula" gigante */}
            <div className="relative w-full max-w-[420px] lg:max-w-none h-full rounded-[60px] overflow-hidden shadow-2xl group cursor-pointer transition-transform duration-500 hover:scale-[1.02]">
              
              {/* Imagem Real (Noturna) com Efeito de Zoom no Hover */}
              <Image 
                src="/chales airbnb itacimirim litoral norte bahia.jpeg" // Foto real noturna
                alt="Chalés A-Frame de madeira iluminados à noite com piscina - Wood Bahia"
                fill
                className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
              />
              
              {/* Overlay suave para garantir o contraste dos selos */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/30 to-transparent"></div>

              {/* CONTAINER DOS SELOS: Empilhados verticalmente, menores no Mobile */}
              <div className="absolute top-4 left-4 lg:top-8 lg:left-8 flex flex-col gap-2.5 lg:gap-4 z-20">
                {selosData.map((selo, index) => (
                  <div 
                    key={index} 
                    className={`
                      bg-white/50 backdrop-blur-md shadow-xl rounded-xl lg:rounded-2xl p-2.5 lg:p-4 flex items-center gap-2 lg:gap-3 transition-transform duration-500 
                      hover:-translate-y-1 hover:shadow-2xl hover:bg-white/80
                      // Animação de entrada cascata (simulada)
                      opacity-0 animate-fade-in-right border border-white/20
                    `}
                    style={{ animationDelay: `${index * 150}ms` }} 
                  >
                    {/* Ícone Terracota */}
                    <selo.icon className="w-4 h-4 lg:w-6 lg:h-6 text-[#A46A45] shrink-0" />
                    
                    {/* Texto Terracota Escuro */}
                    <div>
                      <span className="block text-base lg:text-xl font-black text-[#8A3A1B] leading-tight">
                        {selo.titulo}
                      </span>
                      <span className="block text-[10px] lg:text-xs font-bold text-[#8A3A1B] leading-tight tracking-wide">
                        {selo.subtitulo}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
