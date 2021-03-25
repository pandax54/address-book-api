// eslint-disable-next-line @typescript-eslint/no-var-requires
const env = require('env-var')

module.exports = {
  type: 'postgres',
  url: env.get('DATABASE_URL').required().asString(),
  synchronize: false,
  logging: false,
  migrations: ['dist/src/database/migrations/*.js'],
  entities: ['dist/src/database/models/*.js'],
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
