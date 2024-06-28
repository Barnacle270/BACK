
import e from "express";
import Transporte from "../models/transporte.model.js";


 export const getTransporte = async (req, res) => {
  try {
    const transporte = await Transporte.find();
    res.json(transporte);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export const createTransporte = async (req, res) => {
  try {
    const {
      fechat,
      cliente,
      puntoPartida,
      puntoDestino,
      guiaRemitente,
      guiaTransportista,
      placa,
      conductor,
      tipoServicio,
      detalle,
      almacenDev,
      comprobanteDev,
      estado,
      turno,
      planilla,
      combustible,
    } = req.body;

    const newTransporte = new Transporte({
      fechat,
      cliente,
      puntoPartida,
      puntoDestino,
      guiaRemitente,
      guiaTransportista,
      placa,
      conductor,
      tipoServicio,
      detalle,
      almacenDev,
      comprobanteDev,
      estado,
      turno,
      planilla,
      combustible,
    });

    console.log(newTransporte);

    const savedTransporte = await newTransporte.save();

    return res.status(201).json({ savedTransporte });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
