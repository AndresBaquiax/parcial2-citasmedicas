import { Router } from "express";
import { getMedicos, postMedico, putMedico, deleteMedico } from "../controllers/medicos.controller.js";

const router = Router();

router.get("/medicos", getMedicos);
router.post("/medicos", postMedico);
router.put("/medicos/:medico_id", putMedico);
router.delete("/medicos/:medico_id", deleteMedico);

export default router;
