import { sign } from 'jsonwebtoken'
import authConfig from '../config/auth'

interface IHashProvider {
  generateJWT(user_id: string): Promise<string>
}

export default class JWTAuthentication implements IHashProvider {
  public async generateJWT(user_id: string): Promise<string> {
    const { secret, expiresIn } = authConfig.jwt

    const token = sign({}, secret, {
      subject: user_id,
      expiresIn
    })

    return token
  }
}
