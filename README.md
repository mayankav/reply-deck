# Reply Deck

Send a swipeable Instagram carousel when someone messages you a keyword or comments on your Reel.

You use your own Meta app and your own Instagram account. You do not share them with anyone.

## Start here

Open this link to make your own copy of the app:

```
https://deploy.workers.cloudflare.com/?url=https://github.com/mayankav/reply-deck
```

Then follow the guide: https://github.com/mayankav/reply-deck/blob/main/SETUP.md

The guide uses short steps. It takes about 20 minutes.

On that link, Cloudflare asks for three values:

```
App ID       the first number from Meta
App Secret   the second number from Meta
Secret phrase  20+ letters and numbers, no spaces. Example: blueRiver92mangoLamp47. Make your own.
```

The app makes its other keys from the App Secret. You do not create more keys.

Cloudflare is the free service that runs your app. Meta is the company that owns Instagram.

## What you can do

- Send a carousel when someone messages a keyword.
- Send a private reply when someone comments a keyword on a Reel.
- Build the cards in a visual editor. You upload the cover images.

## Run it on your computer

```bash
npm install
cp .dev.vars.example .dev.vars
npm run db:local
npm run dev
```

Open http://localhost:8787

The values in `.dev.vars` are examples. The Setup page shows them as missing. That is correct for a local test.

## Commands

| Command | Use |
| --- | --- |
| `npm run dev` | Build the screens and start the app |
| `npm run build` | Build the screens only |
| `npm run typecheck` | Check the code |
| `npm run db:local` | Make the local storage |
| `npm run deploy` | Deploy your copy |

License: MIT.
