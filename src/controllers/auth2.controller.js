import Employee from "../models/employee.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createAccessToken } from "../libs/jwt.js";
import { TOKEN_SECRET } from "../config.js";

// Helper para setear la cookie del token
const setTokenCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'None' : 'Lax',
    maxAge: 24 * 60 * 60 * 1000, // 1 día
  });
};

// REGISTRAR USUARIO
export const register = async (req, res) => {
  const { dni, name, password, role } = req.body;

  try {
    const existingUser = await Employee.findOne({ dni });
    if (existingUser) return res.status(400).json(["El DNI ya está registrado"]);

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Employee({
      dni,
      name,
      password: hashedPassword,
      role,
    });

    const savedUser = await newUser.save();

    const token = await createAccessToken({
      id: savedUser._id,
      dni: savedUser.dni,
    });

    setTokenCookie(res, token);

    res.json({
      id: savedUser._id,
      dni: savedUser.dni,
      name: savedUser.name,
      role: savedUser.role,
    });
  } catch (error) {
    console.error("Error en register:", error.message);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// LOGIN
// LOGIN
export const login = async (req, res) => {
  try {
    const { dni, password } = req.body;

    const user = await Employee.findOne({ dni });
    if (!user) return res.status(400).json(["DNI o contraseña incorrectos"]);

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json(["DNI o contraseña incorrectos"]);
    }

    // Incluir role en el token
    const token = await createAccessToken({
      id: user._id,
      name: user.name,
      dni: user.dni,
      role: user.role,  // Aquí se agrega el role
    });

    setTokenCookie(res, token);

    res.json({
      id: user._id,
      name: user.name,
      dni: user.dni,
      role: user.role,
    });
  } catch (error) {
    console.error("Error en login:", error.message);
    res.status(500).json({ message: "Error del servidor" });
  }
};
// VERIFICAR TOKEN
export const verifyToken = async (req, res) => {
  const { token } = req.cookies;

  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, TOKEN_SECRET);
    const user = await Employee.findById(decoded.id);
    if (!user) return res.sendStatus(401);

    res.json({
      id: user._id,
      name: user.name,
      dni: user.dni,
      role: user.role,
    });
  } catch (error) {
    console.error("Token inválido:", error.message);
    res.sendStatus(401);
  }
};

// LOGOUT
export const logout = (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie("token", "", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'None' : 'Lax',
    maxAge: 0,
  });

  res.sendStatus(200);
};

// PROFILE (requiere req.user de middleware)
export const profile = async (req, res) => {
  try {
    const user = await Employee.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({
      id: user._id,
      dni: user.dni,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    console.error("Error en profile:", error.message);
    res.status(500).json({ message: "Error del servidor" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await Employee.find({}, "_id name dni role"); // solo datos necesarios
    res.json(users);
  } catch (error) {
    // Ahora mostramos tanto el mensaje como el stack completo del error
    console.error("Error al obtener usuarios:", error.message);
    console.error(error.stack);  // Esto imprimirá el stack trace completo
    res.status(500).json({ message: "Error al obtener usuarios", error: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  try {
    const user = await Employee.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({ message: "Rol actualizado correctamente", user });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el rol" });
  }
};