import React, { useState } from 'react';
import { X, Compass, Loader2, Mail, Lock, User as UserIcon } from 'lucide-react';
import { track } from '../lib/analytics';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: (email: string, password: string) => Promise<{ error: string | null }>;
  onSignUp: (email: string, password: string, name: string) => Promise<{ error: string | null; needsEmailConfirmation?: boolean }>;
  onSignInWithGoogle: () => Promise<{ error: string | null }>;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSignIn, onSignUp, onSignInWithGoogle }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmMessage, setConfirmMessage] = useState('');

  if (!isOpen) return null;

  const reset = () => { setError(''); setConfirmMessage(''); };

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim() || (mode === 'signup' && !name.trim())) {
      setError('Please fill in every field.');
      return;
    }
    setLoading(true);
    reset();

    try {
      if (mode === 'signin') {
        const { error: err } = await onSignIn(email.trim(), password);
        if (err) { setError(err); return; }
        onClose();
      } else {
        const { error: err, needsEmailConfirmation } = await onSignUp(email.trim(), password, name.trim());
        if (err) { setError(err); return; }
        track('sign_up', { needsEmailConfirmation: !!needsEmailConfirmation });
        if (needsEmailConfirmation) {
          setConfirmMessage('Check your email to confirm your account, then sign in.');
          setMode('signin');
        } else {
          onClose();
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // On success the browser navigates to Google, so only the error path needs handling.
  const handleGoogle = async () => {
    setLoading(true);
    reset();
    const { error: err } = await onSignInWithGoogle();
    if (err) {
      setError(err);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 via-sky-700 to-sky-900 flex items-center justify-center text-white shadow-md">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 font-serif-heading">
              {mode === 'signin' ? 'Welcome back' : 'Join Roamly'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => { setMode('signin'); reset(); }}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${mode === 'signin' ? 'bg-white dark:bg-stone-900 text-sky-700 dark:text-sky-400 shadow-xs' : 'text-stone-500'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode('signup'); reset(); }}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${mode === 'signup' ? 'bg-white dark:bg-stone-900 text-sky-700 dark:text-sky-400 shadow-xs' : 'text-stone-500'}`}
          >
            Sign Up
          </button>
        </div>

        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full py-2.5 rounded-xl text-sm font-bold border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-100 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.81z" />
            <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.9l-3.88-3.01c-1.07.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.72-4.95H1.27v3.11A12 12 0 0 0 12 24z" />
            <path fill="#FBBC05" d="M5.28 14.29a7.2 7.2 0 0 1 0-4.58V6.6H1.27a12 12 0 0 0 0 10.8l4.01-3.11z" />
            <path fill="#EA4335" d="M12 4.75c1.76 0 3.34.61 4.59 1.8l3.44-3.44A11.53 11.53 0 0 0 12 0 12 12 0 0 0 1.27 6.6l4.01 3.11C6.22 6.86 8.87 4.75 12 4.75z" />
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3 text-[11px] font-semibold text-stone-400">
          <div className="flex-1 h-px bg-stone-200 dark:bg-stone-800" />
          or
          <div className="flex-1 h-px bg-stone-200 dark:bg-stone-800" />
        </div>

        <div className="space-y-3 text-xs">
          {mode === 'signup' && (
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="you@example.com"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder={mode === 'signup' ? 'Create a password (6+ characters)' : 'Password'}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
            />
          </div>
        </div>

        {error && (
          <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">{error}</p>
        )}
        {confirmMessage && (
          <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">{confirmMessage}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-2.5 rounded-xl text-sm font-bold bg-sky-700 hover:bg-sky-800 text-white shadow-md shadow-sky-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {mode === 'signin' ? 'Sign In' : 'Create Account'}
        </button>
      </div>
    </div>
  );
};
