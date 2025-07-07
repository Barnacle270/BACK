import { Router } from "express";
import { getBoletas, createBoletas, getBoletasPorDni } from "../controllers/boletas.controller.js";
import fileUpload from "express-fileupload";
import { validatedni } from "../middlewares/validateDNI.js";
import { createBoletasSchema } from "../schemas/boletas.schema.js";
import { validateSchema } from '../middlewares/validator.middleware.js';


const router = Router();

router.get("/boletas", getBoletas);

router.post("/boletas", fileUpload({
    useTempFiles: true,
    tempFileDir: "./uploads",
}), validateSchema(createBoletasSchema), createBoletas);

router.get("/boletasdni", validatedni, getBoletasPorDni)

export default router;
