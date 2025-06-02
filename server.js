const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const otpStore = new Map(); // In-memory storage

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

app.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();
  otpStore.set(email, otp);

  // Send OTP via email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your_email@gmail.com',
      pass: 'your_app_password' // Use Gmail App Password
    }
  });

  await transporter.sendMail({
    from: 'Ericoin <your_email@gmail.com>',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`
  });

  res.json({ success: true, message: 'OTP sent' });
});

app.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  const storedOtp = otpStore.get(email);

  if (storedOtp === otp) {
    otpStore.delete(email);
    res.json({ success: true });
  } else {
    res.json({ success: false, message: 'Invalid OTP' });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
