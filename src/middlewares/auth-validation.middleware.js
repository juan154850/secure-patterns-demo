import { z } from 'zod';

// Esquema para validar registro de usuario
export const registerSchema = z.object({
  username: z.string()
    .min(3, 'Username debe tener al menos 3 caracteres')
    .max(32, 'Username no puede tener más de 32 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username solo puede contener letras, números y guiones bajos'),
  password: z.string()
    .min(8, 'Password debe tener al menos 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/, 'Password debe contener al menos una mayúscula, una minúscula y un número'),
  email: z.string()
    .email('Email inválido')
    .max(128, 'Email no puede tener más de 128 caracteres')
});

// Esquema para validar login
export const loginSchema = z.object({
  username: z.string()
    .min(1, 'Username requerido')
    .max(32, 'Username no puede tener más de 32 caracteres'),
  password: z.string()
    .min(1, 'Password requerido')
});

// Middleware para validar el cuerpo de las peticiones
export const validateBody = (schema) => (req, res, next) => {
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
