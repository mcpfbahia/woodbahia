"use client";

import { Check } from "lucide-react";
import { steps } from "~/lib/data";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from "../common/ScrollReveal";

export const TimelineSection = () => {
  return (
    <section
      id="como-funciona"
      className="relative overflow-hidden bg-background py-20 md:py-32"
    >
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="mb-16 text-center">
            <span className="mb-6 inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              Como Funciona
            </span>
            <h2 className="section-title text-3xl font-bold md:text-5xl">
              Do sonho à
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {" "}
                realidade
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg lg:text-xl mt-4">
              Um processo simples e transparente para você acompanhar cada etapa
              da construção do seu chalé.
            </p>
          </div>

          <div className="relative mx-auto max-w-4xl">
            {/* Timeline Line */}
            <div className="timeline-line hidden md:block" />

            {/* Steps */}
            <StaggerContainer className="space-y-8 md:space-y-0">
              {steps.map((step, index) => (
                <StaggerItem
                  key={step.number}
                  index={index}
                  className={`relative flex flex-col gap-4 md:flex-row md:items-center md:gap-8 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  } ${index !== steps.length - 1 ? "md:pb-16" : ""}`}
                >
                  {/* Content Card */}
                  <div
                    className={`flex-1 ${
                      index % 2 === 0 ? "md:text-right" : "md:text-left"
                    }`}
                  >
                    <div
                      className={`glass-strong inline-block rounded-2xl p-6 ${
                        index % 2 === 0 ? "md:ml-auto" : "md:mr-auto"
                      }`}
                    >
                      <div className="mb-3 flex items-center gap-3">
                        <span className="font-serif text-sm font-bold text-secondary">
                          {step.number}
                        </span>
                        <h3 className="font-serif text-lg font-semibold">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Dot */}
                  <div className="relative z-10 shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary shadow-lg">
                      <Check className="h-5 w-5 text-white" />
                    </div>
                  </div>

                  {/* Spacer for opposite side */}
                  <div className="hidden flex-1 md:block" />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
