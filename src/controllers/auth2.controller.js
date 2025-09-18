import Employee from "../models/employee.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET, REFRESH_SECRET } from "../config.js";
import { setTokenCookie, clearTokenCookie } from "../libs/cookies.js";

// helpers internos
const createAccessToken = (payload) => {
  return jwt.sign(payload, TOKEN_SECRET, { expiresIn: "15m" }); // corto
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" }); // largo
};

// REGISTRAR USUARIO
export const register = async (req, res) => {
  const { dni, name, email, password, role } = req.body;
  try {
    const userFound = await Employee.findOne({ dni });
    if (userFound) return res.status(400).json(["El DNI ya existe"]);

    const passwordHash = await bcrypt.hash(password, 10);

    const newEmployee = new Employee({
      dni,
      name,
      email, // 👈 guardamos email
      password: passwordHash,
      role,
    });
    const userSaved = await newEmployee.save();

    const accessToken = createAccessToken({
      id: userSaved._id,
      dni: userSaved.dni,
      role: userSaved.role,
    });
    const refreshToken = createRefreshToken({
      id: userSaved._id,
      dni: userSaved.dni,
      role: userSaved.role,
    });

    setTokenCookie(res, refreshToken); // refresh en cookie segura

    res.json({
      user: {
        id: userSaved._id,
        dni: userSaved.dni,
        name: userSaved.name,
        role: userSaved.role,
        email: userSaved.email, // 👈 devolvemos email
      },
      accessToken,
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
    if (!isMatch)
      return res.status(400).json(["El DNI o la contraseña son incorrectos"]);

    const accessToken = createAccessToken({
      id: userFound._id,
      dni: userFound.dni,
      role: userFound.role,
    });
    const refreshToken = createRefreshToken({
      id: userFound._id,
      dni: userFound.dni,
      role: userFound.role,
    });

    setTokenCookie(res, refreshToken);

    res.json({
      user: {
        id: userFound._id,
        name: userFound.name,
        dni: userFound.dni,
        role: userFound.role,
        email: userFound.email, // 👈 devolvemos email
      },
      accessToken,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// REFRESH ACCESS TOKEN
export const refresh = (req, res) => {
  const refreshToken = req.cookies?.token;
  if (!refreshToken)
    return res.status(401).json({ message: "No refresh token" });

  jwt.verify(refreshToken, REFRESH_SECRET, async (error, user) => {
    if (error) {
      clearTokenCookie(res);
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const userFound = await Employee.findById(user.id);
    if (!userFound) {
      clearTokenCookie(res);
      return res.status(403).json({ message: "User not found" });
    }

    const newAccessToken = createAccessToken({
      id: userFound._id,
      dni: userFound.dni,
      role: userFound.role,
    });
    res.json({ accessToken: newAccessToken });
  });
};

// VERIFY (requiere access token en header → authRequired)
export const verifyToken = async (req, res) => {
  const userFound = await Employee.findById(req.user.id);
  if (!userFound)
    return res.status(401).json({ message: "User not found" });

  return res.json({
    id: userFound._id,
    name: userFound.name,
    dni: userFound.dni,
    role: userFound.role,
    email: userFound.email, // 👈 devolvemos email
  });
};

// LOGOUT
export const logout = (req, res) => {
  clearTokenCookie(res);
  return res.sendStatus(200);
};