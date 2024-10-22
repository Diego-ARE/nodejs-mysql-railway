import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import productosRoutes from './routes/productos.mjs';
import proveedoresRoutes from './routes/proveedores.mjs';
import usuariosRoutes from './routes/usuarios.mjs';
import clientesRoutes from './routes/clientes.mjs';
import configRoutes from './routes/config.mjs';
import ventasRoutes from './routes/ventas.mjs';
import detalleRoutes from './routes/detalle.mjs';
import facturacionesRoutes from './routes/facturaciones.mjs';
import {PORT, DB_HOST,DB_NAME,DB_PASSWORD,DB_PORT,DB_USER} from './config.js';

const app = express();
app.use(bodyParser.json());

// Configuración de la conexión a la base de datos
const conexion = mysql.createConnection({
    host: "DB_HOST",
    database: "DB_NAME",
    user: "DB_USER",
    password: "DB_PASSWORD",
    port: "DB_PORT"
});

conexion.connect(function(err) {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connection to database established successfully');
});

// Middleware para agregar la conexión a la base de datos a las solicitudes
app.use((req, res, next) => {
    req.db = conexion;
    next();
});

// Configuración de Swagger
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
    apis: ['./routes/*.mjs'] // Ruta del archivo de rutas
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Usa las rutas de productos
app.use('/productos', productosRoutes);
app.use('/proveedores', proveedoresRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/clientes', clientesRoutes);
app.use('/config', configRoutes);
app.use('/ventas', ventasRoutes);
app.use('/detalle', detalleRoutes);
app.use('/facturaciones', facturacionesRoutes);

// Inicia el servidor
app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
});
