// const twil = jest.genMockFromModule('twilio');
// console.log(twil);
const twilio = (id, token) => ({
  id,
  token,
  messages: {
    create: jest.fn(() => ({ id: 'asdf' }))
  }
});

// const twilio = require('twilio');

module.exports = twilio;
