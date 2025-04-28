import Boleta from "../models/boletas.model.js";
import { uploadImage } from "../utils/cloudinary.js";
import fs from "fs-extra";

// Obtener boletas (ahora con paginación)
export const getBoletas = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Defaults: página 1, 10 boletas

    const boletas = await Boleta.find()
      .skip((page - 1) * limit) // Salta documentos anteriores
      .limit(Number(limit)) // Limita documentos
      .sort({ createdAt: -1 }); // Opcional: ordenar por creación (más nuevas primero)

    const total = await Boleta.countDocuments(); // Total de boletas para frontend

    return res.json({
      total,
      page: Number(page),
      limit: Number(limit),
      boletas,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Obtener boletas por DNI de usuario autenticado
export const getBoletasPorDni = async (req, res) => {
  const dni = req.user.dni; // Obtiene el DNI del usuario autenticado
  const { page = 1, limit = 6 } = req.query;

  try {
    const skip = (page - 1) * limit;

    const [boletas, total] = await Promise.all([
      Boleta.find({ dni })
        .skip(Number(skip))
        .limit(Number(limit))
        .sort({ year: -1, mes: -1 }),
      Boleta.countDocuments({ dni }),
    ]);

    res.json({
      total,
      page: Number(page),
      limit: Number(limit),
      boletas,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las boletas', error: error.message });
  }
};

// Crear nueva boleta
export const createBoletas = async (req, res) => {
  const { dni, mes, year } = req.body;

  try {
    const newBoleta = new Boleta({
      dni,
      mes,
      year,
    });

    if (req.files?.image) {
      const result = await uploadImage(req.files.image.tempFilePath);
      newBoleta.image = {
        public_id: result.public_id,
        secure_url: result.secure_url,
      };
      await fs.unlink(req.files.image.tempFilePath); // Elimina el archivo temporal
    }

    const savedBoleta = await newBoleta.save();
    return res.json(savedBoleta);
  } catch (error) {
    if (req.files?.image) {
      await fs.unlink(req.files.image.tempFilePath);
    }
    return res.status(500).json({ message: error.message });
  }
};
