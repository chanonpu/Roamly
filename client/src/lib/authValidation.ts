// Client-side checks for UX only — Supabase Auth enforces the real minimum
// password length (set it to PASSWORD_MIN in the dashboard).
// Length rules only, no character rules: names can be in any script and
// passwords may contain anything (NIST SP 800-63B). 72 is bcrypt's limit.
export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 72;
export const NAME_MAX = 60; // matches the server's updateUserSchema

export function validatePassword(password: string, confirm: string): string | null {
  if (password.length < PASSWORD_MIN) return `Password must be at least ${PASSWORD_MIN} characters.`;
  if (password.length > PASSWORD_MAX) return `Password must be at most ${PASSWORD_MAX} characters.`;
  if (password !== confirm) return "Passwords don't match.";
  return null;
}

export function validateName(name: string): string | null {
  const trimmed = name.trim();
  if (!trimmed) return 'Please enter your name.';
  if (trimmed.length > NAME_MAX) return `Name must be at most ${NAME_MAX} characters.`;
  return null;
}
