import dotenv from "dotenv";

dotenv.config();

// Access Token secret (vida corta, ej. 15m)
export const TOKEN_SECRET = process.env.JWT_SECRET || "dev_access_secret";

// Refresh Token secret (vida larga, ej. 7d)
export const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "dev_refresh_secret";
