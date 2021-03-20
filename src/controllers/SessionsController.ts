import { classToClass } from "class-transformer";
import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";

import AppError from "../errors/AppError";
import { UserRepository } from "../database/repositories/UserRepository";
import BCryptHashProvider from "../utils/bcrypt";
import JWTAuthentication from "../utils/generateAuth";


const hashProvider = new BCryptHashProvider();
const jwtAuthLogin = new JWTAuthentication();


export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const userRepository = getCustomRepository(UserRepository);

    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new AppError("Email/Password does not match.", 401);
    }

    const passwordMatched = await hashProvider.compareHash(
      password,
      user.password
    );

    if (!passwordMatched) {
      throw new AppError("Email/Password does not match.", 401);
    }

    const token = await jwtAuthLogin.generateJWT(user.id)

    return response.header('x-access-token', token).json({ status: "ok", user: classToClass(user) });
  }

}
