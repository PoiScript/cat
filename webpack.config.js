const glob = require('glob')
const path = require('path')
const webpack = require('webpack')
const PurifyCSSPlugin = require('purifycss-webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const config = [
  require('./src/config/facts.json'),
  require('./src/config/comm.json'),
  require('./src/config/links.json')
]

function htmlPluginConfig (lang) {
  const filename = `${lang === 'en' ? '' : lang + '/'}index.html`

  return {
    lang: lang,
    config: config,
    filename: filename,
    template: './src/index.hbs',
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true
    }
  }
}

module.exports = {
  entry: [
    './src/index.css',
    '@material/card/dist/mdc.card.css',
    '@material/theme/dist/mdc.theme.css',
    '@material/layout-grid/dist/mdc.layout-grid.css'
  ],
  output: {
    path: path.resolve('build'),
    filename: 'main.[hash:8].js'
  },
  module: {
    loaders: [
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
      },
      {
        test: /\.hbs$/,
        loader: 'handlebars-loader',
        query: {
          helperDirs: [
            path.join(__dirname, 'src', 'helpers')
          ],
          partialDirs: [
            path.join(__dirname, 'src', 'partials')
          ]
        }
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
      moduleExtensions: ['.hbs'],
      paths: glob.sync(path.join(__dirname, 'src/**/*.hbs'))
    }),
    new webpack.optimize.UglifyJsPlugin({
      comments: false,
      compress: {
        warnings: false
      }
    }),
    new ExtractTextPlugin('[name].[hash:8].css'),
    new HtmlWebpackPlugin(htmlPluginConfig('en')),
    new HtmlWebpackPlugin(htmlPluginConfig('zh-Hans')),
    new HtmlWebpackPlugin(htmlPluginConfig('zh-Hant'))
  ]
}
