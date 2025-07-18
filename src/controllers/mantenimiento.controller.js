import Mantenimiento from '../models/mantenimiento.model.js';
import Maquinaria from '../models/maquinaria.model.js';

// Crear mantenimiento con código automático

export const crearMantenimiento = async (req, res) => {
  try {
    const { maquinaria, lectura, fecha } = req.body;

    // Validar formato de fecha
    const fechaMantenimiento = new Date(fecha);
    if (isNaN(fechaMantenimiento)) {
      return res.status(400).json({
        mensaje: 'Fecha inválida',
        detalle: 'El formato de la fecha no es válido.'
      });
    }

    // Validar que no sea futura
    const hoy = new Date();
    if (fechaMantenimiento > hoy) {
      return res.status(400).json({
        mensaje: 'Fecha inválida',
        detalle: 'No puedes registrar un mantenimiento en una fecha futura.'
      });
    }

    // Buscar la maquinaria
    const maquinariaActual = await Maquinaria.findById(maquinaria);
    if (!maquinariaActual) {
      return res.status(404).json({
        mensaje: 'Maquinaria no encontrada'
      });
    }

    // Validar que la lectura sea un número positivo
    if (typeof lectura !== 'number' || lectura <= 0) {
      return res.status(400).json({
        mensaje: 'Lectura inválida',
        detalle: 'La lectura debe ser un número mayor a cero.'
      });
    }

    // Validar que la lectura no sea menor a la última registrada
    if (lectura < maquinariaActual.ultimaLecturaMantenimiento) {
      return res.status(400).json({
        mensaje: 'Lectura inválida',
        detalle: `La lectura ingresada (${lectura}) no puede ser menor a la última lectura de mantenimiento (${maquinariaActual.ultimaLecturaMantenimiento}).`
      });
    }

    // Validar que la lectura no supere la lectura actual
    if (lectura > maquinariaActual.lecturaActual) {
      return res.status(400).json({
        mensaje: 'Lectura inválida',
        detalle: `La lectura ingresada (${lectura}) no puede ser mayor que la lectura actual (${maquinariaActual.lecturaActual}) de la maquinaria.`
      });
    }

    // Validar si ya hay un mantenimiento en la misma fecha para la misma maquinaria
    const yaRegistrado = await Mantenimiento.findOne({ maquinaria, fecha });
    if (yaRegistrado) {
      return res.status(400).json({
        mensaje: 'Mantenimiento duplicado',
        detalle: 'Ya existe un mantenimiento registrado para esta maquinaria en esa fecha.'
      });
    }

    // Validar que la nueva fecha no sea anterior al último mantenimiento registrado
    const ultimo = await Mantenimiento.findOne({ maquinaria }).sort({ fecha: -1 });
    if (ultimo && fechaMantenimiento < new Date(ultimo.fecha)) {
      return res.status(400).json({
        mensaje: 'Fecha inválida',
        detalle: `La fecha del mantenimiento (${fecha}) no puede ser anterior al último mantenimiento registrado (${ultimo.fecha}).`
      });
    }

    // === Generar código ===
    const año = fechaMantenimiento.getFullYear();
    const cantidad = await Mantenimiento.countDocuments({
      fecha: {
        $gte: new Date(`${año}-01-01T00:00:00.000Z`),
        $lte: new Date(`${año}-12-31T23:59:59.999Z`)
      }
    });
    const codigo = `MANT-${String(cantidad + 1).padStart(4, '0')}-${año}`;

    // Crear el nuevo mantenimiento
    const nuevoMantenimiento = new Mantenimiento({
      ...req.body,
      codigo
    });
    await nuevoMantenimiento.save();

    // Actualizar los campos en la maquinaria
    await Maquinaria.findByIdAndUpdate(maquinaria, {
      ultimaLecturaMantenimiento: lectura,
      ultimaFechaMantenimiento: fecha
    });

    res.status(201).json(nuevoMantenimiento);

  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al registrar mantenimiento',
      detalle: error.message || error
    });
  }
};


// Obtener todos los mantenimientos
export const obtenerMantenimientos = async (req, res) => {
  try {
    const mantenimientos = await Mantenimiento.find()
      .populate('maquinaria', 'tipo placa modelo')
      .sort({ fecha: -1 });
    res.json(mantenimientos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener mantenimientos', error });
  }
};

// Obtener mantenimiento por ID
export const obtenerMantenimientoPorId = async (req, res) => {
  try {
    const mantenimiento = await Mantenimiento.findById(req.params.id)
      .populate('maquinaria', 'tipo placa modelo');
    if (!mantenimiento) {
      return res.status(404).json({ mensaje: 'Mantenimiento no encontrado' });
    }
    res.json(mantenimiento);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener mantenimiento', error });
  }
};

// Obtener mantenimientos por maquinaria
export const obtenerMantenimientosPorMaquinaria = async (req, res) => {
  try {
    const mantenimientos = await Mantenimiento.find({ maquinaria: req.params.id })
      .sort({ fecha: -1 });
    res.json(mantenimientos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener mantenimientos', error });
  }
};

// Actualizar mantenimiento
export const actualizarMantenimiento = async (req, res) => {
  try {
    const mantenimientoActualizado = await Mantenimiento.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json(mantenimientoActualizado);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar mantenimiento', error });
  }
};

// Eliminar mantenimiento
export const eliminarMantenimiento = async (req, res) => {
  try {
    const mantenimientoEliminado = await Mantenimiento.findByIdAndDelete(req.params.id);
    if (!mantenimientoEliminado) {
      return res.status(404).json({ mensaje: 'Mantenimiento no encontrado' });
    }
    res.json({ mensaje: 'Mantenimiento eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar mantenimiento', error });
  }
};
