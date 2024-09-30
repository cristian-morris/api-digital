// permisosController.js
const Permission = require('../models/permissionModel');

const permissionController = {
  create: async (req, res) => {
    try {
      const { name } = req.body;
      await Permission.create(name);
      res.status(201).send("Permission Created");
    } catch (error) {
      res.status(500).send("Error Creating Permission");
    }
  },

  readAll: async (req, res) => {
    try {
      const [rows] = await Permission.findAll();
      res.status(200).json(rows);
    } catch (error) {
      res.status(500).send("Error Getting Permissions");
    }
  },

  readOne: async (req, res) => {
    try {
      const { id } = req.params;
      const [rows] = await Permission.findById(id);
      if (rows.length === 0) {
        res.status(404).send("Permission Not Found");
      } else {
        res.status(200).json(rows[0]);
      }
    } catch (error) {
      res.status(500).send("Error Getting Permission");
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      await Permission.update(id, name);
      res.status(200).send(`Permission with ID: ${id} Updated`);
    } catch (error) {
      res.status(500).send("Error Updating Permission");
    }
  },
  
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      await Permission.delete(id);
      res.status(200).send(`Permission with ID: ${id} Deleted`);
    } catch (error) {
      res.status(500).send("Error Deleting Permission");
    }
  }
};

module.exports = permissionController;