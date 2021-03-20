import 'reflect-metadata'
import 'express-async-errors'
import "dotenv/config";

import express, { NextFunction, Request, Response } from 'express'
import AppError from "./errors/AppError";
import router from './routes'
import { errors } from 'celebrate';
import cors from 'cors';

const app = express()
app.use(cors());
app.use(express.json())
app.use(router)

app.use(errors());


app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  console.log(err);

  return response.status(500).json({
    status: "error",
    message: "Internal server error.",
  });
});

export { app }
