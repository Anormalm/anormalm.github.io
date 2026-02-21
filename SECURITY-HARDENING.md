## Security Hardening Notes

This repository is deployed as a static site on GitHub Pages. GitHub Pages does not let this repo set arbitrary HTTP response headers directly.

Implemented in-repo:
- Added a strict `Content-Security-Policy` meta policy in `index.html`.
- Removed inline script from `index.html` to keep CSP tighter.
- Sanitized SPA redirect handling (`redirect` must start with `/`) in `src/main.jsx`.
- Added CSP meta in `public/404.html` for the redirect page.

To fully satisfy scanner checks, set these as **HTTP response headers** at a reverse proxy/CDN layer (Cloudflare, Netlify, Vercel, Nginx, etc.):

```http
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

CORS guidance:
- This static portfolio should not return CORS headers unless you intentionally expose a cross-origin API/resource.
- If you must allow CORS, use a strict allow-list (not `*`), for example:

```http
Access-Control-Allow-Origin: https://anormalm.com
Vary: Origin
```

Sensitive data exposure:
- Keep secrets out of client code and static files (`src/`, `public/`).
- Do not publish private documents in `public/`.
- Use server-side access controls for any non-public assets; static GitHub Pages cannot enforce authenticated access.
