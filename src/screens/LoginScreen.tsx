import { useState } from 'react';
import { Eye, EyeOff, BookOpen } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (role: string, name: string) => void;
}

const DEMO_ACCOUNTS = [
  { email: 'rosa.santos@mabini.deped.ph', role: 'Teacher', name: 'Rosa Santos', label: 'Teacher · Grade 4 Rizal' },
  { email: 'principal@mabini.deped.ph', role: 'School Head', name: 'Perla Dizon', label: 'School Head · Mabini ES' },
  { email: 'supervisor@manila.deped.ph', role: 'Division Supervisor', name: 'Ramon Valdez', label: 'Division Supervisor · NCR' },
];

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('rosa.santos@mabini.deped.ph');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) { setError('Enter your email address.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (!/\d/.test(password)) { setError('Password must include at least one number.'); return; }
    setLoading(true);
    setTimeout(() => {
      const acc = DEMO_ACCOUNTS.find((a) => a.email === email);
      if (acc) { onLogin(acc.role, acc.name); }
      else { setError('No account found with that email.'); setLoading(false); }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Wordmark */}
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
            <BookOpen size={16} className="text-white" />
          </div>
          <div>
            <p className="text-base font-bold text-gray-900 leading-none">BIGKAS</p>
            <p className="text-xs text-gray-400 mt-0.5">DepEd Reading Assessment</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Sign in</h2>
          <p className="text-sm text-gray-500 mb-6">
            Select a demo account, then enter any password with 8+ chars and a number.
          </p>

          {/* Demo account selector */}
          <div className="mb-5">
            <p className="text-xs font-medium text-gray-500 mb-2">Demo accounts</p>
            <div className="flex flex-col gap-1.5">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => setEmail(acc.email)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all
                    ${email === acc.email
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold flex-shrink-0
                    ${email === acc.email ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {acc.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{acc.name}</p>
                    <p className="text-xs text-gray-400 truncate">{acc.label}</p>
                  </div>
                  {email === acc.email && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900
                  focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="e.g. deped123"
                  className="w-full px-3 py-2.5 pr-10 border border-gray-200 rounded-xl text-sm text-gray-900
                    focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all mt-0.5
                ${loading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]'}`}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-5">
          DepEd · IBM Create &amp; Conquer 2026
        </p>
      </div>
    </div>
  );
}
