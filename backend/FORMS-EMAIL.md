# Contact & careers forms → info@citysphinx.com

Submissions are saved in **Admin → Inquiries** and emailed to `NOTIFY_EMAIL` (default `info@citysphinx.com`).

## Server `.env` (required for real email)

```env
NOTIFY_EMAIL=info@citysphinx.com
MAIL_FROM=City Sphinx <noreply@citysphinx.com>

SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=...
SMTP_PASS=...
```

Examples: Gmail (App Password), SendGrid SMTP, cPanel mail, Amazon SES SMTP.

After editing `.env`:

```bash
npm install
pm2 restart all
```

## Test

1. Submit **Contact** or **Careers** on the site.
2. Check **Admin → Inquiries** (always works if API is up).
3. Check inbox for `info@citysphinx.com` (only if SMTP is configured).

Without SMTP, forms still save to the database; email is skipped with a log warning.
