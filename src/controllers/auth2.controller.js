import Employee from "../models/employee.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createAccessToken } from "../libs/jwt.js";
import { TOKEN_SECRET } from "../config.js";

// REGISTRAR USUARIO
export const register = async (req, res) => {
  const { dni, name, password, role } = req.body;

  try {
    const userFound = await Employee.findOne({ dni });
    if (userFound)
      return res.status(400).json(["El DNI ya existe"]);

    // Hashing the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Creating the user
    const newEmployee = new Employee({
      dni,
      name,
      password: passwordHash,
      role,
    });

    // Saving the user in the database
    const userSaved = await newEmployee.save();

    // Create access token
    const token = await createAccessToken({
      id: userSaved._id,
      dni: userSaved.dni,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Solo en producción con HTTPS
      sameSite: 'Lax', // Ajusta según tus necesidades
      maxAge: 24 * 60 * 60 * 1000 // 1 día en milisegundos
    });

    res.json({
      id: userSaved._id,
      dni: userSaved.dni,
      name: userSaved.name,
      role: userSaved.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error.message);
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

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Solo en producción con HTTPS
      sameSite: 'Lax', // Ajusta según tus necesidades
      maxAge: 24 * 60 * 60 * 1000 // 1 día en milisegundos
    });

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
// VERIFICAR TOKEN
export const verifyToken = async (req, res) => {
  const { token } = req.cookies;
  console.log('Verifying token:', token); // Log del token

  if (!token) {
    console.log('No token found');
    return res.sendStatus(401);
  }

  jwt.verify(token, TOKEN_SECRET, async (error, user) => {
    if (error) {
      console.log('Token verification error:', error.message);
      return res.sendStatus(401);
    }

    const userFound = await Employee.findById(user.id);
    if (!userFound) {
      console.log('User not found');
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
  res.cookie('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Solo en producción con HTTPS
    sameSite: 'Lax', // Ajusta según tus necesidades
    expires: new Date(0)
  });
  console.log('NODE_ENV:', process.env.NODE_ENV);
  return res.sendStatus(200);
};

// PROFILE
export const profile = async (req, res) => {
  try {
    const user = await Employee.find();
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};