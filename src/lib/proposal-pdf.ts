import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import cabecalhoNovoImg from '../../public/assets/cabecalho-novo.jpg';
import {
  calculateProposalItems,
  CABIN_MODELS,
  CARD_RATES,
  calculateInstallmentValue,
  getModelDiscountRate,
  getPaymentBases,
  type ProposalData,
  type KitType,
  type CabinModel,
} from './pricing';

// Colors from the design system (HSL converted to RGB)
const COLORS = {
  primary: [66, 99, 78] as [number, number, number],
  accent: [143, 76, 48] as [number, number, number],
  background: [247, 242, 236] as [number, number, number],
  foreground: [56, 46, 38] as [number, number, number],
  muted: [130, 120, 110] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  lightBg: [240, 232, 222] as [number, number, number],
  green: [46, 125, 50] as [number, number, number],
};

const KIT_NAMES: Record<string, string> = {
  madeiramento: 'Modalidade 1 — Apenas o Kit Madeiramento',
  parceira: 'Modalidade 2 — Kit + Montagem Parceira',
  turnkey: 'Modalidade 3 — Wood Bahia Chave na Mão',
  custom: 'Kit Personalizado',
};

const KIT_DESCRIPTIONS: Record<string, string> = {
  madeiramento: 'Madeiramento estrutural completo em Pinus tratado em autoclave (pilares, vigas, paredes, forro, estrutura de telhado). A montagem e demais materiais são de responsabilidade do cliente.',
  parceira: 'Madeiramento + esquadrias (portas/janelas/ferragens) + mão de obra de carpintaria credenciada, com isenção de taxas administrativas da Wood Bahia. A cobertura, vidros e elétrica são contratados à parte.',
  turnkey: 'Estrutura de madeira montada e acabada com responsabilidade única da Wood Bahia. Inclui madeiramento, esquadrias, cobertura completa (telhas ecológicas e manta térmica), vidros fachada, pintura em Stain (protetor), mão de obra própria e coordenação/gestão técnica total.',
  custom: 'Kit personalizado montado sob medida para o seu projeto.',
};


function fmt(v: number): string {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function getIncludedItems(data: ProposalData): string[] {
  const items: string[] = [
    'Estrutura completa em madeira Pinus autoclavada',
    'Paredes, forros e estrutura do telhado',
    'Ripas, canaletas, rodapés, molduras',
  ];
  
  const hasFixtures = data.kitType === 'custom' ? data.includeFixtures : ['parceira', 'turnkey'].includes(data.kitType);
  if (hasFixtures) {
    items.push('Portas e janelas em madeira');
    items.push('Ferragens completas');
  }
  
  const hasTiles = data.kitType === 'custom' ? data.includeTilesStain : ['turnkey'].includes(data.kitType);
  if (hasTiles) {
    items.push('Cobertura com telhas ecológicas');
    items.push('Manta térmica subcobertura');
  }
  
  const hasLabor = data.kitType === 'custom' ? data.includeLabor : ['parceira', 'turnkey'].includes(data.kitType);
  if (hasLabor) {
    items.push('Mão de obra completa de montagem');
  }

  if (data.includeElectrical) {
    items.push('Instalações elétricas e hidráulicas (Básica)');
  }

  // Vidros inclusos no Turnkey ou se selecionado
  const hasGlass = data.includeGlass || data.kitType === 'turnkey';
  if (hasGlass) {
    items.push('Vidros fachada');
  }

  if (data.kitType === 'custom' && data.includeProject) {
    items.push('Projeto Arquitetônico Personalizado');
  }

  if (data.kitType === 'turnkey') {
    items.push('Coordenação e Gestão Técnica Wood Bahia');
    items.push('Paredes e piso drywall e placa cimentícia');
  }

  if (data.foundationType && data.foundationType !== 'none') {
    const fLabel = data.foundationType === 'wooden_eucalyptus' ? 'Base Estrutural de Madeira + Sapatas de Eucalipto'
                 : data.foundationType === 'wooden_masonry' ? 'Base Estrutural de Madeira + Sapatas de Manilha'
                 : data.foundationType === 'eucalyptus' ? 'Sapatas de Eucalipto Tratado'
                 : data.foundationType === 'masonry' ? 'Sapatas de Manilhas em Alvenaria'
                 : 'Base Radier + Banheiro Alvenaria';
    items.push(fLabel);
  }

  if (data.masonryBathroomCount && data.masonryBathroomCount > 0) {
    items.push(data.masonryBathroomCount === 1 ? '1 Banheiro em Alvenaria' : `${data.masonryBathroomCount} Banheiros em Alvenaria`);
  }

  const effectivePaintType = data.paintType === 'none' && data.kitType === 'turnkey' ? '1cor' : data.paintType;
  if (effectivePaintType && effectivePaintType !== 'none') {
    items.push(effectivePaintType === '1cor' ? 'Pintura Completa com Stain (1 Cor)' : 'Pintura Completa com Stain (2 Cores)');
  }

  return items;
}

export function getNotIncludedItems(data: ProposalData): string[] {
  const items: string[] = [];

  const hasLabor = data.kitType === 'custom' ? data.includeLabor : ['parceira', 'turnkey'].includes(data.kitType);
  if (!hasLabor) {
    items.push('Mão de obra de montagem');
  }

  const hasFixtures = data.kitType === 'custom' ? data.includeFixtures : ['parceira', 'turnkey'].includes(data.kitType);
  if (!hasFixtures) {
    items.push('Portas, janelas e ferragens');
  }

  const hasTiles = data.kitType === 'custom' ? data.includeTilesStain : ['turnkey'].includes(data.kitType);
  if (!hasTiles) {
    items.push('Cobertura e telhas ecológicas');
  }

  if (!data.foundationType || data.foundationType === 'none') {
    items.push('Fundação estrutural e base');
  }
  
  if (!data.includeElectrical) {
    items.push('Instalações elétricas e hidráulicas');
  }

  const hasGlass = data.includeGlass || data.kitType === 'turnkey';
  if (!hasGlass) {
    items.push('Vidros e envidraçamento');
  }

  const effectivePaintType = data.paintType === 'none' && data.kitType === 'turnkey' ? '1cor' : data.paintType;
  if (!effectivePaintType || effectivePaintType === 'none') {
    items.push('Pintura externa e Stain protetor');
  }

  if (data.kitType !== 'turnkey') {
    items.push('Coordenação e gestão técnica de obra');
  }

  if (data.kitType === 'madeiramento' || data.kitType === 'parceira') {
    items.push('Paredes e piso drywall e placa cimentícia');
  }

  items.push('Frete (salvo combinado na proposta)');
  items.push('Licenças ou projetos legais');
  return items;
}


/** Draws the fixed footer bar on the current page */
function drawFooter(doc: jsPDF, pageWidth: number) {
  const footerY = 282;
  doc.setFillColor(...COLORS.accent);
  doc.rect(0, footerY, pageWidth, 15, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.white);
  doc.text('Entre em contato e dê o próximo passo para ter seu chalé.', pageWidth / 2, footerY + 5, { align: 'center' });
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text(
    '(71) 99293-6290  •  @woodbahiacasasprefabricadas  •  woodbahia.com  •  CNPJ 57.721.838/0001-91',
    pageWidth / 2, footerY + 10, { align: 'center' }
  );
}

/** Checks if y would overflow and adds a new page if needed */
function checkPageBreak(doc: jsPDF, y: number, needed: number): number {
  if (y + needed > 275) {
    doc.addPage();
    return 20;
  }
  return y;
}

export function generateProposalPDF(
  data: ProposalData,
  modelsList: CabinModel[] = CABIN_MODELS
): void {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = 210;
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  const today = new Date();
  const dateStr = today.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  const model = modelsList.find(m => m.id === data.modelId);
  const area = data.customArea || model?.area || 0;
  const kitName = KIT_NAMES[data.kitType] || data.kitType;
  const kitDesc = data.kitType === 'custom' && data.customModelDescription ? data.customModelDescription : (KIT_DESCRIPTIONS[data.kitType] || '');
  const modelName = model?.name || 'Kit Personalizado';
  const { items, freight, additionalFreight, additionalTravelCost, subtotal, total: totalFinal, discount, materialSubtotal } = calculateProposalItems(data, modelsList);
  const { creditCardBase, pixBase } = getPaymentBases(items, totalFinal);

  const subtotalComDesconto = subtotal - discount;
  const timberItem = items.find(i => i.label.toLowerCase().includes('madeiramento'));
  const woodenBaseItem = items.find(i => i.label.toLowerCase().includes('base de madeira') || i.label.toLowerCase().includes('base estrutural'));
  const discountableBase = (timberItem ? timberItem.value : 0) + (woodenBaseItem ? woodenBaseItem.value : 0);
  const discountRate = getModelDiscountRate(data.modelId, model?.discountRate);
  const discountableBaseNet = Math.max(0, discountableBase - discount);
  const totalAVista = Math.round(totalFinal - (discountableBaseNet * discountRate));

  let y = 0;

  // ─── HEADER IMAGE ───
  // Using the new header provided by the user
  doc.addImage(cabecalhoNovoImg.src, 'JPEG', 0, 0, 210, 35);

  // Title below header, keeping it elegant and aligned
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11); 
  doc.setTextColor(...COLORS.accent);
  doc.text('PROPOSTA COMERCIAL', margin, 45);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.muted);
  doc.text(dateStr, pageWidth - margin - 2, 45, { align: 'right' });

  y = 55;

  // ─── OPENING TEXT ───
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.foreground); // Marrom escuro, baseado nos tokens (56, 46, 38)
  
  // Linha 1: 'Prezado(a)' (normal) + 'Nome' (negrito) + ',' (normal)
  let currentX = margin;
  doc.setFont('helvetica', 'normal');
  doc.text('Prezado(a) ', currentX, y);
  currentX += doc.getTextWidth('Prezado(a) ');

  doc.setFont('helvetica', 'bold');
  doc.text(data.clientName, currentX, y);
  currentX += doc.getTextWidth(data.clientName);

  doc.setFont('helvetica', 'normal');
  doc.text(',', currentX, y);

  y += 6;

  // Linhas do parágrafo principal
  const openingText = `é com grande satisfação que apresentamos esta proposta para a construção do seu chalé em madeira. A Wood Bahia é referência em chalés de madeira Pinus tratada com 15 anos de garantia, combinando qualidade, sustentabilidade e o melhor custo-benefício do mercado.`;
  const openingLines = doc.splitTextToSize(openingText, contentWidth);
  doc.text(openingLines, margin, y);
  y += openingLines.length * 5 + 3;

  // Custo por m2
  doc.setFont('helvetica', 'bold');
  doc.text('Custo por m² (Referência):', margin, y);
  doc.setFont('helvetica', 'normal');
  y += 5;
  doc.text('• A partir de R$ 1.800/m² (Kits Básicos)', margin + 4, y);
  y += 5;
  doc.text('• A partir de R$ 2.500/m² (Projetos Completos)', margin + 4, y);
  
  y += 10;

  // ─── CLIENT DATA BLOCK ───
  const descLinesForHeight = doc.splitTextToSize(kitDesc, contentWidth - 12);
  const blockHeight = 32 + descLinesForHeight.length * 4;
  doc.setFillColor(...COLORS.lightBg);
  doc.roundedRect(margin, y, contentWidth, blockHeight, 3, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...COLORS.accent);
  doc.text('DADOS DO CLIENTE', margin + 6, y + 7);

  doc.setFontSize(9);
  doc.setTextColor(...COLORS.foreground);
  // Nome em negrito
  doc.setFont('helvetica', 'bold');
  doc.text('Cliente: ', margin + 6, y + 14);
  const clientLabelW = doc.getTextWidth('Cliente: ');
  doc.setFont('helvetica', 'normal');
  doc.text(data.clientName, margin + 6 + clientLabelW, y + 14);

  doc.text(`Local da Obra: ${data.workLocation}`, margin + 6, y + 20);

  // Modelo em negrito
  const halfX = margin + contentWidth / 2;
  doc.setFont('helvetica', 'bold');
  doc.text('Modelo: ', halfX, y + 14);
  const modelLabelW = doc.getTextWidth('Modelo: ');
  doc.setFont('helvetica', 'normal');
  doc.text(`${modelName} — ${area}m²`, halfX + modelLabelW, y + 14);

  // Kit sem duplicar "Kit"
  doc.text(kitName, halfX, y + 20);

  // Descrição do kit dentro do bloco
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.muted);
  doc.text(descLinesForHeight, margin + 6, y + 27);

  y += blockHeight + 6;

  // ─── INVESTMENT TABLE ───
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...COLORS.accent);
  doc.text('INVESTIMENTO', margin, y);
  y += 4;

  const tableBody = items.map(item => {
    const isFoundationItem = item.label.toLowerCase().includes('sapata') || 
                             item.label.toLowerCase().includes('base radier') || 
                             item.label.toLowerCase().includes('base estrutural') || 
                             item.label.toLowerCase().includes('fundação') ||
                             item.label.toLowerCase().includes('alicerce');
    const displayValue = (item.value === 0 && isFoundationItem) ? 'Incluso' : fmt(item.value);
    return [item.label, displayValue];
  });
  
  const freightBase = freight * 2;
  tableBody.push(['Frete Base Estimado (' + area + 'm² × R$ 180)', fmt(freightBase)]);
  tableBody.push(['Promoção: Frete Compartilhado (Nós pagamos 50% do seu frete)', '-' + fmt(freight)]);

  if (additionalFreight > 0) {
    tableBody.push(['Frete Adicional (> 200km)', '+' + fmt(additionalFreight)]);
  }

  if (additionalTravelCost > 0) {
    tableBody.push(['Adicional Deslocamento Chave na Mão (> 200km)', '+' + fmt(additionalTravelCost)]);
  }

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [['Descrição', 'Valor']],
    body: tableBody,
    styles: {
      fontSize: 9,
      cellPadding: 3,
      textColor: COLORS.foreground,
      lineColor: [200, 190, 180],
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: COLORS.accent,
      textColor: COLORS.white,
      fontStyle: 'bold',
      fontSize: 9,
    },
    alternateRowStyles: {
      fillColor: [245, 240, 234],
    },
    columnStyles: {
      0: { cellWidth: contentWidth * 0.70 },
      1: { cellWidth: contentWidth * 0.30, halign: 'right', fontStyle: 'bold' },
    },
    didParseCell: (hookData) => {
      // Highlight the freight discount row in green
      if (hookData.section === 'body') {
        const rowData = hookData.row.raw as string[];
        if (rowData[0] && rowData[0].includes('Promoção: Frete Compartilhado')) {
          hookData.cell.styles.textColor = [46, 125, 50]; // Green
          hookData.cell.styles.fontStyle = 'bold';
        }
      }
    }
  });

  y = (doc as any).lastAutoTable.finalY + 6;

  // ─── CHECK PAGE BREAK FOR TOTALS AND BANNERS ───
  // Ensure we have enough space for the Totals box (~36), Prazos banner (~18), and padding
  y = checkPageBreak(doc, y, 70);

  // Totals box
  const totalsHeight = discount > 0 ? 36 : 24;
  doc.setFillColor(...COLORS.accent);
  doc.roundedRect(margin, y, contentWidth, totalsHeight, 3, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.white);

  if (discount > 0) {
    doc.text(`Subtotal Kit: ${fmt(subtotal)}  |  Frete Compartilhado: ${fmt(freight)}`, margin + 6, y + 8);
    
    // Destaque do Desconto Especial
    doc.setTextColor(180, 255, 180); // Verde bem claro para contrastar com o fundo
    doc.setFontSize(11);
    doc.text(`DESCONTO BONUS APLICADO: -${fmt(discount)}`, margin + 6, y + 16);
    
    // Restaura estilo para o total
    doc.setTextColor(...COLORS.white);
    doc.setFontSize(14);
    doc.text(`TOTAL FINAL: ${fmt(totalFinal)}`, margin + 6, y + 28);
  } else {
    doc.setFontSize(14);
    doc.text(`TOTAL DO INVESTIMENTO: ${fmt(totalFinal)}`, margin + 6, y + 14);
  }

  y += totalsHeight + 4;

  // ─── PRAZOS BANNER (right below totals) ───
  const hasLabor = ['parceira', 'turnkey'].includes(data.kitType) || (data.kitType === 'custom' && data.includeLabor);
  {
    const bannerH = hasLabor ? 18 : 12;
    doc.setFillColor(...COLORS.primary);
    doc.roundedRect(margin, y, contentWidth, bannerH, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...COLORS.white);
    doc.text('Prazo de entrega: 15 a 60 dias uteis, conforme complexidade do projeto.', margin + 6, y + 7);
    if (hasLabor) {
      doc.text(`Prazo de montagem: ${area} dias uteis (1 dia por m2).`, margin + 6, y + 13);
    }
    y += bannerH + 2;
  }

  // ─── PROGRESSIVE DISCOUNT NOTE ───
  doc.setFillColor(230, 245, 230);
  doc.roundedRect(margin, y, contentWidth, 10, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.green);
  doc.text('Descontos progressivos para pedidos a partir de 2 unidades. Consulte condicoes especiais!', margin + 6, y + 6.5);
  y += 14;

  // ─── PAYMENT CONDITIONS ───
  // No PIX/Boleto o pagamento também é considerado com 10% de desconto
  const metade = totalAVista * 0.5;

  // Helper: bold label+value, normal description
  const drawPaymentLine = (label: string, value: string, desc: string, lineY: number) => {
    doc.setFont('helvetica', 'bold');
    doc.text(`• ${label} ${value}`, margin + 8, lineY);
    const boldW = doc.getTextWidth(`• ${label} ${value}`);
    doc.setFont('helvetica', 'normal');
    doc.text(` — ${desc}`, margin + 8 + boldW, lineY);
  };

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.accent);
  doc.text('CONDIÇÕES DE PAGAMENTO (PIX / BOLETO)', margin, y);
  y += 6;

  // À vista com desconto no madeiramento e base
  drawPaymentLine(`À Vista (${discountRate * 100}% desc. no madeiramento/base):`, fmt(totalAVista), 'No PIX ou Transferência Bancária', y);
  y += 5;

  // Novo modelo 50/50 (pagamento do material já com desconto)
  drawPaymentLine('Sinal (50%):', fmt(metade), 'Na assinatura do contrato (PIX)', y);
  y += 5;
  drawPaymentLine('Saldo Final (50%):', fmt(metade), '24h antes do embarque do kit (Saída da fábrica)', y);
  y += 8;

  // ─── CREDIT CARD INSTALLMENT TABLE ───
  y = checkPageBreak(doc, y, 100);

  // Big Highlight Banner
  doc.setFillColor(...COLORS.accent);
  doc.roundedRect(margin, y, contentWidth, 12, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.white);
  doc.text('CONDICAO ESPECIAL DE PARCELAMENTO', margin + 6, y + 8);
  
  y += 18;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...COLORS.foreground);
  doc.text('PARCELE O SEU KIT DE MADEIRAMENTO EM ATÉ 18X', margin, y);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.muted);
  doc.text('Condições de parcelamento sujeitas a aprovação de limite de crédito', margin, y + 5);

  if (pixBase > 0) {
    y += 5;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.accent);
    doc.text('Complementos, frete e mão de obra não são parcelados em 18x.', margin, y + 5);
    doc.text(`Valor Restante (Via PIX): ${fmt(pixBase)} (Sinal e Saldo ao final da obra)`, margin, y + 10);
    y += 8;
  }
  
  y += 10;

  const cardTableBody = CARD_RATES.map(([n]) => {
    const res = calculateInstallmentValue(creditCardBase, n, discount > 0);
    const label = res.isInterestFree ? `${n}x sem juros` : `${n}x`;
    return [label, fmt(res.installment)];
  });

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [['Parcelas', 'Valor da Parcela']],
    body: cardTableBody,
    styles: {
      fontSize: 8,
      cellPadding: 2,
      textColor: COLORS.foreground,
      lineColor: [220, 210, 200],
      lineWidth: 0.15,
    },
    headStyles: {
      fillColor: COLORS.accent,
      textColor: COLORS.white,
      fontStyle: 'bold',
      fontSize: 9,
    },
    alternateRowStyles: {
      fillColor: [250, 247, 242],
    },
    columnStyles: {
      0: { cellWidth: contentWidth * 0.4, halign: 'center', fontStyle: 'bold' },
      1: { cellWidth: contentWidth * 0.6, halign: 'center' },
    },
    didParseCell: (hookData) => {
      if (hookData.section === 'body') {
        // Extreme Highlight for the 18x row (index 17)
        if (hookData.row.index === 17) {
          hookData.cell.styles.textColor = COLORS.white;
          hookData.cell.styles.fontStyle = 'bold';
          hookData.cell.styles.fillColor = COLORS.accent;
        }
      }
    },
  });

  y = (doc as any).lastAutoTable.finalY + 6;

  // ─── NOVO BLOCO: MODALIDADES DE CONSTRUÇÃO ───
  y = checkPageBreak(doc, y, 80);
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...COLORS.accent);
  doc.text('MODALIDADES DE CONSTRUÇÃO & CUSTO-BENEFÍCIO', margin, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.foreground);
  const modIntro = 'Para viabilizar o seu chalé com total transparência, a Wood Bahia disponibiliza 3 modalidades de venda. Conheça as opções e saiba por que a Modalidade 2 é a nossa recomendação número um em economia:';
  const modIntroLines = doc.splitTextToSize(modIntro, contentWidth);
  doc.text(modIntroLines, margin, y);
  y += modIntroLines.length * 4 + 4;

  // Modalidade 1
  doc.setFillColor(...COLORS.lightBg);
  doc.roundedRect(margin, y, contentWidth, 12, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.foreground);
  doc.text('1. Apenas o Kit Madeiramento (Economia Bruta)', margin + 4, y + 4.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.muted);
  doc.text('Madeiramento estrutural completo em Pinus autoclavado. A montagem e acabamentos são por conta do cliente.', margin + 4, y + 8.5);
  y += 15;

  // Modalidade 2 (Recomendada!)
  doc.setFillColor(230, 245, 230); // Fundo verde claro
  doc.setDrawColor(...COLORS.green); // Borda verde
  doc.roundedRect(margin, y, contentWidth, 30, 2, 2, 'FD'); // Borda + Fundo
  
  // Badge
  doc.setFillColor(...COLORS.green);
  doc.roundedRect(margin + 4, y + 3, 50, 4.5, 1, 1, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...COLORS.white);
  doc.text('MELHOR CUSTO-BENEFÍCIO / RECOMENDADO', margin + 6, y + 6.2);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.green);
  doc.text('2. Kit + Montagem Parceira (Indicação de Mão de Obra)', margin + 58, y + 6.5);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.foreground);
  const mod2Desc = 'Você adquire o Kit de madeiramento e esquadrias de fábrica, e nós indicamos equipes de montagem parceiras credenciadas com preço de mão de obra tabelado. Você contrata e paga o carpinteiro diretamente, o que garante ISENÇÃO TOTAL de taxas administrativas e intermediação de construtora. É a melhor forma de economizar até 30% na obra, sem abrir mão da garantia de 15 anos da madeira!';
  const mod2Lines = doc.splitTextToSize(mod2Desc, contentWidth - 8);
  doc.text(mod2Lines, margin + 4, y + 12);
  y += 33;

  // Modalidade 3
  doc.setFillColor(...COLORS.lightBg);
  doc.roundedRect(margin, y, contentWidth, 12, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.foreground);
  doc.text('3. Wood Bahia Chave na Mão (Praticidade Total)', margin + 4, y + 4.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.muted);
  doc.text('A Wood Bahia assume a coordenação e responsabilidade total da estrutura montada, cobertura, vidros e stain aplicado.', margin + 4, y + 8.5);
  y += 17;

  // ─── CHECK PAGE BREAK ───
  y = checkPageBreak(doc, y, 60);

  // ─── INCLUDED / NOT INCLUDED ───
  const included = data.customIncludedItems || getIncludedItems(data);
  const notIncluded = data.customNotIncludedItems || getNotIncludedItems(data);

  const colWidth = (contentWidth - 6) / 2;

  // Included box
  doc.setFillColor(230, 245, 230);
  doc.roundedRect(margin, y, colWidth, 6 + included.length * 5 + 4, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.green);
  doc.text('O QUE ESTÁ INCLUSO', margin + 4, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.foreground);
  included.forEach((item, i) => {
    doc.text(`• ${item}`, margin + 4, y + 12 + i * 5);
  });

  // Not included box
  const notBoxX = margin + colWidth + 6;
  doc.setFillColor(255, 240, 230);
  doc.roundedRect(notBoxX, y, colWidth, 6 + notIncluded.length * 5 + 4, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(180, 60, 30);
  doc.text('O QUE NÃO ESTÁ INCLUSO', notBoxX + 4, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.foreground);
  notIncluded.forEach((item, i) => {
    doc.text(`• ${item}`, notBoxX + 4, y + 12 + i * 5);
  });

  y += Math.max(6 + included.length * 5 + 4, 6 + notIncluded.length * 5 + 4) + 8;


  // ─── COMPARATIVE BLOCK ───
  y = checkPageBreak(doc, y, 50);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.accent);
  doc.text('POR QUE ESCOLHER MADEIRA?', margin, y);
  y += 4;

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [['', 'Alvenaria Convencional', 'Chalé Wood Bahia']],
    body: [
      ['Custo por m²', 'A partir de R$ 2.500/m²', 'A partir de R$ 1800/m²'],
      ['Prazo de obra', '6 a 12 meses', '15 a 60 dias'],
      ['Sustentabilidade', 'Alto impacto ambiental', 'Madeira de reflorestamento'],
      ['Garantia', 'Variável', '15 anos na madeira'],
      ['Valorização', 'Convencional', 'Alta — tendência de mercado'],
    ],
    styles: { fontSize: 8, cellPadding: 2.5, textColor: COLORS.foreground },
    headStyles: { fillColor: COLORS.primary, textColor: COLORS.white, fontStyle: 'bold', fontSize: 8 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: contentWidth * 0.25 },
      1: { cellWidth: contentWidth * 0.375 },
      2: { cellWidth: contentWidth * 0.375 },
    },
    alternateRowStyles: { fillColor: [245, 240, 234] },
  });

  y = (doc as any).lastAutoTable.finalY + 8;

  // ─── GUARANTEE & VALIDITY ───
  y = checkPageBreak(doc, y, 42);
  doc.setFillColor(...COLORS.lightBg);
  doc.roundedRect(margin, y, contentWidth, 32, 3, 3, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.primary);
  doc.text('GARANTIA', margin + 6, y + 5);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.foreground);
  doc.text('15 anos de garantia na madeira Pinus tratada em autoclave contra cupins e fungos.', margin + 6, y + 10);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.primary);
  doc.text('CONDIÇÕES DO TERRENO & FUNDAÇÃO', margin + 6, y + 16);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.foreground);
  const obsTerreno = 'Os valores estimados de fundação e montagem consideram terreno plano ou com desnível de até 50cm. Para terrenos com desnível superior ao indicado, a proposta estrutural definitiva será confirmada somente após visita técnica e avaliação topográfica presencial do local.';
  const obsTerrenoLines = doc.splitTextToSize(obsTerreno, contentWidth - 12);
  doc.text(obsTerrenoLines, margin + 6, y + 21);

  y += 32;

  // ─── OBSERVAÇÕES CUSTOMIZADAS ───
  if (data.observations && data.observations.trim()) {
    const obsLines = doc.splitTextToSize(data.observations.trim(), contentWidth - 12);
    const obsHeight = 10 + obsLines.length * 4.5;
    
    y = checkPageBreak(doc, y, obsHeight + 8);
    
    doc.setFillColor(248, 246, 242); 
    doc.setDrawColor(...COLORS.muted);
    doc.setLineWidth(0.15);
    doc.roundedRect(margin, y, contentWidth, obsHeight, 2, 2, 'FD'); 
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...COLORS.accent);
    doc.text('OBSERVAÇÕES ESPECIAIS', margin + 6, y + 6);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.foreground);
    doc.text(obsLines, margin + 6, y + 12);
    
    y += obsHeight + 6;
  }

  y = checkPageBreak(doc, y, 10);

  // Ícone de Atenção desenhado
  doc.setFillColor(180, 60, 30);
  doc.circle(margin + 2, y - 1, 2.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text('!', margin + 2, y + 0.5, { align: 'center' });

  // Texto da validade
  doc.setFontSize(9);
  doc.setTextColor(180, 60, 30);
  doc.text('Esta proposta é válida por 7 dias a partir da data de emissão.', margin + 6, y);

  // ─── FOOTER on all pages ───
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    drawFooter(doc, pageWidth);
  }

  // Save — Nome: PrimeiroNome_Modelo.pdf
  const firstName = data.clientName.trim().split(/\s+/)[0] || 'Cliente';
  const safeModelName = modelName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_\u00C0-\u00FF]/g, '');
  const fileName = `${firstName}_${safeModelName}.pdf`;
  doc.save(fileName);
}
