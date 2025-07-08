import Conductor from '../models/conductor.model.js';

export const crearConductor = async (req, res) => {
  try {
    const nuevo = new Conductor(req.body);
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear conductor', error });
  }
};

export const listarConductores = async (req, res) => {
  try {
    const conductores = await Conductor.find();
    res.json(conductores);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar conductores', error });
  }
};

export const obtenerConductorPorId = async (req, res) => {
  try {
    const conductor = await Conductor.findById(req.params.id);
    if (!conductor) return res.status(404).json({ message: 'No encontrado' });
    res.json(conductor);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener conductor', error });
  }
};

export const actualizarConductor = async (req, res) => {
  try {
    const actualizado = await Conductor.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar conductor', error });
  }
};
