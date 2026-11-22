'use client';

import { useEffect, useState } from 'react';
import ConnectButton from '@/components/ConnectButton';
import Header from '@/components/Header';

type CheckKey = 'appId' | 'appSecret' | 'verifyToken' | 'database';

interface StatusResponse {
  origin: string;
  checks: Record<CheckKey, boolean>;
  connectedAccounts: number;
}

const CHECK_LABELS: { key: CheckKey; label: string }[] = [
  { key: 'appId', label: 'App number' },
  { key: 'appSecret', label: 'App secret' },
  { key: 'verifyToken', label: 'Phrase' },
  { key: 'database', label: 'Storage' },
];

const ICON_PATHS: Record<string, string> = {
  phone: 'M16 6h16v36H16z M20 10h8 M20 38h8',
  meta: 'M14 26c0-8 5-14 12-14s12 6 12 14-5 14-12 14-12-6-12-14z M20 26a6 6 0 1 0 12 0 6 6 0 1 0-12 0z M8 12v24 M40 12v24',
  key: 'M20 28a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M26 22l12 12 M34 30l4-4 M38 34l4-4',
  cloud: 'M12 32a8 8 0 0 1 8-8 10 10 0 0 1 19 3 7 7 0 0 1-2 14H20a8 8 0 0 1-8-9z M24 28v10 M20 32l4-4 4 4',
  chat: 'M10 12h28v22H24l-8 8v-8h-6z M16 20h16 M16 26h12',
  link: 'M20 28l8-8 M16 22l-4 4a7 7 0 0 0 10 10l4-4 M32 26l4-4a7 7 0 0 0-10-10l-4 4',
  user: 'M24 24a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M10 42c0-8 6-12 14-12s14 4 14 12 M34 14h10 M39 9v10',
  bolt: 'M26 6L14 26h9l-3 16 14-22h-9z',
};

function PosterIcon({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d={ICON_PATHS[name] ?? ICON_PATHS.bolt} />
    </svg>
  );
}

function Arrow({ flip }: { flip: boolean }) {
  return (
    <svg className={flip ? 'flip' : ''} viewBox="0 0 60 60" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 12C26 4 50 14 46 36c-2 12-16 16-24 8" />
      <path d="M15 37l7 7 7-8" />
    </svg>
  );
}

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="poster-copy-row">
      <div>
        <div className="poster-copy-label">{label}</div>
        <code>{value}</code>
      </div>
      <button
        className="poster-copy-btn"
        onClick={() => {
          void navigator.clipboard.writeText(value).then(() => {
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1600);
          });
        }}
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}

function Step({ side, title, icon, children, delay }: {
  side: 'left' | 'right';
  title: string;
  icon: string;
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <div className={`poster-step ${side}`} style={{ animationDelay: `${delay}s` }}>
      <div className="poster-text">
        <span className="poster-tab">{title}</span>
        <div className="poster-copy">{children}</div>
      </div>
      <div className="poster-arrow"><Arrow flip={side === 'right'} /></div>
      <div className="poster-icon"><PosterIcon name={icon} /></div>
    </div>
  );
}

export default function AnimatedSetupGuide() {
  const [origin, setOrigin] = useState('https://your-app.example.workers.dev');
  const [status, setStatus] = useState<StatusResponse | null>(null);

  async function refresh() {
    try {
      const response = await fetch('/setup/status');
      const data = (await response.json()) as StatusResponse;
      setStatus(data);
      setOrigin(data.origin || origin);
    } catch {
      setStatus(null);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  const callbackUrl = `${origin}/auth/callback`;
  const messageUrl = `${origin}/webhook`;
  const leaveUrl = `${origin}/auth/deauthorize`;
  const deleteUrl = `${origin}/privacy/data-deletion`;
  const privacyUrl = `${origin}/privacy`;
  const termsUrl = `${origin}/terms`;

  return (
    <>
      <Header />
      <main className="poster">
        <div className="poster-head">Steps to set up Reply Deck</div>
        <div className="poster-body">
          <div className="poster-status">
            {CHECK_LABELS.map(({ key, label }) => (
              <div key={key}><span className={status?.checks[key] ? 'dot ok' : 'dot'} /> {label}</div>
            ))}
            <div>Accounts: <strong>{status?.connectedAccounts ?? 0}</strong></div>
            <button className="poster-small-btn" onClick={() => void refresh()}>Check again</button>
          </div>
          <p className="poster-intro">Eight steps. About 20 minutes. Skip what you already have.</p>

          <Step side="right" title="Make Instagram for business" icon="phone" delay={0.1}>
            <p>Skip if your profile shows Business or Creator.</p>
            <p>On your phone: Settings → Account → Switch to professional account → Business or Creator. Make the account public.</p>
            <p><strong>Check:</strong> Your profile shows a category.</p>
          </Step>

          <Step side="left" title="Get two numbers from Meta" icon="meta" delay={0.5}>
            <p>Do only one path. Both end at “Copy the numbers”.</p>
            <p><strong>Path A — No Meta app:</strong> Open <a href="https://developers.facebook.com/apps/" target="_blank" rel="noreferrer">Meta apps ↗</a>. Create app → Other → Business. Type a name and email. Create app. Find Instagram. Set up. Select the Instagram login setup.</p>
            <p><strong>Path B — Have a Meta app:</strong> Open Meta apps. Select your app. Find Instagram → login setup → Business login settings.</p>
            <p><strong>Copy the numbers:</strong> Find App ID. Select it. Copy it. Paste it into a note. Find App Secret. Select it. Copy it. Paste it into the same note. Keep the secret private.</p>
            <p><strong>Check:</strong> Your note has two values. One short. One long.</p>
          </Step>

          <Step side="right" title="Create your secret phrase" icon="key" delay={0.9}>
            <p>Meta uses it to check messages. Only you know it.</p>
            <p>Use 20 or more letters and numbers. No spaces. Not used anywhere else. Example: <code>blueRiver92mangoLamp47</code></p>
            <p>Do not use the example. Type your own. Write it down. You paste it in steps 4 and 5.</p>
            <p><strong>Check:</strong> You wrote your phrase on paper.</p>
          </Step>

          <Step side="left" title="Make your own copy of the app" icon="cloud" delay={1.3}>
            <p>Skip if Cloudflare already gave you a web address. Use it as YOUR_LINK.</p>
            <CopyRow label="Deploy link" value="https://deploy.workers.cloudflare.com/?url=https://github.com/mayankav/reply-deck" />
            <p>Open the link. Connect GitHub. Allow. Connect Cloudflare. Allow. Make free accounts if asked. Type a name, for example <code>my-reply-deck</code>. Paste App ID, App Secret, secret phrase. Select Deploy. Wait. Copy the web address.</p>
            <p>Call that address <strong>YOUR_LINK</strong>.</p>
            <p><strong>Check:</strong> YOUR_LINK opens in your browser.</p>
          </Step>

          <Step side="right" title="Tell Meta where to send messages" icon="chat" delay={1.7}>
            <p>On your Meta page, find the Instagram login settings.</p>
            <CopyRow label="Return address" value={callbackUrl} />
            <p>In the left menu, select Webhooks.</p>
            <CopyRow label="Messages address" value={messageUrl} />
            <p>Paste your phrase in Verify token. Select Verify and save. Select three boxes: messages, messaging_postbacks, comments. Save.</p>
            <p><strong>Check:</strong> The three boxes stay selected.</p>
          </Step>

          <Step side="left" title="Add four links in Meta" icon="link" delay={2.1}>
            <p>In Meta, go to App Settings → Basic. Paste:</p>
            <CopyRow label="Privacy link" value={privacyUrl} />
            <CopyRow label="Terms link" value={termsUrl} />
            <CopyRow label="When user leaves" value={leaveUrl} />
            <CopyRow label="When user deletes data" value={deleteUrl} />
            <p>Select Save changes. <strong>Check:</strong> The four links stay saved.</p>
          </Step>

          <Step side="right" title="Add yourself as a tester" icon="user" delay={2.5}>
            <p>Skip if you already accepted a tester invite.</p>
            <p>In Meta: App Roles → Roles → Add user. Select Instagram Tester. Not Tester. Type your username. No @. Send the invite.</p>
            <p>On your phone, open <a href="https://www.instagram.com/accounts/manage_access/" target="_blank" rel="noreferrer">Instagram invites ↗</a>. Select Tester Invites. Accept.</p>
            <p><strong>Check:</strong> The invite disappears.</p>
          </Step>

          <Step side="left" title="Connect your account" icon="bolt" delay={2.9}>
            <p>Open YOUR_LINK. Select Setup. Green dots mean the settings are correct.</p>
            <p>Select Connect Instagram. Log in. Select Allow.</p>
            <div className="poster-connect"><ConnectButton label="Connect Instagram" /></div>
            <p><strong>Check:</strong> The dashboard shows your @username.</p>
          </Step>

          <div className="poster-next">
            <strong>Next: test it.</strong> New carousel → name Test → DM keyword → Exact → MENU. Add a title, cover image, and button. Save. Send MENU from another account on your phone.
          </div>
        </div>
        <div className="poster-foot">Reply Deck · github.com/mayankav/reply-deck</div>
      </main>
    </>
  );
}
