const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const config = {
  comm: require('./src/config/comm.json'),
  facts: require('./src/config/facts.json'),
  links: require('./src/config/links.json')
}

function pluginConfig (lang) {
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
    '@material/list/dist/mdc.list.css',
    '@material/toolbar/dist/mdc.toolbar',
    '@material/toolbar/dist/mdc.toolbar.css',
    '@material/elevation/dist/mdc.elevation.css',
    '@material/grid-list/dist/mdc.gridList',
    '@material/grid-list/dist/mdc.grid-list.css',
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
    new ExtractTextPlugin('main.css'),
    new HtmlWebpackPlugin(pluginConfig('en')),
    new HtmlWebpackPlugin(pluginConfig('zh-Hans')),
    new HtmlWebpackPlugin(pluginConfig('zh-Hant'))
  ]
}
