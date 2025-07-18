import Lectura from '../models/lectura.model.js';
import Maquinaria from '../models/maquinaria.model.js';

// Crear nueva lectura
export const crearLectura = async (req, res) => {
  try {
    const { maquinaria, valor, unidad, fecha, observaciones } = req.body;

    const maquina = await Maquinaria.findById(maquinaria);
    if (!maquina) {
      return res.status(404).json({ error: 'Maquinaria no encontrada' });
    }

    if (maquina.unidadMedida !== unidad) {
      return res.status(400).json({ error: 'Unidad no coincide con la maquinaria' });
    }

    if (valor < maquina.lecturaActual) {
      return res.status(400).json({ error: 'La nueva lectura no puede ser menor que la actual' });
    }

    const nuevaLectura = new Lectura({
      maquinaria,
      valor,
      unidad,
      fecha,
      observaciones
    });

    await nuevaLectura.save();

    // Actualizar lectura actual en la maquinaria
    maquina.lecturaActual = valor;
    await maquina.save();

    res.status(201).json(nuevaLectura);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear lectura', detalle: error.message });
  }
};

// Obtener lecturas por maquinaria
export const obtenerLecturasPorMaquinaria = async (req, res) => {
  try {
    const { maquinariaId } = req.params;

    const lecturas = await Lectura.find({ maquinaria: maquinariaId }).sort({ fecha: -1 });

    res.json(lecturas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener lecturas', detalle: error.message });
  }
};

// (Opcional) Eliminar una lectura
export const eliminarLectura = async (req, res) => {
  try {
    const { id } = req.params;

    const lectura = await Lectura.findByIdAndDelete(id);
    if (!lectura) {
      return res.status(404).json({ error: 'Lectura no encontrada' });
    }

    res.json({ mensaje: 'Lectura eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar lectura', detalle: error.message });
  }
};
