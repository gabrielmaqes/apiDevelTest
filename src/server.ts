import "reflect-metadata";
import routes from "./routes";
import express from "express";
import { createConnection } from "typeorm";
const cors = require("cors");

createConnection();
const server = express();

server.use(cors());
server.use(express.json());
server.use(express.static("public"));
server.use(routes);

server.listen(process.env.PORT || 3333, function () {
    console.log("Server is running...");
});
