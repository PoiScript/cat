const path = require('path')
const glob = require('glob-all')
const PurifyCSSPlugin = require('purifycss-webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const config = {
  comm: require('./src/config/comm.json'),
  facts: require('./src/config/facts.json'),
  links: require('./src/config/links.json')
}

function htmlPluginConfig (lang) {
  const filename = `${lang === 'en' ? '' : lang + '/'}index.html`

  return {
    lang: lang,
    config: config,
    filename: filename,
    template: './src/index.pug',
    minify: {
      collapseWhitespace: true
    }
  }
}

module.exports = {
  entry: [
    './src/index.css',
    '@material/card/dist/mdc.card.css',
    '@material/toolbar/dist/mdc.toolbar',
    '@material/toolbar/dist/mdc.toolbar.css',
    '@material/layout-grid/dist/mdc.layout-grid.css'
  ],
  output: {
    path: path.resolve('build'),
    filename: 'main.js'
  },
  module: {
    loaders: [
      {
        test: /\.pug$/,
        use: 'pug-loader'
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader'
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      }
    ]
  },
  devServer: {
    open: true,
    openPage: '',
    compress: true,
    stats: 'minimal',
    contentBase: path.join(__dirname, 'build')
  },
  plugins: [
    new PurifyCSSPlugin({
      minimize: true,
      paths: glob.sync([
        path.join(__dirname, './src/*.pug'),
        path.join(__dirname, './src/components/*.pug')
      ])
    }),
    new ExtractTextPlugin('main.css'),
    new HtmlWebpackPlugin(htmlPluginConfig('en')),
    new HtmlWebpackPlugin(htmlPluginConfig('zh-Hans')),
    new HtmlWebpackPlugin(htmlPluginConfig('zh-Hant'))
  ]
}
