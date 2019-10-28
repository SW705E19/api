import { Router, Request, Response } from "express";
import auth from "./auth";
import user from "./users";
import category from "./categories"

const routes = Router();

routes.use("/auth", auth);
routes.use("/users", user);
routes.use("/categories", category);

export default routes;
