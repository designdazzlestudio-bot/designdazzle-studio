# Design Dazzle Studio — Vercel Ready

This package contains the original Design Dazzle Studio frontend plus a Vercel-compatible backend for Dazzle AI.

## What was fixed

The previous project used a long-running `server.js` for both static files and `/api/chat`. That works locally, but a plain static Vercel deployment does not rely on that process for API requests. The upgraded project now has:

- `api/chat.js` — Vercel serverless API endpoint for the AI assistant.
- `server.js` — local development server that reuses the same `api/chat.js` handler.
- `vercel.json` — Vercel project/function configuration.
- `.env.example` — safe environment-variable template; no real API key is included.
- Existing frontend pages, styles, images, and Dazzle AI interface preserved.
- Browser still calls the same relative URL: `/api/chat`.

## Project structure

```text
design_dazzle_vercel_ready/
├── api/
│   └── chat.js              # Vercel backend function
├── assets/
│   ├── css/
│   │   ├── style.css
│   │   └── dazzle-ai.css
│   └── js/
│       ├── main.js
│       └── dazzle-ai.js
├── index.html
├── services.html
├── graphic-design.html
├── projects.html
├── about.html
├── contact.html
├── dazzle_bot.png
├── ...other existing images...
├── server.js                # local server only
├── package.json
├── vercel.json
├── .env.example
├── .gitignore
└── README.md
```

## Vercel deployment — recommended steps

1. Upload/import the **contents of this project folder** to Vercel. `vercel.json`, `package.json`, `index.html`, and the `api` folder must all be at the project root.
2. In Vercel, open **Project → Settings → Environment Variables**.
3. Add:

```text
GEMINI_API_KEY = your_real_Gemini_API_key
```

4. Optional: add this only if you want to override the built-in default:

```text
GEMINI_MODEL = gemini-3.5-flash-lite
```

5. Apply the variables to **Production**. If you use Preview deployments, add them to **Preview** too.
6. Redeploy the project after adding/changing environment variables.
7. Open your deployed website and launch Dazzle AI. Its browser request goes to the same deployment at `/api/chat`.

### Important Vercel settings

- Framework Preset: **Other** is fine for this plain HTML/CSS/JS project.
- Root Directory: the folder containing `index.html`, `vercel.json`, `package.json`, and `api/`.
- Do not set an Output Directory to a different frontend-only folder.
- Do not upload only `index.html`/assets; the `api` folder must be included.

## Local testing

1. Copy `.env.example` to `.env`.
2. Put your real key in `.env`:

```env
GEMINI_API_KEY=YOUR_REAL_KEY
GEMINI_MODEL=gemini-3.5-flash-lite
```

3. Run:

```bash
npm start
```

4. Open:

```text
http://localhost:3000
```

Do not double-click `index.html` for AI testing. The assistant requires `/api/chat`.

## Quick backend check after deployment

Opening `/api/chat` directly in a browser uses GET and should return a method-not-allowed response. That confirms the function exists. The real chat uses POST automatically from `assets/js/dazzle-ai.js`.

If the chat shows a configuration error, confirm `GEMINI_API_KEY` exists in Vercel and redeploy.

If the chat reports the AI service is temporarily unavailable, check the Gemini API key, API quota, and selected model in your Google AI project.

## Security

- No real `.env` file or API key is included in this ZIP.
- `.env` is ignored by Git.
- The API key remains server-side and is never sent to frontend JavaScript.
- Request size and message length are limited.
- A best-effort per-instance rate limit is included. For high-traffic production use, a shared rate-limit store can be added later.
- The upstream Gemini request has a timeout so a stalled request does not hang indefinitely.

## Files that connect the AI

`assets/js/dazzle-ai.js` sends:

```text
POST /api/chat
```

Vercel maps that URL to:

```text
api/chat.js
```

For local development, `server.js` maps that exact same URL to the exact same handler. This keeps local and Vercel behavior aligned.
