// routes/colas.routes.js
import { Router } from "express";
const router = Router();

// Función factorial recursiva
function factorial(n) {
  return n <= 1 ? 1 : n * factorial(n - 1);
}

// ---- Calcular P0 ----
function calcularP0(lambda, mu, s) {
  const rho = lambda / (s * mu);

  let sum = 0;
  for (let k = 0; k < s; k++) {
    sum += Math.pow(lambda / mu, k) / factorial(k);
  }

  const term = (Math.pow(lambda / mu, s) / factorial(s)) * (1 / (1 - rho));

  return 1 / (sum + term);
}

// ---- Endpoint: Calcular P0 ----
router.post("/p0", (req, res) => {
  try {
    const { lambda, mu, s } = req.body;
    if (!lambda || !mu || !s) {
      return res.status(400).json({ message: "Faltan parámetros" });
    }

    const rho = lambda / (s * mu);
    const P0 = calcularP0(lambda, mu, s);

    res.json({ P0, rho });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error calculando P0" });
  }
});

// ---- Endpoint: Calcular Pn ----
router.post("/pn", (req, res) => {
  try {
    const { lambda, mu, s, n } = req.body;
    if (!lambda || !mu || !s || n === undefined) {
      return res.status(400).json({ message: "Faltan parámetros" });
    }

    const rho = lambda / (s * mu);
    const P0 = calcularP0(lambda, mu, s);

    let Pn;
    if (n < s) {
      // Caso n < s
      Pn = (Math.pow(lambda / mu, n) / factorial(n)) * P0;
    } else {
      // Caso n >= s
      Pn = (Math.pow(lambda / mu, n) / (factorial(s) * Math.pow(s, n - s))) * P0;
    }

    res.json({ n, Pn, P0, rho });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error calculando Pn" });
  }
});

export default router;
