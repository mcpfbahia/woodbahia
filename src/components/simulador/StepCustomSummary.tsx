"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle, RotateCcw } from "lucide-react";
import { InvestmentSimulationTable } from "./InvestmentSimulationTable";
import type { CustomProjectConfig } from "./StepCustomProject";
import { calculateInvestmentSimulation, formatBRL } from "~/lib/investment-calculator";

interface Props {
  clientData: { name: string; city: string; state: string; distance?: number };
  config: CustomProjectConfig;
  onBack: () => void;
  onReset: () => void;
}

export function StepCustomSummary({ clientData, config, onBack, onReset }: Props) {
  const simulation = calculateInvestmentSimulation({
    modelId: 'custom',
    customArea: config.area,
    foundationType: 'eucalyptus',
    customType: config.customType,
    isDuplex: config.isDuplex,
    customBedrooms: config.bedrooms,
    customSuites: config.suites,
    hasSocialBathroom: config.hasSocialBathroom,
  });

  const totalBanheiros = config.suites + (config.hasSocialBathroom ? 1 : 0);
  const estilo = config.customType === 'casa' 
    ? (config.isDuplex ? 'Casa Duplex' : 'Casa Térrea')
    : (config.isDuplex ? 'Chalé Duplex' : 'Chalé');

  const whatsappMessage = [
    `Olá! Fiz uma simulação de *Projeto Sob Medida* no site da Wood Bahia e gostaria de conversar com um especialista.`,
    ``,
    `📋 *DADOS DO PROJETO SOB MEDIDA*`,
    `👤 Cliente: ${clientData.name || 'Não informado'} - ${clientData.city || '-'}/${clientData.state || '-'}`,
    clientData.distance ? `📍 Distância estimada: ${clientData.distance} km` : ``,
    `🏠 Estilo: ${estilo}`,
    `📐 Metragem: ${config.area} m²`,
    `🛏️ Quartos: ${config.bedrooms} (${config.suites} suíte${config.suites > 1 ? 's' : ''})`,
    `🚿 Banheiros: ${totalBanheiros} (${config.hasSocialBathroom ? 'Com banheiro social' : 'Apenas suítes'})`,
    config.isDuplex ? `🪜 Pavimentos: Duplex / Mezanino` : `🏢 Pavimentos: Térreo`,
    ``,
    `💰 *INVESTIMENTO GLOBAL ESTIMADO:*`,
    `• Subtotal Produtos: ${formatBRL(simulation.subtotalProdutos)}`,
    `• Subtotal Serviços: ${formatBRL(simulation.subtotalServicos)}`,
    `• Contingência e Canteiro (10%): ${formatBRL(simulation.contingenciaValor)}`,
    `*• Total Estimado: ${formatBRL(simulation.totalInvestimento)}* (aprox. ${formatBRL(simulation.custoPorM2)}/m²)`,
    ``,
    `Gostaria de agendar uma reunião ou receber uma proposta formalizada!`,
  ].filter(Boolean).join('\n');

  const whatsappUrl = `https://wa.me/5571992936290?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Dados do Cliente */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-3 shadow-sm">
        <div>
          <span className="text-[10px] uppercase tracking-wider font-bold text-stone-400 block">
            Simulação realizada para:
          </span>
          <span className="font-serif font-bold text-lg text-stone-900 block">
            {clientData.name || 'Cliente'} — {clientData.city || 'Bahia'}/{clientData.state || 'BA'}
          </span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onReset} className="gap-1.5 rounded-xl text-xs">
            <RotateCcw className="w-3.5 h-3.5" /> Nova Simulação
          </Button>
        </div>
      </div>

      {/* Tabela de Simulação 360° */}
      <InvestmentSimulationTable
        modelId="custom"
        modelName={estilo}
        area={config.area}
        customType={config.customType}
        isDuplex={config.isDuplex}
        customBedrooms={config.bedrooms}
        customSuites={config.suites}
        hasSocialBathroom={config.hasSocialBathroom}
      />

      {/* CTA WhatsApp e Voltar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-stone-200">
        <Button variant="outline" onClick={onBack} className="gap-2 rounded-xl w-full sm:w-auto">
          <ArrowLeft className="w-4 h-4" /> Alterar Configuração
        </Button>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto"
        >
          <Button className="w-full gap-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl px-7 py-6 text-base font-bold shadow-lg transition-transform hover:scale-105">
            <MessageCircle className="w-5 h-5" /> Enviar Proposta no WhatsApp
          </Button>
        </a>
      </div>
    </motion.div>
  );
}

