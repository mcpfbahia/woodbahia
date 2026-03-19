"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Card, CardContent } from '~/components/ui/card';
import { Switch } from '~/components/ui/switch';
import { Separator } from '~/components/ui/separator';
import { FileDown, User, Home, Settings2, Tag, LayoutDashboard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CABIN_MODELS, calculateProposalItems, type KitType, type ProposalData } from '~/lib/pricing';
import { generateProposalPDF } from '~/lib/proposal-pdf';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { toast } from 'sonner';

const KIT_OPTIONS: { value: KitType; label: string; emoji: string }[] = [
  { value: 'kit1', label: 'Kit 1 — Essência Natural', emoji: '🪵' },
  { value: 'kit2', label: 'Kit 2 — Raízes do Projeto', emoji: '🔩' },
  { value: 'kit3', label: 'Kit 3 — Abrigo Natural', emoji: '🛖' },
  { value: 'kit4', label: 'Kit 4 — Refúgio Completo', emoji: '🏕️' },
  { value: 'custom', label: 'Kit Personalizado', emoji: '⚙️' },
];

export default function PropostasPage() {
  const router = useRouter();
  const [view, setView] = useState<'form' | 'summary'>('form');
  const [clientName, setClientName] = useState('');
  const [workLocation, setWorkLocation] = useState('');
  const [modelId, setModelId] = useState('');
  const [kitType, setKitType] = useState<KitType>('kit4');
  const [customArea, setCustomArea] = useState(30);
  const [slidingDoor, setSlidingDoor] = useState(false);
  const [includeGlass, setIncludeGlass] = useState(false);
  const [includeElectrical, setIncludeElectrical] = useState(false);
  const [includeFixtures, setIncludeFixtures] = useState(false);
  const [includeTilesStain, setIncludeTilesStain] = useState(false);
  const [includeLabor, setIncludeLabor] = useState(false);
  const [includeProject, setIncludeProject] = useState(false);
  const [discountType, setDiscountType] = useState<'none' | 'percentage' | 'fixed'>('none');
  const [discountValue, setDiscountValue] = useState(0);

  const getProposalData = (): ProposalData => ({
    clientName: clientName.trim(),
    workLocation: workLocation.trim(),
    modelId: kitType === 'custom' ? 'custom' : modelId,
    customArea: kitType === 'custom' ? customArea : undefined,
    kitType,
    slidingDoor,
    includeGlass,
    includeElectrical,
    includeFixtures,
    includeTilesStain,
    includeLabor,
    includeProject,
    discountType,
    discountValue: discountType !== 'none' ? discountValue : 0,
  });

  const handleShowSummary = () => {
    if (!clientName.trim()) {
      toast.error('Preencha o nome do cliente.');
      return;
    }
    if (!workLocation.trim()) {
      toast.error('Preencha o local da obra.');
      return;
    }
    if (kitType !== 'custom' && !modelId) {
      toast.error('Selecione um modelo de chalé.');
      return;
    }

    setView('summary');
    window.scrollTo(0, 0);
  };

  const handleGenerate = async () => {
    const toastId = toast.loading('Gerando proposta em PDF...');
    try {
      await generateProposalPDF(getProposalData());
      toast.success('Proposta gerada com sucesso!', { id: toastId });
    } catch (err) {
      toast.error('Erro ao gerar proposta. Verifique os dados.', { id: toastId });
      console.error(err);
    }
  };

  const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const proposalData = getProposalData();
  const summary = calculateProposalItems(proposalData);
  const selectedModel = CABIN_MODELS.find(m => m.id === modelId);

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Header Administrativo */}
      <div className="flex justify-between items-center bg-white/50 p-6 rounded-2xl border border-border/40 backdrop-blur-sm">
        <div>
          <h1 className="text-3xl font-bold engraved-text">
            {view === 'form' ? 'Gerador de Propostas' : 'Resumo da Proposta'}
          </h1>
          <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold mt-1">Wood Bahia — Propostas Comerciais</p>
        </div>
        <Button variant="outline" className="rounded-xl border-primary/20 hover:bg-primary/5" onClick={() => router.push('/admin')}>
          <LayoutDashboard className="mr-2 h-4 w-4 text-primary" />
          Dashboard
        </Button>
      </div>

      <div className="max-w-4xl mx-auto">
        {view === 'form' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Client Data */}
            <Card className="wood-card overflow-hidden">
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center gap-3 border-b border-border/10 pb-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="font-bold text-xl engraved-text">Dados do Cliente</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <Label htmlFor="clientName" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Nome do Cliente</Label>
                     <Input
                      id="clientName"
                      placeholder="Ex: João Silva"
                      value={clientName}
                      onChange={e => setClientName(e.target.value)}
                      className="h-12 recessed-input rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workLocation" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Local da Obra</Label>
                    <Input
                      id="workLocation"
                      placeholder="Ex: Salvador - BA"
                      value={workLocation}
                      onChange={e => setWorkLocation(e.target.value)}
                      className="h-12 recessed-input rounded-xl"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Model & Kit */}
            <Card className="wood-card overflow-hidden">
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center gap-3 border-b border-border/10 pb-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Home className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="font-bold text-xl engraved-text">Modelo e Configuração</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Tipo de Kit</Label>
                      <Select value={kitType} onValueChange={(v) => setKitType(v as KitType)}>
                        <SelectTrigger className="h-12 recessed-input rounded-xl w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-primary/20 max-h-[500px]">
                          {KIT_OPTIONS.map(k => (
                            <SelectItem key={k.value} value={k.value} className="focus:bg-primary focus:text-white">
                              {k.emoji} {k.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {kitType !== 'custom' ? (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Modelo do Chalé</Label>
                          <Select value={modelId} onValueChange={(v) => setModelId(v || '')}>
                            <SelectTrigger className="h-12 recessed-input rounded-xl w-full">
                              <SelectValue placeholder="Selecione um modelo" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-primary/20 max-h-[500px]">
                              {CABIN_MODELS.map(m => (
                                <SelectItem key={m.id} value={m.id} className="focus:bg-primary focus:text-white">
                                  {m.name} — {m.area}m²
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                      </div>
                    ) : (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="customArea" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Área Personalizada (m²)</Label>
                          <Input
                            id="customArea"
                            type="number"
                            min={6}
                            max={150}
                            value={customArea}
                            onChange={e => setCustomArea(Number(e.target.value))}
                            className="h-12 recessed-input rounded-xl"
                          />
                        </div>

                        <div className="space-y-3 pt-4 border-t border-border/10">
                          <p className="text-[10px] uppercase font-bold text-primary/60 tracking-widest mb-2">Composição do Kit</p>
                          {[
                            { id: 'f', label: 'Portas, Janelas e Ferragens', state: includeFixtures, set: setIncludeFixtures },
                            { id: 't', label: 'Telhas e Stain', state: includeTilesStain, set: setIncludeTilesStain },
                            { id: 'l', label: 'Mão de Obra de Montagem', state: includeLabor, set: setIncludeLabor },
                            { id: 'p', label: 'Projeto Arquitetônico', state: includeProject, set: setIncludeProject },
                          ].map((item) => (
                            <div key={item.id} className="flex items-center justify-between group">
                              <Label className="text-sm cursor-pointer group-hover:text-primary transition-colors">{item.label}</Label>
                              <Switch 
                                checked={item.state} 
                                onCheckedChange={item.set} 
                                className="toggle-glow data-[state=checked]:bg-primary"
                              />
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <div className="space-y-6 bg-primary/5 p-6 rounded-2xl border border-primary/10 backdrop-blur-sm self-start shadow-inner">
                    <div className="flex items-center gap-2 mb-2">
                      <Settings2 className="w-4 h-4 text-primary" />
                      <h3 className="font-black text-[10px] uppercase tracking-widest text-primary/80">Opcionais Extras</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between group">
                        <div>
                          <Label className="text-sm font-bold text-foreground">Porta de Correr (1.8m)</Label>
                          <p className="text-[10px] text-muted-foreground">+ R$ 3.000 (c/ desc. ferragens)</p>
                        </div>
                        <Switch checked={slidingDoor} onCheckedChange={setSlidingDoor} className="toggle-glow data-[state=checked]:bg-primary" />
                      </div>

                      {(kitType === 'kit4' || (kitType === 'custom' && includeLabor)) && (
                        <>
                          <div className="flex items-center justify-between group">
                            <div>
                              <Label className="text-sm font-bold text-foreground">Incluir Vidros</Label>
                              <p className="text-[10px] text-muted-foreground">Conforme projeto</p>
                            </div>
                            <Switch checked={includeGlass} onCheckedChange={setIncludeGlass} className="toggle-glow data-[state=checked]:bg-primary" />
                          </div>

                          <div className="flex items-center justify-between group">
                            <div>
                              <Label className="text-sm font-bold text-foreground">Elétrica/Hidráulica Básica</Label>
                              <p className="text-[10px] text-muted-foreground">Mão de obra inclusa</p>
                            </div>
                            <Switch checked={includeElectrical} onCheckedChange={setIncludeElectrical} className="toggle-glow data-[state=checked]:bg-primary" />
                          </div>
                        </>
                      )}
                    </div>

                    <div className="pt-6 border-t border-primary/10 mt-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Tag className="w-4 h-4 text-primary" />
                        <h3 className="font-black text-[10px] uppercase tracking-widest text-primary/80">Política de Desconto</h3>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mb-4">
                         <Button 
                          variant={discountType === 'none' ? 'default' : 'outline'} 
                          size="sm"
                          className={`h-10 rounded-xl font-bold ${discountType === 'none' ? 'wood-button text-white' : 'border-primary/20'}`}
                          onClick={() => setDiscountType('none')}
                        >
                          Nenhum
                        </Button>
                        <Button 
                          variant={discountType === 'percentage' ? 'default' : 'outline'} 
                          size="sm"
                          className={`h-10 rounded-xl font-bold ${discountType === 'percentage' ? 'wood-button text-white' : 'border-primary/20'}`}
                          onClick={() => setDiscountType('percentage')}
                        >
                          Percentual
                        </Button>
                        <Button 
                          variant={discountType === 'fixed' ? 'default' : 'outline'} 
                          size="sm"
                          className={`h-10 rounded-xl font-bold col-span-2 ${discountType === 'fixed' ? 'wood-button text-white' : 'border-primary/20'}`}
                          onClick={() => setDiscountType('fixed')}
                        >
                          Valor Fixo (R$)
                        </Button>
                      </div>

                      {discountType !== 'none' && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2 overflow-hidden">
                          <Label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Valor do Desconto</Label>
                          <Input
                            type="number"
                            placeholder={discountType === 'percentage' ? 'Ex: 10%' : 'Ex: 5.000'}
                            value={discountValue || ''}
                            onChange={e => setDiscountValue(Number(e.target.value))}
                            className="h-12 recessed-input rounded-xl"
                          />
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Button */}
            <div className="flex justify-center pt-4">
              <Button
                onClick={handleShowSummary}
                className="w-full md:w-auto px-16 h-16 text-xl font-black wood-button text-white rounded-[2rem] shadow-2xl transition-all hover:scale-105 active:scale-95 uppercase tracking-[0.1em]"
              >
                Gerar Resumo da Proposta
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <Card className="wood-card premium-shadow overflow-hidden">
                <div className="bg-primary/5 p-8 border-b border-primary/10 flex justify-between items-center">
                  <div>
                    <h2 className="text-3xl font-black engraved-text">Revisão Final</h2>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mt-1">Simulação Wood Bahia — #{Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
                  </div>
                  <div className="bg-white/50 p-4 rounded-2xl border border-primary/10 text-center shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">ID Gerador</p>
                    <p className="text-lg font-bold text-primary tracking-tighter">PRP-2026</p>
                  </div>
                </div>
                
                <CardContent className="p-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/60 border-l-4 border-primary pl-3">Informações do Projeto</p>
                        <div className="grid grid-cols-2 gap-6 bg-white/30 p-4 rounded-xl shadow-inner">
                          <div>
                            <p className="text-[10px] uppercase text-muted-foreground font-bold mb-1">Cliente</p>
                            <p className="font-bold text-primary">{clientName}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase text-muted-foreground font-bold mb-1">Local</p>
                            <p className="font-bold text-primary">{workLocation}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase text-muted-foreground font-bold mb-1">Modelo Selecionado</p>
                            <p className="font-bold text-primary">{kitType === 'custom' ? 'Personalizado' : selectedModel?.name}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase text-muted-foreground font-bold mb-1">Área Total</p>
                            <p className="font-bold text-primary">{kitType === 'custom' ? customArea : selectedModel?.area}m²</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/60 border-l-4 border-primary pl-3">Detalhamento Técnico</p>
                        <div className="space-y-2">
                          {summary.items.map((item, i) => (
                            <div key={i} className="flex justify-between text-sm py-2 border-b border-primary/5">
                              <span className="text-muted-foreground font-medium">{item.label}</span>
                              <span className="font-bold text-primary/80">{fmt(item.value)}</span>
                            </div>
                          ))}
                           <div className="flex justify-between text-sm py-2 border-b border-primary/5">
                              <span className="text-muted-foreground font-medium">Frete Estimado (Logística)</span>
                              <span className="font-bold line-through opacity-30 text-primary">{fmt(summary.freight * 2)}</span>
                            </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                       <div className="bg-primary/5 p-8 rounded-[2.5rem] border border-primary/20 space-y-6 relative overflow-hidden shadow-xl">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 -translate-y-1/2 translate-x-1/2 rounded-full" />
                          
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary/60 border-b border-primary/10 pb-3">Resumo de Investimento</p>
                          
                          <div className="flex justify-between items-center text-green-700 font-bold bg-green-500/10 p-4 rounded-xl border border-green-500/20 mb-2">
                            <div className="flex flex-col">
                              <span className="text-xs uppercase tracking-tighter">Bônus: Frete Compartilhado</span>
                              <span className="text-[10px] font-normal opacity-80 pt-0.5">Wood Bahia paga 50%</span>
                            </div>
                            <span className="text-lg">-{fmt(summary.freight)}</span>
                          </div>

                          {summary.discount > 0 && (
                            <div className="flex justify-between items-center text-primary font-bold bg-primary/10 p-4 rounded-xl border border-primary/30 shadow-md animate-in fade-in zoom-in duration-500">
                              <div className="flex flex-col">
                                <span className="text-xs uppercase tracking-tighter flex items-center gap-2">🎁 Desconto Especial</span>
                                <span className="text-[10px] font-normal opacity-80 pt-0.5">Autorizado pelo Operador</span>
                              </div>
                              <span className="text-xl">-{fmt(summary.discount)}</span>
                            </div>
                          )}

                          <Separator className="my-2 bg-primary/20" />

                          <div className="flex justify-between items-center px-2">
                            <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Sinal (Início do Projeto)</span>
                            <span className="font-black text-primary">{fmt(summary.total * 0.3)}</span>
                          </div>

                          <div className="pt-6 border-t border-primary/10 mt-2">
                             <div className="text-center md:text-left">
                                <p className="text-[10px] uppercase font-black text-primary/60 mb-2 tracking-[.2em] ml-1">Total do Investimento</p>
                                <h3 className="text-5xl font-black engraved-text leading-tight">{fmt(summary.total)}</h3>
                             </div>
                          </div>

                          <div className="bg-primary p-5 rounded-2xl text-white text-center shadow-lg transform rotate-[-1deg] border-2 border-primary-foreground/20">
                             <p className="text-[10px] uppercase font-bold opacity-80 mb-1 tracking-widest flex items-center justify-center gap-2">
                                <span className="inline-block w-2 h-2 bg-white rounded-full animate-pulse" />
                                Condição Facilitada
                             </p>
                             <p className="text-sm font-bold">💳 <span className="opacity-80">Parcele em 18x de</span> <span className="text-2xl font-black">{fmt(Math.round(summary.total / (1 - 0.1877) / 18 * 100) / 100)}</span></p>
                          </div>
                          
                          <p className="text-[10px] text-center text-muted-foreground italic px-4">Valores sujeitos a alteração conforme tributação regional e prazos de operadora.</p>
                       </div>
                    </div>
                  </div>
                </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setView('form')}
                className="h-16 px-12 rounded-[1.5rem] border-2 border-primary/20 font-black text-primary/60 hover:bg-primary/5 hover:text-primary transition-all uppercase tracking-widest"
              >
                Tentar Outras Opções
              </Button>
              <Button
                onClick={handleGenerate}
                size="lg"
                className="h-20 px-16 text-xl font-black wood-button text-white rounded-[2rem] shadow-2xl flex items-center gap-4 group transition-all hover:scale-105 uppercase tracking-widest"
              >
                <FileDown className="w-7 h-7 group-hover:animate-bounce" />
                GERAR PDF COMERCIAL
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
