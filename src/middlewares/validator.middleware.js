
export const validateSchema = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      errors: result.error.errors.map((err) => ({
        field: err.path[0],   // nombre del campo que falló
        message: err.message, // mensaje de error
      })),
    });
  }

  next();
};
