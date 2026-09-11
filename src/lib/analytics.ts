// src/lib/analytics.ts

type GtagEvent = {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  [key: string]: any;
};

// Declaração para que o TypeScript reconheça o dataLayer e o gtag
declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Dispara um evento genérico para o Google Analytics/Tag Manager via dataLayer
 */
export const trackEvent = ({ action, category, label, value, ...rest }: GtagEvent) => {
  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push({
      event: action,
      eventCategory: category,
      eventLabel: label,
      eventValue: value,
      ...rest,
    });
  }
};

/**
 * Eventos específicos de negócio
 */

// Ao clicar em simular (inicio do funil)
export const trackBeginSimulation = (modelId: string, modelName: string) => {
  trackEvent({
    action: "begin_simulation",
    category: "Simulator",
    label: modelName,
    model_id: modelId,
  });
};

// Ao concluir a simulação e tentar gerar lead (ir para whatsapp)
export const trackGenerateLead = (source: string, modelName?: string, value?: number) => {
  trackEvent({
    action: "generate_lead",
    category: "Lead",
    label: source, // ex: "simulator_btn", "whatsapp_fab", "header_btn"
    model_name: modelName || "Geral",
    value: value || 0,
  });
};

// Ao visualizar um modelo (abrir modal/página individual)
export const trackViewModel = (modelId: string, modelName: string) => {
  trackEvent({
    action: "view_item",
    category: "Modelos",
    label: modelName,
    model_id: modelId,
  });
};
