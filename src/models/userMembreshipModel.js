const pool = require("../config/connection");
const { findAll } = require("./seatModel");

const UserMembreship = {

    create: async (userId, membreshipId, initialDate, endDate, namePlane,payConfirm) => {
        return pool.execute(
            'INSERT INTO usuario_membresias (id_usuario, id_membresia, fecha_inicio, fecha_fin, nombre_plan, confirmacion_compra) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, membreshipId, initialDate, endDate, namePlane, payConfirm]
        );
    },

    findById: async (userId) => {
        return await pool.query(
            `
            SELECT * From usuario_membresias
            WHERE id_usuario = ?
            `,
            [userId]
        );
    },

    findAll: async () => {
        return await pool.query(
            `
            SELECT * From usuario_membresias
            `
        );
    },

    update: async (userMembreshipId, userId, membreshipId, initialDate, endDate, namePlane,payConfirm) => {
        return pool.execute(
            'UPDATE usuario_membresias SET id_usuario = ?, id_membresia = ?, fecha_inicio = ?, fecha_fin = ?, nombre_plan = ?, confirmacion_compra = ? WHERE id_usuario_membresia = ?',
            [userId, membreshipId, initialDate, endDate, namePlane, payConfirm, userMembreshipId]
        );
    },


};

module.exports = UserMembreship;