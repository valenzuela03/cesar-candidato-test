import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

const Calificacion = sequelize.define('Calificacion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nota: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    validate: {
      min: 0,
      max: 10
    }
  },
  observaciones: {
    type: DataTypes.TEXT
  },
  fecha_registro: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  alumno_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  materia_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  maestro_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  activo: {
    type: DataTypes.SMALLINT, // Postgres no tiene TINYINT, usamos SMALLINT
    defaultValue: 1,
    allowNull: false
  }
}, {
  tableName: 'calificaciones',
  timestamps: true,
  paranoid: false,
  indexes: [
    {
      unique: true,
      fields: ['alumno_id', 'materia_id', 'maestro_id', 'fecha_registro']
    }
  ]
});

Calificacion.associate = (models) => {
  Calificacion.belongsTo(models.Alumno, { foreignKey: 'alumno_id' });
  Calificacion.belongsTo(models.Materia, { foreignKey: 'materia_id', as: 'Materia' });
  Calificacion.belongsTo(models.Usuario, { foreignKey: 'maestro_id' });
};

export default Calificacion;
