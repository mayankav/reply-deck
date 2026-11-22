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
  { key: 'verifyToken', label: 'Secret phrase' },
  { key: 'database', label: 'Storage' },
];

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="yellow-copy">
      <div>
        <div className="yellow-label">{label}</div>
        <code>{value}</code>
      </div>
      <button
        className="yellow-btn"
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

function Step({ number, side, title, children, delay }: {
  number: number;
  side: 'left' | 'right';
  title: string;
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <div className={`guide-step ${side}`}>
      <div className="guide-badge" style={{ animationDelay: `${delay}s` }}>{number}</div>
      <div className="guide-card" style={{ animationDelay: `${delay + 0.12}s` }}>
        <h2>{title}</h2>
        {children}
      </div>
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
      <main className="container guide">
        <div className="eyebrow">First use</div>
        <h1>Set up your app</h1>
        <p className="lede">Do these steps one time. Then make carousels. About 20 minutes.</p>

        <div className="guide-status">
          {CHECK_LABELS.map(({ key, label }) => (
            <div className="guide-status-item" key={key}>
              <span className={status?.checks[key] ? 'dot ok' : 'dot'} />
              <span>{label}</span>
            </div>
          ))}
          <div className="guide-status-item">Accounts: <strong>{status?.connectedAccounts ?? 0}</strong></div>
          <button className="btn btn-sm" onClick={() => void refresh()}>Run check again</button>
        </div>

        <div className="guide-skip">
          <strong>Skip what you already have:</strong> Business Instagram → step 1. Meta app → step 2.
          Deployed copy → step 4. Tester invite → step 7.
        </div>

        <div className="guide-timeline">
          <Step number={1} side="right" title="Make Instagram for business" delay={0.1}>
            <p className="skip">Skip if your profile shows Business or Creator.</p>
            <p>On your phone: Settings → Account → Switch to professional account → Business or Creator. Make the account public.</p>
            <a className="yellow-link" href="https://business.instagram.com/getting-started" target="_blank" rel="noreferrer">Instagram help ↗</a>
            <p className="check"><strong>Check:</strong> Your profile shows a category.</p>
          </Step>

          <Step number={2} side="left" title="Get two numbers from Meta" delay={0.55}>
            <p className="skip">Do only one path. Both paths end at "Copy the numbers".</p>
            <p><strong>Path A — No Meta app yet</strong><br />
              1. Open <a className="yellow-link" href="https://developers.facebook.com/apps/" target="_blank" rel="noreferrer">Meta apps ↗</a><br />
              2. Create app → Other → Business.<br />
              3. Type a name and email. Create app.<br />
              4. Find Instagram. Select Set up.<br />
              5. Select the Instagram login setup.</p>
            <p><strong>Path B — You already have a Meta app</strong><br />
              1. Open Meta apps. Select your app.<br />
              2. Find Instagram → API setup with Instagram login → Business login settings.</p>
            <p><strong>Copy the numbers</strong><br />
              1. Find App ID. Select the number. Copy it. Paste it into a note.<br />
              2. Find App Secret. Select it. Copy it. Paste it into the same note.<br />
              3. Keep the secret private.</p>
            <p className="check"><strong>Check:</strong> Your note has two values. One short. One long.</p>
          </Step>

          <Step number={3} side="right" title="Create your secret phrase" delay={1}>
            <p>Meta uses it to check messages. Only you know it.</p>
            <p>Use 20 or more letters and numbers. No spaces. Not used anywhere else.</p>
            <p>Example: <code>blueRiver92mangoLamp47</code></p>
            <p className="skip">Do not use the example. Type your own. Write it down. You paste it in steps 4 and 5.</p>
            <p className="check"><strong>Check:</strong> You wrote your phrase on paper.</p>
          </Step>

          <Step number={4} side="left" title="Make your own copy of the app" delay={1.45}>
            <p className="skip">Skip if Cloudflare already gave you a web address. Use it as YOUR_LINK.</p>
            <p>Open this link:</p>
            <CopyRow label="Deploy link" value="https://deploy.workers.cloudflare.com/?url=https://github.com/mayankav/reply-deck" />
            <p>1. Connect GitHub. Allow. Make a free account if asked.<br />
              2. Connect Cloudflare. Allow. Make a free account if asked.<br />
              3. Type a name. Example: <code>my-reply-deck</code><br />
              4. Paste App ID, App Secret, secret phrase.<br />
              5. Select Deploy. Wait. Copy the web address.</p>
            <p>Call that address <strong>YOUR_LINK</strong>.</p>
            <p className="check"><strong>Check:</strong> YOUR_LINK opens in your browser.</p>
          </Step>

          <Step number={5} side="right" title="Tell Meta where to send messages" delay={1.9}>
            <p>On your Meta page, find the Instagram login settings.</p>
            <CopyRow label="Return address" value={callbackUrl} />
            <p>In the left menu, select Webhooks.</p>
            <CopyRow label="Messages address" value={messageUrl} />
            <p>Paste your secret phrase in Verify token. Select Verify and save. Select three boxes: <code>messages</code>, <code>messaging_postbacks</code>, <code>comments</code>. Save.</p>
            <p className="check"><strong>Check:</strong> The three boxes stay selected.</p>
          </Step>

          <Step number={6} side="left" title="Add four links in Meta" delay={2.35}>
            <p>In Meta, go to App Settings → Basic. Paste:</p>
            <CopyRow label="Privacy link" value={privacyUrl} />
            <CopyRow label="Terms link" value={termsUrl} />
            <CopyRow label="When user leaves" value={leaveUrl} />
            <CopyRow label="When user deletes data" value={deleteUrl} />
            <p>Select Save changes.</p>
            <p className="check"><strong>Check:</strong> The four links stay saved.</p>
          </Step>

          <Step number={7} side="right" title="Add yourself as a tester" delay={2.8}>
            <p className="skip">Skip if you already accepted a tester invite.</p>
            <p>1. In Meta: App Roles → Roles → Add user.<br />
              2. Select Instagram Tester. Not Tester.<br />
              3. Type your username. No @.<br />
              4. Send the invite.<br />
              5. On your phone, open <a className="yellow-link" href="https://www.instagram.com/accounts/manage_access/" target="_blank" rel="noreferrer">Instagram invites ↗</a>. Select Tester Invites. Accept.</p>
            <p className="check"><strong>Check:</strong> The invite disappears.</p>
          </Step>

          <Step number={8} side="left" title="Connect your account" delay={3.25}>
            <p>Open YOUR_LINK. Select Setup. Green dots mean the settings are correct.</p>
            <p>Select Connect Instagram. Log in. Select Allow.</p>
            <div className="guide-connect"><ConnectButton label="Connect Instagram" /></div>
            <p className="check"><strong>Check:</strong> The dashboard shows your @username.</p>
          </Step>
        </div>

        <div className="panel" style={{ marginTop: 8 }}>
          <h2>Next: test it</h2>
          <p style={{ margin: 0 }}>
            Select New carousel. Name it <code>Test</code>. Trigger: DM keyword → Exact → <code>MENU</code>.
            Add a title, a cover image, and a button. Save. Send <code>MENU</code> from another account on your phone.
          </p>
        </div>
      </main>
    </>
  );
}
