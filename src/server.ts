import "reflect-metadata";
import routes from "./routes";
import express from "express";
import { createConnection } from "typeorm";

createConnection();
const server = express();

server.use(express.json());
server.use(routes);

server.listen(process.env.PORT || 3333, function () {
    console.log("Server is running...");
});
