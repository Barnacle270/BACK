import Conductor from "../models/conductor.model.js";

export const getConductor = async (req, res) => {
  try {
    const conductor = await Conductor.find();
    res.json(conductor);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createConductor = async (req, res) => {
  try {
    const { nombrec } = req.body;
    const newConductor = new Conductor({ nombrec });
    const savedConductor = await newConductor.save();
    return res.status(201).json({ savedConductor });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};