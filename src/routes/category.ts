import { Router } from "express";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";
import CategoryController from "../controllers/categoryController"

const router = Router();

router.post("/create-category", [checkJwt,checkRole(["ADMIN"])], CategoryController.listAll );