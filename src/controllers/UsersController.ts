import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import { classToClass } from "class-transformer";
import { UserRepository } from '../database/repositories/UserRepository'
import AppError from "../errors/AppError";
import BCryptHashProvider from "../utils/bcrypt";
import JWTAuthentication from "../utils/generateAuth";

const hashProvider = new BCryptHashProvider();
const jwtAuthLogin = new JWTAuthentication();

export default class UsersController {
  async show(request: Request, response: Response): Promise<Response> {
      const usersRepository = getCustomRepository(UserRepository)
  
      const users = await usersRepository.find()
  
      return response.status(201).json({ users })

  }

  async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body
    const usersRepository = getCustomRepository(UserRepository)


    const userAlreadyExists = await usersRepository.findOne({ email })
    if (userAlreadyExists) {
      throw new AppError("Email/Password does not match.", 401);
    }
    const hashedPassword = await hashProvider.generateHash(password);

    const user = usersRepository.create({ 
      email, 
      password: hashedPassword,
    })

    await usersRepository.save(user)

    const token = await jwtAuthLogin.generateJWT(user.id)

    return response.header('x-access-token', token).status(201).json({ status: "ok", user: classToClass(user) });
  }
}
