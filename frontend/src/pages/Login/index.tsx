import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button, Input } from '@/components/ui';
import { ROUTES } from '@/config/constants';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/cn';
import { RaiseMark } from '@/components/RaiseMark';

// Split-panel layout restyle, form fields/behavior unchanged (still username+password against
// authService -- RAISE's actual auth mechanism is still TBD per RAISE-NFR-SEC-RBAC-001, see
// docs/01-requirements/RAISE-PRD.md Sec11). The Microsoft/Google buttons below are decorative
// only -- disabled, not wired to any auth flow -- since SSO is not a confirmed requirement;
// they exist to match the requested visual reference without implying functionality that
// doesn't exist yet.
const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ username, password });
      navigate(ROUTES.DASHBOARD);
    } catch {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Form panel */}
      <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-12 lg:w-1/2 lg:px-20 xl:px-28">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5">
            <RaiseMark className="h-9 w-9" />
            <span className="text-title font-bold text-surface-900">RAISE</span>
          </div>

          <h1 className="flex items-center gap-2 text-2xl font-bold text-surface-900">
            ยินดีต้อนรับ <span aria-hidden="true">👋</span>
          </h1>
          <p className="mt-1 text-body text-surface-500">โปรดกรอกข้อมูลด้านล่าง</p>

          {error && (
            <div className="mt-6 rounded-md bg-error-50 p-3 text-body text-error-700">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="login-form-accent mt-6 space-y-4">
            <Input
              id="username"
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              placeholder="Enter your username"
            />

            <div>
              <label htmlFor="password" className="mb-1.5 block text-caption font-medium text-surface-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className={cn('input-base pr-9')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="mt-1.5 text-right">
                <span className="text-caption text-surface-400" title="Not available yet">
                  Forgot password?
                </span>
              </div>
            </div>

            <Button type="submit" variant="brand" loading={loading} className="w-full">
              Sign in
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-surface-200" />
            <span className="text-caption text-surface-400">or</span>
            <div className="h-px flex-1 bg-surface-200" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled
              title="Not available yet -- authentication mechanism is not yet finalized (RAISE-NFR-SEC-RBAC-001)"
              className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-surface-200 bg-white text-body font-medium text-surface-400 opacity-60 cursor-not-allowed hover:bg-surface-50"
            >
              <MicrosoftIcon className="h-4 w-4" />
              Microsoft
            </button>
            <button
              type="button"
              disabled
              title="Not available yet -- authentication mechanism is not yet finalized (RAISE-NFR-SEC-RBAC-001)"
              className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-surface-200 bg-white text-body font-medium text-surface-400 opacity-60 cursor-not-allowed hover:bg-surface-50"
            >
              <GoogleIcon className="h-4 w-4" />
              Google
            </button>
          </div>
        </div>
      </div>

      {/* Illustration panel -- dark slate/near-black, not solid Singer red: red is used only as
          an accent (see the nodes below and the Sign-in button) since a large red fill would
          collide with the existing alert/error meaning red carries elsewhere in this UI. */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-surface-900 to-black lg:flex lg:w-1/2 lg:items-center lg:justify-center">
        <svg
          className="absolute inset-x-0 top-0 h-32 w-full text-white"
          viewBox="0 0 400 100"
          preserveAspectRatio="none"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M0,0 H400 V40 C380,90 350,90 330,40 C310,-10 280,-10 260,40 C240,90 210,90 190,40 C170,-10 140,-10 120,40 C100,90 70,90 50,40 C40,15 20,5 0,10 Z" />
        </svg>

        <div className="relative z-10 flex flex-col items-center gap-8 px-12 text-center text-white">
          <div>
            <div className="text-4xl font-extrabold tracking-tight">RAISE</div>
            <p className="mt-2 text-body text-surface-300">Enterprise Asset Intelligence Platform</p>
          </div>
          <AssetNetworkIllustration className="h-64 w-64" />
        </div>
      </div>
    </div>
  );
};

// Generic, recognizable "sign in with" marks -- not RAISE's own brand, used only to label the
// (disabled) SSO buttons the way any product would.
function MicrosoftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="1" y="1" width="9" height="9" fill="#F25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
      <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
      <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
    </svg>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="m6.3 14.7 6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.5 0 10.4-1.9 14.2-5.1l-6.6-5.4C29.6 35.4 26.9 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.6 39.6 16.3 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.5l6.6 5.4C41.4 36 44 30.5 44 24c0-1.2-.1-2.4-.4-3.5z"
      />
    </svg>
  );
}

// Original abstract illustration (not a copy of any third-party asset) -- a network of
// connected asset nodes, replacing the earlier "person holding a device" motif to better read
// as "Asset Intelligence." Accent nodes updated 2026-08-24 from green to Singer red
// (singer-400), per the confirmed Singer CI -- everything else stays white against the dark
// panel background.
function AssetNetworkIllustration({ className }: { className?: string }) {
  const nodes = [
    { x: 100, y: 40, r: 9, accent: true },
    { x: 45, y: 75, r: 6 },
    { x: 155, y: 70, r: 7 },
    { x: 70, y: 130, r: 8, accent: true },
    { x: 135, y: 140, r: 6 },
    { x: 100, y: 175, r: 5 },
  ];
  const edges: [number, number][] = [
    [0, 1], [0, 2], [0, 3], [0, 4], [1, 3], [2, 4], [3, 5], [4, 5],
  ];
  return (
    <svg className={className} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          stroke="white"
          strokeOpacity="0.35"
          strokeWidth="1.5"
        />
      ))}
      {nodes.map((n, i) => (
        <circle
          key={i}
          cx={n.x}
          cy={n.y}
          r={n.r}
          fill={n.accent ? 'var(--color-singer-400, #ec4f79)' : 'white'}
          fillOpacity={n.accent ? 1 : 0.92}
        />
      ))}
    </svg>
  );
}

export default Login;
