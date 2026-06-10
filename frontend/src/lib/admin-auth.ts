const KEY = "pawfect_admin_auth";
export const ADMIN_EMAIL = "meera.joshi@pawfectmatch.in";
export const ADMIN_PASSWORD = "DoggyTreats123";

export function isAdminAuthed(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(KEY) === "1";
}
export function setAdminAuthed(v: boolean) {
  if (typeof window === "undefined") return;
  if (v) sessionStorage.setItem(KEY, "1");
  else sessionStorage.removeItem(KEY);
}
