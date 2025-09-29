Railway quick deploy

1. Create a Railway project and connect your GitHub repo.
2. Set the Environment Variables (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE, TO_EMAIL).
3. In Railway, pick the `server/` folder as the subdirectory for deployment.
4. Railway will detect Node and run `npm install` and `npm start` (index.js), or use the provided `Dockerfile`.
5. After deployment, set the contact form `action` in `index.html` to your Railway URL: `https://<railway-app>.up.railway.app/api/contact`.