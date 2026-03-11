"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { ScrollReveal } from "../common/ScrollReveal";

const locations = [
  "Feira de Santana",
  "Subaúma",
  "Baixios",
  "Itacaré",
  "Aracaju",
  "Praia do Forte",
  "Salvador e RMS",
  "Litoral Norte",
  "Barra Grande",
  "Trancoso",
  "Guarajuba",
  "Camaçari",
  "Sauípe",
  "Itacimirim",
  "Imbassaí",
  "Vitória da Conquista",
  "Chapada Diamantina",
  "Ilhéus",
  "Porto Seguro",
];

export const RegionalCoverageSection = () => {
  // Duplicamos a lista para garantir o loop infinito perfeito sem espaços vazios
  const marqueeList = [...locations, ...locations];

  return (
    <section className="bg-background py-20 md:py-32 overflow-hidden">
      <div className="container mx-auto px-4">
        <ScrollReveal className="max-w-4xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            Onde Construímos
          </span>
          <h2 className="section-title text-4xl md:text-5xl font-bold mb-6">
            Atendemos toda a <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent italic">Bahia</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Levamos o sonho da casa própria em madeira para diversas regiões do estado, com logística própria e equipe especializada.
          </p>
        </ScrollReveal>
      </div>

      {/* Container Inclinado e Escalado */}
      <div className="relative -rotate-1 scale-[1.02] select-none z-10 transition-transform duration-700 md:scale-105">
        {/* Faixa Marrom Escuro */}
        <div className="flex overflow-hidden border-y-2 border-primary/30 bg-card py-6 shadow-xl md:py-10">
          <motion.div
            className="flex whitespace-nowrap"
            animate={{ x: [0, "-50%"] }}
            transition={{
              duration: 50,
              ease: "linear",
              repeat: Infinity,
            }}
            whileHover={{ animationPlayState: "paused" }}
          >
            {marqueeList.map((city, index) => (
              <div
                key={index}
                className="group flex items-center px-6 md:px-10"
              >
                <h2 className="cursor-default transform text-2xl font-black uppercase tracking-tighter text-foreground/90 transition-all duration-300 group-hover:scale-105 group-hover:text-primary md:text-4xl">
                  {city}
                </h2>

                <span className="ml-6 text-primary/80 md:ml-10">
                  <MapPin className="h-6 w-6 opacity-70 md:h-8 md:w-8" />
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
