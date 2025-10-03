import { Router } from "express";
import { 
    getCitas, 
    getCitaById, 
    postCita, 
    putCita, 
    deleteCita 
} from "../controllers/citas.controller.js";

const router = Router();

router.get("/citas", getCitas);
router.get("/citas/:id", getCitaById);
router.post("/citas", postCita);
router.put("/citas/:id", putCita);
router.delete("/citas/:id", deleteCita);

export default router;
