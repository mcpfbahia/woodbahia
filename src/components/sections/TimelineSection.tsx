"use client";

import React, { useState } from "react";
import { Check, ClipboardList, PenTool, Truck, Hammer, ShieldCheck, Warehouse } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "../common/ScrollReveal";

type Passo = {
  numero: string;
  titulo: string;
  descricao: string;
  icon: React.ComponentType<any>;
};

export const TimelineSection = () => {
  const [modalidade, setModalidade] = useState<1 | 2 | 3>(3);

  const fluxos: Record<1 | 2 | 3, Passo[]> = {
    1: [
      {
        numero: "01",
        titulo: "Projeto",
        icon: PenTool,
        descricao: "Definimos as plantas estruturais e o manual de montagem com base no modelo selecionado.",
      },
      {
        numero: "02",
        titulo: "Contrato",
        icon: ClipboardList,
        descricao: "Fechamento do contrato de fornecimento e fabricação exclusiva do Kit Madeiramento.",
      },
      {
        numero: "03",
        titulo: "Produção",
        icon: Warehouse,
        descricao: "Preparação das madeiras Pinus tratadas em autoclave na nossa fábrica (~30 dias).",
      },
      {
        numero: "04",
        titulo: "Entrega",
        icon: Truck,
        descricao: "Transporte e descarga dos materiais no seu terreno. As peças de madeira chegam para cortes no local.",
      },
      {
        numero: "05",
        titulo: "Montagem",
        icon: Hammer,
        descricao: "Realizada inteiramente pela sua equipe ou carpinteiro particular (custos de montagem e ferragens sob sua responsabilidade).",
      },
      {
        numero: "06",
        titulo: "Entrega Final",
        icon: ShieldCheck,
        descricao: "Esqueleto estrutural de madeira entregue. Você segue de forma independente com acabamentos e complementos.",
      },
    ],
    2: [
      {
        numero: "01",
        titulo: "Projeto",
        icon: PenTool,
        descricao: "Definição do projeto de madeiramento e indicação de carpinteiros parceiros credenciados na sua região.",
      },
      {
        numero: "02",
        titulo: "Contrato",
        icon: ClipboardList,
        descricao: "Dois contratos separados: compra do kit (Wood Bahia) e montagem direta com preço tabelado (Carpinteiro).",
      },
      {
        numero: "03",
        titulo: "Produção",
        icon: Warehouse,
        descricao: "Fabricação do kit de madeira em Pinus tratado, com cronograma integrado com o carpinteiro parceiro.",
      },
      {
        numero: "04",
        titulo: "Entrega",
        icon: Truck,
        descricao: "Entrega da madeira no lote. O carpinteiro parceiro acompanha a descarga e faz a conferência técnica.",
      },
      {
        numero: "05",
        titulo: "Montagem",
        icon: Hammer,
        descricao: "O carpinteiro executa a montagem da estrutura. Você compra e fornece complementos como telhas, esquadrias e vidros.",
      },
      {
        numero: "06",
        titulo: "Entrega Final",
        icon: ShieldCheck,
        descricao: "Estrutura principal de madeira montada e aprovada pelo parceiro. Economia máxima de até 30% sem intermediação.",
      },
    ],
    3: [
      {
        numero: "01",
        titulo: "Projeto",
        icon: PenTool,
        descricao: "Elaboração do projeto completo integrando madeiramento, esquadrias, cobertura e infraestrutura básica.",
      },
      {
        numero: "02",
        titulo: "Contrato",
        icon: ClipboardList,
        descricao: "Contrato único unificado sob responsabilidade global da Wood Bahia, cobrindo materiais, montagem, acabamentos e garantia.",
      },
      {
        numero: "03",
        titulo: "Produção",
        icon: Warehouse,
        descricao: "Separação de insumos: kit madeira, telhas, portas, janelas, vidros temperados, stain e kits de elétrica/hidráulica básica.",
      },
      {
        numero: "04",
        titulo: "Entrega",
        icon: Truck,
        descricao: "Logística integrada e descarga com conferência completa feita pela equipe própria da Wood Bahia no seu terreno.",
      },
      {
        numero: "05",
        titulo: "Montagem",
        icon: Hammer,
        descricao: "Equipe própria realiza a montagem estrutural, instalações elétricas e hidráulicas básicas, cobertura, vidros e stain protetor.",
      },
      {
        numero: "06",
        titulo: "Entrega Final",
        icon: ShieldCheck,
        descricao: "Chaves na mão! Estrutura concluída e montada no seu lote, restando apenas acabamentos finos de pintura interna e decoração.",
      },
    ],
  };

  const passosAtuais = fluxos[modalidade];

  return (
    <section id="como-funciona" className="w-full bg-[#FAF8F5] py-24 lg:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        
        {/* Cabeçalho da Seção */}
        <ScrollReveal className="text-center mb-12 max-w-3xl">
          <span className="mb-4 inline-block rounded-full bg-secondary/10 px-4 py-2 text-sm font-semibold text-secondary">
            Processo de Obra
          </span>
          <h2 className="text-3xl font-bold md:text-5xl text-[#4A2B1D] mb-6 tracking-tight leading-tight">
            Escolha sua modalidade e <br/>
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent italic">
              acompanhe o fluxo da obra
            </span>
          </h2>
          <p className="text-base text-muted-foreground md:text-lg">
            Selecione uma das opções abaixo para visualizar como funciona o passo a passo da contratação até a entrega das chaves.
          </p>
        </ScrollReveal>

        {/* Seletor de Modalidade (Tabs) */}
        <ScrollReveal className="w-full max-w-3xl mb-20">
          <div className="flex flex-col sm:flex-row p-2 bg-stone-100 rounded-3xl gap-2 border border-stone-200">
            <button
              onClick={() => setModalidade(1)}
              className={`flex-1 py-4 px-6 rounded-2xl text-sm font-bold transition-all duration-300 ${
                modalidade === 1
                  ? "bg-white text-stone-900 shadow-md"
                  : "text-gray-500 hover:text-stone-900"
              }`}
            >
              1. Kit Madeiramento
            </button>
            <button
              onClick={() => setModalidade(2)}
              className={`flex-1 py-4 px-6 rounded-2xl text-sm font-bold transition-all duration-300 ${
                modalidade === 2
                  ? "bg-white text-[#B06D46] shadow-md"
                  : "text-gray-500 hover:text-[#B06D46]"
              }`}
            >
              2. Kit + Montagem Parceira
            </button>
            <button
              onClick={() => setModalidade(3)}
              className={`flex-1 py-4 px-6 rounded-2xl text-sm font-bold transition-all duration-300 ${
                modalidade === 3
                  ? "bg-[#8A3A1B] text-white shadow-md"
                  : "text-gray-500 hover:text-[#8A3A1B]"
              }`}
            >
              3. Chave na Mão
            </button>
          </div>
        </ScrollReveal>

        {/* Container da Timeline */}
        <div className="relative w-full max-w-4xl mx-auto">
          {/* Linha Central (Vertical) */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] bg-[#E2D6CA] md:-translate-x-1/2 rounded-full"></div>

          {/* Mapeamento dos Passos */}
          <StaggerContainer key={modalidade} className="space-y-12 md:space-y-0 relative z-10">
            {passosAtuais.map((passo, index) => {
              const isEven = index % 2 === 0;
              const Icon = passo.icon;

              return (
                <StaggerItem 
                  key={index}
                  index={index}
                  className={`relative flex items-center md:justify-between w-full
                    ${isEven ? "md:flex-row-reverse" : "md:flex-row"}
                    group
                  `}
                >
                  
                  {/* Marcador da Timeline com Ícone Dinâmico */}
                  <div className={`absolute left-8 md:left-1/2 w-12 h-12 rounded-full border-4 border-[#FAF8F5] shadow-md flex items-center justify-center -translate-x-1/2 md:-translate-x-1/2 z-20 transition-all duration-500 group-hover:scale-110
                    ${modalidade === 3 ? "bg-[#8A3A1B] group-hover:bg-[#732F14]" : "bg-[#B06D46] group-hover:bg-[#8A3A1B]"}
                  `}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>

                  {/* Espaçador invisível para manter o layout no Desktop */}
                  <div className="hidden md:block md:w-5/12"></div>

                  {/* Card de Conteúdo */}
                  <div 
                    className={`
                      w-full ml-20 md:ml-0 md:w-5/12 bg-white p-6 md:p-8 rounded-[2rem] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-stone-100 
                      transition-all duration-500 hover:shadow-lg hover:-translate-y-1
                      ${isEven ? "md:text-right" : "md:text-left"} text-left
                    `}
                  >
                    <div className={`flex items-center gap-3 mb-3 ${isEven ? "md:justify-end" : "md:justify-start"}`}>
                      <span className={`font-black text-lg ${modalidade === 3 ? "text-[#8A3A1B]" : "text-[#B06D46]"}`}>
                        {passo.numero}
                      </span>
                      <h3 className="text-lg font-bold text-[#111827]">{passo.titulo}</h3>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {passo.descricao}
                    </p>
                  </div>

                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>

      </div>
    </section>
  );
};
