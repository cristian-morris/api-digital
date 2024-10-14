const TicketModel = require('../models/ticketModel');
const EventModel = require('../models/eventModel');
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

  scanTicket: async (req, res) => {
    try {
      const { ticketCode } = req.body;

      if (!ticketCode) {
        return res.status(400).send('Faltan datos requeridos');
      }

      const [ ticket ] = await TicketModel.getTicketByCode(ticketCode)

      if (ticket[0]?.status == undefined) {
        return res.status(200).send('Ticket inválido');
      }
      if (ticket[0]?.status === 1) {
        return res.status(200).send('El ticket ya ha sido utilizado');
      }

      const data = { status: 1}
      await TicketModel.update(ticket[0].ticket_id, data)
      const getEvent = await  EventModel.getEventByTicket(ticket[0].ticket_id);
  
      res.status(200).json(getEvent);


    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

};

module.exports = ticketController;
