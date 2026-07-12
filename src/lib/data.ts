export const initialModels = [
  {
    id: "cabana-camping-arembepe",
    name: "Cabana Camping Arembepe",
    image: "/images/models/model-1.jpg",
    area: "10,5m²",
    floors: "1 Pavimento",
    bedrooms: 1,
    infoLabel: "10,5m² | 1 quarto",
    description: "Chalé camping A-frame (3,00m x 3,50m). Compacto, ecológico e funcional. Estrutura em madeira pinus tratada, ideal para um casal com um filho.",
    kitPrice: "R$ 8.334,09",
    freight_value: "R$ 1.800,00",
    freight_is_promo: true,
    purposes: ["airbnb", "praia", "campo"],
  },
  {
    id: "casa-jorge-amado",
    name: "Casa Jorge Amado",
    image: "/images/models/model-2.jpg",
    area: "80m²",
    floors: "1 Pavimento",
    bedrooms: 2,
    infoLabel: "80m² | 2 quartos (1 suíte)",
    description: "Casa Mod. Jorge Amado: estrutura ampla com 2 quartos sendo uma suíte, sala e cozinha conjugadas e varanda espaçosa.",
    kitPrice: "R$ 52.000,00",
    freight_value: "R$ 11.500,00",
    freight_is_promo: true,
    purposes: ["moradia", "campo", "praia"],
  },
  {
    id: "chale-baixios",
    name: "Chalé Baixios",
    image: "/images/models/model-3.jpg",
    area: "32m²",
    floors: "1 Pavimento",
    bedrooms: 1,
    infoLabel: "32m² | 1 pavimento",
    description: "Chalé A-frame com 4,00m x 5,00m de base e pé-direito alto. Sala e cozinha integradas, banheiro, quarto térreo e deck frontal de 6m² ampliando o lazer.",
    kitPrice: "R$ 20.800,00",
    freight_value: "R$ 8.500,00",
    freight_is_promo: true,
    purposes: ["airbnb", "campo", "praia"],
  },
  {
    id: "chale-guarajuba",
    name: "Chalé Guarajuba",
    image: "/images/models/model-5.jpg",
    area: "52m²",
    floors: "1 Pavimento",
    bedrooms: 1,
    infoLabel: "52m² | 1 pavimento",
    description: "Chalé A-frame de 52m² com sala e cozinha integradas, banheiro, quarto térreo aos fundos e deck externo. Design marcante, funcional e ideal para até 5 pessoas.",
    kitPrice: "R$ 33.800,00",
    freight_value: "R$ 11.500,00",
    freight_is_promo: true,
    purposes: ["airbnb", "moradia", "campo", "praia"],
  },
  {
    id: "chale-itacimirim",
    name: "Chalé Itacimirim",
    image: "/images/models/model-4.jpg",
    area: "35m²",
    floors: "1 Pavimento",
    bedrooms: 1,
    infoLabel: "35m² | 1 pavimento",
    description: "Chalé compacto de 35m² com sala e cozinha integradas, banheiro e quarto térreo. Solução funcional e de baixo custo estrutural, ideal para investimento em locação por temporada.",
    kitPrice: "R$ 22.750,00",
    freight_value: "R$ 8.000,00",
    freight_is_promo: true,
    purposes: ["airbnb", "praia", "campo"],
  },
  {
    id: "chale-praia-do-forte",
    name: "Chalé Praia do Forte",
    image: "/images/models/model-6.jpg",
    area: "21m²",
    floors: "1 Pavimento",
    bedrooms: 1,
    infoLabel: "21m² | 1 pavimento",
    description: "Chalé Praia do Forte (3,00m x 7,00m). Design inteligente A-frame com foco em amplitude interna. Banheiro generoso de 6m², quarto ao fundo e integração fluida entre os ambientes.",
    kitPrice: "R$ 12.675,00",
    freight_value: "R$ 6.500,00",
    freight_is_promo: true,
    purposes: ["airbnb", "praia"],
  },
];

// ── Overrides que corrigem dados do Firebase (fonte de verdade local) ──────────
// Qualquer chave aqui sobrescreve o campo correspondente vindo do Firestore.
// A busca é feita pelo ID do documento OU por keyword no nome do modelo.
const MODEL_OVERRIDES: Record<string, Partial<{
  kitPrice: string;
  freight_value: string;
  freight_is_promo: boolean;
  infoLabel: string;
  description: string;
}>> = {
  arembepe: {
    kitPrice: "R$ 8.334,09",
    freight_value: "R$ 1.800,00",
    freight_is_promo: true,
  },
  "jorge-amado": {
    kitPrice: "R$ 52.000,00",
    freight_value: "R$ 11.500,00",
    freight_is_promo: true,
  },
  baixios: {
    kitPrice: "R$ 20.800,00",
    freight_value: "R$ 8.500,00",
    freight_is_promo: true,
  },
  guarajuba: {
    kitPrice: "R$ 33.800,00",
    freight_value: "R$ 11.500,00",
    freight_is_promo: true,
  },
  itacimirim: {
    kitPrice: "R$ 22.750,00",
    freight_value: "R$ 8.000,00",
    freight_is_promo: true,
  },
  "praia-do-forte": {
    kitPrice: "R$ 12.675,00",
    freight_value: "R$ 6.500,00",
    freight_is_promo: true,
  },
};

/** Aplica os overrides locais sobre qualquer objeto de modelo (Firebase ou estático). */
export function applyModelOverrides(model: any): any {
  if (!model) return model;
  const modelId: string = (model.id || "").toLowerCase();
  const modelName: string = (model.name || "").toLowerCase();

  const matchedKey = Object.keys(MODEL_OVERRIDES).find(
    (key) => modelId.includes(key) || modelName.includes(key)
  );

  if (!matchedKey) return model;
  return { ...model, ...MODEL_OVERRIDES[matchedKey] };
}

export const initialPortfolio = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=600&h=600&fit=crop",
    title: "Chalé Praia do Forte",
    location: "Litoral Norte, BA",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=600&h=600&fit=crop",
    title: "Casa A-Frame",
    location: "Chapada Diamantina, BA",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=600&h=600&fit=crop",
    title: "Chalé Familiar",
    location: "Morro de São Paulo, BA",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600&h=600&fit=crop",
    title: "Studio Compacto",
    location: "Itacaré, BA",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=600&h=600&fit=crop",
    title: "Chalé Premium",
    location: "Trancoso, BA",
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=600&h=600&fit=crop",
    title: "Casa de Campo",
    location: "Porto Seguro, BA",
  },
];

export const testimonials = [
  {
    id: 1,
    name: "Carine Sacramento",
    role: "Cliente Google",
    model: "Depoimento Real",
    text: "São lindas, confortáveis e o mais importante, são seguras!!!",
    rating: 5,
    image: "/images/testimonials/google-user.png",
  },
  {
    id: 2,
    name: "Mara Cardoso",
    role: "Cliente Google",
    model: "Depoimento Real",
    text: "Maravilha, um sonho! Me sentir segura com a seriedade e comprometimento da equipe que foi muito atenciosa. Já compartilhei essa novidade para meus amigos e familiares.",
    rating: 5,
    image: "/images/testimonials/google-user.png",
  },
  {
    id: 3,
    name: "Sheilla Sobreira",
    role: "Cliente Google",
    model: "Depoimento Real",
    text: "Parabéns a toda a equipe pela seriedade, comprometimento e responsabilidade demonstrados no trabalho realizado. É admirável ver uma empresa que valoriza a qualidade, cumpre com seus compromissos e se dedica a entregar casas pré-fabricadas de madeira com tanto cuidado e profissionalismo.",
    rating: 5,
    image: "/images/testimonials/google-user.png",
  },
  {
    id: 4,
    name: "Itamar Rosado",
    role: "Cliente Google",
    model: "Depoimento Real",
    text: "Muito bom! Ótimo atendimento, material de alta qualidade. Percebi que muita gente está aderindo a essa ideia inovadora para a nossa região. Parabéns!",
    rating: 5,
    image: "/images/testimonials/google-user.png",
  },
  {
    id: 5,
    name: "Alexsandra Lis",
    role: "Cliente Google",
    model: "Depoimento Real",
    text: "Amei as casas muito aconchegante são lindas.",
    rating: 5,
    image: "/images/testimonials/google-user.png",
  },
];

export const steps = [
  {
    number: "01",
    title: "Escolha do Modelo",
    description: "Selecione o chalé ideal entre nossos modelos exclusivos.",
  },
  {
    number: "02",
    title: "Contrato Fechado",
    description: "Formalizamos o acordo com transparência e segurança.",
  },
  {
    number: "03",
    title: "Produção do Kit",
    description: "Fabricação do kit completo em nossa fábrica (~30 dias).",
  },
  {
    number: "04",
    title: "Chegada no Terreno",
    description: "Transporte e entrega de todos os materiais no local da obra.",
  },
  {
    number: "05",
    title: "Montagem da Casa",
    description: "Equipe especializada realiza a montagem completa (~30 dias).",
  },
  {
    number: "06",
    title: "Sonho Realizado",
    description: "Entrega das chaves e início de uma nova história!",
  },
];

export const faqItems = [
  {
    question: "01 — Qual o prazo de fabricação, entrega e montagem?",
    answer:
      "A fabricação e entrega do Kit Madeiramento estrutural levam em média de 15 a 60 dias úteis, a depender da complexidade do projeto. Para os projetos que incluem a montagem (Modalidades Parceira ou Chave na Mão), o prazo de montagem no local da obra segue o padrão de 1 dia útil por m² de área construída (por exemplo, um chalé de 35m² leva aproximadamente 35 dias úteis para ser montado).",
  },
  {
    question: "02 — A madeira Pinus tratada é durável?",
    answer:
      "Sim, é extremamente resistente. Toda a estrutura e acabamentos em Pinus passam por tratamento industrial em autoclave sob pressão, o que imuniza a madeira contra pragas (cupins), fungos e umidade. Graças a esse processo, a Wood Bahia oferece garantia de até 15 anos na madeira contra deterioração biológica, sendo ideal tanto para o litoral quanto para o campo.",
  },
  {
    question: "03 — Vocês realizam a montagem em qualquer estado?",
    answer:
      "Nós enviamos os Kits de Madeiramento para todo o Brasil. Contudo, os serviços que envolvem montagem de obra (Modalidade Kit + Montagem Parceira e Modalidade Chave na Mão) são prestados de forma exclusiva nos estados da Bahia (BA) e Sergipe (SE). Caso você esteja em outro estado, poderá comprar o kit estrutural e realizar a montagem com profissionais locais de sua confiança.",
  },
  {
    question: "04 — Quais são as modalidades de contratação da Wood Bahia?",
    answer:
      "Oferecemos três modalidades principais: 1) Apenas o Kit Madeiramento: a fábrica fornece as peças de madeira tratada em autoclave para a estrutura, manual técnico e suporte em vídeo, sendo todo o restante responsabilidade do cliente. 2) Kit + Montagem Parceira: inclui todo o kit de madeira e indicamos carpinteiros parceiros homologados na sua região para a montagem direta, sem taxas administrativas. 3) Wood Bahia Chave na Mão: assumimos responsabilidade total de ponta a ponta, entregando o chalé montado com cobertura, portas, janelas, vidros temperados de 8mm, pintura Stain protetora e elétrica/hidráulica básica.",
  },
  {
    question: "05 — Como funciona a taxa de gestão na modalidade Chave na Mão?",
    answer:
      "Na modalidade Wood Bahia Chave na Mão, nós assumimos a coordenação civil e técnica total da obra. Para isso, é aplicada uma taxa de Gestão e Coordenação de Obra equivalente a 25% calculados sobre o valor da mão de obra de montagem. Essa taxa cobre todo o suporte operacional, gerenciamento de equipe técnica própria e garantia unificada da construtora.",
  },
  {
    question: "06 — Como funciona a política de descontos e pagamentos?",
    answer:
      "Oferecemos 5% de desconto para pagamento à vista. Importante destacar que esse desconto incide exclusivamente sobre o valor dos materiais (Kit Madeiramento e base estrutural de madeira), não sendo aplicado sobre fretes ou mão de obra de terceiros. Também facilitamos o pagamento aceitando cartões de crédito em até 3x sem juros ou em até 18x com juros.",
  },
  {
    question: "07 — O que preciso preparar no terreno antes da obra?",
    answer:
      "O cliente deve providenciar a limpeza e o nivelamento do terreno. A fundação de concreto (laje radier ou sapatas de sustentação) deve estar pronta para o início da montagem de madeira. Na modalidade Chave na Mão, a Wood Bahia pode coordenar a base do chalé de acordo com a simulação do cliente. Nas demais modalidades, a execução da base civil é contratada à parte pelo cliente.",
  },
  {
    question: "08 — Os chalés vêm com instalações elétricas e hidráulicas?",
    answer:
      "Isso depende da modalidade contratada. No Kit Madeiramento e no Kit + Montagem Parceira, fornecemos as peças de madeira brutas sem instalações; a fiação elétrica, tubulações, louças e metais são comprados e instalados pelo cliente. No Chave na Mão, entregamos a infraestrutura básica (passagem de fiação, eletrodutos, canos e conexões embutidos na estrutura de madeira). Itens decorativos ou de uso final (espelhos de tomadas, lustres, sanitários, torneiras, caixa d'água e biodigestores) não estão inclusos.",
  },
  {
    question: "09 — O que são esquadrias e vidros opcionais nos simuladores?",
    answer:
      "Nas modalidades Apenas Kit e Montagem Parceira, você pode optar por adicionar o kit de portas, janelas e ferragens padrão. A porta de correr em eucalipto de 1.8m é opcional e concede 5% de desconto no total de portas e janelas. Já a modalidade Chave na Mão já traz todos os vidros temperados de 8mm e pintura Stain protetora inclusos no pacote padrão.",
  },
  {
    question: "10 — Posso realizar modificações personalizadas no layout do chalé?",
    answer:
      "Sim! Pelo fato de as peças de madeira serem ajustadas e cortadas sob medida diretamente no local de montagem, você tem total flexibilidade para propor pequenos ajustes de layout (como alterar a posição interna de portas, janelas ou paredes) em comum acordo com a equipe de montagem, ou configurar um 'Kit Personalizado' na simulação.",
  },
  {
    question: "11 — Quais modelos são mais indicados para investimento, aluguel de temporada, residência permanente ou casa de praia?",
    answer:
      "Para Aluguel de Temporada, recomendamos modelos compactos e de alto impacto visual, como os estilos A-Frame ou Loft (ex: chalés de 30m² a 45m²), que oferecem baixo custo de construção, retorno rápido e excelente apelo no Airbnb. Para Residência Permanente, indicamos modelos mais espaçosos com divisões inteligentes (2 a 3 quartos com suíte e conceito aberto). Para Casa de Praia, sugerimos layouts com amplos avarandados ou integrados com decks elevados (palafitas), ideais para manter a casa fresca e protegida da umidade direta do solo.",
  },
  {
    question: "12 — O valor inclui fundação, montagem, cobertura, instalações elétricas e hidráulicas, banheiro, cozinha, pisos, pintura e esquadrias?",
    answer:
      "Depende da modalidade. O Kit Madeiramento inclui apenas a madeira Pinus estrutural tratada em autoclave, manual técnico e suporte em vídeo. A Montagem Parceira inclui a indicação do carpinteiro parceiro (cuja montagem é contratada e paga diretamente). A modalidade Chave na Mão inclui a estrutura montada, cobertura (telhas + manta), portas, janelas, vidros temperados de 8mm, pintura Stain protetora e elétrica e hidráulica básicas. Sapatas de eucalipto estão inclusas, mas fundações em radier e acabamentos finais (pisos, cerâmicas, torneiras, louças, tomadas finais e caixa d'água) são sob proposta e cotação à parte.",
  },
  {
    question: "13 — O frete, a hospedagem da equipe e o descarregamento estão incluídos?",
    answer:
      "Não. Os custos de frete, o descarregamento do kit e as despesas com hospedagem/alimentação da equipe de montagem (nas modalidades com mão de obra) são calculados sob medida para a localidade do seu terreno e cobrados de forma separada.",
  },
  {
    question: "14 — Qual madeira é utilizada e qual tratamento ela recebe?",
    answer:
      "Utilizamos Pinus e Eucalipto de reflorestamento tratados industrialmente em autoclave sob vácuo-pressão com produtos preservativos (CCA). Este tratamento imuniza profundamente as fibras da madeira, tornando-a totalmente resistente a cupins, brocas, umidade e fungos de apodrecimento.",
  },
  {
    question: "15 — Quais ferragens e parafusos são usados em locais sujeitos à maresia?",
    answer:
      "Para garantir a máxima longevidade e solidez do seu chalé, especialmente em áreas de praia com forte incidência de maresia, selecionamos cuidadosamente cada fixador. Para o assoalho e paredes, onde o contato com a umidade e o salitre é mais intenso, utilizamos exclusivamente parafusos em aço inoxidável (Inox), totalmente imunes à oxidação. Para o forro e sarrafos, que ficam em posições internas e não aparentes, aplicamos parafusos galvanizados de alta resistência mecânica. Essa atenção rigorosa aos detalhes protege sua casa contra corrosões prematuras e mantém a estrutura impecável por décadas.",
  },
  {
    question: "16 — Qual é a garantia da estrutura e do tratamento da madeira?",
    answer:
      "A madeira tratada em autoclave possui 15 anos de garantia de fábrica contra deterioração biológica (cupins e apodrecimento). Já a garantia dos serviços de montagem estrutural é fornecida pela construtora na modalidade Chave na Mão, ou acordada diretamente em contrato com o carpinteiro parceiro credenciado na modalidade Montagem Parceira.",
  },
  {
    question: "17 — A empresa fornece projeto, ART ou RRT?",
    answer:
      "Fornecemos todos os projetos arquitetônicos e as modulações estruturais de montagem do chalé de madeira. A emissão de ART ou RRT referente à execução da base civil (fundação) ou ao acompanhamento geral da obra física local deve ser providenciada por um engenheiro ou arquiteto de sua preferência na sua cidade.",
  },
  {
    question: "18 — Qual é o prazo total de fabricação e instalação?",
    answer:
      "A fabricação do kit madeiramento em fábrica leva em média de 15 a 60 dias úteis (dependendo da complexidade do modelo). Já a instalação física da estrutura no terreno é estimada no ritmo médio de 1 dia útil de montagem por metro quadrado de área construída (ex: chalé de 40m² leva aproximadamente 40 dias úteis para ser finalizado).",
  },
  {
    question: "19 — É possível visitar alguma casa já construída no litoral?",
    answer:
      "Sim! Possuímos diversas obras executadas e em andamento em regiões de praia nos estados da Bahia (BA) e Sergipe (SE). Para agendar uma visita e conhecer de perto o nosso padrão de acabamento e madeiramento, entre em contato com nossa equipe de vendas para consultar datas e locais autorizados pelos proprietários.",
  },
];
