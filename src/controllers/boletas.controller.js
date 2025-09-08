import Boleta from "../models/boletas.model.js";
import { uploadImage } from "../utils/cloudinary.js";
import fs from "fs-extra";

// ✅ Función auxiliar para normalizar paginación
const getPagination = (page, limit, defaultLimit = 10) => {
  const pageNumber = Math.max(Number(page) || 1, 1);
  const limitNumber = Math.max(Number(limit) || defaultLimit, 1);
  const skip = (pageNumber - 1) * limitNumber;
  return { pageNumber, limitNumber, skip };
};

// 📌 Obtener boletas (con paginación y búsqueda por DNI)
export const getBoletas = async (req, res) => {
  try {
    const { page = 1, limit = 10, dni } = req.query;
    const { pageNumber, limitNumber, skip } = getPagination(page, limit, 10);

    const query = dni ? { dni: { $regex: dni, $options: "i" } } : {};

    const [boletas, total] = await Promise.all([
      Boleta.find(query)
        .skip(skip)
        .limit(limitNumber)
        .sort({ createdAt: -1 }),
      Boleta.countDocuments(query),
    ]);

    return res.json({
      total,
      page: pageNumber,
      limit: limitNumber,
      boletas,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener boletas", error: error.message });
  }
};

// 📌 Obtener boletas por DNI de usuario autenticado
export const getBoletasPorDni = async (req, res) => {
  const dni = req.user?.dni; // Obtiene el DNI del usuario autenticado
  const { page = 1, limit = 6 } = req.query;
  const { pageNumber, limitNumber, skip } = getPagination(page, limit, 6);

  try {
    const [boletas, total] = await Promise.all([
      Boleta.find({ dni })
        .skip(skip)
        .limit(limitNumber)
        .sort({ year: -1, mes: -1 }),
      Boleta.countDocuments({ dni }),
    ]);

    return res.json({
      total,
      page: pageNumber,
      limit: limitNumber,
      boletas,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener las boletas", error: error.message });
  }
};

// 📌 Crear nueva boleta
export const createBoletas = async (req, res) => {
  const { dni, mes, year } = req.body;

  // ✅ Validaciones básicas
  if (!dni || !mes || !year) {
    return res.status(400).json({ message: "Faltan campos obligatorios (dni, mes, year)" });
  }

  try {
    const newBoleta = new Boleta({ dni, mes, year });

    // ✅ Manejo de imagen
    const imageFile = Array.isArray(req.files?.image) ? req.files.image[0] : req.files?.image;
    if (imageFile) {
      const result = await uploadImage(imageFile.tempFilePath);
      newBoleta.image = {
        public_id: result.public_id,
        secure_url: result.secure_url,
      };
      if (await fs.pathExists(imageFile.tempFilePath)) {
        await fs.unlink(imageFile.tempFilePath);
      }
    }

    const savedBoleta = await newBoleta.save();
    return res.status(201).json({
      message: "Boleta creada exitosamente",
      boleta: savedBoleta,
    });
  } catch (error) {
    // ✅ Limpieza segura del archivo temporal si algo falla
    const imageFile = Array.isArray(req.files?.image) ? req.files.image[0] : req.files?.image;
    if (imageFile && await fs.pathExists(imageFile.tempFilePath)) {
      await fs.unlink(imageFile.tempFilePath);
    }
    return res.status(500).json({ message: "Error al crear boleta", error: error.message });
  }
};
