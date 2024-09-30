const express = require("express");
const router = express.Router();
const permissionController = require("../controllers/permissionController");

// Create //permission
router.post("/", permissionController.create);

// Read all
router.get("/", permissionController.readAll);

// Read one
router.get("/:id", permissionController.readOne);

// Update
router.put("/:id", permissionController.update);

// Delete
router.delete("/:id", permissionController.delete);

module.exports = router;