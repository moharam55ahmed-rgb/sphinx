# Fix CORS for citysphinx.com

## Problem

Browser shows:

`Access-Control-Allow-Origin: https://sphinx-bay.vercel.app`

That is **old config** — either old Node code or **Nginx** overriding headers.

## 1. Deploy latest backend

```bash
cd /var/www/api.citysphinx.com   # or your API path
git pull
npm install
npx prisma generate
pm2 restart all   # or: npm run start
```

## 2. Verify CORS is `*`

```bash
curl -sI -X OPTIONS \
  -H "Origin: https://citysphinx.com" \
  -H "Access-Control-Request-Method: GET" \
  https://api.citysphinx.com/api/health
```

You must see:

```
Access-Control-Allow-Origin: *
```

If you still see `sphinx-bay.vercel.app`, **Nginx** is adding it — edit the site config and remove any `add_header Access-Control-*` lines. See `nginx-cors.example.conf`.

## 3. Point frontend to your API (Vercel / citysphinx.com)

**Do not use** `sphinx.nodeteam.site` — it still sends old CORS (`sphinx-bay.vercel.app`).

Set in Vercel → Project → Environment Variables:

```env
API_UPSTREAM_URL=https://api.citysphinx.com/api
NEXT_PUBLIC_BACK_URL=https://api.citysphinx.com
```

Redeploy the frontend. The app calls `/api/proxy/...` on the same domain (no CORS); Next.js proxies to `api.citysphinx.com`.

## 4. Remove old FRONTEND_URL on server

In `backend/.env` on the server, **do not** rely on:

```env
FRONTEND_URL=https://sphinx-bay.vercel.app
```

CORS is now hardcoded to `*` in `src/middlewares/cors.middleware.js`.
