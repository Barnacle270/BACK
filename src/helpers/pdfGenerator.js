import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generarPDFCierre = async (reporte) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40 });
    const fileName = `cierre_${uuidv4()}.pdf`;
    const filePath = path.join(__dirname, '../public/pdfs', fileName);

    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Encabezado
    doc.fontSize(18).text('CIERRE DIARIO DE CAJA', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Fecha: ${new Date(reporte.fecha).toLocaleDateString()}`, { align: 'center' });
    doc.moveDown(1.5);

    // Datos generales
    doc.fontSize(12).text(`Responsable: ${reporte.creadoPor.name} (DNI: ${reporte.creadoPor.dni})`);
    doc.text(`Saldo Inicial: S/ ${reporte.saldoInicial.toFixed(2)}`);
    doc.text(`Total Ingresos: S/ ${reporte.totalIngresos.toFixed(2)}`);
    doc.text(`Total Egresos: S/ ${reporte.totalEgresos.toFixed(2)}`);
    doc.text(`Saldo Calculado: S/ ${reporte.saldoEfectivoFinal.toFixed(2)}`);
    doc.text(`Saldo Real Contado: S/ ${reporte.saldoRealReportado.toFixed(2)}`);
    doc.text(`Saldo por Rendir: S/ ${reporte.saldoPorRendir.toFixed(2)}`);
    doc.text(`Diferencia: S/ ${reporte.diferencia.toFixed(2)}`);
    doc.moveDown(1);

    // Tabla de movimientos
    doc.fontSize(13).text('Detalle de Movimientos', { underline: true });
    doc.moveDown(0.5);

    // Encabezado tabla
    doc.fontSize(11).text(
      'TIPO         DESCRIPCIÓN                         PLACA/MAQ        MONTO     ESTADO',
      { continued: false }
    );
    doc.moveDown(0.3);

    // Contenido tabla
    reporte.movimientos.forEach(mov => {
      const tipo = mov.tipo.padEnd(12);
      const desc = mov.descripcion.length > 30 ? mov.descripcion.slice(0, 27) + '...' : mov.descripcion.padEnd(30);
      const placa = (mov.placaOMaquina || '').padEnd(15);
      const monto = `S/ ${mov.monto.toFixed(2)}`.padEnd(10);
      const estado = mov.estadoRendicion || '';
      doc.font('Courier').fontSize(10).text(`${tipo}${desc}${placa}${monto}${estado}`);
    });

    doc.moveDown(2);

    // Firmas
    doc.font('Helvetica').fontSize(12).text('___________________________', { align: 'left' });
    doc.text('Firma Responsable', { align: 'left' });

    doc.moveDown(2);

    doc.text('___________________________', { align: 'left' });
    doc.text('Firma Supervisor', { align: 'left' });

    doc.end();

    stream.on('finish', () => {
      resolve(`/pdfs/${fileName}`);
    });

    stream.on('error', reject);
  });
};
