import { app } from './app'
import { PsQLConnectionManager } from './database/connection'
import 'dotenv/config';

const port = process.env.PORT
const psqlConnection = new PsQLConnectionManager()

psqlConnection.connect().then(() => {
  app.listen(port, () =>
    console.log(`Server running at http://localhost:${port}`)
  )
  console.log('PostgreSQL connected successfully')
})
