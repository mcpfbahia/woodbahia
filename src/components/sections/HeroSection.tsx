
"use client";

import { ArrowRight, Clock, Award, Users } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { MagneticButton } from "../common/MagneticButton";
import { StaggerContainer, StaggerItem } from "../common/ScrollReveal";

export const HeroSection = () => {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      {/* Background with Overlay */}
      <div className="absolute inset-0 bg-black">
        {/* Vídeo para Desktop e Tablet */}
        <video
          key="hero-video"
          autoPlay
          loop
          muted
          playsInline
          className="hidden h-full w-full object-cover md:block"
        >
          <source src="/hero-background.mp4" type="video/mp4" />
          <source src="/hero-background.webm" type="video/webm" />
        </video>

        {/* Imagem apenas para Mobile */}
        <div className="md:hidden">
          <Image
            src="/fundo-hero-section-mobile.webp"
            alt="Chalé de madeira sustentável Wood Bahia"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50 md:from-black/80 md:via-black/60 md:to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent md:from-black/50" />
      </div>

      <div className="container relative z-10 mx-auto px-4 pb-16 pt-24">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-md">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
              Construção Sustentável & Inteligente
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-2 font-serif text-4xl font-bold leading-[1.1] text-white sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Wood Bahia
            <span className="block bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
              Casas Pré Fabricadas
            </span>
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="mb-6 font-serif text-2xl font-medium text-white/90 sm:text-3xl md:text-4xl"
          >
            Casas & Chalés de Madeira
          </motion.h2>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8 max-w-2xl text-lg leading-relaxed font-medium text-white/90 md:text-xl"
          >
            Projetos "chave na mão" para o seu refúgio ou investimento, do
            Litoral Baiano ao interior. Do projeto arquitetônico ao fornecimento
            completo da estrutura, construímos o seu sonho de forma rápida,
            simples e orientada.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-12 flex flex-col gap-4 sm:flex-row"
          >
            <MagneticButton className="w-full sm:w-auto">
              <a
                href="/simulador"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-secondary to-primary px-8 py-4 text-lg font-bold text-white shadow-primary/20 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-primary/40 hover:shadow-xl sm:w-auto"
              >
                Simular investimento
                <ArrowRight className="h-5 w-5" />
              </a>
            </MagneticButton>
            <MagneticButton className="w-full sm:w-auto">
              <a
                href="/#modelos"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20 sm:w-auto"
              >
                Ver modelos
              </a>
            </MagneticButton>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4 sm:justify-start md:gap-8"
          >
            {/* 4. Stats no Rodapé do Hero */}
            <div className="mt-20 border-t border-white/10 pt-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                {[
                  { label: "Followers Instagram", value: "+45k" },
                  { label: "Projetos Entregues", value: "+100" },
                  { label: "Chalé Pronto em até 45 dias", value: "Até 45 Dias" }
                ].map((stat, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 + (i * 0.1) }}
                  >
                    <div>
                      <p className="text-3xl font-black text-white mb-1">
                        {stat.value}
                      </p>
                      <p className="text-white/60 text-sm font-medium uppercase tracking-widest whitespace-nowrap">
                        {stat.label}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
