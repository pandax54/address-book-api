import 'reflect-metadata'
import 'express-async-errors'
import 'dotenv/config'
import swaggerUi from 'swagger-ui-express'
import logger from './logger'
import express, { NextFunction, Request, Response } from 'express'
import AppError from './errors/AppError'
import router from './routes'
import { errors } from 'celebrate'
import cors from 'cors'
import swaggerDocument from '../swagger.json'

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
