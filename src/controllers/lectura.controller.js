import Lectura from '../models/lectura.model.js';
import Maquinaria from '../models/maquinaria.model.js';

// Crear nueva lectura
export const crearLectura = async (req, res) => {
  try {
    const { maquinaria, lectura, fecha, operador, observaciones } = req.body;

    if (!maquinaria || typeof lectura !== 'number' || !fecha) {
      return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
    }

    const fechaLectura = new Date(fecha);
    const hoy = new Date();
    if (isNaN(fechaLectura) || fechaLectura > hoy) {
      return res.status(400).json({ mensaje: 'Fecha inválida o futura' });
    }

    const maquina = await Maquinaria.findById(maquinaria);
    if (!maquina) {
      return res.status(404).json({ mensaje: 'Maquinaria no encontrada' });
    }

    const lecturaActual = maquina.lecturaActual ?? 0;
    const ultimaMantenimiento = maquina.ultimaLecturaMantenimiento ?? 0;

    if (lectura <= 0) {
      return res.status(400).json({ mensaje: 'La lectura debe ser mayor a cero.' });
    }

    if (lectura < lecturaActual || lectura < ultimaMantenimiento) {
      return res.status(400).json({
        mensaje: `La lectura no puede ser menor que la lectura actual (${lecturaActual}) ni que la última lectura de mantenimiento (${ultimaMantenimiento}).`
      });
    }

    // 🛑 Validar si ya existe una lectura ese mismo día
    const fechaInicio = new Date(fechaLectura);
    fechaInicio.setHours(0, 0, 0, 0);
    const fechaFin = new Date(fechaLectura);
    fechaFin.setHours(23, 59, 59, 999);

    const lecturaExistente = await Lectura.findOne({
      maquinaria,
      fecha: { $gte: fechaInicio, $lte: fechaFin }
    });

    if (lecturaExistente) {
      return res.status(400).json({
        mensaje: 'Ya existe una lectura registrada para esta maquinaria en la misma fecha.'
      });
    }

    // 🔒 Validar que la fecha no sea anterior a la última lectura registrada
    const ultimaLecturaRegistrada = await Lectura.findOne({ maquinaria }).sort({ fecha: -1 });

    if (ultimaLecturaRegistrada && fechaLectura < ultimaLecturaRegistrada.fecha) {
      return res.status(400).json({
        mensaje: `No se puede registrar una lectura con una fecha anterior a la última lectura registrada (${ultimaLecturaRegistrada.fecha.toLocaleDateString()}).`
      });
    }

    const nuevaLectura = new Lectura({
      maquinaria,
      lectura,
      fecha: fechaLectura,
      operador: operador || null,
      observaciones: observaciones || null
    });

    await nuevaLectura.save();

    await Maquinaria.findByIdAndUpdate(maquinaria, {
      lecturaActual: lectura
    });

    res.status(201).json(nuevaLectura);

  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al crear lectura',
      detalle: error.message
    });
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
    res.status(500).json({ mensaje: 'Error al obtener lecturas', detalle: error.message });
  }
};

// Obtener lecturas por maquinaria
export const obtenerLecturasPorMaquinaria = async (req, res) => {
  try {
    const lecturas = await Lectura.find({ maquinaria: req.params.id })
      .sort({ fecha: -1 });
    res.json(lecturas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener lecturas de maquinaria', detalle: error.message });
  }
};

// Obtener lectura por ID
export const obtenerLecturaPorId = async (req, res) => {
  try {
    const lectura = await Lectura.findById(req.params.id)
      .populate('maquinaria', 'tipo placa modelo');
    if (!lectura) {
      return res.status(404).json({ mensaje: 'Lectura no encontrada' });
    }
    res.json(lectura);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener lectura', detalle: error.message });
  }
};

// Actualizar lectura
export const actualizarLectura = async (req, res) => {
  try {
    const lecturaActualizada = await Lectura.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json(lecturaActualizada);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar lectura', detalle: error.message });
  }
};

// Eliminar lectura
export const eliminarLectura = async (req, res) => {
  try {
    const lecturaEliminada = await Lectura.findByIdAndDelete(req.params.id);
    if (!lecturaEliminada) {
      return res.status(404).json({ mensaje: 'Lectura no encontrada' });
    }
    res.json({ mensaje: 'Lectura eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar lectura', detalle: error.message });
  }
};
