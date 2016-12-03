/**
 * Sagui configuration object
 * see: http://sagui.js.org/
 */

const fs = require('fs')
const path = require('path')
const Webpack = require('webpack')

const env = process.env.NODE_ENV
const assetPath = (env === 'production')
  ? path.join(__dirname, '../public/assets')
  : path.join(__dirname, 'dist')

const output = (env === 'production')
  ? { publicPath: '/assets/', path: assetPath }
  : { publicPath: '/' }

const backendPort = process.env.BACKEND_PORT || 7274

const plugins = [
  new Webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(env)
  })
]

module.exports = {
  pages: [
    'index'
  ],
  style: {
    cssModules: false
  },
  develop: {
    proxy: {
      '/api/*': {
        target: `http://localhost:${backendPort}`,
        secure: false
      }
    }
  },
  webpack: {
    output: output,
    plugins: plugins,
    module: {
      preLoaders: [
        {
          test: /src\/index\.scss/, // the main scss/css file
          loader: 'webpack-inject-css-loader?appPath=./src&debug=false'
        }
      ]
    },
    externals: {
      'cheerio': 'window',
      'react/addons': true,
      'react/lib/ExecutionEnvironment': true,
      'react/lib/ReactContext': true
    },
    babel: {
      babelrc: false,
      presets: ['sagui']
    }
  }
}
