/** Browser-side password hashing (PBKDF2-SHA-256 via WebCrypto). Plain-text passwords are never stored.
 *  NOTE: sign-in is still a front-end placeholder; real authentication needs a server (e.g. Auth.js) that hashes with argon2/bcrypt. */
const ITER = 150_000;
const b64 = (b: ArrayBuffer | Uint8Array) => btoa(String.fromCharCode(...new Uint8Array(b instanceof Uint8Array ? b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) : b)));
const unb64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

async function derive(password: string, salt: Uint8Array) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  return crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: salt as BufferSource, iterations: ITER }, key, 256);
}
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return `${b64(salt)}:${b64(await derive(password, salt))}`;
}
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [s, h] = stored.split(":");
  if (!s || !h) return false;
  const got = b64(await derive(password, unb64(s)));
  // constant-time compare
  let diff = got.length ^ h.length;
  for (let i = 0; i < Math.max(got.length, h.length); i++) diff |= (got.charCodeAt(i) || 0) ^ (h.charCodeAt(i) || 0);
  return diff === 0;
}
