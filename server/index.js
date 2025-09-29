require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

if(!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.TO_EMAIL){
  console.warn('SMTP configuration incomplete. Please set SMTP_HOST, SMTP_USER, SMTP_PASS and TO_EMAIL in .env');
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

app.post('/api/contact', async (req, res) => {
  try{
    const { name, email, message, _honey } = req.body;
    if(_honey) return res.status(200).json({ ok: true, note: 'bot' });
    if(!name || !email || !message) return res.status(400).json({ error: 'Missing fields' });

    const mail = {
      from: `${name} <${email}>`,
      to: process.env.TO_EMAIL || 'noormujassimraza@gmail.com',
      subject: `Contact from Umbrella InFo: ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p>${message}</p>`
    };

    const info = await transporter.sendMail(mail);
    return res.json({ ok: true, info });
  }catch(err){
    console.error('send mail failed', err);
    return res.status(500).json({ error: 'send_failed' });
  }
});

app.listen(PORT, ()=> console.log(`Contact server listening on ${PORT}`));
