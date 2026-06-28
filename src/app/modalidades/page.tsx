"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Check, 
  X, 
  Package, 
  Hammer, 
  Home, 
  Phone, 
  ChevronDown, 
  ArrowRight,
  Shield,
  Clock,
  Sparkles
} from "lucide-react";
import { Header } from "~/components/layout/Header";
import { FooterWoodBahia } from "~/components/layout/FooterWoodBahia";
import { WhatsAppButton } from "~/components/common/WhatsAppButton";
import { ScrollReveal, StaggerContainer, StaggerItem } from "~/components/common/ScrollReveal";

// Tabela de Itens Comparativos
const COMPARATIVE_ITEMS = [
  { name: "Pilares e Vigas de Sustentação", kit: true, partner: true, turnkey: true, note: "Madeira Pinus tratada em autoclave" },
  { name: "Estrutura de Paredes e Forros", kit: true, partner: true, turnkey: true, note: "Paredes estruturais autoportantes" },
  { name: "Estrutura de Telhado (Caibros/Barrotes)", kit: true, partner: true, turnkey: true, note: "Gradeamento de telhado completo" },
  { name: "Portas, Janelas e Ferragens", kit: false, partner: true, turnkey: true, note: "Esquadrias em madeira ou alumínio" },
  { name: "Cobertura (Telha Ecológica e Manta)", kit: false, partner: false, turnkey: true, note: "Manta térmica subcobertura" },
  { name: "Vidros Temperados (8mm)", kit: false, partner: false, turnkey: true, note: "Fechamento de janelas e portas" },
  { name: "Acabamento em Stain Protetor", kit: false, partner: false, turnkey: true, note: "Pintura impregnante hidrorrepelente" },
  { name: "Mão de Obra de Carpintaria (Montagem)", kit: false, partner: true, turnkey: true, note: "Cortes e ajustes no terreno" },
  { name: "Coordenação e Gestão Técnica", kit: false, partner: false, turnkey: true, note: "Responsabilidade e supervisão Wood Bahia" },
  { name: "Garantia de Execução de Obra", kit: false, partner: false, turnkey: true, note: "Fornecida pela construtora" },
  { name: "Fundação (Base de Sapatas/Radier)", kit: false, partner: false, turnkey: false, note: "Opcional contratado à parte" },
  { name: "Instalações Elétricas e Hidráulicas", kit: false, partner: false, turnkey: false, note: "Opcional contratado à parte" },
];

// FAQ das modalidades
const MODALITIES_FAQ = [
  {
    question: "Qual a diferença real nos contratos entre a Montagem Parceira e o Chave na Mão?",
    answer: "Na Montagem Parceira, você assina dois contratos: um de compra dos materiais com a Wood Bahia e outro de prestação de serviço diretamente com o carpinteiro parceiro indicado. É uma modalidade econômica e sem taxa de intermediação. Já no Chave na Mão, você assina um único contrato global com a Wood Bahia, que assume toda a responsabilidade jurídica, logística e técnica pela entrega da estrutura montada."
  },
  {
    question: "A fundação (base) do chalé está inclusa no Chave na Mão?",
    answer: "Por padrão, não. A fundação (seja sapatas de madeira, alvenaria ou placa radier) é um serviço de engenharia civil local e depende do tipo de solo do seu terreno. No entanto, você pode solicitar a inclusão da fundação na sua simulação e contratar a execução e gerenciamento desse serviço à parte diretamente com a Wood Bahia ou equipe parceira."
  },
  {
    question: "Como funciona a garantia do meu chalé de madeira?",
    answer: "A madeira Pinus tratada em autoclave possui 15 anos de garantia contra deterioração, cupins e fungos em todas as modalidades. Para o serviço de montagem, se você escolher a modalidade Chave na Mão, a Wood Bahia fornece garantia direta de execução. Na modalidade Parceira, a garantia do serviço é acordada direto no contrato com o carpinteiro credenciado."
  },
  {
    question: "Posso alterar o projeto original de um modelo nas modalidades?",
    answer: "Sim! Como as nossas peças estruturais são cortadas e ajustadas no local da obra, você tem flexibilidade total para redefinir layouts internos (como mover portas ou paredes de posição). No Kit e na Montagem Parceira, você combina essas mudanças diretamente com seu carpinteiro. No Chave na Mão, alinhamos as alterações estruturais durante a fase de projeto antes da produção."
  },
  {
    question: "Quais são as responsabilidades no Kit Madeiramento?",
    answer: "No Kit Madeiramento, a Wood Bahia é responsável apenas por fabricar e entregar a madeira tratada em seu terreno com tamanhos padrão próximos ao projeto. A descarga, armazenamento, contratação de profissionais de carpintaria, compra de pregos, ferragens, cobertura e execução total da obra são de inteira responsabilidade do cliente."
  }
];

export default function ModalitiesPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-primary/5 to-transparent" />

      <main className="relative z-10 pb-24 pt-28 sm:pt-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Hero */}
          <ScrollReveal className="mb-16 text-center max-w-4xl mx-auto">
            <span className="mb-4 inline-block rounded-full bg-secondary/10 px-4 py-2 text-sm font-semibold text-secondary">
              Transparência Comercial
            </span>
            <h1 className="font-serif mb-6 text-3xl font-bold leading-tight tracking-tight text-primary sm:text-4xl md:text-5xl lg:text-6xl">
              Nossas Modalidades
              <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                de Construção
              </span>
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
              Oferecemos 3 caminhos para tirar o seu projeto do papel. Entenda em qual deles você encontra a melhor relação entre economia, tempo e praticidade.
            </p>
          </ScrollReveal>

          {/* Cards das Modalidades */}
          <StaggerContainer className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-24 items-stretch">
            
            {/* Modalidade 1 */}
            <StaggerItem index={0} className="flex">
              <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-stone-200 flex flex-col justify-between w-full hover:shadow-xl transition-all duration-300">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-stone-50 text-stone-700 flex items-center justify-center mb-6">
                    <Package className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-stone-900 mb-2">1. Kit Madeiramento</h3>
                  <span className="text-xs uppercase tracking-wider font-bold text-gray-400 block mb-6">Foco em Economia e Equipe Própria</span>
                  <p className="text-sm text-gray-500 leading-relaxed mb-6">
                    Adquira exclusivamente o esqueleto de madeira tratada. Esta opção é ideal para construtores autônomos, engenheiros ou clientes que já possuem carpinteiros de total confiança contratados na sua região.
                  </p>
                  <ul className="space-y-3 mb-8 border-t border-stone-100 pt-6">
                    <li className="flex items-center gap-2.5 text-xs text-stone-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={3} />
                      Estrutura de madeira pinus em autoclave
                    </li>
                    <li className="flex items-center gap-2.5 text-xs text-stone-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={3} />
                      15 anos de garantia contra cupins e fungos
                    </li>
                    <li className="flex items-center gap-2.5 text-xs text-red-500">
                      <X className="w-4 h-4 shrink-0" strokeWidth={3} />
                      Montagem e ferragens sob responsabilidade do cliente
                    </li>
                  </ul>
                </div>
                <Link
                  href="/modelos"
                  className="w-full py-4 text-center rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <span>Ver Modelos</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </StaggerItem>

            {/* Modalidade 2 */}
            <StaggerItem index={1} className="flex">
              <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-stone-200 flex flex-col justify-between w-full hover:shadow-xl transition-all duration-300">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 text-[#B06D46] flex items-center justify-center mb-6">
                    <Hammer className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-stone-900 mb-2">2. Kit + Montagem Parceira</h3>
                  <span className="text-xs uppercase tracking-wider font-bold text-[#B06D46] block mb-6">Fuga de Intermediação Comercial</span>
                  <p className="text-sm text-gray-500 leading-relaxed mb-6">
                    Nós vendemos o Kit de Madeiramento e indicamos montadores parceiros credenciados na sua região. O contrato de montagem é fechado diretamente entre você e o profissional, gerando economia sem taxas extras.
                  </p>
                  <ul className="space-y-3 mb-8 border-t border-stone-100 pt-6">
                    <li className="flex items-center gap-2.5 text-xs text-stone-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={3} />
                      Esquadrias de portas e janelas de madeira inclusas
                    </li>
                    <li className="flex items-center gap-2.5 text-xs text-stone-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={3} />
                      Mão de obra contratada direto com preço tabelado
                    </li>
                    <li className="flex items-center gap-2.5 text-xs text-stone-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={3} />
                      Isenção de custos administrativos de construtora
                    </li>
                  </ul>
                </div>
                <a
                  href="https://wa.me/5571992936290?text=Olá! Gostaria de entender mais sobre a modalidade de Montagem Parceira."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 text-center rounded-2xl bg-amber-50 hover:bg-[#B06D46]/10 text-[#B06D46] font-bold text-sm transition-colors border border-[#B06D46]/20 flex items-center justify-center gap-2"
                >
                  <span>Orçamento de Montagem</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </StaggerItem>

            {/* Modalidade 3 */}
            <StaggerItem index={2} className="flex">
              <div className="bg-[#FAF8F5] p-8 md:p-10 rounded-[2.5rem] border border-[#E8DCCF] flex flex-col justify-between w-full shadow-[0_12px_45px_rgba(182,109,70,0.06)] hover:shadow-2xl transition-all duration-300 relative">
                <div className="absolute -top-3 right-6 rounded-full bg-[#8A3A1B] text-white text-[10px] font-bold tracking-widest uppercase px-4 py-1">
                  Recomendado
                </div>
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-white text-[#8A3A1B] flex items-center justify-center mb-6 shadow-sm">
                    <Home className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-stone-900 mb-2">3. Wood Bahia Chave na Mão</h3>
                  <span className="text-xs uppercase tracking-wider font-bold text-[#8A3A1B] block mb-6">Comodidade e Responsabilidade Única</span>
                  <p className="text-sm text-gray-500 leading-relaxed mb-6">
                    A Wood Bahia assume a responsabilidade total de execução da estrutura. Nós entregamos o kit estrutural montado, coberto com telha e manta térmica, com portas, janelas e vidros instalados, além do Stain protetor aplicado.
                  </p>
                  <ul className="space-y-3 mb-8 border-t border-[#E8DCCF] pt-6">
                    <li className="flex items-center gap-2.5 text-xs text-stone-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={3} />
                      Coordenação de engenharia e gestão de obra inclusas
                    </li>
                    <li className="flex items-center gap-2.5 text-xs text-stone-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={3} />
                      Estrutura concluída (com telhas, vidros e portas)
                    </li>
                    <li className="flex items-center gap-2.5 text-xs text-stone-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={3} />
                      Contrato único e garantia global Wood Bahia
                    </li>
                  </ul>
                </div>
                <a
                  href="https://wa.me/5571992936290?text=Olá! Quero solicitar uma proposta para a modalidade Chave na Mão."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 text-center rounded-2xl bg-[#8A3A1B] hover:bg-[#732F14] text-white font-bold text-sm transition-all shadow flex items-center justify-center gap-2"
                >
                  <span>Solicitar Orçamento</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </StaggerItem>

          </StaggerContainer>

          {/* Tabela Comparativa */}
          <ScrollReveal className="max-w-6xl mx-auto mb-24">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-[#4A2B1D] font-serif mb-4">Tabela Comparativa de Escopo</h2>
              <p className="text-sm text-muted-foreground">Analise os itens inclusos e não inclusos em cada modalidade antes de fechar o projeto.</p>
            </div>

            <div className="bg-white rounded-[2rem] border border-stone-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200">
                      <th className="p-6 text-sm font-bold text-stone-700 w-1/3">Itens da Obra</th>
                      <th className="p-6 text-sm font-bold text-stone-700 text-center w-1/6">Kit Madeiramento</th>
                      <th className="p-6 text-sm font-bold text-stone-700 text-center w-1/6">Kit + Montagem Parceira</th>
                      <th className="p-6 text-sm font-bold text-[#8A3A1B] text-center w-1/6 bg-amber-50/20">Chave na Mão</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-sm">
                    {COMPARATIVE_ITEMS.map((item, idx) => (
                      <tr key={idx} className="hover:bg-stone-50/50 transition-colors">
                        <td className="p-6 font-medium text-stone-800">
                          <div>
                            {item.name}
                            <span className="block text-[11px] text-gray-400 font-normal mt-0.5">{item.note}</span>
                          </div>
                        </td>
                        <td className="p-6 text-center">
                          {item.kit ? (
                            <Check className="w-5 h-5 text-emerald-600 mx-auto" strokeWidth={3} />
                          ) : (
                            <X className="w-5 h-5 text-red-400 mx-auto" strokeWidth={2} />
                          )}
                        </td>
                        <td className="p-6 text-center">
                          {item.partner ? (
                            <Check className="w-5 h-5 text-emerald-600 mx-auto" strokeWidth={3} />
                          ) : (
                            <X className="w-5 h-5 text-red-400 mx-auto" strokeWidth={2} />
                          )}
                        </td>
                        <td className="p-6 text-center bg-amber-50/10">
                          {item.turnkey ? (
                            <Check className="w-5 h-5 text-emerald-600 mx-auto" strokeWidth={3} />
                          ) : (
                            <X className="w-5 h-5 text-red-400 mx-auto" strokeWidth={2} />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </ScrollReveal>

          {/* Destaque Diferenciais */}
          <ScrollReveal className="max-w-6xl mx-auto mb-24 grid grid-cols-1 md:grid-cols-3 gap-8 bg-[#FAF8F5] border border-stone-200 rounded-[2.5rem] p-10">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm text-[#B06D46]">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-stone-800 mb-2">15 Anos de Garantia</h4>
                <p className="text-xs text-gray-500 leading-relaxed">Madeira Pinus tratada em autoclave para resistir ao sol, chuva, cupins e apodrecimento por mais tempo.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm text-[#B06D46]">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-stone-800 mb-2">Montagem Acelerada</h4>
                <p className="text-xs text-gray-500 leading-relaxed">Em média de 30 a 45 dias a estrutura da casa é montada inteiramente por especialistas no seu terreno.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm text-[#B06D46]">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-stone-800 mb-2">Madeira Sustentável</h4>
                <p className="text-xs text-gray-500 leading-relaxed">Trabalhamos exclusivamente com madeira certificada de reflorestamento, gerando menor impacto ambiental na sua obra.</p>
              </div>
            </div>
          </ScrollReveal>

          {/* FAQ */}
          <ScrollReveal className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-[#4A2B1D] font-serif mb-4">Dúvidas Frequentes sobre Modalidades</h2>
              <p className="text-sm text-muted-foreground">Tudo o que você precisa saber sobre as formas de construir e suas responsabilidades.</p>
            </div>

            <div className="space-y-4">
              {MODALITIES_FAQ.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="bg-white rounded-2xl border border-stone-200 overflow-hidden transition-all duration-300">
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full text-left p-6 font-bold text-stone-800 flex justify-between items-center hover:bg-stone-50/50"
                    >
                      <span className="text-sm sm:text-base pr-4">{faq.question}</span>
                      <ChevronDown className={`w-5 h-5 shrink-0 transition-transform text-[#B06D46] ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    {isOpen && (
                      <div className="p-6 border-t border-stone-100 text-sm text-gray-500 leading-relaxed bg-[#FAF8F5]">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollReveal>

        </div>
      </main>

      <FooterWoodBahia />
      <WhatsAppButton />
    </div>
  );
}
