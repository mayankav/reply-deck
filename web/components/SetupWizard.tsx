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

const CHECK_LABELS: { key: CheckKey; label: string; hint: string }[] = [
  { key: 'appId', label: 'App number is set', hint: 'From Meta' },
  { key: 'appSecret', label: 'App secret is set', hint: 'From Meta' },
  { key: 'verifyToken', label: 'Secret phrase is set', hint: 'From step 3' },
  { key: 'database', label: 'Storage is ready', hint: 'Your saved carousels' },
];

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="copy-row">
      <div>
        <div className="label">{label}</div>
        <code>{value}</code>
      </div>
      <button
        className="btn btn-sm"
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

export default function SetupWizard() {
  const [origin, setOrigin] = useState('https://your-app.example.workers.dev');
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [error, setError] = useState('');

  async function refresh() {
    try {
      const response = await fetch('/setup/status');
      const data = (await response.json()) as StatusResponse;
      setStatus(data);
      setOrigin(data.origin || origin);
      setError('');
    } catch {
      setError('The check could not run. Try again.');
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
      <main className="container">
        <div className="eyebrow">First use</div>
        <h1 style={{ fontSize: 38 }}>Set up your app</h1>
        <p className="lede">
          Your app is live. Do these steps one time. Then you can make carousels.
        </p>

        <div className="panel">
          <h3>Two names you will see</h3>
          <p style={{ margin: 0 }}>
            <strong>Cloudflare</strong> is the free service that runs your app.{' '}
            <strong>Meta</strong> is the company that owns Instagram. You set up the login on Meta&apos;s website.
          </p>
        </div>

        <div className="builder-grid" style={{ marginTop: 20 }}>
          <div>
            <div className="panel">
              <h2>1. Make your Instagram account for business</h2>
              <p>Skip this if your profile already shows Business or Creator.</p>
              <p>On your phone, open Instagram:</p>
              <p style={{ marginTop: 0 }}>
                Settings → Account → Switch to professional account → Business or Creator. Make the account public.
              </p>
              <a className="btn btn-sm" href="https://business.instagram.com/getting-started" target="_blank" rel="noreferrer">
                Instagram help ↗
              </a>
            </div>

            <div className="panel">
              <h2>2. Get two numbers from Meta</h2>
              <p>Skip the setup if you already have a Meta app. Copy the two numbers and go to step 3.</p>
              <p>Open Meta&apos;s website. Make an app. Then find the Instagram setup.</p>
              <p style={{ marginTop: 0 }}>
                1. Open <a href="https://developers.facebook.com/apps/" target="_blank" rel="noreferrer">Meta apps ↗</a><br />
                2. Select Create app → Other → Business.<br />
                3. Type a name and your email. Select Create app.<br />
                4. Find Instagram. Select Set up.<br />
                5. Select the Instagram login setup.<br />
                6. Copy the two numbers on the page. They are called App ID and App Secret. Keep the secret private.
              </p>
              <a className="btn btn-sm" href="https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/business-login" target="_blank" rel="noreferrer">
                Help with this page ↗
              </a>
              <p className="hint" style={{ marginBottom: 0 }}>
                Meta may change a word. Keep the same meaning.
              </p>
            </div>

            <div className="panel">
              <h2>3. Check your app settings</h2>
              <p>
                Skip this if Cloudflare already gave you a web address. If you used the blue button, skip it too.
              </p>
              <p>
                If not, open <a href="https://dash.cloudflare.com/" target="_blank" rel="noreferrer">Cloudflare ↗</a>.
                Find your app. Open Settings → Variables and Secrets. Add these:
              </p>
              <div className="copy-row"><code>App ID</code><span className="hint">write it as: IG_APP_ID</span></div>
              <div className="copy-row"><code>App Secret</code><span className="hint">write it as: IG_APP_SECRET</span></div>
              <div className="copy-row"><code>Secret phrase</code><span className="hint">write it as: META_VERIFY_TOKEN</span></div>
              <p className="hint" style={{ marginBottom: 0 }}>
                Meta uses this phrase to check that messages come from your app. Make your own. Use 20 or more
                letters and numbers, with no spaces. Example: blueRiver92mangoLamp47. Do not use the example.
                Write yours down. You paste it in step 4.
              </p>
            </div>

            <div className="panel">
              <h2>4. Tell Meta where to send messages</h2>
              <p>On the same Meta page, paste these two links:</p>
              <CopyRow label="Login return link" value={callbackUrl} />
              <CopyRow label="Messages link" value={messageUrl} />
              <p>
                Now find Webhooks in the left menu. Paste the Messages link there. Paste your secret phrase from step 3 in Verify token.
                Select Verify and save. Then select these three boxes: messages, messaging_postbacks, comments. Save.
              </p>
              <a className="btn btn-sm" href="https://developers.facebook.com/documentation/instagram-platform/webhooks/setup" target="_blank" rel="noreferrer">
                Help with webhooks ↗
              </a>
            </div>

            <div className="panel">
              <h2>5. Add four links in Meta</h2>
              <p>In Meta, go to App Settings → Basic. Paste these links:</p>
              <CopyRow label="Privacy link" value={privacyUrl} />
              <CopyRow label="Terms link" value={termsUrl} />
              <CopyRow label="When user leaves" value={leaveUrl} />
              <CopyRow label="When user deletes data" value={deleteUrl} />
              <p className="hint" style={{ marginBottom: 0 }}>Select Save changes.</p>
            </div>

            <div className="panel">
              <h2>6. Add yourself as a tester</h2>
              <p>Skip this if you already accepted a tester invite.</p>
              <p>
                1. In Meta, go to App Roles → Roles → Add user.<br />
                2. Select Instagram Tester. Do not select Tester.<br />
                3. Type your Instagram username. No @.<br />
                4. Send the invite.<br />
                5. On your phone, open{' '}
                <a href="https://www.instagram.com/accounts/manage_access/" target="_blank" rel="noreferrer">Instagram invites ↗</a>.
                Select Tester Invites. Accept.
              </p>
            </div>

            <div className="panel">
              <h2>7. Connect your Instagram</h2>
              <p>Select the button below. Log in with Instagram. Select Allow.</p>
              <div className="hero-actions" style={{ marginTop: 12 }}>
                <ConnectButton label="Connect Instagram" />
              </div>
            </div>
          </div>

          <aside>
            <div className="sticky-save panel">
              <h3>Setup check</h3>
              {error && <div className="alert alert-error">{error}</div>}
              <div className="status-list">
                {CHECK_LABELS.map(({ key, label, hint }) => {
                  const ok = status?.checks[key] ?? false;
                  return (
                    <div className="status-item" key={key}>
                      <span className={ok ? 'dot ok' : 'dot'} />
                      <div><div>{label}</div><div className="hint">{hint}</div></div>
                    </div>
                  );
                })}
              </div>
              <div className="hint" style={{ margin: '14px 0' }}>
                Accounts connected: <strong>{status?.connectedAccounts ?? 0}</strong>
              </div>
              <button className="btn" style={{ width: '100%' }} onClick={() => void refresh()}>Run check again</button>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
