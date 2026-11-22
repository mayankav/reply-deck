# Reply Deck — setup

## What you need

- A Cloudflare account. Free.
- A Meta account. Free.
- An Instagram Business or Creator account.
- About 20 minutes.

Cloudflare hosts the app. Meta gives you the Instagram login. You own both.

---

## Step 1 — Make your Instagram account professional

1. Open Instagram on your phone.
2. Go to Settings → Account → Switch to professional account.
3. Select Business or Creator.
4. Make the account public.

Help: https://business.instagram.com/getting-started

---

## Step 2 — Create your Meta app

1. Open https://developers.facebook.com/apps/
2. Select Create app.
3. Select Other → Business.
4. Type an app name and your email. Select Create app.
5. Find Instagram in the list. Select Set up.
6. Select API setup with Instagram login.
7. Copy the Instagram App ID. Save it.
8. Copy the Instagram App Secret. Save it. Do not share it.

Help: https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/business-login

Meta may change a label. Keep the same meaning.

---

## Step 3 — Make one phrase

Make up a long phrase. Example:

```
blue-river-92-mango-lamp
```

Save it. You paste it in Step 4 and Step 5.

---

## Step 4 — Deploy your copy

1. Open https://github.com/mayankav/reply-deck
2. Select the blue Deploy to Cloudflare button.
3. Select Connect GitHub. Allow.
4. Select Connect Cloudflare. Allow.
5. Type a name. Example: `my-reply-deck`
6. Paste the App ID, the App Secret, and your phrase when asked.
7. Select Deploy. Wait until it finishes.
8. Copy the URL Cloudflare gives you.

Call this URL **YOUR_URL**. Example: `https://my-reply-deck.example.workers.dev`

---

## Step 5 — Finish the Meta app

Use YOUR_URL from Step 4.

1. In your Meta app, go to Instagram → API setup with Instagram login → Business login settings.
2. Paste this in Redirect URIs:

```
YOUR_URL/auth/callback
```

3. In the left menu, select Webhooks.
4. Paste this in Callback URL:

```
YOUR_URL/webhook
```

5. Paste your phrase from Step 3 in Verify token.
6. Select Verify and save.
7. Select these three fields: `messages`, `messaging_postbacks`, `comments`.
8. Select Save.

Help: https://developers.facebook.com/documentation/instagram-platform/webhooks/setup

---

## Step 6 — Add four links

In your Meta app, go to App Settings → Basic. Paste these links:

```
Privacy Policy URL       YOUR_URL/privacy
Terms of Service URL     YOUR_URL/terms
Deauthorize Callback     YOUR_URL/auth/deauthorize
Data Deletion Request    YOUR_URL/privacy/data-deletion
```

Select Save changes.

---

## Step 7 — Add yourself as tester

1. In your Meta app, go to App Roles → Roles.
2. Select Add user.
3. Select Instagram Tester. Do not select Tester.
4. Type your Instagram username. Do not type @.
5. Send the invite.
6. On your phone, open https://www.instagram.com/accounts/manage_access/
7. Select Tester Invites. Accept the invite.

---

## Step 8 — Connect your account

1. Open YOUR_URL in a browser.
2. Select Setup. Green dots mean the settings are correct.
3. Select Connect Instagram.
4. Log in. Select Allow.
5. The dashboard opens. It shows your @username.

If a dot is not green, select Refresh status.

---

## Step 9 — Test it

1. Select New carousel.
2. Name: `Test`
3. Trigger: DM keyword → Exact → `MENU`
4. Card title: `Hello`
5. Subtitle: `Pick one`
6. Upload any JPG image.
7. Button: Open website → `View menu` → `https://example.com`
8. Select Create carousel.
9. From a second Instagram account, send `MENU` to your account. Use the mobile app.
10. The carousel appears in the chat.

---

## If something is wrong

| Problem | Fix |
| --- | --- |
| Webhook shows 403 | The phrase in Step 3 does not match Step 5 |
| "Account is not connected" | Accept the tester invite. Use a Business or Creator account |
| Login shows an error | Redirect URI must equal `YOUR_URL/auth/callback` exactly |
| No carousel arrives | Use the mobile app. Send within 24 hours of your last message |

Command reference: https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/messaging-api/generic-template
