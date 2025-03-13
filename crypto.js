export async function AES256(password) {
  const buffer = await crypto.subtle.digest(
    'SHA-256', password
  );

  return await crypto.subtle.importKey(
    'raw', buffer, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']
  );
}
