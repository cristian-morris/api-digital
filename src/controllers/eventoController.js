const { json } = require('express');
const pool = require('../config/connection');



const Evento = async (req, res) => {
    try{
      const [result] = await pool.query(
        `SELECT a.evento_id, a.nombre AS nombre_evento, a.fecha_inicio, a.fecha_termino, a.hora, a.ubicacion, a.max_per, a.estado, a.fecha_autorizacion, b.nombre AS tipo_evento, e.nombre AS organizador_nombre, e.nombre AS autorizado_nombre, c.estado, d.nombre AS categoria_nombre, f.imagen_url 
              FROM Eventos a 
              INNER JOIN Tipos_Evento b ON a.tipo_evento_id = b.tipo_evento_id  
              INNER JOIN Validacion c ON a.validacion_id = c.validacion_id 
              INNER JOIN Categorias d ON a.categoria_id = d.categoria_id
              INNER JOIN Usuarios e ON a.organizador_id = e.usuario_id
              INNER JOIN Imagenes f ON a.evento_id = f.evento_id
              WHERE c.estado = "APROBADO"
              ORDER BY ABS(DATEDIFF(fecha_inicio, CURDATE()))`
      );
      res.status(200).json(result);
    } catch (error) {
      console.log("erro al obtener eventos: ", error);
      res.status(500).send("error al obtener eventos");
    }
  };

  const filtroEvento = async (req, res) => {
    const { category, tipo_evento, nombre_evento, hora } = req.query;
  
    let sql = `SELECT a.evento_id, a.nombre AS nombre_evento, a.fecha_inicio, a.fecha_termino, a.hora, a.ubicacion, a.max_per, a.estado, a.fecha_autorizacion, 
                       b.nombre AS tipo_evento, e.nombre AS organizador_nombre, e.nombre AS autorizado_nombre, c.estado, d.nombre AS categoria_nombre, f.imagen_url 
                FROM Eventos a 
                INNER JOIN Tipos_Evento b ON a.tipo_evento_id = b.tipo_evento_id  
                INNER JOIN Validacion c ON a.validacion_id = c.validacion_id 
                INNER JOIN Categorias d ON a.categoria_id = d.categoria_id
                INNER JOIN Usuarios e ON a.organizador_id = e.usuario_id
                INNER JOIN Imagenes f ON a.evento_id = f.evento_id
                WHERE c.estado = "APROBADO"`;
  
    const params = [];
  
    if (nombre_evento) {
      sql += ' AND a.nombre LIKE ?';
      params.push(`${nombre_evento}%`);
    }
    if (hora) {
      sql += ' AND a.hora = ?';
      params.push(hora);
    }
    if (category) {
      sql += ' AND d.nombre = ?';
      params.push(category);
    }
    if (tipo_evento) {
      sql += ' AND b.nombre = ?';
      params.push(tipo_evento);
    }
    
    sql += ' ORDER BY ABS(DATEDIFF(fecha_inicio, CURDATE()))';
  
    try {
      const [rows] = await pool.query(sql, params);
  
      if (rows.length === 0) {
        let message = 'No se encontraron eventos';
        if (category) {
          message += ` para la categoría ${category}`;
        }
        if (tipo_evento) {
          message += ` para el tipo de evento ${tipo_evento}`;
        }
        return res.status(404).json({ message });
      }
  
      res.status(200).json(rows);
    } catch (error) {
      console.error('Error al obtener eventos:', error);
      res.status(500).json({ error: 'Error al obtener eventos' });
    }
  };
  
  
  
  module.exports = {
    Evento,
    filtroEvento
  };