Development notes

- Run `npm ci` to install dev dependencies (pa11y-ci used for accessibility checks).
- Run `npm run check-assets` to validate that all `assets/` referenced in `index.html` exist.
- The GitHub Actions workflow `.github/workflows/ci.yml` runs the asset check and pa11y on push/pull_request.

If you need help running these locally on Windows PowerShell, I can provide exact commands.