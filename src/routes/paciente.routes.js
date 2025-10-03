import { Router } from "express";
import { getPacientes, postPaciente, putPaciente} from "../controllers/paciente.controller.js";

const router = Router();

router.get("/pacientes", getPacientes);
router.post("/pacientes", postPaciente);
router.put("/pacientes/:idempleado", putPaciente);

export default router;