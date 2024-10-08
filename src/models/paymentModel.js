const Stripe = require("stripe");
const key = process.env.PRIVATE_KEY;
const stripe = new Stripe(key);
const pool = require("../config/connection");

const Payment = {

  createPaymetIntent: async (amount) => {
    return await stripe.paymentIntents.create({
      amount: amount,
      currency: 'MXN',
      payment_method: 'pm_card_visa',
    });
  },



  create: (amount, userId, eventId) => {
    return pool.execute(
      'INSERT INTO pagos (monto, fecha ,usuario_id, evento_id ) VALUES (?, CURDATE() ,?, ?)',
      [amount, userId, eventId]
    );
  },


  getPaymentHistoryByUserId: async (usuario_id) => {
    const [result] = await pool.query(
      `
               SELECT Pagos.*, Pago_Tarjeta.numero_tarjeta, Pago_Tarjeta.fecha_expiracion, Pago_Tarjeta.cvv
               FROM Pagos
               LEFT JOIN Pago_Tarjeta ON Pagos.pago_id = Pago_Tarjeta.pago_id
               WHERE Pagos.usuario_id = ?
            `,
      [usuario_id]
    );

    return result;
  },

};

module.exports = Payment;