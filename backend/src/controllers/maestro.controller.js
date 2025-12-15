import Materia from '../models/Materia.js';
import Alumno from '../models/Alumno.js';
import Calificacion from '../models/Calificacion.js';
import Asignacion from '../models/Asignacion.js';
import Inscripcion from '../models/Inscripcion.js';

// GET /api/maestro/materias
//Obtiene la lista de materias asignadas al maestro autenticado.
export const getMateriasAsignadas = async (req, res) => {
    try {
        const maestroId = req.usuario.id;
        console.log('Buscando materias para maestro:', maestroId);

        const materias = await Asignacion.findAll({
            where: { maestro_id: maestroId },
            include: [{
                model: Materia,
                as: 'materia',
                attributes: ['id', 'nombre', 'codigo', 'descripcion']
            }]
        });
        console.log('Asignaciones encontradas:', materias.length);

        res.json(materias);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener materias' });
    }
};

// GET /api/maestro/alumnos
// Obtiene el listado global de alumnos asignados al maestro autenticado.
export const getAlumnosGlobal = async (req, res) => {
    try {
        const maestroId = req.usuario.id;

        const asignacionesIds = (await Asignacion.findAll({ where: { maestro_id: maestroId } }))
            .map(a => a.id);

        const inscripciones = await Inscripcion.findAll({
            where: { asignacion_id: asignacionesIds },
            include: [{ model: Alumno, as: 'alumno' }]
        });

        const alumnosMap = new Map();
        inscripciones.forEach(i => {
            if (i.alumno) alumnosMap.set(i.alumno.id, i.alumno);
        });

        res.json(Array.from(alumnosMap.values()));

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener alumnos' });
    }
};

// GET /api/maestro/alumnos/:materiaId
// Obtiene los alumnos inscritos + detalles de la materia
export const getAlumnosPorMateria = async (req, res) => {
    try {
        const { materiaId } = req.params;
        const maestroId = req.usuario.id;

        // 1. Validar asignación y obtener datos de la materia
        const asignacion = await Asignacion.findOne({
            where: { maestro_id: maestroId, materia_id: materiaId },
            include: [{
                model: Materia,
                as: 'materia',
                attributes: ['id', 'nombre', 'codigo', 'descripcion']
            }]
        });

        if (!asignacion) {
            return res.status(403).json({ message: 'No tienes asignada esta materia.' });
        }

        // Obtener inscripciones
        const inscripciones = await Inscripcion.findAll({
            where: { asignacion_id: asignacion.id },
            include: [{ model: Alumno, as: 'alumno' }]
        });

        // Obtener calificaciones existentes
        const alumnoIds = inscripciones
            .filter(i => i.alumno)
            .map(i => i.alumno.id);

        const calificaciones = await Calificacion.findAll({
            where: {
                alumno_id: alumnoIds,
                materia_id: materiaId,
                maestro_id: maestroId
            }
        });

        // Formatear lista de alumnos con su calificación
        const alumnos = inscripciones
            .filter(i => i.alumno)
            .map(i => {
                const alu = i.alumno.toJSON();
                const calif = calificaciones.find(c => c.alumno_id === alu.id);
                // Estructura compatible con frontend
                alu.calificaciones = calif ? [calif] : [];
                return alu;
            });

        // Enviar respuesta compuesta
        res.json({
            materia: asignacion.materia,
            alumnos: alumnos
        });

    } catch (error) {
        console.error('Error en getAlumnosPorMateria:', error);
        res.status(500).json({ message: 'Error al obtener alumnos de la materia' });
    }
}

// GET /api/maestro/alumnos/:materiaId/:alumnoId
// Obtiene el detalle de un alumno específico dentro de una materia específica.
export const getAlumnoDetalle = async (req, res) => {
    try {
        const { materiaId, alumnoId } = req.params;
        const maestroId = req.usuario.id;

        // Validar asignacion
        const asignacion = await Asignacion.findOne({
            where: { maestro_id: maestroId, materia_id: materiaId }
        });

        if (!asignacion) {
            return res.status(403).json({ message: 'No tienes asignada esta materia.' });
        }

        // Buscar Alumno
        const alumno = await Alumno.findByPk(alumnoId);
        if (!alumno) {
            return res.status(404).json({ message: 'Alumno no encontrado.' });
        }

        // Validar inscripción del alumno en la materia
        const inscripcion = await Inscripcion.findOne({
            where: { alumno_id: alumnoId, asignacion_id: asignacion.id }
        });
        if (!inscripcion) {
            return res.status(400).json({ message: 'El alumno no está inscrito en esta materia.' });
        }

        // Buscar calificacion que exista
        const calificacion = await Calificacion.findOne({
            where: {
                alumno_id: alumnoId,
                materia_id: materiaId,
                maestro_id: maestroId
            }
        });

        res.json({
            alumno,
            calificacion: calificacion || null
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener detalle del alumno' });
    }
}


// POST /api/maestro/calificaciones/:materiaId/:alumnoId
// Registra o actualiza la calificación (0-10) de un alumno en una materia específica.
export const calificarAlumno = async (req, res) => {
    try {
        const { materiaId, alumnoId } = req.params;
        const { nota, observaciones } = req.body;
        const maestroId = req.usuario.id;

        // Validar asignacion
        const asignacion = await Asignacion.findOne({
            where: { maestro_id: maestroId, materia_id: materiaId }
        });
        if (!asignacion) {
            return res.status(403).json({ message: 'No tienes asignada esta materia.' });
        }

        // Buscar si ya existe calificacion
        let calificacion = await Calificacion.findOne({
            where: {
                alumno_id: alumnoId,
                materia_id: materiaId,
                maestro_id: maestroId
            }
        });

        if (calificacion) {
            calificacion.nota = nota;
            if (observaciones) calificacion.observaciones = observaciones;
            await calificacion.save();
        } else {
            calificacion = await Calificacion.create({
                alumno_id: alumnoId,
                materia_id: materiaId,
                maestro_id: maestroId,
                nota,
                observaciones
            });
        }

        res.json({ message: 'Calificación registrada', calificacion });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al registrar calificación' });
    }
}

