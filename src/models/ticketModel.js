const pool = require('../config/connection');

const TicketModel = {

    getAllTickets: () => {
        return pool.execute(
            `
            SELECT t.ticket_id, t.info, t.code, t.status, h.horario_id, e.evento_id, e.nombre AS evento_nombre
            FROM tickets t
            JOIN horarios h ON t.id_horario = h.horario_id
            JOIN eventos e ON h.evento_id = e.evento_id
            `
        );
    },

    getTicketsByEvent: (evento_id, page = 1, limit = 10) => {
        const offset = (page - 1) * limit;
        return pool.execute(
            `
            SELECT t.ticket_id, t.info, t.code, t.status, h.horario_id, e.evento_id, e.nombre AS evento_nombre
            FROM tickets t
            JOIN horarios h ON t.id_horario = h.horario_id
            JOIN eventos e ON h.evento_id = e.evento_id
            WHERE e.evento_id = ?
            LIMIT ? OFFSET ?
            `,
            [evento_id, parseInt(limit), parseInt(offset)]
        );
    },

    createTicket: (info, code, status, id_horario) => {
        const query = `
            INSERT INTO tickets (info, code, status, id_horario)
            VALUES (?, ?, ?, ?)
        `;
        const values = [info, code, status, id_horario];
        return pool.execute(query, values);
    },

    deleteTicket: (ticket_id) => {
        const query = 'DELETE FROM tickets WHERE ticket_id = ?';
        return pool.execute(query, [ticket_id]);
    },

    update: (id, data) => {
        const fields = Object.keys(data);
        const setClause = fields.map(field => `${field} = ?`).join(', ');
        const query = `
            UPDATE tickets
            SET ${setClause}
            WHERE ticket_id = ?;
        `;
        const values = [...Object.values(data), id];
    
        return pool.execute(query, values);
    },

    getTicketByCode: (code) => {
        const query = `SELECT * FROM tickets WHERE code = ?`;
        return pool.execute( query, [code] );
    }
};

module.exports = TicketModel;
