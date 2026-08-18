"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion } from 'framer-motion';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Card, CardContent } from '~/components/ui/card';
import { Switch } from '~/components/ui/switch';
import { Separator } from '~/components/ui/separator';
import { FileDown, User, Home, Settings2, Tag, LayoutDashboard, Plus, Trash2, Layers, Paintbrush, Edit2, Loader2, ArrowLeft, Eye, FileText, Search, Undo2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { db } from "~/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp, limit, startAfter } from "firebase/firestore";

const STATUS_CONFIG: Record<'rascunho' | 'enviada' | 'fechada' | 'perdida', { label: string; bg: string; text: string; border: string; emoji: string }> = {
  rascunho: { label: 'Rascunho', bg: 'bg-stone-50', text: 'text-stone-600', border: 'border-stone-200/60', emoji: '📝' },
  enviada: { label: 'Enviada', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200/60', emoji: '✉️' },
  fechada: { label: 'Ganha', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200/60', emoji: '🤝' },
  perdida: { label: 'Perdida', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200/60', emoji: '❌' },
};
import { CABIN_MODELS, calculateProposalItems, calculateInstallmentValue, getTilesStainPrice, getFixturesPrice, getModelDiscountRate, getPaymentBases, type KitType, type ProposalData, type ExtraItem, type FoundationType, type PaintType, type CabinModel } from '~/lib/pricing';
import { generateProposalPDF, getIncludedItems, getNotIncludedItems } from '~/lib/proposal-pdf';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { toast } from 'sonner';

const KIT_OPTIONS: { value: KitType; label: string; emoji: string }[] = [
  { value: 'madeiramento', label: '1. Apenas o Kit Madeiramento', emoji: '🪵' },
  { value: 'parceira', label: '2. Kit + Montagem Parceira (Melhor Custo-Benefício)', emoji: '🔨' },
  { value: 'turnkey', label: '3. Wood Bahia Chave na Mão', emoji: '🔑' },
  { value: 'custom', label: 'Kit Personalizado', emoji: '⚙️' },
];

const EditablePrice = ({ 
  label, 
  value, 
  onChange, 
  suggested: suggValue,
  className = ""
}: { 
  label: string, 
  value: number | string | undefined, 
  onChange: (v: number | string | undefined) => void,
  suggested: number,
  className?: string
}) => (
  <div className={`flex flex-col gap-1 p-2 bg-primary/5 rounded-xl border border-primary/10 ${className}`}>
    <div className="flex justify-between items-center px-1">
      <Label className="text-[9px] font-black uppercase tracking-widest text-primary/60">{label}</Label>
      {value !== undefined && value !== suggValue && (
        <button onClick={() => onChange(undefined)} className="text-[8px] font-bold text-primary hover:underline uppercase">Resetar</button>
      )}
    </div>
    <div className="relative">
      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">R$</span>
      <Input
        type="number"
        value={value ?? suggValue}
        onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
        onBlur={() => {
          if (value === "") onChange(undefined);
        }}
        className="h-8 pl-8 text-xs recessed-input rounded-lg border-primary/10 focus:ring-1 focus:ring-primary/20"
      />
    </div>
  </div>
);

interface InlineEditablePriceProps {
  value: number;
  onChange: (v: number | string | undefined) => void;
  onReset: () => void;
  isOverridden: boolean;
}

const InlineEditablePrice = ({ 
  value, 
  onChange, 
  onReset,
  isOverridden 
}: InlineEditablePriceProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());

  useEffect(() => {
    if (!isEditing) setInputValue(value.toString());
  }, [value, isEditing]);

  if (isEditing) {
    return (
      <div className="flex items-center gap-1">
        <span className="text-[10px] font-bold text-muted-foreground">R$</span>
        <Input
          type="number"
          autoFocus
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={() => {
            setIsEditing(false);
            if (inputValue !== "" && !isNaN(Number(inputValue))) {
              onChange(Number(inputValue));
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setIsEditing(false);
              if (inputValue !== "" && !isNaN(Number(inputValue))) {
                onChange(Number(inputValue));
              }
            }
            if (e.key === 'Escape') {
              setIsEditing(false);
              setInputValue(value.toString());
            }
          }}
          className="h-7 w-24 text-right text-xs font-bold font-mono p-1 border-primary/30 rounded-lg focus-visible:ring-1 focus-visible:ring-primary/40 bg-white"
        />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 group/item">
      <button 
        onClick={() => setIsEditing(true)}
        className={`font-bold tabular-nums transition-all hover:text-primary hover:scale-105 ${isOverridden ? 'text-primary' : 'text-primary/80'}`}
      >
        {value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
      </button>
      {isOverridden && (
        <button 
          onClick={onReset}
          className="text-[10px] opacity-30 hover:opacity-100 transition-opacity"
          title="Resetar para valor original"
        >
          ↩️
        </button>
      )}
    </div>
  );
};

export default function PropostasPage() {
  const router = useRouter();
  const [cabinModels, setCabinModels] = useState<CabinModel[]>(CABIN_MODELS);
  const [view, setView] = useState<'list' | 'form' | 'summary'>('list');
  const [currentProposalId, setCurrentProposalId] = useState<string | null>(null);
  const [proposals, setProposals] = useState<any[]>([]);
  const [loadingProposals, setLoadingProposals] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [status, setStatus] = useState<'rascunho' | 'enviada' | 'fechada' | 'perdida'>('rascunho');
  const [observations, setObservations] = useState('');
  const [clientName, setClientName] = useState('');
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasLoadedAllForSearch, setHasLoadedAllForSearch] = useState(false);
  const [workLocation, setWorkLocation] = useState('');
  const [modelId, setModelId] = useState('');
  const [kitType, setKitType] = useState<KitType>('turnkey');
  const [customArea, setCustomArea] = useState(30);
  const [customModelDescription, setCustomModelDescription] = useState('');
  const [slidingDoor, setSlidingDoor] = useState(false);
  const [includeGlass, setIncludeGlass] = useState(false);
  const [includeElectrical, setIncludeElectrical] = useState(false);
  const [includeFixtures, setIncludeFixtures] = useState(false);
  const [includeTilesStain, setIncludeTilesStain] = useState(false);
  const [includeLabor, setIncludeLabor] = useState(false);
  const [includeProject, setIncludeProject] = useState(false);
  const [discountType, setDiscountType] = useState<'none' | 'percentage' | 'fixed'>('none');
  const [discountValue, setDiscountValue] = useState(0);
  const [extraItems, setExtraItems] = useState<ExtraItem[]>([]);
  
  const [kitPriceOverride, setKitPriceOverride] = useState<number | string | undefined>(undefined);
  const [fixturesPriceOverride, setFixturesPriceOverride] = useState<number | string | undefined>(undefined);
  const [tilesStainPriceOverride, setTilesStainPriceOverride] = useState<number | string | undefined>(undefined);
  const [laborPriceOverride, setLaborPriceOverride] = useState<number | string | undefined>(undefined);
  const [electricalPriceOverride, setElectricalPriceOverride] = useState<number | string | undefined>(undefined);
  const [glassPriceOverride, setGlassPriceOverride] = useState<number | string | undefined>(undefined);
  const [projectPriceOverride, setProjectPriceOverride] = useState<number | string | undefined>(undefined);
  const [freightOverride, setFreightOverride] = useState<number | string | undefined>(undefined);
  const [distanceFromFactory, setDistanceFromFactory] = useState<number | string | undefined>(undefined);
  
  const [foundationType, setFoundationType] = useState<FoundationType>('none');
  const [foundationPriceOverride, setFoundationPriceOverride] = useState<number | string | undefined>(undefined);
  const [masonryBathroomCount, setMasonryBathroomCount] = useState<number>(0);
  const [masonryBathroomPriceOverride, setMasonryBathroomPriceOverride] = useState<number | string | undefined>(undefined);
  const [paintType, setPaintType] = useState<PaintType>('none');
  const [paintPriceOverride, setPaintPriceOverride] = useState<number | string | undefined>(undefined);
  
  const [customIncludedItems, setCustomIncludedItems] = useState<string[] | undefined>(undefined);
  const [customNotIncludedItems, setCustomNotIncludedItems] = useState<string[] | undefined>(undefined);
  const [foundationIncluded, setFoundationIncluded] = useState<boolean>(false);
  const [itemOverrides, setItemOverrides] = useState<Record<string, { value?: number, deleted?: boolean }>>({});

  // Parsers de área e preço
  const parsePriceToBRL = (val: any): number => {
    if (typeof val === "number") return val;
    if (!val) return 0;
    const str = val.toString().replace(/[R$\s]/gi, "");
    if (str.includes(",")) return parseFloat(str.replace(/\./g, "").replace(",", ".")) || 0;
    return parseFloat(str.replace(/[^\d.]/g, "")) || 0;
  };

  const parseArea = (val: any): number => {
    if (typeof val === "number") return val;
    if (!val) return 0;
    return parseFloat(val.toString().replace(',', '.').replace(/[^\d.]/g, '')) || 0;
  };

  useEffect(() => {
    const fetchModels = async () => {
      if (!db) return;
      try {
        const querySnapshot = await getDocs(collection(db, "models"));
        const modelsData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          const areaNum = parseArea(data.area);
          return {
            id: doc.id,
            name: data.name || data.title || doc.id,
            area: areaNum,
            kitPrice: parsePriceToBRL(data.kitPrice || data.price),
            tilesStainPrice: parsePriceToBRL(data.tilesStainPrice || getTilesStainPrice(areaNum).total),
            fixturesPrice: parsePriceToBRL(data.fixturesPrice || getFixturesPrice(areaNum).base),
          } as CabinModel;
        });
        if (modelsData.length > 0) {
          const merged = [...CABIN_MODELS];
          modelsData.forEach(firestoreModel => {
            const index = merged.findIndex(m => m.id === firestoreModel.id);
            if (index !== -1) {
              merged[index] = firestoreModel;
            } else {
              merged.push(firestoreModel);
            }
          });
          merged.sort((a, b) => a.name.localeCompare(b.name));
          setCabinModels(merged);
        }
      } catch (err) {
        console.error("Erro ao carregar modelos do Firestore:", err);
      }
    };
    fetchModels();
  }, []);

  // Limpar overrides ao mudar modelo ou área para evitar erros de cálculo entre modelos
  useEffect(() => {
    setKitPriceOverride(undefined);
    setFixturesPriceOverride(undefined);
    setTilesStainPriceOverride(undefined);
    setLaborPriceOverride(undefined);
    setElectricalPriceOverride(undefined);
    setGlassPriceOverride(undefined);
    setProjectPriceOverride(undefined);
    setFreightOverride(undefined);
    setDistanceFromFactory(undefined);
    setFoundationPriceOverride(undefined);
    setMasonryBathroomPriceOverride(undefined);
    setCustomNotIncludedItems(undefined);
    setFoundationIncluded(false);
    setItemOverrides({});
  }, [modelId, kitType, customArea]);

  // Seleção automática dos opcionais padrão ao alterar modalidade
  useEffect(() => {
    if (kitType === 'turnkey') {
      setIncludeFixtures(true);
      setIncludeTilesStain(true);
      setIncludeLabor(true);
      setIncludeGlass(true);
      setPaintType('1cor');
    } else if (kitType === 'parceira') {
      setIncludeFixtures(true);
      setIncludeTilesStain(false);
      setIncludeLabor(true);
      setIncludeGlass(false);
      setPaintType('none');
    } else if (kitType === 'madeiramento') {
      setIncludeFixtures(false);
      setIncludeTilesStain(false);
      setIncludeLabor(false);
      setIncludeGlass(false);
      setPaintType('none');
    }
  }, [kitType]);

  // Sincronização da inclusão padrão da fundação
  useEffect(() => {
    if (kitType === 'turnkey') {
      if (foundationType === 'wooden_eucalyptus' || foundationType === 'eucalyptus') {
        setFoundationIncluded(true);
      } else {
        setFoundationIncluded(false);
      }
    } else {
      setFoundationIncluded(false);
    }
  }, [kitType, foundationType]);

  const addExtraItem = () => setExtraItems([...extraItems, { description: '', value: 0 }]);
  const removeExtraItem = (index: number) => {
    const newItems = extraItems.filter((_, i) => i !== index);
    setExtraItems(newItems.length > 0 ? newItems : []);
  };
  const updateExtraItem = (index: number, fields: Partial<ExtraItem>) => {
    const newItems = [...extraItems];
    newItems[index] = { ...newItems[index]!, ...fields };
    setExtraItems(newItems);
  };

  const fetchProposals = async () => {
    if (!db) return;
    setLoadingProposals(true);
    try {
      const q = query(collection(db, "proposals"), orderBy("updatedAt", "desc"), limit(20));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProposals(data);
      if (querySnapshot.docs.length > 0) {
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setHasMore(querySnapshot.docs.length === 20);
      } else {
        setLastVisible(null);
        setHasMore(false);
      }
      setHasLoadedAllForSearch(false);
    } catch (err) {
      console.error("Erro ao buscar propostas:", err);
      toast.error("Erro ao carregar histórico de propostas.");
    } finally {
      setLoadingProposals(false);
    }
  };

  const loadMoreProposals = async () => {
    if (!db || !lastVisible || loadingMore) return;
    setLoadingMore(true);
    try {
      const q = query(
        collection(db, "proposals"),
        orderBy("updatedAt", "desc"),
        startAfter(lastVisible),
        limit(20)
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setProposals(prev => [...prev, ...data]);
      
      if (querySnapshot.docs.length > 0) {
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setHasMore(querySnapshot.docs.length === 20);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Erro ao carregar mais propostas:", err);
      toast.error("Erro ao carregar mais propostas.");
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    const loadAllForSearch = async () => {
      if (!db || !searchTerm.trim() || hasLoadedAllForSearch) return;
      try {
        const q = query(collection(db, "proposals"), orderBy("updatedAt", "desc"));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProposals(data);
        setHasMore(false);
        setHasLoadedAllForSearch(true);
      } catch (err) {
        console.error("Erro ao buscar base de dados para pesquisa:", err);
      }
    };

    loadAllForSearch();
  }, [searchTerm, hasLoadedAllForSearch]);

  const filteredProposals = useMemo(() => {
    return proposals.filter(p => {
      const nameMatch = p.clientName?.toLowerCase().includes(searchTerm.toLowerCase());
      const locationMatch = p.workLocation?.toLowerCase().includes(searchTerm.toLowerCase());
      const modelMatch = p.modelName?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const textMatch = !searchTerm.trim() || nameMatch || locationMatch || modelMatch;
      
      // Filtro por status
      const propStatus = p.status || p.data?.status || 'rascunho';
      const statusMatch = statusFilter === 'todos' || propStatus === statusFilter;
      
      return textMatch && statusMatch;
    });
  }, [proposals, searchTerm, statusFilter]);

  useEffect(() => {
    fetchProposals();
  }, []);

  const handleSaveProposal = async () => {
    if (!db) return;
    try {
      const currentData = getProposalData();
      const selectedModel = cabinModels.find(m => m.id === modelId);
      const proposalPayload = {
        clientName: clientName.trim(),
        workLocation: workLocation.trim(),
        modelName: kitType === 'custom' ? 'Personalizado' : (selectedModel?.name || 'Desconhecido'),
        kitTypeLabel: KIT_OPTIONS.find(o => o.value === kitType)?.label || kitType,
        totalValue: summary.total,
        status,
        observations: observations.trim() || undefined,
        updatedAt: serverTimestamp(),
        data: currentData
      };

      if (currentProposalId) {
        // Atualizar proposta existente
        await updateDoc(doc(db, "proposals", currentProposalId), proposalPayload);
        toast.success("Proposta atualizada com sucesso!");
      } else {
        // Criar nova proposta
        await addDoc(collection(db, "proposals"), {
          ...proposalPayload,
          createdAt: serverTimestamp()
        });
        toast.success("Proposta salva com sucesso!");
      }
      
      // Atualizar lista e voltar para a listagem
      await fetchProposals();
      setView('list');
    } catch (err: any) {
      console.error("Erro ao salvar proposta:", err);
      toast.error(`Erro ao salvar proposta no banco de dados: ${err?.message || err}`);
    }
  };

  const handleEditProposal = (proposal: any) => {
    const d = proposal.data as ProposalData;
    setCurrentProposalId(proposal.id);
    
    // Setar estados locais com os dados da proposta salva
    setClientName(d.clientName || '');
    setWorkLocation(d.workLocation || '');
    setStatus(proposal.status || d.status || 'rascunho');
    setObservations(proposal.observations || d.observations || '');
    setKitType(d.kitType || 'turnkey');
    setModelId(d.modelId || '');
    setCustomArea(d.customArea || 30);
    setCustomModelDescription(d.customModelDescription || '');
    setSlidingDoor(!!d.slidingDoor);
    setIncludeGlass(!!d.includeGlass);
    setIncludeElectrical(!!d.includeElectrical);
    setIncludeFixtures(!!d.includeFixtures);
    setIncludeTilesStain(!!d.includeTilesStain);
    setIncludeLabor(!!d.includeLabor);
    setIncludeProject(!!d.includeProject);
    setDiscountType(d.discountType || 'none');
    setDiscountValue(d.discountValue || 0);
    setExtraItems(d.extraItems || []);
    
    setKitPriceOverride(d.kitPriceOverride);
    setFixturesPriceOverride(d.fixturesPriceOverride);
    setTilesStainPriceOverride(d.tilesStainPriceOverride);
    setLaborPriceOverride(d.laborPriceOverride);
    setElectricalPriceOverride(d.electricalPriceOverride);
    setGlassPriceOverride(d.glassPriceOverride);
    setProjectPriceOverride(d.projectPriceOverride);
    setFreightOverride(d.freightOverride);
    setDistanceFromFactory(d.distanceFromFactory);
    
    setFoundationType(d.foundationType || 'none');
    setFoundationPriceOverride(d.foundationPriceOverride);
    setMasonryBathroomCount(d.masonryBathroomCount || 0);
    setMasonryBathroomPriceOverride(d.masonryBathroomPriceOverride);
    setPaintType(d.paintType || 'none');
    setPaintPriceOverride(d.paintPriceOverride);
    setFoundationIncluded(!!d.foundationIncluded);
    setCustomIncludedItems(d.customIncludedItems);
    setCustomNotIncludedItems(d.customNotIncludedItems);
    setFoundationIncluded(!!d.foundationIncluded);
    setItemOverrides(d.itemOverrides || {});
    
    setView('form');
  };

  const handleDeleteProposal = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta proposta definitivamente?")) return;
    if (!db) return;
    try {
      await deleteDoc(doc(db, "proposals", id));
      toast.success("Proposta excluída com sucesso.");
      fetchProposals();
    } catch (err) {
      console.error("Erro ao excluir proposta:", err);
      toast.error("Erro ao excluir proposta.");
    }
  };

  const handleNewProposal = () => {
    setCurrentProposalId(null);
    setClientName('');
    setWorkLocation('');
    setStatus('rascunho');
    setObservations('');
    setKitType('turnkey');
    setModelId('');
    setCustomArea(30);
    setCustomModelDescription('');
    setSlidingDoor(false);
    setIncludeGlass(false);
    setIncludeElectrical(false);
    setIncludeFixtures(false);
    setIncludeTilesStain(false);
    setIncludeLabor(false);
    setIncludeProject(false);
    setDiscountType('none');
    setDiscountValue(0);
    setExtraItems([]);
    
    setKitPriceOverride(undefined);
    setFixturesPriceOverride(undefined);
    setTilesStainPriceOverride(undefined);
    setLaborPriceOverride(undefined);
    setElectricalPriceOverride(undefined);
    setGlassPriceOverride(undefined);
    setProjectPriceOverride(undefined);
    setFreightOverride(undefined);
    setDistanceFromFactory(undefined);
    
    setFoundationType('none');
    setFoundationPriceOverride(undefined);
    setMasonryBathroomCount(0);
    setMasonryBathroomPriceOverride(undefined);
    setPaintType('none');
    setPaintPriceOverride(undefined);
    setFoundationIncluded(false);
    setCustomIncludedItems(undefined);
    setCustomNotIncludedItems(undefined);
    setItemOverrides({});
    
    setView('form');
  };

  const getProposalData = (): ProposalData => ({
    clientName: clientName.trim(),
    workLocation: workLocation.trim(),
    modelId: kitType === 'custom' ? 'custom' : modelId,
    customArea: kitType === 'custom' ? customArea : undefined,
    customModelDescription: kitType === 'custom' ? customModelDescription : undefined,
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
    extraItems: extraItems.filter(i => i.description.trim() && i.value > 0),
    kitPriceOverride: typeof kitPriceOverride === 'number' ? kitPriceOverride : undefined,
    fixturesPriceOverride: typeof fixturesPriceOverride === 'number' ? fixturesPriceOverride : undefined,
    tilesStainPriceOverride: typeof tilesStainPriceOverride === 'number' ? tilesStainPriceOverride : undefined,
    laborPriceOverride: typeof laborPriceOverride === 'number' ? laborPriceOverride : undefined,
    electricalPriceOverride: typeof electricalPriceOverride === 'number' ? electricalPriceOverride : undefined,
    glassPriceOverride: typeof glassPriceOverride === 'number' ? glassPriceOverride : undefined,
    projectPriceOverride: typeof projectPriceOverride === 'number' ? projectPriceOverride : undefined,
    freightOverride: typeof freightOverride === 'number' ? freightOverride : undefined,
    distanceFromFactory: typeof distanceFromFactory === 'number' ? distanceFromFactory : undefined,
    foundationType,
    foundationPriceOverride: typeof foundationPriceOverride === 'number' ? foundationPriceOverride : undefined,
    masonryBathroomCount,
    masonryBathroomPriceOverride: typeof masonryBathroomPriceOverride === 'number' ? masonryBathroomPriceOverride : undefined,
    paintType,
    paintPriceOverride: typeof paintPriceOverride === 'number' ? paintPriceOverride : undefined,
    foundationIncluded,
    customIncludedItems,
    customNotIncludedItems,
    status,
    observations: observations.trim() || undefined,
    itemOverrides,
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

    const currentData = getProposalData();
    setCustomIncludedItems(getIncludedItems(currentData));
    setCustomNotIncludedItems(getNotIncludedItems(currentData));

    setView('summary');
    window.scrollTo(0, 0);
  };

  const handleGenerate = async () => {
    const toastId = toast.loading('Gerando proposta em PDF...');
    try {
      await generateProposalPDF(getProposalData(), cabinModels);
      toast.success('Proposta gerada com sucesso!', { id: toastId });
    } catch (err) {
      toast.error('Erro ao gerar proposta. Verifique os dados.', { id: toastId });
      console.error(err);
    }
  };

  const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const proposalData = getProposalData();
  const summary = calculateProposalItems(proposalData, cabinModels);
  const selectedModel = cabinModels.find(m => m.id === modelId);
  const CASH_DISCOUNT = getModelDiscountRate(selectedModel?.id || selectedModel?.name, selectedModel?.discountRate);
  const { creditCardBase, pixBase } = getPaymentBases(summary.items, summary.total);
  const kitTotalAVista = creditCardBase * (1 - CASH_DISCOUNT);

  // Suggested values (without overrides)
  const suggested = calculateProposalItems({
    ...proposalData,
    kitPriceOverride: undefined,
    fixturesPriceOverride: undefined,
    tilesStainPriceOverride: undefined,
    laborPriceOverride: undefined,
    electricalPriceOverride: undefined,
    glassPriceOverride: undefined,
    projectPriceOverride: undefined,
    foundationPriceOverride: undefined,
    masonryBathroomPriceOverride: undefined,
    paintPriceOverride: undefined,
    freightOverride: undefined,
  }, cabinModels);

  const getSugg = (label: string) => suggested.items.find(i => i.label.toLowerCase().includes(label.toLowerCase()))?.value ?? 0;

  const renderSummaryItem = (item: { label: string, value: number, deleted?: boolean }) => {
    const label = item.label;

    if (label.includes('Incluso') && item.value === 0) {
      return <span className="font-bold text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full text-[10px] border border-green-200 uppercase tracking-wider">Incluso</span>;
    }

    if (item.deleted) {
      return (
        <div className="flex items-center gap-2">
          <span className="font-bold text-red-500/80 bg-red-50 px-2.5 py-0.5 rounded-full text-[10px] border border-red-200 uppercase tracking-wider">Excluído</span>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-green-600 hover:bg-green-50" onClick={() => {
            setItemOverrides(prev => {
              const copy = { ...prev };
              if (copy[label]) {
                copy[label] = { ...copy[label], deleted: false };
              }
              return copy;
            });
          }}>
            <Undo2 className="h-3 w-3" />
          </Button>
        </div>
      );
    }

    const isOverridden = itemOverrides[label]?.value !== undefined;
    const onReset = () => {
      setItemOverrides(prev => {
        const copy = { ...prev };
        if (copy[label]) {
          const newObj = { ...copy[label] };
          delete newObj.value;
          if (Object.keys(newObj).length === 0) delete copy[label];
          else copy[label] = newObj;
        }
        return copy;
      });
    };

    const onChange = (v: number) => {
      setItemOverrides(prev => ({
        ...prev,
        [label]: { ...prev[label], value: v }
      }));
    };

    const onDelete = () => {
      setItemOverrides(prev => ({
        ...prev,
        [label]: { ...prev[label], deleted: true }
      }));
    };

    return (
      <div className="flex items-center gap-2">
        <InlineEditablePrice 
          value={item.value} 
          onChange={onChange} 
          onReset={onReset}
          isOverridden={isOverridden}
        />
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={onDelete}
          title="Excluir este item"
        >
          <Trash2 className="h-4 w-4" strokeWidth={2.5} />
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Header Administrativo */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/50 p-4 md:p-6 rounded-2xl border border-border/40 backdrop-blur-sm gap-4">
        <div>
          <h1 className="text-xl md:text-3xl font-bold engraved-text">
            {view === 'list' ? 'Histórico de Propostas' : view === 'form' ? (currentProposalId ? 'Editar Proposta' : 'Gerador de Propostas') : 'Resumo da Proposta'}
          </h1>
          <p className="text-muted-foreground text-[10px] md:text-sm uppercase tracking-widest font-bold mt-1">Wood Bahia — Propostas Comerciais</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          {view !== 'list' && (
            <Button variant="outline" size="sm" className="rounded-xl border-stone-200 hover:bg-stone-50 w-full sm:w-auto" onClick={() => setView('list')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Ver Histórico
            </Button>
          )}
          <Button variant="outline" size="sm" className="rounded-xl border-primary/20 hover:bg-primary/5 w-full sm:w-auto" onClick={() => router.push('/admin')}>
            <LayoutDashboard className="mr-2 h-4 w-4 text-primary" />
            Dashboard
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {view === 'list' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Cards de Métricas (Contador) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Card className="wood-card overflow-hidden">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">Total de Propostas</p>
                    <h3 className="text-3xl font-black text-primary">{proposals.length}</h3>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary text-xl">
                    📄
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center pt-4">
              <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                <span>📋</span> Propostas Emitidas
              </h2>
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center flex-1 max-w-2xl justify-end">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Pesquisar por cliente, local..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 h-10 text-xs rounded-xl recessed-input w-full"
                  />
                </div>
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v || 'todos')}>
                  <SelectTrigger className="w-full sm:w-[150px] h-10 text-xs rounded-xl recessed-input">
                    <SelectValue placeholder="Filtrar por Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-primary/20">
                    <SelectItem value="todos">Todos Status</SelectItem>
                    <SelectItem value="rascunho">📝 Rascunho</SelectItem>
                    <SelectItem value="enviada">✉️ Enviada</SelectItem>
                    <SelectItem value="fechada">🤝 Ganha</SelectItem>
                    <SelectItem value="perdida">❌ Perdida</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleNewProposal} className="wood-button text-white rounded-xl h-10 font-bold flex items-center gap-2 px-4 shrink-0 text-xs">
                  <Plus className="w-4 h-4" /> Nova
                </Button>
              </div>
            </div>

            {loadingProposals ? (
              <Card className="wood-card">
                <CardContent className="p-12 flex flex-col items-center justify-center gap-4 text-muted-foreground">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <span className="text-xs uppercase font-bold tracking-wider">Carregando histórico...</span>
                </CardContent>
              </Card>
            ) : filteredProposals.length === 0 ? (
              <Card className="wood-card">
                <CardContent className="p-12 text-center text-muted-foreground space-y-4">
                  <span className="text-4xl block">🔍</span>
                  <p className="text-sm font-semibold">Nenhuma proposta encontrada.</p>
                  <p className="text-xs max-w-sm mx-auto opacity-70">Ajuste os filtros de pesquisa ou status para encontrar o registro desejado.</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="space-y-4">
                {filteredProposals.map((proposal) => {
                  const dateStr = proposal.createdAt?.seconds 
                    ? new Date(proposal.createdAt.seconds * 1000).toLocaleDateString('pt-BR') 
                    : proposal.createdAt 
                    ? new Date(proposal.createdAt).toLocaleDateString('pt-BR')
                    : new Date().toLocaleDateString('pt-BR');
                  const propStatus = (proposal.status || proposal.data?.status || 'rascunho') as 'rascunho' | 'enviada' | 'fechada' | 'perdida';
                  const statusInfo = STATUS_CONFIG[propStatus];
                  return (
                    <Card key={proposal.id} className="wood-card overflow-hidden hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-stone-850 text-base">{proposal.clientName}</span>
                            <span className="text-[10px] text-muted-foreground bg-stone-100 border border-stone-200 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">{dateStr}</span>
                            <span className={`text-[9px] ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border} border px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1`}>
                              <span>{statusInfo.emoji}</span> {statusInfo.label}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground flex flex-wrap gap-x-3 gap-y-1">
                            <span>📍 <strong>Local:</strong> {proposal.workLocation}</span>
                            <span>🏡 <strong>Modelo:</strong> {proposal.modelName}</span>
                            <span>📦 <strong>Kit:</strong> {proposal.kitTypeLabel}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 border-t sm:border-0 pt-3 sm:pt-0 border-stone-100">
                          <div className="text-right">
                            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Investimento</span>
                            <span className="font-black text-primary text-base font-display">{fmt(proposal.totalValue)}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-9 w-9 rounded-lg border-primary/10 text-primary/70 hover:text-primary hover:bg-primary/5"
                              onClick={() => handleEditProposal(proposal)}
                              title="Editar Proposta"
                            >
                              <Edit2 className="h-4.5 w-4.5" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-9 w-9 rounded-lg border-green-200 text-green-700 hover:text-green-800 hover:bg-green-50"
                              onClick={async () => {
                                const toastId = toast.loading('Gerando proposta em PDF...');
                                try {
                                  await generateProposalPDF(proposal.data, cabinModels);
                                  toast.success('Proposta gerada com sucesso!', { id: toastId });
                                } catch (err) {
                                  toast.error('Erro ao gerar proposta.', { id: toastId });
                                  console.error(err);
                                }
                              }}
                              title="Baixar PDF Comercial"
                            >
                              <FileDown className="h-4.5 w-4.5" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-9 w-9 rounded-lg border-destructive/10 text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeleteProposal(proposal.id)}
                              title="Excluir Proposta"
                            >
                              <Trash2 className="h-4.5 w-4.5" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              
              {hasMore && !searchTerm.trim() && (
                <div className="flex justify-center pt-6">
                  <Button
                    variant="outline"
                    disabled={loadingMore}
                    onClick={loadMoreProposals}
                    className="rounded-xl px-8 h-11 border-primary/20 text-primary font-bold hover:bg-primary/5 gap-2 shrink-0 text-xs shadow-sm bg-white/50 backdrop-blur-sm transition-all hover:scale-105"
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-primary" /> Carregando...
                      </>
                    ) : (
                      "Carregar Mais Propostas"
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </motion.div>
        ) : view === 'form' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Client Data */}
            <Card className="wood-card overflow-hidden">
              <CardContent className="p-4 md:p-8 space-y-6">
                <div className="flex items-center gap-3 border-b border-border/10 pb-4 mb-6">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <User className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                  </div>
                  <h2 className="font-bold text-lg md:text-xl engraved-text">Dados do Cliente</h2>
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
                      className="h-12 recessed-input rounded-xl mb-4"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="distanceFromFactory" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">
                          Distância (Lauro de Freitas) - km
                        </Label>
                        <Input
                          id="distanceFromFactory"
                          type="number"
                          placeholder="Ex: 250"
                          value={distanceFromFactory ?? ''}
                          onChange={e => setDistanceFromFactory(e.target.value === "" ? undefined : Number(e.target.value))}
                          className="h-12 recessed-input rounded-xl text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="freightOverride" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">
                          Frete Base Total Customizado (R$)
                        </Label>
                        <Input
                          id="freightOverride"
                          type="number"
                          placeholder="Ex: 5000"
                          value={freightOverride ?? ''}
                          onChange={e => setFreightOverride(e.target.value === "" ? undefined : Number(e.target.value))}
                          className="h-12 recessed-input rounded-xl text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Model & Kit */}
            <Card className="wood-card overflow-hidden">
              <CardContent className="p-4 md:p-8 space-y-6">
                <div className="flex items-center gap-3 border-b border-border/10 pb-4 mb-6">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Home className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                  </div>
                  <h2 className="font-bold text-lg md:text-xl engraved-text">Modelo e Configuração</h2>
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
                              {cabinModels.map(m => (
                                <SelectItem key={m.id} value={m.id} className="focus:bg-primary focus:text-white">
                                  {m.name} — {m.area}m²
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {modelId && (
                          <EditablePrice 
                            label="Valor Sugerido do Kit" 
                            suggested={getSugg('Kit Madeiramento')} 
                            value={kitPriceOverride} 
                            onChange={setKitPriceOverride} 
                            className="mt-4"
                          />
                        )}
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
                            value={customArea || ""}
                            onChange={e => setCustomArea(e.target.value === "" ? 0 : Number(e.target.value))}
                            className="h-12 recessed-input rounded-xl"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="customModelDescription" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Descrição do Kit Personalizado</Label>
                          <textarea
                            id="customModelDescription"
                            placeholder="Ex: Chalé com quarto e mezanino, sala e cozinha conjugados com 50m²..."
                            value={customModelDescription}
                            onChange={e => setCustomModelDescription(e.target.value)}
                            className="w-full min-h-[80px] p-3 text-sm recessed-input rounded-xl border-primary/10 focus:ring-1 focus:ring-primary/20 bg-background resize-y"
                          />
                        </div>
                        
                        <EditablePrice 
                          label="Valor Sugerido do Kit (Customizado)" 
                          suggested={getSugg('Kit Madeiramento')} 
                          value={kitPriceOverride} 
                          onChange={setKitPriceOverride} 
                        />

                        <div className="space-y-3 pt-4 border-t border-border/10">
                          <p className="text-[10px] uppercase font-bold text-primary/60 tracking-widest mb-2">Composição do Kit</p>
                          {[
                            { id: 'f', label: 'Portas, Janelas e Ferragens', state: includeFixtures, set: setIncludeFixtures },
                            { id: 't', label: 'Telhas e Stain', state: includeTilesStain, set: setIncludeTilesStain },
                            { id: 'l', label: 'Mão de Obra de Montagem', state: includeLabor, set: setIncludeLabor },
                            { id: 'p', label: 'Projeto Arquitetônico', state: includeProject, set: setIncludeProject },
                          ].map((item) => (
                            <div key={item.id} className="space-y-2">
                              <div className="flex items-center justify-between group">
                                <Label className="text-sm cursor-pointer group-hover:text-primary transition-colors">{item.label}</Label>
                                <Switch 
                                  checked={item.state} 
                                  onCheckedChange={item.set} 
                                  className="toggle-glow data-[state=checked]:bg-primary"
                                />
                              </div>
                              {item.state && (
                                <EditablePrice 
                                  label={`Valor: ${item.label}`}
                                  suggested={getSugg(item.label)} 
                                  value={
                                    item.id === 'f' ? fixturesPriceOverride :
                                    item.id === 't' ? tilesStainPriceOverride :
                                    item.id === 'l' ? laborPriceOverride :
                                    projectPriceOverride
                                  }
                                  onChange={
                                    item.id === 'f' ? setFixturesPriceOverride :
                                    item.id === 't' ? setTilesStainPriceOverride :
                                    item.id === 'l' ? setLaborPriceOverride :
                                    setProjectPriceOverride
                                  } 
                                />
                              )}
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
                      {slidingDoor && !(['parceira', 'turnkey'].includes(kitType)) && (
                        <EditablePrice 
                          label="Porta de Correr" 
                          suggested={getSugg('Porta de Correr')} 
                          value={fixturesPriceOverride} 
                          onChange={setFixturesPriceOverride} 
                        />
                      )}

                      {( (['parceira', 'turnkey'].includes(kitType)) || (kitType === 'custom' && includeLabor)) && (
                        <>
                          <div className="pt-2">
                            <div className="flex items-center justify-between group">
                              <div>
                                <Label className="text-sm font-bold text-foreground">Incluir Vidros</Label>
                                <p className="text-[10px] text-muted-foreground">Conforme projeto</p>
                              </div>
                              <Switch checked={includeGlass} onCheckedChange={setIncludeGlass} className="toggle-glow data-[state=checked]:bg-primary" />
                            </div>
                            {includeGlass && (
                              <EditablePrice 
                                label="Valor Vidros" 
                                suggested={getSugg('Vidros')} 
                                value={glassPriceOverride} 
                                onChange={setGlassPriceOverride} 
                                className="mt-2"
                              />
                            )}
                          </div>

                          <div className="pt-2">
                            <div className="flex items-center justify-between group">
                              <div>
                                <Label className="text-sm font-bold text-foreground">Elétrica/Hidráulica Básica</Label>
                                <p className="text-[10px] text-muted-foreground">Mão de obra inclusa</p>
                              </div>
                              <Switch checked={includeElectrical} onCheckedChange={setIncludeElectrical} className="toggle-glow data-[state=checked]:bg-primary" />
                            </div>
                            {includeElectrical && (
                              <EditablePrice 
                                label="Valor Elétrica/Hidráulica" 
                                suggested={getSugg('Instalação Elétrica')} 
                                value={electricalPriceOverride} 
                                onChange={setElectricalPriceOverride} 
                                className="mt-2"
                              />
                            )}
                          </div>
                        </>
                      )}
                    </div>

                    <div className="pt-6 border-t border-primary/10 mt-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Layers className="w-4 h-4 text-primary" />
                        <h3 className="font-black text-[10px] uppercase tracking-widest text-primary/80">Fundações e Base</h3>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                           <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Tipo de Base</Label>
                           <Select value={foundationType} onValueChange={(v) => setFoundationType(v as FoundationType)}>
                             <SelectTrigger className="h-10 text-xs recessed-input rounded-xl w-full">
                               <SelectValue />
                             </SelectTrigger>
                             <SelectContent className="rounded-xl border-primary/20">
                               <SelectItem value="none">Sem Fundação Inclusa</SelectItem>
                               <SelectItem value="wooden_eucalyptus">Base Estrutural de Madeira + Eucalipto</SelectItem>
                               <SelectItem value="wooden_masonry">Base Estrutural de Madeira + Alvenaria</SelectItem>
                               <SelectItem value="radier">Base Radier + Banheiro Alvenaria</SelectItem>
                             </SelectContent>
                           </Select>
                        </div>

                        {foundationType !== 'none' && (
                          <div className="flex items-center justify-between p-3 bg-primary/5 rounded-xl border border-primary/10">
                            <div>
                              <Label className="text-xs font-bold text-foreground">Fundação e Alicerce Inclusos</Label>
                              <p className="text-[9px] text-muted-foreground">Define se a fundação está embutida no valor da proposta</p>
                            </div>
                            <Switch 
                              checked={foundationIncluded} 
                              onCheckedChange={setFoundationIncluded}
                              className="toggle-glow data-[state=checked]:bg-primary"
                            />
                          </div>
                        )}

                        {foundationType !== 'none' && (
                          <EditablePrice 
                            label="Valor da Base"
                            suggested={
                              foundationType === 'eucalyptus' || foundationType === 'wooden_eucalyptus'
                                ? getSugg('Eucalipto') + getSugg('Estrutural')
                                : foundationType === 'masonry' || foundationType === 'wooden_masonry'
                                ? getSugg('Manilhas') + getSugg('Estrutural')
                                : getSugg('Radier')
                            }
                            value={foundationPriceOverride} 
                            onChange={setFoundationPriceOverride} 
                          />
                        )}

                        <div className="pt-2">
                          <div className="flex items-center justify-between group">
                            <div>
                              <Label className="text-sm font-bold text-foreground">Banheiros em Alvenaria</Label>
                              <p className="text-[10px] text-muted-foreground">R$ 8.000 un (10% OFF a partir de 2)</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button type="button" variant="outline" size="icon" className="h-6 w-6 rounded-full" onClick={() => setMasonryBathroomCount(Math.max(0, masonryBathroomCount - 1))}><span className="text-lg mb-1">-</span></Button>
                              <span className="text-sm font-bold w-4 text-center">{masonryBathroomCount}</span>
                              <Button type="button" variant="outline" size="icon" className="h-6 w-6 rounded-full" onClick={() => setMasonryBathroomCount(masonryBathroomCount + 1)}><span className="text-lg mb-1">+</span></Button>
                            </div>
                          </div>
                          {masonryBathroomCount > 0 && (
                            <EditablePrice 
                              label="Valor do(s) Banheiro(s)" 
                              suggested={getSugg('Banheiro')} 
                              value={masonryBathroomPriceOverride} 
                              onChange={setMasonryBathroomPriceOverride} 
                              className="mt-2"
                            />
                          )}
                        </div>

                        <div className="pt-4 border-t border-primary/10">
                          <div className="flex items-center gap-2 mb-4">
                            <Paintbrush className="w-4 h-4 text-primary" />
                            <h3 className="font-black text-[10px] uppercase tracking-widest text-primary/80">Pintura Completa</h3>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="space-y-2">
                              <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Tipo de Pintura</Label>
                              <Select value={paintType} onValueChange={(v) => setPaintType(v as PaintType)}>
                                <SelectTrigger className="h-10 text-xs recessed-input rounded-xl w-full">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-primary/20">
                                  <SelectItem value="none">Sem Pintura Inclusa</SelectItem>
                                  <SelectItem value="1cor">Pintura Completa — 1 Cor (R$ 2.500)</SelectItem>
                                  <SelectItem value="2cores">Pintura Completa — 2 Cores (R$ 3.500)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            {paintType !== 'none' && (
                              <EditablePrice 
                                label="Valor da Pintura"
                                suggested={paintType === '1cor' ? 2500 : 3500}
                                value={paintPriceOverride} 
                                onChange={setPaintPriceOverride} 
                              />
                            )}
                          </div>
                        </div>
                      </div>
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
                            onChange={e => setDiscountValue(e.target.value === "" ? 0 : Number(e.target.value))}
                            className="h-12 recessed-input rounded-xl"
                          />
                        </motion.div>
                      )}
                 {/* Status & Observations */}
             <Card className="wood-card overflow-hidden">
               <CardContent className="p-4 md:p-8 space-y-6">
                 <div className="flex items-center gap-3 border-b border-border/10 pb-4 mb-6">
                   <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                     <Settings2 className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                   </div>
                   <h2 className="font-bold text-lg md:text-xl engraved-text">Status e Notas de Negociação</h2>
                 </div>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                   <div className="space-y-2 sm:col-span-1">
                     <Label htmlFor="proposalStatus" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Status da Proposta</Label>
                     <Select value={status} onValueChange={(v) => setStatus(v as any)}>
                       <SelectTrigger className="h-12 recessed-input rounded-xl w-full">
                         <SelectValue />
                       </SelectTrigger>
                       <SelectContent className="rounded-xl border-primary/20">
                         <SelectItem value="rascunho">📝 Rascunho</SelectItem>
                         <SelectItem value="enviada">✉️ Enviada</SelectItem>
                         <SelectItem value="fechada">🤝 Ganha (Fechada)</SelectItem>
                         <SelectItem value="perdida">❌ Perdida</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>
                   <div className="space-y-2 sm:col-span-2">
                     <Label htmlFor="observations" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Observações Especiais (Serão impressas no PDF)</Label>
                     <textarea
                       id="observations"
                       placeholder="Ex: Incluso brinde X, pagamento em 50% de sinal e saldo no embarque..."
                       value={observations}
                       onChange={e => setObservations(e.target.value)}
                       className="w-full min-h-[48px] p-3 text-sm recessed-input rounded-xl border-primary/10 focus:ring-1 focus:ring-primary/20 bg-background resize-y"
                     />
                   </div>
                 </div>
               </CardContent>
             </Card>

             {/* Action Button */}
             <div className="flex justify-center pt-8">
               <Button
                 onClick={handleShowSummary}
                 className="h-16 md:h-20 px-8 md:px-16 text-sm md:text-xl font-black wood-button text-white rounded-[1.5rem] md:rounded-[2rem] shadow-2xl flex items-center gap-2 md:gap-4 group transition-all hover:scale-105 uppercase tracking-widest w-full md:w-auto"
               >
                 <FileDown className="w-5 h-5 md:w-7 md:h-7 group-hover:animate-bounce" />
                 Gerar Resumo da Proposta
               </Button>
             </div>
                    </div>

                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Button */}
            <div className="flex justify-center pt-8">
              <Button
                onClick={handleShowSummary}
                className="h-16 md:h-20 px-8 md:px-16 text-sm md:text-xl font-black wood-button text-white rounded-[1.5rem] md:rounded-[2rem] shadow-2xl flex items-center gap-2 md:gap-4 group transition-all hover:scale-105 uppercase tracking-widest w-full md:w-auto"
              >
                <FileDown className="w-5 h-5 md:w-7 md:h-7 group-hover:animate-bounce" />
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
                           <div>
                             <p className="text-[10px] uppercase text-muted-foreground font-bold mb-1">Status Comercial</p>
                             <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_CONFIG[status]?.bg} ${STATUS_CONFIG[status]?.text} ${STATUS_CONFIG[status]?.border} border uppercase tracking-wider`}>
                               {STATUS_CONFIG[status]?.emoji} {STATUS_CONFIG[status]?.label}
                             </span>
                           </div>
                         </div>
                       </div>

                       {observations.trim() && (
                         <div className="space-y-2 bg-amber-500/5 p-4 rounded-xl border border-amber-500/10">
                           <p className="text-[10px] font-black uppercase tracking-widest text-amber-800">Observações Especiais para o PDF</p>
                           <p className="text-xs text-stone-700 whitespace-pre-wrap">{observations}</p>
                         </div>
                       )}

                      <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/60 border-l-4 border-primary pl-3">Detalhamento Técnico</p>
                        <div className="space-y-2">
                          {summary.items
                            .filter(item => {
                              // Filtra para remover itens extras daqui, pois vamos renderizá-los separadamente com inputs
                              return !extraItems.some(extra => extra.description === item.label);
                            })
                            .map((item, i) => (
                              <div key={i} className={`flex justify-between text-sm py-2 border-b border-primary/5 items-center ${item.deleted ? 'opacity-50 grayscale' : ''}`}>
                                <span className={`text-muted-foreground font-medium ${item.deleted ? 'line-through' : ''}`}>{item.label}</span>
                                {renderSummaryItem(item)}
                              </div>
                            ))}
                           <div className="flex justify-between text-sm py-2 border-b border-primary/5 items-center">
                              <span className="text-muted-foreground font-medium">Frete Estimado (Logística)</span>
                              <div className="flex items-center gap-4">
                                <span className="font-bold line-through opacity-30 text-primary text-xs">{fmt(summary.freight * 2)}</span>
                                <InlineEditablePrice 
                                  value={summary.freight * 2} 
                                  onChange={setFreightOverride} 
                                  onReset={() => setFreightOverride(undefined)} 
                                  isOverridden={freightOverride !== undefined}
                                />
                              </div>
                            </div>
                            {summary.additionalFreight > 0 && (
                              <div className="flex justify-between text-sm py-2 border-b border-primary/5">
                                <span className="text-muted-foreground font-medium text-amber-600">Frete Adicional (&gt; 200km)</span>
                                <span className="font-bold text-amber-600">+{fmt(summary.additionalFreight)}</span>
                              </div>
                            )}
                            {summary.additionalTravelCost > 0 && (
                              <div className="flex justify-between text-sm py-2 border-b border-primary/5">
                                <span className="text-muted-foreground font-medium text-amber-600">Deslocamento Adicional Chave na Mão (&gt; 200km)</span>
                                <span className="font-bold text-amber-600">+{fmt(summary.additionalTravelCost)}</span>
                              </div>
                            )}

                          {/* Itens Adicionais Personalizados (Editáveis) */}
                          {extraItems.map((item, index) => (
                            <div key={`extra-${index}`} className="flex gap-2 py-2 border-b border-primary/5 items-center group relative">
                              <div className="flex-1">
                                <Input
                                  placeholder="Descrição do item extra (ex: Alojamento equipe)"
                                  value={item.description}
                                  onChange={e => updateExtraItem(index, { description: e.target.value })}
                                  className="h-8 text-xs recessed-input rounded-lg border-primary/10 w-full"
                                />
                              </div>
                              <div className="w-24 flex items-center gap-1">
                                <span className="text-[10px] font-bold text-muted-foreground">R$</span>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  value={item.value || ''}
                                  onChange={e => updateExtraItem(index, { value: e.target.value === '' ? 0 : Number(e.target.value) })}
                                  className="h-8 text-xs font-bold font-mono text-right border-primary/10 rounded-lg focus-visible:ring-1 focus-visible:ring-primary/20 bg-white w-full"
                                />
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeExtraItem(index)}
                                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                                title="Remover item personalizado"
                              >
                                <Trash2 className="h-4 w-4" strokeWidth={2.5} />
                              </Button>
                            </div>
                          ))}

                          {/* Botão de incluir item adicional no final do detalhamento */}
                          <div className="pt-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={addExtraItem}
                              className="w-full h-8 border-dashed border-primary/30 text-primary hover:bg-primary/5 rounded-xl uppercase text-[9px] font-black tracking-widest"
                            >
                              <Plus className="w-3.5 h-3.5 mr-1.5" />
                              Incluir Item Adicional Personalizado
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6 pt-6 border-t border-primary/10">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <p className="text-[10px] font-black uppercase tracking-widest text-green-700 border-l-4 border-green-700 pl-3">O Que Está Incluso</p>
                            <Button variant="outline" size="sm" onClick={() => setCustomIncludedItems([...(customIncludedItems || []), ''])} className="h-7 text-[10px] uppercase font-bold">
                              <Plus className="w-3 h-3 mr-1" /> Adicionar
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {(customIncludedItems || []).map((item, index) => (
                              <div key={`inc-${index}`} className="flex items-center gap-2">
                                <Input 
                                  value={item} 
                                  onChange={(e) => {
                                    const newItems = [...(customIncludedItems || [])];
                                    newItems[index] = e.target.value;
                                    setCustomIncludedItems(newItems);
                                  }} 
                                  className="h-8 text-xs recessed-input" 
                                />
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0" onClick={() => {
                                  const newItems = (customIncludedItems || []).filter((_, i) => i !== index);
                                  setCustomIncludedItems(newItems);
                                }}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <p className="text-[10px] font-black uppercase tracking-widest text-amber-700 border-l-4 border-amber-700 pl-3">O Que Não Está Incluso</p>
                            <Button variant="outline" size="sm" onClick={() => setCustomNotIncludedItems([...(customNotIncludedItems || []), ''])} className="h-7 text-[10px] uppercase font-bold">
                              <Plus className="w-3 h-3 mr-1" /> Adicionar
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {(customNotIncludedItems || []).map((item, index) => (
                              <div key={`ninc-${index}`} className="flex items-center gap-2">
                                <Input 
                                  value={item} 
                                  onChange={(e) => {
                                    const newItems = [...(customNotIncludedItems || [])];
                                    newItems[index] = e.target.value;
                                    setCustomNotIncludedItems(newItems);
                                  }} 
                                  className="h-8 text-xs recessed-input" 
                                />
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0" onClick={() => {
                                  const newItems = (customNotIncludedItems || []).filter((_, i) => i !== index);
                                  setCustomNotIncludedItems(newItems);
                                }}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-primary/5 p-4 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-primary/20 space-y-4 md:space-y-6 relative overflow-hidden shadow-xl">
                          <div className="absolute top-0 right-0 w-16 h-16 md:w-24 md:h-24 bg-primary/5 -translate-y-1/2 translate-x-1/2 rounded-full" />
                          
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary/60 border-b border-primary/10 pb-3">Resumo de Investimento</p>
                          
                          <div className="flex justify-between items-center text-green-700 font-bold bg-green-500/10 p-3 md:p-4 rounded-xl border border-green-500/20 mb-2">
                            <div className="flex flex-col">
                              <span className="text-[10px] md:text-xs uppercase tracking-tighter">Bônus: Frete Compartilhado</span>
                              <span className="text-[9px] md:text-[10px] font-normal opacity-80 pt-0.5">Wood Bahia paga 50%</span>
                            </div>
                            <span className="text-sm md:text-lg">-{fmt(summary.freight)}</span>
                          </div>

                          {summary.discount > 0 && (
                            <div className="flex justify-between items-center text-primary font-bold bg-primary/10 p-3 md:p-4 rounded-xl border border-primary/30 shadow-md animate-in fade-in zoom-in duration-500">
                              <div className="flex flex-col">
                                <span className="text-[10px] md:text-xs uppercase tracking-tighter flex items-center gap-2">🎁 Desconto Especial</span>
                                <span className="text-[9px] md:text-[10px] font-normal opacity-80 pt-0.5">Autorizado pelo Operador</span>
                              </div>
                              <span className="text-base md:text-xl">-{fmt(summary.discount)}</span>
                            </div>
                          )}

                          <Separator className="my-2 bg-primary/20" />

                          <div className="flex justify-between items-center px-2">
                            <span className="text-[10px] md:text-xs text-muted-foreground font-bold uppercase tracking-widest">Sinal (Início do Projeto)</span>
                            <span className="text-sm md:text-base font-black text-primary">{fmt(summary.total * 0.3)}</span>
                          </div>

                          <div className="pt-4 md:pt-6 border-t border-primary/10 mt-2">
                             <div className="text-center md:text-left">
                                <p className="text-[10px] uppercase font-black text-primary/60 mb-1 md:mb-2 tracking-[.2em] ml-1">Total do Investimento</p>
                                <h3 className="text-3xl md:text-5xl font-black engraved-text leading-tight">{fmt(summary.total)}</h3>
                             </div>
                          </div>

                          <div className="space-y-2 py-3">
                            <div className="flex justify-between items-center px-2">
                              <span className="text-[10px] md:text-xs text-muted-foreground font-bold uppercase tracking-widest">Valor do Kit (Sem Desconto)</span>
                              <span className="text-sm md:text-base font-bold text-foreground">{fmt(creditCardBase)}</span>
                            </div>
                            <div className="flex justify-between items-center px-2">
                              <span className="text-[10px] md:text-xs text-green-700/80 font-bold uppercase tracking-widest">Kit à Vista ({CASH_DISCOUNT * 100}% desc.)</span>
                              <span className="text-sm md:text-base font-bold text-green-700">{fmt(kitTotalAVista)}</span>
                            </div>
                          </div>

                          <div className="bg-primary p-4 md:p-5 rounded-2xl text-white text-center shadow-lg transform rotate-[-1deg] border-2 border-primary-foreground/20">
                             <p className="text-[10px] uppercase font-bold opacity-80 mb-1 tracking-widest flex items-center justify-center gap-2">
                                <span className="inline-block w-2 h-2 bg-white rounded-full animate-pulse" />
                                Condição Facilitada do Kit
                             </p>
                             <p className="text-xs md:text-sm font-bold">💳 <span className="opacity-80">Parcele o kit em 18x s/ juros de</span> <span className="text-lg md:text-2xl font-black">{fmt(calculateInstallmentValue(creditCardBase, 18).installment)}</span></p>
                          </div>
                          
                          <p className="text-[10px] text-center text-muted-foreground italic px-4">Valores sujeitos a alteração conforme tributação regional e prazos de operadora.</p>
                       </div>
                    </div>
                  </div>
                </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center pt-8">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setView('form')}
                className="h-12 md:h-16 px-6 md:px-8 rounded-[1.2rem] border-2 border-primary/20 font-black text-primary/60 hover:bg-primary/5 hover:text-primary transition-all uppercase tracking-widest text-xs md:text-sm"
              >
                Voltar ao Formulário
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleSaveProposal}
                className="h-12 md:h-16 px-6 md:px-8 rounded-[1.2rem] border-2 border-[#B06D46]/20 bg-[#B06D46]/5 font-black text-[#B06D46] hover:bg-[#B06D46]/10 transition-all uppercase tracking-widest text-xs md:text-sm"
              >
                {currentProposalId ? 'Atualizar Proposta' : 'Salvar Proposta'}
              </Button>
              <Button
                onClick={handleGenerate}
                size="lg"
                className="h-12 md:h-16 px-8 md:px-10 text-xs md:text-sm font-black wood-button text-white rounded-[1.2rem] shadow-xl flex items-center gap-2 group transition-all hover:scale-105 uppercase tracking-widest"
              >
                <FileDown className="w-4 h-4 md:w-5 md:h-5 group-hover:animate-bounce" />
                GERAR PDF COMERCIAL
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
