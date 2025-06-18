import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

const outputDir = path.resolve('src', 'pdfs');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const formatCurrency = (n) => `S/ ${n.toFixed(2)}`;

const generarPDF = async ({
  fecha,
  movimientos,
  saldoInicial,
  ingresos,
  egresosLiquidados,
  egresosPorRendir,
  saldoEfectivoFinal,
  totalCierre
}) => {
  return new Promise((resolve, reject) => {
    const fechaStr = new Date(fecha).toISOString().split('T')[0];
    const fileName = `cierre-caja-${fechaStr}.pdf`;
    const filePath = path.join(outputDir, fileName);

    const doc = new PDFDocument({ margin: 40 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Título
    doc.fontSize(16).text(`CIERRE DE CAJA - ${fechaStr}`, { align: 'center' }).moveDown();

    // Resumen financiero
    doc.fontSize(12).text(`Saldo anterior: ${formatCurrency(saldoInicial)}`);
    doc.text(`Ingresos: ${formatCurrency(ingresos)}`);
    doc.text(`Egresos liquidados: ${formatCurrency(egresosLiquidados)}`);
    doc.text(`Egresos por rendir: ${formatCurrency(egresosPorRendir)}`);
    doc.text(`Saldo efectivo final: ${formatCurrency(saldoEfectivoFinal)}`);
    doc.text(`Total cierre de caja: ${formatCurrency(totalCierre)}`);
    doc.moveDown();

    // Detalle de movimientos
    doc.fontSize(14).text('Movimientos:', { underline: true }).moveDown(0.5);
    movimientos.forEach((m, i) => {
      doc.fontSize(10).text(
        `${i + 1}. [${m.tipo.toUpperCase()}] ${m.descripcion} | ${formatCurrency(m.monto)} | Estado: ${m.estado} | Solicitante: ${m.solicitante}`
      );
    });

    // Pie
    doc.moveDown(2).fontSize(12).text('__________________________', { align: 'left' });
    doc.text('Firma responsable', { align: 'left' });

    doc.end();

    stream.on('finish', () => {
      const urlRelativa = `/pdfs/${fileName}`; // si lo sirves desde /public o ruta fija
      resolve(urlRelativa);
    });

    stream.on('error', reject);
  });
};

export default generarPDF;
