import { motion } from "framer-motion";
import { Calculator, ChevronRight, Sparkles, Home, Hammer } from "lucide-react";
import Link from "next/link";
import { ScrollReveal, StaggerContainer, StaggerItem } from "~/components/common/ScrollReveal";

export const SimulatorSection = () => {
  return (
    <section id="simulador-chale" className="py-24 md:py-32 relative overflow-hidden bg-slate-50">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -ml-64 -mb-64" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <StaggerContainer className="text-center max-w-4xl mx-auto">
              {/* 1. Badge e Titulo */}
              <StaggerItem>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-[0.2em] mb-6 border border-primary/20">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Experiência Exclusiva
                </div>
              </StaggerItem>
              
              <StaggerItem>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-slate-900 mb-6 leading-tight">
                  Quanto custa o seu<br />
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent italic">
                    chalé dos sonhos?
                  </span>
                </h2>
              </StaggerItem>
              
              {/* 2. Subtitulo */}
              <StaggerItem>
                <p className="text-lg md:text-xl text-muted-foreground mb-12 leading-relaxed max-w-2xl mx-auto">
                  Não fique apenas no desejo. Use nossa inteligência de cálculo para descobrir o investimento real do seu projeto em menos de 2 minutos. 
                </p>
              </StaggerItem>

              {/* 3. Instruções de Uso */}
              <StaggerItem className="mb-16">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left relative">
                  <div className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 hover:border-primary/20 transition-all hover:-translate-y-1">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                      <Home className="w-7 h-7 text-primary" />
                    </div>
                    <h4 className="text-slate-800 text-xl font-bold mb-2">1. Escolha a Área</h4>
                    <p className="text-muted-foreground text-sm">Personalize de 15m² até 200m² para o seu projeto.</p>
                  </div>
                  
                  <div className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 hover:border-primary/20 transition-all hover:-translate-y-1">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                      <Hammer className="w-7 h-7 text-primary" />
                    </div>
                    <h4 className="text-slate-800 text-xl font-bold mb-2">2. Defina o Kit</h4>
                    <p className="text-muted-foreground text-sm">Do madeiramento básico ao acabamento Premium.</p>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-1 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 p-8 rounded-[2rem] flex flex-col justify-center gap-4 shadow-lg shadow-primary/5 group hover:border-primary/40 transition-all hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-slate-800 text-xl font-bold">3. Resultado na Hora</h4>
                    </div>
                    <p className="text-muted-foreground text-sm">Transparência total e detalhada do seu investimento estimado.</p>
                    <div className="text-primary font-black text-4xl mt-2 tracking-tighter self-end opacity-20">R$</div>
                  </div>

                  {/* Linha Decorativa Marrom conectando os cards (Desktop) */}
                  <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent -z-10 hidden lg:block" />
                </div>
              </StaggerItem>
              
              {/* 4. Botão de Iniciar */}
              <StaggerItem>
                <div className="flex flex-col items-center gap-6">
                  <Link
                    href="/simulador"
                    className="group inline-flex items-center justify-center gap-3 bg-primary text-white font-black py-5 md:py-6 px-8 md:px-12 rounded-2xl shadow-2xl shadow-primary/30 hover:bg-primary/90 hover:-translate-y-1 active:scale-95 transition-all text-lg md:text-xl whitespace-nowrap"
                  >
                    <Calculator className="w-5 h-5 md:w-6 md:h-6" />
                    Iniciar Simulação
                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  
                  <p className="text-muted-foreground text-sm flex items-center justify-center gap-2 italic">
                    * Mais de 1.200 simulações realizadas este mês
                  </p>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
