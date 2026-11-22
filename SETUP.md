# Reply Deck setup

## Read this first

Two websites are used:

- **Cloudflare** runs your app for free.
- **Meta** owns Instagram. You make the login on Meta's website.

You need:

- An Instagram Business or Creator account.
- A Meta account.
- About 20 minutes.

---

## Step 1 — Make your Instagram account for business

1. Open Instagram on your phone.
2. Go to Settings → Account → Switch to professional account.
3. Select Business or Creator.
4. Make the account public.

Help: https://business.instagram.com/getting-started

---

## Step 2 — Get two numbers from Meta

1. Open https://developers.facebook.com/apps/
2. Select Create app.
3. Select Other → Business.
4. Type an app name and your email. Select Create app.
5. Find Instagram. Select Set up.
6. Select the Instagram login setup.
7. Copy the App ID. Save it.
8. Copy the App Secret. Save it. Do not share it.

Help: https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/business-login

Meta may change a word. Keep the same meaning.

---

## Step 3 — Make one sentence

Make up a long sentence. Example:

```
blue-river-92-mango-lamp
```

Save it. You use it in Step 4 and Step 5.

---

## Step 4 — Make your own copy of the app

Open this link:

```
https://deploy.workers.cloudflare.com/?url=https://github.com/mayankav/reply-deck
```

This page is the blue **Deploy to Cloudflare** button shown on the GitHub page. You do not need to find the button. The link does the same work.

1. Select Connect GitHub. Allow.
2. Select Connect Cloudflare. Allow. If asked to sign up, do it. It is free.
3. Type a name. Example: `my-reply-deck`
4. Paste the App ID, the App Secret, and your sentence when asked.
5. Select Deploy. Wait until it finishes.
6. Copy the web address Cloudflare gives you.

Call this address **YOUR_URL**. Example: `https://my-reply-deck.example.workers.dev`

---

## Step 5 — Tell Meta where to send messages

Use YOUR_URL from Step 4.

1. On your Meta page, find the Instagram login settings.
2. Paste this in the return address box:

```
YOUR_URL/auth/callback
```

3. In the left menu, select Webhooks.
4. Paste this in the callback box:

```
YOUR_URL/webhook
```

5. Paste your sentence from Step 3 in the verify box.
6. Select Verify and save.
7. Select these three boxes: `messages`, `messaging_postbacks`, `comments`.
8. Select Save.

Help: https://developers.facebook.com/documentation/instagram-platform/webhooks/setup

---

## Step 6 — Add four links in Meta

In Meta, go to App Settings → Basic. Paste:

```
Privacy link              YOUR_URL/privacy
Terms link                YOUR_URL/terms
When user leaves          YOUR_URL/auth/deauthorize
When user deletes data    YOUR_URL/privacy/data-deletion
```

Select Save changes.

---

## Step 7 — Add yourself as a tester

1. In Meta, go to App Roles → Roles → Add user.
2. Select Instagram Tester. Do not select Tester.
3. Type your Instagram username. Do not type @.
4. Send the invite.
5. On your phone, open https://www.instagram.com/accounts/manage_access/
6. Select Tester Invites. Accept.

---

## Step 8 — Connect your account

1. Open YOUR_URL in a browser.
2. Select Setup. Green dots mean the settings are correct.
3. Select Connect Instagram.
4. Log in. Select Allow.
5. The dashboard opens. It shows your @username.

If a dot is not green, select Run check again.

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
| Verify fails | The sentence in Step 3 does not match Step 5 |
| "Account is not connected" | Accept the tester invite. Use a Business or Creator account |
| Login shows an error | The return address must equal `YOUR_URL/auth/callback` |
| No carousel arrives | Use the mobile app. Send within 24 hours of the last message |
