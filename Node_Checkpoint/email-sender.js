const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "YOUR_EMAIL@gmail.com",
    pass: "YOUR_APP_PASSWORD",
  },
});

const mailOptions = {
  from: "YOUR_EMAIL@gmail.com",
  to: "YOUR_EMAIL@gmail.com",
  subject: "Hello from Node.js!",
  text: "This email was sent using Nodemailer and Node.js.",
};

transporter.sendMail(mailOptions, (err, info) => {
  if (err) {
    console.error("Error:", err);
  } else {
    console.log("Email sent:", info.response);
  }
});
