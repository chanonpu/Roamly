import React, { useState } from 'react';
import { X, KeyRound, Loader2, Lock } from 'lucide-react';
import { PASSWORD_MIN, validatePassword } from '../lib/authValidation';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdatePassword: (password: string) => Promise<{ error: string | null }>;
}

// Shown after the user follows a password-reset email link (Supabase
// PASSWORD_RECOVERY event); they're signed in with a temporary session.
export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ isOpen, onClose, onUpdatePassword }) => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async () => {
    const validationError = validatePassword(password, confirm);
    if (validationError) { setError(validationError); return; }
    setLoading(true);
    setError('');
    try {
      const { error: err } = await onUpdatePassword(password);
      if (err) { setError(err); return; }
      setPassword('');
      setConfirm('');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 via-sky-700 to-sky-900 flex items-center justify-center text-white shadow-md">
              <KeyRound className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 font-serif-heading">
              Set a new password
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={`New password (${PASSWORD_MIN}+ characters)`}
              autoComplete="new-password"
              className={inputClass}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="Confirm new password"
              autoComplete="new-password"
              className={inputClass}
            />
          </div>
        </div>

        {error && (
          <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-2.5 rounded-xl text-sm font-bold bg-sky-700 hover:bg-sky-800 text-white shadow-md shadow-sky-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Update Password
        </button>
      </div>
    </div>
  );
};
