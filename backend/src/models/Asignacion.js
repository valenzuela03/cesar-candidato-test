import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

const Asignacion = sequelize.define('Asignacion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  periodo: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  maestro_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  },
  materia_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'materias',
      key: 'id'
    }
  },
  cupo_maximo: {
    type: DataTypes.INTEGER,
    defaultValue: 40,
    validate: { min: 1 }
  },
  estatus: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'asignaciones',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['maestro_id', 'materia_id', 'periodo']
    }
  ]
});

Asignacion.associate = (models) => {
  Asignacion.belongsTo(models.Usuario, { foreignKey: 'maestro_id', as: 'maestro' });
  Asignacion.belongsTo(models.Materia, { foreignKey: 'materia_id', as: 'materia' });
  Asignacion.hasMany(models.Inscripcion, { foreignKey: 'asignacion_id', as: 'inscripciones' });
};

export default Asignacion;
