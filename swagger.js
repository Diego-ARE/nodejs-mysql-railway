/*const swaggerJSDoc = require("swagger-jsdoc";)*/
import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const app = express();
app.use(bodyParser.json());

const conexion = mysql.createConnection({
    host: "localhost",
    database: "bd_analisis",
    user: "root",
    password:""
});

conexion.connect(function(err) {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connection to database established successfully');
});

// SWAGGER
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Base Analisis',
            version: '1.0.0',
            description: 'API para manejar productos en la base de datos bd_analisis'
        },
        servers: [
            {
                url: 'http://localhost:3000'
            }
        ]
    },
    apis: ['./index.mjs'] // Ruta del Archivo
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// CRUD de Operaciones

// Create (POST)
/**
 * @swagger
 * /productos:
 *   post:
 *     summary: Crea un nuevo producto
 *     description: Agrega un nuevo producto a la base de datos.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               codigo:
 *                 type: string
 *                 example: COD001
 *               descripcion:
 *                 type: string
 *                 example: Producto de prueba
 *               proveedor:
 *                 type: string
 *                 example: Proveedor X
 *               marca:
 *                 type: string
 *                 example: Marca Y
 *               color:
 *                 type: string
 *                 example: Rojo
 *               stock:
 *                 type: integer
 *                 example: 10
 *               precio:
 *                 type: number
 *                 format: float
 *                 example: 99.99
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 codigo:
 *                   type: string
 *                   example: COD001
 *                 descripcion:
 *                   type: string
 *                   example: Producto de prueba
 *                 proveedor:
 *                   type: string
 *                   example: Proveedor X
 *                 marca:
 *                   type: string
 *                   example: Marca Y
 *                 color:
 *                   type: string
 *                   example: Rojo
 *                 stock:
 *                   type: integer
 *                   example: 10
 *                 precio:
 *                   type: number
 *                   format: float
 *                   example: 99.99
 *       500:
 *         description: Error al ejecutar la consulta
 */
app.post('/productos', (req, res) => {
    const { codigo, descripcion, proveedor, marca, color, stock, precio } = req.body;
    const query = 'INSERT INTO productos (codigo, descripcion, proveedor, marca, color, stock, precio) VALUES (?, ?, ?, ?, ?, ?, ?)';
    conexion.query(query, [codigo, descripcion, proveedor, marca, color, stock, precio], (err, results) => {
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
 *     summary: Obtiene todos los productos
 *     description: Recupera una lista de todos los productos de la base de datos.
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   codigo:
 *                     type: string
 *                     example: COD001
 *                   descripcion:
 *                     type: string
 *                     example: Producto de prueba
 *                   proveedor:
 *                     type: string
 *                     example: Proveedor X
 *                   marca:
 *                     type: string
 *                     example: Marca Y
 *                   color:
 *                     type: string
 *                     example: Rojo
 *                   stock:
 *                     type: integer
 *                     example: 10
 *                   precio:
 *                     type: number
 *                     format: float
 *                     example: 99.99
 *       500:
 *         description: Error al ejecutar la consulta
 */
app.get('/productos', (req, res) => {
    const query = 'SELECT * FROM productos';
    conexion.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error executing query');
            return;
        }
        res.status(200).json(results);
    });
});

// Update (PUT)
/**
 * @swagger
 * /productos/{id}:
 *   put:
 *     summary: Actualiza un producto existente
 *     description: Modifica los datos de un producto existente en la base de datos.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del producto a actualizar
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               codigo:
 *                 type: string
 *                 example: COD001
 *               descripcion:
 *                 type: string
 *                 example: Producto actualizado
 *               proveedor:
 *                 type: string
 *                 example: Proveedor X actualizado
 *               marca:
 *                 type: string
 *                 example: Marca Y actualizada
 *               color:
 *                 type: string
 *                 example: Azul
 *               stock:
 *                 type: integer
 *                 example: 15
 *               precio:
 *                 type: number
 *                 format: float
 *                 example: 89.99
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente
 *       500:
 *         description: Error al ejecutar la consulta
 */
app.put('/productos/:id', (req, res) => {
    const { codigo, descripcion, proveedor, marca, color, stock, precio } = req.body;
    const { id } = req.params;
    const query = 'UPDATE productos SET codigo = ?, descripcion = ?, proveedor = ?, marca = ?, color = ?, stock = ?, precio = ? WHERE id = ?';
    conexion.query(query, [codigo, descripcion, proveedor, marca, color, stock, precio, id], (err, results) => {
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
 *     summary: Elimina un producto
 *     description: Elimina un producto de la base de datos usando su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del producto a eliminar
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Producto eliminado exitosamente
 *       500:
 *         description: Error al ejecutar la consulta
 */
app.delete('/productos/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM productos WHERE id = ?';
    conexion.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error executing query');
            return;
        }
        res.status(200).send('Producto eliminado exitosamente');
    });
});

// Read by ID (GET)
/**
 * @swagger
 * /productos/{id}:
 *   get:
 *     summary: Obtiene un producto por ID
 *     description: Recupera los datos de un producto específico de la base de datos utilizando su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del producto a recuperar
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Producto recuperado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 codigo:
 *                   type: string
 *                   example: COD001
 *                 descripcion:
 *                   type: string
 *                   example: Producto de prueba
 *                 proveedor:
 *                   type: string
 *                   example: Proveedor X
 *                 marca:
 *                   type: string
 *                   example: Marca Y
 *                 color:
 *                   type: string
 *                   example: Rojo
 *                 stock:
 *                   type: integer
 *                   example: 10
 *                 precio:
 *                   type: number
 *                   format: float
 *                   example: 99.99
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error al ejecutar la consulta
 */
app.get('/productos/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM productos WHERE id = ?';
    conexion.query(query, [id], (err, results) => {
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



// Inicia el server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
