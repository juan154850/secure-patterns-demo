import { Router } from 'express';
import { 
  registerInsecure, 
  loginInsecure, 
  getProfileInsecure 
} from '../examples/insecure/broken-auth.controller.js';
import { 
  registerSecure, 
  loginSecure, 
  getProfileSecure 
} from '../examples/secure/broken-auth.controller.js';
import { authRateLimit, loginRateLimit } from '../middlewares/auth-rate-limit.middleware.js';
import { validateBody, registerSchema, loginSchema } from '../middlewares/auth-validation.middleware.js';

const router = Router();

// ────── Rutas inseguras ──────
router.post('/register/insecure', registerInsecure);
router.post('/login/insecure', loginInsecure);
router.get('/profile/insecure', getProfileInsecure);

// ────── Rutas seguras ──────
router.post('/register/secure', 
  authRateLimit, 
  validateBody(registerSchema), 
  registerSecure
);

router.post('/login/secure', 
  authRateLimit, 
  loginRateLimit, 
  validateBody(loginSchema), 
  loginSecure
);

router.get('/profile/secure', getProfileSecure);

export default router;
