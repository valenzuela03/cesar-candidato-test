import bcrypt from 'bcryptjs';
import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(120),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  rol: {
    type: DataTypes.ENUM('MAESTRO', 'CONTROL_ESCOLAR'),
    allowNull: false
  },
  estatus: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'usuarios',
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password_hash) {
        const salt = await bcrypt.genSalt(10);
        user.password_hash = await bcrypt.hash(user.password_hash, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password_hash')) {
        const salt = await bcrypt.genSalt(10);
        user.password_hash = await bcrypt.hash(user.password_hash, salt);
      }
    }
  }
});

Usuario.prototype.validarPassword = async function (password) {
  return await bcrypt.compare(password, this.password_hash);
};

Usuario.associate = (models) => {
  Usuario.hasMany(models.Asignacion, { foreignKey: 'maestro_id', as: 'gruposAsignados' });
};

export default Usuario;