import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

import './database/db.js';
import { sequelize } from './database/db.js';

import Alumno from './models/Alumno.js';
import Asignacion from './models/Asignacion.js';
import Calificacion from './models/Calificacion.js';
import Inscripcion from './models/Inscripcion.js';
import Materia from './models/Materia.js';
import Usuario from './models/Usuario.js';

const models = {
  Alumno,
  Asignacion,
  Calificacion,
  Inscripcion,
  Materia,
  Usuario
};

// Ejecutar las asociaciones
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

const app = express();

// Middlewares globales
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
import routes from './routes/index.js';
app.use('/api', routes);

async function main() {
  try {
    await sequelize.authenticate();
    console.log('Base de datos conectada.');
    const PORT = process.env.PORT || 3000;
    console.log(`Servidor corriendo en: ${PORT}`);
    app.listen(PORT);
  } catch (error) {
    console.error('No se puede conectar a la base de datos:', error);
  }
}

export {
  sequelize,
  Alumno,
  Asignacion,
  Calificacion,
  Inscripcion,
  Materia,
  Usuario
};

main();