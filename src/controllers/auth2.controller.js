import Employee from "../models/employee.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createAccessToken } from "../libs/jwt.js";
import { TOKEN_SECRET } from "../config.js";

// Helper para setear la cookie
const setTokenCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction, // Solo secure en producción
    sameSite: isProduction ? 'None' : 'Lax', // None en prod, Lax en dev
    maxAge: 24 * 60 * 60 * 1000, // 1 día
  });
};

// REGISTRAR USUARIO
export const register = async (req, res) => {
  const { dni, name, password, role } = req.body;

  try {
    const userFound = await Employee.findOne({ dni });
    if (userFound) return res.status(400).json(["El DNI ya existe"]);

    const passwordHash = await bcrypt.hash(password, 10);

    const newEmployee = new Employee({
      dni,
      name,
      password: passwordHash,
      role,
    });

    const userSaved = await newEmployee.save();

    const token = await createAccessToken({
      id: userSaved._id,
      dni: userSaved.dni,
    });

    setTokenCookie(res, token);

    res.json({
      id: userSaved._id,
      dni: userSaved.dni,
      name: userSaved.name,
      role: userSaved.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { dni, password } = req.body;
    const userFound = await Employee.findOne({ dni });

    if (!userFound)
      return res.status(400).json(["El DNI o la contraseña son incorrectos"]);

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) {
      return res.status(400).json(["El DNI o la contraseña son incorrectos"]);
    }

    const token = await createAccessToken({
      id: userFound._id,
      name: userFound.name,
      dni: userFound.dni,
    });

    setTokenCookie(res, token);

    res.json({
      id: userFound._id,
      name: userFound.name,
      dni: userFound.dni,
      role: userFound.role,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// VERIFICAR TOKEN
export const verifyToken = async (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, TOKEN_SECRET, async (error, user) => {
    if (error) {
      return res.sendStatus(401);
    }

    const userFound = await Employee.findById(user.id);
    if (!userFound) {
      return res.sendStatus(401);
    }

    return res.json({
      id: userFound._id,
      name: userFound.name,
      dni: userFound.dni,
      role: userFound.role,
    });
  });
};

// LOGOUT
export const logout = (req, res) => {
  // Para logout, reseteamos la cookie vacía
  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie("token", "", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'None' : 'Lax',
    maxAge: 0, // Eliminar la cookie
  });

  return res.sendStatus(200);
};


