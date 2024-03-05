import Employee from "../models/employee.model.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createAccessToken } from "../libs/jwt.js";
import { TOKEN_SECRET } from "../config.js";



//REGISTRAR USUARIO
export const register = async (req, res) => {

  const { dni, name, password, role } = req.body;

  try {
    const userFound = await Employee.findOne({ dni });
    if (userFound)
      return res.status(400).json(["The dni already exists"],
      );

    // hashing the password
    const passwordHash = await bcrypt.hash(password, 10);

    // creating the user
    const newEmployee = new Employee({
      dni,
      name,
      password: passwordHash,
      role,
    });

    // saving the user in the database
    const userSaved = await newEmployee.save();

    // create access token
    const token = await createAccessToken({
      id: userSaved._id,
      dni: userSaved.dni,
    });

    res.cookie("token", token, {
      secure: true,
      sameSite: "none",
    });

    res.json({
      id: userSaved._id,
      dni: userSaved.dni,
      name: userSaved.name,
      role: userSaved.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error.message)
  }
};

//LOGIN

export const login = async (req, res) => {
  try {
    const { dni, password } = req.body;
    const userFound = await Employee.findOne({ dni });

    if (!userFound)
      return res.status(400).json(["El dni o la contraseña son incorrectos"],
      );

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) {
      return res.status(400).json(["El dni o la contraseña son incorrectos"],
      );
    }

    const token = await createAccessToken({
      id: userFound._id,
      name: userFound.name,
      dni: userFound.dni,
    });

    res.cookie("token", token, {
      secure: process.env.NODE_ENV === "production",      secure: true,
      sameSite: "none",
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

export const verifyToken = async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.sendStatus(401);

  jwt.verify(token, TOKEN_SECRET, async (error, user) => {
    if (error) return res.sendStatus(401);

    const userFound = await Employee.findById(user.id);
    if (!userFound) return res.sendStatus(401);

    return res.json({
      id: userFound._id,
      name: userFound.name,
      dni: userFound.dni,
      role: userFound.role,
    });
  });
};



//LOGOUT

export const logout = (req, res) => {
  res.cookie('token', '', {
    expires: new Date(0)
  })
  return res.sendStatus(200);
};


export const profile = async (req, res) => {
  try {
    const user = await Employee.find(

    );
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

