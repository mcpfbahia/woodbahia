"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { ScrollReveal } from "../common/ScrollReveal";

const locations = [
  "Feira de Santana",
  "Subaúma",
  "Baixios",
  "Itacaré",
  "Sergipe",
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
  "Sudoeste Baiano",
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
        <ScrollReveal className="mb-16 text-center">
          <span className="mb-6 inline-block rounded-full bg-secondary/10 px-4 py-2 text-sm font-medium text-secondary">
            Onde Construímos
          </span>
          <h2 className="section-title text-3xl font-bold md:text-5xl text-[#4A2B1D] mb-6">
            Atendemos toda a <br />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent italic">Bahia e região</span>
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg lg:text-xl mt-4">
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
