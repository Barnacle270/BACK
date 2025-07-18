import MantenimientoRealizado from '../models/mantenimientoRealizado.model.js';
import Maquinaria from '../models/maquinaria.model.js';

// Crear mantenimiento realizado
export const crearMantenimiento = async (req, res) => {
  try {
    const {
      maquinaria,
      tipoMantenimiento,
      lectura,
      unidad,
      fecha,
      observaciones,
      realizadoPor
    } = req.body;

    // Validar maquinaria
    const maquina = await Maquinaria.findById(maquinaria);
    if (!maquina) {
      return res.status(404).json({ error: 'Maquinaria no encontrada' });
    }

    // Validar tipo de mantenimiento dentro de maquinaria
    const mantenimiento = maquina.mantenimientos.find(
      m => m.nombre === tipoMantenimiento && m.unidad === unidad
    );

    if (!mantenimiento) {
      return res.status(400).json({
        error: 'El tipo de mantenimiento no está registrado en esta maquinaria o la unidad no coincide'
      });
    }

    // Validar que la lectura sea mayor o igual a la última
    if (lectura < (mantenimiento.ultimaLectura || 0)) {
      return res.status(400).json({
        error: `La lectura es menor que la última registrada para este mantenimiento (${mantenimiento.ultimaLectura})`
      });
    }

    // Crear el registro de mantenimiento
    const nuevoMantenimiento = new MantenimientoRealizado({
      maquinaria,
      tipoMantenimiento,
      lectura,
      unidad,
      fecha,
      observaciones,
      realizadoPor
    });

    await nuevoMantenimiento.save();

    // Actualizar el mantenimiento correspondiente en la maquinaria
    mantenimiento.ultimaLectura = lectura;
    mantenimiento.ultimaFecha = fecha || new Date();

    await maquina.save();

    res.status(201).json(nuevoMantenimiento);
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar mantenimiento', detalle: error.message });
  }
};

// Obtener mantenimientos por maquinaria
export const obtenerMantenimientosPorMaquinaria = async (req, res) => {
  try {
    const { maquinariaId } = req.params;

    const mantenimientos = await MantenimientoRealizado.find({ maquinaria: maquinariaId })
      .sort({ fecha: -1 });

    res.json(mantenimientos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener mantenimientos', detalle: error.message });
  }
};

// controllers/mantenimiento.controller.js (agrega esta función)

export const obtenerMantenimientosProximos = async (req, res) => {
  try {
    const maquinarias = await Maquinaria.find();

    const mantenimientosProximos = [];

    maquinarias.forEach(maquina => {
      const { lecturaActual, mantenimientos } = maquina;

      if (!mantenimientos || !Array.isArray(mantenimientos)) return;

      mantenimientos.forEach(m => {
        const ultima = m.ultimaLectura || 0;
        const frecuencia = m.frecuencia;

        if (!frecuencia || frecuencia === 0) return;

        const diferencia = lecturaActual - ultima;
        const porcentaje = (diferencia / frecuencia) * 100;

        if (porcentaje >= 80) {
          mantenimientosProximos.push({
            maquinaria: {
              id: maquina._id,
              tipo: maquina.tipo,
              placa: maquina.placa,
              modelo: maquina.modelo,
              lecturaActual: maquina.lecturaActual
            },
            mantenimiento: {
              nombre: m.nombre,
              unidad: m.unidad,
              frecuencia: m.frecuencia,
              ultimaLectura: m.ultimaLectura || 0,
              ultimaFecha: m.ultimaFecha || null,
              porcentajeUso: Math.round(porcentaje)
            }
          });
        }
      });
    });

    res.json(mantenimientosProximos);
  } catch (error) {
    console.error('Error en obtenerMantenimientosProximos:', error);
    res.status(500).json({ error: 'Error al calcular mantenimientos próximos', detalle: error.message });
  }
};