const pool = require('../config/connection');

const Event = {
    getEvent: async () => {
        const [result] = await pool.query(
            `SELECT 
            e.evento_id, 
            e.nombre AS evento_nombre, 
            e.fecha_inicio, 
            e.fecha_termino, 
            e.hora,  
            e.ubicacion, 
            e.max_per, 
            e.estado, 
            e.autorizado_por, 
            e.fecha_autorizacion, 
            e.validacion_id, 
            (SELECT i.imagen_url FROM Imagenes i WHERE i.evento_id = e.evento_id LIMIT 1) AS imagen_url,
            (SELECT p.monto FROM Pagos p WHERE p.evento_id = e.evento_id LIMIT 1) AS monto,
            (SELECT s.forma FROM Escenario s WHERE s.evento_id = e.evento_id LIMIT 1) AS forma_escenario
        FROM 
            Eventos e;
        `
        );

        return result;
    },
    getEvetId: async (evento_id) => {
        const [result] = await pool.query(
            'SELECT * FROM Eventos WHERE evento_id = ?',
                [evento_id]
        );

        return result;
    },
    getEventByTicket: async (ticket) =>{
        const [result] = await pool.query(
            `SELECT t.ticket_id, t.code, t.status, h.hora_inicio, h.hora_fin, e.nombre AS evento_nombre, e.ubicacion, e.descripcion
            FROM tickets t
            JOIN horarios h ON t.id_horario = h.horario_id
            JOIN eventos e ON h.evento_id = e.evento_id
            WHERE t.ticket_id = ?`, [ticket]
        );
        return result;
    },
    postEvent: async (nombre, fecha_inicio, fecha_termino, hora, tipo_evento_id, categoria_id, ubicacion, max_per, imagen_url, monto, descripcion) => {
        const [result] = await pool.query(
            `INSERT INTO Eventos (nombre, fecha_inicio, fecha_termino, hora, tipo_evento_id, categoria_id, ubicacion, max_per, estado, autorizado_por, fecha_autorizacion, validacion_id)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pendiente', NULL, NULL, NULL)`,
            [nombre, fecha_inicio, fecha_termino, hora, tipo_evento_id, categoria_id, ubicacion, max_per]
        );

        const evento_id = resultEvento.insertId;
    
        // Insertar la imagen asociada al evento
        await pool.query(
            `INSERT INTO Imagenes (evento_id, imagen_url) VALUES (?, ?)`,
            [evento_id, imagen_url]
        );

        // Insertar el pago asociado al evento
        await pool.query(
            `INSERT INTO Pagos (evento_id, monto) VALUES (?, ?)`,
            [evento_id, monto]
        );

        // Insertar la descripción en la tabla Detalles_Evento
        await pool.query(
            `INSERT INTO Detalles_Evento (evento_id, descripcion) VALUES (?, ?)`,
            [evento_id, descripcion]
        );

        return result;
    },
    updateEvent: async (id, nombre, fecha_inicio, fecha_termino, hora, ubicacion, max_per, imagen_url, monto, descripcion) => {
        const [result] = await pool.query(
            `UPDATE Eventos 
             SET nombre = ?, fecha_inicio = ?, fecha_termino = ?, hora = ?, tipo_evento_id = ?, categoria_id = ?, ubicacion = ?, max_per = ?
             WHERE evento_id = ?`,
            [nombre, fecha_inicio, fecha_termino, hora, ubicacion, max_per, id]
        );

         // Actualizar la imagen asociada al evento
         await pool.query(
            `UPDATE Imagenes 
             SET imagen_url = ?
             WHERE evento_id = ?`,
            [imagen_url, id]
        );

        // Actualizar el pago asociado al evento
        await pool.query(
            `UPDATE Pagos 
             SET monto = ?
             WHERE evento_id = ?`,
            [monto, id]
        );

        // No se actualiza la tabla Escenario ya que no se relaciona con forma y asiento

        // Actualizar la descripción en la tabla Detalles_Evento
        await pool.query(
            `UPDATE Detalles_Evento 
             SET descripcion = ?
             WHERE evento_id = ?`,
            [descripcion, id]
        );

        return result;
    },
    
    deleteEvent: async (evento_id) => {
        const [result] = await pool.query('DELETE FROM Eventos WHERE evento_id = ?', [evento_id]);
        
       
    return result;
    }


}

const eventModel = {
    getApprovedEvents: async () => {
        try {
            const [rows] = await pool.query(
                `SELECT e.evento_id, e.nombre AS evento_nombre, e.fecha_inicio, e.fecha_termino, e.hora, 
                        te.nombre AS tipo_evento, c.nombre AS categoria, 
                        e.ubicacion, e.max_per, e.estado, e.autorizado_por, e.fecha_autorizacion, e.validacion_id, 
                        (SELECT i.imagen_url FROM Imagenes i WHERE i.evento_id = e.evento_id LIMIT 1) AS imagen_url,
                        (SELECT p.monto FROM Pagos p WHERE p.evento_id = e.evento_id LIMIT 1) AS monto,
                        (SELECT s.forma FROM Escenario s WHERE s.evento_id = e.evento_id LIMIT 1) AS forma_escenario,
                        (SELECT d.descripcion FROM Detalles_Evento d WHERE d.evento_id = e.evento_id LIMIT 1) AS descripcion
                 FROM Eventos e
                 JOIN Tipos_Evento te ON e.tipo_evento_id = te.tipo_evento_id
                 JOIN Categorias c ON e.categoria_id = c.categoria_id
                 WHERE e.estado = 'Aprobado'`
            );

            return rows; // Devolvemos los datos obtenidos en la consulta
        } catch (error) {
            console.error('Error al obtener la lista de eventos aprobados:', error);
            throw error; // Lanzamos el error para que pueda ser manejado por el controlador
        }
        
    },

    getPendingEvents: async () => {
        try {
            const [rows] = await pool.query(
                `SELECT e.evento_id, e.nombre AS evento_nombre, e.fecha_inicio, e.fecha_termino, e.hora, 
                        te.nombre AS tipo_evento, c.nombre AS categoria, 
                        e.ubicacion, e.max_per, e.estado, e.autorizado_por, e.fecha_autorizacion, e.validacion_id, 
                        (SELECT i.imagen_url FROM Imagenes i WHERE i.evento_id = e.evento_id LIMIT 1) AS imagen_url,
                        (SELECT p.monto FROM Pagos p WHERE p.evento_id = e.evento_id LIMIT 1) AS monto,
                        (SELECT s.forma FROM Escenario s WHERE s.evento_id = e.evento_id LIMIT 1) AS forma_escenario,
                        (SELECT d.descripcion FROM Detalles_Evento d WHERE d.evento_id = e.evento_id LIMIT 1) AS descripcion
                 FROM Eventos e
                 JOIN Tipos_Evento te ON e.tipo_evento_id = te.tipo_evento_id
                 JOIN Categorias c ON e.categoria_id = c.categoria_id
                 WHERE e.estado = 'Pendiente'`
            );
            return rows;
        } catch (error) {
            console.error('Error al obtener la lista de eventos pendientes:', error);
            throw error;
        }
    },

    updateEventStatus: async (evento_id, estado) => {
        try {
            const [result] = await pool.query(
                `UPDATE Eventos SET estado = ? WHERE evento_id = ?`,
                [estado, evento_id]
            );
            return result;
        } catch (error) {
            console.error('Error al actualizar el estado del evento:', error);
            throw error;
        }
    },

    

}



module.exports=Event;