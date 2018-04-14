// const sgMail = require('@sendgrid/mail');

// sgMail.setApiKey(process.env.SENDGRID_API_KEY || 'abc')

class sgMail {
  static setApiKey(key) {
    this.key = key;
    // Do nothing
  }
}

module.exports = sgMail;
