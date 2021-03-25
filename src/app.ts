import 'reflect-metadata'
import 'dotenv/config'
import 'express-async-errors'
import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import { errors } from 'celebrate'
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from '../swagger.json'
import AppError from './errors/AppError'
import logger from './logger'
import router from './routes'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/v1', router)

const options = {
  explorer: true
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options))

app.use(errors())

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message
    })
  }

  logger.debug(err)

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error.'
  })
})

export { app }
