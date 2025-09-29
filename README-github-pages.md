Deploying to GitHub Pages

1. Push all files to the repository (branch `main` is typical):
   git add . && git commit -m "Prepare website for GitHub Pages" && git push

2. In GitHub, go to Settings → Pages and choose:
   - Branch: `main`
   - Folder: `/ (root)`

3. After publishing, your site will be available at:
   https://<username>.github.io/<repo>/

4. Validation checklist:
   - Visit `https://<username>.github.io/<repo>/manifest.json` — should return 200 and valid JSON.
   - Confirm `assets/umbrella-icon-192.png` and `assets/umbrella-icon-512.png` return 200.
   - Test the contact form submission (it posts to FormSubmit by default). FormSubmit may require you to confirm the destination email on their side.

Notes:
- The repository contains a `server/` example for a deployable contact mailer. GitHub Pages cannot run server code; deploy that separately and update the contact form `action` if you prefer server-backed email.