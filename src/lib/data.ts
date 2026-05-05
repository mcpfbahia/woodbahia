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
    question: "01 — Qual o prazo de fabricação e montagem?",
    answer:
      "A fabricação e separação do seu kit na Wood Bahia leva em média 30 a 45 dias após a assinatura do contrato e pagamento do sinal. Já a montagem do chalé no terreno (feita pelos parceiros credenciados ou sua equipe) leva em média de 30 a 60 dias adicionais, variando conforme o tamanho do modelo escolhido.",
  },
  {
    question: "02 — A madeira Pinus tratada é resistente?",
    answer:
      "Sim. Utilizamos madeira Pinus tratada em autoclave, um processo industrial que protege a madeira contra cupins, fungos e umidade. Esse tratamento aumenta significativamente a durabilidade da estrutura, tornando os chalés de madeira e casas pré-fabricadas resistentes e seguros para uso em regiões de praia, campo ou cidade.",
  },
  {
    question: "03 — Vocês entregam em todo o Brasil?",
    answer:
      "Sim, os kits de chalés de madeira são enviados para todo o Brasil. O frete é terceirizado e, para grande parte dos nossos projetos, a Wood Bahia oferece a modalidade de frete compartilhado subsidiando 50% do custo de transporte até a sua obra.",
  },
  {
    question: "04 — O que preciso ter pronto no terreno?",
    answer:
      "O terreno deve estar limpo e nivelado. A construção da fundação (radier de concreto ou sapatas) é o primeiro passo prático da obra. Esse serviço não vem da fábrica e pode ser negociado diretamente com a equipe de montadores parceiros ou executado por profissionais de sua confiança antes da chegada da madeira.",
  },
  {
    question: "05 — Posso personalizar o projeto?",
    answer:
      "Sim! Como as peças de madeira são fornecidas em tamanhos aproximados para corte no local da obra, a personalização de layout (como alterar a posição de uma parede interna, porta ou janela) é totalmente flexível. Isso é combinado e executado diretamente com os carpinteiros parceiros durante a montagem.",
  },
  {
    question: "06 — Como funciona o pagamento?",
    answer:
      "Trabalhamos com diferentes formas de pagamento: parcelamento em até 6x sem juros, parcelamento em até 18x no cartão com juros ou 5% de desconto para pagamento à vista. O parcelamento do kit é feito em duas etapas: 50% de sinal na assinatura do contrato e o saldo final de 50% pago 24hs antes do embarque do kit (saída da fábrica).",
  },
  {
    question: "07 — A casa vem com instalação elétrica e hidráulica?",
    answer:
      "O kit estrutural de madeira não possui fiações ou tubulações embutidas de fábrica. A passagem de eletrodutos e a instalação de pontos básicos de água e esgoto são executadas no local da obra, geralmente pela própria equipe parceira de montadores durante a construção.",
  },
  {
    question: "08 — Qual a garantia dos produtos?",
    answer:
      "Nossos chalés utilizam madeira Pinus tratada em autoclave, o que permite oferecer garantia estrutural de até 15 anos contra pragas e deterioração da madeira, desde que sejam realizados os cuidados básicos de manutenção.",
  },
  {
    question: "09 — Vocês constroem no modelo \"Chave na Mão\"?",
    answer:
      "Nós atuamos exclusivamente como fabricantes e fornecedores do Kit Madeiramento Premium (produto). Não atuamos como construtora \"chave na mão\". No entanto, conectamos você a uma rede de carpinteiros e montadores credenciados e experientes que realizarão toda a montagem através de um contrato de prestação de serviço totalmente independente, com total transparência.",
  },
  {
    question: "10 — Quem fará a montagem do meu kit?",
    answer:
      "Você tem total liberdade de escolha. Pode contratar um dos nossos carpinteiros especialistas credenciados (garantindo isenção de taxas ocultas) ou utilizar uma equipe de construtores de sua própria confiança. O nosso kit acompanha um manual técnico e projeto arquitetônico para guiar todo o processo.",
  },
];

