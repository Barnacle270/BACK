import mongoose from 'mongoose';

const alertaSchema = new mongoose.Schema({
  maquinariaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Maquinaria', required: true },
  mantenimientoNombre: { type: String, required: true },
  lecturaEnAlerta: { type: Number, required: true },
  fecha: { type: Date, default: Date.now },
  estado: { type: String, default: 'enviado' }
});

// 🧠 Este índice evita duplicados exactos
alertaSchema.index(
  { maquinariaId: 1, mantenimientoNombre: 1, lecturaEnAlerta: 1 },
  { unique: true }
);

export default mongoose.model('AlertaEnviada', alertaSchema);
