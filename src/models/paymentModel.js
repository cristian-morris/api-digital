const Stripe = require("stripe");
const key = process.env.PRIVATE_KEY;
const stripe = new Stripe(key);
const pool = require("../config/connection");

const Payment =  {
  
    createPaymetIntent: async (amount, currency) => {
       return await stripe.paymentIntents.create({
        amount: amount,
        currency: currency,
        description: "Gaming Keyboard",
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: "never",
        },
      });
    },

    insertPayment : async (amount) => {
        const [rows] = await pool.execute(
            'INSERT INTO Pagos (monto, fecha, tipo_pago_id, usuario_id, evento_id) VALUES (?, CURDATE(), 1, 1, 1)',
            [amount]
          );
          return rows.insertId;
    },

    // insertCardPayment: async (pagoId) => {
    //     await pool.execute(
    //         'INSERT INTO Pago_Tarjeta (numero_tarjeta, fecha_expiracion, cvv, pago_id) VALUES (123, CURDATE(), 123, ?)',
    //         [pagoId]
    //       );
    // },

    // getPaymentHistory: async () => {
    //     const [result] = await pool.query(
    //         `
    //           SELECT Pagos.*, Pago_Tarjeta.numero_tarjeta, Pago_Tarjeta.fecha_expiracion, Pago_Tarjeta.cvv
    //           FROM Pagos
    //           LEFT JOIN Pago_Tarjeta ON Pagos.pago_id = Pago_Tarjeta.pago_id
    //         `
    //         );

    //         return result;
    // },

    getPaymentHistoryByUserId : async (usuario_id) => {
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

    confirmPaymentIntent : async (paymentIntentId, paymentMethod) => {
       return await  stripe.paymentIntents.confirm(
        paymentIntentId,
        { payment_method: paymentMethod }
      );
    }

};

module.exports = Payment;
