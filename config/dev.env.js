'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://localhost:8080/wumei-server"'
  //BASE_API: '"http://10.20.11.196:8080/sumuji-server"'
})
