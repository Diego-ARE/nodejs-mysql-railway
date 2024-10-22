import express from 'express';
const router = express.Router();
// CRUD de Operaciones
/**
 * @swagger
 * components:
 *   schemas:
 *     Producto:
 *       type: object
 *       required:
 *         - codigo
 *         - descripcion
 *         - stock
 *         - precio
 *       properties:
 *         id:
 *           type: integer
 *           description: ID autogenerado del producto
 *         codigo:
 *           type: string
 *           description: Código único del producto
 *         descripcion:
 *           type: string
 *           description: Descripción del producto
 *         proveedor:
 *           type: string
 *           description: Nombre del proveedor
 *         marca:
 *           type: string
 *           description: Marca del producto
 *         color:
 *           type: string
 *           description: Color del producto
 *         stock:
 *           type: integer
 *           description: Cantidad de unidades en stock
 *         precio:
 *           type: number
 *           format: float
 *           description: Precio del producto
 *       example:
 *         id: 1
 *         codigo: COD001
 *         descripcion: Producto de prueba
 *         proveedor: Proveedor X
 *         marca: Marca Y
 *         color: Rojo
 *         stock: 10
 *         precio: 99.99
 */


// Create (POST)
/**
 * @swagger
 * /productos:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags: [Producto]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Producto'
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *       500:
 *         description: Error ejecutando la consulta
 */
router.post('/', (req, res) => {
    const { codigo, descripcion, proveedor, marca, color, stock, precio } = req.body;
    const query = 'INSERT INTO productos (codigo, descripcion, proveedor, marca, color, stock, precio) VALUES (?, ?, ?, ?, ?, ?, ?)';
    req.db.query(query, [codigo, descripcion, proveedor, marca, color, stock, precio], (err, results) => {
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
 * /productos:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Producto]
 *     responses:
 *       200:
 *         description: Lista de todos los productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Producto'
 *       500:
 *         description: Error ejecutando la consulta
 */
router.get('/', (req, res) => {
    const query = 'SELECT * FROM productos';
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
 * /productos/{id}:
 *   get:
 *     summary: Obtener un producto por ID
 *     tags: [Producto]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Producto'
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error ejecutando la consulta
 */
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM productos WHERE id = ?';
    req.db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error executing query');
            return;
        }
        if (results.length > 0) {
            res.status(200).json(results[0]);
        } else {
            res.status(404).send('Producto no encontrado');
        }
    });
});

// Endpoint para buscar un producto por código
router.get('/codigo/:codigo', (req, res) => {
    const { codigo } = req.params;
    const query = 'SELECT * FROM productos WHERE codigo = ?';
    req.db.query(query, [codigo], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error ejecutando la consulta');
            return;
        }
        if (results.length > 0) {
            res.status(200).json(results[0]);
        } else {
            res.status(404).send('Producto no encontrado');
        }
    });
});

// Update (PUT)
/**
 * @swagger
 * /productos/{id}:
 *   put:
 *     summary: Actualizar un producto por ID
 *     tags: [Producto]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Producto'
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente
 *       500:
 *         description: Error ejecutando la consulta
 */
router.put('/:id', (req, res) => {
    const { codigo, descripcion, proveedor, marca, color, stock, precio } = req.body;
    const { id } = req.params;
    const query = 'UPDATE productos SET codigo = ?, descripcion = ?, proveedor = ?, marca = ?, color = ?, stock = ?, precio = ? WHERE id = ?';
    req.db.query(query, [codigo, descripcion, proveedor, marca, color, stock, precio, id], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error executing query');
            return;
        }
        res.status(200).send('Producto actualizado exitosamente');
    });
});

// Delete (DELETE)
/**
 * @swagger
 * /productos/{id}:
 *   delete:
 *     summary: Eliminar un producto por ID
 *     tags: [Producto]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto eliminado exitosamente
 *       500:
 *         description: Error ejecutando la consulta
 */
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM productos WHERE id = ?';
    req.db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error executing query');
            return;
        }
        res.status(200).send('Producto eliminado exitosamente');
    });
});

export default router;