# Village Computers — New Site

A from-scratch rebuild of the Village Computers homepage. No Bootstrap, no
jQuery — plain HTML, CSS, and vanilla JS, ready for Cloudflare Pages.

## Files

- `index.html` — homepage
- `styles.css` — all styling (blue/professional theme matching the brand)
- `script.js` — mobile nav toggle + contact form submission
- `worker.js` — Cloudflare Worker that receives contact form submissions and sends an email
- `wrangler.toml` — config for deploying the Worker

## Deploying the site to Cloudflare Pages

1. Push this folder to the `DDS-Onboarding` repo (or a new repo, e.g. `village-computers-site`) on GitHub.
2. In Cloudflare dashboard → Workers & Pages → Create → Pages → connect to the GitHub repo.
3. Build settings: no build command needed (static files) — set build output directory to `/` (root).
4. Deploy. You'll get a `*.pages.dev` URL.
5. Once the domain transfer to Cloudflare is complete, go to the Pages project → Custom Domains → add `villagecomputersmtp.com` (and `www`). Cloudflare auto-configures DNS + SSL.

## Deploying the contact form Worker

1. Sign up for [Resend](https://resend.com) (or swap `worker.js` for your preferred email API — SendGrid, Mailgun, etc.). Verify your sending domain.
2. Install Wrangler if you haven't: `npm install -g wrangler`
3. From this folder, log in: `wrangler login`
4. Edit `wrangler.toml`:
   - `TO_EMAIL` — where form submissions should land
   - `FROM_EMAIL` — a verified sender on your Resend domain
   - `ALLOWED_ORIGIN` — your live site URL (for CORS)
5. Set the API key secret: `wrangler secret put RESEND_API_KEY` (paste your Resend key when prompted)
6. Deploy: `wrangler deploy`
7. Wrangler will print the Worker URL, e.g. `https://contact-form.<your-subdomain>.workers.dev`
8. Open `script.js` and update `WORKER_URL` to that exact URL.
9. Re-deploy the Pages site (push the updated `script.js`).

## What changed from the old site

- Removed Bootstrap and all JS plugin dependencies (collapse, carousel, nav).
- Rebuilt nav as plain CSS dropdowns (hover + keyboard accessible), with a working mobile menu.
- Replaced the PHP-based contact form with a JS fetch to a Cloudflare Worker (static-host compatible).
- Updated footer copyright to 2026.
- Added meta description and Open Graph tags for SEO/social sharing.
- Testimonials shown as a responsive grid (no carousel JS required).
- All "More" links route to placeholder sub-pages (`data-recovery.html`, `laptop-repair.html`, etc.) — these still need to be built or migrated from the old site.

## Still needed

- Sub-pages: `msp.html`, `data-recovery.html`, `laptop-repair.html`, `desktop-repair.html`, `virus-removal.html`, `remote-support.html`, `residential.html`, `business.html`, `support.html`, `about-us.html`, `contact-us.html`
- Logo image (`images/logo.png`) — pull from old site or replace with the new CSS-based logo mark
- Favicon
