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
      "Oferecemos três modalidades principais de contratação: 1) Apenas o Kit Madeiramento: a fábrica fornece o madeiramento estrutural completo e manual, e a montagem/insumos são de responsabilidade do cliente. 2) Kit + Montagem Parceira: inclui madeiramento, portas/janelas e mão de obra de carpintaria credenciada, com isenção de taxas administrativas da Wood Bahia. 3) Wood Bahia Chave na Mão: assumimos responsabilidade total de ponta a ponta, entregando o chalé montado, coberto, pintado no Stain, com esquadrias e vidros temperados instalados.",
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
      "As peças de madeira do kit saem de fábrica sem cortes ou tubulações embutidas. A instalação da fiação elétrica e pontos básicos de hidráulica é executada no canteiro de obras por profissionais especializados. O kit elétrico/hidráulico básico de materiais e a respectiva mão de obra podem ser incluídos como opcional na simulação do seu projeto.",
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
];
