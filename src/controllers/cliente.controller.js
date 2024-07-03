import Cliente from "../models/cliente.model.js";

export const getCliente = async (req, res) => {
  try {
    const cliente = await Cliente.find();
    res.json(cliente);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createCliente = async (req, res) => {
  try {
    const { rz } = req.body;
    const newCliente = new Cliente({ rz });
    const savedCliente = await newCliente.save();
    return res.status(201).json({ savedCliente });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

