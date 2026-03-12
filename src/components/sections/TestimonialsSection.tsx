"use client";

import { useState, useEffect } from "react";
import { Star, Quote, ChevronLeft, ChevronRight, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { testimonials } from "~/lib/data";
import { ScrollReveal } from "../common/ScrollReveal";

export const TestimonialsSection = () => {
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => (prev + newDirection + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const testimonial = testimonials[currentIndex]!;

  if (!mounted) {
    return (
      <section
        id="depoimentos"
        className="relative overflow-hidden bg-secondary/5 py-20 md:py-32"
      >
        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-5xl h-96 flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="depoimentos"
      className="relative overflow-hidden bg-secondary/5 py-20 md:py-32"
    >
      <div className="absolute top-0 left-0 h-full w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <div className="container relative z-10 mx-auto px-4">
        <ScrollReveal className="mb-12 text-center md:mb-16">
          <span className="mb-6 inline-block rounded-full bg-secondary/10 px-4 py-2 text-sm font-medium text-secondary">
            Depoimentos Reais
          </span>
          <h2 className="section-title text-3xl font-bold md:text-5xl text-[#4A2B1D] mb-6 tracking-tight">
            O que nossos <br className="md:hidden" />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent italic">
              {" "}
              clientes dizem
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg lg:text-xl mt-4">
            Histórias de quem já transformou seu sonho em realidade com a Wood Bahia.
          </p>
        </ScrollReveal>

        <div className="relative mx-auto max-w-5xl">
          {/* Main Slider */}
          <div className="relative h-[450px] md:h-[400px] overflow-hidden px-4">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="absolute inset-0 flex items-center justify-center p-4"
              >
                <div className="group relative flex w-full max-w-4xl flex-col items-center border border-border/50 bg-background p-8 text-center transition-transform duration-300 hover:-translate-y-1 md:p-12 rounded-3xl shadow-lg">
                  <div className="absolute top-6 right-6 opacity-10 pointer-events-none">
                    <Quote className="h-20 w-20 fill-primary text-primary" />
                  </div>

                  <div className="z-10 flex w-full flex-grow flex-col items-center justify-center">
                    <div className="mb-6 flex items-center gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-6 w-6 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>

                    <blockquote className="mb-8 max-w-2xl font-serif text-xl font-medium leading-relaxed text-foreground/80 md:text-2xl">
                      "{testimonial.text}"
                    </blockquote>

                    <div className="flex flex-col items-center">
                      <h4 className="mb-1 font-serif text-xl font-bold text-foreground">
                        {testimonial.name}
                      </h4>
                      <p className="mb-4 text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>

                      <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold tracking-wide text-primary">
                        <User className="h-3 w-3" />
                        {testimonial.model}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="mt-8 flex items-center justify-center gap-6">
            <button
              onClick={() => paginate(-1)}
              className="group flex h-12 w-12 items-center justify-center rounded-full border border-border/50 bg-background shadow-sm transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white"
            >
              <ChevronLeft className="h-6 w-6 transition-transform group-hover:-translate-x-0.5" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1);
                    setCurrentIndex(index);
                  }}
                  className={`h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex ? "w-8 bg-primary" : "w-3 bg-primary/20 hover:bg-primary/40"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => paginate(1)}
              className="group flex h-12 w-12 items-center justify-center rounded-full border border-border/50 bg-background shadow-sm transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white"
            >
              <ChevronRight className="h-6 w-6 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
