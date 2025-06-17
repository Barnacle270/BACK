import mongoose from 'mongoose';

const DailyCashReportSchema = new mongoose.Schema({
  fecha: { type: Date, required: true },

  movimientos: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'CashMovement' }
  ],

  saldoInicial: { type: Number, required: true },
  totalIngresos: { type: Number, required: true },
  totalEgresos: { type: Number, required: true },

  saldoEfectivoFinal: { type: Number, required: true }, // ingresos - egresos
  saldoPorRendir: { type: Number, required: true },     // suma de egresos no rendidos

  saldoRealReportado: { type: Number }, // efectivo real contado por el responsable
  diferencia: { type: Number },         // diferencia entre efectivo calculado y real

  creadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  cerrado: { type: Boolean, default: false },

  pdfUrl: { type: String } // lo dejamos listo para cuando generes el PDF
});

export const DailyCashReport = mongoose.model('DailyCashReport', DailyCashReportSchema);
