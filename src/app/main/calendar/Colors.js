const colors = [
  {
    regular: '#f4afaf',
    hover: '#ff8787'
  }, {
    regular: '#f595e2',
    hover: '#BF0099'
  }, {
    regular: '#c59df7',
    hover: '#5500BF'
  }, {
    regular: '#8493fb',
    hover: '#0019BF'
  }, {
    regular: '#87daff',
    hover: '#0084BF'
  }, {
    regular: '#87fcc1',
    hover: '#00BF5F'
  }, {
    regular: '#febd84',
    hover: '#BF5900'
  }
]
class Colors {
  constructor () {
    this.index = 0
  }
  register (key) {
    this[key] = colors[this.index++ % colors.length]
  }
  get (key) {
    if (!this[key]) {
      this.register(key)
    }
    return this[key]
  }
}
export default new Colors()
