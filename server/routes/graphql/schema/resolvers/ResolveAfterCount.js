class ResolveAfterCount {
  constructor(count, resolve, reject) {
    this.count = count;
    this.resolve = resolve;
    this.reject = reject;
    this.items = [];
    this.errors = [];
    this.resolves = [];
  }
  addItem(item) {
    this.items.push(item);
    this.errors.push(undefined);
    this.attemptCallback();
  }

  attemptCallback() {
    if (this.items.length >= this.count) {
      if (this.items.every(value => value === undefined))
        return this.reject(this.errors);
      this.resolves.forEach(resolve => {
        resolve(this.items);
      });
      this.resolve(this.items);
    }
  }

  addError(error) {
    this.errors.push(error);
    this.items.push(undefined);
    this.attemptCallback();
  }

  addCallbacks(...callbacks) {
    callbacks.forEach(callback => {
      this.callbacks.push(callback);
    });
  }
}

module.exports = ResolveAfterCount;
