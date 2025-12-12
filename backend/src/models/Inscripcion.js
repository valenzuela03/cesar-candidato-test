import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

const Inscripcion = sequelize.define('Inscripcion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fecha_inscripcion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  alumno_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'alumnos',
      key: 'id'
    }
  },
  asignacion_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'asignaciones',
      key: 'id'
    }
  }
}, {
  tableName: 'inscripciones',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['alumno_id', 'asignacion_id']
    }
  ]
});

Inscripcion.associate = (models) => {
  Inscripcion.belongsTo(models.Alumno, { foreignKey: 'alumno_id', as: 'alumno' });
  Inscripcion.belongsTo(models.Asignacion, { foreignKey: 'asignacion_id', as: 'asignacion' });
};

export default Inscripcion;