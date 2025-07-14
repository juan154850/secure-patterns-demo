import rateLimit from 'express-rate-limit';

// Rate limiting para endpoints de autenticación
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Máximo 5 intentos por IP en 15 minutos
  message: {
    error: 'Demasiados intentos de login. Intenta de nuevo en 15 minutos.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Solo aplicar a endpoints de login/register
  skip: (req) => {
    return !req.path.includes('/login') && !req.path.includes('/register');
  }
});

// Rate limiting más estricto solo para login
export const loginRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 3, // Máximo 3 intentos por IP en 5 minutos
  message: {
    error: 'Demasiados intentos de login fallidos. Intenta de nuevo en 5 minutos.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
