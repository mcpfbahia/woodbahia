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
  { id: 'guarajuba', name: 'Chalé Guarajuba', area: 52, kitPrice: 33800, tilesStainPrice: 12210, fixturesPrice: 5200 },
  { id: 'itacimirim', name: 'Chalé Itacimirim', area: 35, kitPrice: 22750, tilesStainPrice: 10250, fixturesPrice: 3500 },
  { id: 'curralinho', name: 'Cabana Camping Curralinho', area: 6.5, kitPrice: 5122, tilesStainPrice: 0, fixturesPrice: 650 },
  { id: 'praia-do-forte', name: 'Chalé Praia do Forte', area: 21, kitPrice: 12675, tilesStainPrice: 6875, fixturesPrice: 2100 },
  { id: 'arembepe-plus', name: 'Chalé Arembepe Plus', area: 20, kitPrice: 13000, tilesStainPrice: 6700, fixturesPrice: 0 },
  { id: 'arembepe', name: 'Cabana Camping Arembepe', area: 10.5, kitPrice: 8334, tilesStainPrice: 0, fixturesPrice: 1050 },
  { id: 'baixios', name: 'Chalé Baixios', area: 32, kitPrice: 20800, tilesStainPrice: 9650, fixturesPrice: 3200 },
  { id: 'casa-caymmi', name: 'Casa Caymmi', area: 60, kitPrice: 35500, tilesStainPrice: 12850, fixturesPrice: 6000 },
  { id: 'chale-vilas-do-atlantico', name: 'Chalé Vilas do Atlântico', area: 35, kitPrice: 21000, tilesStainPrice: 10250, fixturesPrice: 3500 },
];

export function getModelDiscountRate(modelIdOrName?: string, customDiscountRate?: number | string): number {
  if (customDiscountRate !== undefined && customDiscountRate !== null && customDiscountRate !== "") {
    const rate = parseFloat(customDiscountRate.toString());
    if (!isNaN(rate) && rate > 0) {
      return rate > 1 ? rate / 100 : rate;
    }
  }
  if (!modelIdOrName) return 0.05; // Geral: 5%
  const normalized = modelIdOrName.toLowerCase();
  if (normalized.includes('vilas') || normalized.includes('villas') || normalized.includes('atlantico')) {
    return 0.15; // Vilas do Atlântico: 15%
  }
  return 0.05; // Geral: 5%
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
  // Se não tem desconto, permite até 3x sem juros (isInterestFree = true se installments <= 3)
  const isInterestFree = !hasDiscount && installments <= 3;
  
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
  if (area <= 12) return 788;
  if (area <= 80) return 650;
  return 600;
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
export const SLIDING_DOOR_PRICE = 3000;
export const SLIDING_DOOR_DISCOUNT = 0.05;

export function getFixturesPrice(area: number, modelId?: string): { base: number; withSlidingDoor: number } {
  if (modelId === 'arembepe-plus') {
    return { base: 0, withSlidingDoor: 0 };
  }
  const base = area * 100;
  const withSlidingDoor = Math.round((base + SLIDING_DOOR_PRICE) * (1 - SLIDING_DOOR_DISCOUNT) * 100) / 100;
  return { base, withSlidingDoor };
}
/** Vidros — fixo até 32m², acima cobra excedente a R$ 150/m² */
export function getGlassPrice(area: number, modelId?: string): number {
  if (modelId === 'arembepe-plus') return 2500;
  if (area <= 32) return 7000;
  return 7000 + Math.round((area - 32) * 150);
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
  slidingDoor: boolean;
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
  slidingDoor: boolean;
}

export function needsFoundationStep(state: SimulationState): boolean {
  if (state.kitType === 'parceira' || state.kitType === 'turnkey') return true;
  if (state.kitType === 'custom' && state.customOptions.labor) return true;
  return false;
}

export interface LineItem {
  label: string;
  value: number;
}

export function getEffectiveArea(state: SimulationState): number {
  if (state.kitType === 'custom') return state.customArea;
  return state.model?.area ?? 0;
}

export function calculateSummary(state: SimulationState): { items: LineItem[]; freight: number; additionalFreight: number; additionalTravelCost: number; total: number; materialSubtotal: number; laborTotal: number } {
  const items: LineItem[] = [];
  const kit = state.kitType;
  const area = getEffectiveArea(state);

  if (kit === 'custom') {
    // Custom kit — priced per m²
    const timberRate = getTimberRate(area);
    items.push({ label: `Kit Madeiramento (${area}m² × R$ ${timberRate})`, value: Math.round(area * timberRate) });

    const opts = state.customOptions;
    if (opts.fixtures) {
      const fp = getFixturesPrice(area, 'custom');
      if (state.slidingDoor) {
        items.push({ label: `Portas, Janelas e Ferragens + Porta de Correr (c/ 5% desc.)`, value: fp.withSlidingDoor });
      } else {
        items.push({ label: `Portas, Janelas e Ferragens`, value: fp.base });
      }
    }
    if (opts.tilesStain) {
      const ts = getTilesStainPrice(area, 'custom');
      items.push({ label: `Telhas e Stain (${area}m² — R$ ${ts.perM2.toLocaleString('pt-BR')}/m²)`, value: ts.total });
    }
    if (opts.labor) {
      items.push({ label: `Mão de Obra (${area}m² × R$ ${getLaborRate(area).toLocaleString('pt-BR')})`, value: getLaborCost(area) });
    }
    if (opts.electrical) items.push({ label: `Kit Elétrica/Hidráulica`, value: getElectricalKit(area) });
    if (opts.glass) items.push({ label: `Vidros`, value: getGlassPrice(area, 'custom') });
    if (opts.project) items.push({ label: `Projeto Personalizado (${area}m² × R$ 25,00)`, value: Math.round(area * 25) });
  } else {
    // Standard modalities — use model prices
    if (!state.model) return { items: [], freight: 0, additionalFreight: 0, additionalTravelCost: 0, total: 0, materialSubtotal: 0, laborTotal: 0 };
    const model = state.model;

    items.push({ label: 'Kit Madeiramento', value: model.kitPrice });

    if (kit === 'parceira' || kit === 'turnkey') {
      const fp = getFixturesPrice(model.area, model.id);
      if (state.slidingDoor) {
        items.push({ label: `Portas, Janelas e Ferragens + Porta de Correr (c/ 5% desc.)`, value: fp.withSlidingDoor });
      } else {
        items.push({ label: 'Portas, Janelas e Ferragens', value: fp.base });
      }
      
      items.push({ label: `Mão de Obra (${model.area}m² × R$ ${getLaborRate(model.area).toLocaleString('pt-BR')})`, value: getLaborCost(model.area) });
    }

    if (kit === 'turnkey') {
      const ts = getTilesStainPrice(model.area, model.id);
      items.push({ label: `Telhas e Stain (${model.area}m² — R$ ${ts.perM2.toLocaleString('pt-BR')}/m²)`, value: ts.total });
      items.push({ label: 'Vidros', value: getGlassPrice(model.area, model.id) });
      
      const paintCost = model.area <= 25 ? 2000 : model.area <= 55 ? 3000 : 4500;
      items.push({ label: 'Pintura e Tratamento (Stain)', value: paintCost });
      
      // Taxa administrativa de 25% sobre a mão de obra
      items.push({ label: 'Gestão e Coordenação Obra', value: Math.round(getLaborCost(model.area) * 0.25) });
    }

    // Kit add-ons (electrical / glass)
    const addons = state.kitAddons;
    if (addons.electrical) items.push({ label: `Kit Elétrica/Hidráulica`, value: getElectricalKit(model.area) });
    if (addons.glass && kit !== 'turnkey') items.push({ label: `Vidros`, value: getGlassPrice(model.area, model.id) }); // turnkey já inclui vidros
  }

  // Foundation
  if (needsFoundationStep(state) && state.foundationType && state.foundationType !== 'none') {
    const isTurnkey = state.kitType === 'turnkey';
    const isEucalyptus = state.foundationType === 'wooden_eucalyptus' || state.foundationType === 'eucalyptus';
    
    // Regra padrão de inclusão: eucalipto no turnkey vem incluso por padrão.
    // Outros tipos no turnkey dependem de state.foundationIncluded.
    const isInc = isTurnkey && (isEucalyptus ? (state.foundationIncluded !== false) : !!state.foundationIncluded);

    if (state.foundationType === 'radier') {
      items.push({ 
        label: `Base Radier + Banheiro Alvenaria${isInc ? ' (Incluso)' : ''}`, 
        value: isInc ? 0 : getRadierFoundation(area) 
      });
    } else if (state.foundationType === 'wooden_eucalyptus') {
      items.push({ 
        label: `Base Estrutural de Madeira + Assoalho${isInc ? ' (Incluso)' : ''}`, 
        value: isInc ? 0 : (area * 150) 
      });
      items.push({ 
        label: `Fundação Sapatas em Eucalipto${isInc ? ' (Incluso)' : ''}`, 
        value: isInc ? 0 : getEucalyptusFoundation(area) 
      });
    } else if (state.foundationType === 'wooden_masonry') {
      items.push({ 
        label: `Base Estrutural de Madeira + Assoalho${isInc ? ' (Incluso)' : ''}`, 
        value: isInc ? 0 : (area * 150) 
      });
      items.push({ 
        label: `Fundação Sapatas Manilhas de Alvenaria${isInc ? ' (Incluso)' : ''}`, 
        value: isInc ? 0 : getMasonryFoundation(area) 
      });
    }
  }

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

  // 2. Fixtures
  const hasFixtures = data.kitType === 'custom' ? data.includeFixtures : ['parceira', 'turnkey'].includes(data.kitType);
  if (hasFixtures) {
    let fpValue = 0;
    const fp = getFixturesPrice(area, data.modelId);
    if (data.slidingDoor) {
      fpValue = fp.withSlidingDoor;
    } else {
      fpValue = fp.base;
    }
    if (data.fixturesPriceOverride !== undefined) fpValue = data.fixturesPriceOverride;
    items.push({ 
      label: data.slidingDoor ? 'Portas, Janelas e Ferragens + Porta de Correr (c/ 5% desc.)' : 'Portas, Janelas e Ferragens', 
      value: fpValue 
    });
  } else if (data.slidingDoor) {
    let sdPrice = SLIDING_DOOR_PRICE;
    if (data.fixturesPriceOverride !== undefined) sdPrice = data.fixturesPriceOverride;
    items.push({ label: 'Porta de Correr (1.8m eucalipto)', value: sdPrice });
  }

  // 3. Tiles & Stain
  const hasTiles = data.kitType === 'custom' ? data.includeTilesStain : ['turnkey'].includes(data.kitType);
  if (hasTiles) {
    let tsValue = getTilesStainPrice(area, data.modelId).total;
    if (data.tilesStainPriceOverride !== undefined) tsValue = data.tilesStainPriceOverride;
    items.push({ label: `Telhas e Stain (${area}m²)`, value: tsValue });
  }

  // 4. Labor
  const hasLabor = data.kitType === 'custom' ? data.includeLabor : ['parceira', 'turnkey'].includes(data.kitType);
  if (hasLabor) {
    let laborValue = getLaborCost(area);
    if (data.laborPriceOverride !== undefined) laborValue = data.laborPriceOverride;
    items.push({ label: 'Mão de Obra', value: laborValue });

    // Se for turnkey, adiciona a taxa administrativa e de coordenação (25% sobre a mão de obra)
    if (data.kitType === 'turnkey') {
      const adminValue = Math.round(laborValue * 0.25);
      items.push({ label: 'Gestão e Coordenação Obra', value: adminValue });
    }
  }

  // 5. Electrical
  if (data.includeElectrical) {
    let elecValue = getElectricalKit(area);
    if (data.electricalPriceOverride !== undefined) elecValue = data.electricalPriceOverride;
    items.push({ label: 'Instalação Elétrica e Hidráulica Básica', value: elecValue });
  }

  // 6. Glass
  // Vidros inclusos por padrão no turnkey
  const hasGlass = data.includeGlass || data.kitType === 'turnkey';
  if (hasGlass) {
    let glassValue = getGlassPrice(area, data.modelId);
    if (data.glassPriceOverride !== undefined) {
      glassValue = data.glassPriceOverride;
    }
    items.push({ label: 'Vidros', value: glassValue });
  }

  // 7. Project
  if (data.kitType === 'custom' && data.includeProject) {
    let projValue = Math.round(area * 25);
    if (data.projectPriceOverride !== undefined) projValue = data.projectPriceOverride;
    items.push({ label: 'Projeto', value: projValue });
  }

  // 8. Foundation
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
    } else if (data.foundationType === 'wooden_eucalyptus') {
      items.push({ 
        label: `Base Estrutural de Madeira + Assoalho${isInc ? ' (Incluso)' : ''}`, 
        value: isInc ? 0 : (area * 150) 
      });
      let foundationValue = getEucalyptusFoundation(area);
      if (data.foundationPriceOverride !== undefined) {
        foundationValue = data.foundationPriceOverride;
      }
      items.push({ 
        label: `Sapatas de Eucalipto Tratado${isInc ? ' (Incluso)' : ''}`, 
        value: isInc ? 0 : foundationValue 
      });
    } else if (data.foundationType === 'wooden_masonry') {
      items.push({ 
        label: `Base Estrutural de Madeira + Assoalho${isInc ? ' (Incluso)' : ''}`, 
        value: isInc ? 0 : (area * 150) 
      });
      let foundationValue = getMasonryFoundation(area);
      if (data.foundationPriceOverride !== undefined) {
        foundationValue = data.foundationPriceOverride;
      }
      items.push({ 
        label: `Sapatas de Manilhas em Alvenaria${isInc ? ' (Incluso)' : ''}`, 
        value: isInc ? 0 : foundationValue 
      });
    }
  }

  // 9. Masonry Bathroom
  if (data.masonryBathroomCount && data.masonryBathroomCount > 0) {
    let baseValue = 8000 * data.masonryBathroomCount;
    if (data.masonryBathroomCount >= 2) {
      baseValue = baseValue * 0.9; // 10% discount for 2 or more
    }
    let bathroomValue = Math.round(baseValue); 
    if (data.masonryBathroomPriceOverride !== undefined) {
      bathroomValue = data.masonryBathroomPriceOverride;
    }
    const label = data.masonryBathroomCount === 1 ? '1 Banheiro em Alvenaria' : `${data.masonryBathroomCount} Banheiros em Alvenaria`;
    items.push({ label, value: bathroomValue });
  }

  // 10. Pintura Completa
  // Pintura inclusa por padrão no turnkey (1 cor se nenhuma especificada)
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

  // Extra items
  if (data.extraItems && data.extraItems.length > 0) {
    data.extraItems.forEach(item => {
      if (item.description.trim() && item.value > 0) {
        items.push({ label: item.description, value: item.value });
      }
    });
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
