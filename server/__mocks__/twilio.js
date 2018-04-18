class Twilio {
  constructor(id, token) {
    this.id = id;
    this.token = token;
  }

  messages = {
    create: jest.fn(() => ({ id: '' }))
  };
}

// const Twilio = require('Twilio');

module.exports = Twilio;
