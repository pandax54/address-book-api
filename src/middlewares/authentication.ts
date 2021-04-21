import { Request, Response, NextFunction } from 'express'
import { verify, decode } from 'jsonwebtoken'
import authConfig from '../config/auth'

const { secret } = authConfig.jwt

export default function verifyJWT(
  req: Request,
  res: Response,
  next: NextFunction
): Response<unknown, Record<string, unknown>> | void {
  const headerParams = req.headers
  const token = String(headerParams['x-access-token'])

  if (!token) return res.status(401).json({error: 'Access denied. No token provided.'})

  try {
    const decoded = decode(token)
    req.user = decoded?.sub

    verify(token, secret)
    return next()
  } catch (error) {
    return res.status(401).send('Invalid token.')
  }
}
