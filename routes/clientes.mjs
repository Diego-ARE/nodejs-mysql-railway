import express from 'express';
const router = express.Router();

// Swagger Schema
/**
 * @swagger
 * components:
 *   schemas:
 *     Cliente:
 *       type: object
 *       required:
 *         - dpi
 *         - nombre
 *         - telefono
 *         - direccion
 *         - razon
 *       properties:
 *         id:
 *           type: integer
 *           description: ID autogenerado del cliente
 *         dpi:
 *           type: integer
 *           description: DPI del cliente
 *         nombre:
 *           type: string
 *           description: Nombre del cliente
 *         telefono:
 *           type: integer
 *           description: Teléfono del cliente
 *         direccion:
 *           type: string
 *           description: Dirección del cliente
 *         razon:
 *           type: string
 *           description: Razón social del cliente
 *       example:
 *         id: 1
 *         dpi: 123456789
 *         nombre: Juan Pérez
 *         telefono: 555123456
 *         direccion: Calle Falsa 123
 *         razon: Razón Ejemplo
 */

// Create (POST)
/**
 * @swagger
 * /clientes:
 *   post:
 *     summary: Crear un nuevo cliente
 *     tags: [Cliente]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cliente'
 *     responses:
 *       201:
 *         description: Cliente creado exitosamente
 *       500:
 *         description: Error ejecutando la consulta
 */
router.post('/', (req, res) => {
    const { dpi, nombre, telefono, direccion, razon } = req.body;
    const query = 'INSERT INTO clientes (dpi, nombre, telefono, direccion, razon) VALUES (?, ?, ?, ?, ?)';
    req.db.query(query, [dpi, nombre, telefono, direccion, razon], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error executing query');
            return;
        }
        res.status(201).send({ id: results.insertId, ...req.body });
    });
});

// Read (GET)
/**
 * @swagger
 * /clientes:
 *   get:
 *     summary: Obtener todos los clientes
 *     tags: [Cliente]
 *     responses:
 *       200:
 *         description: Lista de todos los clientes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cliente'
 *       500:
 *         description: Error ejecutando la consulta
 */
router.get('/', (req, res) => {
    const query = 'SELECT * FROM clientes';
    req.db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error executing query');
            return;
        }
        res.status(200).json(results);
    });
});

// Read by ID (GET)
/**
 * @swagger
 * /clientes/{id}:
 *   get:
 *     summary: Obtener un cliente por ID
 *     tags: [Cliente]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       404:
 *         description: Cliente no encontrado
 *       500:
 *         description: Error ejecutando la consulta
 */
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM clientes WHERE id = ?';
    req.db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error executing query');
            return;
        }
        if (results.length > 0) {
            res.status(200).json(results[0]);
        } else {
            res.status(404).send('Cliente no encontrado');
        }
    });
});

// Update (PUT)
/**
 * @swagger
 * /clientes/{id}:
 *   put:
 *     summary: Actualizar un cliente por ID
 *     tags: [Cliente]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cliente'
 *     responses:
 *       200:
 *         description: Cliente actualizado exitosamente
 *       500:
 *         description: Error ejecutando la consulta
 */
router.put('/:id', (req, res) => {
    const { dpi, nombre, telefono, direccion, razon } = req.body;
    const { id } = req.params;
    const query = 'UPDATE clientes SET dpi = ?, nombre = ?, telefono = ?, direccion = ?, razon = ? WHERE id = ?';
    req.db.query(query, [dpi, nombre, telefono, direccion, razon, id], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error executing query');
            return;
        }
        res.status(200).send('Cliente actualizado exitosamente');
    });
});

// Delete (DELETE)
/**
 * @swagger
 * /clientes/{id}:
 *   delete:
 *     summary: Eliminar un cliente por ID
 *     tags: [Cliente]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Cliente eliminado exitosamente
 *       500:
 *         description: Error ejecutando la consulta
 */
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM clientes WHERE id = ?';
    req.db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error executing query');
            return;
        }
        res.status(200).send('Cliente eliminado exitosamente');
    });
});

export default router;
