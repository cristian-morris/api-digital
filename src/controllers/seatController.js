const Seat = require('../models/seatModel');
const { use } = require('../routes/seatsRouter');

const seatController = {

    create: async (req, res) => {
        const {numberSeat, status, userId} = req.body;
        console.log(numberSeat, status, userId);
        try {
            if (!numberSeat || !status || !userId) {
                return res.status(400).json({ error: 'Faltan campos obligatorios' });
            }
            // let users = await User.findById(userId);
            // if (!users || users.length === 0){
            //     return res.status(404).json({ error: `Usuario con el id ${userId} no encontrado` });
                
            // }
           let seats = await Seat.create(numberSeat, status, userId);

            res.status(201).json({ message: 'Asiento creado correctamente', 
                Seat:{ 
                    seatId: seats[0].insertId,
                    numberSeat, 
                    status, 
                    userId
                
            } });

            
        } catch (error) {
            
        }
    },
    
    getById: async (req, res) => {
        const seatId = req.params.seatId;
        try {
            const [rows, fields] = await Seat.findById(seatId);
            if (rows.length === 0) {
                res.status(404).json({ error: 'Asiento no encontrado' });
            } else {
                res.json(rows[0]);
            }
        } catch (error) {
            console.error('Error al obtener asientos por ID:', error);
            res.status(500).json({ error: 'Error al obtener asientos por ID' });
        }
    },

    getAll: async (req, res) => {
        try {
            const [rows, fields] = await Seat.findAll(); 
            res.json(rows);
        } catch (error) {
            console.error('Error al obtener todos los asientos:', error);
            res.status(500).json({ error: 'Error al obtener todas los asientos' });
        }
    },

    update: async (req, res) => {
        const seatId = req.params.seatId;
        const { numberSeat,status,userId } = req.body;
        try {
            let seats = await Seat.findById(seatId);

            if (!seats || seats.length === 0){
                return res.status(404).json({ error: 'Asiento no encontrado' });
            }
            // let users = await User.findById(userId);
            // if (!users || users.length === 0){
            //     return res.status(404).json({ error: `Usuario con el id ${userId} no encontrado` });
                
            // }
            await Seat.update(numberSeat,status,userId,seatId);

            const updatedSeat = await Seat.findById(seatId);
            const updatedSeats = updatedSeat[0];
              res.json({ message: 'Asiento actualizado correctamente', updatedSeats });
        } catch (error) {
            console.error('Error al actualizar asiento:', error);
            res.status(500).json({ error: 'Error al actualizar asiento' });
        }
    },

    delete: async (req, res) => {
        const seatId = req.params.seatId;
        try {
            let seats = await Seat.findById(seatId);
            if (!seats || seats.length === 0){
                return res.status(404).json({ error: 'Asiento no encontrado' });
            }
            await Seat.delete(seatId);
            res.json({ message: 'Asiento eliminado correctamente' });
        } catch (error) {
            console.error('Error al eliminar asiento:', error);
            res.status(500).json({ error: 'Error al eliminar asiento' });
        }
    }
}

module.exports = seatController;



