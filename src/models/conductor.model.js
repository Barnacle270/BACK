import mongoose from 'mongoose';

const ConductorSchema = new mongoose.Schema({
  nombres: {
    type: String,
    required: true,
    trim: true
  },
  licencia: {
    type: String,
    required: true,
    trim: true
  }
});

export default mongoose.model('Conductor', ConductorSchema);
