import { Router } from "express";
import { 
    asignarBonosAutomatico,
    getBonos,
    getBonosPorMedico,
    asignarBonoManual
} from "../controllers/bonos.controller.js";

const router = Router();

// Endpoint principal para el CRON JOB de AWS
router.post("/bonos/asignar-automatico", asignarBonosAutomatico);

// Endpoints adicionales para consultas y gestión
router.get("/bonos", getBonos);
router.get("/bonos/medico/:medico_id", getBonosPorMedico);
router.post("/bonos/asignar-manual", asignarBonoManual);

export default router;
