const path = require('path')
const confus = require('confus')
const lodash = require('lodash')
const morgan = require('morgan')
const compression = require('compression')

module.exports = app => {
  // will setup our configuration object depending on environment
  let config = confus({
    profiles: {
      production: [
        'etc/general',
        'etc/production'
      ],
      development: [
        'etc/general',
        'etc/development'
      ],
      test: [
        'etc/general',
        'etc/test'
      ]
    },
    root: path.join(__dirname, '/../../')
  })

  confus.at('production', () => {
    app.use(morgan())
    app.use(compression())
  })

  lodash.merge(app.settings, config)
}
