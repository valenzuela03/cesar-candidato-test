import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

const Alumno = sequelize.define('Alumno', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  matricula: {
    type: DataTypes.STRING(50),
    unique: true
  },
  fecha_nacimiento: {
    type: DataTypes.DATEONLY
  },
  email_contacto: {
    type: DataTypes.STRING(150)
  }
}, {
  tableName: 'alumnos',
  timestamps: true
});

Alumno.associate = (models) => {
  Alumno.hasMany(models.Inscripcion, { foreignKey: 'alumno_id', as: 'inscripciones' });
  Alumno.hasMany(models.Calificacion, { foreignKey: 'alumno_id', as: 'calificaciones' });
};

export default Alumno;
