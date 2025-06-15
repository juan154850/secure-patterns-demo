import { Router } from 'express';
import { reflectedXssInsecure } from '../examples/insecure/xss.controller.js';
import { reflectedXssSecure } from '../examples/secure/xss.controller.js';

const router = Router();

router.get('/insecure', reflectedXssInsecure);
router.get('/secure', reflectedXssSecure);

export default router;
