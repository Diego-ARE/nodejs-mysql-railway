import express from 'express';
const router = express.Router();


//VALIDAR USSER & PASS
//VALIDAR USUARIO & PASS
/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       required:
 *         - usuario
 *         - pass
 *       properties:
 *         usuario:
 *           type: string
 *           description: Nombre de usuario
 *         pass:
 *           type: string
 *           description: Contraseña del usuario (asegúrate de encriptar la contraseña en producción)
 *       example:
 *         usuario: usuarioEjemplo
 *         pass: contraseñaEjemplo
 */

/**
 * @swagger
 * /usuarios/validar:
 *   post:
 *     summary: Validar usuario y contraseña
 *     tags: [Usuario]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       200:
 *         description: Usuario validado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID del usuario
 *                 usuario:
 *                   type: string
 *                   description: Nombre de usuario
 *                 pass:
 *                   type: string
 *                   description: Contraseña del usuario (asegúrate de encriptar la contraseña en producción)
 *               example:
 *                 id: 1
 *                 usuario: usuarioEjemplo
 *                 pass: contraseñaEjemplo
 *       401:
 *         description: Usuario o contraseña incorrectos
 *       500:
 *         description: Error ejecutando la consulta
 */

router.post('/', (req, res) => {
    const { usuario, pass } = req.body;
    const query = 'SELECT * FROM usuarios WHERE usuario = ? AND pass = ?';
    req.db.query(query, [usuario, pass], (err, results) => {
        if (err) {
            console.error('Error ejecutando la consulta:', err);
            res.status(500).send('Error ejecutando la consulta');
            return;
        }
        if (results.length > 0) {
            // Si se encuentra el usuario, devolvemos sus datos
            const userData = {
                id: results[0].id,  // Asegúrate de que 'id' es el nombre correcto de la columna en tu base de datos
                usuario: results[0].usuario,
                pass: results[0].pass
            };
            res.status(200).json(userData);
        } else {
            res.status(401).send('Usuario o contraseña incorrectos');
        }
    });
});




export default router;
