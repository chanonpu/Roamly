import crypto from 'node:crypto';

export function makeId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID().slice(0, 12)}`;
}
