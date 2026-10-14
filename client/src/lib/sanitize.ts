const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/** Escapes a value for interpolation into an HTML string (e.g. Leaflet popups,
 *  which take raw HTML). Anything user-editable must go through this. */
export function escapeHtml(value: unknown): string {
  return String(value ?? '').replace(/[&<>"']/g, ch => HTML_ESCAPES[ch]);
}

/** Returns the URL only if it's http(s); blocks javascript:, data:, etc. so it
 *  is safe to use as an href. */
export function safeUrl(url: string | undefined | null): string | undefined {
  if (!url) return undefined;
  try {
    const { protocol } = new URL(url);
    return protocol === 'http:' || protocol === 'https:' ? url : undefined;
  } catch {
    return undefined;
  }
}
