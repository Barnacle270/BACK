export const authRequired = (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token)
      return res.status(401).json({ message: "No token, authorization denied" });

    jwt.verify(token, TOKEN_SECRET, (error, decodedToken) => {
      if (error) {
        return res.status(401).json({ message: "Token is not valid" });
      }

      console.log("Token decodificado:", decodedToken);  // Verifica que `role` esté presente

      req.user = decodedToken;
      next();
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
