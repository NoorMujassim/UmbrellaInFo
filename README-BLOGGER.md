Umbrella InFo — Blogger integration

This folder contains three ways to put your Umbrella InFo site into Google Blogger.

Files created:
- `index-inline.html` — a simple standalone HTML page that wraps your GitHub Pages site in a responsive iframe. Useful for testing or hosting the page elsewhere.
- `blogger-theme-umbrella-info.xml` — a ready-to-upload (minimal) Blogger theme that embeds your GitHub Pages site inside a main HTML widget. Upload via Blogger → Theme → Backup/Restore → Upload.

Options explained

1) Instant embed (recommended)
- Use the iframe approach. It preserves everything on your GitHub Pages site and works immediately.
- Paste the `index-inline.html` content into a Page or use the iframe from the theme.

2) Paste-as-page
- Blogger's Page editor sometimes strips <script> tags. If you want the site fully inlined (no iframe), you must produce a single HTML file with CSS and JS inlined. This repository does not automatically inline every JS library; if you want that, reply and I will generate `index-inlined-full.html`.

3) Full Blogger theme (native)
- The included `blogger-theme-umbrella-info.xml` is a minimal theme that places an HTML widget (iframe) in the main section. It's a safe first step toward a fully native conversion.

Upload steps for the theme
1. Sign in to Blogger and open your blog.
2. Theme → Backup/Restore → Upload the `blogger-theme-umbrella-info.xml` file.
3. After upload, go to Layout and move or edit the "Umbrella InFo" HTML widget if you want it in a different place.

Notes & follow-ups
- Website name: Umbrella InFo — please verify header/title display in Blogger after upload.
- Contact form: your site currently uses a client-side contact flow. If you want the contact form to POST to your own Express server, change the form action to the deployed server endpoint (e.g., https://your-server.example/api/contact) and update CORS if needed. Otherwise, keep using FormSubmit or similar third-party form providers.
- PWA/service worker: Blogger hosting does not support registering a service worker for a different origin. If you want PWA behavior, host the site on a domain you control and point Blogger links to it.
- Inline conversion: if you want a complete native Blogger theme (not an iframe) that inlines your CSS and JS and maps content to Blogger widgets, reply "do full theme" and I will generate the upload-ready XML that includes the inlined content and any required asset hosting notes.

If you want me to proceed and produce the fully inlined Blogger theme (no iframe), say: "do full theme" and I will create `blogger-theme-umbrella-info-full.xml` and a test checklist.

--
Umbrella InFo — Where Data Speaks
