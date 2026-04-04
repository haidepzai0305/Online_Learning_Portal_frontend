import axiosInstance from "./axiosInstance";

const LOGIN_PATH = import.meta.env.VITE_AUTH_LOGIN_PATH ?? "/auth/login/";
const REGISTER_PATH = import.meta.env.VITE_AUTH_REGISTER_PATH ?? "/auth/register/";
const ME_PATH = import.meta.env.VITE_AUTH_ME_PATH ?? "/auth/me/";

export type UserRole = "student" | "professor";

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  password2: string;
  role: UserRole;
  full_name: string;
}

export interface LoginResponse {
  access?: string;
  access_token?: string;
  refresh?: string;
  token?: string;
  token_type?: string;
  role?: string;
  full_name?: string;
  username?: string;
  email?: string;
  user?: {
    role?: string;
    full_name?: string;
    username?: string;
    email?: string;
  };
}

export interface CurrentUserResponse {
  role?: string;
  full_name?: string;
  username?: string;
  email?: string;
}

export async function loginRequest(email: string, password: string) {
  const res = await axiosInstance.post<LoginResponse>(LOGIN_PATH, { email, password });
  return res.data;
}

export async function registerRequest(data: RegisterPayload) {
  const res = await axiosInstance.post(REGISTER_PATH, data);
  return res.data;
}

export async function fetchCurrentUser() {
  const res = await axiosInstance.get<CurrentUserResponse>(ME_PATH);
  return res.data;
}

export function getAccessToken(payload: LoginResponse) {
  return payload.access ?? payload.access_token ?? payload.token ?? "";
}

export function getUserRole(payload: LoginResponse, me?: CurrentUserResponse) {
  return me?.role ?? payload.role ?? payload.user?.role ?? "student";
}

export function getUserDisplayName(payload: LoginResponse, fallbackEmail: string, me?: CurrentUserResponse) {
  return (
    me?.full_name ??
    me?.username ??
    payload.full_name ??
    payload.user?.full_name ??
    payload.username ??
    payload.user?.username ??
    fallbackEmail
  );
}
