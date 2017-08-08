const req = require.context('../icons', false, /\.svg$/)

module.exports = (filename) => {
  return req(`./${filename}.svg`)
}
