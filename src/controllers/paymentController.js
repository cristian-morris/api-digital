const Payment = require("../models/paymentModel");

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

  create: async (req, res) => {
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

  payHistory: async (req, res) => {
    try {
      const result = await Payment.getPaymentHistory();
      res.status(200).json(result); getPaymentHistory
    } catch (error) {
      console.error('Error al obtener el historial:', error);
      res.status(500).send('Error al obtener el historial');
    }
  },

  payHistoryByUserId: async (req, res) => {
    const { usuario_id } = req.params;
    if (!usuario_id) {
      return res.status(400).send('Falta el parámetro usuario_id');
    }
    console.log(usuario_id);

    try {
      const result = await Payment.getPaymentHistoryByUserId(usuario_id);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error al obtener el historial:', error);
      res.status(500).send('Error al obtener el historial');
    }
  }
};




module.exports = paymentController;