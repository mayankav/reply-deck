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
  { key: 'appId', label: 'Instagram App ID', hint: 'Worker secret' },
  { key: 'appSecret', label: 'Instagram App Secret', hint: 'Worker secret' },
  { key: 'verifyToken', label: 'Webhook verify token', hint: 'Worker secret' },
  { key: 'database', label: 'Database migrated', hint: 'D1 tables' },
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
  const [origin, setOrigin] = useState('https://your-worker.workers.dev');
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
      setError('Could not read setup status');
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  const redirectUri = `${origin}/auth/callback`;
  const webhookUrl = `${origin}/webhook`;
  const deauthorizeUrl = `${origin}/auth/deauthorize`;
  const deletionUrl = `${origin}/privacy/data-deletion`;
  const privacyUrl = `${origin}/privacy`;
  const termsUrl = `${origin}/terms`;

  return (
    <>
      <Header />
      <main className="container">
        <div className="eyebrow">First run</div>
        <h1 style={{ fontSize: 38 }}>Set up your own Instagram connection</h1>
        <p className="lede">
          This app runs entirely in <strong>your</strong> Cloudflare account with <strong>your</strong> Meta app.
          Follow the five steps below. The checklist on the right updates live as you go.
        </p>

        <div className="builder-grid" style={{ marginTop: 32 }}>
          <div>
            <div className="panel">
              <h2>1. Create your Meta app</h2>
              <p>
                Open the <a href="https://developers.facebook.com/apps/" target="_blank" rel="noreferrer">Meta App Dashboard</a>,
                create an app, then add the <strong>Instagram</strong> product → <strong>API setup with Instagram login</strong>.
                Copy your <strong>Instagram App ID</strong> and <strong>Instagram App Secret</strong> (not the Facebook ones).
              </p>
              <div className="btn-row">
                <a className="btn btn-sm" href="https://developers.facebook.com/apps/" target="_blank" rel="noreferrer">Open Meta Apps ↗</a>
                <a className="btn btn-sm btn-ghost" href="https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/business-login" target="_blank" rel="noreferrer">Business Login docs ↗</a>
              </div>
            </div>

            <div className="panel">
              <h2>2. Add your secrets to Cloudflare</h2>
              <p>
                The Deploy button asks for three values. If you use the Cloudflare dashboard instead, open your
                Worker → <strong>Settings → Variables and Secrets</strong> and add these three:
              </p>
              <div className="copy-row"><code>IG_APP_ID</code><span className="hint">from step 1</span></div>
              <div className="copy-row"><code>IG_APP_SECRET</code><span className="hint">from step 1</span></div>
              <div className="copy-row"><code>META_VERIFY_TOKEN</code><span className="hint">make up a long phrase — reuse it in step 3</span></div>
              <p className="hint" style={{ marginBottom: 0 }}>
                The app makes its signing keys from your App Secret. You do not need to create more keys.
              </p>
            </div>

            <div className="panel">
              <h2>3. Configure the Meta app</h2>
              <p>Paste these exact values into your app in the Meta dashboard:</p>
              <CopyRow label="Redirect URI (Business login settings)" value={redirectUri} />
              <CopyRow label="Webhook callback URL" value={webhookUrl} />
              <CopyRow label="Verify token (same as your secret)" value={status?.checks.verifyToken ? 'your META_VERIFY_TOKEN value' : 'set META_VERIFY_TOKEN first'} />
              <p className="hint">
                Under Webhooks, click <strong>Verify and save</strong>, then subscribe fields{' '}
                <code>messages</code>, <code>messaging_postbacks</code>, <code>comments</code>.
              </p>
            </div>

            <div className="panel">
              <h2>4. App details and deletion URLs</h2>
              <p>In <strong>App Settings → Basic</strong>, paste:</p>
              <CopyRow label="Privacy Policy URL" value={privacyUrl} />
              <CopyRow label="Terms of Service URL" value={termsUrl} />
              <CopyRow label="Deauthorize Callback URL" value={deauthorizeUrl} />
              <CopyRow label="Data Deletion Request URL" value={deletionUrl} />
            </div>

            <div className="panel">
              <h2>5. Add yourself as a tester</h2>
              <p>
                In <strong>App Roles → Roles → Add user → Instagram Tester</strong>, enter your Instagram username
                (no @). Then open <a href="https://www.instagram.com/accounts/manage_access/" target="_blank" rel="noreferrer">Instagram tester invites</a>{' '}
                and accept. Your Instagram account must be <strong>Business or Creator</strong>, and public.
              </p>
              <div className="hero-actions">
                <ConnectButton label="Connect Instagram" />
              </div>
            </div>
          </div>

          <aside>
            <div className="sticky-save panel">
              <h3>Live status</h3>
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
                Connected accounts: <strong>{status?.connectedAccounts ?? 0}</strong>
              </div>
              <button className="btn" style={{ width: '100%' }} onClick={() => void refresh()}>Refresh status</button>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
