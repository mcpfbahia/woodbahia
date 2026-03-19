import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  calculateProposalItems,
  CABIN_MODELS,
  type ProposalData,
  type KitType,
} from './pricing';

// No Next.js, usamos caminhos relativos à pasta public para imagens no PDF
const IMAGES = {
  header: '/cabecalho wood bahia para word proposta novo.jpg',
  logo: '/assets/logo-woodbahia.png',
};

// Colors from the design system (HSL converted to RGB)
const COLORS = {
  primary: [140, 66, 31] as [number, number, number], // #8C421F (Wood Brown)
  secondary: [210, 105, 30] as [number, number, number], // #D2691E (Chocolate)
  accent: [66, 99, 78] as [number, number, number], // #42634E (Forest Green)
  background: [250, 247, 242] as [number, number, number], // #FAF7F2
  foreground: [74, 55, 40] as [number, number, number], // #4A3728
  muted: [130, 120, 110] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  lightBg: [244, 238, 232] as [number, number, number],
  green: [46, 125, 50] as [number, number, number],
  border: [210, 190, 170] as [number, number, number],
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

const CARD_RATES: [number, number][] = [
  [1, 0], [2, 5.11], [3, 0], [4, 6.39], [5, 7.12], [6, 7.85],
  [10, 11.36], [12, 13.02], [15, 15.90], [18, 18.77],
];

function fmt(v: number): string {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function getIncludedItems(data: ProposalData): string[] {
  const { kitType } = data;
  const items: string[] = [
    'Estrutura completa em madeira Pinus autoclavada',
    'Paredes, forros e estrutura do telhado',
    'Ripas, canaletas, rodapés, molduras',
  ];
  const hasFixtures = kitType === 'custom' ? data.includeFixtures : ['kit2', 'kit3', 'kit4'].includes(kitType);
  const hasTiles = kitType === 'custom' ? data.includeTilesStain : ['kit3', 'kit4'].includes(kitType);
  const hasLabor = kitType === 'custom' ? data.includeLabor : kitType === 'kit4';

  if (hasFixtures) {
    items.push('Portas e janelas em madeira');
    items.push('Ferragens completas');
  }
  if (hasTiles) {
    items.push('Cobertura com telhas');
    items.push('Stain protetor aplicado');
  }
  if (hasLabor) {
    if (hasTiles) {
      items.push('Mao de obra completa de montagem + pintura com 1 cor');
    } else {
      items.push('Mao de obra completa de montagem');
    }
  }
  return items;
}

function getNotIncludedItems(kitType: KitType): string[] {
  const items: string[] = [];
  if (kitType !== 'kit4') items.push('Mão de obra de montagem');
  if (kitType === 'kit1') {
    items.push('Portas, janelas e ferragens');
    items.push('Cobertura e telhas');
  }
  if (kitType === 'kit2') items.push('Cobertura e telhas');
  items.push('Fundação (radier ou sapata)');
  items.push('Instalações elétricas e hidráulicas');
  items.push('Frete (cotado separadamente)');
  items.push('Licenças ou projetos legais');
  return items;
}

function drawFooter(doc: jsPDF, pageWidth: number) {
  const footerY = 285;
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, footerY, pageWidth, 12, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.white);
  doc.text('ESTE É O MOMENTO DE TRANSFORMAR SEU SONHO EM REALIDADE.', pageWidth / 2, footerY + 5, { align: 'center' });
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text(
    '(71) 99293-6290  •  @woodbahiacasasprefabricadas  •  www.woodbahia.site  •  CNPJ 57.721.838/0001-91',
    pageWidth / 2, footerY + 9, { align: 'center' }
  );
}

function checkPageBreak(doc: jsPDF, y: number, needed: number): number {
  if (y + needed > 275) {
    doc.addPage();
    return 20;
  }
  return y;
}

async function loadImgData(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/jpeg'));
    };
    img.onerror = reject;
    img.src = url;
  });
}

export async function generateProposalPDF(data: ProposalData): Promise<void> {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = 210;
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  const today = new Date();
  const dateStr = today.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  const model = CABIN_MODELS.find(m => m.id === data.modelId);
  const area = data.customArea || model?.area || 0;
  const kitName = KIT_NAMES[data.kitType] || data.kitType;
  const kitDesc = KIT_DESCRIPTIONS[data.kitType] || '';
  const modelName = model?.name || 'Projeto Personalizado';
  const { items, freight, subtotal, total: totalFinal, discount } = calculateProposalItems(data);

  let y = 0;

  // 1. Header & Branding
  try {
    const headerData = await loadImgData(IMAGES.header);
    doc.addImage(headerData, 'JPEG', 0, 0, 210, 38);
  } catch (err) {
    doc.setFillColor(...COLORS.primary);
    doc.rect(0, 0, 210, 38, 'F');
  }

  y = 48;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...COLORS.foreground);
  doc.text('PROPOSTA COMERCIAL', margin, y);
  
  doc.setDrawColor(...COLORS.primary);
  doc.setLineWidth(0.5);
  doc.line(margin, y + 2, margin + 40, y + 2);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.muted);
  doc.text(dateStr, pageWidth - margin, y, { align: 'right' });

  y = 62;
  doc.setFontSize(11);
  doc.setTextColor(...COLORS.foreground);
  doc.text(`Olá, `, margin, y);
  const olaW = doc.getTextWidth('Olá, ');
  doc.setFont('helvetica', 'bold');
  doc.text(data.clientName, margin + olaW, y);

  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const introText = `Apresentamos a solução ideal para o seu projeto de construção em madeira. Na Wood Bahia, unimos a rusticidade elegante do Pinus tratado com a durabilidade de 15 anos de garantia. Abaixo, detalhamos o investimento para o seu novo refúgio.`;
  const introLines = doc.splitTextToSize(introText, contentWidth);
  doc.text(introLines, margin, y);
  y += introLines.length * 5 + 6;

  // 2. Dados do Projeto (Badge Style)
  doc.setFillColor(...COLORS.lightBg);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.primary);
  doc.text('DETALHES DO PROJETO', margin + 6, y + 7);

  doc.setFontSize(10);
  doc.setTextColor(...COLORS.foreground);
  doc.text(`Modelo: ${modelName}`, margin + 6, y + 14);
  doc.text(`Área: ${area}m²`, margin + 6, y + 20);

  const halfX = margin + contentWidth / 2;
  doc.text(`Kit: ${kitName}`, halfX, y + 14);
  doc.text(`Local: ${data.workLocation}`, halfX, y + 20);

  y += 32;

  // 3. Tabela de Investimento
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...COLORS.accent);
  doc.text('DETALHAMENTO DO INVESTIMENTO', margin, y);
  y += 4;

  const tableBody = items.map(item => [item.label, fmt(item.value)]);
  
  // Subtotal Parcial de Itens antes do Frete/Descontos
  tableBody.push(['SUBTOTAL DE ITENS', fmt(subtotal)]);

  if (freight > 0) {
    tableBody.push(['Frete Logistica (Referencia)', fmt(freight * 2)]);
    tableBody.push(['BONUS: Frete Compartilhado (50% OFF)', `-${fmt(freight)}`]);
  }
  if (discount > 0) {
    tableBody.push(['DESCONTO PROMOCIONAL CONCEDIDO', `-${fmt(discount)}`]);
  }

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [['Descricao do Item', 'Valor Bruto']],
    body: tableBody,
    styles: { fontSize: 9, cellPadding: 3.5, textColor: COLORS.foreground, lineColor: COLORS.border, lineWidth: 0.1 },
    headStyles: { fillColor: COLORS.accent, textColor: COLORS.white, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [250, 248, 245] },
    columnStyles: { 
      0: { cellWidth: contentWidth * 0.72 }, 
      1: { cellWidth: contentWidth * 0.28, halign: 'right', fontStyle: 'bold' } 
    },
    didParseCell: (hookData) => {
      if (hookData.section === 'body' && (hookData.cell.raw as string).includes('SUBTOTAL')) {
        hookData.cell.styles.fontStyle = 'bold';
        hookData.cell.styles.fillColor = [240, 240, 240];
      }
      if (hookData.section === 'body' && (hookData.cell.raw as string).includes('BONUS')) {
        hookData.cell.styles.textColor = COLORS.green;
      }
      if (hookData.section === 'body' && (hookData.cell.raw as string).includes('DESCONTO')) {
        hookData.cell.styles.textColor = COLORS.primary;
      }
    }
  });

  y = (doc as any).lastAutoTable.finalY + 6;

  // 4. Totais e Destaque
  const totalDescontos = discount + (freight > 0 ? freight : 0);
  const subtotalBruto = subtotal + (freight > 0 ? freight * 2 : 0);

  const totalsBoxHeight = totalDescontos > 0 ? 32 : 20;
  doc.setFillColor(...COLORS.primary);
  doc.roundedRect(margin, y, contentWidth, totalsBoxHeight, 3, 3, 'F');
  
  doc.setTextColor(...COLORS.white);
  if (totalDescontos > 0) {
    doc.setFontSize(9);
    doc.text(`Subtotal Bruto (Itens + Frete): ${fmt(subtotalBruto)}`, margin + 6, y + 8);
    doc.setFontSize(10);
    doc.setTextColor(200, 255, 200);
    doc.text(`(-) TOTAL DE DESCONTOS E BONUS: -${fmt(totalDescontos)}`, margin + 6, y + 15);
    doc.setFontSize(15);
    doc.setTextColor(...COLORS.white);
    doc.text(`INVESTIMENTO TOTAL: ${fmt(totalFinal)}`, margin + 6, y + 26);
  } else {
    doc.setFontSize(15);
    doc.text(`INVESTIMENTO TOTAL: ${fmt(totalFinal)}`, margin + 6, y + 13);
  }

  y += totalsBoxHeight + 8;
  y = checkPageBreak(doc, y, 65);


  // 5. Condições de Pagamento e Parcelamento
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...COLORS.secondary);
  doc.text('CONDICOES DE PAGAMENTO', margin, y);
  y += 6;

  doc.setFontSize(9);
  doc.setTextColor(...COLORS.foreground);
  const isLabor = data.kitType === 'kit4' || (data.kitType === 'custom' && data.includeLabor);
  if (isLabor) {
    doc.text(`- Sinal (30%): ${fmt(totalFinal * 0.3)} -- No fechamento do contrato.`, margin + 4, y);
    y += 5;
    doc.text(`- Entrega (20%): ${fmt(totalFinal * 0.2)} -- Na chegada do material na obra.`, margin + 4, y);
    y += 5;
    doc.text(`- Saldo Final (50%): ${fmt(totalFinal * 0.5)} -- Na entrega das chaves.`, margin + 4, y);
  } else {
    doc.text(`- Entrada (50%): ${fmt(totalFinal * 0.5)} -- No fechamento do contrato.`, margin + 4, y);
    y += 5;
    doc.text(`- Saldo (50%): ${fmt(totalFinal * 0.5)} -- 24h antes da saida da fabrica.`, margin + 4, y);
  }

  y += 10;
  y = checkPageBreak(doc, y, 50);
  doc.setFillColor(...COLORS.lightBg);
  doc.roundedRect(margin, y, contentWidth, 54, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.text('PARCELAMENTO NO CARTAO DE CREDITO', margin + 6, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('Simulacao em parcelas fixas com taxas da operadora:', margin + 6, y + 14);

  const cardItems = CARD_RATES.map(([n, rate]) => {
    const total = n <= 3 ? totalFinal : totalFinal / (1 - rate / 100);
    const parcela = total / n;
    const label = n <= 3 ? `${n}x sem juros` : `${n}x`;
    return [label, fmt(parcela)];
  });

  const part1 = cardItems.slice(0, 5);
  const part2 = cardItems.slice(5);
  const tableW = (contentWidth - 14) / 2;

  autoTable(doc, {
    startY: y + 18,
    margin: { left: margin + 6 },
    tableWidth: tableW,
    body: part1,
    styles: { fontSize: 8.5, cellPadding: 1.5, textColor: COLORS.foreground },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 30 }, 1: { halign: 'right' } },
    theme: 'plain'
  });

  // Vertical Separator
  doc.setDrawColor(...COLORS.border);
  doc.setLineWidth(0.1);
  doc.line(margin + 6 + tableW + 1, y + 18, margin + 6 + tableW + 1, y + 48);

  autoTable(doc, {
    startY: y + 18,
    margin: { left: margin + 6 + tableW + 2 },
    tableWidth: tableW,
    body: part2,
    styles: { fontSize: 8.5, cellPadding: 1.5, textColor: COLORS.foreground },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 20 }, 1: { halign: 'right' } },
    theme: 'plain'
  });

  y = (doc as any).lastAutoTable.finalY + 12; // Posicionamento dinâmico
  y = checkPageBreak(doc, y, 80);

  // 6. Beneficios e Garantia
  const included = getIncludedItems(data);
  const notIncluded = getNotIncludedItems(data.kitType);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.accent);
  doc.text('CONTEUDO DO KIT E GARANTIA', margin, y);
  y += 6;

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [['O QUE ESTA INCLUSO', 'O QUE NAO ESTA INCLUSO']],
    body: [
      [
        included.map(i => `- ${i}`).join('\n'),
        notIncluded.map(i => `- ${i}`).join('\n')
      ]
    ],
    styles: { fontSize: 8.5, cellPadding: 4, valign: 'top' },
    headStyles: { fillColor: COLORS.accent, textColor: COLORS.white },
    columnStyles: { 0: { fillColor: [240, 248, 240] }, 1: { fillColor: [255, 248, 240] } }
  });

  // Vertical Separator for inclusions
  const tableIncY = y;
  const tableIncFinalY = (doc as any).lastAutoTable.finalY;
  doc.setDrawColor(...COLORS.white);
  doc.setLineWidth(0.5);
  doc.line(margin + contentWidth / 2, tableIncY, margin + contentWidth / 2, tableIncFinalY);

  y = tableIncFinalY + 8;

  doc.setFillColor(...COLORS.lightBg);
  doc.roundedRect(margin, y, contentWidth, 18, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.primary);
  doc.text('GARANTIA DE 15 ANOS', margin + 6, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.foreground);
  doc.text('Certificado de garantia Wood Bahia para o madeiramento tratado em autoclave contra fungos e cupins.', margin + 6, y + 14);

  y += 28;
  y = checkPageBreak(doc, y, 60);

  // 7. Comparativo
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...COLORS.foreground);
  doc.text('POR QUE ESCOLHER A MADEIRA?', margin, y);
  y += 5;

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [['Diferencial', 'Alvenaria', 'Wood Bahia']],
    body: [
      ['Prazo de Obra', '6 a 12 meses', '15 a 60 dias'],
      ['Isolamento Térmico', 'Baixo', 'Excelente Natural'],
      ['Sustentabilidade', 'Baixa', '100% Renovável'],
      ['Custo de Manutenção', 'Médio', 'Baixo'],
    ],
    styles: { fontSize: 8.5, cellPadding: 3 },
    headStyles: { fillColor: COLORS.secondary },
    columnStyles: { 0: { fontStyle: 'bold' } }
  });

  y = (doc as any).lastAutoTable.finalY + 12;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.muted);
  doc.text(`* Proposta válida por 7 dias. Valores sujeitos a disponibilidade de estoque.`, margin, y);

  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    drawFooter(doc, pageWidth);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.muted);
    doc.text(`Página ${p} de ${totalPages}`, pageWidth - margin, 278, { align: 'right' });
  }

  const fileName = `Proposta_WoodBahia_${data.clientName.replace(/\s+/g, '_')}_${today.toISOString().slice(0, 10)}.pdf`;
  doc.save(fileName);
}
