import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const dailyCashReportSchema = new Schema({
  fecha: { type: Date, required: true, unique: true },
  movimientos: [{ type: Schema.Types.ObjectId, ref: 'CashMovement' }],
  saldoInicial: { type: Number, default: 0 },
  totalIngresos: { type: Number, default: 0 },
  totalEgresosEfectivos: { type: Number, default: 0 },
  totalEgresosPorRendir: { type: Number, default: 0 },
  saldoEfectivoFinal: { type: Number, default: 0 },
  saldoPorRendir: { type: Number, default: 0 },
  saldoRealReportado: { type: Number },
  diferencia: { type: Number },
  cerrado: { type: Boolean, default: false },
  pdfUrl: { type: String },
  creadoPor: { type: Schema.Types.ObjectId, ref: 'Employee' }
}, { timestamps: true });

const DailyCashReport = model('DailyCashReport', dailyCashReportSchema);
export default DailyCashReport;
