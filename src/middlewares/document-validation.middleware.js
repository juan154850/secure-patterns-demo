import { z } from 'zod';

// Esquema para validar creación/actualización de documentos
export const documentSchema = z.object({
  title: z.string()
    .min(1, 'Título requerido')
    .max(255, 'Título no puede tener más de 255 caracteres'),
  content: z.string()
    .min(1, 'Contenido requerido')
    .max(10000, 'Contenido no puede tener más de 10000 caracteres'),
  isPrivate: z.boolean().optional().default(true)
});

// Esquema para validar ID de documento
export const documentIdSchema = z.object({
  id: z.coerce.number().int().positive('ID de documento debe ser un número positivo')
});

// Middleware para validar el cuerpo de las peticiones
export const validateDocumentBody = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.issues.map(issue => ({
      field: issue.path.join('.'),
      message: issue.message
    }));
    return res.status(400).json({ 
      error: 'Datos inválidos', 
      details: errors 
    });
  }
  req.validatedBody = result.data;
  next();
};

// Middleware para validar parámetros de ruta
export const validateDocumentParams = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.params);
  if (!result.success) {
    const errors = result.error.issues.map(issue => ({
      field: issue.path.join('.'),
      message: issue.message
    }));
    return res.status(400).json({ 
      error: 'Parámetros inválidos', 
      details: errors 
    });
  }
  req.validatedParams = result.data;
  next();
};
