import Mantenimiento from '../models/mantenimiento.model.js';
import Maquinaria from '../models/maquinaria.model.js';

// Crear mantenimiento
export const crearMantenimiento = async (req, res) => {
  try {
    const {
      maquinaria,
      tipo,
      fecha,
      lectura,
      repuestos = [],
      responsable,
      observaciones
    } = req.body;

    // Validación básica
    if (!maquinaria || !tipo || !fecha || typeof lectura !== 'number') {
      return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
    }

    if (!['PREVENTIVO', 'CORRECTIVO'].includes(tipo)) {
      return res.status(400).json({ mensaje: 'Tipo de mantenimiento inválido' });
    }

    const fechaMantenimiento = new Date(fecha);
    const hoy = new Date();
    if (isNaN(fechaMantenimiento) || fechaMantenimiento > hoy) {
      return res.status(400).json({ mensaje: 'Fecha inválida' });
    }

    const maquinariaActual = await Maquinaria.findById(maquinaria);
    if (!maquinariaActual) {
      return res.status(404).json({ mensaje: 'Maquinaria no encontrada' });
    }

    const ultimaLectura = typeof maquinariaActual.ultimaLecturaMantenimiento === 'number'
      ? maquinariaActual.ultimaLecturaMantenimiento
      : 0;

    const lecturaActual = typeof maquinariaActual.lecturaActual === 'number'
      ? maquinariaActual.lecturaActual
      : 0;

    if (lectura <= 0) {
      return res.status(400).json({ mensaje: 'La lectura debe ser mayor a cero.' });
    }

    if (lectura <= ultimaLectura) {
      return res.status(400).json({
        mensaje: `La lectura debe ser mayor a la última registrada (${ultimaLectura}).`
      });
    }

    if (lectura <= lecturaActual) {
      return res.status(400).json({
        mensaje: `La lectura del mantenimiento debe ser mayor a la lectura actual de la máquina (${lecturaActual}).`
      });
    }

    const yaExiste = await Mantenimiento.findOne({ maquinaria, fecha: fechaMantenimiento });
    if (yaExiste) {
      return res.status(400).json({
        mensaje: 'Ya existe un mantenimiento registrado en esa fecha.'
      });
    }

    const ultimo = await Mantenimiento.findOne({ maquinaria }).sort({ fecha: -1 });
    if (ultimo && fechaMantenimiento < new Date(ultimo.fecha)) {
      return res.status(400).json({
        mensaje: 'La fecha no puede ser anterior al último mantenimiento registrado.'
      });
    }

    // Generar código correlativo
    const año = fechaMantenimiento.getFullYear();
    const cantidad = await Mantenimiento.countDocuments({
      fecha: {
        $gte: new Date(`${año}-01-01`),
        $lte: new Date(`${año}-12-31`)
      }
    });
    const codigo = `MANT-${String(cantidad + 1).padStart(4, '0')}-${año}`;

    // Crear mantenimiento
    const nuevo = await Mantenimiento.create({
      maquinaria,
      tipo,
      fecha: fechaMantenimiento,
      lectura,
      repuestos,
      responsable,
      observaciones,
      codigo
    });

    // Actualizar maquinaria
    await Maquinaria.findByIdAndUpdate(maquinaria, {
      ultimaLecturaMantenimiento: lectura,
      ultimaFechaMantenimiento: fechaMantenimiento
    });

    res.status(201).json(nuevo);

  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al registrar mantenimiento',
      detalle: error.message
    });
  }
};// Obtener todos los mantenimientos
export const obtenerMantenimientos = async (req, res) => {
  try {
    const mantenimientos = await Mantenimiento.find()
      .populate('maquinaria', 'tipo placa modelo')
      .sort({ fecha: -1 });
    res.json(mantenimientos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener mantenimientos', detalle: error.message });
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
    res.status(500).json({ mensaje: 'Error al obtener mantenimiento', detalle: error.message });
  }
};

// Obtener por maquinaria
export const obtenerMantenimientosPorMaquinaria = async (req, res) => {
  try {
    const { id } = req.params;
    const mantenimientos = await Mantenimiento.find({ maquinaria: id })
      .sort({ fecha: -1 });
    res.json(mantenimientos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener mantenimientos', detalle: error.message });
  }
};

// Actualizar mantenimiento
export const actualizarMantenimiento = async (req, res) => {
  try {
    const actualizado = await Mantenimiento.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar mantenimiento', detalle: error.message });
  }
};

// Eliminar mantenimiento
export const eliminarMantenimiento = async (req, res) => {
  try {
    const eliminado = await Mantenimiento.findByIdAndDelete(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ mensaje: 'Mantenimiento no encontrado' });
    }
    res.json({ mensaje: 'Mantenimiento eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar mantenimiento', detalle: error.message });
  }
};


