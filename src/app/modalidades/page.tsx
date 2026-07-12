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
  Sparkles,
  Zap,
  Droplet,
  Leaf
} from "lucide-react";
import { Header } from "~/components/layout/Header";
import { FooterWoodBahia } from "~/components/layout/FooterWoodBahia";
import { WhatsAppButton } from "~/components/common/WhatsAppButton";
import { ScrollReveal, StaggerContainer, StaggerItem } from "~/components/common/ScrollReveal";

// Tabela de Itens Comparativos
const COMPARATIVE_ITEMS = [
  { name: "Projetos Arquitetônicos e Estruturais", kit: true, partner: true, turnkey: true, note: "Projetos técnicos e modulação para montagem" },
  { name: "Estrutura e Materiais de Paredes (Pinus Autoclave)", kit: true, partner: true, turnkey: true, note: "Vigas, caibros, assoalho, frontais, forro, canaletas, rodapé, sarrafos" },
  { name: "Indicação de Montagem Parceira", kit: false, partner: true, turnkey: true, note: "Carpinteiros credenciados e homologados pela fábrica" },
  { name: "Acompanhamento Técnico", kit: false, partner: false, turnkey: true, note: "Gestão técnica e controle de qualidade da construtora" },
  { name: "Cobertura, Esquadrias e Vidros Premium", kit: false, partner: false, turnkey: true, note: "Telhas, manta térmica, portas, janelas e vidros temperados 8mm" },
  { name: "Montagem da Estrutura", kit: false, partner: false, turnkey: true, note: "Na Montagem Parceira, serviço contratado sob contrato separado direto com o carpinteiro" },
  { name: "Fundação e Alicerce", kit: false, partner: false, turnkey: true, note: "Sapatas de eucalipto tratadas inclusas; bases em alvenaria/radier sob consulta" },
  { name: "Instalações Elétricas e Hidráulicas Básicas", kit: false, partner: false, turnkey: true, note: "Infraestrutura básica de tubulação e fiação interna" },
  { name: "Acabamentos e Pintura em Stain Protetor", kit: false, partner: false, turnkey: true, note: "Pintura protetora externa hidrorrepelente aplicada" },
  { name: "Gestão da Obra e Licenciamento", kit: false, partner: false, turnkey: true, note: "Coordenação operacional e gestão de equipe técnica Wood Bahia" },
];

// FAQ das modalidades
const MODALITIES_FAQ = [
  {
    question: "Qual a diferença real nos contratos entre a Montagem Parceira e o Chave na Mão?",
    answer: "Na Montagem Parceira, você assina dois contratos separados: um de compra dos materiais com a Wood Bahia e outro de prestação de serviço diretamente com o carpinteiro parceiro indicado. É uma modalidade econômica e sem taxa de intermediação administrativa. Já no Chave na Mão, você assina um único contrato global com a Wood Bahia, que assume toda a responsabilidade jurídica, logística, técnica e de mão de obra pela entrega da estrutura montada."
  },
  {
    question: "A fundação (base) do chalé está inclusa no Chave na Mão?",
    answer: "Depende da proposta e do modelo. Nos modelos construídos sobre sapatas de eucalipto tratado, a fundação normalmente já está inclusa no escopo do Chave na Mão. Se for necessária uma base do tipo radier de concreto ou alvenaria, ela normalmente não está inclusa no escopo básico, mas pode ser orçada e adicionada sob consulta na proposta final."
  },
  {
    question: "Como funciona a garantia do meu chalé de madeira?",
    answer: "A madeira Pinus tratada em autoclave possui 15 anos de garantia contra deterioração, cupins e fungos em todas as modalidades. Para o serviço de montagem, se você escolher a modalidade Chave na Mão, a Wood Bahia fornece garantia direta de execução. Na modalidade Parceira, a garantia da montagem é acordada diretamente no contrato com o carpinteiro credenciado."
  },
  {
    question: "Quais instalações elétricas e hidráulicas estão inclusas no Chave na Mão?",
    answer: "No Chave na Mão, entregamos a infraestrutura básica de elétrica e hidráulica (passagem de fiação, eletrodutos, canos e conexões embutidas nas paredes estruturais). Itens como louças (pias, vasos sanitários), metais (torneiras, chuveiros), tomadas, interruptores, lustres e caixa d'água/biodigestor não estão inclusos, permitindo que você escolha os acabamentos estéticos de sua preferência."
  },
  {
    question: "Quais são as responsabilidades no Kit Madeiramento?",
    answer: "No Kit Madeiramento, a Wood Bahia é responsável apenas por fabricar e entregar a madeira tratada no seu terreno (com manual técnico e suporte por vídeo). A descarga, armazenamento, ferramentas, contratação de profissionais de carpintaria, compra de pregos, parafusos, ferragens, cobertura, esquadrias, vidros e acabamentos são de inteira responsabilidade do cliente."
  }
];, cobertura e execução total da obra são de inteira responsabilidade do cliente."
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
              Oferecemos 3 caminhos para tirar o seu projeto do papel. Entenda em qual deles voc�          {/* Cards das Modalidades */}
          <StaggerContainer className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-24 items-stretch">
            
            {/* Modalidade 1 */}
            <StaggerItem index={0} className="flex">
              <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-stone-200 flex flex-col justify-between w-full hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-stone-50 rounded-bl-[2.5rem] -z-10" />
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-stone-50 text-stone-700 flex items-center justify-center mb-6">
                    <Package className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-stone-900 mb-2">1. Kit Madeiramento</h3>
                  <span className="text-xs uppercase tracking-wider font-bold text-stone-400 block mb-6">Apenas Madeira & Suporte Técnico</span>
                  <p className="text-sm text-gray-500 leading-relaxed mb-6">
                    Adquira exclusivamente o madeiramento em Pinus tratado em autoclave cortado próximo às medidas do projeto. Ideal para construtores ou quem possui equipe de carpintaria própria.
                  </p>
                  <ul className="space-y-3 mb-8 border-t border-stone-100 pt-6">
                    <li className="flex items-center gap-2.5 text-xs text-stone-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={3} />
                      Só a madeira Pinus tratada (vigas, caibros, assoalho, etc.)
                    </li>
                    <li className="flex items-center gap-2.5 text-xs text-stone-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={3} />
                      Manual de montagem e suporte por vídeo chamada
                    </li>
                    <li className="flex items-center gap-2.5 text-xs text-stone-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={3} />
                      15 anos de garantia na madeira contra cupins e fungos
                    </li>
                  </ul>
                  <p className="text-[10px] text-red-500 italic mt-4 border-t border-red-100 pt-3">
                    Aviso: Mão de obra, telhas, ferragens, vidros, instalações elétrica e hidráulica são de responsabilidade do cliente.
                  </p>
                </div>
                <Link
                  href="/modelos"
                  className="w-full py-4 mt-8 text-center rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <span>Ver Modelos</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </StaggerItem>

            {/* Modalidade 2 */}
            <StaggerItem index={1} className="flex">
              <div className="bg-[#FAF8F5] p-8 md:p-10 rounded-[2.5rem] border border-[#E8DCCF] flex flex-col justify-between w-full shadow-[0_12px_45px_rgba(182,109,70,0.06)] hover:shadow-2xl transition-all duration-300 relative">
                <div className="absolute -top-3 right-6 rounded-full bg-[#B06D46] text-white text-[10px] font-bold tracking-widest uppercase px-4 py-1">
                  Melhor Custo-Benefício
                </div>
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-white text-[#B06D46] flex items-center justify-center mb-6 shadow-sm">
                    <Hammer className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-stone-900 mb-2">2. Kit + Montagem Parceira</h3>
                  <span className="text-xs uppercase tracking-wider font-bold text-[#B06D46] block mb-6">Contratos Separados e Isenção de Taxas</span>
                  <p className="text-sm text-gray-500 leading-relaxed mb-6">
                    Compre o Kit de Madeiramento da Wood Bahia e contrate carpinteiros parceiros credenciados na sua região com preço tabelado. Economia de até 30% ao evitar taxas administrativas da construtora.
                  </p>
                  
                  {/* Esquema de contratos */}
                  <div className="bg-white/80 border border-stone-200/60 rounded-2xl p-4 mb-6 text-xs space-y-2">
                    <div className="flex justify-between items-center text-stone-700">
                      <span className="font-bold">Contrato 1 (Wood Bahia):</span>
                      <span className="text-[#B06D46]">Kit de Madeira</span>
                    </div>
                    <div className="flex justify-between items-center text-stone-700">
                      <span className="font-bold">Contrato 2 (Carpinteiro):</span>
                      <span className="text-emerald-700">Serviço de Montagem</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8 border-t border-stone-100 pt-6">
                    <li className="flex items-center gap-2.5 text-xs text-stone-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={3} />
                      Toda a estrutura de madeira Pinus em autoclave inclusa
                    </li>
                    <li className="flex items-center gap-2.5 text-xs text-stone-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={3} />
                      Indicação de carpinteiros homologados e experientes
                    </li>
                    <li className="flex items-center gap-2.5 text-xs text-stone-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={3} />
                      Economia real sem intermediários e taxas extras
                    </li>
                  </ul>
                  <p className="text-[10px] text-stone-500 italic mt-4 border-t border-stone-100 pt-3">
                    Obs: O cliente compra à parte os complementos como telhas, vidros, fiação, encanamento, portas e janelas.
                  </p>
                </div>
                <a
                  href="https://wa.me/5571992936290?text=Olá! Gostaria de entender mais sobre a modalidade de Montagem Parceira."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 text-center rounded-2xl bg-[#8A3A1B] hover:bg-[#732F14] text-white font-bold text-sm transition-all shadow flex items-center justify-center gap-2"
                >
                  <span>Orçamento de Montagem</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </StaggerItem>

            {/* Modalidade 3 */}
            <StaggerItem index={2} className="flex">
              <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-stone-200 flex flex-col justify-between w-full hover:shadow-xl transition-all duration-300">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-stone-50 text-[#8A3A1B] flex items-center justify-center mb-6">
                    <Home className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-stone-900 mb-2">3. Wood Bahia Chave na Mão</h3>
                  <span className="text-xs uppercase tracking-wider font-bold text-emerald-700 block mb-6">Comodidade Total e Garantia Unificada</span>
                  <p className="text-sm text-gray-500 leading-relaxed mb-6">
                    Assuma zero preocupação de obra. A Wood Bahia gerencia a montagem estrutural completa de ponta a ponta e entrega o chalé estruturado pronto e acabado externamente.
                  </p>
                  <ul className="space-y-3 mb-8 border-t border-[#E8DCCF] pt-6">
                    <li className="flex items-center gap-2.5 text-xs text-stone-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={3} />
                      Portas, janelas, vidros e cobertura instalados
                    </li>
                    <li className="flex items-center gap-2.5 text-xs text-stone-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={3} />
                      Instalações elétricas e hidráulicas básicas e pintura inclusas
                    </li>
                    <li className="flex items-center gap-2.5 text-xs text-stone-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={3} />
                      Contrato de responsabilidade e garantia global Wood Bahia
                    </li>
                  </ul>
                  <p className="text-[10px] text-stone-500 italic mt-4 border-t border-[#E8DCCF] pt-3">
                    Você recebe a estrutura principal pronta com sapatas de eucalipto inclusas.
                  </p>
                </div>
                <a
                  href="https://wa.me/5571992936290?text=Olá! Quero solicitar uma proposta para a modalidade Chave na Mão."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 text-center rounded-2xl bg-[#8A3A1B] hover:bg-[#732F14] text-white font-bold text-sm transition-colors flex items-center justify-center gap-2"
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
              <h2 className="text-2xl font-bold text-[#4A2B1D] font-serif mb-4">Comparativo das Modalidades</h2>
              <p className="text-sm text-muted-foreground">Analise os itens inclusos e não inclusos em cada uma das opções comerciais.</p>
            </div>

            <div className="bg-white rounded-[2rem] border border-stone-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200">
                      <th className="p-6 text-sm font-bold text-stone-700 w-1/3">Item do Projeto</th>
                      <th className="p-6 text-sm font-bold text-stone-700 text-center w-1/6">Kit Madeiramento</th>
                      <th className="p-6 text-sm font-bold text-stone-700 text-center w-1/6">Kit + Parceiro</th>
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
            <div className="mt-4 px-4 text-xs text-gray-400 space-y-1">
              <p>* **Kit + Parceiro:** Vendemos apenas o Kit Madeiramento e indicamos carpinteiros parceiros. Outros complementos de obra por conta do cliente.</p>
              <p>* **Chave na Mão:** A fundação civil (radier de concreto/alvenaria) e acabamentos finos são sob proposta e cotação à parte. Sapatas de eucalipto tratadas normalmente inclusas.</p>
            </div>
          </ScrollReveal>

          {/* Slide 6: Detalhamento do Kit Madeiramento */}
          <ScrollReveal className="max-w-6xl mx-auto mb-24">
            <div className="text-center mb-12">
              <span className="mb-4 inline-block rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700">
                Transparência no Kit
              </span>
              <h2 className="text-2xl font-bold text-[#4A2B1D] font-serif mb-4">O que está incluso no Kit Madeiramento?</h2>
              <p className="text-sm text-muted-foreground">Entenda exatamente o que você recebe ao adquirir apenas o nosso Kit de madeira.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Inclusos */}
              <div className="bg-emerald-50/40 border border-emerald-100 rounded-[2.5rem] p-8 md:p-10">
                <h3 className="text-lg font-bold text-emerald-800 mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  Itens Inclusos
                </h3>
                <ul className="space-y-4">
                  {[
                    "Estrutura de madeira tratada (Pilares, Vigas, Caibros, Terças)",
                    "Materiais de madeira estrutural para corte e montagem no local (Assoalho, forro, frontais, canaletas, meia cana, rodapé e sarrafos)",
                    "Manual detalhado de montagem com esquemas técnicos das peças",
                    "Projetos arquitetônicos e estruturais completos do modelo",
                    "Suporte técnico em tempo real por vídeo chamada para sua equipe de carpintaria"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-stone-700">
                      <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" strokeWidth={3} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Não Inclusos */}
              <div className="bg-stone-50 border border-stone-200/60 rounded-[2.5rem] p-8 md:p-10">
                <h3 className="text-lg font-bold text-stone-700 mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-stone-400" />
                  NÃO Inclusos no Kit
                </h3>
                <ul className="space-y-4">
                  {[
                    "Mão de obra para cortes e montagem da estrutura",
                    "Fundação, alicerces civis e sapatas de sustentação no terreno",
                    "Cobertura final (Telhado ecológico e mantas de isolamento térmico)",
                    "Esquadrias completas (Portas de correr, portas internas e janelas)",
                    "Pintura externa, seladores e stain protetor de madeira",
                    "Instalações e materiais elétricos e hidráulicos",
                    "Mobiliários, cubas, pias e louças sanitárias",
                    "Kit de conectores metálicos, parafusos, pregos e fixações de montagem"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-stone-500">
                      <X className="w-5 h-5 text-stone-400 shrink-0 mt-0.5" strokeWidth={2} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ScrollReveal>

          {/* Slide 7: O que NÃO está incluso na construção (Geral) */}
          <ScrollReveal className="max-w-4xl mx-auto mb-24 bg-[#FAF8F5] border border-amber-900/10 rounded-[2.5rem] p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-[#B06D46]" />
            <h2 className="text-2xl font-bold text-[#4A2B1D] font-serif mb-4">O que não está incluso na construção? (Geral)</h2>
            <p className="text-sm text-stone-500 max-w-2xl mx-auto mb-8 leading-relaxed">
              Alguns serviços e itens de acabamento dependem diretamente das preferências do cliente, do tipo de solo ou de cotações locais. Por isso, não estão inclusos de forma padrão em nenhuma modalidade:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 text-left max-w-3xl mx-auto">
              <div className="bg-white rounded-2xl p-5 border border-stone-200/50 shadow-sm flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-amber-50 text-[#B06D46] flex items-center justify-center mb-3">
                  <Hammer className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-stone-800 mb-1">Fundação Civil</h4>
                <p className="text-[11px] text-stone-500">Alvenaria, radier e concreto variam conforme o relevo do terreno.</p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-stone-200/50 shadow-sm flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-amber-50 text-[#B06D46] flex items-center justify-center mb-3">
                  <Zap className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-stone-800 mb-1">Acabamentos Elétricos</h4>
                <p className="text-[11px] text-stone-500">Tomadas, interruptores finais (espelhos), luminárias e lustres.</p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-stone-200/50 shadow-sm flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-amber-50 text-[#B06D46] flex items-center justify-center mb-3">
                  <Droplet className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-stone-800 mb-1">Acabamentos Hidráulicos</h4>
                <p className="text-[11px] text-stone-500">Louças (pias, sanitários), metais (torneiras), biodigestor e caixa d'água.</p>
              </div>
            </div>

            <p className="text-[11px] text-stone-400 italic">
              * Nota: Pisos cerâmicos/revestimentos e decoração interna não fazem parte do escopo de entrega das estruturas.
            </p>
          </ScrollReveal>    </tr>
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
