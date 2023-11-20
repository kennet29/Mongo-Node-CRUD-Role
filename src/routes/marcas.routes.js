import { Router } from "express";
import {

  getAllMarcas,
  DeleteMarcas,
  CreateMarca,
  UpdateMarca
} from "../controllers/marcas.controller.js";
import { verifyToken, isModerator, isAdmin } from "../middlewares/authJwt.js";

const router = Router();


router.get("/", getAllMarcas); // Rota para obter todas as marcas
router.delete("/:id",  DeleteMarcas); // Exemplo de uso de middleware para verificar se é um administrador
router.post("/",  CreateMarca); // Exemplo de uso de middleware para verificar se é um moderador
router.put("/:id", UpdateMarca); // Rota para atualizar uma marca com base no ID

export default router