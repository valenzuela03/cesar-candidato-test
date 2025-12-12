import { Router } from 'express';
import { verificarToken, esRol } from '../middlewares/auth.middleware.js';
import {
    getMateriasAsignadas,
    getAlumnosGlobal,
    getAlumnosPorMateria,
    getAlumnoDetalle,
    calificarAlumno
} from '../controllers/maestro.controller.js';
import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validate.middleware.js';

const router = Router();

router.use(verificarToken);
router.use(esRol(['MAESTRO']));

router.get('/materias', getMateriasAsignadas);
router.get('/alumnos', getAlumnosGlobal);
router.get('/alumnos/:materiaId', getAlumnosPorMateria);
router.get('/alumnos/:materiaId/:alumnoId', getAlumnoDetalle);

router.post('/calificaciones/:materiaId/:alumnoId', [
    check('nota', 'La nota es obligatoria y debe ser numerica entre 0 y 10').isNumeric().custom(val => val >= 0 && val <= 10),
    validarCampos
], calificarAlumno);

export default router;
