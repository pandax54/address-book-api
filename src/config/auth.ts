import env from 'env-var'

export default {
  jwt: {
    secret: env.get('APP_SECRET').default('default').asString(),
    expiresIn: '1d'
  }
}
