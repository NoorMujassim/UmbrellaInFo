Umbrella InFo — Contact Server

This small Express server receives POSTs from the contact form and forwards them to your email via SMTP.

Getting started (local)

1. Install Node.js (16+).
2. From the `server` folder, install dependencies:

   npm install

3. Copy `.env.example` to `.env` and fill in your SMTP provider details (for example, Gmail SMTP or SendGrid SMTP).

4. Start the server:

   npm start

5. Update the contact form in `index.html` to point to your local server (if serving locally) or deployed URL. For local testing, change the `action` attribute on the `<form id="contact-form">` to `http://127.0.0.1:3000/api/contact`.

Notes
- Using Gmail as SMTP: you may need an App Password or enable "less secure apps" depending on your account settings.
- For production, deploy to a simple Node host (Heroku, Fly, Vercel serverless function, Render) and set environment variables there.
- If you want, I can also provide a serverless function version (Netlify/Azure/AWS Lambda) instead of a long-running server.
