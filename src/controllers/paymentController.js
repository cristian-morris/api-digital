const Payment = require("../models/paymentModel");
const  UserMembreship  = require("../models/userMembreshipModel");
const User = require("../models/userModel");
const jwt = require('jsonwebtoken');

const paymentController = {

  createPayment: async (req, res) => {
    const { amount  } = req.body;

    if (!amount) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }
    try {

      let amountInCents = amount * 100;
      let paymentIntent = await Payment.createPaymetIntent(amountInCents);
        return res.status(200).json({ message: "Confirma tu pago", paymentIntentId: paymentIntent?.id, client_secret: paymentIntent?.client_secret
        });
    } catch (error) {
      console.error('Error al pagar:', error);
      res.status(500).json({ error: 'Error al Pagar' });
    }
  },

  // Para cliente
  SavePayment: async (req, res) => {
    const { amount, userId, eventId } = req.body;

    if (!amount || !userId || !eventId) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }
    try {
      await Payment.create(amount, userId, eventId);

      res.status(200).json({ message: 'Pago exitoso' });
    } catch (error) {
      console.error('Error al pagar:', error);
      res.status(500).json({ error: 'Error al Pagar' });
    }
  },

  payHistory : async (req, res) => {
    try {
      const result = await Payment.findAll();
      res.status(200).json(result);
    } catch (error) {
      console.error('Error al obtener el historial:', error);
      res.status(500).send('Error al obtener el historial');
    }
  },



  payHistoryByUserId : async (req, res) => {

    const { usuario_id } = req.params;

    if (!usuario_id) {
      return res.status(400).send('Falta el parámetro usuario_id');
    }
    
    try {
      const result = await Payment.findById(usuario_id);
      result.map( payment => 
        payment.code = jwt.sign( payment, process.env.JWT_SECRET , {
            expiresIn: '7d'
          })
      )
      res.status(200).json(result);
    } catch (error) {
      console.error('Error al obtener el historial:', error);
      res.status(500).send('Error al obtener el historial');
  }
  },

  //Para organizadores
  PayMembreship: async(req, res)=>{

    const { amount, userId, membreshipId  } = req.body;

    if (!amount || !userId ) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }
    try {

      let initialDate = new Date();
      let endDate = new Date(initialDate); 
      endDate.setMonth(endDate.getMonth() + 1);
      let userMembreship = await UserMembreship.findById(userId);

      await Payment.create(amount, userId, null);
      await UserMembreship.update( userMembreship.id_usuario_membresia, userId, membreshipId, initialDate, endDate, null, null);
      
      const values = [
        membreshipId,
        userId
      ];

      const updateUserQuery = "UPDATE Usuarios SET membresia_id = ? WHERE usuario_id = ?";

      await User.update(updateUserQuery, values);

      res.status(200).json({ message: 'Pago exitoso' });
    } catch (error) {
      console.error('Error al pagar:', error);
      res.status(500).json({ error: 'Error al Pagar' });
    }

  }

};




module.exports = paymentController;