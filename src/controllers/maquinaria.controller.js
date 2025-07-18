import Maquinaria from '../models/maquinaria.model.js';

// Crear nueva maquinaria
export const crearMaquinaria = async (req, res) => {
  try {
    const {
      tipo,
      marca,
      modelo,
      numeroSerie,
      placa,
      anio,
      ubicacion,
      unidadMedida,
      lecturaActual = 0,
      mantenimientoCada,
      ultimaLecturaMantenimiento = 0,
      ultimaFechaMantenimiento = null,
      estado = 'ACTIVO'
    } = req.body;

    // Validación básica
    if (!tipo || !modelo || !unidadMedida || !mantenimientoCada) {
      return res.status(400).json({
        mensaje: 'Faltan campos obligatorios: tipo, modelo, unidad de medida o mantenimientoCada.'
      });
    }

    const nuevaMaquinaria = new Maquinaria({
      tipo,
      marca,
      modelo,
      numeroSerie,
      placa,
      anio,
      ubicacion,
      unidadMedida,
      lecturaActual,
      mantenimientoCada,
      ultimaLecturaMantenimiento,
      ultimaFechaMantenimiento,
      estado
    });

    const maquinariaGuardada = await nuevaMaquinaria.save();
    return res.status(201).json(maquinariaGuardada);

  } catch (error) {
    // Error por duplicado de clave única
    if (error.code === 11000) {
      const campo = Object.keys(error.keyValue)[0];
      const valor = error.keyValue[campo];
      return res.status(400).json({
        mensaje: `Ya existe una maquinaria con el mismo '${campo}': ${valor}.`
      });
    }

    // Otro tipo de error
    console.error('Error al crear maquinaria:', error);
    return res.status(500).json({
      mensaje: 'Error interno al crear maquinaria',
      detalle: error.message
    });
  }
};


// Obtener todas las maquinarias
export const obtenerMaquinarias = async (req, res) => {
  try {
    const maquinarias = await Maquinaria.find().sort({ createdAt: -1 });
    res.json(maquinarias);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener maquinarias',
      detalle: error.message
    });
  }
};

// Obtener maquinaria por ID
export const obtenerMaquinariaPorId = async (req, res) => {
  try {
    const maquinaria = await Maquinaria.findById(req.params.id);
    if (!maquinaria) {
      return res.status(404).json({ mensaje: 'Maquinaria no encontrada' });
    }
    res.json(maquinaria);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener maquinaria',
      detalle: error.message
    });
  }
};

// Actualizar maquinaria
export const actualizarMaquinaria = async (req, res) => {
  try {
    const maquinariaActualizada = await Maquinaria.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json(maquinariaActualizada);
  } catch (error) {
    res.status(400).json({
      mensaje: 'Error al actualizar maquinaria',
      detalle: error.message
    });
  }
};

// Eliminar maquinaria
export const eliminarMaquinaria = async (req, res) => {
  try {
    const maquinariaEliminada = await Maquinaria.findByIdAndDelete(req.params.id);
    if (!maquinariaEliminada) {
      return res.status(404).json({ mensaje: 'Maquinaria no encontrada' });
    }
    res.json({ mensaje: 'Maquinaria eliminada correctamente' });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al eliminar maquinaria',
      detalle: error.message
    });
  }
};

export const obtenerEquiposConMantenimientoPendiente = async (req, res) => {
  try {
    const maquinarias = await Maquinaria.find();

    const equiposPendientes = maquinarias.filter((m) => {
      const lecturaActual = Number(m.lecturaActual ?? 0);
      const ultimaLectura = Number(m.ultimaLecturaMantenimiento ?? 0);
      const frecuencia = Number(m.mantenimientoCada ?? 0);

      return !isNaN(lecturaActual) && !isNaN(ultimaLectura) && !isNaN(frecuencia)
        && lecturaActual >= ultimaLectura + frecuencia;
    });

    res.json(equiposPendientes);
  } catch (error) {
    console.error('❌ Error al obtener equipos con mantenimiento pendiente:', error);
    res.status(500).json({ mensaje: 'Error interno', detalle: error.message });
  }
};