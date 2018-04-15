const sgMail = jest.genMockFromModule('@sendgrid/mail');

sgMail.setApiKey = jest.fn();
sgMail.send = jest.fn(() => Promise.resolve());

module.exports = sgMail;
