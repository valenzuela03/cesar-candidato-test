import { sequelize } from '../database/db.js';
import Usuario from '../models/Usuario.js';
import Alumno from '../models/Alumno.js';
import Materia from '../models/Materia.js';
import Asignacion from '../models/Asignacion.js';
import Inscripcion from '../models/Inscripcion.js';
import Calificacion from '../models/Calificacion.js';
import bcrypt from 'bcryptjs';

const seedDatabase = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Tablas sincronizadas.');

    // Admin
    await Usuario.create({
      nombre: 'Admin Control Escolar',
      email: 'admin@gmail.com',
      password_hash: '123456',
      rol: 'CONTROL_ESCOLAR'
    });

    // Maestros
    const maestro1 = await Usuario.create({
      nombre: 'Prof. Juan Pérez',
      email: 'maestro1@gmail.com',
      password_hash: '123456',
      rol: 'MAESTRO'
    });

    const maestro2 = await Usuario.create({
      nombre: 'Prof. Maria Lopez',
      email: 'maestro2@gmail.com',
      password_hash: '123456',
      rol: 'MAESTRO'
    });

    console.log('Usuarios creados.');

    // Materias
    const matematicas = await Materia.create({ codigo: 'MAT101', nombre: 'Matemáticas I', descripcion: 'Algebra basica' });
    const historia = await Materia.create({ codigo: 'HIS101', nombre: 'Historia Universal', descripcion: 'Historia del mundo' });
    const fisica = await Materia.create({ codigo: 'FIS101', nombre: 'Física I', descripcion: 'Mecánica clásica' });

    console.log('Materias creadas.');

    // Alumnos
    const alumno1 = await Alumno.create({ nombre: 'Carlos Estudiante', matricula: 'A001', grupo: 'A' });
    const alumno2 = await Alumno.create({ nombre: 'Ana Estudiante', matricula: 'A002', grupo: 'A' });
    const alumno3 = await Alumno.create({ nombre: 'Pedro Estudiante', matricula: 'A003', grupo: 'A' });
    const alumno4 = await Alumno.create({ nombre: 'Luis Estudiante', matricula: 'A004', grupo: 'B' });
    const alumno5 = await Alumno.create({ nombre: 'Cesar Estudiante', matricula: 'A005', grupo: 'B' });

    console.log('Alumnos creados.');

    // Asignaciones (Maestro -> Materia)
    const periodoActual = '2025-A';
    const asig1 = await Asignacion.create({ maestro_id: maestro1.id, materia_id: matematicas.id, periodo: periodoActual });
    const asig2 = await Asignacion.create({ maestro_id: maestro2.id, materia_id: historia.id, periodo: periodoActual });
    const asig3 = await Asignacion.create({ maestro_id: maestro2.id, materia_id: fisica.id, periodo: periodoActual });

    console.log('Asignaciones creadas.');

    // Inscripciones
    await Inscripcion.create({ alumno_id: alumno1.id, asignacion_id: asig2.id });
    await Inscripcion.create({ alumno_id: alumno2.id, asignacion_id: asig1.id });
    await Inscripcion.create({ alumno_id: alumno3.id, asignacion_id: asig2.id });
    await Inscripcion.create({ alumno_id: alumno4.id, asignacion_id: asig3.id });
    await Inscripcion.create({ alumno_id: alumno5.id, asignacion_id: asig3.id });

    console.log('Inscripciones creadas.');

    // Calificaciones
    await Calificacion.create({
      alumno_id: alumno1.id,
      materia_id: matematicas.id,
      maestro_id: maestro1.id,
      nota: 9.0,
      observaciones: 'Muy buen trabajo'
    });

    await Calificacion.create({
      alumno_id: alumno1.id,
      materia_id: historia.id,
      maestro_id: maestro2.id,
      nota: 8.5,
      observaciones: 'Participativo en clase de historia'
    });

    await Calificacion.create({
      alumno_id: alumno2.id,
      materia_id: matematicas.id,
      maestro_id: maestro1.id,
      nota: 8.0,
      observaciones: 'Muy buen trabajo'
    });

    await Calificacion.create({
      alumno_id: alumno3.id,
      materia_id: historia.id,
      maestro_id: maestro2.id,
      nota: 8.5,
      observaciones: 'Participativo en clase de historia'
    });

    await Calificacion.create({
      alumno_id: alumno4.id,
      materia_id: fisica.id,
      maestro_id: maestro2.id,
      nota: 7.0,
      observaciones: 'Debe mejorar en mecánica'
    });

    await Calificacion.create({
      alumno_id: alumno5.id,
      materia_id: fisica.id,
      maestro_id: maestro2.id,
      nota: 10.0,
      observaciones: 'Excelente desempeño'
    });

    console.log('Calificaciones iniciales creadas.');
    console.log('Seed ejecutado correctamente.');
    process.exit();
  } catch (error) {
    console.error('Error al ejecutar seed:', error);
    process.exit(1);
  }
};

seedDatabase();