import { sign  } from "jsonwebtoken";
import authConfig from "../config/auth";

interface IHashProvider {
  generateJWT(userId: string): Promise<string>;
}

export default class JWTAuthentication implements IHashProvider {
  public async generateJWT(userId: string, ): Promise<string> {

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: userId,
      expiresIn,
    });
    
    return token;
  }

}