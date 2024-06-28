
import Camiones from "../models/camiones.model.js";

 export const getCamiones = async (req, res) => {
  try {
    const camiones = await Camiones.find();
    res.json(camiones);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export const createCamiones = async (req, res) => {
  try {
    const {
      placa,
    } = req.body;

    const newCamiones = new Camiones({
      placa,
    });

    console.log(newCamiones);

    const savedCamiones = await newCamiones.save();

    return res.status(201).json({ savedCamiones });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
