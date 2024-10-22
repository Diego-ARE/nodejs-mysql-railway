import express from 'express';
const router = express.Router();

// Swagger Schema
/**
 * @swagger
 * components:
 *   schemas:
 *     Config:
 *       type: object
 *       required:
 *         - ruc
 *         - nombre
 *       properties:
 *         id:
 *           type: integer
 *           description: ID autogenerado de la configuración
 *         ruc:
 *           type: integer
 *           description: RUC de la configuración
 *         nombre:
 *           type: string
 *           description: Nombre de la configuración
 *         telefono:
 *           type: integer
 *           description: Teléfono de la configuración
 *         direccion:
 *           type: string
 *           description: Dirección de la configuración
 *         razon:
 *           type: string
 *           description: Razón social de la configuración
 *       example:
 *         id: 1
 *         ruc: 123456789
 *         nombre: Configuración Ejemplo
 *         telefono: 555123456
 *         direccion: Calle Falsa 123
 *         razon: Razón Ejemplo
 */

// Create (POST)
/**
 * @swagger
 * /config:
 *   post:
 *     summary: Crear una nueva configuración
 *     tags: [Config]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Config'
 *     responses:
 *       201:
 *         description: Configuración creada exitosamente
 *       500:
 *         description: Error ejecutando la consulta
 */
//Crear un nuevo registro
router.post('/', (req, res) => {
    const { ruc, nombre, telefono, direccion, razon } = req.body;
    const query = 'INSERT INTO config (ruc, nombre, telefono, direccion, razon) VALUES (?, ?, ?, ?, ?)';
    req.db.query(query, [ruc, nombre, telefono, direccion, razon], (err, results) => {
        if (err) {
            console.error('Error ejecutando la consulta:', err);
            res.status(500).send('Error ejecutando la consulta');
            return;
        }
        res.status(201).send({ id: results.insertId, ...req.body });
    });
});

// Read (GET)
/**
 * @swagger
 * /config:
 *   get:
 *     summary: Obtener todas las configuraciones
 *     tags: [Config]
 *     responses:
 *       200:
 *         description: Lista de todas las configuraciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Config'
 *       500:
 *         description: Error ejecutando la consulta
 */
//Crear Get de registros
router.get('/', (req, res) => {
    const query = 'SELECT * FROM config';
    req.db.query(query, (err, results) => {
        if (err) {
            console.error('Error ejecutando la consulta:', err);
            res.status(500).send('Error ejecutando la consulta');
            return;
        }
        res.status(200).json(results);
    });
});

// Read by ID (GET)
/**
 * @swagger
 * /config/{id}:
 *   get:
 *     summary: Obtener una configuración por ID
 *     tags: [Config]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la configuración
 *     responses:
 *       200:
 *         description: Configuración obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Config'
 *       404:
 *         description: Configuración no encontrada
 *       500:
 *         description: Error ejecutando la consulta
 */
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM config WHERE id = ?';
    req.db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error ejecutando la consulta:', err);
            res.status(500).send('Error ejecutando la consulta');
            return;
        }
        if (results.length > 0) {
            res.status(200).json(results[0]);
        } else {
            res.status(404).send('Configuración no encontrada');
        }
    });
});

// Update (PUT)
/**
 * @swagger
 * /config/{id}:
 *   put:
 *     summary: Actualizar una configuración por ID
 *     tags: [Config]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la configuración
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Config'
 *     responses:
 *       200:
 *         description: Configuración actualizada exitosamente
 *       500:
 *         description: Error ejecutando la consulta
 */
router.put('/:id', (req, res) => {
    const { ruc, nombre, telefono, direccion, razon } = req.body;
    const { id } = req.params;
    const query = 'UPDATE config SET ruc = ?, nombre = ?, telefono = ?, direccion = ?, razon = ? WHERE id = ?';
    req.db.query(query, [ruc, nombre, telefono, direccion, razon, id], (err, results) => {
        if (err) {
            console.error('Error ejecutando la consulta:', err);
            res.status(500).send('Error ejecutando la consulta');
            return;
        }
        res.status(200).send('Configuración actualizada exitosamente');
    });
});

// Delete (DELETE)
/**
 * @swagger
 * /config/{id}:
 *   delete:
 *     summary: Eliminar una configuración por ID
 *     tags: [Config]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la configuración
 *     responses:
 *       200:
 *         description: Configuración eliminada exitosamente
 *       500:
 *         description: Error ejecutando la consulta
 */
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM config WHERE id = ?';
    req.db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error ejecutando la consulta:', err);
            res.status(500).send('Error ejecutando la consulta');
            return;
        }
        res.status(200).send('Configuración eliminada exitosamente');
    });
});

export default router;
