import { Router } from "express";
import multer from "multer";
import { UserControlle } from "./controllers/Users";
import { config } from "../multer";

export const routes = Router();

routes.get("/users", UserControlle.getUsers);
routes.post("/user", UserControlle.createUser);
routes.put("/user/:id", UserControlle.updateUser);
routes.delete("/user/:id", UserControlle.deleteUser);

export default routes;
