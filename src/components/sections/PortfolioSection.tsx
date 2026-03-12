"use client";

import React, { useEffect, useState, useRef } from 'react';
import { ArrowLeft, ArrowRight, Instagram, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { collection, getDocs } from "firebase/firestore";
import { db } from "~/lib/firebase";
import { initialPortfolio } from "~/lib/data";

export const PortfolioSection = () => {
  const [mounted, setMounted] = useState(false);
  const [portfolioItems, setPortfolioItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const fetchPortfolio = async () => {
      if (!db) {
        setPortfolioItems(initialPortfolio);
        setIsLoading(false);
        return;
      }

      try {
        const querySnapshot = await getDocs(collection(db, "portfolio"));
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        if (items.length > 0) {
          setPortfolioItems(items);
        } else {
          setPortfolioItems(initialPortfolio);
        }
      } catch (error) {
        console.error("Error fetching portfolio:", error);
        setPortfolioItems(initialPortfolio);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!mounted) {
    return (
      <section id="portfolio" className="w-full bg-[#FAF8F5] py-20 lg:py-28 overflow-hidden min-h-[400px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </section>
    );
  }

  return (
    <section id="portfolio" className="w-full bg-[#FAF8F5] py-20 lg:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        
        {/* Cabeçalho Padronizado */}
        <div className="text-center mb-16">
          <span className="mb-6 inline-block rounded-full bg-secondary/10 px-4 py-2 text-sm font-medium text-secondary">
            Projetos Entregues
          </span>
          <h2 className="section-title text-3xl font-bold md:text-5xl text-[#4A2B1D] mb-6">
            Nosso <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent italic">Portifolio</span>
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg lg:text-xl mt-4">
            Conheça alguns dos nossos projetos realizados e encante-se com o padrão de qualidade Wood Bahia.
          </p>
          
          <a href="https://www.instagram.com/woodbahiacasasprefabricadas/" target="_blank" rel="noopener noreferrer" 
             className="inline-flex items-center gap-2 text-[#B06D46] hover:text-[#8A3A1B] font-medium transition-colors">
            <Instagram className="w-5 h-5" />
            <span>Acompanhe nosso Instagram para ver mais obras e novidades.</span>
          </a>
        </div>

        {/* Carrossel com Navegação */}
        <div className="relative w-full group/carousel">
          {/* Botões de Navegação (Desktop) */}
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-30 hidden lg:flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-xl text-primary transition-all hover:scale-110 hover:bg-primary hover:text-white border border-border/50 opacity-0 group-hover/carousel:opacity-100"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-30 hidden lg:flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-xl text-primary transition-all hover:scale-110 hover:bg-primary hover:text-white border border-border/50 opacity-0 group-hover/carousel:opacity-100"
            aria-label="Próximo"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Carrossel Nativo (CSS Scroll Snap) */}
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div 
              ref={scrollContainerRef}
              className="w-full flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-8 px-4 -mx-4 sm:px-0 sm:mx-0"
            >
              {portfolioItems.map((projeto) => (
                <div 
                  key={projeto.id} 
                  className="relative w-[280px] sm:w-[320px] md:w-[400px] h-[350px] md:h-[450px] shrink-0 snap-center rounded-[2rem] overflow-hidden group shadow-md"
                >
                  <Image 
                    src={projeto.image || projeto.img || "/placeholder.svg"} 
                    alt={projeto.title || projeto.alt || "Projeto Wood Bahia"}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Degradê escuro embaixo para dar um ar premium */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <h4 className="font-serif text-lg font-bold text-white md:text-xl">
                      {projeto.title}
                    </h4>
                    <p className="text-xs font-medium text-white/80">
                      {projeto.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Indicadores Visuais (Mobile) */}
          <div className="flex justify-center gap-2 mt-4 lg:hidden">
             <button 
              onClick={() => scroll('left')}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EFE8DF] text-primary"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EFE8DF] text-primary"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Botão de Call to Action para a Página de Galeria (SEO) */}
        <div className="mt-8 md:mt-12">
          <Link href="/portfolio" className="group flex items-center gap-3 bg-white border-2 border-[#EFE8DF] hover:border-[#B06D46] text-[#4A2B1D] font-bold text-lg py-4 px-8 rounded-2xl transition-all duration-300 hover:shadow-lg">
            <span>Ver Galeria Completa</span>
            <ArrowRight className="w-5 h-5 text-[#B06D46] transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

      </div>
    </section>
  );
}
