import Cliente from '../models/cliente.model.js';

// Crear un nuevo cliente
export const crearCliente = async (req, res) => {
  try {
    const { razonSocial, ruc } = req.body;

    if (!razonSocial || !ruc) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios.' });
    }

    const existe = await Cliente.findOne({ ruc });
    if (existe) {
      return res.status(409).json({ mensaje: 'Ya existe un cliente con ese RUC.' });
    }

    const nuevoCliente = new Cliente({ razonSocial, ruc });
    await nuevoCliente.save();

    res.status(201).json({
      mensaje: 'Cliente registrado correctamente',
      cliente: nuevoCliente
    });
  } catch (error) {
    console.error('Error al registrar cliente:', error);
    res.status(500).json({ mensaje: 'Error al registrar cliente' });
  }
};

// Obtener todos los clientes
export const obtenerClientes = async (req, res) => {
  try {
    const clientes = await Cliente.find().sort({ createdAt: -1 });
    res.json(clientes);
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({ mensaje: 'Error al obtener clientes' });
  }
};

// Obtener un cliente por ID
export const obtenerClientePorId = async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }
    res.json(cliente);
  } catch (error) {
    console.error('Error al obtener cliente por ID:', error);
    res.status(500).json({ mensaje: 'Error al obtener cliente' });
  }
};

// Actualizar cliente existente
export const actualizarCliente = async (req, res) => {
  try {
    const { razonSocial, ruc } = req.body;
    const { id } = req.params;

    const cliente = await Cliente.findById(id);
    if (!cliente) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }

    cliente.razonSocial = razonSocial || cliente.razonSocial;
    cliente.ruc = ruc || cliente.ruc;

    await cliente.save();

    res.json({
      mensaje: 'Cliente actualizado correctamente',
      cliente
    });
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    res.status(500).json({ mensaje: 'Error al actualizar cliente' });
  }
};
