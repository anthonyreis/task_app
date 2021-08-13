const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'matheus.anthony1@gmail.com',
        subject: 'Thanks for joining in',
        text: `Welcome to the app ${name}. Let me know how you get along with the app.`
    });
};

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'matheus.anthony1@gmail.com',
        subject: 'Sad to see you go',
        text: `Its sad to see you go ${name}. Could we have done anything different to prevent that ?`
    });
};

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
};