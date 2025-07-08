import mongoose from 'mongoose';

const clienteSchema = new mongoose.Schema({
  razonSocial: {
    type: String,
    required: true,
    trim: true,
  },
  ruc: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  }
}, {
  timestamps: true
});

export default mongoose.model('Cliente', clienteSchema);
