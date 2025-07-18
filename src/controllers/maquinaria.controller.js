import Maquinaria from '../models/maquinaria.model.js';

// Crear nueva maquinaria
export const crearMaquinaria = async (req, res) => {
  try {
    const nuevaMaquinaria = new Maquinaria(req.body);
    await nuevaMaquinaria.save();
    res.status(201).json(nuevaMaquinaria);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear maquinaria', detalle: error.message });
  }
};

// Obtener todas las maquinarias
export const obtenerMaquinarias = async (req, res) => {
  try {
    const maquinarias = await Maquinaria.find();
    res.json(maquinarias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener maquinarias', detalle: error.message });
  }
};

// Obtener maquinaria por ID
export const obtenerMaquinariaPorId = async (req, res) => {
  try {
    const maquinaria = await Maquinaria.findById(req.params.id);
    if (!maquinaria) return res.status(404).json({ error: 'Maquinaria no encontrada' });
    res.json(maquinaria);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener maquinaria', detalle: error.message });
  }
};

// Actualizar maquinaria
export const actualizarMaquinaria = async (req, res) => {
  try {
    const maquinaria = await Maquinaria.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!maquinaria) return res.status(404).json({ error: 'Maquinaria no encontrada' });
    res.json(maquinaria);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar maquinaria', detalle: error.message });
  }
};

// Eliminar maquinaria
export const eliminarMaquinaria = async (req, res) => {
  try {
    const maquinaria = await Maquinaria.findByIdAndDelete(req.params.id);
    if (!maquinaria) return res.status(404).json({ error: 'Maquinaria no encontrada' });
    res.json({ mensaje: 'Maquinaria eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar maquinaria', detalle: error.message });
  }
};

// Agregar tipo de mantenimiento a maquinaria
export const agregarMantenimiento = async (req, res) => {
  try {
    const maquinaria = await Maquinaria.findById(req.params.id);
    if (!maquinaria) return res.status(404).json({ error: 'Maquinaria no encontrada' });

    maquinaria.mantenimientos.push(req.body);
    await maquinaria.save();
    res.json(maquinaria);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar mantenimiento', detalle: error.message });
  }
};

// Editar un tipo de mantenimiento
export const editarMantenimiento = async (req, res) => {
  try {
    const maquinaria = await Maquinaria.findById(req.params.id);
    if (!maquinaria) return res.status(404).json({ error: 'Maquinaria no encontrada' });

    const mantenimiento = maquinaria.mantenimientos.id(req.params.mantenimientoId);
    if (!mantenimiento) return res.status(404).json({ error: 'Mantenimiento no encontrado' });

    Object.assign(mantenimiento, req.body);
    await maquinaria.save();

    res.json(maquinaria);
  } catch (error) {
    res.status(500).json({ error: 'Error al editar mantenimiento', detalle: error.message });
  }
};

// Eliminar tipo de mantenimiento
export const eliminarMantenimiento = async (req, res) => {
  try {
    const maquinaria = await Maquinaria.findById(req.params.id);
    if (!maquinaria) return res.status(404).json({ error: 'Maquinaria no encontrada' });

    maquinaria.mantenimientos.id(req.params.mantenimientoId).remove();
    await maquinaria.save();

    res.json({ mensaje: 'Mantenimiento eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar mantenimiento', detalle: error.message });
  }
};
