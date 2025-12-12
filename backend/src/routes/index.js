import { Router } from 'express';
import authRoutes from './auth.routes.js';
import maestroRoutes from './maestro.routes.js';
import controlEscolarRoutes from './controlEscolar.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/maestro', maestroRoutes);
router.use('/controlescolar', controlEscolarRoutes);

export default router;
