export interface CabinModel {
  id: string;
  name: string;
  area: number;
  kitPrice: number;
  tilesStainPrice: number;
  fixturesPrice: number;
  discountRate?: number | string;
}

export const CABIN_MODELS: CabinModel[] = [
  { id: 'guarajuba', name: 'Chalé Guarajuba', area: 52, kitPrice: 38870, tilesStainPrice: 12210, fixturesPrice: 5200 },
  { id: 'itacimirim', name: 'Chalé Itacimirim', area: 35, kitPrice: 26160, tilesStainPrice: 10250, fixturesPrice: 3500 },
  { id: 'curralinho', name: 'Cabana Camping Curralinho', area: 6.5, kitPrice: 5890, tilesStainPrice: 0, fixturesPrice: 650 },
  { id: 'praia-do-forte', name: 'Chalé Praia do Forte', area: 21, kitPrice: 14580, tilesStainPrice: 6875, fixturesPrice: 2100 },
  { id: 'arembepe-plus', name: 'Chalé Arembepe Plus', area: 20, kitPrice: 14950, tilesStainPrice: 6700, fixturesPrice: 0 },
  { id: 'arembepe', name: 'Cabana Camping Arembepe', area: 10.5, kitPrice: 9580, tilesStainPrice: 0, fixturesPrice: 1050 },
  { id: 'baixios', name: 'Chalé Baixios', area: 32, kitPrice: 23920, tilesStainPrice: 9650, fixturesPrice: 3200 },
  { id: 'casa-caymmi', name: 'Casa Caymmi', area: 60, kitPrice: 40830, tilesStainPrice: 12850, fixturesPrice: 6000 },
  { id: 'chale-vilas-do-atlantico', name: 'Chalé Vilas do Atlântico', area: 35, kitPrice: 24150, tilesStainPrice: 10250, fixturesPrice: 3500 },
  { id: 'chale-escandinavo-trancoso', name: 'Chalé Escandinavo Trancoso', area: 35, kitPrice: 40250, tilesStainPrice: 10250, fixturesPrice: 3500 },
];

export function getModelDiscountRate(modelIdOrName?: string, customDiscountRate?: number | string): number {
  return 0.10; // 10% fixos para todos os kits na nova promoção (remove regras de 15% etc)
}

export const CARD_RATES: [number, number][] = [
  [1, 0], [2, 3.99], [3, 4.99], [4, 6.59], [5, 7.09], [6, 7.69],
  [7, 7.89], [8, 8.59], [9, 9.29], [10, 9.99], [11, 11.79],
  [12, 11.99], [13, 13.24], [14, 13.99], [15, 14.74],
  [16, 15.49], [17, 16.24], [18, 16.99],
];

export function calculateInstallmentValue(
  total: number, 
  installments: number, 
  hasDiscount: boolean = false
): { total: number; installment: number; isInterestFree: boolean } {
  const rateInfo = CARD_RATES.find(([n]) => n === installments);
  const rate = rateInfo ? rateInfo[1] : 0;
  
  // Se tem desconto, não tem parcelamento sem juros (isInterestFree = false para todas)
  // Se não tem desconto, permite até 18x sem juros (isInterestFree = true se installments <= 18)
  const isInterestFree = !hasDiscount && installments <= 18;
  
  const totalWithInterest = isInterestFree 
    ? total 
    : Math.round(total / (1 - rate / 100) * 100) / 100;
    
  const installmentValue = Math.round(totalWithInterest / installments * 100) / 100;
  
  return {
    total: totalWithInterest,
    installment: installmentValue,
    isInterestFree
  };
}

// Per-m² rates for custom kit
export function getTimberRate(area: number): number {
  if (area <= 12) return 906;
  if (area <= 80) return 748;
  return 690;
}
/** Telhas e Stain — precificação progressiva em 3 faixas */
export const TILES_BASE = 2000;
export const TILES_RATE_1 = 250;   // até 25m²
export const TILES_RATE_2 = 200;   // 25–40m²
export const TILES_RATE_3 = 80;    // acima de 40m²
export const TILES_TIER_1 = 25;
export const TILES_TIER_2 = 40;

export function getTilesStainPrice(area: number, modelId?: string): { total: number; perM2: number } {
  if (modelId === 'arembepe-plus') {
    return { total: 6700, perM2: 335 };
  }
  // Regra especial para Kits Camping abaixo de 10m² (ex: Curralinho)
  if (area < 10) {
    const total = 4200;
    const perM2 = Math.round((total / area) * 100) / 100;
    return { total, perM2 };
  }

  let total: number;
  if (area <= TILES_TIER_1) {
    total = TILES_BASE + area * TILES_RATE_1;
  } else if (area <= TILES_TIER_2) {
    total = TILES_BASE + TILES_TIER_1 * TILES_RATE_1 + (area - TILES_TIER_1) * TILES_RATE_2;
  } else {
    const upTo40 = TILES_BASE + TILES_TIER_1 * TILES_RATE_1 + (TILES_TIER_2 - TILES_TIER_1) * TILES_RATE_2;
    total = upTo40 + (area - TILES_TIER_2) * TILES_RATE_3;
  }
  total = Math.round(total * 100) / 100;
  const perM2 = Math.round((total / area) * 100) / 100;
  return { total, perM2 };
}
// ── Portas, Janelas e Ferragens ──
export const FIXTURES_BASE = 2700;
export const FIXTURES_RATE = 60;
export const FIXTURES_TIER1 = 40;
export const FIXTURES_TIER1_EXTRA = 500;
export const FIXTURES_TIER2 = 50;
export const FIXTURES_TIER2_EXTRA = 700;

export function getFixturesPrice(area: number, modelId?: string): number {
  if (modelId === 'arembepe-plus') {
    return 0;
  }
  return area * 100;
}
/** Vidros — fixo até 32m², acima cobra excedente a R$ 150/m² */
export function getGlassPrice(area: number, modelId?: string): number {
  if (modelId === 'arembepe-plus') return 3000;
  if (area <= 32) return 8500;
  return 8500 + Math.round((area - 32) * 150);
}

/** Kit Elétrica/Hidráulica — preço por faixa de m² (não é por m²) */
export function getElectricalKit(area: number): number {
  if (area <= 14) return 1000;
  if (area <= 25) return 2200;
  if (area <= 35) return 2700;
  if (area <= 55) return 3500;
  return 3700;
}

export function getLaborRate(area: number): number {
  if (area <= 14) return 650;
  if (area <= 25) return 550;
  if (area <= 35) return 500;
  if (area <= 55) return 450;
  return 400;
}

export function getLaborCost(area: number): number {
  return area * getLaborRate(area);
}

export function getEucalyptusFoundation(area: number): number {
  if (area <= 14) return 800;
  if (area <= 25) return 1200;
  if (area <= 35) return 1700;
  if (area <= 55) return 2000;
  return 2500;
}

export function getMasonryFoundation(area: number): number {
  if (area <= 10) return 1500;
  if (area <= 16) return 2000;
  if (area <= 25) return 3000;
  if (area <= 35) return 4000;
  if (area <= 55) return 5000;
  return 6500;
}

export function getRadierFoundation(area: number): number {
  return Math.round(area * 400);
}

export function getFreight(area: number): number {
  return area * 95;
}

export type KitType = 'madeiramento' | 'parceira' | 'turnkey' | 'custom';
export type FoundationType = 'eucalyptus' | 'masonry' | 'radier' | 'wooden_base' | 'wooden_eucalyptus' | 'wooden_masonry' | 'none';
export type PaintType = 'none' | '1cor' | '2cores';

export interface ExtraItem {
  description: string;
  value: number;
}

export interface CustomOptions {
  fixtures: boolean;
  tilesStain: boolean;
  labor: boolean;
  electrical: boolean;
  glass: boolean;
  project: boolean;
}

export interface ProposalData {
  clientName: string;
  workLocation: string;
  modelId: string;
  customArea?: number;
  customModelDescription?: string;
  kitType: KitType;
  includeGlass: boolean;
  includeElectrical: boolean;
  includeFixtures: boolean;
  includeTilesStain: boolean;
  includeLabor: boolean;
  includeProject: boolean;
  discountType: 'none' | 'percentage' | 'fixed';
  discountValue: number;
  extraItems?: ExtraItem[];
  kitPriceOverride?: number;
  fixturesPriceOverride?: number;
  tilesStainPriceOverride?: number;
  laborPriceOverride?: number;
  electricalPriceOverride?: number;
  glassPriceOverride?: number;
  projectPriceOverride?: number;
  freightOverride?: number;
  distanceFromFactory?: number;
  foundationType?: FoundationType;
  foundationPriceOverride?: number;
  masonryBathroomCount?: number;
  masonryBathroomPriceOverride?: number;
  paintType?: PaintType;
  paintPriceOverride?: number;
  foundationIncluded?: boolean;
  customIncludedItems?: string[];
  customNotIncludedItems?: string[];
  status?: 'rascunho' | 'enviada' | 'fechada' | 'perdida';
  observations?: string;
  itemOverrides?: Record<string, { value?: number, deleted?: boolean }>;
}

/** Options available as add-ons for standard kits (1-4) */
export interface KitAddons {
  electrical: boolean;
  glass: boolean;
}

export interface SimulationState {
  clientData: { name: string; city: string; state: string; distance?: number; };
  model: CabinModel | null;
  kitType: KitType | null;
  customOptions: CustomOptions;
  kitAddons: KitAddons;
  foundationType: FoundationType | null;
  foundationIncluded?: boolean;
  customArea: number; // used when kitType === 'custom'
}

export function needsFoundationStep(state: SimulationState): boolean {
  if (state.kitType === 'parceira' || state.kitType === 'turnkey') return true;
  if (state.kitType === 'custom' && state.customOptions.labor) return true;
  return false;
}

export interface LineItem {
  label: string;
  value: number;
  deleted?: boolean;
}

export function getEffectiveArea(state: SimulationState): number {
  if (state.kitType === 'custom') return state.customArea;
  return state.model?.area ?? 0;
}

export function calculateSummary(state: SimulationState): { items: LineItem[]; freight: number; additionalFreight: number; additionalTravelCost: number; total: number; materialSubtotal: number; laborTotal: number } {
  const items: LineItem[] = [];
  const kit = state.kitType;
  const area = getEffectiveArea(state);
  const isTurnkey = kit === 'turnkey';

  // 1. Kit Madeiramento
  if (kit === 'custom') {
    const timberRate = getTimberRate(area);
    items.push({ label: `Kit Madeiramento (${area}m² × R$ ${timberRate})`, value: Math.round(area * timberRate) });
  } else {
    if (!state.model) return { items: [], freight: 0, additionalFreight: 0, additionalTravelCost: 0, total: 0, materialSubtotal: 0, laborTotal: 0 };
    items.push({ label: 'Kit Madeiramento', value: state.model.kitPrice });
  }

  const modelId = state.model?.id;

  // 2. Foundation
  if (needsFoundationStep(state) && state.foundationType && state.foundationType !== 'none') {
    const isEucalyptus = state.foundationType === 'wooden_eucalyptus' || state.foundationType === 'eucalyptus';
    const isInc = isTurnkey && (isEucalyptus ? (state.foundationIncluded !== false) : !!state.foundationIncluded);

    if (state.foundationType === 'radier') {
      items.push({ 
        label: `Base Radier + Banheiro Alvenaria${isInc ? ' (Incluso)' : ''}`, 
        value: isInc ? 0 : getRadierFoundation(area) 
      });
    } else if (state.foundationType === 'wooden_eucalyptus' || state.foundationType === 'wooden_masonry') {
      const isEuc = state.foundationType === 'wooden_eucalyptus';
      
      items.push({ 
        label: `Base Estrutural de Madeira${isInc ? ' (Incluso)' : ''}`, 
        value: isInc ? 0 : (area * 83) 
      });
      
      items.push({ 
        label: `Fundação Sapatas ${isEuc ? 'em Eucalipto' : 'Manilhas de Alvenaria'}${isInc ? ' (Incluso)' : ''}`, 
        value: isInc ? 0 : (isEuc ? getEucalyptusFoundation(area) : getMasonryFoundation(area))
      });
      
      items.push({ 
        label: `Assoalho${isInc ? ' (Incluso)' : ''}`, 
        value: isInc ? 0 : (area * 90) 
      });
    }
  }

  // 3. Portas e Janelas / Ferragens
  const hasFixtures = kit === 'custom' ? state.customOptions.fixtures : (kit === 'parceira' || isTurnkey);
  if (hasFixtures) {
    const fpValue = getFixturesPrice(area, kit === 'custom' ? 'custom' : modelId);
    
    const portasJanelasValue = Math.round(fpValue * 0.8);
    const ferragensValue = fpValue - portasJanelasValue;

    items.push({ 
      label: 'Portas e Janelas', 
      value: portasJanelasValue 
    });
    items.push({ label: 'Ferragens', value: ferragensValue });
  }

  // 4. Telhas / Stain
  const hasTiles = kit === 'custom' ? state.customOptions.tilesStain : isTurnkey;
  if (hasTiles) {
    const ts = getTilesStainPrice(area, kit === 'custom' ? 'custom' : modelId);
    const tsValue = ts.total;

    const telhasValue = Math.round(tsValue * 0.75);
    const stainValue = tsValue - telhasValue;

    items.push({ label: `Telhas (${area}m²)`, value: telhasValue });
    items.push({ label: `Stain (Madeiramento e Forro)`, value: stainValue });
  }

  // 5. Mão de Obra
  const hasLabor = kit === 'custom' ? state.customOptions.labor : (kit === 'parceira' || isTurnkey);
  if (hasLabor) {
    items.push({ label: `Mão de Obra (${area}m² × R$ ${getLaborRate(area).toLocaleString('pt-BR')})`, value: getLaborCost(area) });
  }

  // 6. Elétrica
  const hasElec = kit === 'custom' ? state.customOptions.electrical : state.kitAddons.electrical;
  if (hasElec) {
    items.push({ label: `Kit Elétrica/Hidráulica`, value: getElectricalKit(area) });
  }

  // 7. Pintura Completa
  if (isTurnkey) {
    const paintCost = area <= 25 ? 2000 : area <= 55 ? 3000 : 4500;
    items.push({ label: 'Pintura e Tratamento (Stain)', value: paintCost });
  }

  // 8. Vidros
  const hasGlass = kit === 'custom' ? state.customOptions.glass : (isTurnkey || state.kitAddons.glass);
  if (hasGlass) {
    items.push({ label: `Vidros`, value: getGlassPrice(area, kit === 'custom' ? 'custom' : modelId) });
  }

  // 9. Gestão e Coordenação Obra
  if (isTurnkey) {
    items.push({ label: 'Gestão e Coordenação Obra', value: Math.round(getLaborCost(area) * 0.25) });
  }

  // 10. Projeto Personalizado
  if (kit === 'custom' && state.customOptions.project) {
    items.push({ label: `Projeto Personalizado (${area}m² × R$ 25,00)`, value: Math.round(area * 25) });
  }

  // Calculate totals
  const subtotal = items.reduce((sum, i) => sum + i.value, 0);
  const laborTotal = items.filter(i => i.label.includes('Mão de Obra') || i.label.includes('Gestão e Coordenação')).reduce((sum, i) => sum + i.value, 0);
  const materialSubtotal = subtotal - laborTotal;
  const freight = getFreight(area);

  let additionalFreight = 0;
  if (state.clientData?.distance && state.clientData.distance > 200) {
    additionalFreight = (state.clientData.distance - 200) * 5;
  }

  let additionalTravelCost = 0;
  if (state.kitType === 'turnkey' && state.clientData?.distance && state.clientData.distance > 200) {
    additionalTravelCost = (state.clientData.distance - 200) * 7.5;
  }

  const total = subtotal + freight + additionalFreight + additionalTravelCost;

  return { items, freight, additionalFreight, additionalTravelCost, total, materialSubtotal, laborTotal };
}

export function calculateProposalItems(
  data: ProposalData,
  modelsList: CabinModel[] = CABIN_MODELS
): { items: LineItem[]; freight: number; additionalFreight: number; additionalTravelCost: number; subtotal: number; total: number; discount: number; materialSubtotal: number; laborTotal: number } {
  const model = modelsList.find(m => m.id === data.modelId);
  const area = data.customArea || model?.area || 0;
  const items: LineItem[] = [];

  // 1. Kit Madeiramento
  let kitPrice = 0;
  if (data.kitType === 'custom') {
    const timberRate = getTimberRate(area);
    kitPrice = Math.round(area * timberRate);
  } else {
    if (model) kitPrice = model.kitPrice;
  }
  if (data.kitPriceOverride !== undefined) kitPrice = data.kitPriceOverride;
  items.push({ label: data.kitType === 'custom' ? `Kit Madeiramento (${area}m²)` : 'Kit Madeiramento', value: kitPrice });

  // 2. Foundation (Base Estrutural, Sapatas, Assoalho)
  if (data.foundationType && data.foundationType !== 'none') {
    const isInc = !!data.foundationIncluded;
    
    if (data.foundationType === 'radier') {
      let foundationValue = getRadierFoundation(area);
      if (data.foundationPriceOverride !== undefined) {
        foundationValue = data.foundationPriceOverride;
      }
      items.push({ 
        label: `Base Radier${isInc ? ' (Incluso)' : ''}`, 
        value: isInc ? 0 : foundationValue 
      });
    } else if (data.foundationType === 'wooden_eucalyptus' || data.foundationType === 'wooden_masonry') {
      const isEuc = data.foundationType === 'wooden_eucalyptus';
      
      // 1. Base Estrutural de Madeira
      items.push({ 
        label: `Base Estrutural de Madeira${isInc ? ' (Incluso)' : ''}`, 
        value: isInc ? 0 : (area * 83) 
      });
      
      // 2. Sapatas
      let foundationValue = isEuc ? getEucalyptusFoundation(area) : getMasonryFoundation(area);
      if (data.foundationPriceOverride !== undefined) {
        foundationValue = data.foundationPriceOverride;
      }
      const sapataLabel = isEuc ? 'Sapatas de Eucalipto Tratado' : 'Sapatas de Manilhas em Alvenaria';
      items.push({ 
        label: `${sapataLabel}${isInc ? ' (Incluso)' : ''}`, 
        value: isInc ? 0 : foundationValue 
      });
      
      // 3. Assoalho
      items.push({ 
        label: `Assoalho${isInc ? ' (Incluso)' : ''}`, 
        value: isInc ? 0 : (area * 90) 
      });
    }
  }

  // 3. Portas e Janelas / Ferragens
  const hasFixtures = data.kitType === 'custom' ? data.includeFixtures : ['parceira', 'turnkey'].includes(data.kitType);
  if (hasFixtures) {
    let fpValue = getFixturesPrice(area, data.modelId);
    if (data.fixturesPriceOverride !== undefined) fpValue = data.fixturesPriceOverride;
    
    // Split 80/20
    const portasJanelasValue = Math.round(fpValue * 0.8);
    const ferragensValue = fpValue - portasJanelasValue;
    
    items.push({ 
      label: 'Portas e Janelas', 
      value: portasJanelasValue 
    });
    items.push({ label: 'Ferragens', value: ferragensValue });
  }

  // 4. Telhas / Stain
  const hasTiles = data.kitType === 'custom' ? data.includeTilesStain : ['turnkey'].includes(data.kitType);
  if (hasTiles) {
    let tsValue = getTilesStainPrice(area, data.modelId).total;
    if (data.tilesStainPriceOverride !== undefined) tsValue = data.tilesStainPriceOverride;
    
    // Split 75/25
    const telhasValue = Math.round(tsValue * 0.75);
    const stainValue = tsValue - telhasValue;
    
    items.push({ label: `Telhas (${area}m²)`, value: telhasValue });
    items.push({ label: `Stain (Madeiramento e Forro)`, value: stainValue });
  }

  // 5. Mão de Obra
  let laborValue = 0;
  let hasLabor = data.kitType === 'custom' ? data.includeLabor : ['parceira', 'turnkey'].includes(data.kitType);
  if (hasLabor) {
    laborValue = getLaborCost(area);
    if (data.laborPriceOverride !== undefined) laborValue = data.laborPriceOverride;
    items.push({ label: 'Mão de Obra', value: laborValue });
  }

  // 6. Instalação Elétrica e Hidráulica
  if (data.includeElectrical) {
    let elecValue = getElectricalKit(area);
    if (data.electricalPriceOverride !== undefined) elecValue = data.electricalPriceOverride;
    items.push({ label: 'Instalação Elétrica e Hidráulica Básica', value: elecValue });
  }

  // 7. Pintura Completa
  const effectivePaintType = data.paintType === 'none' && data.kitType === 'turnkey' ? '1cor' : data.paintType;
  if (effectivePaintType && effectivePaintType !== 'none') {
    let paintValue = effectivePaintType === '1cor' ? 2500 : 3500;
    if (data.paintPriceOverride !== undefined) {
      paintValue = data.paintPriceOverride;
    }
    const paintLabel = effectivePaintType === '1cor' 
      ? 'Pintura Completa com Stain (1 Cor)' 
      : 'Pintura Completa com Stain (2 Cores)';
    items.push({ label: paintLabel, value: paintValue });
  }

  // 8. Vidros
  const hasGlass = data.includeGlass || data.kitType === 'turnkey';
  if (hasGlass) {
    let glassValue = getGlassPrice(area, data.modelId);
    if (data.glassPriceOverride !== undefined) {
      glassValue = data.glassPriceOverride;
    }
    items.push({ label: 'Vidros', value: glassValue });
  }

  // 9. Gestão e Coordenação Obra
  if (hasLabor && data.kitType === 'turnkey') {
    const adminValue = Math.round(laborValue * 0.25);
    items.push({ label: 'Gestão e Coordenação Obra', value: adminValue });
  }

  // 10. Projeto
  if (data.kitType === 'custom' && data.includeProject) {
    let projValue = Math.round(area * 25);
    if (data.projectPriceOverride !== undefined) projValue = data.projectPriceOverride;
    items.push({ label: 'Projeto', value: projValue });
  }

  // 11. Masonry Bathroom
  if (data.masonryBathroomCount && data.masonryBathroomCount > 0) {
    let baseValue = 8000 * data.masonryBathroomCount;
    if (data.masonryBathroomCount >= 2) {
      baseValue = baseValue * 0.9;
    }
    let bathroomValue = Math.round(baseValue); 
    if (data.masonryBathroomPriceOverride !== undefined) {
      bathroomValue = data.masonryBathroomPriceOverride;
    }
    const label = data.masonryBathroomCount === 1 ? '1 Banheiro em Alvenaria' : `${data.masonryBathroomCount} Banheiros em Alvenaria`;
    items.push({ label, value: bathroomValue });
  }

  // 12. Extra items
  if (data.extraItems && data.extraItems.length > 0) {
    data.extraItems.forEach(item => {
      if (item.description.trim() && item.value > 0) {
        items.push({ label: item.description, value: item.value });
      }
    });
  }

  // Apply itemOverrides
  if (data.itemOverrides) {
    for (let i = items.length - 1; i >= 0; i--) {
      const label = items[i].label;
      const override = data.itemOverrides[label];
      if (override) {
        if (override.deleted) {
          items[i].deleted = true;
          items[i].value = 0;
        } else if (override.value !== undefined) {
          items[i].value = override.value;
        }
      }
    }
  }

  const subtotal = items.reduce((s, i) => s + i.value, 0);
  const laborItem = items.find(i => i.label === 'Mão de Obra');
  const adminItem = items.find(i => i.label.includes('Gestão e Coordenação'));
  const laborTotal = (laborItem ? laborItem.value : 0) + (adminItem ? adminItem.value : 0);
  const materialSubtotal = subtotal - laborTotal;

  let freight = getFreight(area);
  if (data.freightOverride !== undefined) {
    freight = data.freightOverride;
  }

  let additionalFreight = 0;
  if (data.distanceFromFactory && data.distanceFromFactory > 200) {
    additionalFreight = (data.distanceFromFactory - 200) * 5;
  }

  let additionalTravelCost = 0;
  if (data.kitType === 'turnkey' && data.distanceFromFactory && data.distanceFromFactory > 200) {
    additionalTravelCost = (data.distanceFromFactory - 200) * 7.5;
  }

  let discount = 0;
  if (data.discountType === 'percentage') {
    discount = Math.round(materialSubtotal * (data.discountValue / 100));
  } else if (data.discountType === 'fixed') {
    discount = Math.min(data.discountValue, materialSubtotal);
  }

  const total = subtotal - discount + freight + additionalFreight + additionalTravelCost;

  return { items, freight, additionalFreight, additionalTravelCost, subtotal, total, discount, materialSubtotal, laborTotal };
}

export function getPaymentBases(
  items: LineItem[],
  totalFinal: number
): { creditCardBase: number; pixBase: number } {
  let creditCardBase = 0;
  
  items.forEach(item => {
    const l = item.label.toLowerCase();
    if (
      l.includes('kit madeiramento') || 
      l.includes('base estrutural')
    ) {
      creditCardBase += item.value;
    }
  });

  // O PIX é o restante do totalFinal (que já embute fretes e eventuais descontos aplicados globalmente na proposta).
  // A creditCardBase usa o valor CHEIO do kit (já que ele parcelará no cartão, não recebe o desc a vista na base do cartão).
  let pixBase = totalFinal - creditCardBase;
  if (pixBase < 0) pixBase = 0;

  return { creditCardBase, pixBase };
}
