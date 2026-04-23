const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ryan.coly999@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const mailOptions = {
  from: 'ryan.coly999@gmail.com',
  to: 'ryan.coly999@gmail.com',
  subject: 'Test Node.js Nodemailer',
  text: 'Bonjour ! Cet email a été envoyé depuis Node.js avec nodemailer.',
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Erreur :', error.message);
  } else {
    console.log('Email envoyé :', info.response);
  }
});
