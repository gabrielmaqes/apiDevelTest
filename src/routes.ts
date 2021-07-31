import { Router } from "express";
import { UserControlle } from "./controllers/Users";

export const routes = Router();

routes.get("/users", UserControlle.getUsers);
routes.post("/user", UserControlle.createUser);
routes.put("/user/:id", UserControlle.updateUser);
routes.delete("/user/:id", UserControlle.deleteUser);

export default routes;
