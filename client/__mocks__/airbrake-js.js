class Airbrake {
  constructor(opts) {
    this.opts = opts;
  }
  notify(...args) {
    this.args = args;
  }
}

module.exports = Airbrake;
