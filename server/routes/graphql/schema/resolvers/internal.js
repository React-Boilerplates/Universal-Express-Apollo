const sgMail = require('@sendgrid/mail');
const Twilio = require('twilio');

sgMail.setApiKey(process.env.SENDGRID_API_KEY || 'abc');
const twilioClient = new Twilio(
  process.env.TWILIO_ACCT_ID || 'abc',
  process.env.TWILIO_AUTH_TOKEN || 'abc'
);

const internalResolvers = {
  Mutation: {
    sendSms: async (
      parent,
      { message: { from = process.env.TWILIO_FROM_NUMBER, ...msg } }
    ) => {
      const message = await twilioClient.messages.create({
        from,
        ...msg
      });
      return message.sid;
    },
    sendEmail: async (
      parent,
      {
        message: {
          from = process.env.DEFAULT_EMAIL_REPLY_TO,
          replyTo = process.env.DEFAULT_EMAIL_REPLY_TO,
          ...message
        }
      }
    ) => {
      await sgMail.send({
        from,
        replyTo,
        ...message
      });
      return 'Success!';
    }
  }
};

export default internalResolvers;
