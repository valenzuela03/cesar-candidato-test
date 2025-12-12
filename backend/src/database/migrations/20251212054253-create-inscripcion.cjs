'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('inscripciones', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fecha_inscripcion: {
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
      asignacion_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'asignaciones',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    });

    await queryInterface.addIndex('inscripciones', {
      fields: ['alumno_id', 'asignacion_id'],
      unique: true,
      name: 'unique_inscripcion_alumno_asignacion'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('inscripciones');
  }
};
