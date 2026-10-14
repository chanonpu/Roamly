import { supabase } from './supabaseClient';

// Shown for anyone without a profile picture (avatar_url is left empty in the
// DB so the default can be swapped by replacing this one file).
export const DEFAULT_AVATAR = `${import.meta.env.BASE_URL}default-avatar.svg`;

export function avatarSrc(url?: string | null): string {
  return url || DEFAULT_AVATAR;
}

const AVATAR_SIZE = 256;
const MAX_INPUT_BYTES = 10 * 1024 * 1024;

// Center-crops to a square and re-encodes as a small WebP, so every stored
// avatar is ~15-40 KB regardless of what the user picked.
export async function resizeToAvatar(file: File): Promise<Blob> {
  if (!file.type.startsWith('image/')) throw new Error('Please choose an image file.');
  if (file.size > MAX_INPUT_BYTES) throw new Error('Image must be 10 MB or smaller.');

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error("That image couldn't be read. Try a JPEG or PNG.");
  }

  const side = Math.min(bitmap.width, bitmap.height);
  const canvas = document.createElement('canvas');
  canvas.width = AVATAR_SIZE;
  canvas.height = AVATAR_SIZE;
  canvas.getContext('2d')!.drawImage(
    bitmap,
    (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side,
    0, 0, AVATAR_SIZE, AVATAR_SIZE,
  );
  bitmap.close();

  const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/webp', 0.85));
  if (!blob) throw new Error("Couldn't process that image.");
  return blob;
}

// Uploads to avatars/{userId}/avatar.webp (overwriting any previous one) and
// returns a cache-busted public URL to save on the profile.
export async function uploadAvatar(userId: string, file: File): Promise<string> {
  const blob = await resizeToAvatar(file);
  const path = `${userId}/avatar.webp`;
  const { error } = await supabase.storage
    .from('avatars')
    // blob.type, not a hard-coded 'image/webp': browsers without WebP
    // encoding (older Safari) silently fall back to PNG.
    .upload(path, blob, { upsert: true, contentType: blob.type });
  if (error) throw new Error(`Upload failed: ${error.message}`);
  const { data } = supabase.storage.from('avatars').getPublicUrl(path);
  return `${data.publicUrl}?v=${Date.now()}`;
}
