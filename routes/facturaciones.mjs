import express from 'express';
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Venta:
 *       type: object
 *       properties:
 *         venta_id:
 *           type: integer
 *           description: ID de la venta
 *         cliente:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               description: ID del cliente
 *             nombre:
 *               type: string
 *               description: Nombre del cliente
 *             dpi:
 *               type: string
 *               description: DPI del cliente
 *         vendedor:
 *           type: integer
 *           description: ID del vendedor
 *         total:
 *           type: number
 *           format: float
 *           description: Total de la venta
 *         fecha:
 *           type: string
 *           format: date
 *           description: Fecha de la venta
 *         detalles:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               cod_pro:
 *                 type: string
 *                 description: Código del producto
 *               cantidad:
 *                 type: integer
 *                 description: Cantidad del producto
 *               precio:
 *                 type: number
 *                 format: float
 *                 description: Precio del producto
 *               producto_descripcion:
 *                 type: string
 *                 description: Descripción del producto
 *               marca:
 *                 type: string
 *                 description: Marca del producto
 *               color:
 *                 type: string
 *                 description: Color del producto
 *       example:
 *         venta_id: 1
 *         cliente:
 *           id: 1
 *           nombre: Juan Pérez
 *           dpi: 123456789
 *         vendedor: 2
 *         total: 500.00
 *         fecha: 2024-09-05
 *         detalles:
 *           - cod_pro: P001
 *             cantidad: 2
 *             precio: 100.00
 *             producto_descripcion: Producto A
 *             marca: Marca A
 *             color: Rojo
 */

/**
 * @swagger
 * /ventas:
 *   get:
 *     summary: Obtener todas las ventas
 *     tags: [Venta]
 *     responses:
 *       200:
 *         description: Ventas obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Venta'
 *       500:
 *         description: Error al obtener las ventas
 */

router.get('/', (req, res) => {
    const queryVentas = `
        SELECT v.id AS venta_id, v.cliente, v.vendedor, v.total, v.fecha, 
               c.nombre AS cliente_nombre, c.dpi, d.cod_pro, d.cantidad, d.precio, 
               p.descripcion AS producto_descripcion, p.marca, p.color
        FROM ventas v
        JOIN clientes c ON v.cliente = c.id
        JOIN detalle d ON v.id = d.id_venta
        JOIN productos p ON d.cod_pro = p.codigo
        ORDER BY v.fecha DESC;
    `;

    req.db.query(queryVentas, (err, results) => {
        if (err) {
            console.error('Error al obtener las ventas:', err);
            return res.status(500).send('Error al obtener las ventas.');
        }

        // Organizar los resultados en un formato adecuado
        const ventas = [];
        const ventasMap = {};

        results.forEach(row => {
            if (!ventasMap[row.venta_id]) {
                ventasMap[row.venta_id] = {
                    venta_id: row.venta_id,
                    cliente: {
                        id: row.cliente,
                        nombre: row.cliente_nombre,
                        dpi: row.dpi
                    },
                    vendedor: row.vendedor,
                    total: row.total,
                    fecha: row.fecha,
                    detalles: []
                };
                ventas.push(ventasMap[row.venta_id]);
            }

            ventasMap[row.venta_id].detalles.push({
                cod_pro: row.cod_pro,
                cantidad: row.cantidad,
                precio: row.precio,
                producto_descripcion: row.producto_descripcion,
                marca: row.marca,
                color: row.color
            });
        });

        res.json(ventas);
    });
});

export default router;
