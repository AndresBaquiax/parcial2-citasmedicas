import express from 'express';
import dotenv from 'dotenv';
import config from './config.js';
import cors from 'cors'; 
//Import routes
import medicosRoutes from './routes/medicos.routes.js';
import pacienteRoutes from './routes/paciente.routes.js';
import citasRoutes from './routes/citas.routes.js';

dotenv.config();
const app = express();

//Settings
app.set('port', config.port);

//Middlewares
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: false}));

//Routes
app.use(medicosRoutes);
app.use(citasRoutes);
app.use(pacienteRoutes);


export default app;