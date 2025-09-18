import Employee from "../models/employee.model.js";
import bcrypt from "bcryptjs";

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
      role,
    });

    await nuevoEmpleado.save();
    res.status(201).json({ message: "Usuario creado exitosamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Listar todos los usuarios
export const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Employee.find().select("-password"); // nunca devolver hash
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar datos de un usuario (para administradores)
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

    const updated = await Employee.findByIdAndUpdate(id, actualizaciones, {
      new: true,
    }).select("-password");

    res.json({ message: "Usuario actualizado correctamente", user: updated });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Cambiar solo el rol del usuario
export const cambiarRol = async (req, res) => {
  try {
    const { id } = req.params;
    const { nuevoRol } = req.body;

    const rolesValidos = [
      "User",
      "Administrador",
      "Superadministrador",
      "Coordinador",
      "Almacen",
    ];

    if (!rolesValidos.includes(nuevoRol)) {
      return res.status(400).json({
        error: `Rol inválido. Debe ser uno de: ${rolesValidos.join(", ")}`,
      });
    }

    const userUpdated = await Employee.findByIdAndUpdate(
      id,
      { role: nuevoRol },
      { new: true }
    ).select("-password");

    if (!userUpdated) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ message: "Rol actualizado correctamente", user: userUpdated });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Desactivar usuario (sin eliminarlo)
export const desactivarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    await Employee.findByIdAndUpdate(id, { activo: false });
    res.json({ message: "Usuario desactivado correctamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Activar usuario
export const activarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    await Employee.findByIdAndUpdate(id, { activo: true });
    res.json({ message: "Usuario activado correctamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Nuevo: actualizar perfil propio (correo y/o contraseña)
export const actualizarPerfil = async (req, res) => {
  try {
    const userId = req.user.id; // viene del token JWT
    const { email, password } = req.body;
    const actualizaciones = {};

    if (email) actualizaciones.email = email;

    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      actualizaciones.password = hashedPassword;
    }

    const updatedUser = await Employee.findByIdAndUpdate(
      userId,
      actualizaciones,
      { new: true }
    ).select("-password");

    res.json({ message: "Perfil actualizado correctamente", user: updatedUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
