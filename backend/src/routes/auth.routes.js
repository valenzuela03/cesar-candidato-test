import { Router } from 'express';
import { check } from 'express-validator';
import { login } from '../controllers/auth.controller.js';
import { validarCampos } from '../middlewares/validate.middleware.js';

const router = Router();

// POST /api/auth/login
router.post('/login', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], login);

export default router;
