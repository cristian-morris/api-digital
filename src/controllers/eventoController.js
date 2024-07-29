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
    try {
      const { nombre_evento, hora, category, tipo_evento } = req.query;
      
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
        sql += ' AND a.nombre = ?';
        params.push(nombre_evento);
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
  
      // Usando async/await
      const [results] = await pool.query(sql, params);
  
      if (results.length === 0) {
        let errorMsg = 'No se encontraron eventos con';
        if (category && tipo_evento) {
          errorMsg += ` la categoria: ${category} y el tipo de evento: ${tipo_evento}`;
        } else if (nombre_evento) {
          errorMsg += ` el nombre': ${nombre_evento}`;
        } else if (category) {
          errorMsg += ` la categoria': ${category}`;
        } else if (tipo_evento) {
          errorMsg += ` el tipo de evento: ${tipo_evento}`;
        }
        return res.status(404).json({ error: errorMsg });
      }
  
      res.status(200).json(results);
  
    } catch (error) {
      console.error("Error al obtener eventos: ", error);
      res.status(500).send("Error al obtener eventos");
    }
  };
  
  
  module.exports = {
    Evento,
    filtroEvento
  };