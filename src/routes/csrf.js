import { Router } from 'express';
import { updateEmailInsecure } from '../examples/insecure/csrf.controller.js';
import { getCsrfToken, updateEmailSecure } from '../examples/secure/csrf.controller.js';
import { csrfProtection } from '../middlewares/csrf-protection.middleware.js';

const router = Router();

router.post('/insecure', updateEmailInsecure);

// Primero obtienes el token
router.get('/secure/token', csrfProtection, getCsrfToken);

// Luego puedes hacer el POST seguro usando el token
router.post('/secure', csrfProtection, updateEmailSecure);

export default router;
