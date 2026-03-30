import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import cabecalhoNovoImg from '../../public/assets/cabecalho-novo.jpg';
import {
  calculateProposalItems,
  CABIN_MODELS,
  CARD_RATES,
  calculateInstallmentValue,
  type ProposalData,
  type KitType,
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
  kit1: 'Kit 1 — Essência Natural',
  kit2: 'Kit 2 — Raízes do Projeto',
  kit3: 'Kit 3 — Abrigo Natural',
  kit4: 'Kit 4 — Refúgio Completo',
  custom: 'Kit Personalizado',
};

const KIT_DESCRIPTIONS: Record<string, string> = {
  kit1: 'Madeiramento completo em Pinus tratado. A base estrutural em madeira tratada, pronta para dar vida ao seu projeto com segurança e durabilidade.',
  kit2: 'Kit 1 + portas, janelas e ferragens, formando o início real do seu Chalé.',
  kit3: 'Kit 2 + Telhas e Stain. Seu chalé protegido com cobertura completa, pronto para enfrentar o tempo com conforto e resistência.',
  kit4: 'Kit 3 + mão-de-obra completa. Do projeto à realidade: entregamos seu chalé montado, pronto para viver, investir ou relaxar.',
  custom: 'Kit personalizado montado sob medida para o seu projeto.',
};


function fmt(v: number): string {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function getIncludedItems(data: ProposalData): string[] {
  const items: string[] = [
    'Estrutura completa em madeira Pinus autoclavada',
    'Paredes, forros e estrutura do telhado',
    'Ripas, canaletas, rodapés, molduras',
  ];
  
  const hasFixtures = data.kitType === 'custom' ? data.includeFixtures : ['kit2', 'kit3', 'kit4'].includes(data.kitType);
  if (hasFixtures) {
    items.push('Portas e janelas em madeira');
    items.push('Ferragens completas');
  }
  
  const hasTiles = data.kitType === 'custom' ? data.includeTilesStain : ['kit3', 'kit4'].includes(data.kitType);
  if (hasTiles) {
    items.push('Cobertura com telhas');
    items.push('Stain protetor aplicado');
  }
  
  const hasLabor = data.kitType === 'custom' ? data.includeLabor : data.kitType === 'kit4';
  if (hasLabor) {
    items.push('Mão de obra completa de montagem');
  }

  if (data.includeElectrical) {
    items.push('Instalações elétricas e hidráulicas (Básica)');
  }

  if (data.includeGlass) {
    items.push('Vidros inclusos');
  }

  if (data.kitType === 'custom' && data.includeProject) {
    items.push('Projeto Arquitetônico Personalizado');
  }

  if (data.foundationType && data.foundationType !== 'none') {
    const fLabel = data.foundationType === 'eucalyptus' ? 'Sapatas de Eucalipto Tratado'
                 : data.foundationType === 'masonry' ? 'Sapatas de Manilhas em Alvenaria'
                 : 'Base Radier Completo';
    items.push(fLabel);
  }

  if (data.masonryBathroomCount && data.masonryBathroomCount > 0) {
    items.push(data.masonryBathroomCount === 1 ? '1 Banheiro em Alvenaria' : `${data.masonryBathroomCount} Banheiros em Alvenaria`);
  }

  if (data.paintType && data.paintType !== 'none') {
    items.push(data.paintType === '1cor' ? 'Pintura Completa com Stain (1 Cor)' : 'Pintura Completa com Stain (2 Cores)');
  }

  return items;
}

function getNotIncludedItems(data: ProposalData): string[] {
  const items: string[] = [];

  const hasLabor = data.kitType === 'custom' ? data.includeLabor : data.kitType === 'kit4';
  if (!hasLabor) {
    items.push('Mão de obra de montagem');
  }

  const hasFixtures = data.kitType === 'custom' ? data.includeFixtures : ['kit2', 'kit3', 'kit4'].includes(data.kitType);
  if (!hasFixtures) {
    items.push('Portas, janelas e ferragens');
  }

  const hasTiles = data.kitType === 'custom' ? data.includeTilesStain : ['kit3', 'kit4'].includes(data.kitType);
  if (!hasTiles) {
    items.push('Cobertura e telhas');
  }

  if (!data.foundationType || data.foundationType === 'none') {
    items.push('Fundação estrutural e base');
  }
  
  if (!data.includeElectrical) {
    items.push('Instalações elétricas e hidráulicas');
  }
  if (!data.includeGlass) {
    items.push('Vidros e envidraçamento');
  }

  if (!data.paintType || data.paintType === 'none') {
    items.push('Pintura externa adicional');
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
    '(71) 99293-6290  •  @woodbahiacasasprefabricadas  •  woodbahia.site  •  CNPJ 57.721.838/0001-91',
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

export function generateProposalPDF(data: ProposalData): void {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = 210;
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  const today = new Date();
  const dateStr = today.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  const model = CABIN_MODELS.find(m => m.id === data.modelId);
  const area = data.customArea || model?.area || 0;
  const kitName = KIT_NAMES[data.kitType] || data.kitType;
  const kitDesc = KIT_DESCRIPTIONS[data.kitType] || '';
  const modelName = model?.name || 'Kit Personalizado';
  const { items, freight, additionalFreight, subtotal, total: totalFinal, discount } = calculateProposalItems(data);

  const subtotalComDesconto = subtotal - discount;
  const totalAVista = Math.round(totalFinal * 0.95);

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

  const tableBody = items.map(item => [item.label, fmt(item.value)]);
  
  const freightBase = freight * 2;
  tableBody.push(['Frete Base Estimado (' + area + 'm² × R$ 180)', fmt(freightBase)]);
  tableBody.push(['Promoção: Frete Compartilhado (Nós pagamos 50% do seu frete)', '-' + fmt(freight)]);

  if (additionalFreight > 0) {
    tableBody.push(['Frete Adicional (> 200km)', '+' + fmt(additionalFreight)]);
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
  const hasLabor = data.kitType === 'kit4' || (data.kitType === 'custom' && data.includeLabor);
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
  const baseParcelamento = subtotalComDesconto + freight;


  // Helper: bold label+value, normal description
  const drawPaymentLine = (label: string, value: string, desc: string, lineY: number) => {
    doc.setFont('helvetica', 'bold');
    doc.text(`• ${label} ${value}`, margin + 8, lineY);
    const boldW = doc.getTextWidth(`• ${label} ${value}`);
    doc.setFont('helvetica', 'normal');
    doc.text(` — ${desc}`, margin + 8 + boldW, lineY);
  };

  if (hasLabor) {
    // Kit 4: 30/20/50 com entrega das chaves
    const sinal = baseParcelamento * 0.3;
    const entregaKit = baseParcelamento * 0.2;
    const saldo = baseParcelamento * 0.5;
    drawPaymentLine('Sinal (30%):', fmt(sinal), 'Para iniciar o projeto', y);
    y += 5;
    drawPaymentLine('Entrega do Kit (20%):', fmt(entregaKit), 'Na chegada do material', y);
    y += 5;
    drawPaymentLine('Saldo Final (50%):', fmt(saldo), 'Até a entrega das chaves', y);
  } else {
    // Kits sem mão de obra: 50/50
    const metade = baseParcelamento * 0.5;
    drawPaymentLine('Sinal (50%):', fmt(metade), 'Na assinatura do contrato', y);
    y += 5;
    drawPaymentLine('Saldo (50%):', fmt(metade), '24h antes da saída do material', y);
  }
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
  doc.text('PARCELE O SEU CHALÉ EM ATÉ 18X NO CARTÃO DE CRÉDITO', margin, y);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.muted);
  doc.text('Simulação com taxas da operadora (sujeito a aprovação de limite)', margin, y + 5);
  
  y += 10;

  const cardTableBody = CARD_RATES.map(([n]) => {
    const res = calculateInstallmentValue(totalFinal, n);
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
        // Highlight 1x, 2x, 3x rows (indices 0,1,2) in green
        if (hookData.row.index <= 2) {
          hookData.cell.styles.textColor = COLORS.green;
          hookData.cell.styles.fontStyle = 'bold';
          hookData.cell.styles.fillColor = [230, 245, 230];
        }
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

  // ─── CHECK PAGE BREAK ───
  y = checkPageBreak(doc, y, 60);

  // ─── INCLUDED / NOT INCLUDED ───
  const included = getIncludedItems(data);
  const notIncluded = getNotIncludedItems(data);

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
  y = checkPageBreak(doc, y, 30);
  doc.setFillColor(...COLORS.lightBg);
  doc.roundedRect(margin, y, contentWidth, 18, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.primary);
  doc.text('GARANTIA', margin + 6, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.foreground);
  doc.text('15 anos de garantia na madeira Pinus tratada em autoclave contra cupins e fungos.', margin + 6, y + 12);

  y += 22;

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
