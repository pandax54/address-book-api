// eslint-disable-next-line @typescript-eslint/no-var-requires
const env = require('env-var')
// https://www.npmjs.com/package/pg-connection-string
// https://github.com/typeorm/typeorm/blob/master/docs/using-ormconfig.md
module.exports = {
  type: 'postgres',
  url: env.get('DATABASE_URL').required().asString(),
  synchronize: false,
  logging: false,
  migrations: ['./src/database/migrations/*.ts'],
  entities: ['./src/database/models/*.ts'],
  cli: {
    migrationsDir: './src/database/migrations'
  },
  extra: {
    ssl:
      env.get('ENV').asString() === 'dev'
        ? false
        : { rejectUnauthorized: false }
  }
}
