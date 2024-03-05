import Boleta from "../models/boletas.model.js";

import { uploadImage, deleteImage } from '../utils/cloudinary.js'
import fs from 'fs-extra'

export const getBoletas = async (req, res) => {
  try {
    const boletas = await Boleta.find();
    return res.json(boletas);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// Define tu controlador
export const getBoletasPorDni = async (req, res) => {
  const dni = req.user.dni; // Obtiene el DNI del usuario autenticado

  try {
    // Obtiene todas las boletas asociadas al usuario autenticado
    const boletas = await Boleta.find({ dni });

    res.json( boletas );
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las boletas', error: error.message });
  }
};


export const createBoletas = async (req, res) => {

  const { dni, mes, year } = req.body;

  try {

    const newBoleta = new Boleta({
      dni,
      mes,
      year,
    });

    if (req.files?.image) {
      const result = await uploadImage(req.files.image.tempFilePath)
      newBoleta.image = {
        public_id: result.public_id,
        secure_url: result.secure_url
      }
      await fs.unlink(req.files.image.tempFilePath)
    }
    const savedBoleta = await newBoleta.save();
    return res.json(savedBoleta);
  } catch (error) {
    if (req.files?.image) {
      await fs.unlink(req.files.image.tempFilePath)
    }
    return res.status(500).json({ message: error.message });
  }
};




export const updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedProduct)
      return res.status(404).json({ message: "Product Not Found" });
    return res.json(updatedProduct);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

