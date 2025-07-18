import Lectura from '../models/lectura.model.js';
import Maquinaria from '../models/maquinaria.model.js';

// Crear una nueva lectura
export const crearLectura = async (req, res) => {
  try {
    const { maquinaria, lectura, fecha } = req.body;

    const maquina = await Maquinaria.findById(maquinaria);
    if (!maquina) {
      return res.status(404).json({ mensaje: 'Maquinaria no encontrada' });
    }

    // Validación: no permitir lectura menor a la actual o a la última de mantenimiento
    if (
      lectura < (maquina.lecturaActual || 0) ||
      lectura < (maquina.ultimaLecturaMantenimiento || 0)
    ) {
      return res.status(400).json({
        mensaje:
          'La lectura no puede ser menor que la lectura actual ni que la última lectura de mantenimiento.'
      });
    }

    // Guardar nueva lectura
    const nuevaLectura = new Lectura({
      maquinaria,
      lectura,
      fecha,
      operador: req.body.operador || null,
      observaciones: req.body.observaciones || null
    });

    await nuevaLectura.save();

    // Actualizar la lectura actual de la maquinaria
    await Maquinaria.findByIdAndUpdate(maquinaria, {
      lecturaActual: lectura
    });

    res.status(201).json(nuevaLectura);
  } catch (error) {
    console.error('Error al crear lectura:', error);
    res.status(400).json({ mensaje: 'Error al crear lectura', error });
  }
};


// Obtener todas las lecturas
export const obtenerLecturas = async (req, res) => {
  try {
    const lecturas = await Lectura.find()
      .populate('maquinaria', 'tipo placa modelo')
      .sort({ fecha: -1 });
    res.json(lecturas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener lecturas', error });
  }
};

// Obtener lecturas por ID de maquinaria
export const obtenerLecturasPorMaquinaria = async (req, res) => {
  try {
    const lecturas = await Lectura.find({ maquinaria: req.params.id })
      .sort({ fecha: -1 });
    res.json(lecturas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener lecturas de maquinaria', error });
  }
};

// Obtener una lectura por ID
export const obtenerLecturaPorId = async (req, res) => {
  try {
    const lectura = await Lectura.findById(req.params.id)
      .populate('maquinaria', 'tipo placa modelo');
    if (!lectura) {
      return res.status(404).json({ mensaje: 'Lectura no encontrada' });
    }
    res.json(lectura);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener lectura', error });
  }
};

// Actualizar una lectura
export const actualizarLectura = async (req, res) => {
  try {
    const lecturaActualizada = await Lectura.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json(lecturaActualizada);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar lectura', error });
  }
};

// Eliminar una lectura
export const eliminarLectura = async (req, res) => {
  try {
    const lecturaEliminada = await Lectura.findByIdAndDelete(req.params.id);
    if (!lecturaEliminada) {
      return res.status(404).json({ mensaje: 'Lectura no encontrada' });
    }
    res.json({ mensaje: 'Lectura eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar lectura', error });
  }
};
