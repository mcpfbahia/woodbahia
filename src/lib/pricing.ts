export interface CabinModel {
  id: string;
  name: string;
  area: number;
  kitPrice: number;
  tilesStainPrice: number;
  fixturesPrice: number;
}

export const CABIN_MODELS: CabinModel[] = [
  { id: 'guarajuba', name: 'Chalé Guarajuba', area: 52, kitPrice: 41100, tilesStainPrice: 18000, fixturesPrice: 7900 },
  { id: 'itacimirim', name: 'Chalé Itacimirim', area: 32, kitPrice: 23890, tilesStainPrice: 13900, fixturesPrice: 7510 },
  { id: 'curralinho', name: 'Cabana Camping Curralinho', area: 6.5, kitPrice: 6700, tilesStainPrice: 0, fixturesPrice: 0 },
  { id: 'praia-do-forte', name: 'Chalé Praia do Forte', area: 19.5, kitPrice: 17700, tilesStainPrice: 12840, fixturesPrice: 4560 },
  { id: 'arembepe', name: 'Cabana Camping Arembepe', area: 10.5, kitPrice: 10815, tilesStainPrice: 0, fixturesPrice: 0 },
  { id: 'baixios', name: 'Chalé Baixios', area: 35, kitPrice: 29500, tilesStainPrice: 14000, fixturesPrice: 7000 },
];

export const CARD_RATES: [number, number][] = [
  [1, 0], [2, 3.99], [3, 4.99], [4, 6.59], [5, 7.09], [6, 7.69],
  [7, 7.89], [8, 8.59], [9, 9.29], [10, 9.99], [11, 11.79],
  [12, 11.99], [13, 13.24], [14, 13.99], [15, 14.74],
  [16, 15.49], [17, 16.24], [18, 16.99],
];

export function calculateInstallmentValue(total: number, installments: number): { total: number; installment: number; isInterestFree: boolean } {
  const rateInfo = CARD_RATES.find(([n]) => n === installments);
  const rate = rateInfo ? rateInfo[1] : 0;
  const isInterestFree = installments <= 3;
  
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
  if (area <= 14) return 940;
  if (area <= 25) return 840;
  if (area <= 55) return 746;
  return 617;
}
/** Telhas e Stain — precificação progressiva em 3 faixas */
export const TILES_BASE = 3000;
export const TILES_RATE_1 = 400;   // até 25m²
export const TILES_RATE_2 = 230;   // 25–40m²
export const TILES_RATE_3 = 80;    // acima de 40m²
export const TILES_TIER_1 = 25;
export const TILES_TIER_2 = 40;

export function getTilesStainPrice(area: number): { total: number; perM2: number } {
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

export function getFixturesPrice(area: number): { base: number; withSlidingDoor: number } {
  // Regra especial para Kits Camping abaixo de 10m² (ex: Curralinho)
  if (area < 10) {
    const base = 1800;
    const withSlidingDoor = Math.round((base + SLIDING_DOOR_PRICE) * (1 - SLIDING_DOOR_DISCOUNT) * 100) / 100;
    return { base, withSlidingDoor };
  }

  let base = FIXTURES_BASE + area * FIXTURES_RATE;
  if (area > FIXTURES_TIER2) {
    base += FIXTURES_TIER2_EXTRA;
  } else if (area > FIXTURES_TIER1) {
    base += FIXTURES_TIER1_EXTRA;
  }
  base = Math.round(base * 100) / 100;
  const withSlidingDoor = Math.round((base + SLIDING_DOOR_PRICE) * (1 - SLIDING_DOOR_DISCOUNT) * 100) / 100;
  return { base, withSlidingDoor };
}
/** Vidros — fixo até 32m², acima cobra excedente a R$ 150/m² */
export function getGlassPrice(area: number): number {
  if (area <= 32) return 8000;
  return 8000 + Math.round((area - 32) * 150);
}

/** Kit Elétrica/Hidráulica — preço por faixa de m² (não é por m²) */
export function getElectricalKit(area: number): number {
  if (area <= 14) return 500;
  if (area <= 25) return 1500;
  if (area <= 35) return 2000;
  if (area <= 55) return 3000;
  return 4000;
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
  if (area <= 10) return 6000;
  if (area <= 16) return 10000;
  if (area <= 25) return 13000;
  if (area <= 35) return 15000;
  if (area <= 55) return 20000;
  return 23000;
}

export function getFreight(area: number): number {
  return area * 90;
}

export type KitType = 'kit1' | 'kit2' | 'kit3' | 'kit4' | 'custom';
export type FoundationType = 'eucalyptus' | 'masonry' | 'radier' | 'none';

export interface CustomOptions {
  fixtures: boolean;
  tilesStain: boolean;
  labor: boolean;
  electrical: boolean;
  glass: boolean;
}

export interface ProposalData {
  clientName: string;
  workLocation: string;
  modelId: string;
  customArea?: number;
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
}

/** Options available as add-ons for standard kits (1-4) */
export interface KitAddons {
  electrical: boolean;
  glass: boolean;
}

export interface SimulationState {
  model: CabinModel | null;
  kitType: KitType | null;
  customOptions: CustomOptions;
  kitAddons: KitAddons;
  foundationType: FoundationType | null;
  customArea: number; // used when kitType === 'custom'
  slidingDoor: boolean;
}

export function needsFoundationStep(state: SimulationState): boolean {
  if (state.kitType === 'kit4') return true;
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

export function calculateSummary(state: SimulationState): { items: LineItem[]; freight: number; total: number } {
  const items: LineItem[] = [];
  const kit = state.kitType;
  const area = getEffectiveArea(state);

  if (kit === 'custom') {
    // Custom kit — priced per m²
    const timberRate = getTimberRate(area);
    items.push({ label: `Kit Madeiramento (${area}m² × R$ ${timberRate})`, value: Math.round(area * timberRate) });

    const opts = state.customOptions;
    if (opts.fixtures) {
      const fp = getFixturesPrice(area);
      if (state.slidingDoor) {
        items.push({ label: `Portas, Janelas e Ferragens + Porta de Correr (c/ 5% desc.)`, value: fp.withSlidingDoor });
      } else {
        items.push({ label: `Portas, Janelas e Ferragens`, value: fp.base });
      }
    }
    if (opts.tilesStain) {
      const ts = getTilesStainPrice(area);
      items.push({ label: `Telhas e Stain (${area}m² — R$ ${ts.perM2.toLocaleString('pt-BR')}/m²)`, value: ts.total });
    }
    if (opts.labor) items.push({ label: `Mão de Obra (${area}m² × R$ ${getLaborRate(area).toLocaleString('pt-BR')})`, value: getLaborCost(area) });
    if (opts.electrical) items.push({ label: `Kit Elétrica/Hidráulica`, value: getElectricalKit(area) });
    if (opts.glass) items.push({ label: `Vidros`, value: getGlassPrice(area) });
  } else {
    // Standard kits (1-4) — use model prices
    if (!state.model) return { items: [], freight: 0, total: 0 };
    const model = state.model;

    items.push({ label: 'Kit Madeiramento', value: model.kitPrice });

    if (kit === 'kit2' || kit === 'kit3' || kit === 'kit4') {
      const fp = getFixturesPrice(model.area);
      if (state.slidingDoor) {
        items.push({ label: `Portas, Janelas e Ferragens + Porta de Correr (c/ 5% desc.)`, value: fp.withSlidingDoor });
      } else {
        items.push({ label: 'Portas, Janelas e Ferragens', value: fp.base });
      }
    } else if (state.slidingDoor) {
      items.push({ label: 'Porta de Correr (1.8m eucalipto)', value: SLIDING_DOOR_PRICE });
    }
    if (kit === 'kit3' || kit === 'kit4') {
      const ts = getTilesStainPrice(model.area);
      items.push({ label: `Telhas e Stain (${model.area}m² — R$ ${ts.perM2.toLocaleString('pt-BR')}/m²)`, value: ts.total });
    }
    if (kit === 'kit4') {
      items.push({ label: `Mão de Obra (${model.area}m² × R$ ${getLaborRate(model.area).toLocaleString('pt-BR')})`, value: getLaborCost(model.area) });
    }

    // Kit add-ons (electrical / glass) available for all standard kits
    const addons = state.kitAddons;
    if (addons.electrical) items.push({ label: `Kit Elétrica/Hidráulica`, value: getElectricalKit(model.area) });
    if (addons.glass) items.push({ label: `Vidros`, value: getGlassPrice(model.area) });
  }

  // Foundation
  if (needsFoundationStep(state) && state.foundationType && state.foundationType !== 'none') {
    let foundationValue = 0;
    let foundationLabel = '';
    switch (state.foundationType) {
      case 'eucalyptus':
        foundationValue = getEucalyptusFoundation(area);
        foundationLabel = 'Base Sapatas em Eucalipto';
        break;
      case 'masonry':
        foundationValue = getMasonryFoundation(area);
        foundationLabel = 'Base Sapatas Manilhas de Alvenaria';
        break;
      case 'radier':
        foundationValue = getRadierFoundation(area);
        foundationLabel = 'Base Radier + Banheiro Alvenaria';
        break;
    }
    if (foundationValue > 0) items.push({ label: foundationLabel, value: foundationValue });
  }

  const subtotal = items.reduce((sum, i) => sum + i.value, 0);
  const freight = getFreight(area);
  const total = subtotal + freight;

  return { items, freight, total };
}

export function calculateProposalItems(data: ProposalData): { items: LineItem[]; freight: number; subtotal: number; total: number; discount: number } {
  const model = CABIN_MODELS.find(m => m.id === data.modelId);
  const area = data.customArea || model?.area || 0;
  const items: LineItem[] = [];

  if (data.kitType === 'custom') {
    const timberRate = getTimberRate(area);
    items.push({ label: `Kit Madeiramento (${area}m² × R$ ${timberRate})`, value: Math.round(area * timberRate) });
  } else {
    if (model) items.push({ label: 'Kit Madeiramento', value: model.kitPrice });
  }

  // Fixtures: standard kits 2-4 always include; custom only if selected
  const hasFixtures = data.kitType === 'custom' ? data.includeFixtures : ['kit2', 'kit3', 'kit4'].includes(data.kitType);
  if (hasFixtures) {
    const fp = getFixturesPrice(area);
    if (data.slidingDoor) {
      items.push({ label: 'Portas, Janelas e Ferragens + Porta de Correr (c/ 5% desc.)', value: fp.withSlidingDoor });
    } else {
      items.push({ label: 'Portas, Janelas e Ferragens', value: fp.base });
    }
  } else if (data.slidingDoor) {
    items.push({ label: 'Porta de Correr (1.8m eucalipto)', value: SLIDING_DOOR_PRICE });
  }

  // Tiles & Stain: standard kits 3-4 always include; custom only if selected
  const hasTiles = data.kitType === 'custom' ? data.includeTilesStain : ['kit3', 'kit4'].includes(data.kitType);
  if (hasTiles) {
    const ts = getTilesStainPrice(area);
    items.push({ label: `Telhas e Stain (${area}m²)`, value: ts.total });
  }

  // Labor: kit4 always includes; custom only if selected
  const hasLabor = data.kitType === 'custom' ? data.includeLabor : data.kitType === 'kit4';
  if (hasLabor) {
    items.push({ label: `Mão de Obra (${area}m² × R$ ${getLaborRate(area).toLocaleString('pt-BR')})`, value: getLaborCost(area) });
  }

  if (data.includeElectrical) {
    items.push({ label: 'Instalação Elétrica e Hidráulica Básica (cliente fornece material)', value: getElectricalKit(area) });
  }
  if (data.includeGlass) {
    items.push({ label: 'Vidros', value: getGlassPrice(area) });
  }
  if (data.kitType === 'custom' && data.includeProject) {
    items.push({ label: `Projeto (${area}m² × R$ 15)`, value: Math.round(area * 15) });
  }

  const subtotal = items.reduce((s, i) => s + i.value, 0);
  const freight = getFreight(area);

  let discount = 0;
  if (data.discountType === 'percentage') {
    discount = Math.round(subtotal * (data.discountValue / 100));
  } else if (data.discountType === 'fixed') {
    discount = Math.min(data.discountValue, subtotal);
  }

  const total = subtotal - discount + freight;

  return { items, freight, subtotal, total, discount };
}
