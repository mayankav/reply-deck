# Reply Deck

Self-hosted tool for Instagram DM carousels. You use your own Meta app and your own Instagram account. No shared app. No app review.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/mayankav/reply-deck)

## What it does

- Sends a swipeable carousel when a user messages you a keyword.
- Sends a private reply when a user comments a keyword on a Reel.
- Sends another carousel when a user selects a postback button.
- Builds the carousels in a visual editor. You upload cover images.
- Refreshes the Instagram login token every day.

## Setup

Follow [SETUP.md](SETUP.md). It uses short steps and plain words. It takes about 20 minutes.

The Deploy button asks for three values:

```
IG_APP_ID          Instagram App ID
IG_APP_SECRET      Instagram App Secret
META_VERIFY_TOKEN  A long phrase you make up
```

The app makes its signing keys from the App Secret. You do not create more keys.

## Local run

```bash
npm install
cp .dev.vars.example .dev.vars
npm run db:local
npm run dev
```

Open http://localhost:8787

The values in `.dev.vars` are examples. The Setup page shows them as missing. That is correct for a local demo.

## Commands

| Command | Use |
| --- | --- |
| `npm run dev` | Build the UI and start the app |
| `npm run build` | Build the UI only |
| `npm run typecheck` | Check the code |
| `npm run db:local` | Create the local tables |
| `npm run deploy` | Build, update the database, deploy |

## Notes

- Use the Instagram mobile app for tests. Desktop does not show these carousels.
- Send a reply within 24 hours. Meta blocks later replies.
- One comment gets one private reply.

License: MIT.
