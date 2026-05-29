/**
 * Parses a JWT token to get its payload without an external library.
 */
export function parseJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

/**
 * Returns the expiration time in milliseconds.
 */
export function getTokenExpiration(token: string): number | null {
  const payload = parseJwt(token);
  if (!payload || !payload.exp) return null;
  return payload.exp * 1000; // JWT exp is in seconds
}
