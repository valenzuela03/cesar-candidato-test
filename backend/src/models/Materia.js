import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

const Materia = sequelize.define('Materia', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  codigo: {
    type: DataTypes.STRING(50),
    unique: true
  },
  nombre: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT
  },
  estatus: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'materias',
  timestamps: true
});

Materia.associate = (models) => {
  Materia.hasMany(models.Asignacion, { foreignKey: 'materia_id', as: 'asignaciones' });
};

export default Materia;