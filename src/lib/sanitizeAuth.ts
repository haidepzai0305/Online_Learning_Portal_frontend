/**
 * Payloads actually consumed by the auth API. Extra UI-only fields must not be sent.
 */

export type SanitizedLoginPayload = {
  email: string;
  password: string;
};

export type SanitizedRegisterPayload = {
  email: string;
  username: string;
  password: string;
};

export function buildSanitizedLoginPayload(email: string, password: string): SanitizedLoginPayload {
  return {
    email: email.trim(),
    password,
  };
}

export function buildSanitizedRegisterPayload(input: {
  email: string;
  username: string;
  password: string;
}): SanitizedRegisterPayload {
  return {
    email: input.email.trim(),
    username: input.username.trim(),
    password: input.password,
  };
}
