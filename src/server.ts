import { app } from './app'
import { PsQLConnectionManager } from './database/connection'
import 'dotenv/config'
import logger from './logger'
import env from 'env-var'

const port = env.get('PORT').required().asPortNumber()

const psqlConnection = new PsQLConnectionManager()

psqlConnection.connect().then(() => {
  app.listen(port, () =>
    logger.info(`Server running at http://localhost:${port}`)
  )
  logger.info('PostgreSQL connected successfully')
})
