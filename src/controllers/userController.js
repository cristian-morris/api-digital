const pool = require("../config/connection");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const User = require('../models/userModel');

const userController = {
  register: async (req, res) => {
    const { nombre, email, last_name, contrasena, telefono, rol_id } = req.body;

    if (
      !nombre ||
      !email ||
      !last_name ||
      !contrasena ||
      !telefono ||
      !rol_id
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      const hashedPassword = await bcrypt.hash(contrasena, 10);

      const [result] = await User.create(nombre, email, last_name, hashedPassword, telefono, rol_id)

      await userController.sendConfirmationEmail({ nombre, email });

      res.status(201).json({
        message: "User created successfully",
        userId: result.insertId,
      });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Error creating user" });
    }
  },

  sendConfirmationEmail: async ({ nombre, email }) => {
    try {
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Confirmación de Registro",
        text: `Hola ${nombre},\n\n¡Gracias por registrarte!\n\nSaludos,\nDigital Event Hub`,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("Correo enviado:", info.response);
    } catch (error) {
      console.error("Error enviando el correo:", error);
    }
  },

  getAll: async (req, res) => {
    try {
      const [rows, fields] = await User.findAll();
      res.json(rows);
    } catch (error) {
      console.error(error);
    }
  },

  getById: async (req, res) => {
    const usuarioId = req.params.id;
    try {
      const [rows, fields] = await User.findById(usuarioId);
      if (rows.length === 0) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      res.json(rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  delete: async (req, res) => {
    const usuarioId = req.params.id;
    try {
      try {
        const [result] = await User.delete(usuarioId);
  
        if (result.affectedRows > 0) {
          res.status(200).json({ message: "User deleted successfully" });
        } else {
          return res.status(404).json({ error: "User not found" });
        }
      } catch (error) {
        console.error("Error al ejecutar la consulta:", error);
        res.status(500).json({ message: "Error interno del servidor" });
      }
    } catch (error) {
      console.error("Error al obtener la conexión:", error);
      res.status(500).json({ message: "Err+or interno del servidor" });
    }
  },

  update: async (req, res) => {
    const { id } = req.params;
  
    try {
      // Verificar si el usuario existe
      const [users] = await User.findById(id);
  
      if (users.length === 0) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
  
      const user = users[0];
  
      const nombre = req.body.nombre || user.nombre;
      const email = req.body.email || user.email;
      let contrasena = undefined;
      if (req.body.contrasena) {
        contrasena = hashPassword(req.body.contrasena);
      } else {
        contrasena = user.contrasena;
      }
      const telefono = req.body.telefono || user.telefono;
      const rol_id = req.body.rol_id || user.rol_id;
      const membresia_id = req.body.membresia_id || user.membresia_id;
      const activo = req.body.activo || user.activo;
      const last_name = req.body.last_name || user.last_name;
      const fotoPerfil = req.body.fotoPerfil || user.fotoPerfil;
      const values = [
        nombre,
        email,
        contrasena,
        telefono,
        rol_id,
        membresia_id,
        activo,
        last_name,
        fotoPerfil,
        id,
      ];
      console.log(values);
      const updateUserQuery =
        "UPDATE Usuarios SET nombre = ?, email = ?, contrasena = ?, telefono = ?, rol_id = ?, membresia_id = ?, activo = ?, last_name = ?, fotoPerfil = ? WHERE usuario_id = ?";
  
      const [result] = await User.update(updateUserQuery, values);
  
      if (result.affectedRows > 0) {
        // Consultar el usuario actualizado
        const [updatedUsers] = await User.findById(id);
        const updatedUser = updatedUsers[0];
  
        res.status(200).json({
          message: "Usuario actualizado correctamente",
          user: updatedUser,
        });
      } else {
        res.status(500).json({ error: "Error al actualizar el usuario" });
      }
    } catch (error) {
      console.error("Error actualizando usuario:", error);
      res.status(500).json({ error: "Error al actualizar el usuario" });
    }
  },
  
};

module.exports = userController;
