Deploying the contact server (Express + Nodemailer)

This small guide walks through deploying the `server/` example (Express + Nodemailer) to a typical PaaS like Railway, Render, or Heroku.

1. Prepare environment variables
   - Copy `.env.example` to `.env` and fill the values:
     - SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE (true/false), TO_EMAIL

2. Install dependencies and test locally
   - npm install
   - npm start  # server listens on PORT or 3000 by default

3. Deploy to a host
   - Railway/Render: create a new project, connect repo, set environment variables in the platform settings, and trigger a deploy.
   - Heroku: git push heroku main (set config vars via heroku dashboard or CLI)

4. Update `index.html` contact form
   - If you deploy the server, change the contact form `action` from FormSubmit to your deployed endpoint, e.g.:
     <form id="contact-form" action="https://your-deploy-url.com/api/contact" method="POST">

Security notes
- Use environment variables for SMTP credentials.
- Consider adding rate-limiting and simple anti-spam (honeypot already present) on the server endpoint.

If you want, I can prepare a `Procfile` or a simple Dockerfile for container deployment.