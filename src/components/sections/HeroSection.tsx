
"use client";

import { ArrowRight } from "lucide-react";
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

        {/* Vídeo apenas para Mobile */}
        <video
          key="hero-video-mobile"
          autoPlay
          loop
          muted
          playsInline
          poster="/fundo-hero-section-mobile.webp"
          className="md:hidden h-full w-full object-cover"
        >
          <source src="/video/video-cabecalho-mobile.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50 md:from-black/80 md:via-black/60 md:to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent md:from-black/50" />
      </div>

      <div className="container relative z-10 mx-auto px-4 pb-16 pt-24">
        <div className="max-w-4xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-black uppercase tracking-widest text-white backdrop-blur-md">
              Wood Bahia
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: typeof window !== "undefined" && window.innerWidth < 768 ? 5 : 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="mb-4 font-serif text-[1.75rem] font-bold leading-[1.2] text-white tracking-tight sm:text-4xl md:text-5xl lg:text-6xl"
          >
            Chalés de Madeira e Casas <br className="hidden lg:block" />
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent italic">
              Pré-Fabricadas na Bahia
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: typeof window !== "undefined" && window.innerWidth < 768 ? 5 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="mb-10 font-sans text-lg font-medium text-white/90 md:text-xl lg:max-w-2xl"
          >
            Construa seu chalé de madeira ou casa pré-fabricada com Pinus tratado em autoclave, ideal para investimento, campo ou praia.
          </motion.p>

          {/* BANNER PROMOCIONAL 18X */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.25, type: "spring" }}
            className="mb-8 relative overflow-hidden rounded-2xl border border-amber-400/30 bg-black/40 backdrop-blur-md group shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-500/20 to-amber-500/10" />
            {/* Efeito de brilho animado */}
            <div className="absolute -inset-[100%] animate-[spin_8s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,rgba(251,191,36,0.2)_50%,transparent_100%)] blur-2xl" />
            
            <div className="relative p-5 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-600 text-white shadow-[0_0_30px_rgba(245,158,11,0.5)]">
                <span className="text-2xl">💳</span>
              </div>
              <div className="text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-amber-300 mb-2 border border-amber-400/20">
                  <span className="animate-pulse">🔥</span> Oferta Limitada
                </div>
                <h3 className="font-display text-xl font-black uppercase tracking-tight text-white sm:text-2xl drop-shadow-md">
                  Compre seu chalé em até <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">18X SEM JUROS</span>
                </h3>
                <p className="mt-1.5 text-sm font-medium text-white/90 md:text-base leading-relaxed">
                  Condição inédita e exclusiva para você tirar seu projeto do papel. Parcele qualquer kit madeiramento em até 18x sem juros no cartão ou ganhe <strong className="text-amber-300 font-bold">10% OFF</strong> pagando à vista.
                </p>
              </div>
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-8 flex flex-col gap-4 sm:flex-row"
          >
            <MagneticButton className="w-full sm:w-auto">
              <Link
                href="/simulador"
                className="btn-cta w-full sm:w-auto"
              >
                Simular preço do chalé
                <ArrowRight className="h-5 w-5" />
              </Link>
            </MagneticButton>
            <MagneticButton className="w-full sm:w-auto">
              <Link
                href="/#modelos"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-8 py-4 text-lg font-bold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:-translate-y-1 sm:w-auto"
              >
                Ver modelos de chalés
              </Link>
            </MagneticButton>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex items-center gap-3 text-white/60"
          >
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-8 w-8 rounded-full border-2 border-black bg-white/10 overflow-hidden relative">
                   <Image 
                    src={`https://i.pravatar.cc/100?u=woodbahia${i}`} 
                    alt="User" 
                    fill 
                    className="object-cover opacity-80"
                  />
                </div>
              ))}
            </div>
            <p className="text-sm font-medium tracking-wide">
              Mais de <span className="text-amber-400 font-bold">47 mil pessoas</span> acompanham nossos projetos no Instagram
            </p>
          </motion.div>

          {/* Final constraints */}
        </div>
      </div>
    </section>
  );
};
