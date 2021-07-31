import { Response, Request } from "express";
import { getRepository } from "typeorm";
import { v4 as uuid } from "uuid";
import { User } from "../entity/User";

export const UserControlle = {
    async getUsers(request: Request, response: Response) {
        const userRepository = getRepository(User);
        const usersData = await userRepository.find();

        return response.status(200).json(usersData);
    },

    async createUser(request: Request, response: Response) {
        const userRepository = getRepository(User);
        const { name, birthDate, photo_uri } = request.body;

        const userData = new User();
        userData.id = uuid();
        userData.name = name;
        userData.birthDate = birthDate;
        userData.photo_uri = photo_uri;

        console.log(userData);

        try {
            await userRepository.save(userData);
        } catch (err) {
            return response
                .status(500)
                .json({ message: "Falha ao cadastrar usuário!" });
        }

        return response
            .status(201)
            .json({ message: "Usuário cadastrado com sucesso!" });
    },

    async updateUser(request: Request, response: Response) {
        const userRepository = getRepository(User);
        const { id } = request.params;
        const userData = request.body;

        try {
            await userRepository.update(id, userData);
        } catch (err) {
            return response
                .status(500)
                .json({ message: "Falha ao atualizar usuário!" });
        }

        return response
            .status(201)
            .json({ message: "Usuário atualizado com sucesso!" });
    },

    async deleteUser(request: Request, response: Response) {
        const userRepository = getRepository(User);
        const { id } = request.params;

        try {
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
