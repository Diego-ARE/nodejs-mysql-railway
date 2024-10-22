import express from 'express';
const router = express.Router();

// CRUD de Proveedores

// Create (POST)
// CRUD de Proveedores

/**
 * @swagger
 * components:
 *   schemas:
 *     Proveedor:
 *       type: object
 *       required:
 *         - ruc
 *         - nombre
 *         - telefono
 *       properties:
 *         id:
 *           type: integer
 *           description: ID autogenerado del proveedor
 *         ruc:
 *           type: integer
 *           description: RUC del proveedor
 *         nombre:
 *           type: string
 *           description: Nombre del proveedor
 *         telefono:
 *           type: integer
 *           description: Teléfono del proveedor
 *         direccion:
 *           type: string
 *           description: Dirección del proveedor
 *         razon:
 *           type: string
 *           description: Razón social del proveedor
 *       example:
 *         id: 1
 *         ruc: 123456789
 *         nombre: Proveedor Ejemplo
 *         telefono: 987654321
 *         direccion: Calle Falsa 123
 *         razon: Ejemplo S.A.
 */

/**
 * @swagger
 * /proveedores:
 *   post:
 *     summary: Crear un nuevo proveedor
 *     tags: [Proveedor]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Proveedor'
 *     responses:
 *       201:
 *         description: Proveedor creado exitosamente
 *       500:
 *         description: Error ejecutando la consulta
 */
router.post('/', (req, res) => {
    const { ruc, nombre, telefono, direccion, razon } = req.body;
    const query = 'INSERT INTO proveedor (ruc, nombre, telefono, direccion, razon) VALUES (?, ?, ?, ?, ?)';
    req.db.query(query, [ruc, nombre, telefono, direccion, razon], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error executing query');
            return;
        }
        res.status(201).send({ id: results.insertId, ...req.body });
    });
});

/**
 * @swagger
 * /proveedores:
 *   get:
 *     summary: Obtener todos los proveedores
 *     tags: [Proveedor]
 *     responses:
 *       200:
 *         description: Lista de todos los proveedores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Proveedor'
 *       500:
 *         description: Error ejecutando la consulta
 */
router.get('/', (req, res) => {
    const query = 'SELECT * FROM proveedor';
    req.db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error executing query');
            return;
        }
        res.status(200).json(results);
    });
});

/**
 * @swagger
 * /proveedores/{id}:
 *   get:
 *     summary: Obtener un proveedor por ID
 *     tags: [Proveedor]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del proveedor
 *     responses:
 *       200:
 *         description: Proveedor encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Proveedor'
 *       404:
 *         description: Proveedor no encontrado
 *       500:
 *         description: Error ejecutando la consulta
 */
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM proveedor WHERE id = ?';
    req.db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error executing query');
            return;
        }
        if (results.length > 0) {
            res.status(200).json(results[0]);
        } else {
            res.status(404).send('Proveedor no encontrado');
        }
    });
});

/**
 * @swagger
 * /proveedores/{id}:
 *   put:
 *     summary: Actualizar un proveedor por ID
 *     tags: [Proveedor]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del proveedor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Proveedor'
 *     responses:
 *       200:
 *         description: Proveedor actualizado exitosamente
 *       500:
 *         description: Error ejecutando la consulta
 */
router.put('/:id', (req, res) => {
    const { ruc, nombre, telefono, direccion, razon } = req.body;
    const { id } = req.params;
    const query = 'UPDATE proveedor SET ruc = ?, nombre = ?, telefono = ?, direccion = ?, razon = ? WHERE id = ?';
    req.db.query(query, [ruc, nombre, telefono, direccion, razon, id], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error ejecutando la consulta');
            return;
        }
        res.status(200).send('Proveedor actualizado exitosamente');
    });
});

/**
 * @swagger
 * /proveedores/{id}:
 *   delete:
 *     summary: Eliminar un proveedor por ID
 *     tags: [Proveedor]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del proveedor
 *     responses:
 *       200:
 *         description: Proveedor eliminado exitosamente
 *       500:
 *         description: Error ejecutando la consulta
 */
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM proveedor WHERE id = ?';
    req.db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error ejecutando la consulta');
            return;
        }
        res.status(200).send('Proveedor eliminado exitosamente');
    });
});

export default router;