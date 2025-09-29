CI workflows

1) .github/workflows/generate-icons.yml
- Runs on push or manual dispatch
- Installs node, runs `npm ci` and `npm run convert-icons`, commits the generated PNGs back to `main` (if changed)

2) .github/workflows/build-server-image.yml
- Builds the `server/` Docker image and pushes to GitHub Container Registry (GHCR)
- Image tag: ghcr.io/<owner>/noormujassim-server:latest
- Uses the repository's GITHUB_TOKEN for auth (no extra secret needed for GHCR push in public repos)

How to use
- To generate icons automatically: push your SVG updates to `main` or manually trigger the workflow in the Actions tab.
- To publish the server image: push changes under `server/` or manually trigger the workflow. Then deploy the GHCR image to your host (Render/Railway accept container images).
