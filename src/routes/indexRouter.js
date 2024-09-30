const express = require("express");
const router = express.Router();

// Importar y usar otras rutas
const authRouter = require("./authRouter");
const commentsRouter = require('./commentsRouter');
const eventRouter = require("./eventRouter");
const imageRouter = require("./imageRouter");
const membershipRouter = require("./membershipRouter");
const notificationRoutes = require("./notificationRouter");
const paymentRouter = require("./paymentRouter");
const resetPasswordRouter = require("./resetPasswordRouter");
const sceneryRoutes = require("./sceneryRouter");
const seatsRouter = require("./seatsRouter");
const userRoutes = require("./userRoutes");

// Categorias de las rutas 
router.use("/auth", authRouter);
router.use('/comments', commentsRouter);
router.use("/events", eventRouter);
router.use("/images", imageRouter);
router.use('/membership', membershipRouter);
router.use("/notification", notificationRoutes);
router.use("/payment", paymentRouter);
router.use("/password", resetPasswordRouter);
router.use("/scenarios", sceneryRoutes);
router.use("/seats", seatsRouter);
router.use("/users", userRoutes);


module.exports = router;
