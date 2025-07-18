import Maquinaria from '../models/maquinaria.model.js';

// Crear nueva maquinaria
export const crearMaquinaria = async (req, res) => {
  try {
    const nuevaMaquinaria = new Maquinaria(req.body);
    const maquinariaGuardada = await nuevaMaquinaria.save();
    res.status(201).json(maquinariaGuardada);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener todas las maquinarias
export const obtenerMaquinarias = async (req, res) => {
  try {
    const maquinarias = await Maquinaria.find().sort({ createdAt: -1 });
    res.json(maquinarias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener maquinaria por ID
export const obtenerMaquinariaPorId = async (req, res) => {
  try {
    const maquinaria = await Maquinaria.findById(req.params.id);
    if (!maquinaria) return res.status(404).json({ mensaje: 'No encontrada' });
    res.json(maquinaria);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar maquinaria
export const actualizarMaquinaria = async (req, res) => {
  try {
    const maquinaria = await Maquinaria.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(maquinaria);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar maquinaria
export const eliminarMaquinaria = async (req, res) => {
  try {
    await Maquinaria.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Maquinaria eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
