const pool = require('../config/connection');

const Seat = {
    create: (numberSeat, status, userId) => {
        return pool.execute(
            'INSERT INTO Asientos (numero_asiento, estado, usuario_id) VALUES (?, ?, ?)',
            [numberSeat, status, userId]
        );
    },

    findById: async(seatId) => {
      const [rows] = await pool.execute(
        'SELECT * FROM Asientos WHERE asiento_id = ?',
        [seatId]
      );  
      return rows;  
    },

    findAll: () => {
      return pool.execute('SELECT * FROM Asientos');
    },
    
    update:(numberSeat,status,userId, seatId) =>{
      return pool.execute(
        'UPDATE Asientos SET numero_asiento = ?, estado = ?, usuario_id = ? WHERE asiento_id = ?',
        [numberSeat,status,userId, seatId]
      )
    },

    delete:( seatId ) => {
        return pool.execute(
        'DELETE FROM Asientos WHERE asiento_id = ?',
        [seatId]
        )
    }
}

module.exports = Seat;