
import Reportmaq from "../models/reportmaq.model.js";


export const getReportmaq = async (req, res) => {
  try {
    const tasks = await Reportmaq.find({ user : req.user.id }).populate("user");
    res.json(tasks);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const createReportmaq = async (req, res) => {
  try {
    const {
      numeroControl,
      fecha,
      cliente,
      almacen,
      maquina,
      operador,
      turno,
      serviceType,
      inicio,
      fin,
      total,
      tarifa,
      payO,
      paymentC,
      estate,
      userId = req.user.id,
    } = req.body;

    // Verificar si ya existe un reporte con el mismo numeroControl
    const existingReport = await Reportmaq.findOne({ numeroControl });

    if (existingReport) {
      return res.status(400).json({ message: "El numero de control ya existe." });
    }

    const newReportmaq = new Reportmaq({
      numeroControl,
      fecha,
      cliente,
      almacen,
      maquina,
      operador,
      turno,
      serviceType,
      inicio,
      fin,
      total,
      tarifa,
      payO,
      paymentC,
      estate,
      user: userId,
    });

    const savedReportmaq = await newReportmaq.save();

    return res.status(201).json({ savedReportmaq });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
