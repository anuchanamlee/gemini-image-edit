# Gemini Image Edit (Next.js + n8n)

Upload a photo, pick a preset or write a prompt, and get an edited image back from
Google Gemini. The web app is thin; the logic — API-key check, prompt presets, the
Gemini call, logging and file storage — lives in three n8n workflows you can import.

[ภาษาไทย](README.th.md)

## Architecture

```
Browser ──▶ Next.js (app/api/n8n/route.ts, server-side proxy)
                │  forwards form-data + Authorization header
                ▼
           n8n webhook ──▶ check API key in Google Sheet
                       ──▶ build prompt from preset
                       ──▶ Gemini image edit
                       ──▶ log the request to Google Sheet, save file to Google Drive
                       ──▶ respond to the webhook with the image
```

The browser never sees the n8n URL: it lives in `N8N_WEBHOOK_URL` on the server.

## Workflows (`N8N_Workflow/`)

| File | Purpose |
|---|---|
| `image-edit-auth-presets-gemini-log.json` | Main pipeline: auth → preset → Gemini → log → response |
| `add-user-key-generator.json` | Form that registers a user and issues an API key |
| `auto-create-folders-upload.json` | Creates per-user / per-date Drive folders and uploads results |

After importing, replace `YOUR_GOOGLE_SHEET_ID` / `YOUR_DRIVE_FOLDER_ID` and attach
your own Google Sheets, Google Drive and Gemini credentials.

## Run

```bash
docker run -d --name n8n -p 5678:5678 -v n8n_data:/home/node/.n8n n8nio/n8n
# import the three workflows in the n8n UI and activate them

docker compose up -d --build      # web app on http://localhost:3000
```

`docker-compose.yml` points the app at `http://host.docker.internal:5678/webhook/prompt0`;
change `N8N_WEBHOOK_URL` for n8n Cloud. `start-app.bat` does the same on Windows and
opens a Cloudflare quick tunnel for a public demo link.

## Known limitations

This was an early project; if I rebuilt it I would change these:

- API keys are generated with `Math.random()` — should use a CSPRNG and store only a hash.
- Google Sheets as the user/key store is fine for a demo, not for concurrent writes.
- No rate limit per key.

## Stack

Next.js · React · Tailwind CSS · n8n · Google Gemini · Google Sheets / Drive · Docker

## License

MIT
