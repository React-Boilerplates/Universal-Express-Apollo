// const twil = jest.genMockFromModule('twilio');
// console.log(twil);
class Twilio {
  constructor(id, token) {
    this.id = id;
    this.token = token;
  }

  messages = {
    create: jest.fn(() => ({ id: 'asdf' }))
  };
}

// const Twilio = require('Twilio');

module.exports = Twilio;
