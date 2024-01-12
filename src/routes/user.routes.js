import { Router } from "express";
import { createUser,getUsers,getRoleNameById } from "../controllers/user.controller.js";
import { isAdmin, verifyToken } from "../middlewares/authJwt.js";
import { checkExistingUser } from "../middlewares/verifySignup.js";

const router = Router();

router.post("/", [verifyToken, isAdmin, checkExistingUser], createUser);
router.get("/",getUsers);
router.get("/:id",getRoleNameById);

export default router;
