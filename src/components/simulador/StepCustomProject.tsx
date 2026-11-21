"use client";

import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Home, 
  TreePine, 
  SlidersHorizontal, 
  ArrowLeft, 
  ArrowRight,
  Layers,
  Bed,
  Bath,
  Check
} from "lucide-react";

export interface CustomProjectConfig {
  customType: 'casa' | 'chale';
  isDuplex: boolean;
  area: number;
  bedrooms: number;
  suites: number;
  hasSocialBathroom: boolean;
}

interface Props {
  config: CustomProjectConfig;
  onChange: (cfg: CustomProjectConfig) => void;
  onBack: () => void;
  onNext: () => void;
}

export function StepCustomProject({ config, onChange, onBack, onNext }: Props) {
  const update = (partial: Partial<CustomProjectConfig>) => {
    onChange({ ...config, ...partial });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <span className="inline-block px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
          Construção Sob Medida
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold font-display text-primary">
          Configure seu <span className="text-gradient-warm italic">Projeto Personalizado</span>
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Defina o estilo, tamanho e distribuição de cômodos da sua construção
        </p>
      </div>

      <div className="space-y-6">

        {/* 1. Escolha Casa ou Chalé */}
        <div className="bg-white border border-border p-5 rounded-2xl shadow-sm space-y-3">
          <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
            1. Tipo de Construção
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => update({ customType: 'casa' })}
              className={cn(
                "p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3",
                config.customType === 'casa'
                  ? "border-[#5C3317] bg-[#5C3317]/5 ring-1 ring-[#5C3317]"
                  : "border-border hover:border-[#5C3317]/40 bg-white"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                config.customType === 'casa' ? "bg-[#5C3317] text-white" : "bg-stone-100 text-stone-600"
              )}>
                <Home className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm block text-stone-900">Casa</span>
                <span className="text-[11px] text-stone-500">Paredes verticais (permite parede dupla)</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => update({ customType: 'chale' })}
              className={cn(
                "p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3",
                config.customType === 'chale'
                  ? "border-[#5C3317] bg-[#5C3317]/5 ring-1 ring-[#5C3317]"
                  : "border-border hover:border-[#5C3317]/40 bg-white"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                config.customType === 'chale' ? "bg-[#5C3317] text-white" : "bg-stone-100 text-stone-600"
              )}>
                <TreePine className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm block text-stone-900">Chalé</span>
                <span className="text-[11px] text-stone-500">Estilo A-Frame triangular</span>
              </div>
            </button>
          </div>
        </div>

        {/* 2. Pavimentos: Térreo vs Duplex */}
        <div className="bg-white border border-border p-5 rounded-2xl shadow-sm space-y-3">
          <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
            2. Pavimentos
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => update({ isDuplex: false })}
              className={cn(
                "p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between",
                !config.isDuplex
                  ? "border-[#5C3317] bg-[#5C3317]/5 ring-1 ring-[#5C3317]"
                  : "border-border hover:border-[#5C3317]/40 bg-white"
              )}
            >
              <div>
                <span className="font-bold text-sm block text-stone-900">Térreo (1 Pavimento)</span>
                <span className="text-[11px] text-stone-500">Todo o layout em nível único</span>
              </div>
              {!config.isDuplex && <Check className="w-5 h-5 text-[#5C3317]" />}
            </button>

            <button
              type="button"
              onClick={() => update({ isDuplex: true })}
              className={cn(
                "p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between",
                config.isDuplex
                  ? "border-[#5C3317] bg-[#5C3317]/5 ring-1 ring-[#5C3317]"
                  : "border-border hover:border-[#5C3317]/40 bg-white"
              )}
            >
              <div>
                <span className="font-bold text-sm block text-stone-900">Duplex / Mezanino</span>
                <span className="text-[11px] text-amber-800 font-semibold">+ R$ 120,00/m² (com escada e mezanino)</span>
              </div>
              {config.isDuplex && <Check className="w-5 h-5 text-[#5C3317]" />}
            </button>
          </div>
        </div>

        {/* 3. Área total construída */}
        <div className="bg-white border border-border p-5 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
                3. Área Total Construída
              </label>
              <span className="text-[11px] text-stone-500">Área útil total do projeto</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#FAF8F5] border border-amber-200 px-4 py-2 rounded-xl">
              <input
                type="number"
                min={20}
                max={200}
                value={config.area}
                onChange={(e) => update({ area: Number(e.target.value) || 20 })}
                className="w-16 font-serif font-black text-2xl text-[#5C3317] bg-transparent text-right outline-none"
              />
              <span className="font-bold text-[#5C3317] text-lg">m²</span>
            </div>
          </div>

          <Slider
            value={[config.area]}
            min={20}
            max={160}
            step={1}
            onValueChange={([v]) => v !== undefined && update({ area: v as number })}
            className="py-2"
          />

          <div className="flex justify-between text-xs text-muted-foreground font-medium">
            <span>20 m²</span>
            <span>65 m² (Típico 3/4)</span>
            <span>80 m²</span>
            <span>160 m²</span>
          </div>
        </div>

        {/* 4. Distribuição dos Cômodos */}
        <div className="bg-white border border-border p-5 rounded-2xl shadow-sm space-y-4">
          <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
            4. Distribuição de Quartos e Banheiros
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Quartos */}
            <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-stone-200 space-y-2">
              <div className="flex items-center gap-2 text-stone-700">
                <Bed className="w-4 h-4 text-[#5C3317]" />
                <span className="text-xs font-bold">Total de Quartos:</span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => update({ bedrooms: n })}
                    className={cn(
                      "flex-1 py-2 rounded-lg text-xs font-bold border transition-all",
                      config.bedrooms === n
                        ? "bg-[#5C3317] text-white border-[#5C3317]"
                        : "bg-white text-stone-700 border-stone-200 hover:border-[#5C3317]/50"
                    )}
                  >
                    {n} {n === 1 ? 'Quarto' : 'Quartos'}
                  </button>
                ))}
              </div>
            </div>

            {/* Suítes */}
            <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-stone-200 space-y-2">
              <div className="flex items-center gap-2 text-stone-700">
                <Bath className="w-4 h-4 text-[#5C3317]" />
                <span className="text-xs font-bold">Quantidade de Suítes:</span>
              </div>
              <div className="flex gap-2">
                {[0, 1, 2, 3].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => update({ suites: n })}
                    className={cn(
                      "flex-1 py-2 rounded-lg text-xs font-bold border transition-all",
                      config.suites === n
                        ? "bg-[#5C3317] text-white border-[#5C3317]"
                        : "bg-white text-stone-700 border-stone-200 hover:border-[#5C3317]/50"
                    )}
                  >
                    {n === 0 ? 'Sem suíte' : `${n} Suíte${n > 1 ? 's' : ''}`}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Banheiro Social */}
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
            <label className="flex items-center gap-2.5 cursor-pointer text-stone-700 select-none">
              <input
                type="checkbox"
                checked={config.hasSocialBathroom}
                onChange={(e) => update({ hasSocialBathroom: e.target.checked })}
                className="w-4 h-4 rounded border-stone-300 text-[#5C3317] focus:ring-[#5C3317]"
              />
              <span className="text-xs font-bold">
                Incluir Banheiro Social adicional
              </span>
            </label>
            <span className="text-[11px] text-stone-500 font-medium">
              Total: <strong>{config.suites + (config.hasSocialBathroom ? 1 : 0)} banheiro(s)</strong>
            </span>
          </div>
        </div>

      </div>

      {/* Botões de Ação */}
      <div className="flex justify-between items-center mt-8">
        <Button variant="outline" onClick={onBack} className="gap-2 rounded-xl">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Button>
        <Button 
          onClick={onNext} 
          className="gap-2 bg-[#5C3317] hover:bg-[#4A2B1D] text-white rounded-xl px-6 py-5 text-sm font-bold shadow-md"
        >
          Ver Simulação do Projeto <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}

