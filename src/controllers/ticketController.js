const TicketModel = require('../models/ticketModel');
const crypto = require('crypto'); 

const ticketController = {

  getTickets: async (req, res) => {
    try {
      const [rows] = await TicketModel.getAllTickets();
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createTicket: async (req, res) => {
    try {
      const { info, id_horario } = req.body;

      if (!info || !id_horario) {
        return res.status(400).send('Faltan datos requeridos');
      }

      const year = new Date().getFullYear();
      const date = new Date().toISOString().slice(0, 10); 
      const randomNumber = crypto.randomBytes(4).toString('hex'); 
      const code = `UTP-DEH-${date}-${randomNumber}`;

      const status = 0; 

      const [result] = await TicketModel.createTicket(info, code, status, id_horario);
      res.status(201).json({ message: 'Ticket creado exitosamente', ticketId: result.insertId, code });
    } catch (error) {
      res.status(500).send('Error al crear el ticket');
    }
  },

};

module.exports = ticketController;
