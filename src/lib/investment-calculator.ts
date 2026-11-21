import { CABIN_MODELS, type CabinModel } from './pricing';

export function formatBRL(val: any): string {
  if (val == null || isNaN(Number(val))) return "R$ 0,00";
  return Number(val).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export interface InvestmentSimulationOptions {
  modelId: string;
  customArea?: number;
  foundationType: 'eucalyptus' | 'radier';
  includeBaseFloor?: boolean; // Para modelos que não são Guarajuba na base de eucalipto
  hasDoubleWall?: boolean;    // Apenas casas / escandinavo
  customBathrooms?: number;
  customBedrooms?: number;
}

export interface CostItem {
  id: string;
  name: string;
  category: 'produto' | 'servico';
  value: number;
  detail?: string;
  isOptional?: boolean;
}

export interface InvestmentSimulationResult {
  modelName: string;
  area: number;
  isAFrame: boolean;
  canHaveDoubleWall: boolean;
  foundationType: 'eucalyptus' | 'radier';
  hasDoubleWall: boolean;
  includeBaseFloor: boolean;
  
  produtos: CostItem[];
  subtotalProdutos: number;
  
  servicos: CostItem[];
  subtotalServicos: number;
  
  subtotalGeral: number;
  contingenciaValor: number;
  totalInvestimento: number;
  
  custoPorM2: number;
  observations: string[];
}

// Verifica se o modelo é casa ou chalé escandinavo com paredes verticais
export function isVerticalWallModel(modelId: string): boolean {
  const verticalIds = ['casa-caymmi', 'casa-jorge-amado', 'chale-escandinavo-trancoso', 'custom-casa'];
  return verticalIds.includes(modelId);
}

// Verifica se é modelo de camping (sem cozinha e banheiro por padrão)
export function isCampingModel(modelId: string, area: number): boolean {
  return modelId === 'curralinho' || modelId === 'arembepe' || (area < 15 && modelId.includes('camping'));
}

export function calculateInvestmentSimulation(options: InvestmentSimulationOptions): InvestmentSimulationResult {
  const {
    modelId,
    customArea,
    foundationType = 'eucalyptus',
    includeBaseFloor = false,
    hasDoubleWall = false,
  } = options;

  const staticModel = CABIN_MODELS.find((m) => m.id === modelId);
  const area = customArea || (staticModel ? staticModel.area : 52);
  const modelName = staticModel ? staticModel.name : `Projeto Sob Medida (${area}m²)`;
  
  const isAFrame = !isVerticalWallModel(modelId);
  const canHaveDoubleWall = !isAFrame;
  const isCamping = isCampingModel(modelId, area);
  const isGuarajuba = modelId === 'guarajuba';

  // 1. Kit Madeiramento (à vista com 10% desc)
  let kitPriceTabela = staticModel ? staticModel.kitPrice : (area <= 12 ? area * 906 : area <= 80 ? area * 748 : area * 690);
  const kitPriceAVista = Math.round(kitPriceTabela * 0.90);

  // 2. Frete Kit Madeiramento da Fábrica
  const kitFreight = staticModel?.freightPrice || (area < 15 ? 1100 : area <= 35 ? 3600 : area <= 55 ? 4500 : 5500);

  // 3. Telhas e Cobertura
  // Guarajuba (52m²) = 5.500
  const telhasPrice = isGuarajuba 
    ? 5500 
    : isCamping 
      ? 1800 
      : Math.round(Math.max(2200, area * 105));

  // 4. Manta Térmica
  // Guarajuba = 350
  const mantaPrice = isGuarajuba ? 350 : isCamping ? 180 : Math.round(Math.max(200, area * 7));

  // 5. Ferragens de montagem
  // Guarajuba = 1.800
  const ferragensPrice = isGuarajuba ? 1800 : isCamping ? 800 : Math.round(Math.max(900, area * 35));

  // 6. Esquadrias, Vidros e Fachada
  // Guarajuba: Fachada vidro 7.500 + janelas/basculantes 1.000
  let fachadaVidro = 0;
  let janelaBasculante = 0;
  if (isCamping) {
    fachadaVidro = 1800;
    janelaBasculante = 400;
  } else if (isGuarajuba) {
    fachadaVidro = 7500;
    janelaBasculante = 1000;
  } else if (isAFrame) {
    fachadaVidro = Math.round(Math.max(3500, area * 140));
    janelaBasculante = 1000;
  } else {
    // Casas com janelas e portas de vidro
    fachadaVidro = Math.round(Math.max(4000, area * 110));
    janelaBasculante = 1500;
  }

  // 7. Base e Fundação
  let pilaresEucalipto = 0;
  let radierConcreto = 0;
  let baseBarroteAssoalho = 0;

  if (foundationType === 'radier') {
    pilaresEucalipto = 0;
    radierConcreto = Math.round(area * 380); // R$ 380/m²
  } else {
    // Base Elevada de Eucalipto
    pilaresEucalipto = isGuarajuba ? 1000 : isCamping ? 500 : Math.round(Math.max(600, area * 20));
    // Guarajuba já tem chassi/assoalho incluso no kit padrão de fábrica
    if (!isGuarajuba && includeBaseFloor) {
      baseBarroteAssoalho = Math.round(area * 150); // R$ 150/m² (barrotes + assoalho)
    }
  }

  // 8. Stain Protetor
  // Guarajuba = 1.600
  const stainPrice = isGuarajuba ? 1600 : isCamping ? 600 : Math.round(Math.max(800, area * 30));

  // 9. Parede Dupla (Madeiramento)
  // R$ 192,00/m² (4 peças/m² * R$ 48)
  let paredeDuplaMaterial = 0;
  let paredeDuplaPecas = 0;
  if (canHaveDoubleWall && hasDoubleWall) {
    paredeDuplaPecas = Math.round(area * 4);
    paredeDuplaMaterial = paredeDuplaPecas * 48; // ex: Caymmi 60m² = 240 peças * 48 = 11.520
  }

  // 10. Cozinha e Banheiro (Produtos)
  const numBanheiros = isCamping ? 0 : 1;
  const numCozinhas = isCamping ? 0 : 1;

  const portasFechadura = isCamping ? 300 : (numBanheiros * 500) + (isAFrame ? 0 : 800);
  const matEletrico = isCamping ? 400 : isGuarajuba ? 1100 : Math.round(Math.max(600, area * 22));
  const matHidraulico = isCamping ? 0 : isGuarajuba ? 500 : Math.round(Math.max(400, area * 10));
  const cozinhaBancada = numCozinhas * 1300;

  // Banheiro completo
  const boxBlindex = numBanheiros * 2000;
  const loucasMetaisBanheiro = numBanheiros * 1100;
  const placaCimenticiaParedes = numBanheiros * 600;
  const placaCimenticiaPiso = numBanheiros * 200;
  const drywallBanheiro = numBanheiros * 300;
  const pisoRevestimentoCeramico = numBanheiros * 1000; // Até 4m²

  // Montar lista de PRODUTOS
  const produtos: CostItem[] = [
    {
      id: 'kit-madeiramento',
      name: `Kit Madeiramento Estrutural (${area}m²)`,
      category: 'produto',
      value: kitPriceAVista,
      detail: `Madeira autoclave com 10% desc. à vista (Tabela: R$ ${kitPriceTabela.toLocaleString('pt-BR')})`,
    },
    {
      id: 'frete-kit',
      name: 'Frete Kit Madeiramento (Fábrica até Lote)',
      category: 'produto',
      value: kitFreight,
      detail: 'Caminhão exclusivo de fábrica',
    },
    {
      id: 'telhas',
      name: 'Telhas de Cobertura',
      category: 'produto',
      value: telhasPrice,
      detail: 'Telhas ecológicas de alta durabilidade',
    },
    {
      id: 'manta-termica',
      name: 'Manta Térmica Subcobertura',
      category: 'produto',
      value: mantaPrice,
      detail: 'Conforto térmico e barreira impermeável',
    },
    {
      id: 'ferragens',
      name: 'Ferragens Estruturais de Fixação',
      category: 'produto',
      value: ferragensPrice,
      detail: 'Parafusos, conectores e barras roscadas',
    },
    {
      id: 'fachada-vidro',
      name: 'Fachada e Elementos de Vidro',
      category: 'produto',
      value: fachadaVidro,
      detail: 'Vidros temperados de segurança',
    },
    {
      id: 'janela-basculante',
      name: 'Janelas e Basculantes',
      category: 'produto',
      value: janelaBasculante,
    },
    {
      id: 'stain',
      name: 'Stain Protetor para Madeira',
      category: 'produto',
      value: stainPrice,
      detail: 'Proteção hidrorrepelente, antifungos e filtro UV',
    },
    {
      id: 'portas-fechaduras',
      name: isCamping ? 'Porta e Fechadura' : 'Portas e Fechaduras',
      category: 'produto',
      value: portasFechadura,
      detail: isCamping ? 'Kit porta principal' : 'Kit portas e fechaduras completas',
    },
    {
      id: 'mat-eletrico',
      name: 'Material Elétrico (Eletrodutos, Cabos, Caixas)',
      category: 'produto',
      value: matEletrico,
    },
  ];

  // Fundação na lista de produtos
  if (foundationType === 'radier') {
    produtos.push({
      id: 'radier-concreto',
      name: `Laje Radier de Concreto Armado (${area}m²)`,
      category: 'produto',
      value: radierConcreto,
      detail: `Estimativa civil: R$ 380/m² (concreto usinado, malha pop, formas e execução)`,
    });
  } else {
    produtos.push({
      id: 'pilares-eucalipto',
      name: 'Pilares de Eucalipto Tratado',
      category: 'produto',
      value: pilaresEucalipto,
      detail: 'Para engaste da base estrutural elevada',
    });
    if (!isGuarajuba && includeBaseFloor) {
      produtos.push({
        id: 'base-assoalho',
        name: `Estrutura da Base (Barrotes) e Assoalho (${area}m²)`,
        category: 'produto',
        value: baseBarroteAssoalho,
        detail: 'R$ 150/m² (barrotes de madeira tratada + assoalho do piso)',
      });
    }
  }

  // Parede Dupla Material
  if (canHaveDoubleWall && hasDoubleWall) {
    produtos.push({
      id: 'parede-dupla-material',
      name: `Madeiramento Parede Dupla (${paredeDuplaPecas} peças de frontal)`,
      category: 'produto',
      value: paredeDuplaMaterial,
      detail: `R$ 48/peça (R$ 192/m²) para fechamento interno completo`,
    });
  }

  // Itens de Cozinha e Banheiro se não for camping
  if (!isCamping) {
    produtos.push(
      {
        id: 'mat-hidraulico',
        name: 'Material Hidráulico (Tubos, Conexões e Registros)',
        category: 'produto',
        value: matHidraulico,
      },
      {
        id: 'bancada-cozinha',
        name: 'Bancada com Pia Inox + Metais Cozinha',
        category: 'produto',
        value: cozinhaBancada,
      },
      {
        id: 'box-blindex',
        name: 'Box Blindex Banheiro',
        category: 'produto',
        value: boxBlindex,
        detail: 'Vidro temperado 8mm com kit perfis',
      },
      {
        id: 'loucas-metais-banheiro',
        name: 'Louças e Metais do Banheiro',
        category: 'produto',
        value: loucasMetaisBanheiro,
        detail: 'Vaso sanitário com caixa acoplada, cuba e torneira',
      },
      {
        id: 'placa-cimenticia-parede',
        name: 'Placa Cimentícia / Drywall Paredes Banheiro',
        category: 'produto',
        value: placaCimenticiaParedes,
      },
      {
        id: 'placa-cimenticia-piso',
        name: 'Placa Cimentícia Base Piso Banheiro',
        category: 'produto',
        value: placaCimenticiaPiso,
      },
      {
        id: 'drywall-banheiro',
        name: 'Drywall Revestimento Áreas Úmidas',
        category: 'produto',
        value: drywallBanheiro,
      },
      {
        id: 'piso-revestimento-ceramico',
        name: 'Piso e Revestimento Cerâmico Banheiro (até 4m²)',
        category: 'produto',
        value: pisoRevestimentoCeramico,
        detail: 'Piso cerâmico e revestimento de paredes do box',
      }
    );
  }

  const subtotalProdutos = produtos.reduce((acc, curr) => acc + curr.value, 0);

  // 11. SERVIÇOS
  // Mão de Obra de Montagem Completa: R$ 500/m² (mínimo de R$ 3.500 para camping pequeno)
  const montagemBase = isGuarajuba 
    ? 26000 
    : Math.round(Math.max(3500, area * 500));

  // Adicional Montagem Parede Dupla: R$ 100/m²
  const montagemParedeDupla = (canHaveDoubleWall && hasDoubleWall) ? Math.round(area * 100) : 0;

  // Instalação Elétrica
  const instalacaoEletrica = isCamping ? 600 : isGuarajuba ? 1200 : area <= 35 ? 1000 : area <= 60 ? 1200 : 1600;

  // Serviço de Pintura: R$ 500 (camping), R$ 1.000 (médio), R$ 1.500 (grande > 55m²)
  const servicoPintura = isCamping ? 500 : area <= 55 ? 1000 : 1500;

  // Frete local / transporte materiais complementares
  const freteLocal = 500;

  const servicos: CostItem[] = [
    {
      id: 'montagem-completa',
      name: `Mão de Obra de Montagem Completa (${area}m²)`,
      category: 'servico',
      value: montagemBase,
      detail: 'Montagem estrutural do madeiramento, esquadrias e hidráulica primária (R$ 500/m²)',
    },
  ];

  if (canHaveDoubleWall && hasDoubleWall) {
    servicos.push({
      id: 'montagem-parede-dupla',
      name: `Mão de Obra Adicional Parede Dupla (${area}m²)`,
      category: 'servico',
      value: montagemParedeDupla,
      detail: 'Instalação da segunda camada interna de frontais e isolamento (+R$ 100/m²)',
    });
  }

  servicos.push(
    {
      id: 'instalacao-eletrica',
      name: 'Instalação Elétrica Completa',
      category: 'servico',
      value: instalacaoEletrica,
      detail: 'Passagem de fiação, tomadas, interruptores e quadro de disjuntores',
    },
    {
      id: 'servico-pintura',
      name: 'Serviço de Pintura com Aplicação de Stain',
      category: 'servico',
      value: servicoPintura,
      detail: 'Aplicação técnica de demãos protetoras em todo o madeiramento',
    },
    {
      id: 'frete-local',
      name: 'Frete Local e Logística de Canteiro',
      category: 'servico',
      value: freteLocal,
      detail: 'Transporte de materiais complementares da cidade até o lote',
    }
  );

  const subtotalServicos = servicos.reduce((acc, curr) => acc + curr.value, 0);

  // SUBTOTAL GERAL BASE
  const subtotalGeral = subtotalProdutos + subtotalServicos;

  // CONTINGÊNCIA DE OBRA E DESPESAS DE CANTEIRO (10%)
  const contingenciaValor = Math.round(subtotalGeral * 0.10);

  // TOTAL APROXIMADO DE INVESTIMENTO
  const totalInvestimento = subtotalGeral + contingenciaValor;
  const custoPorM2 = Math.round(totalInvestimento / area);

  const observations = [
    'Calhas pluviais, paisagismo, móveis soltos e decoração de interiores NÃO compõem este custo.',
    'Os valores de materiais complementares de acabamento referem-se a referências médias de mercado da Bahia.',
    'A fundação em radier é uma estimativa para terreno nivelado; condições topográficas acentuadas podem requerer terraplanagem.',
    'Esta simulação tem caráter orientativo para planejamento financeiro global do investidor.',
  ];

  return {
    modelName,
    area,
    isAFrame,
    canHaveDoubleWall,
    foundationType,
    hasDoubleWall: canHaveDoubleWall && hasDoubleWall,
    includeBaseFloor: !isGuarajuba && includeBaseFloor,
    produtos,
    subtotalProdutos,
    servicos,
    subtotalServicos,
    subtotalGeral,
    contingenciaValor,
    totalInvestimento,
    custoPorM2,
    observations,
  };
}
