import { Router } from 'express';
const router = Router();

router.get('/', (_req, res) => res.json({ info: 'pong' }));

export default router;
