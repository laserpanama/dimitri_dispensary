export function ensureValidBaseUrl(raw: string | undefined, name = 'BASE_URL'): string {
  if (!raw) throw new Error(${name} no está definido);
  const withScheme = raw.match(/^https?:\/\//) ? raw : http://;
  try {
    const u = new URL(withScheme);
    return u.href.endsWith('/') ? u.href : u.href + '/';
  } catch (err) {
    throw new Error(${name} inválido: );
  }
}
