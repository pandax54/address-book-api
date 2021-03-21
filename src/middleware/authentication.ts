import { Request, Response, NextFunction } from "express";
import { verify, decode  } from "jsonwebtoken";

export default function verifyJWT(req: Request, res: Response, next: NextFunction){
    const headerParams = req.headers;
    const token: string = String(headerParams['x-access-token']);

    if (!token) return res.status(401).send("Access denied. No token provided.")

    try {
      const decoded = decode(token)
      req.user = decoded.sub
      verify(token, process.env.APP_SECRET)
      next()

    } catch (error) {
      return res.status(401).send("Invalid token.")
    }
    
}