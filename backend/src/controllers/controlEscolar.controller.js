import sequelize from '../database/db.js';
import Usuario from '../models/Usuario.js';
import Materia from '../models/Materia.js';
import Asignacion from '../models/Asignacion.js';
import Calificacion from '../models/Calificacion.js';
import Alumno from '../models/Alumno.js';

// POST /api/controlescolar/asignacion
// Asigna una materia a un maestro y define el cupo máximo de alumnos (por defecto 40).
export const asignarMateria = async (req, res) => {
    try {
        const { maestro_id, materia_id, cupo_maximo } = req.body;

        const maestro = await Usuario.findByPk(maestro_id);
        if (!maestro || maestro.rol !== 'MAESTRO') {
            return res.status(400).json({ message: 'El usuario indicado no es un maestro valido.' });
        }

        const nuevaAsig = await Asignacion.create({
            maestro_id,
            materia_id,
            cupo_maximo: cupo_maximo || 40
        });

        res.json({ message: 'Asignación creada correctamente', asignacion: nuevaAsig });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear asignación', error: error.message });
    }
};

// GET /api/controlescolar/reporte
// Genera un reporte global de promedios y calificaciones (0-10).
export const getReporteGlobal = async (req, res) => {
    try {
        const reporte = await Calificacion.findAll({
            where: { activo: 1 },
            attributes: [
                'alumno_id',
                [sequelize.fn('ROUND', sequelize.cast(sequelize.fn('AVG', sequelize.col('nota')), 'numeric'), 2), 'nota']
            ],
            include: [{
                model: Alumno,
                attributes: ['id', 'nombre', 'matricula']
            }
            ],
            group: ['alumno_id', 'Alumno.id'],
            order: [[sequelize.col('nota'), 'DESC']]
        });

        res.json(reporte);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al generar reporte' });
    }
};

// GET /api/controlescolar/reporte/:materiaId
// Genera un reporte de promedios y calificaciones filtrado por una materia específica(0-10).
export const getReporteMateria = async (req, res) => {
    try {
        const { materiaId } = req.params;

        const reporte = await Calificacion.findAll({
            where: { materia_id: materiaId, activo: 1 },
            include: [{
                model: Alumno,
                attributes: ['nombre', 'matricula']
            }, {
                model: Materia,
                as: 'Materia',
                attributes: ['nombre', 'codigo']
            }],
            order: [['nota', 'DESC']]
        });
        console.log(reporte);
        res.json(reporte);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al generar reporte de materia' });
    }
}

// DELETE /api/controlescolar/calificaciones/:materiaId/:alumnoId
// Elimina una calificación de manera lógica 
// soft delete, uso del tipo de dato byte 0 y 1 en la columna de la tabla), 
// preservando el registro en la base de datos.
export const eliminarCalificacion = async (req, res) => {
    try {
        const { materiaId, alumnoId } = req.params;

        const calificacion = await Calificacion.findOne({
            where: { materia_id: materiaId, alumno_id: alumnoId }
        });

        if (!calificacion) {
            return res.status(404).json({ message: 'Calificación no encontrada' });
        }

        calificacion.activo = 0;
        await calificacion.save();

        res.json({ message: 'Calificación eliminada correctamente' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar calificación' });
    }
}

// PATCH /api/controlescolar/calificaciones/:materiaId/:alumnoId
// Actualiza la calificación (0-10) o las observaciones de un alumno en una materia específica.
export const actualizarCalificacionAdmin = async (req, res) => {
    try {
        const { materiaId, alumnoId } = req.params;
        const { nota, observaciones } = req.body;

        const calificacion = await Calificacion.findOne({
            where: { materia_id: materiaId, alumno_id: alumnoId },
        });

        if (!calificacion) {
            return res.status(404).json({ message: 'Calificación no encontrada' });
        }

        if (nota !== undefined) calificacion.nota = nota;
        if (observaciones !== undefined) calificacion.observaciones = observaciones;

        await calificacion.save();

        res.json({ message: 'Calificación actualizada correctamente', calificacion });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar calificación' });
    }
}

// GET /api/controlescolar/materias
// Obtiene la lista de todas las materias disponibles.
export const getMaterias = async (req, res) => {
    try {
        const materias = await Materia.findAll({
            attributes: ['id', 'nombre', 'codigo']
        });
        res.json(materias);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener materias' });
    }
};
