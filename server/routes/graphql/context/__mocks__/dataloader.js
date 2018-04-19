class DataLoader {
  constructor(fn) {
    fn([]);
    this.values = [];
  }
  load(value) {
    this.values.push(value);
    return value;
  }
  loadMany(values) {
    values.forEach(value => {
      this.values.push(value);
    });
    return values;
  }
}

module.exports = DataLoader;
