// libs/cookies.js
export const setTokenCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === "production";

  const cookieOptions = {
    httpOnly: true,
    path: "/",
    maxAge: 24 * 60 * 60 * 1000,       // 1 día
    secure: isProduction,              // true solo en prod
    sameSite: isProduction ? "None" : "Lax",
  };

  if (isProduction) {
    cookieOptions.domain = ".transportej.com"; // ajusta a tu dominio real
  }

  res.cookie("token", token, cookieOptions);
};

export const clearTokenCookie = (res) => {
  const isProduction = process.env.NODE_ENV === "production";

  const cookieOptions = {
    httpOnly: true,
    path: "/",
    maxAge: 0,                         // elimina cookie
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
  };

  if (isProduction) {
    cookieOptions.domain = ".transportej.com";
  }

  res.cookie("token", "", cookieOptions);
};
