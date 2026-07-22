// @ts-ignore
import { jsPDF } from 'jspdf';

interface PDFParams {
  name: string;
  email: string;
  business_type: string;
  description: string;
  siteData: any;
  prompt: string;
}

export function generateProjectPDF(params: PDFParams): Blob {
  const doc = new jsPDF();
  const marginX = 20;
  let cursorY = 20;

  // Helpers
  const addTitle = (text: string) => {
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text(text, marginX, cursorY);
    cursorY += 15;
  };

  const addSubtitle = (text: string) => {
    // page break check
    if (cursorY > 270) {
      doc.addPage();
      cursorY = 20;
    }
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59); // slate-800
    doc.text(text, marginX, cursorY);
    cursorY += 10;
  };

  const addText = (text: string) => {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105); // slate-500
    
    // Auto break lines
    const lines = doc.splitTextToSize(text, 170); // 170 is width
    for (let i = 0; i < lines.length; i++) {
      if (cursorY > 280) {
        doc.addPage();
        cursorY = 20;
      }
      doc.text(lines[i], marginX, cursorY);
      cursorY += 7;
    }
    cursorY += 3;
  };

  // Build PDF
  addTitle('Projeto Umbulab - IA Site Preview');

  addSubtitle('1. Informacoes do Cliente');
  addText(`Nome: ${params.name}`);
  addText(`E-mail: ${params.email}`);
  addText(`Tipo de Negocio: ${params.business_type}`);
  cursorY += 5;

  addSubtitle('2. Estrutura do Site Gerada');
  if (params.siteData && Array.isArray(params.siteData.sections)) {
    params.siteData.sections.forEach((sec: any) => {
      addText(`Secao: ${sec.type.toUpperCase()}`);
      if (sec.title) addText(`- Titulo: ${sec.title}`);
      if (sec.subtitle) addText(`- Subtitulo: ${sec.subtitle}`);
      if (sec.content) addText(`- Conteudo: ${sec.content}`);
      cursorY += 2;
    });
  }
  cursorY += 5;

  addSubtitle('3. Contexto Original (AI Prompt)');
  addText(params.prompt);

  return doc.output('blob');
}
