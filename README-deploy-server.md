Server deployment quick guide

This repo includes a simple Express + Nodemailer server in `server/`. Use this guide to deploy it to Railway/Render/Heroku.

1. Create the project and set environment variables (SMTP_* and TO_EMAIL)
2. Install dependencies and push to the host
3. For Railway/Render, connect the repository and set the build command to `npm install` and start command to `node index.js`.
4. Ensure your platform's env variables are set and the service is reachable over HTTPS.

When the server is deployed, update `index.html` form action to your deployed endpoint `https://<your-deploy>/api/contact`.