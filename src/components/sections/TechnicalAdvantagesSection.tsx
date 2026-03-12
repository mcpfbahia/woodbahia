"use client";

import { Hammer, Zap, ShieldCheck, Wallet } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "../common/ScrollReveal";

const advantages = [
  {
    icon: Hammer,
    title: "Sistema Construtivo Racional",
    description: "Utilizamos um sistema construtivo industrializado para casas pré-fabricadas de madeira que reduz desperdícios, aumenta a precisão da montagem e garante maior qualidade estrutural para chalés de madeira e casas de campo.",
  },
  {
    icon: Zap,
    title: "Construção Mais Rápida",
    description: "A construção de um chalé de madeira ou casa pré-fabricada pode ser realizada em tempo muito menor que a alvenaria tradicional, ideal para quem deseja investir rapidamente em imóveis para Airbnb ou locação.",
  },
  {
    icon: ShieldCheck,
    title: "Manutenção Simples e Durável",
    description: "Utilizamos madeira tratada de alta qualidade, resistente a pragas, umidade e intempéries, garantindo durabilidade e manutenção previsível para casas de madeira em praia, campo ou áreas rurais.",
  },
  {
    icon: Wallet,
    title: "Excelente Custo-Benefício",
    description: "As casas pré-fabricadas de madeira oferecem um dos melhores custos-benefício da construção civil, sendo uma excelente opção para quem busca chalés para investimento, turismo ou moradia.",
  },
];

export const TechnicalAdvantagesSection = () => {
  return (
    <section id="tecnico" className="relative overflow-hidden bg-background py-20 md:py-32">
      <div className="container mx-auto px-4">
        <ScrollReveal className="mb-16 text-center mx-auto max-w-3xl">
          <span className="mb-6 inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
            Engenharia e Tecnologia
          </span>
          <h2 className="section-title mb-6 text-4xl font-bold leading-tight md:text-5xl text-foreground">
            Diferenciais Técnicos das <br />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent italic">
              Casas e Chalés de Madeira
            </span>
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            As <strong className="text-foreground">casas pré-fabricadas de madeira</strong> e chalés estão se tornando a escolha preferida de investidores e proprietários que buscam <strong className="text-foreground">construção rápida</strong>, durabilidade extrema e um <strong className="text-foreground">excelente custo-benefício</strong> em relação à alvenaria.
          </p>
        </ScrollReveal>

        <StaggerContainer className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-4">
          {advantages.map((item, index) => (
            <StaggerItem key={index} index={index} className="h-full">
              <div className="group h-full rounded-3xl border border-border/50 bg-card p-8 transition-all duration-500 hover:border-primary/40 hover:shadow-2xl hover:-translate-y-2">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <item.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-4 font-serif text-2xl font-bold text-foreground">
                  {item.title}
                </h3>
                <p className="leading-relaxed text-muted-foreground font-medium">
                  {item.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};
