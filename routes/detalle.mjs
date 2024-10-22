import express from 'express';
const router = express.Router();

// Swagger Schema
/**
 * @swagger
 * components:
 *   schemas:
 *     Detalle:
 *       type: object
 *       required:
 *         - cod_pro
 *         - cantidad
 *         - precio
 *         - id_venta
 *       properties:
 *         id:
 *           type: integer
 *           description: ID autogenerado del detalle
 *         cod_pro:
 *           type: string
 *           description: Código del producto
 *         cantidad:
 *           type: integer
 *           description: Cantidad de productos
 *         precio:
 *           type: number
 *           format: double
 *           description: Precio del producto
 *         id_venta:
 *           type: integer
 *           description: ID de la venta asociada
 *       example:
 *         id: 1
 *         cod_pro: "ABC123"
 *         cantidad: 2
 *         precio: 100.50
 *         id_venta: 1
 */

// Create (POST)
/**
 * @swagger
 * /detalle:
 *   post:
 *     summary: Crear un nuevo detalle
 *     tags: [Detalle]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Detalle'
 *     responses:
 *       201:
 *         description: Detalle creado exitosamente
 *       500:
 *         description: Error ejecutando la consulta
 */
router.post('/', (req, res) => {
    const { cod_pro, cantidad, precio, id_venta } = req.body;
    const query = 'INSERT INTO detalle (cod_pro, cantidad, precio, id_venta) VALUES (?, ?, ?, ?)';
    req.db.query(query, [cod_pro, cantidad, precio, id_venta], (err, results) => {
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
 * /detalle:
 *   get:
 *     summary: Obtener todos los detalles
 *     tags: [Detalle]
 *     responses:
 *       200:
 *         description: Lista de todos los detalles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Detalle'
 *       500:
 *         description: Error ejecutando la consulta
 */
router.get('/', (req, res) => {
    const query = 'SELECT * FROM detalle';
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
 * /detalle/{id}:
 *   get:
 *     summary: Obtener un detalle por ID
 *     tags: [Detalle]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del detalle
 *     responses:
 *       200:
 *         description: Detalle obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Detalle'
 *       404:
 *         description: Detalle no encontrado
 *       500:
 *         description: Error ejecutando la consulta
 */
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM detalle WHERE id = ?';
    req.db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error ejecutando la consulta:', err);
            res.status(500).send('Error ejecutando la consulta');
            return;
        }
        if (results.length > 0) {
            res.status(200).json(results[0]);
        } else {
            res.status(404).send('Detalle no encontrado');
        }
    });
});

// Update (PUT)
/**
 * @swagger
 * /detalle/{id}:
 *   put:
 *     summary: Actualizar un detalle por ID
 *     tags: [Detalle]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del detalle
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Detalle'
 *     responses:
 *       200:
 *         description: Detalle actualizado exitosamente
 *       500:
 *         description: Error ejecutando la consulta
 */
router.put('/:id', (req, res) => {
    const { cod_pro, cantidad, precio, id_venta } = req.body;
    const { id } = req.params;
    const query = 'UPDATE detalle SET cod_pro = ?, cantidad = ?, precio = ?, id_venta = ? WHERE id = ?';
    req.db.query(query, [cod_pro, cantidad, precio, id_venta, id], (err, results) => {
        if (err) {
            console.error('Error ejecutando la consulta:', err);
            res.status(500).send('Error ejecutando la consulta');
            return;
        }
        res.status(200).send('Detalle actualizado exitosamente');
    });
});

// Delete (DELETE)
/**
 * @swagger
 * /detalle/{id}:
 *   delete:
 *     summary: Eliminar un detalle por ID
 *     tags: [Detalle]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del detalle
 *     responses:
 *       200:
 *         description: Detalle eliminado exitosamente
 *       500:
 *         description: Error ejecutando la consulta
 */
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM detalle WHERE id = ?';
    req.db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error ejecutando la consulta:', err);
            res.status(500).send('Error ejecutando la consulta');
            return;
        }
        res.status(200).send('Detalle eliminado exitosamente');
    });
});

export default router;
