const pool = require('../config/connection');

const Permission = {

  create: (name) => {
    return pool.execute(
      'INSERT INTO Permisos (nombre) VALUES (?)',
      [name]
    );
  },

  findById: (permission_id) => {
    return pool.execute(
      'SELECT * FROM Permisos WHERE permiso_id = ?',
      [permission_id]
    );
  },

  findAll: () => {
    return pool.execute('SELECT * FROM Permisos');
  },

  update: (permission_id, name) => {
    return pool.execute(
      'UPDATE Permisos SET nombre = ? WHERE permiso_id = ?',
      [name, permission_id]
    );
  },

  delete: (permission_id) => {
    return pool.execute(
      'DELETE FROM Permisos WHERE permiso_id = ?',
      [permission_id]
    );
  }
};

module.exports = Permission;