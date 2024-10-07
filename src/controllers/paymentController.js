const Payment = require("../models/paymentModel");

const paymentController = {
  pay : async (req, res) => {
    const { amount, currency} = req.body;
    if (!amount || !currency) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }
    try {
      const paymentIntent = await Payment.createPaymetIntent(amount, currency);

      const pagoId = await Payment.insertPayment(amount);

      // await Payment.insertCardPayment(pagoId);

      if (paymentIntent?.status !== 'completed') {
        return res.status(200).json({
          message: "Confirma tu pago",
          paymentIntentId: paymentIntent?.id, 
          client_secret: paymentIntent?.client_secret,
          //client_secret o id
        });
      } else {
        return res.status(200).json({ message: "Pago completado" });
      } 
    } catch (error) {
      console.error('Error en el método POST:', error);
      const errorMessage = error.raw?.message || error.message || "Unknown error occurred";
      return res.status(500).json({ message: errorMessage });
    }
  },

  payConfirm : async (req, res) => {
    const { paymentIntentId, paymentMethod } = req.body;

    try {
      const paymentIntent = await Payment.confirmPaymentIntent(paymentIntentId, paymentMethod);
      res.status(200).send(paymentIntent);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  payHistory : async (req, res) => {
    try {
      const result = await Payment.getPaymentHistory();
      res.status(200).json(result);getPaymentHistory
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