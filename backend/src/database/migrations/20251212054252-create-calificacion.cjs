'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('calificaciones', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nota: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false
      },
      observaciones: {
        type: Sequelize.TEXT
      },
      fecha_registro: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      alumno_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'alumnos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      materia_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'materias',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      maestro_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      activo: {
        type: Sequelize.SMALLINT,
        defaultValue: 1,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addIndex('calificaciones', {
      fields: ['alumno_id', 'materia_id', 'maestro_id', 'fecha_registro'],
      unique: true,
      name: 'unique_calificacion_registro'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('calificaciones');
  }
};
