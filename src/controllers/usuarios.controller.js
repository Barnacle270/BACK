import Employee from '../models/employee.model.js';
import bcrypt from 'bcryptjs';
// Crear un nuevo usuario
export const crearUsuario = async (req, res) => {
  try {
    const { dni, name, email, password, role } = req.body;

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const nuevoEmpleado = new Employee({
      dni,
      name,
      email,
      password: hashedPassword,
      role
    });

    await nuevoEmpleado.save();
    res.status(201).json({ message: 'Usuario creado exitosamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Listar todos los usuarios
export const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Employee.find(); // puedes usar .find({ activo: true }) si solo quieres activos
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const actualizaciones = { ...req.body };

    // Si se envía contraseña y no está vacía, la hasheamos
    if (actualizaciones.password && actualizaciones.password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(actualizaciones.password, 10);
      actualizaciones.password = hashedPassword;
    } else {
      // Si no se envió o está vacía, eliminamos el campo para no sobreescribir
      delete actualizaciones.password;
    }

    await Employee.findByIdAndUpdate(id, actualizaciones, { new: true });
    res.json({ message: "Usuario actualizado correctamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Cambiar solo el rol del usuario
export const cambiarRol = async (req, res) => {
  try {
    const { id } = req.params;
    const { nuevoRol } = req.body;

    await Employee.findByIdAndUpdate(id, { role: nuevoRol });
    res.json({ message: 'Rol actualizado correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Desactivar usuario (sin eliminarlo)
export const desactivarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    await Employee.findByIdAndUpdate(id, { activo: false });
    res.json({ message: 'Usuario desactivado correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Activar usuario
export const activarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    await Employee.findByIdAndUpdate(id, { activo: true });
    res.json({ message: 'Usuario activado correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
