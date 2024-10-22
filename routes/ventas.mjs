import express from 'express';
const router = express.Router();

// Swagger Schema
/**
 * @swagger
 * components:
 *   schemas:
 *     Venta:
 *       type: object
 *       required:
 *         - cliente
 *         - vendedor
 *         - total
 *         - fecha
 *       properties:
 *         id:
 *           type: integer
 *           description: ID autogenerado de la venta
 *         cliente:
 *           type: string
 *           description: Nombre del cliente
 *         vendedor:
 *           type: string
 *           description: Nombre del vendedor
 *         total:
 *           type: number
 *           format: double
 *           description: Total de la venta
 *         fecha:
 *           type: string
 *           description: Fecha de la venta (YYYY-MM-DD)
 *       example:
 *         id: 1
 *         cliente: Juan Perez
 *         vendedor: Ana Gómez
 *         total: 250.75
 *         fecha: 2024-09-01
 */

// Create (POST)
/**
 * @swagger
 * /ventas:
 *   post:
 *     summary: Crear una nueva venta
 *     tags: [Ventas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Venta'
 *     responses:
 *       201:
 *         description: Venta creada exitosamente
 *       500:
 *         description: Error ejecutando la consulta
 */
router.post('/', (req, res) => {
    const { cliente, vendedor, total, fecha } = req.body;
    const query = 'INSERT INTO ventas (cliente, vendedor, total, fecha) VALUES (?, ?, ?, ?)';
    req.db.query(query, [cliente, vendedor, total, fecha], (err, results) => {
        if (err) {
            console.error('Error ejecutando la consulta:', err);
            res.status(500).send('Error ejecutando la consulta');
            return;
        }
        res.status(201).send({ id: results.insertId, ...req.body });
    });
});

// Obtener el máximo ID de venta (GET)
/**
 * @swagger
 * /ventas/maximo-id:
 *   get:
 *     summary: Obtener el ID máximo de las ventas
 *     tags: [Ventas]
 *     responses:
 *       200:
 *         description: ID máximo de las ventas obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 maximo_id_venta:
 *                   type: integer
 *                   description: ID máximo de la tabla ventas
 *       500:
 *         description: Error ejecutando la consulta
 */
router.get('/maximo-id', (req, res) => {
    const query = 'SELECT COALESCE(MAX(id), 0) AS maximo_id_venta FROM ventas';
    req.db.query(query, (err, results) => {
        if (err) {
            console.error('Error ejecutando la consulta:', err);
            res.status(500).send('Error ejecutando la consulta');
            return;
        }
        res.status(200).json(results[0]);
    });
});

// Read (GET)
/**
 * @swagger
 * /ventas:
 *   get:
 *     summary: Obtener todas las ventas
 *     tags: [Ventas]
 *     responses:
 *       200:
 *         description: Lista de todas las ventas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Venta'
 *       500:
 *         description: Error ejecutando la consulta
 */
router.get('/', (req, res) => {
    const query = 'SELECT * FROM ventas';
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
 * /ventas/{id}:
 *   get:
 *     summary: Obtener una venta por ID
 *     tags: [Ventas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la venta
 *     responses:
 *       200:
 *         description: Venta obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Venta'
 *       404:
 *         description: Venta no encontrada
 *       500:
 *         description: Error ejecutando la consulta
 */
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM ventas WHERE id = ?';
    req.db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error ejecutando la consulta:', err);
            res.status(500).send('Error ejecutando la consulta');
            return;
        }
        if (results.length > 0) {
            res.status(200).json(results[0]);
        } else {
            res.status(404).send('Venta no encontrada');
        }
    });
});

// Update (PUT)
/**
 * @swagger
 * /ventas/{id}:
 *   put:
 *     summary: Actualizar una venta por ID
 *     tags: [Ventas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la venta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Venta'
 *     responses:
 *       200:
 *         description: Venta actualizada exitosamente
 *       500:
 *         description: Error ejecutando la consulta
 */
router.put('/:id', (req, res) => {
    const { cliente, vendedor, total, fecha } = req.body;
    const { id } = req.params;
    const query = 'UPDATE ventas SET cliente = ?, vendedor = ?, total = ?, fecha = ? WHERE id = ?';
    req.db.query(query, [cliente, vendedor, total, fecha, id], (err, results) => {
        if (err) {
            console.error('Error ejecutando la consulta:', err);
            res.status(500).send('Error ejecutando la consulta');
            return;
        }
        res.status(200).send('Venta actualizada exitosamente');
    });
});

// Delete (DELETE)
/**
 * @swagger
 * /ventas/{id}:
 *   delete:
 *     summary: Eliminar una venta por ID
 *     tags: [Ventas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la venta
 *     responses:
 *       200:
 *         description: Venta eliminada exitosamente
 *       500:
 *         description: Error ejecutando la consulta
 */
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM ventas WHERE id = ?';
    req.db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error ejecutando la consulta:', err);
            res.status(500).send('Error ejecutando la consulta');
            return;
        }
        res.status(200).send('Venta eliminada exitosamente');
    });
});



export default router;
