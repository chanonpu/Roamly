import { useCallback, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

interface AuthResult {
  error: string | null;
  /** True when sign-up succeeded but Supabase requires email confirmation
   *  before a session exists (no error, but also no session yet). */
  needsEmailConfirmation?: boolean;
}

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // True after the user lands back from a password-reset email link.
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (event === 'PASSWORD_RECOVERY') setIsPasswordRecovery(true);
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const signUp = useCallback(async (email: string, password: string, name: string): Promise<AuthResult> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) return { error: error.message };
    return { error: null, needsEmailConfirmation: !data.session };
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }, []);

  // Redirects to Google and back; the session is picked up from the return URL
  // by supabase-js and delivered through onAuthStateChange above.
  const signInWithGoogle = useCallback(async (): Promise<AuthResult> => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    return { error: error?.message ?? null };
  }, []);

  // Supabase emails a link back to this origin; following it fires
  // PASSWORD_RECOVERY above with a temporary session.
  const requestPasswordReset = useCallback(async (email: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    return { error: error?.message ?? null };
  }, []);

  const updatePassword = useCallback(async (password: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.updateUser({ password });
    if (!error) setIsPasswordRecovery(false);
    return { error: error?.message ?? null };
  }, []);

  const dismissPasswordRecovery = useCallback(() => setIsPasswordRecovery(false), []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return {
    session,
    user,
    loading,
    isSignedIn: !!session,
    accessToken: session?.access_token ?? null,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    isPasswordRecovery,
    requestPasswordReset,
    updatePassword,
    dismissPasswordRecovery,
  };
}
