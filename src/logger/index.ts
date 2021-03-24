const pino = require('pino')({
  level: 'debug',
  prettyPrint: {
    levelFirst: true,
    colorize: true
  }
})

export default pino
