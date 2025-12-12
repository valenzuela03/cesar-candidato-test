import { Router } from 'express';
import { verificarToken, esRol } from '../middlewares/auth.middleware.js';
import {
    asignarMateria,
    getReporteGlobal,
    getReporteMateria,
    eliminarCalificacion,
    actualizarCalificacionAdmin,
    getMaterias
} from '../controllers/controlEscolar.controller.js';
import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validate.middleware.js';

const router = Router();

router.use(verificarToken);
router.use(esRol(['CONTROL_ESCOLAR']));

router.post('/asignacion', [
    check('maestro_id', 'ID de maestro requerido').not().isEmpty(),
    check('materia_id', 'ID de materia requerido').not().isEmpty(),
    validarCampos
], asignarMateria);

router.get('/reporte', getReporteGlobal);
router.get('/reporte/:materiaId', getReporteMateria);
router.get('/materias', getMaterias);

router.delete('/calificaciones/:materiaId/:alumnoId', eliminarCalificacion);

router.patch('/calificaciones/:materiaId/:alumnoId', [
    check('nota', 'La nota debe ser numérica entre 0 y 10').optional().isNumeric().custom(val => val >= 0 && val <= 10),
    validarCampos
], actualizarCalificacionAdmin);

export default router;
