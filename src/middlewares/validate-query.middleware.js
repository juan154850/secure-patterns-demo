export const validateQuery = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.query);
  if (!result.success) return res.status(400).json({ error: 'Parámetros inválidos' });
  req.validatedQuery = result.data;
  next();
};