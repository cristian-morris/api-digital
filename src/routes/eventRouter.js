const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */


/**
 * @swagger
 * /api/events/get/img:
 *   get:
 *     summary: Obtener la lista de eventos detallados
 *     tags: [Admin events - Team Brayan]
 *     responses:
 *       200:
 *         description: Lista de eventos obtenida con éxito
 *       500:
 *         description: Error al obtener la lista de eventos
 */
router.get('/get/', eventController.getEvent);

/**
 * @swagger
 * /api/events/get/img/{id}:
 *   get:
 *     summary: Obtener un evento por ID 
 *     tags: [Admin events - Team Brayan]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del evento
 *     responses:
 *       200:
 *         description: Evento obtenido con éxito
 *       404:
 *         description: Evento no encontrado
 *       500:
 *         description: Error al obtener el evento
 */
router.get('/get/:id', eventController.getIdEvent);
/**
 * @swagger
 * /api/events/get/approved:
 *   get:
 *     summary: Obtener la lista de eventos aprobados
 *     tags: [Admin events - Team Brayan]
 *     responses:
 *       200:
 *         description: Lista de eventos aprobados obtenida con éxito
 *       500:
 *         description: Error al obtener la lista de eventos aprobados
 */
router.get('/approved', eventController.getApprovedEvent);

/**
 * @swagger
 * /api/events/get/pending:
 *   get:
 *     summary: Obtener la lista de eventos pendientes
 *     tags: [Admin events - Team Brayan]
 *     responses:
 *       200:
 *         description: Lista de eventos pendientes obtenida con éxito
 *       500:
 *         description: Error al obtener la lista de eventos pendientes
 */
router.get('/pending', eventController.getPendingEvent);

/**
 * @swagger
 * /api/events/post/img:
 *   post:
 *     summary: Crear un nuevo evento - Organizador
 *     tags: [Admin events - Team Brayan]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               fecha_inicio:
 *                 type: string
 *                 format: date
 *               fecha_termino:
 *                 type: string
 *                 format: date
 *               hora:
 *                 type: string
 *                 format: time
 *               tipo_evento_id:
 *                 type: integer
 *               categoria_id:
 *                 type: integer
 *               ubicacion:
 *                 type: string
 *               max_per:
 *                 type: integer
 *               imagen_url:
 *                 type: string
 *               monto:
 *                 type: number
 *                 format: float
 *               descripcion:
 *                 type: string
 *             required:
 *               - nombre
 *               - fecha_inicio
 *               - fecha_termino
 *               - hora
 *               - tipo_evento_id
 *               - categoria_id
 *               - ubicacion
 *               - max_per
 *               - imagen_url
 *               - monto
 *               - descripcion
 *     responses:
 *       201:
 *         description: Evento creado correctamente
 *       400:
 *         description: Datos inválidos en la solicitud
 *       500:
 *         description: Error al crear el evento
 */
router.post('/post/', eventController.postImgEvent);

/**
 * @swagger
 * /api/events/post/pending:
 *   post:
 *     summary: Aprobar eventos - Administrador
 *     tags: [Admin events - Team Brayan]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               evento_id:
 *                 type: integer
 *               estado:
 *                 type: string
 *                 enum: [Aprobado, Rechazado]
 *             required:
 *               - evento_id
 *               - estado
 *     responses:
 *       200:
 *         description: Estado del evento actualizado correctamente
 *       400:
 *         description: Estado inválido en la solicitud
 *       404:
 *         description: Evento no encontrado
 *       500:
 *         description: Error al actualizar el estado del evento
 */
router.post('/post/pending', eventController.postPendingEvent);

/**
 * @swagger
 * /api/events/put/img/{id}:
 *   put:
 *     summary: Actualizar un evento existente por ID
 *     tags: [Admin events - Team Brayan]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del evento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               fecha_inicio:
 *                 type: string
 *                 format: date
 *               fecha_termino:
 *                 type: string
 *                 format: date
 *               hora:
 *                 type: string
 *                 format: time
 *               tipo_evento_id:
 *                 type: integer
 *               categoria_id:
 *                 type: integer
 *               ubicacion:
 *                 type: string
 *               max_per:
 *                 type: integer
 *               imagen_url:
 *                 type: string
 *               monto:
 *                 type: number
 *                 format: float
 *               descripcion:
 *                 type: string
 *             required:
 *               - nombre
 *               - fecha_inicio
 *               - fecha_termino
 *               - hora
 *               - tipo_evento_id
 *               - categoria_id
 *               - ubicacion
 *               - max_per
 *               - imagen_url
 *               - monto
 *               - descripcion
 *     responses:
 *       200:
 *         description: Evento actualizado correctamente
 *       400:
 *         description: Datos inválidos en la solicitud
 *       500:
 *         description: Error al actualizar el evento
 */
router.put('/put/:id', eventController.putEvent);

/**
 * @swagger
 * /api/events/delete/img/:
 *   delete:
 *     summary: Eliminar un evento 
 *     tags: [Admin events - Team Brayan]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               evento_id:
 *                 type: integer
 *                 description: ID del evento que se desea eliminar
 *             required:
 *               - evento_id
 *     responses:
 *       200:
 *         description: Evento eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Evento eliminado exitosamente
 *       404:
 *         description: Evento no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Evento no encontrado
 *       500:
 *         description: Error al eliminar el evento
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Error al eliminar el evento
 */
router.delete('/delete/', eventController.deleteEvent);


module.exports = router;
