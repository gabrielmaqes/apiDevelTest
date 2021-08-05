import { Response, Request } from "express";
import { getRepository } from "typeorm";
import { v4 as uuid } from "uuid";
import multer from "multer";
import fs from "fs";
import path from "path";

import { User } from "../entity/User";
import { config } from "../../multer";

export const UserControlle = {
    async getUsers(request: Request, response: Response) {
        const userRepository = getRepository(User);
        const usersData = await userRepository.find();

        return response.status(200).json(usersData);
    },

    async createUser(request: Request, response: Response) {
        const idUser = uuid();
        const newFileName = Date.now() + idUser;
        const upload = multer(config(newFileName)).single("photo_uri");

        upload(request, response, async function (err) {
            if (err instanceof multer.MulterError) {
                response.status(500).json({ error: 1, payload: err });
            } else if (err) {
                response.status(500).json({
                    error: 1,
                    payload: err,
                    message: "Falha ao armazenar imagem.",
                });
            }

            const userRepository = getRepository(User);
            const { name, birthDate } = request.body;
            const image = request.file;

            const userData = new User();
            userData.id = idUser;
            userData.name = name;
            userData.birthDate = birthDate;
            userData.photo_uri = `uploads/${image!.filename}`;

            try {
                await userRepository.save(userData);
            } catch (err) {
                return response.status(500).json({
                    message: "Falha ao cadastrar usuário!",
                    error: err,
                });
            }

            return response.status(201).json({
                message: "Usuário cadastrado com sucesso!",
                payload: { id: image?.filename, url: image },
            });
        });
    },

    async updateUser(request: Request, response: Response) {
        const { id } = request.params;
        const userRepository = getRepository(User);
        const user = await userRepository.find({ where: { id: id } });

        const oldFileName = user[0].photo_uri.split("/")[1];

        const newFileName = Date.now() + id;

        if (user.length) {
            const upload = multer(config(newFileName, oldFileName)).single(
                "photo_uri"
            );

            upload(request, response, async function (err) {
                if (err instanceof multer.MulterError) {
                    response.status(500).json({ error: 1, payload: err });
                } else if (err) {
                    response.status(500).json({
                        error: 1,
                        payload: err,
                        message: "Erro não identificado",
                    });
                }
                const { name, birthDate } = request.body;
                const imageFile = request.file;

                try {
                    await userRepository.update(id, {
                        name,
                        birthDate,
                        photo_uri: imageFile
                            ? `uploads/${imageFile?.filename}`
                            : user[0].photo_uri,
                    });
                } catch (err) {
                    return response
                        .status(500)
                        .json({ message: "Falha ao atualizar usuário!" });
                }

                return response
                    .status(201)
                    .json({ message: "Usuário atualizado com sucesso!" });
            });
        } else {
            return response
                .status(404)
                .json({ message: "Usuário não encontrado na base de dados!" });
        }
    },

    async deleteUser(request: Request, response: Response) {
        const userRepository = getRepository(User);
        const { id } = request.params;

        const user = await userRepository.find({ where: { id: id } });
        const uri = user[0].photo_uri.split("/");
        const imagePath = path.join(
            __dirname,
            "..",
            "..",
            "public",
            uri[0],
            uri[1]
        );

        try {
            fs.unlinkSync(imagePath);
            await userRepository.delete(id);
        } catch (err) {
            return response
                .status(500)
                .json({ message: "Falha ao remover usuário!" });
        }

        return response
            .status(201)
            .json({ message: "Usuário removido com sucesso!" });
    },
};
