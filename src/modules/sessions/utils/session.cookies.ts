import { cookies } from "next/headers";

import { SESSION_COOKIE_NAME } from "./session.constants";

export async function getSessionCookie() {
  return (await cookies()).get(SESSION_COOKIE_NAME)?.value ?? null;
}

export async function clearSessionCookie() {
  (await cookies()).delete(SESSION_COOKIE_NAME);
}