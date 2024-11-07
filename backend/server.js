// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // Or use your email provider's SMTP settings
  auth: {
    user: 'your-email@gmail.com', // Replace with your email
    pass: 'your-email-password'    // Replace with your email password
  }
});

// Handle form submission
app.post('/send-email', (req, res) => {
  const { name, email, address, message } = req.body;

  const mailOptions = {
    from: email,
    to: 'your-email@gmail.com', // Replace with the email you want to receive submissions
    subject: `New message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nAddress: ${address}\nMessage: ${message}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ error: error.toString() });
    }
    res.status(200).json({ message: 'Email sent successfully!' });
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
