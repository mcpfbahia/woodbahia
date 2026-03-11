// Dados estáticos de planta baixa — fallback quando o Firebase não tem os dados
export const modelFloorPlans: Record<string, {
    floorPlanImage: string;
    rooms: { name: string; size: string }[];
    totalArea: string;
    builtArea: string;
    label?: string;
}> = {
    'chale-praia-do-forte': {
        floorPlanImage: '/placeholder.svg',
        rooms: [
            { name: 'Quarto', size: '12m²' },
            { name: 'Sala Integrada', size: '15m²' },
            { name: 'Cozinha Americana', size: '6m²' },
            { name: 'Banheiro', size: '4m²' },
            { name: 'Varanda', size: '8m²' },
        ],
        totalArea: '35m²',
        builtArea: '35m²',
    },
    'chale-morro-de-sao-paulo': {
        floorPlanImage: '/placeholder.svg',
        rooms: [
            { name: 'Quarto 1', size: '14m²' },
            { name: 'Quarto 2', size: '12m²' },
            { name: 'Sala', size: '20m²' },
            { name: 'Cozinha', size: '10m²' },
            { name: 'Banheiro', size: '5m²' },
            { name: 'Mezanino', size: '15m²' },
            { name: 'Varanda', size: '10m²' },
        ],
        totalArea: '70m²',
        builtArea: '70m²',
    },
    'chale-trancoso': {
        floorPlanImage: '/placeholder.svg',
        rooms: [
            { name: 'Suíte Master', size: '18m²' },
            { name: 'Quarto 2', size: '12m²' },
            { name: 'Quarto 3', size: '10m²' },
            { name: 'Sala de Estar', size: '20m²' },
            { name: 'Sala de Jantar', size: '12m²' },
            { name: 'Cozinha Gourmet', size: '14m²' },
            { name: 'Banheiro 1', size: '5m²' },
            { name: 'Banheiro 2', size: '4m²' },
            { name: 'Varanda', size: '15m²' },
        ],
        totalArea: '90m²',
        builtArea: '90m²',
    },
    'chale-praia-do-forte-2': {
        floorPlanImage: '/placeholder.svg',
        rooms: [
            { name: 'Quarto 1', size: '14m²' },
            { name: 'Quarto 2', size: '12m²' },
            { name: 'Sala Panorâmica', size: '25m²' },
            { name: 'Cozinha Integrada', size: '12m²' },
            { name: 'Banheiro', size: '5m²' },
            { name: 'Mezanino Lounge', size: '18m²' },
            { name: 'Deck Externo', size: '14m²' },
        ],
        totalArea: '80m²',
        builtArea: '80m²',
    },
    'chale-arraial-dajuda': {
        floorPlanImage: '/placeholder.svg',
        rooms: [
            { name: 'Studio/Quarto', size: '12m²' },
            { name: 'Banheiro Compacto', size: '3m²' },
            { name: 'Kitchenette', size: '5m²' },
            { name: 'Varanda', size: '5m²' },
        ],
        totalArea: '25m²',
        builtArea: '25m²',
    },
    'chale-porto-seguro': {
        floorPlanImage: '/placeholder.svg',
        rooms: [
            { name: 'Suíte Master', size: '22m²' },
            { name: 'Suíte 2', size: '18m²' },
            { name: 'Quarto 3', size: '14m²' },
            { name: 'Quarto 4', size: '12m²' },
            { name: 'Sala de Estar', size: '30m²' },
            { name: 'Sala de Jantar', size: '16m²' },
            { name: 'Área Gourmet', size: '20m²' },
            { name: 'Banheiros (3)', size: '15m²' },
            { name: 'Varanda 360°', size: '25m²' },
        ],
        totalArea: '150m²',
        builtArea: '150m²',
    },
    'chale-praia-do-espelho': {
        floorPlanImage: '/placeholder.svg',
        rooms: [
            { name: 'Quarto 1', size: '14m²' },
            { name: 'Quarto 2', size: '12m²' },
            { name: 'Sala Integrada', size: '18m²' },
            { name: 'Cozinha Americana', size: '10m²' },
            { name: 'Banheiro', size: '5m²' },
            { name: 'Varanda Ampla', size: '12m²' },
        ],
        totalArea: '60m²',
        builtArea: '60m²',
    },
    'chale-boipeba': {
        floorPlanImage: '/placeholder.svg',
        rooms: [
            { name: 'Suíte Master', size: '18m²' },
            { name: 'Quarto 2', size: '14m²' },
            { name: 'Quarto 3', size: '12m²' },
            { name: 'Sala Ampla', size: '25m²' },
            { name: 'Cozinha Gourmet', size: '14m²' },
            { name: 'Banheiro 1', size: '5m²' },
            { name: 'Banheiro 2', size: '4m²' },
            { name: 'Sacada Panorâmica', size: '12m²' },
        ],
        totalArea: '100m²',
        builtArea: '100m²',
    },
    'chale-itacimirim': {
        floorPlanImage: '/planta-terrea-itacimirim.jpg',
        rooms: [
            { name: 'Suíte Master', size: '15.50m²' },
            { name: 'Quarto', size: '10.50m²' },
            { name: 'Cozinha', size: '6.70m²' },
            { name: 'WC Social', size: '3.60m²' },
            { name: 'Varanda G.', size: '20.65m²' },
            { name: 'Circulação', size: '2.55m²' },
            { name: 'Estar/Jantar', size: '25.50m²' },
        ],
        totalArea: '90m²',
        builtArea: '85m²',
        label: 'Planta Térrea',
    },
    'chale-guarajuba': {
        floorPlanImage: '/placeholder.svg',
        rooms: [
            { name: 'Quarto 1', size: '12m²' },
            { name: 'Quarto 2', size: '10m²' },
            { name: 'Sala/Cozinha', size: '18m²' },
            { name: 'Banheiro', size: '4m²' },
            { name: 'Varanda', size: '6m²' },
        ],
        totalArea: '50m²',
        builtArea: '50m²',
    },
};
