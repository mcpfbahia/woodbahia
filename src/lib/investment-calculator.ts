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
  customType?: 'casa' | 'chale';
  isDuplex?: boolean;         // Adicional Duplex (+R$ 120/m²)
  customBedrooms?: number;
  customSuites?: number;
  hasSocialBathroom?: boolean;
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
  isDuplex?: boolean;
  bedroomsCount?: number;
  bathroomsCount?: number;
  
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
    customType = 'casa',
    isDuplex = false,
    customBedrooms = 2,
    customSuites = 1,
    hasSocialBathroom = true,
  } = options;

  const isCustom = modelId === 'custom' || modelId.startsWith('custom');
  const staticModel = !isCustom ? CABIN_MODELS.find((m) => m.id === modelId) : null;
  const area = customArea || (staticModel ? staticModel.area : 65);
  
  // Tipologia construtiva
  let isAFrame = false;
  let canHaveDoubleWall = false;
  let modelName = '';

  if (isCustom) {
    isAFrame = customType === 'chale';
    canHaveDoubleWall = !isAFrame; // Se for Casa, pode ter parede dupla
    const styleLabel = customType === 'casa' ? (isDuplex ? 'Casa Duplex' : 'Casa Térrea') : (isDuplex ? 'Chalé Duplex' : 'Chalé');
    modelName = `Projeto Sob Medida: ${styleLabel} (${area}m²)`;
  } else {
    isAFrame = !isVerticalWallModel(modelId);
    canHaveDoubleWall = !isAFrame;
    modelName = staticModel ? staticModel.name : `Chalé (${area}m²)`;
  }

  const isCamping = !isCustom && isCampingModel(modelId, area);
  const isGuarajuba = modelId === 'guarajuba';

  // 1. Kit Madeiramento (à vista com 10% desc)
  let kitPriceTabela = staticModel 
    ? staticModel.kitPrice 
    : (area <= 12 ? area * 906 : area <= 80 ? area * 748 : area * 690);
  const kitPriceAVista = Math.round(kitPriceTabela * 0.90);

  // 2. Frete Kit Madeiramento da Fábrica
  const kitFreight = staticModel?.freightPrice || (area < 15 ? 1100 : area <= 35 ? 3600 : area <= 55 ? 4500 : 5500);

  // 3. Telhas e Cobertura
  const telhasPrice = isGuarajuba 
    ? 5500 
    : isCamping 
      ? 1800 
      : Math.round(Math.max(2200, area * 105));

  // 4. Manta Térmica
  const mantaPrice = isGuarajuba ? 350 : isCamping ? 180 : Math.round(Math.max(200, area * 7));

  // 5. Ferragens de montagem
  const ferragensPrice = isGuarajuba ? 1800 : isCamping ? 800 : Math.round(Math.max(900, area * 35));

  // 6. Esquadrias, Vidros e Fachada
  // Em chalés A-Frame, a fachada frontal é um frontão triangular inteiro em vidro temperado (corte em ângulo, pé-direito duplo e porta blindex).
  // Chalés 32m²-35m² (Itacimirim/Baixios) = R$ 7.500. Guarajuba 52m² = R$ 8.500.
  // Em casas, as paredes são de madeira e os vidros são esquadrias retangulares convencionais (em torno de R$ 4.500 a R$ 5.200).
  let fachadaVidro = 0;
  let janelaBasculante = 0;
  if (isCamping) {
    fachadaVidro = 3500;
    janelaBasculante = 400;
  } else if (isGuarajuba) {
    fachadaVidro = 8500;
    janelaBasculante = 1000;
  } else if (isAFrame) {
    // Chalés A-Frame: R$ 7.500 até 35m², R$ 8.500 em 52m², escalando acima de 52m²
    if (area <= 35) {
      fachadaVidro = 7500;
    } else if (area <= 52) {
      fachadaVidro = 8500;
    } else {
      fachadaVidro = Math.round(8500 + (area - 52) * 120);
    }
    janelaBasculante = 1000;
  } else {
    // Casas com paredes verticais: portas de correr e janelas retangulares prontas
    fachadaVidro = Math.round(Math.min(5500, Math.max(4200, 3800 + (area * 20))));
    janelaBasculante = 1200;
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
    if (!isGuarajuba && includeBaseFloor) {
      baseBarroteAssoalho = Math.round(area * 150); // R$ 150/m² (barrotes + assoalho)
    }
  }

  // 8. Stain Protetor
  const stainPrice = isGuarajuba ? 1600 : isCamping ? 600 : Math.round(Math.max(800, area * 30));

  // 9. Adicional Duplex (+R$ 120/m²)
  const adicionalDuplex = (isCustom && isDuplex) ? Math.round(area * 120) : 0;

  // 10. Parede Dupla (Madeiramento)
  // R$ 192,00/m² (4 peças/m² * R$ 48)
  let paredeDuplaMaterial = 0;
  let paredeDuplaPecas = 0;
  if (canHaveDoubleWall && hasDoubleWall) {
    paredeDuplaPecas = Math.round(area * 4);
    paredeDuplaMaterial = paredeDuplaPecas * 48; // ex: Caymmi 60m² = 240 peças * 48 = 11.520
  }

  // 11. Quantitativos de Cômodos (Banheiros e Quartos)
  let numBanheiros = 1;
  let numQuartos = 1;

  if (isCamping) {
    numBanheiros = 0;
    numQuartos = 1;
  } else if (isCustom) {
    numBanheiros = Math.max(1, (customSuites || 0) + (hasSocialBathroom ? 1 : 0));
    numQuartos = Math.max(1, customBedrooms || 2);
  }

  const numCozinhas = isCamping ? 0 : 1;

  // Portas internas e fechaduras: 1 por banheiro + 1 por quarto
  const portasFechadura = isCamping 
    ? 300 
    : (numBanheiros * 500) + (isAFrame ? 0 : (numQuartos * 500));

  const matEletrico = isCamping ? 400 : isGuarajuba ? 1100 : Math.round(Math.max(600, area * 22));
  const matHidraulico = isCamping ? 0 : isGuarajuba ? 500 : Math.round(Math.max(400, (area * 8) + (numBanheiros * 200)));
  const cozinhaBancada = numCozinhas * 1300;

  // Itens do banheiro (multiplicados por cada banheiro real)
  const boxBlindex = numBanheiros * 2000;
  const loucasMetaisBanheiro = numBanheiros * 1100;
  const placaCimenticiaParedes = numBanheiros * 600;
  const placaCimenticiaPiso = numBanheiros * 200;
  const drywallBanheiro = numBanheiros * 300;
  const pisoRevestimentoCeramico = numBanheiros * 1000; // Até 4m² por banheiro

  // Montar lista de PRODUTOS
  const produtos: CostItem[] = [
    {
      id: 'kit-madeiramento',
      name: `Kit Madeiramento Estrutural (${area}m²)`,
      category: 'produto',
      value: kitPriceAVista,
      detail: `Pinus tratado em autoclave com 10% desc. à vista (Tabela: R$ ${kitPriceTabela.toLocaleString('pt-BR')})`,
    },
    {
      id: 'frete-kit',
      name: 'Frete Kit Madeiramento (Fábrica até Lote)',
      category: 'produto',
      value: kitFreight,
      detail: 'Transporte dedicado de fábrica',
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
      name: isCamping ? 'Porta e Fechadura' : `Portas e Fechaduras (${numQuartos + numBanheiros} kits)`,
      category: 'produto',
      value: portasFechadura,
      detail: isCamping ? 'Kit porta principal' : 'Portas internas para quartos e banheiros com fechaduras',
    },
    {
      id: 'mat-eletrico',
      name: 'Material Elétrico (Eletrodutos, Cabos, Caixas)',
      category: 'produto',
      value: matEletrico,
    },
  ];

  // Se for Duplex, adiciona kit estrutural do 2º pavimento
  if (isCustom && isDuplex) {
    produtos.push({
      id: 'adicional-duplex',
      name: `Estrutura Duplex / Mezanino (${area}m²)`,
      category: 'produto',
      value: adicionalDuplex,
      detail: 'Escada em madeira maciça, barrotes reforçados, assoalho do pavimento superior e guarda-corpo (+R$ 120/m²)',
    });
  }

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
  if (!isCamping && numBanheiros > 0) {
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
        name: `Box Blindex Banheiro (${numBanheiros} ${numBanheiros > 1 ? 'unidades' : 'unidade'})`,
        category: 'produto',
        value: boxBlindex,
        detail: 'Vidro temperado 8mm com kit perfis de alumínio',
      },
      {
        id: 'loucas-metais-banheiro',
        name: `Louças e Metais Banheiro (${numBanheiros} ${numBanheiros > 1 ? 'banheiros' : 'banheiro'})`,
        category: 'produto',
        value: loucasMetaisBanheiro,
        detail: 'Vaso com caixa acoplada, cuba e torneira de bancada',
      },
      {
        id: 'placa-cimenticia-parede',
        name: `Placa Cimentícia / Drywall Banheiro (${numBanheiros} ${numBanheiros > 1 ? 'banheiros' : 'banheiro'})`,
        category: 'produto',
        value: placaCimenticiaParedes,
      },
      {
        id: 'placa-cimenticia-piso',
        name: `Placa Cimentícia Base Piso (${numBanheiros} ${numBanheiros > 1 ? 'banheiros' : 'banheiro'})`,
        category: 'produto',
        value: placaCimenticiaPiso,
      },
      {
        id: 'drywall-banheiro',
        name: `Drywall Áreas Úmidas (${numBanheiros} ${numBanheiros > 1 ? 'banheiros' : 'banheiro'})`,
        category: 'produto',
        value: drywallBanheiro,
      },
      {
        id: 'piso-revestimento-ceramico',
        name: `Piso e Revestimento Cerâmico (${numBanheiros} ${numBanheiros > 1 ? 'banheiros' : 'banheiro'} de até 4m²)`,
        category: 'produto',
        value: pisoRevestimentoCeramico,
        detail: 'Piso cerâmico e revestimento de paredes do box',
      }
    );
  }

  const subtotalProdutos = produtos.reduce((acc, curr) => acc + curr.value, 0);

  // 12. SERVIÇOS
  // Mão de Obra de Montagem Completa: R$ 500/m²
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
    'A opção comercial "Wood Bahia Chave na Mão" é um contrato específico com garantia técnica unificada.',
    'Esta planilha contempla a simulação integral de canteiro, essencial para quem opta por Kit Madeiramento ou Montagem Parceira planejar os custos de acabamento sem surpresas.',
    'Calhas pluviais, paisagismo, móveis soltos e decoração de interiores NÃO compõem este custo.',
    'A fundação em radier é uma estimativa para terreno nivelado; condições com desnível acentuado podem demandar terraplanagem prévia.',
  ];

  return {
    modelName,
    area,
    isAFrame,
    canHaveDoubleWall,
    foundationType,
    hasDoubleWall: canHaveDoubleWall && hasDoubleWall,
    includeBaseFloor: !isGuarajuba && includeBaseFloor,
    isDuplex,
    bedroomsCount: numQuartos,
    bathroomsCount: numBanheiros,
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
